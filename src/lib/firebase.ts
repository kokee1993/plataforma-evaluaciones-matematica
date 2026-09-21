import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  push,
  onValue,
  off,
  Database,
  onDisconnect,
} from 'firebase/database';
import {
  ClassroomDatabaseState,
  SessionData,
  Student,
  StudentMemberDetail,
  FeedEvent,
  Question,
  FirebaseConfigOptions,
  ParticipantType,
  CurriculumConfig,
  GradebookCourseRecord,
  GradebookEntry,
  TestFormVariant,
} from '../types';
import { PRESET_QUIZZES } from '../data/presetQuizzes';
import { audioAlert } from './audio';
import {
  bufferAnswerLocally,
  markAnswerAsSynced,
  getUnsyncedAnswers,
  getAllBufferedAnswers,
} from './offlineAnswersDb';

const STORAGE_KEY_CONFIG = 'mat_firebase_config';
const STORAGE_KEY_LOCAL_DB = 'mat_classroom_local_db_v2';
const BROADCAST_CHANNEL_NAME = 'mat_classroom_broadcast_v2';

// Default initial state
export const DEFAULT_INITIAL_STATE: ClassroomDatabaseState = {
  session: {
    pin: 'MAT-904',
    adminKey: 'jorge19931D',
    mode: 'teacher_paced',
    activeQuestion: 0,
    status: 'paused',
    isLobbyLocked: true,
    roomLockedReason: 'Sala cerrada por el profesor. El acceso está restringido hasta que el docente abra la sala.',
    title: PRESET_QUIZZES[0].title,
    gradeLevel: PRESET_QUIZZES[0].grade,
    quizData: PRESET_QUIZZES[0].questions,
    showAnswers: false,
    updatedAt: Date.now(),
    kickedStudents: {},
  },
  students: {},
  feed: {},
};

// Default Cloud Credentials for Firebase Realtime Database
const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfigOptions = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || 'AIzaSyCDM-k3d9EnFr8w6P-W1g64tFn-v169F-g',
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || 'evaluacion-estudiantes-204a3.firebaseapp.com',
  databaseURL: metaEnv.VITE_FIREBASE_DATABASE_URL || 'https://evaluacion-estudiantes-204a3-default-rtdb.firebaseio.com',
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || 'evaluacion-estudiantes-204a3',
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || 'evaluacion-estudiantes-204a3.firebasestorage.app',
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '724603229990',
  appId: metaEnv.VITE_FIREBASE_APP_ID || '1:724603229990:web:2b8513c6a53629d088d3e7',
};

const STORAGE_KEY_OFFLINE_QUEUE = 'mat_offline_action_queue';

interface QueuedAction {
  id: string;
  action: string;
  payload: any;
  timestamp: number;
}

class RealtimeClassroomService {
  private app: FirebaseApp | null = null;
  private db: Database | null = null;
  private isFirebaseConnected: boolean = false;
  private broadcastChannel: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;
  private localState: ClassroomDatabaseState = DEFAULT_INITIAL_STATE;
  private listeners: Set<(state: ClassroomDatabaseState) => void> = new Set();
  private firebaseUnsubscribes: Array<() => void> = [];

  // Resilient connection & offline persistence state
  private isSseConnected: boolean = false;
  private actionQueue: QueuedAction[] = [];
  private isFlushingQueue: boolean = false;
  private connectionListeners: Set<(info: { isOnline: boolean; isConnected: boolean; pendingCount: number }) => void> = new Set();

  constructor() {
    this.actionQueue = this.loadOfflineQueue();
    this.initBroadcastChannel();
    this.loadInitialLocalState();
    this.initServerSync();
    this.initFirebaseFromStorage();
    this.initNetworkListeners();
  }

  private loadOfflineQueue(): QueuedAction[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_OFFLINE_QUEUE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }

  private saveOfflineQueue() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_OFFLINE_QUEUE, JSON.stringify(this.actionQueue));
    } catch {}
  }

  private initNetworkListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.notifyConnectionListeners();
      this.flushOfflineActionQueue();
      this.syncBufferedAnswers();
    });

    window.addEventListener('offline', () => {
      this.notifyConnectionListeners();
    });

    // Periodic check to flush pending actions and IndexedDB buffered answers every 4 seconds
    setInterval(() => {
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        if (this.actionQueue.length > 0) {
          this.flushOfflineActionQueue();
        }
        this.syncBufferedAnswers();
      }
    }, 4000);
  }

  private initServerSync() {
    if (typeof window === 'undefined') return;

    // Initial fast fetch from backend server
    fetch('/api/classroom/state')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Server state fetch failed');
      })
      .then((state) => {
        if (state && state.session && state.session.quizData) {
          const myStudentId = typeof window !== 'undefined' ? localStorage.getItem('mat_participant_id') : null;
          let mergedStudents = { ...state.students };
          if (myStudentId && this.localState.students?.[myStudentId] && !mergedStudents[myStudentId]) {
            mergedStudents[myStudentId] = this.localState.students[myStudentId];
            this.dispatchServerAction('register_participant', this.localState.students[myStudentId]);
          }

          this.localState = {
            ...state,
            students: mergedStudents,
          };
          this.saveLocalState(false);
          this.notifyListeners();
        }
      })
      .catch((err) => {
        // Fallback silently if offline or server loading
      });

    // Realtime Server-Sent Events (SSE) stream for cross-device sync
    try {
      this.eventSource = new EventSource('/api/classroom/stream');
      this.eventSource.onopen = () => {
        this.isSseConnected = true;
        this.notifyConnectionListeners();
        this.flushOfflineActionQueue();
      };
      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.type === 'STATE_UPDATE' && data.state) {
            // Self-healing check: If the student exists locally but is missing from server state
            // (for instance after a server cold-boot or network drop), preserve local student & re-announce
            const myStudentId = typeof window !== 'undefined' ? localStorage.getItem('mat_participant_id') : null;
            let mergedStudents = { ...data.state.students };
            if (myStudentId && this.localState.students?.[myStudentId] && !mergedStudents[myStudentId]) {
              mergedStudents[myStudentId] = this.localState.students[myStudentId];
              this.dispatchServerAction('register_participant', this.localState.students[myStudentId]);
            }

            this.localState = {
              ...data.state,
              students: mergedStudents,
            };
            this.saveLocalState(false);
            this.notifyListeners();
          }
        } catch (e) {
          console.warn('SSE parse error:', e);
        }
      };
      this.eventSource.onerror = () => {
        this.isSseConnected = false;
        this.notifyConnectionListeners();
      };
    } catch (err) {
      console.warn('SSE not initialized:', err);
    }

    // Cross-tab synchronization via storage events
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY_LOCAL_DB && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (parsed.session) {
            this.localState = parsed;
            this.notifyListeners();
          }
        } catch {}
      }
    });
  }

  public getPendingQueueCount(): number {
    return this.actionQueue.length;
  }

  public subscribeConnectionStatus(callback: (info: { isOnline: boolean; isConnected: boolean; pendingCount: number }) => void) {
    this.connectionListeners.add(callback);
    callback({
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      isConnected: this.isSseConnected,
      pendingCount: this.actionQueue.length,
    });
    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  private notifyConnectionListeners() {
    const info = {
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      isConnected: this.isSseConnected,
      pendingCount: this.actionQueue.length,
    };
    this.connectionListeners.forEach((cb) => {
      try {
        cb(info);
      } catch {}
    });
  }

  public async flushOfflineActionQueue(): Promise<void> {
    if (this.isFlushingQueue || this.actionQueue.length === 0 || (typeof navigator !== 'undefined' && !navigator.onLine)) return;
    this.isFlushingQueue = true;

    try {
      const batch = [...this.actionQueue];
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch('/api/classroom/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actions: batch }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        // Keep any actions that arrived while flushing, drop the sent ones
        const sentIds = new Set(batch.map((b) => b.id));
        this.actionQueue = this.actionQueue.filter((item) => !sentIds.has(item.id));
        this.saveOfflineQueue();
        this.notifyConnectionListeners();
      }
    } catch (err) {
      console.warn('Could not flush action queue, will retry on next cycle:', err);
    } finally {
      this.isFlushingQueue = false;
    }
  }

  private async dispatchServerAction(action: string, payload: any) {
    if (typeof window === 'undefined') return;

    const actionItem: QueuedAction = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      payload,
      timestamp: Date.now(),
    };

    if (!navigator.onLine) {
      this.actionQueue.push(actionItem);
      this.saveOfflineQueue();
      this.notifyConnectionListeners();
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch('/api/classroom/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (e) {
      console.warn('Server action post failed, enqueued for offline synchronization:', action, e);
      this.actionQueue.push(actionItem);
      this.saveOfflineQueue();
      this.notifyConnectionListeners();
    }
  }

  private initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type === 'STATE_UPDATE') {
            this.localState = event.data.state;
            this.notifyListeners();
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported in this environment', err);
      }
    }
  }

  private loadInitialLocalState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOCAL_DB);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.session && parsed.session.quizData) {
          this.localState = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading local state from localStorage', e);
    }
    this.localState = { ...DEFAULT_INITIAL_STATE };
    this.saveLocalState();
  }

  private saveLocalState(postBroadcast: boolean = true) {
    try {
      localStorage.setItem(STORAGE_KEY_LOCAL_DB, JSON.stringify(this.localState));
      if (postBroadcast && this.broadcastChannel) {
        this.broadcastChannel.postMessage({
          type: 'STATE_UPDATE',
          state: this.localState,
        });
      }
    } catch (e) {
      console.warn('Error saving local state', e);
    }
  }

  public initFirebase(config: FirebaseConfigOptions): boolean {
    try {
      if (!config.databaseURL) {
        return false;
      }

      // Cleanup existing listeners
      this.firebaseUnsubscribes.forEach((unsub) => unsub());
      this.firebaseUnsubscribes = [];

      const apps = getApps();
      if (apps.length > 0) {
        this.app = getApp();
      } else {
        this.app = initializeApp({
          apiKey: config.apiKey || DEFAULT_FIREBASE_CONFIG.apiKey || 'AIzaSyDemoPlaceholderKeyForRealtimeDB',
          authDomain: config.authDomain || DEFAULT_FIREBASE_CONFIG.authDomain || 'classroom-edtech.firebaseapp.com',
          databaseURL: config.databaseURL,
          projectId: config.projectId || DEFAULT_FIREBASE_CONFIG.projectId || 'classroom-edtech',
          appId: config.appId || DEFAULT_FIREBASE_CONFIG.appId || '1:123456789:web:abcdef',
        });
      }

      this.db = getDatabase(this.app);
      this.isFirebaseConnected = true;

      // Subscribe to session, students, feed, gradebook
      const sessionRef = ref(this.db, 'session');
      const studentsRef = ref(this.db, 'students');
      const feedRef = ref(this.db, 'feed');
      const gradebookRef = ref(this.db, 'gradebook');

      // Initialize database if empty
      get(sessionRef).then((snapshot) => {
        if (!snapshot.exists()) {
          set(sessionRef, this.localState.session);
        }
      }).catch((e) => console.warn('Firebase init read warning:', e));

      // Synchronize gradebook from cloud
      get(gradebookRef).then((snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (val) {
            const cloudRecords: GradebookCourseRecord[] = Object.values(val);
            const local = this.getGradebookRecords();
            const map = new Map<string, GradebookCourseRecord>();
            local.forEach((r) => map.set(r.id, r));
            cloudRecords.forEach((r) => {
              if (!map.has(r.id) || (r.timestamp && r.timestamp >= (map.get(r.id)?.timestamp || 0))) {
                map.set(r.id, r);
              }
            });
            const sorted = Array.from(map.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            localStorage.setItem('edumath_gradebook_records_v1', JSON.stringify(sorted.slice(0, 100)));
          }
        } else {
          // If cloud gradebook is empty, upload any existing local records
          const local = this.getGradebookRecords();
          if (local.length > 0 && this.db) {
            const gradebookObj: Record<string, GradebookCourseRecord> = {};
            local.forEach((r) => { gradebookObj[r.id] = r; });
            set(gradebookRef, gradebookObj).catch(() => {});
          }
        }
      }).catch((e) => console.warn('Firebase gradebook sync warning:', e));

      const unsubSession = onValue(sessionRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          this.localState.session = {
            ...val,
            quizData: val.quizData || [],
          };
          this.saveLocalState();
          this.notifyListeners();
        }
      });

      const unsubStudents = onValue(studentsRef, (snapshot) => {
        const val = snapshot.val() || {};
        this.localState.students = val;
        this.saveLocalState();
        this.notifyListeners();
      });

      const unsubFeed = onValue(feedRef, (snapshot) => {
        const val = snapshot.val() || {};
        this.localState.feed = val;
        this.saveLocalState();
        this.notifyListeners();
      });

      const unsubGradebook = onValue(gradebookRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          const cloudRecords: GradebookCourseRecord[] = Object.values(val);
          const local = this.getGradebookRecords();
          const map = new Map<string, GradebookCourseRecord>();
          local.forEach((r) => map.set(r.id, r));
          cloudRecords.forEach((r) => {
            if (!map.has(r.id) || (r.timestamp && r.timestamp >= (map.get(r.id)?.timestamp || 0))) {
              map.set(r.id, r);
            }
          });
          const sorted = Array.from(map.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          localStorage.setItem('edumath_gradebook_records_v1', JSON.stringify(sorted.slice(0, 100)));
        }
      });

      this.firebaseUnsubscribes.push(
        () => off(sessionRef),
        () => off(studentsRef),
        () => off(feedRef),
        () => off(gradebookRef)
      );

      if (typeof window !== 'undefined') {
        localStorage.removeItem('mat_firebase_explicitly_disconnected');
      }

      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
      return true;
    } catch (err) {
      console.warn('Firebase initialization error:', err);
      this.isFirebaseConnected = false;
      return false;
    }
  }

  private initFirebaseFromStorage() {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        if (config.databaseURL) {
          this.initFirebase(config);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not parse stored Firebase config', e);
    }

    // Auto-connect with default project credentials if not explicitly disconnected
    const wasExplicitlyDisconnected = typeof window !== 'undefined'
      ? localStorage.getItem('mat_firebase_explicitly_disconnected') === 'true'
      : false;

    if (!wasExplicitlyDisconnected && DEFAULT_FIREBASE_CONFIG.databaseURL) {
      this.initFirebase(DEFAULT_FIREBASE_CONFIG);
    }
  }

  public getSavedConfig(): FirebaseConfigOptions | null {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (savedConfig) return JSON.parse(savedConfig);
      const wasDisconnected = typeof window !== 'undefined'
        ? localStorage.getItem('mat_firebase_explicitly_disconnected') === 'true'
        : false;
      if (!wasDisconnected) return DEFAULT_FIREBASE_CONFIG;
      return null;
    } catch {
      return null;
    }
  }

  public disconnectFirebase(): void {
    try {
      this.firebaseUnsubscribes.forEach((unsub) => {
        try {
          unsub();
        } catch {}
      });
      this.firebaseUnsubscribes = [];
      this.db = null;
      this.app = null;
      this.isFirebaseConnected = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY_CONFIG);
        localStorage.setItem('mat_firebase_explicitly_disconnected', 'true');
      }
      this.notifyListeners();
    } catch (e) {
      console.warn('Error disconnecting Firebase:', e);
    }
  }

  public isConnectedToCloud(): boolean {
    return this.isFirebaseConnected && this.db !== null;
  }

  public isInternalServerActive(): boolean {
    return this.isSseConnected;
  }

  public subscribe(callback: (state: ClassroomDatabaseState) => void): () => void {
    this.listeners.add(callback);
    callback(this.localState);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.localState);
      } catch (err) {
        console.error('Error notifying listener:', err);
      }
    });
  }

  // --- Session Control Actions ---

  public async updateSession(partial: Partial<SessionData>): Promise<void> {
    this.localState.session = {
      ...this.localState.session,
      ...partial,
      updatedAt: Date.now(),
    };
    this.saveLocalState();
    this.notifyListeners();
    this.dispatchServerAction('update_session', partial);

    if (this.db) {
      try {
        const sessionRef = ref(this.db, 'session');
        await update(sessionRef, {
          ...partial,
          updatedAt: Date.now(),
        });
      } catch (err) {
        console.warn('Firebase session update error:', err);
      }
    }
  }

  public async setActiveQuestion(index: number): Promise<void> {
    await this.updateSession({
      activeQuestion: index,
      showAnswers: false,
    });
  }

  public async setSessionMode(mode: 'teacher_paced' | 'autonomous'): Promise<void> {
    await this.updateSession({ mode });
  }

  public async toggleShowAnswers(): Promise<void> {
    await this.updateSession({
      showAnswers: !this.localState.session.showAnswers,
    });
  }

  public async setSessionStatus(status: 'active' | 'finished' | 'paused', reason?: string): Promise<void> {
    const isLobbyLocked = status === 'paused';
    await this.updateSession({
      status,
      isLobbyLocked,
      roomLockedReason: isLobbyLocked
        ? reason || 'Sala cerrada por el profesor. El acceso está restringido.'
        : undefined,
    });
  }

  public async setLobbyLocked(isLobbyLocked: boolean, reason?: string): Promise<void> {
    await this.updateSession({
      isLobbyLocked,
      status: isLobbyLocked ? 'paused' : 'active',
      roomLockedReason: isLobbyLocked
        ? reason || 'Sala cerrada por el profesor. Solo el docente puede abrirla.'
        : undefined,
    });
  }

  public async setLobbyStatus(lobbyStatus: 'waiting' | 'in_game' | 'finished'): Promise<void> {
    const updatedSession: SessionData = {
      ...this.localState.session,
      lobbyStatus,
      updatedAt: Date.now(),
    };

    this.localState.session = updatedSession;
    this.saveLocalState();
    this.notifyListeners();
    this.dispatchServerAction('set_lobby_status', { lobbyStatus });

    await this.pushFeedEvent({
      student: 'Docente',
      type: 'info',
      detail:
        lobbyStatus === 'waiting'
          ? 'Sala de Espera habilitada. Los estudiantes pueden ingresar a la sala.'
          : lobbyStatus === 'in_game'
          ? '🚀 ¡Evaluación iniciada! Los estudiantes han ingresado a los ejercicios.'
          : 'Evaluación finalizada.',
      timestamp: Date.now(),
    });

    if (this.db) {
      try {
        const sessionRef = ref(this.db, 'session/lobbyStatus');
        await set(sessionRef, lobbyStatus);
      } catch (err) {
        console.warn('Firebase setLobbyStatus error:', err);
      }
    }
  }

  public async updateStudentEmail(studentId: string, email: string): Promise<void> {
    const student = this.localState.students[studentId];
    if (!student) return;

    const updatedStudent: Student = {
      ...student,
      email: email.trim(),
      lastActive: Date.now(),
    };

    this.localState.students = {
      ...this.localState.students,
      [studentId]: updatedStudent,
    };
    this.saveLocalState();
    this.notifyListeners();
    this.dispatchServerAction('update_student_email', { studentId, email });
    this.saveLocalState();
    this.notifyListeners();

    if (this.db) {
      try {
        const emailRef = ref(this.db, `students/${studentId}/email`);
        await set(emailRef, email.trim());
      } catch (err) {
        console.warn('Firebase updateStudentEmail error:', err);
      }
    }
  }

  public archiveCurrentSession(): void {
    const currentStudents = Object.values(this.localState.students || {});
    if (currentStudents.length === 0) return;

    const quizData = this.localState.session.quizData || [];
    const maxScore = quizData.reduce((acc, q, idx) => acc + (q.points || (idx >= 10 ? 4 : 2)), 0) || 36;

    const studentRecords = currentStudents.map((s) => {
      let earnedPoints = 0;
      quizData.forEach((q, idx) => {
        const qPoints = q.points || (idx >= 10 ? 4 : 2);
        if (s.answers?.[idx]?.isCorrect) {
          earnedPoints += qPoints;
        }
      });

      // Grade calculation
      const safeScore = Math.max(0, Math.min(earnedPoints, maxScore));
      const cutoff = maxScore * 0.6;
      let gradeNum = 1.0;
      if (safeScore < cutoff) {
        gradeNum = 1.0 + 3.0 * (safeScore / cutoff);
      } else {
        const surplus = safeScore - cutoff;
        const remaining = maxScore - cutoff;
        gradeNum = remaining > 0 ? 4.0 + 3.0 * (surplus / remaining) : 7.0;
      }
      const gradeNumFinal = Math.round(gradeNum * 10) / 10;

      const entry: GradebookEntry = {
        studentId: s.id || `std-${Math.random()}`,
        participantName: s.name,
        type: s.type || 'individual',
        course: s.course,
        courseKey: s.courseKey,
        gradeLevel: s.gradeLevel,
        section: s.section,
        firstName: s.firstName,
        paternalLastName: s.paternalLastName,
        maternalLastName: s.maternalLastName,
        listNumber: s.listNumber,
        members: s.members,
        membersDetails: s.membersDetails,
        correct: s.correct || 0,
        errors: s.errors || 0,
        totalQuestions: quizData.length,
        score: earnedPoints,
        notebookPhotosCount: Object.keys(s.notebookPhotos || {}).length,
        grade: gradeNumFinal,
        passed: gradeNumFinal >= 4.0,
        timestamp: s.lastActive || Date.now(),
        testVariant: s.testVariant,
      };
      return entry;
    });

    const averageGrade =
      studentRecords.reduce((sum, r) => sum + r.grade, 0) /
      (studentRecords.length || 1);

    // Group or default course
    const dominantCourse = currentStudents.find(s => s.course)?.course || this.localState.session.gradeLevel || '1° Medio';
    const dominantCourseKey = currentStudents.find(s => s.courseKey)?.courseKey || (this.localState.session.gradeLevel || '1_medio').toLowerCase().replace(/\s+/g, '_');

    const record: GradebookCourseRecord = {
      id: `session-arch-${Date.now()}-${this.localState.session.pin}`,
      courseKey: dominantCourseKey,
      courseName: dominantCourse,
      activityTitle: this.localState.session.title || 'Evaluación Formativa',
      date: new Date().toLocaleDateString('es-CL'),
      timestamp: Date.now(),
      totalParticipants: currentStudents.length,
      averageGrade: Math.round(averageGrade * 10) / 10,
      entries: studentRecords,
    };

    this.saveGradebookRecord(record);
    this.dispatchServerAction('archive_session_to_gradebook', {});
  }

  public async resetActiveRound(archiveToHistory = true): Promise<void> {
    if (archiveToHistory) {
      this.archiveCurrentSession();
    }

    const resetStudents: Record<string, Student> = {};
    Object.entries(this.localState.students || {}).forEach(([id, student]) => {
      resetStudents[id] = {
        ...student,
        currentQ: 0,
        correct: 0,
        errors: 0,
        tabEscapes: 0,
        isOutOfTab: false,
        outOfTabTimestamp: null,
        totalSecondsAway: 0,
        copyAttempts: 0,
        lastAction: 'Ronda reiniciada por docente',
        answers: {},
      };
    });

    const updatedSession: SessionData = {
      ...this.localState.session,
      activeQuestion: 0,
      showAnswers: false,
      status: 'active',
      lobbyStatus: 'in_game',
      updatedAt: Date.now(),
      kickedStudents: {},
    };

    this.localState.session = updatedSession;
    this.localState.students = resetStudents;
    this.saveLocalState();
    this.notifyListeners();
    this.dispatchServerAction('reset_active_round', { archiveToHistory });

    await this.pushFeedEvent({
      student: 'Docente',
      type: 'quiz_reset',
      detail: archiveToHistory
        ? 'Ronda reiniciada. Las notas fueron guardadas en el Historial del Libro de Clases.'
        : 'Ronda de preguntas reiniciada.',
      timestamp: Date.now(),
    });

    if (this.db) {
      try {
        const sessionRef = ref(this.db, 'session');
        const studentsRef = ref(this.db, 'students');
        await set(sessionRef, updatedSession);
        await set(studentsRef, resetStudents);
      } catch (err) {
        console.warn('Firebase resetActiveRound error:', err);
      }
    }
  }

  public async startNewRoomSession(newPin: string): Promise<void> {
    // Archive previous
    this.archiveCurrentSession();

    const cleanPin = newPin.trim().toUpperCase() || `MAT-${Math.floor(100 + Math.random() * 900)}`;

    const updatedSession: SessionData = {
      ...this.localState.session,
      pin: cleanPin,
      activeQuestion: 0,
      showAnswers: false,
      status: 'paused',
      isLobbyLocked: true,
      roomLockedReason: 'Sala creada en modo cerrado. Solo el docente puede abrirla desde el panel de control.',
      lobbyStatus: 'waiting',
      updatedAt: Date.now(),
      kickedStudents: {},
    };

    this.localState.session = updatedSession;
    this.localState.students = {};
    this.localState.feed = {};
    this.saveLocalState();
    this.notifyListeners();
    this.dispatchServerAction('start_new_room', { pin: cleanPin });

    await this.pushFeedEvent({
      student: 'Docente',
      type: 'quiz_reset',
      detail: `Nueva Sala creada con PIN ${cleanPin}. Estado: Sala de Espera Activa.`,
      timestamp: Date.now(),
    });

    if (this.db) {
      try {
        const sessionRef = ref(this.db, 'session');
        const studentsRef = ref(this.db, 'students');
        const feedRef = ref(this.db, 'feed');
        await set(sessionRef, updatedSession);
        await set(studentsRef, {});
        await set(feedRef, {});
      } catch (err) {
        console.warn('Firebase startNewRoomSession error:', err);
      }
    }
  }

  public async resetSessionData(): Promise<void> {
    return this.resetActiveRound(true);
  }

  // --- Dynamic Content Manager (Publish New Quiz) ---

  public async publishQuiz(
    newQuestions: Question[],
    title?: string,
    gradeLevel?: string
  ): Promise<void> {
    const sanitizedQuestions = newQuestions.map((q, idx) => ({
      id: q.id || `q-${idx + 1}`,
      text: q.text,
      options: q.options || [],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      explanation: q.explanation || '',
      hint: q.hint || '',
      image: q.image || '',
      svg: q.svg || '',
      topic: q.topic || 'Matemáticas',
      grade: q.grade || gradeLevel || '8° Básico a 4° Medio',
    }));

    const resetStudents: Record<string, Student> = {};
    Object.entries(this.localState.students || {}).forEach(([id, student]) => {
      resetStudents[id] = {
        ...student,
        currentQ: 0,
        correct: 0,
        errors: 0,
        tabEscapes: 0,
        isOutOfTab: false,
        outOfTabTimestamp: null,
        totalSecondsAway: 0,
        copyAttempts: 0,
        lastAction: 'Nueva materia cargada',
        answers: {},
      };
    });

    const updatedSession: SessionData = {
      ...this.localState.session,
      quizData: sanitizedQuestions,
      activeQuestion: 0,
      showAnswers: false,
      title: title || this.localState.session.title || 'Nueva Materia',
      gradeLevel: gradeLevel || this.localState.session.gradeLevel || 'Matemáticas',
      status: 'active',
      updatedAt: Date.now(),
    };

    this.localState.session = updatedSession;
    this.localState.students = resetStudents;
    this.saveLocalState();
    this.notifyListeners();
    this.dispatchServerAction('publish_quiz', { questions: sanitizedQuestions, title: updatedSession.title, gradeLevel: updatedSession.gradeLevel });

    await this.pushFeedEvent({
      student: 'Docente',
      type: 'quiz_reset',
      detail: `Nueva materia publicada: "${updatedSession.title}" (${sanitizedQuestions.length} ejercicios)`,
      timestamp: Date.now(),
    });

    if (this.db) {
      try {
        const sessionRef = ref(this.db, 'session');
        const studentsRef = ref(this.db, 'students');
        await set(sessionRef, updatedSession);
        await set(studentsRef, resetStudents);
      } catch (err) {
        console.warn('Firebase publishQuiz error:', err);
      }
    }
  }

  public async setCurriculumSession(
    curriculum: CurriculumConfig,
    newQuestions: Question[]
  ): Promise<void> {
    const sanitizedQuestions = newQuestions.map((q, idx) => ({
      id: q.id || `q-curr-${idx + 1}`,
      text: q.text,
      options: q.options || [],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      explanation: q.explanation || '',
      hint: q.hint || '',
      image: q.image || '',
      svg: q.svg || '',
      topic: q.topic || `${curriculum.axisName} - ${curriculum.oasSelected.join(', ')}`,
      grade: curriculum.grade || '8° Básico a 4° Medio',
    }));

    const resetStudents: Record<string, Student> = {};
    Object.entries(this.localState.students || {}).forEach(([id, student]) => {
      resetStudents[id] = {
        ...student,
        currentQ: 0,
        correct: 0,
        errors: 0,
        tabEscapes: 0,
        isOutOfTab: false,
        outOfTabTimestamp: null,
        totalSecondsAway: 0,
        copyAttempts: 0,
        lastAction: `Currículum asignado: ${curriculum.grade}`,
        answers: {},
      };
    });

    const updatedSession: SessionData = {
      ...this.localState.session,
      quizData: sanitizedQuestions,
      activeQuestion: 0,
      showAnswers: false,
      title: `${curriculum.axisName} (${curriculum.oasSelected.join(', ')})`,
      gradeLevel: curriculum.grade,
      curriculum: curriculum,
      status: 'active',
      updatedAt: Date.now(),
    };

    this.localState.session = updatedSession;
    this.localState.students = resetStudents;
    this.saveLocalState();
    this.notifyListeners();
    this.dispatchServerAction('set_curriculum', { curriculum, questions: sanitizedQuestions, pin: updatedSession.pin });

    await this.pushFeedEvent({
      student: 'Docente',
      type: 'quiz_reset',
      detail: `Currículum MINEDUC activado: ${curriculum.grade} > ${curriculum.axisName} [${curriculum.oasSelected.join(', ')}] (${sanitizedQuestions.length} ejercicios)`,
      timestamp: Date.now(),
    });

    if (this.db) {
      try {
        const sessionRef = ref(this.db, 'session');
        const studentsRef = ref(this.db, 'students');
        await set(sessionRef, updatedSession);
        await set(studentsRef, resetStudents);
      } catch (err) {
        console.warn('Firebase setCurriculumSession error:', err);
      }
    }
  }

  // --- Student & Group Registration / Update ---

  public async registerOrUpdateParticipant(participantData: {
    id: string;
    type: ParticipantType;
    name: string;
    firstName?: string;
    paternalLastName?: string;
    maternalLastName?: string;
    listNumber?: number;
    gradeLevel?: string;
    section?: string;
    course?: string;
    courseKey?: string;
    groupNumber?: number | string | null;
    members?: string[];
    membersDetails?: StudentMemberDetail[];
    device?: string;
    testVariant?: TestFormVariant;
  }): Promise<void> {
    const {
      id,
      type,
      name,
      firstName,
      paternalLastName,
      maternalLastName,
      listNumber,
      gradeLevel,
      section,
      course,
      courseKey,
      groupNumber,
      members,
      membersDetails,
      device,
      testVariant,
    } = participantData;
    const existing = this.localState.students[id];

    // Recover any answers previously recorded in localStorage for this student
    let localDiskAnswers: Record<string, any> = {};
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(`mat_local_answers_${id}`);
        if (raw) localDiskAnswers = JSON.parse(raw);
      } catch {}
    }

    const consolidatedAnswers = {
      ...localDiskAnswers,
      ...(existing?.answers || {}),
    };

    let calculatedCorrect = 0;
    let calculatedErrors = 0;
    Object.values(consolidatedAnswers).forEach((ans: any) => {
      if (ans && ans.isCorrect) calculatedCorrect++;
      else if (ans) calculatedErrors++;
    });

    // Check if student has a persistent lock flag stored on disk or in existing record
    const isLockedOnDisk = typeof window !== 'undefined'
      ? localStorage.getItem(`mat_security_locked_${id}`) === 'true'
      : false;
    const lockReasonOnDisk = typeof window !== 'undefined'
      ? localStorage.getItem(`mat_security_reason_${id}`)
      : null;

    const isSecurityLocked = Boolean(existing?.isSecurityLocked || isLockedOnDisk);
    const isOutOfTab = Boolean(existing?.isOutOfTab || isLockedOnDisk);
    const securityLockReason = existing?.securityLockReason || (isSecurityLocked ? (lockReasonOnDisk || 'Salida de pestaña o minimización detectada') : null);
    const securityLockTimestamp = existing?.securityLockTimestamp || (isSecurityLocked ? Date.now() : null);

    const updatedStudent: Student = {
      id,
      type: type || 'individual',
      name: name.trim(),
      firstName: firstName ?? existing?.firstName,
      paternalLastName: paternalLastName ?? existing?.paternalLastName,
      maternalLastName: maternalLastName ?? existing?.maternalLastName,
      listNumber: listNumber ?? existing?.listNumber,
      gradeLevel: gradeLevel ?? existing?.gradeLevel,
      section: section ?? existing?.section,
      course: course ?? existing?.course,
      courseKey: courseKey ?? existing?.courseKey,
      groupNumber: groupNumber ?? (existing?.groupNumber || null),
      members: members || existing?.members || (type === 'individual' ? [name.trim()] : []),
      membersDetails: membersDetails || existing?.membersDetails,
      testVariant: testVariant ?? existing?.testVariant,
      currentQ: existing?.currentQ || 0,
      correct: Math.max(existing?.correct || 0, calculatedCorrect),
      errors: Math.max(existing?.errors || 0, calculatedErrors),
      tabEscapes: existing?.tabEscapes || 0,
      isOutOfTab,
      outOfTabTimestamp: existing?.outOfTabTimestamp ?? (isOutOfTab ? Date.now() : null),
      totalSecondsAway: existing?.totalSecondsAway || 0,
      copyAttempts: existing?.copyAttempts || 0,
      isSecurityLocked,
      securityLockReason,
      securityLockTimestamp,
      securityViolationReason: existing?.securityViolationReason ?? null,
      lastAction: isSecurityLocked
        ? `🔒 Evaluación bloqueada (${securityLockReason || 'Seguridad'})`
        : (type === 'group'
          ? `Equipo conectado (${members?.length || 2} integrantes${course ? ` - ${course}` : ''})`
          : `Conectado${course ? ` (${course})` : ''}`),
      answers: consolidatedAnswers,
      joinedAt: existing?.joinedAt || Date.now(),
      lastActive: Date.now(),
      device: device || (type === 'group' ? 'Tablet/Móvil Grupal' : 'Móvil'),
    };

    if (this.localState.session.kickedStudents && this.localState.session.kickedStudents[id]) {
      const updatedKicked = { ...this.localState.session.kickedStudents };
      delete updatedKicked[id];
      this.localState.session = {
        ...this.localState.session,
        kickedStudents: updatedKicked,
      };
    }

    this.localState.students = {
      ...this.localState.students,
      [id]: updatedStudent,
    };
    this.saveLocalState();
    this.notifyListeners();
    this.dispatchServerAction('register_participant', updatedStudent);

    if (!existing) {
      const courseTag = course ? ` [${course}]` : '';
      const joinDetail =
        type === 'group'
          ? `Equipo "${name}"${courseTag} se unió con ${members?.length || 2} integrantes: ${members?.join(', ')}`
          : `Se unió a la sala de matemáticas${courseTag}`;

      await this.pushFeedEvent({
        student: name,
        studentId: id,
        type: 'join',
        detail: joinDetail,
        timestamp: Date.now(),
      });
    }

    if (this.db) {
      try {
        const studentRef = ref(this.db, `students/${id}`);
        await update(studentRef, updatedStudent);

        const isOutOfTabRef = ref(this.db, `students/${id}/isOutOfTab`);
        onDisconnect(isOutOfTabRef).set(true);
      } catch (err) {
        console.warn('Firebase register participant error:', err);
      }
    }
  }

  // Alias for backward compatibility
  public async registerOrUpdateStudent(studentId: string, name: string, device?: string): Promise<void> {
    return this.registerOrUpdateParticipant({
      id: studentId,
      type: 'individual',
      name,
      device,
    });
  }

  public checkGroupExists(groupIdentifier: string | number): boolean {
    const term = String(groupIdentifier).trim().toLowerCase();
    return Object.values(this.localState.students || {}).some(
      (s) =>
        s.type === 'group' &&
        (String(s.groupNumber).trim().toLowerCase() === term ||
          s.name.trim().toLowerCase() === term)
    );
  }

  // --- Answer Submission ---

  public async submitAnswer(
    studentId: string,
    questionIndex: number,
    selectedOption: number,
    isCorrect: boolean
  ): Promise<void> {
    let currentStudent = this.localState.students[studentId];
    if (!currentStudent) {
      // Fallback: recover or initialize student to prevent dropped answer
      currentStudent = {
        id: studentId,
        name: localStorage.getItem('mat_participant_name') || 'Estudiante',
        currentQ: questionIndex,
        correct: 0,
        errors: 0,
        tabEscapes: 0,
        isOutOfTab: false,
        lastAction: 'Respondiendo',
        answers: {},
      };
    }

    const previousAnswer = currentStudent.answers[questionIndex];
    let correctDelta = 0;
    let errorDelta = 0;

    if (previousAnswer) {
      if (previousAnswer.isCorrect !== isCorrect) {
        if (isCorrect) {
          correctDelta = 1;
          errorDelta = -1;
        } else {
          correctDelta = -1;
          errorDelta = 1;
        }
      }
    } else {
      if (isCorrect) correctDelta = 1;
      else errorDelta = 1;
    }

    const updatedStudent: Student = {
      ...currentStudent,
      correct: Math.max(0, currentStudent.correct + correctDelta),
      errors: Math.max(0, currentStudent.errors + errorDelta),
      currentQ: Math.max(currentStudent.currentQ, questionIndex + 1),
      lastAction: isCorrect ? `Respondió P${questionIndex + 1} ✓` : `Respondió P${questionIndex + 1} ✗`,
      lastActive: Date.now(),
      answers: {
        ...currentStudent.answers,
        [questionIndex]: {
          selected: selectedOption,
          option: selectedOption,
          isCorrect,
          timestamp: Date.now(),
        },
      },
    };

    this.localState.students = {
      ...this.localState.students,
      [studentId]: updatedStudent,
    };
    this.saveLocalState();
    this.notifyListeners();
    this.dispatchServerAction('submit_answer', {
      studentId,
      questionIndex,
      optionIndex: selectedOption,
      isCorrect,
    });

    // Feed event
    const letter = ['A', 'B', 'C', 'D', 'E'][selectedOption] || `${selectedOption + 1}`;
    await this.pushFeedEvent({
      student: currentStudent.name,
      studentId,
      type: isCorrect ? 'correct' : 'error',
      detail: isCorrect
        ? `Acertó la Pregunta ${questionIndex + 1} (Opción ${letter})`
        : `Marcó Opción ${letter} en Pregunta ${questionIndex + 1}`,
      timestamp: Date.now(),
    });

    if (this.db) {
      try {
        const studentRef = ref(this.db, `students/${studentId}`);
        await update(studentRef, updatedStudent);
      } catch (err) {
        console.warn('Firebase submitAnswer error:', err);
      }
    }

    // Buffer to IndexedDB and mark synced
    try {
      await bufferAnswerLocally(studentId, questionIndex, selectedOption, isCorrect);
      await markAnswerAsSynced(studentId, questionIndex);
    } catch {}
  }

  // Periodic synchronization of offline-buffered answers
  public async syncBufferedAnswers(): Promise<void> {
    try {
      const unsynced = await getUnsyncedAnswers();
      if (!unsynced || unsynced.length === 0) return;

      for (const item of unsynced) {
        await this.submitAnswer(item.participantId, item.questionIndex, item.selectedOption, item.isCorrect);
        await markAnswerAsSynced(item.participantId, item.questionIndex);
      }
    } catch (e) {
      console.warn('syncBufferedAnswers error:', e);
    }
  }

  // High-frequency 5s client-side heartbeat
  public async recordHeartbeat(studentId: string): Promise<void> {
    const student = this.localState.students[studentId];
    const now = Date.now();
    if (student) {
      this.localState.students[studentId] = {
        ...student,
        connected: true,
        lastActive: now,
        last_active: now,
        isDisconnectedSuspicious: false,
      };
      this.saveLocalState();
    }

    this.dispatchServerAction('heartbeat', {
      studentId,
      timestamp: now,
    });

    if (this.db) {
      try {
        const studentRef = ref(this.db, `students/${studentId}`);
        await update(studentRef, {
          lastActive: now,
          last_active: now,
          isDisconnectedSuspicious: false,
        });
      } catch {}
    }
  }

  // Report Security Alert (Split-Screen, Tab key abuse, DevTools shortcut, Context Menu, Fullscreen exit)
  public async reportSecurityAlert(
    studentId: string,
    alertType:
      | 'fullscreen_exit'
      | 'split_screen'
      | 'tab_attempt'
      | 'shortcut_attempt'
      | 'right_click'
      | 'copy_attempt'
      | 'screenshot_attempt'
      | 'devtools_open'
      | 'second_monitor'
      | 'print_attempt'
      | 'pip_attempt',
    detail: string
  ): Promise<void> {
    const student = this.localState.students[studentId];
    if (!student) return;

    const splitScreenAttempts = (student.splitScreenAttempts || 0) + (alertType === 'split_screen' ? 1 : 0);
    const tabAttempts = (student.tabAttempts || 0) + (alertType === 'tab_attempt' ? 1 : 0);
    const copyAttempts = (student.copyAttempts || 0) + (alertType === 'copy_attempt' || alertType === 'right_click' ? 1 : 0);
    const screenshotAttempts = (student.screenshotAttempts || 0) + (alertType === 'screenshot_attempt' || alertType === 'print_attempt' ? 1 : 0);
    const devtoolsAttempts = (student.devtoolsAttempts || 0) + (alertType === 'devtools_open' ? 1 : 0);
    const secondMonitorAttempts = (student.secondMonitorAttempts || 0) + (alertType === 'second_monitor' ? 1 : 0);

    const updatedStudent: Student = {
      ...student,
      splitScreenAttempts,
      tabAttempts,
      copyAttempts,
      screenshotAttempts,
      devtoolsAttempts,
      secondMonitorAttempts,
      isSplitScreen: alertType === 'split_screen',
      isSecurityLocked: true,
      securityLockReason: detail,
      securityLockTimestamp: Date.now(),
      securityViolationReason: detail,
      lastAction: `🚨 ${detail}`,
      lastActive: Date.now(),
    };

    this.localState.students = {
      ...this.localState.students,
      [studentId]: updatedStudent,
    };
    this.saveLocalState();
    this.notifyListeners();
    this.dispatchServerAction('record_security_alert', {
      studentId,
      alertType,
      detail,
    });

    audioAlert.playCopyAlert();

    await this.pushFeedEvent({
      student: student.name,
      studentId,
      type: 'cheat_alert' as any,
      detail: `🚨 ${detail}`,
      timestamp: Date.now(),
    });

    if (this.db) {
      try {
        const studentRef = ref(this.db, `students/${studentId}`);
        await update(studentRef, {
          splitScreenAttempts,
          tabAttempts,
          copyAttempts,
          screenshotAttempts,
          devtoolsAttempts,
          secondMonitorAttempts,
          isSecurityLocked: true,
          securityLockReason: detail,
          securityLockTimestamp: Date.now(),
          securityViolationReason: detail,
          lastAction: updatedStudent.lastAction,
          lastActive: updatedStudent.lastActive,
        });
      } catch (err) {
        console.warn('Firebase reportSecurityAlert error:', err);
      }
    }
  }

  // Teacher unlocks a locked student
  public async unlockStudentSecurity(studentId: string): Promise<void> {
    const student = this.localState.students[studentId];
    if (!student) return;

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`mat_security_locked_${studentId}`);
        localStorage.removeItem(`mat_security_reason_${studentId}`);
        localStorage.removeItem(`mat_security_lock_time_${studentId}`);
      } catch {}
    }

    const updatedStudent: Student = {
      ...student,
      isSecurityLocked: false,
      isOutOfTab: false,
      securityLockReason: null,
      securityViolationReason: null,
      outOfTabTimestamp: null,
      lastAction: 'Prueba desbloqueada por docente 🔓',
      lastActive: Date.now(),
    };

    this.localState.students = {
      ...this.localState.students,
      [studentId]: updatedStudent,
    };
    this.saveLocalState();
    this.notifyListeners();
    this.dispatchServerAction('unlock_student_security', { studentId });

    await this.pushFeedEvent({
      student: student.name,
      studentId,
      type: 'security_unlock' as any,
      detail: `🔓 El docente desbloqueó la prueba de ${student.name}`,
      timestamp: Date.now(),
    });

    if (this.db) {
      try {
        const studentRef = ref(this.db, `students/${studentId}`);
        await update(studentRef, {
          isSecurityLocked: false,
          isOutOfTab: false,
          securityLockReason: null,
          securityViolationReason: null,
          outOfTabTimestamp: null,
          lastAction: updatedStudent.lastAction,
          lastActive: updatedStudent.lastActive,
        });
      } catch (err) {
        console.warn('Firebase unlockStudentSecurity error:', err);
      }
    }
  }

  // Teacher unlocks all locked students at once
  public async unlockAllStudentsSecurity(): Promise<void> {
    if (typeof window !== 'undefined') {
      try {
        const myId = localStorage.getItem('mat_participant_id');
        if (myId) {
          localStorage.removeItem(`mat_security_locked_${myId}`);
          localStorage.removeItem(`mat_security_reason_${myId}`);
          localStorage.removeItem(`mat_security_lock_time_${myId}`);
        }
      } catch {}
    }

    const updatedStudents: Record<string, Student> = {};
    Object.entries(this.localState.students || {}).forEach(([id, st]) => {
      updatedStudents[id] = {
        ...st,
        isSecurityLocked: false,
        isOutOfTab: false,
        securityLockReason: null,
        securityViolationReason: null,
        lastActive: Date.now(),
      };
    });

    this.localState.students = updatedStudents;
    this.saveLocalState();
    this.notifyListeners();
    this.dispatchServerAction('unlock_all_students', {});

    await this.pushFeedEvent({
      student: 'Docente',
      type: 'security_unlock' as any,
      detail: `🔓 El docente desbloqueó a todos los estudiantes`,
      timestamp: Date.now(),
    });
  }

  public async allowStudentReentry(studentId: string): Promise<void> {
    if (this.localState.session.kickedStudents && this.localState.session.kickedStudents[studentId]) {
      const updated = { ...this.localState.session.kickedStudents };
      delete updated[studentId];
      this.localState.session = {
        ...this.localState.session,
        kickedStudents: updated,
      };
      this.saveLocalState();
      this.notifyListeners();
      this.dispatchServerAction('allow_student_reentry', { studentId });

      if (this.db) {
        try {
          const kickedRef = ref(this.db, `session/kickedStudents/${studentId}`);
          await set(kickedRef, null);
        } catch {}
      }
    }
  }

  // --- Anti-Cheat / Focus Monitoring & Copy Protection ---

  public async setStudentFocusState(
    studentId: string,
    isOutOfTab: boolean,
    outOfTabTimestamp: number | null = null,
    awaySecondsToAdd: number = 0,
    customReason?: string
  ): Promise<void> {
    const student = this.localState.students[studentId];
    if (!student) return;

    const isAlreadyOutOfTab = Boolean(student.isOutOfTab);
    const isNewEscape = isOutOfTab && !isAlreadyOutOfTab;
    const newTabEscapes = isNewEscape ? (student.tabEscapes || 0) + 1 : (student.tabEscapes || 0);
    const newTotalSeconds = (student.totalSecondsAway || 0) + Math.max(0, awaySecondsToAdd);
    const updatedTimestamp = isOutOfTab ? (outOfTabTimestamp || Date.now()) : null;

    const isGroup = student.type === 'group';
    const isSecurityLocked = isOutOfTab ? true : student.isSecurityLocked;
    const securityLockReason = customReason || (isOutOfTab ? 'Salida de pestaña o minimización detectada' : student.securityLockReason);
    const securityLockTimestamp = isOutOfTab ? Date.now() : student.securityLockTimestamp;

    // Persist local flag on disk for immediate client reload survival
    if (isOutOfTab && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`mat_security_locked_${studentId}`, 'true');
        if (securityLockReason) {
          localStorage.setItem(`mat_security_reason_${studentId}`, securityLockReason);
        }
        localStorage.setItem(`mat_security_lock_time_${studentId}`, String(Date.now()));
      } catch {}
    }

    const updatedStudent: Student = {
      ...student,
      isOutOfTab,
      isSecurityLocked,
      securityLockReason,
      securityLockTimestamp,
      tabEscapes: newTabEscapes,
      outOfTabTimestamp: updatedTimestamp,
      totalSecondsAway: newTotalSeconds,
      lastAction: isOutOfTab
        ? `🚨 ${isGroup ? 'El equipo salió' : 'Salió'} de la app (#${newTabEscapes})`
        : (isSecurityLocked ? '🔒 Bloqueado por seguridad' : `↩️ Regresó tras ${awaySecondsToAdd}s`),
      lastActive: Date.now(),
    };

    this.localState.students = {
      ...this.localState.students,
      [studentId]: updatedStudent,
    };
    this.saveLocalState();
    this.notifyListeners();
    this.dispatchServerAction('focus_change', {
      studentId,
      isOutOfTab,
      outOfTabTimestamp: updatedTimestamp,
      awaySecondsToAdd,
      reason: securityLockReason,
    });

    // Play dissuasive sound on teacher projector only when a new escape is triggered
    if (isNewEscape) {
      audioAlert.playEscapeAlert();
    } else if (!isOutOfTab && isAlreadyOutOfTab && awaySecondsToAdd > 0) {
      audioAlert.playReturnChime();
    }

    if (isNewEscape) {
      await this.pushFeedEvent({
        student: student.name,
        studentId,
        type: 'escape',
        detail: `🚨 ¡${isGroup ? 'El equipo ' + student.name : student.name} salió de la pantalla! (Escape #${newTabEscapes}). Evaluación bloqueada.`,
        timestamp: Date.now(),
      });
    } else if (!isOutOfTab && isAlreadyOutOfTab) {
      await this.pushFeedEvent({
        student: student.name,
        studentId,
        type: 'return',
        detail: `↩️ ${student.name} regresó a la pantalla tras ${awaySecondsToAdd}s fuera.`,
        timestamp: Date.now(),
      });
    }

    if (this.db) {
      try {
        const studentRef = ref(this.db, `students/${studentId}`);
        await update(studentRef, {
          isOutOfTab,
          isSecurityLocked,
          securityLockReason,
          securityLockTimestamp,
          tabEscapes: newTabEscapes,
          outOfTabTimestamp: updatedTimestamp,
          totalSecondsAway: newTotalSeconds,
          lastAction: updatedStudent.lastAction,
          lastActive: updatedStudent.lastActive,
        });
      } catch (err) {
        console.warn('Firebase setStudentFocusState error:', err);
      }
    }
  }

  public async reportCopyAttempt(studentId: string, questionIndex: number): Promise<void> {
    const student = this.localState.students[studentId];
    if (!student) return;

    const newAttempts = (student.copyAttempts || 0) + 1;
    const updatedStudent: Student = {
      ...student,
      copyAttempts: newAttempts,
      lastAction: `📋 Intento de copia (P${questionIndex + 1})`,
      lastActive: Date.now(),
    };

    this.localState.students = {
      ...this.localState.students,
      [studentId]: updatedStudent,
    };
    this.saveLocalState();
    this.notifyListeners();

    audioAlert.playCopyAlert();

    await this.pushFeedEvent({
      student: student.name,
      studentId,
      type: 'copy_attempt',
      detail: `📋 Intentó copiar el texto de la Pregunta ${questionIndex + 1}.`,
      timestamp: Date.now(),
    });

    if (this.db) {
      try {
        const studentRef = ref(this.db, `students/${studentId}`);
        await update(studentRef, {
          copyAttempts: newAttempts,
          lastAction: updatedStudent.lastAction,
          lastActive: updatedStudent.lastActive,
        });
      } catch (err) {
        console.warn('Firebase reportCopyAttempt error:', err);
      }
    }
  }

  // --- Student Moderation & Kick System ---

  public async kickStudent(studentId: string): Promise<void> {
    const student = this.localState.students[studentId];
    const studentName = student?.name || 'Participante';

    const newStudents = { ...this.localState.students };
    delete newStudents[studentId];

    const updatedKicked = {
      ...(this.localState.session.kickedStudents || {}),
      [studentId]: Date.now(),
    };

    this.localState.session = {
      ...this.localState.session,
      kickedStudents: updatedKicked,
    };
    this.localState.students = newStudents;
    this.saveLocalState();
    this.notifyListeners();
    this.dispatchServerAction('kick_student', { studentId });

    await this.pushFeedEvent({
      student: studentName,
      studentId,
      type: 'kick',
      detail: `🚫 Fue expulsado de la sala por el docente.`,
      timestamp: Date.now(),
    });

    if (this.db) {
      try {
        const studentRef = ref(this.db, `students/${studentId}`);
        const kickedRef = ref(this.db, `session/kickedStudents/${studentId}`);
        await set(studentRef, null);
        await set(kickedRef, Date.now());
      } catch (err) {
        console.warn('Firebase kickStudent error:', err);
      }
    }
  }

  public async kickAllStudents(): Promise<void> {
    const studentCount = Object.keys(this.localState.students || {}).length;
    const now = Date.now();

    this.localState.students = {};
    this.localState.session = {
      ...this.localState.session,
      kickedStudents: {},
      lastRoomCleanedAt: now,
      updatedAt: now,
    };

    this.saveLocalState();
    this.notifyListeners();
    this.dispatchServerAction('kick_all_students', {});

    await this.pushFeedEvent({
      student: 'Docente',
      type: 'kick',
      detail: `🧹 Limpieza general de sala: Se desconectaron ${studentCount} participantes para permitir reingreso ordenado.`,
      timestamp: now,
    });

    if (this.db) {
      try {
        const studentsRef = ref(this.db, 'students');
        const kickedRef = ref(this.db, 'session/kickedStudents');
        const cleanedRef = ref(this.db, 'session/lastRoomCleanedAt');
        await set(studentsRef, null);
        await set(kickedRef, null);
        await set(cleanedRef, now);
      } catch (err) {
        console.warn('Firebase kickAllStudents error:', err);
      }
    }
  }

  // --- Notebook Evidence Photography & Validation ---

  public async uploadNotebookPhoto(
    studentId: string,
    exerciseId: string | number,
    photoDataUrl: string,
    note?: string,
    exerciseTitle?: string
  ): Promise<void> {
    const student = this.localState.students[studentId];
    if (!student) return;

    const existingPhotos = student.notebookPhotos || {};
    const updatedPhotos = {
      ...existingPhotos,
      [exerciseId]: {
        exerciseId,
        exerciseTitle: exerciseTitle || `Desafío ${Number(exerciseId) + 1}`,
        photoUrl: photoDataUrl,
        timestamp: Date.now(),
        studentName: student.name,
        note: note || '',
      },
    };

    const updatedStudent: Student = {
      ...student,
      notebookPhotos: updatedPhotos,
      lastAction: `📸 Subió foto del cuaderno (${exerciseTitle || `Desafío ${Number(exerciseId) + 1}`})`,
      lastActive: Date.now(),
    };

    this.localState.students = {
      ...this.localState.students,
      [studentId]: updatedStudent,
    };
    this.saveLocalState();
    this.notifyListeners();

    await this.pushFeedEvent({
      student: student.name,
      studentId,
      type: 'photo_upload',
      detail: `📸 Adjuntó evidencia fotográfica de su cuaderno para ${exerciseTitle || `Desafío ${Number(exerciseId) + 1}`}`,
      timestamp: Date.now(),
    });

    if (this.db) {
      try {
        const photoRef = ref(this.db, `students/${studentId}/notebookPhotos/${exerciseId}`);
        await set(photoRef, updatedPhotos[exerciseId]);
        const lastActionRef = ref(this.db, `students/${studentId}/lastAction`);
        await set(lastActionRef, updatedStudent.lastAction);
      } catch (err) {
        console.warn('Firebase uploadNotebookPhoto error:', err);
      }
    }
  }

  public async gradeNotebookPhoto(
    studentId: string,
    exerciseId: string | number,
    status: 'approved' | 'starred' | 'needs_review',
    comment?: string
  ): Promise<void> {
    const student = this.localState.students[studentId];
    if (!student || !student.notebookPhotos?.[exerciseId]) return;

    const photo = student.notebookPhotos[exerciseId];
    const updatedPhoto = {
      ...photo,
      feedback: {
        status,
        comment: comment || '',
        teacherTimestamp: Date.now(),
      },
    };

    const updatedPhotos = {
      ...student.notebookPhotos,
      [exerciseId]: updatedPhoto,
    };

    const statusLabel =
      status === 'starred'
        ? '⭐ Destacado con honores'
        : status === 'approved'
        ? '✓ Aprobado'
        : '⚠️ Requiere revisión';

    const updatedStudent: Student = {
      ...student,
      notebookPhotos: updatedPhotos,
      lastAction: `Revisión docente: ${statusLabel}`,
      lastActive: Date.now(),
    };

    this.localState.students = {
      ...this.localState.students,
      [studentId]: updatedStudent,
    };
    this.saveLocalState();
    this.notifyListeners();

    await this.pushFeedEvent({
      student: student.name,
      studentId,
      type: 'photo_grade',
      detail: `Docente revisó evidencia de ${photo.exerciseTitle || `Desafío ${Number(exerciseId) + 1}`}: ${statusLabel}`,
      timestamp: Date.now(),
    });

    if (this.db) {
      try {
        const photoRef = ref(this.db, `students/${studentId}/notebookPhotos/${exerciseId}`);
        await set(photoRef, updatedPhoto);
      } catch (err) {
        console.warn('Firebase gradeNotebookPhoto error:', err);
      }
    }
  }

  public async submitGroupConsensus(
    studentId: string,
    text: string
  ): Promise<void> {
    const student = this.localState.students[studentId];
    if (!student) return;

    const updatedStudent: Student = {
      ...student,
      groupConsensusAnswer: {
        text,
        submittedAt: Date.now(),
        approved: true,
      },
      lastAction: '🤝 Envió síntesis de consenso grupal',
      lastActive: Date.now(),
    };

    this.localState.students = {
      ...this.localState.students,
      [studentId]: updatedStudent,
    };
    this.saveLocalState();
    this.notifyListeners();

    await this.pushFeedEvent({
      student: student.name,
      studentId,
      type: 'consensus_submit',
      detail: `🤝 Equipo "${student.name}" envió su conclusión de consenso grupal.`,
      timestamp: Date.now(),
    });

    if (this.db) {
      try {
        const consensusRef = ref(this.db, `students/${studentId}/groupConsensusAnswer`);
        await set(consensusRef, updatedStudent.groupConsensusAnswer);
      } catch (err) {
        console.warn('Firebase submitGroupConsensus error:', err);
      }
    }
  }

  // --- Gradebook History Storage (Libro de Calificaciones) ---

  public getGradebookRecords(): GradebookCourseRecord[] {
    try {
      const saved = localStorage.getItem('edumath_gradebook_records_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading gradebook records', e);
    }
    return [];
  }

  public async fetchGradebookRecords(): Promise<GradebookCourseRecord[]> {
    try {
      // 1. If Firebase Cloud is connected, query cloud records first (Netlify & Serverless friendly)
      if (this.db) {
        try {
          const snapshot = await get(ref(this.db, 'gradebook'));
          if (snapshot.exists()) {
            const val = snapshot.val();
            if (val) {
              const cloudRecords: GradebookCourseRecord[] = Object.values(val);
              const local = this.getGradebookRecords();
              const mergedMap = new Map<string, GradebookCourseRecord>();
              local.forEach((r) => mergedMap.set(r.id, r));
              cloudRecords.forEach((r) => {
                if (!mergedMap.has(r.id) || (r.timestamp && r.timestamp >= (mergedMap.get(r.id)?.timestamp || 0))) {
                  mergedMap.set(r.id, r);
                }
              });
              const mergedList = Array.from(mergedMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
              localStorage.setItem('edumath_gradebook_records_v1', JSON.stringify(mergedList.slice(0, 100)));
              return mergedList;
            }
          }
        } catch (fbErr) {
          console.warn('Firebase gradebook fetch error:', fbErr);
        }
      }

      // 2. Otherwise try local Node backend API
      const res = await fetch('/api/classroom/gradebook');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.records)) {
          const local = this.getGradebookRecords();
          const mergedMap = new Map<string, GradebookCourseRecord>();
          data.records.forEach((r: GradebookCourseRecord) => mergedMap.set(r.id, r));
          local.forEach((r) => {
            if (!mergedMap.has(r.id) || (r.timestamp && r.timestamp > (mergedMap.get(r.id)?.timestamp || 0))) {
              mergedMap.set(r.id, r);
            }
          });
          const mergedList = Array.from(mergedMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          localStorage.setItem('edumath_gradebook_records_v1', JSON.stringify(mergedList.slice(0, 100)));
          return mergedList;
        }
      }
    } catch (err) {
      console.warn('Could not fetch server gradebook records, returning local:', err);
    }
    return this.getGradebookRecords();
  }

  public saveGradebookRecord(record: GradebookCourseRecord): void {
    try {
      const records = this.getGradebookRecords();
      const filtered = records.filter((r) => r.id !== record.id);
      filtered.unshift(record);
      localStorage.setItem('edumath_gradebook_records_v1', JSON.stringify(filtered.slice(0, 100)));

      // Auto-sync in background to Firebase Cloud Realtime Database (100% free serverless storage)
      if (this.db) {
        try {
          const recordRef = ref(this.db, `gradebook/${record.id}`);
          set(recordRef, record).catch((err) => console.warn('Firebase gradebook set error:', err));
        } catch (err) {
          console.warn('Firebase gradebook sync warning:', err);
        }
      }

      // Auto-sync in background to server disk storage if server is running
      fetch('/api/classroom/gradebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record }),
      }).catch((e) => console.warn('Background server gradebook sync failed:', e));
    } catch (e) {
      console.warn('Error saving gradebook record', e);
    }
  }

  public deleteGradebookRecord(id: string): void {
    try {
      const records = this.getGradebookRecords();
      const updated = records.filter((r) => r.id !== id);
      localStorage.setItem('edumath_gradebook_records_v1', JSON.stringify(updated));

      // Remove from Firebase Cloud Realtime Database
      if (this.db) {
        try {
          const recordRef = ref(this.db, `gradebook/${id}`);
          set(recordRef, null).catch((err) => console.warn('Firebase gradebook delete error:', err));
        } catch (err) {
          console.warn('Firebase gradebook delete warning:', err);
        }
      }

      fetch(`/api/classroom/gradebook/${id}`, {
        method: 'DELETE',
      }).catch((e) => console.warn('Background server gradebook deletion failed:', e));
    } catch (e) {
      console.warn('Error deleting gradebook record', e);
    }
  }

  public async purgeGradebookRecords(
    adminPasscode: string,
    purgeType: 'older_than_30_days' | 'course' | 'all',
    courseKey?: string
  ): Promise<{ success: boolean; purgedCount?: number; remainingCount?: number; error?: string }> {
    try {
      const res = await fetch('/api/classroom/gradebook/purge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPasscode, purgeType, courseKey }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Also sync local storage
        if (purgeType === 'all') {
          localStorage.removeItem('edumath_gradebook_records_v1');
        } else if (purgeType === 'older_than_30_days') {
          const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
          const current = this.getGradebookRecords().filter((r) => (r.timestamp || 0) >= thirtyDaysAgo);
          localStorage.setItem('edumath_gradebook_records_v1', JSON.stringify(current));
        } else if (purgeType === 'course' && courseKey) {
          const current = this.getGradebookRecords().filter((r) => r.courseKey !== courseKey);
          localStorage.setItem('edumath_gradebook_records_v1', JSON.stringify(current));
        }
        return data;
      }
      return { success: false, error: data.error || 'Error en depuración de registros' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error de conexión con el servidor' };
    }
  }

  public async generateGradebookSnapshot(options?: {
    recordId?: string;
    pin?: string;
  }): Promise<{ success: boolean; previewUrl?: string; downloadUrl?: string; error?: string }> {
    try {
      const res = await fetch('/api/classroom/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options || {}),
      });
      const data = await res.json();
      if (res.ok) {
        return data;
      }
      return { success: false, error: data.error || 'Error al generar reporte' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al conectar con el servidor' };
    }
  }

  public async sendGradebookEmailReport(options: {
    email?: string;
    recordId?: string;
    pin?: string;
  }): Promise<{ success: boolean; mode?: string; message?: string; previewUrl?: string; error?: string }> {
    return this.generateGradebookSnapshot(options);
  }

  public async finalizeEvaluation(): Promise<{ success: boolean; message?: string }> {
    this.dispatchServerAction('finalize_evaluation', {});
    return { success: true, message: 'Evaluación finalizada y guardada en el Libro de Clases.' };
  }

  public async finalizeEvaluationAndSendReport(email?: string): Promise<{ success: boolean; message?: string }> {
    return this.finalizeEvaluation();
  }

  public async finalizeStudentEvaluation(data: {
    studentId: string;
    name: string;
    firstName?: string;
    paternalLastName?: string;
    maternalLastName?: string;
    listNumber?: number;
    course?: string;
    courseKey?: string;
    gradeLevel?: string;
    section?: string;
    testVariant?: TestFormVariant;
    grade: number;
    score: number;
    correct: number;
    errors: number;
    totalQuestions: number;
    answers: Record<number, any>;
    notebookPhotosCount?: number;
    timestamp?: number;
  }): Promise<void> {
    // 1. Dispatch action to server for disk persistence
    await this.dispatchServerAction('finalize_student_evaluation', data);

    // 2. Also record locally in Gradebook cache immediately for offline protection
    try {
      const rawCourse = data.course || data.gradeLevel || '1° Medio D';
      const is1D = /1.*[dD]|1°.*D|1.*medio.*d/i.test(rawCourse);
      const courseName = is1D ? '1° Medio D' : rawCourse;
      const courseKey = is1D ? '1_medio_D' : (data.courseKey || '1_medio_D').toLowerCase().replace(/\s+/g, '_');
      const activityTitle = this.localState.session.title || 'Evaluación Formativa de Matemática';

      const records = this.getGradebookRecords();
      let record = records.find(
        (r) => (r.courseKey === courseKey || (is1D && r.courseKey.toLowerCase().includes('1_medio_d'))) &&
               r.activityTitle === activityTitle
      );

      if (!record) {
        record = {
          id: `gb-rec-${courseKey}-${Date.now()}`,
          courseKey,
          courseName,
          activityTitle,
          date: new Date().toLocaleDateString('es-CL'),
          timestamp: Date.now(),
          totalParticipants: 0,
          averageGrade: 0,
          entries: [],
        };
        records.unshift(record);
      }

      const entry: GradebookEntry = {
        studentId: data.studentId,
        participantName: data.name,
        type: 'individual',
        course: courseName,
        courseKey,
        gradeLevel: data.gradeLevel || '1° Medio',
        section: data.section || (is1D ? 'D' : 'A'),
        firstName: data.firstName,
        paternalLastName: data.paternalLastName,
        maternalLastName: data.maternalLastName,
        listNumber: data.listNumber,
        testVariant: data.testVariant || 'A',
        correct: data.correct,
        errors: data.errors,
        totalQuestions: data.totalQuestions,
        score: data.score,
        notebookPhotosCount: data.notebookPhotosCount || 0,
        grade: data.grade,
        passed: data.grade >= 4.0,
        timestamp: data.timestamp || Date.now(),
      };

      const existingIdx = record.entries.findIndex((e) => {
        if (entry.listNumber && e.listNumber === entry.listNumber) return true;
        if (entry.studentId && e.studentId === entry.studentId) return true;
        return e.participantName.trim().toLowerCase() === entry.participantName.trim().toLowerCase();
      });

      if (existingIdx >= 0) {
        record.entries[existingIdx] = { ...record.entries[existingIdx], ...entry };
      } else {
        record.entries.push(entry);
      }

      record.totalParticipants = record.entries.length;
      const sumGrades = record.entries.reduce((sum, e) => sum + (e.grade || 0), 0);
      record.averageGrade = Math.round((sumGrades / (record.entries.length || 1)) * 10) / 10;
      record.timestamp = Date.now();

      this.saveGradebookRecord(record);
    } catch (e) {
      console.warn('Could not save local gradebook entry:', e);
    }
  }

  // --- Feed Management ---

  public async pushFeedEvent(event: FeedEvent): Promise<void> {
    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const eventWithId: FeedEvent = {
      ...event,
      id: eventId,
      timestamp: event.timestamp || Date.now(),
    };

    const entries = Object.entries(this.localState.feed || {});
    if (entries.length > 90) {
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      const pruned: Record<string, FeedEvent> = {};
      entries.slice(0, 80).forEach(([k, v]) => (pruned[k] = v));
      this.localState.feed = pruned;
    }

    this.localState.feed = {
      ...this.localState.feed,
      [eventId]: eventWithId,
    };
    this.saveLocalState();
    this.notifyListeners();

    if (this.db) {
      try {
        const feedRef = ref(this.db, 'feed');
        await push(feedRef, eventWithId);
      } catch (err) {
        console.warn('Firebase pushFeedEvent error:', err);
      }
    }
  }

  public async clearFeed(): Promise<void> {
    this.localState.feed = {};
    this.saveLocalState();
    this.notifyListeners();

    if (this.db) {
      try {
        const feedRef = ref(this.db, 'feed');
        await set(feedRef, {});
      } catch (err) {
        console.warn('Firebase clearFeed error:', err);
      }
    }
  }
}

export const realtimeDb = new RealtimeClassroomService();
