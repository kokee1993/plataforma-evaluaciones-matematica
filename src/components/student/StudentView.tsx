import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ClassroomDatabaseState,
  Question,
  Student,
  ParticipantType,
  SCHOOL_LEVELS,
  SCHOOL_SECTIONS,
  StudentMemberDetail,
  TestFormVariant,
  isValidTeacherPassword,
} from '../../types';
import {
  TEST_FORMS_CONFIG,
  getBalancedFormVariant,
} from '../../data/donBoscoHomoteciaQuiz';
import {
  ROSTER_1_MEDIO_D,
  isStudentAlreadyClaimed,
  CourseStudent,
} from '../../data/courseRoster1D';
import { realtimeDb } from '../../lib/firebase';
import { MathText, ExerciseMedia } from '../MathRenderer';
import { InteractiveCartesianPlotter } from './InteractiveCartesianPlotter';
import { Scratchpad } from './Scratchpad';
import { InteractiveLobby } from './InteractiveLobby';
import { StudentReportModal } from './StudentReportModal';
import {
  calculateChileanGrade,
  downloadStudentReportPDF,
  generateEmailReportBody,
} from '../../lib/pdfGenerator';
import {
  Smartphone,
  Edit3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lightbulb,
  HelpCircle,
  Lock,
  Unlock,
  KeyRound,
  ArrowRight,
  ShieldAlert,
  Clock,
  LogOut,
  Trophy,
  Copy,
  Users,
  User,
  Plus,
  Trash2,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  Star,
  Eye,
  X,
  UploadCloud,
  Check,
  MessageSquare,
  Pause,
  FileText,
  Mail,
  GraduationCap,
  School,
  Layers,
  Maximize,
  Minimize,
  FileDown,
  Send,
  ShieldCheck,
  Award,
  Zap,
} from 'lucide-react';

// Notebook photos temporarily disabled per teacher request (set to true to re-enable)
const NOTEBOOK_PHOTOS_ENABLED = false;

const STORAGE_PARTICIPANT_ID = 'mat_participant_id';
const STORAGE_PARTICIPANT_TYPE = 'mat_participant_type';
const STORAGE_PARTICIPANT_NAME = 'mat_participant_name';
const STORAGE_PARTICIPANT_FIRST_NAME = 'mat_participant_first_name';
const STORAGE_PARTICIPANT_PATERNAL = 'mat_participant_paternal';
const STORAGE_PARTICIPANT_MATERNAL = 'mat_participant_maternal';
const STORAGE_PARTICIPANT_LEVEL = 'mat_participant_level';
const STORAGE_PARTICIPANT_SECTION = 'mat_participant_section';
const STORAGE_PARTICIPANT_COURSE = 'mat_participant_course';
const STORAGE_PARTICIPANT_COURSE_KEY = 'mat_participant_course_key';
const STORAGE_PARTICIPANT_MEMBERS = 'mat_participant_members';
const STORAGE_PARTICIPANT_MEMBERS_DETAILS = 'mat_participant_members_details';
const STORAGE_PARTICIPANT_GROUP_NUM = 'mat_participant_group_num';
const STORAGE_PARTICIPANT_EMAIL = 'mat_participant_email';
const STORAGE_PARTICIPANT_VARIANT = 'mat_participant_variant';
const STORAGE_PARTICIPANT_JOINED_AT = 'mat_participant_joined_at';
const STORAGE_ACK_ROOM_CLEANED_AT = 'mat_participant_ack_room_cleaned_at';
const STORAGE_FULLSCREEN_ENFORCED = 'mat_fullscreen_enforced';

function compressImage(file: File, maxWidth = 1024, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsDataURL(file);
  });
}

function formatSeconds(totalSecs: number): string {
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

interface StudentViewProps {
  data: ClassroomDatabaseState;
  initialPin?: string;
  defaultMode?: ParticipantType;
  onGoToPortal?: () => void;
}

export const StudentView: React.FC<StudentViewProps> = ({
  data,
  initialPin,
  defaultMode = 'individual',
  onGoToPortal,
}) => {
  const session = data?.session || {
    pin: initialPin || '---',
    title: 'Evaluación de Matemáticas',
    mode: 'autonomous',
    status: 'active',
    activeQuestion: 0,
    quizData: [],
    lobbyStatus: 'active',
  };

  const students = data?.students || {};

  // Security Toast State (available across all subroutines)
  const [securityToast, setSecurityToast] = useState<string | null>(null);
  const securityToastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerSecurityToast = useCallback((msg: string) => {
    setSecurityToast(msg);
    if (securityToastTimerRef.current) clearTimeout(securityToastTimerRef.current);
    securityToastTimerRef.current = setTimeout(() => setSecurityToast(null), 3500);
  }, []);

  // Fullscreen Management & Enforcement
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    return !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
  });

  const [isFullscreenEnforced, setIsFullscreenEnforced] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_FULLSCREEN_ENFORCED) === 'true';
    } catch {
      return false;
    }
  });

  const enterFullscreen = useCallback(() => {
    try {
      const doc = document as any;
      const docEl = document.documentElement as any;
      if (!document.fullscreenElement && !doc.webkitFullscreenElement) {
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        } else if (docEl.msRequestFullscreen) {
          docEl.msRequestFullscreen();
        }
      }
      setIsFullscreenEnforced(true);
      try {
        localStorage.setItem(STORAGE_FULLSCREEN_ENFORCED, 'true');
      } catch {}
    } catch {}
  }, []);

  const exitFullscreen = useCallback(() => {
    // If fullscreen is enforced and evaluation has started, prevent exiting!
    if (isFullscreenEnforced && (typeof window !== 'undefined' && localStorage.getItem(STORAGE_PARTICIPANT_ID))) {
      triggerSecurityToast('🔒 La pantalla completa es obligatoria durante la evaluación para garantizar la probidad.');
      return;
    }
    try {
      const doc = document as any;
      if (document.fullscreenElement || doc.webkitFullscreenElement) {
        if (doc.exitFullscreen) {
          doc.exitFullscreen().catch(() => {});
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        }
      }
    } catch {}
  }, [isFullscreenEnforced, triggerSecurityToast]);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      if (isFullscreenEnforced && (typeof window !== 'undefined' && localStorage.getItem(STORAGE_PARTICIPANT_ID))) {
        triggerSecurityToast('🔒 La pantalla completa está bloqueada durante la evaluación.');
        enterFullscreen();
      } else {
        exitFullscreen();
      }
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, isFullscreenEnforced, enterFullscreen, exitFullscreen, triggerSecurityToast]);

  useEffect(() => {
    const handleFSChange = () => {
      const fs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(fs);
      if (!fs && isFullscreenEnforced && typeof window !== 'undefined' && localStorage.getItem(STORAGE_PARTICIPANT_ID)) {
        const pId = localStorage.getItem(STORAGE_PARTICIPANT_ID);
        if (pId) {
          realtimeDb.reportSecurityAlert(
            pId,
            'fullscreen_exit',
            'Salida del modo de pantalla completa detectada'
          );
        }
      }
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    document.addEventListener('webkitfullscreenchange', handleFSChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFSChange);
      document.removeEventListener('webkitfullscreenchange', handleFSChange);
    };
  }, [isFullscreenEnforced]);

  // Onboarding wizard steps: 'course' -> 'mode' -> 'details'
  const [onboardingStep, setOnboardingStep] = useState<'course' | 'mode' | 'details'>('course');

  // Course Selector states
  const [selectedLevelKey, setSelectedLevelKey] = useState<string>(() => {
    return localStorage.getItem(STORAGE_PARTICIPANT_LEVEL) || '1_medio';
  });
  const [selectedSection, setSelectedSection] = useState<string>(() => {
    return localStorage.getItem(STORAGE_PARTICIPANT_SECTION) || 'D';
  });

  // Participant Mode: 'individual' | 'group'
  const [participantMode, setParticipantMode] = useState<ParticipantType>(() => {
    return (localStorage.getItem(STORAGE_PARTICIPANT_TYPE) as ParticipantType) || defaultMode;
  });

  // Participant identity states
  const [participantId, setParticipantId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_PARTICIPANT_ID) || '';
  });

  // Individual mode fields (First Name, Paternal Last Name, Maternal Last Name)
  const [firstName, setFirstName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_PARTICIPANT_FIRST_NAME) || '';
  });
  const [paternalLastName, setPaternalLastName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_PARTICIPANT_PATERNAL) || '';
  });
  const [maternalLastName, setMaternalLastName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_PARTICIPANT_MATERNAL) || '';
  });
  const [studentEmail, setStudentEmail] = useState<string>(() => {
    return localStorage.getItem(STORAGE_PARTICIPANT_EMAIL) || '';
  });

  // Nómina oficial 1° Medio D
  const [rosterSearch, setRosterSearch] = useState<string>('');
  const [selectedRosterStudent, setSelectedRosterStudent] = useState<CourseStudent | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedListNum = localStorage.getItem('mat_participant_list_number');
        if (savedListNum) {
          const num = parseInt(savedListNum, 10);
          const found = ROSTER_1_MEDIO_D.find(s => s.listNumber === num);
          if (found) return found;
        }
      } catch {}
    }
    return null;
  });
  const [isManualInputMode, setIsManualInputMode] = useState<boolean>(false);

  // Group mode fields
  const [groupNumber, setGroupNumber] = useState<string>(() => {
    return localStorage.getItem(STORAGE_PARTICIPANT_GROUP_NUM) || 'Grupo 1';
  });
  const [groupMemberDetails, setGroupMemberDetails] = useState<StudentMemberDetail[]>(() => {
    const saved = localStorage.getItem(STORAGE_PARTICIPANT_MEMBERS_DETAILS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      { firstName: '', paternalLastName: '', maternalLastName: '', fullName: '' },
      { firstName: '', paternalLastName: '', maternalLastName: '', fullName: '' },
    ];
  });

  const [groupMemberSearch, setGroupMemberSearch] = useState<Record<number, string>>({});
  const [groupMemberManualMode, setGroupMemberManualMode] = useState<Record<number, boolean>>({});
  const [editingMemberIdx, setEditingMemberIdx] = useState<number | null>(null);

  const [pinInput, setPinInput] = useState<string>(initialPin || '');
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [joinError, setJoinError] = useState<string>('');
  const [kickWarning, setKickWarning] = useState<string>('');

  // Report modal state
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Autonomous question pointer (if mode is autonomous): restored from local storage so reload never resets question
  const [localQuestionIndex, setLocalQuestionIndex] = useState<number>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_PARTICIPANT_ID);
      if (savedId) {
        const savedIdx = localStorage.getItem(`mat_autonomous_q_${savedId}`);
        if (savedIdx !== null) {
          const num = parseInt(savedIdx, 10);
          if (!isNaN(num) && num >= 0) return num;
        }
      }
    } catch {}
    return 0;
  });

  // Live connection & offline outbox sync status
  const [connectionInfo, setConnectionInfo] = useState<{
    isOnline: boolean;
    isConnected: boolean;
    pendingCount: number;
  }>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isConnected: true,
    pendingCount: 0,
  });

  useEffect(() => {
    const unsub = realtimeDb.subscribeConnectionStatus((info) => {
      setConnectionInfo(info);
    });
    return unsub;
  }, []);

  // Persist autonomous question pointer on change
  useEffect(() => {
    if (participantId) {
      try {
        localStorage.setItem(`mat_autonomous_q_${participantId}`, String(localQuestionIndex));
      } catch {}
    }
  }, [localQuestionIndex, participantId]);

  // Scratchpad modal state
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);

  // Copy alert state
  const [showCopyNotice, setShowCopyNotice] = useState<boolean>(false);

  // Student manual evaluation finalization
  const [isEvaluationFinalized, setIsEvaluationFinalized] = useState<boolean>(false);
  const hasAutoFinalizedRef = useRef<boolean>(false);

  // Prevent accidental exits, navigation swipes, back button, and tab closes
  useEffect(() => {
    if (!isJoined || isEvaluationFinalized) return;

    try {
      window.history.pushState({ inEvaluation: true }, '');
    } catch {}

    const handlePopState = () => {
      try {
        window.history.pushState({ inEvaluation: true }, '');
      } catch {}
      setIsLeaveModalOpen(true);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isJoined && !isEvaluationFinalized) {
        e.preventDefault();
        e.returnValue = '¿Seguro que deseas salir? Tu evaluación está en curso y tus respuestas están aseguradas.';
        return e.returnValue;
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isJoined, isEvaluationFinalized]);

  // Final screen email sending state
  const [finalEmailInput, setFinalEmailInput] = useState<string>('');
  const [finalEmailSent, setFinalEmailSent] = useState<boolean>(false);

  // Anti-Cheat / Out of Tab Focus state & Security Lock
  const [isOutOfTab, setIsOutOfTab] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedId = localStorage.getItem(STORAGE_PARTICIPANT_ID);
        if (savedId) {
          return localStorage.getItem(`mat_security_locked_${savedId}`) === 'true';
        }
      } catch {}
    }
    return false;
  });
  const [isSplitScreen, setIsSplitScreen] = useState<boolean>(false);
  const [isSecurityLocked, setIsSecurityLocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedId = localStorage.getItem(STORAGE_PARTICIPANT_ID);
        if (savedId) {
          return localStorage.getItem(`mat_security_locked_${savedId}`) === 'true';
        }
      } catch {}
    }
    return false;
  });
  const [securityLockReason, setSecurityLockReason] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedId = localStorage.getItem(STORAGE_PARTICIPANT_ID);
        if (savedId) {
          return localStorage.getItem(`mat_security_reason_${savedId}`);
        }
      } catch {}
    }
    return null;
  });
  // General pedagogical hint toggle state
  const [showHint, setShowHint] = useState<boolean>(false);

  // =========================================================================
  // SUPERPODER DE PAREJA: RADAR ISOMÉTRICO (Cooldown cada 15 minutos)
  // =========================================================================
  const SUPERPOWER_COOLDOWN_SECONDS = 15 * 60; // 15 minutos
  const [superpowerLastUsed, setSuperpowerLastUsed] = useState<number | null>(() => {
    const saved = localStorage.getItem('mat_superpower_last_used_timestamp');
    return saved ? parseInt(saved, 10) : null;
  });
  const [superpowerCooldownRemaining, setSuperpowerCooldownRemaining] = useState<number>(0);
  const [activatedSuperpowers, setActivatedSuperpowers] = useState<
    Record<number, { eliminated: number[]; strategicHint: string; keyVertex?: string }>
  >(() => {
    const saved = localStorage.getItem('mat_activated_superpowers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {};
  });

  useEffect(() => {
    const checkCooldown = () => {
      if (!superpowerLastUsed) {
        setSuperpowerCooldownRemaining(0);
        return;
      }
      const elapsedSeconds = Math.floor((Date.now() - superpowerLastUsed) / 1000);
      const remaining = Math.max(0, SUPERPOWER_COOLDOWN_SECONDS - elapsedSeconds);
      setSuperpowerCooldownRemaining(remaining);
    };
    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, [superpowerLastUsed]);

  const [teacherUnlockPasscode, setTeacherUnlockPasscode] = useState<string>('');
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockSuccess, setUnlockSuccess] = useState<boolean>(false);

  // Google / Browser Native Dialog Warning State (Filters false positives from password manager & autofill popups)
  const [isBrowserDialogWarning, setIsBrowserDialogWarning] = useState<boolean>(false);
  const lastInputBlurTimestampRef = useRef<number>(0);
  const lastPointerActivityTimestampRef = useRef<number>(Date.now());

  const [awaySeconds, setAwaySeconds] = useState<number>(0);
  const blurTimerRef = useRef<NodeJS.Timeout | null>(null);
  const awayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const awayStartTimestampRef = useRef<number | null>(null);

  // Local answers cache: preserves answers instantly (0ms) and survives reloads
  const [localAnswers, setLocalAnswers] = useState<Record<number, { selected: number; isCorrect: boolean; timestamp: number }>>(() => {
    const saved = localStorage.getItem(`mat_local_answers_${participantId || 'temp'}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {};
  });

  // Re-sync local answers whenever participantId is initialized or updated
  useEffect(() => {
    if (!participantId) return;
    const saved = localStorage.getItem(`mat_local_answers_${participantId}`);
    if (saved) {
      try {
        setLocalAnswers(JSON.parse(saved));
      } catch {}
    }
  }, [participantId]);

  // Notebook Photo Capture State
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [previewPhotoModalUrl, setPreviewPhotoModalUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Group Consensus State
  const [consensusDraft, setConsensusDraft] = useState<string>('');
  const [isSubmittingConsensus, setIsSubmittingConsensus] = useState<boolean>(false);
  const [consensusSuccess, setConsensusSuccess] = useState<boolean>(false);

  // Safe Leave Confirmation Modal State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);

  // Derived Course Info
  const currentLevelInfo = useMemo(() => {
    return SCHOOL_LEVELS.find((l) => l.key === selectedLevelKey) || SCHOOL_LEVELS[2];
  }, [selectedLevelKey]);

  const selectedCourseShort = `${currentLevelInfo.shortLabel}${selectedSection}`; // e.g. "1°D"
  const selectedCourseFull = `${currentLevelInfo.label} ${selectedSection}`; // e.g. "1° Medio D"
  const selectedCourseKey = `${selectedLevelKey}_${selectedSection}`; // e.g. "1_medio_D"

  // Check if student/group was explicitly kicked or room was cleaned by teacher in real-time
  useEffect(() => {
    if (!isJoined || !participantId) return;

    // A participant is kicked if explicitly flagged
    const isExplicitlyKicked = Boolean(
      session.kickedStudents && session.kickedStudents[participantId]
    );

    const ackCleanedAt = Number(localStorage.getItem(STORAGE_ACK_ROOM_CLEANED_AT) || 0);
    const isRoomCleaned = Boolean(
      session.lastRoomCleanedAt && session.lastRoomCleanedAt > ackCleanedAt
    );

    if (isExplicitlyKicked || isRoomCleaned) {
      setIsJoined(false);
      setParticipantId('');
      localStorage.removeItem(STORAGE_PARTICIPANT_ID);
      localStorage.removeItem(STORAGE_PARTICIPANT_TYPE);
      localStorage.removeItem(STORAGE_PARTICIPANT_NAME);
      localStorage.removeItem(STORAGE_PARTICIPANT_FIRST_NAME);
      localStorage.removeItem(STORAGE_PARTICIPANT_PATERNAL);
      localStorage.removeItem(STORAGE_PARTICIPANT_MATERNAL);
      localStorage.removeItem(STORAGE_PARTICIPANT_MEMBERS);
      localStorage.removeItem(STORAGE_PARTICIPANT_MEMBERS_DETAILS);
      localStorage.removeItem(STORAGE_PARTICIPANT_GROUP_NUM);
      localStorage.removeItem(STORAGE_PARTICIPANT_EMAIL);
      localStorage.removeItem(STORAGE_PARTICIPANT_VARIANT);
      localStorage.removeItem(STORAGE_PARTICIPANT_JOINED_AT);

      if (isRoomCleaned && session.lastRoomCleanedAt) {
        localStorage.setItem(STORAGE_ACK_ROOM_CLEANED_AT, String(session.lastRoomCleanedAt));
      }

      setKickWarning(
        isRoomCleaned
          ? '🧹 El profesor realizó una limpieza de la sala para reingreso ordenado. Revisa tus datos y vuelve a ingresar.'
          : '⚠️ Tu conexión fue retirada de la sala por el profesor. Por favor ingresa nuevamente con nombres reales y apropiados.'
      );
    }
  }, [session.kickedStudents, session.lastRoomCleanedAt, isJoined, participantId]);

  // Try auto-join if credentials exist in localStorage and match room PIN
  useEffect(() => {
    const storedId = localStorage.getItem(STORAGE_PARTICIPANT_ID);
    const storedType = (localStorage.getItem(STORAGE_PARTICIPANT_TYPE) as ParticipantType) || 'individual';
    const storedName = localStorage.getItem(STORAGE_PARTICIPANT_NAME);
    const storedCourse = localStorage.getItem(STORAGE_PARTICIPANT_COURSE);

    // If this participant was explicitly kicked by the teacher in this session, do not auto-join
    if (storedId && session.kickedStudents && session.kickedStudents[storedId]) {
      return;
    }

    // If the room was cleaned and not yet acknowledged, do not auto-join
    const ackCleanedAt = Number(localStorage.getItem(STORAGE_ACK_ROOM_CLEANED_AT) || 0);
    if (session.lastRoomCleanedAt && session.lastRoomCleanedAt > ackCleanedAt) {
      return;
    }

    if (storedId && storedName && (!initialPin || initialPin.trim().toUpperCase() === session.pin.trim().toUpperCase())) {
      setParticipantId(storedId);
      setParticipantMode(storedType);
      setIsJoined(true);

      let members: string[] | undefined = undefined;
      let membersDetails: StudentMemberDetail[] | undefined = undefined;
      if (storedType === 'group') {
        try {
          const savedMembers = localStorage.getItem(STORAGE_PARTICIPANT_MEMBERS);
          if (savedMembers) members = JSON.parse(savedMembers);
          const savedDetails = localStorage.getItem(STORAGE_PARTICIPANT_MEMBERS_DETAILS);
          if (savedDetails) membersDetails = JSON.parse(savedDetails);
        } catch {}
      }

      const storedVariant =
        (localStorage.getItem(STORAGE_PARTICIPANT_VARIANT) as TestFormVariant) ||
        getBalancedFormVariant(students, storedId);

      realtimeDb.registerOrUpdateParticipant({
        id: storedId,
        type: storedType,
        name: storedName,
        firstName: localStorage.getItem(STORAGE_PARTICIPANT_FIRST_NAME) || undefined,
        paternalLastName: localStorage.getItem(STORAGE_PARTICIPANT_PATERNAL) || undefined,
        maternalLastName: localStorage.getItem(STORAGE_PARTICIPANT_MATERNAL) || undefined,
        gradeLevel: currentLevelInfo.label,
        section: selectedSection,
        course: storedCourse || selectedCourseShort,
        courseKey: localStorage.getItem(STORAGE_PARTICIPANT_COURSE_KEY) || selectedCourseKey,
        groupNumber: localStorage.getItem(STORAGE_PARTICIPANT_GROUP_NUM) || null,
        members,
        membersDetails,
        testVariant: storedVariant,
        device: storedType === 'group' ? 'Tablet/Móvil Grupal' : 'Móvil',
      });
    }
  }, [
    session.pin,
    initialPin,
  ]);

  // Auto enter fullscreen on active evaluation load
  useEffect(() => {
    if (isJoined) {
      enterFullscreen();
    }
  }, [isJoined, enterFullscreen]);

  // Current question computation based on teacher_paced vs autonomous and Student Assigned Form
  const totalQuestions = session.quizData?.length || 0;
  const activeQIndex =
    session.mode === 'teacher_paced'
      ? session.activeQuestion || 0
      : localQuestionIndex;

  const currentParticipantData = participantId ? students[participantId] : null;
  const studentFormVariant: TestFormVariant = currentParticipantData?.testVariant || 'A';

  // Questions resolved for assigned form variant
  const activeQuestionsList: Question[] = useMemo(() => {
    const list = session.quizData || [];
    return list.map((q) => {
      if (q.variants && q.variants[studentFormVariant]) {
        const v = q.variants[studentFormVariant]!;
        return {
          ...q,
          text: v.text,
          options: v.options,
          correctAnswer: v.correctAnswer,
          svg: v.svg || q.svg,
          image: v.image || q.image,
          explanation: v.explanation || q.explanation,
          hint: v.hint || q.hint,
          interactiveGraph: v.interactiveGraph || q.interactiveGraph,
          superpowerClue: v.superpowerClue || q.superpowerClue,
        };
      }
      return q;
    });
  }, [session.quizData, studentFormVariant]);

  const currentQuestion = activeQuestionsList[activeQIndex] || activeQuestionsList[0];

  // Auto-collapse hint whenever student navigates to another question
  useEffect(() => {
    setShowHint(false);
  }, [activeQIndex]);

  // General conceptual hint for the current question
  const questionHint = useMemo(() => {
    if (currentQuestion?.hint) return currentQuestion.hint;
    const text = (currentQuestion?.text || '').toLowerCase();
    const topic = (currentQuestion?.topic || '').toLowerCase();
    if (text.includes('potencia') || topic.includes('potencia')) {
      return 'Analiza la paridad del exponente (si es par o impar) y el signo del coeficiente para deducir el cuadrante y el comportamiento de la curva.';
    }
    if (text.includes('homotecia') || topic.includes('homotecia')) {
      return 'Recuerda que la razón de homotecia $k = \\frac{\\text{distancia imagen}}{\\text{distancia original}}$. Si $k > 0$ la imagen está al mismo lado del centro; si $k < 0$, está invertida.';
    }
    if (text.includes('perímetro') || text.includes('área')) {
      return 'En figuras homotéticas o semejantes, el perímetro varía según la razón $k$ y el área varía según la razón al cuadrado $k^2$.';
    }
    if (text.includes('pitágoras') || text.includes('triángulo') || text.includes('cateto') || text.includes('hipotenusa')) {
      return 'Aplica el Teorema de Pitágoras $a^2 + b^2 = c^2$, donde $c$ es la hipotenusa (el lado de mayor longitud opuesto al ángulo recto de 90°).';
    }
    if (text.includes('inversa') || text.includes('vaciado') || text.includes('estanque') || text.includes('decrecimiento')) {
      return 'En funciones con exponente negativo, a mayor valor en el denominador (por ejemplo mayor diámetro de la válvula), menor es el tiempo requerido.';
    }
    return 'Lee con atención los datos conocidos del enunciado, identifica la fórmula o relación matemática que los conecta y despeja la incógnita solicitada.';
  }, [currentQuestion]);

  const serverAnswer = currentParticipantData?.answers?.[activeQIndex];
  const localAnswer = localAnswers[activeQIndex];
  const activeAnswer = serverAnswer || localAnswer;
  const activeSelectedOption: number | undefined = activeAnswer !== undefined
    ? (activeAnswer.selected ?? (activeAnswer as any)?.option)
    : undefined;
  const hasAnswered = activeSelectedOption !== undefined;

  // Helpers for Superpower
  const formatTimeMinutesSeconds = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQSuperpower = activatedSuperpowers[activeQIndex];

  const handleActivateSuperpower = () => {
    if (superpowerCooldownRemaining > 0) return;
    if (!currentQuestion) return;

    let toEliminate: number[] = [];
    if (currentQuestion.superpowerClue?.eliminatedOptionIndices?.length) {
      toEliminate = currentQuestion.superpowerClue.eliminatedOptionIndices;
    } else {
      toEliminate = currentQuestion.options
        .map((_, idx) => idx)
        .filter((idx) => idx !== currentQuestion.correctAnswer)
        .slice(0, 2);
    }

    const clueData = {
      eliminated: toEliminate,
      strategicHint:
        currentQuestion.superpowerClue?.strategicHint ||
        'Comparen algebraicamente las coordenadas x e y en su cuaderno de trabajo en pareja.',
      keyVertex: currentQuestion.superpowerClue?.keyVertexHighlight,
    };

    const now = Date.now();
    localStorage.setItem('mat_superpower_last_used_timestamp', now.toString());
    setSuperpowerLastUsed(now);

    const updated = { ...activatedSuperpowers, [activeQIndex]: clueData };
    setActivatedSuperpowers(updated);
    localStorage.setItem('mat_activated_superpowers', JSON.stringify(updated));
  };

  // =========================================================================
  // SENTINEL ANTI-CHEAT PRO: ZERO-INSTALL BROWSER SECURITY SUITE
  // =========================================================================
  const isInsideIframe = typeof window !== 'undefined' && window.self !== window.top;

  const triggerLockAssessment = useCallback((reason: string, alertType: any = 'tab_attempt') => {
    if (!isJoined || !participantId) return;
    setIsSecurityLocked(true);
    setSecurityLockReason(reason);
    realtimeDb.reportSecurityAlert(participantId, alertType, reason);
  }, [isJoined, participantId]);

  const checkSplitScreen = useCallback(() => {
    if (!isJoined || !participantId) return;
    // When running inside an iframe (like AI Studio preview), inner dimensions do not match device screen
    if (isInsideIframe) return;

    const screenW = window.screen.availWidth || window.screen.width || 0;
    const screenH = window.screen.availHeight || window.screen.height || 0;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const outerW = window.outerWidth || winW;

    if (screenW > 0 && winW > 0) {
      const widthRatio = winW / screenW;
      const heightRatio = screenH > 0 ? winH / screenH : 1;
      const sidebarDelta = outerW - winW;
      const screenDelta = screenW - winW;

      // Anti-AI Sidebar & Split Screen Detection:
      // Catches Brave Leo AI, Edge Copilot, Chrome Gemini Side Panel, Opera Aria & split windows
      const isSidebarOrSplitAI =
        (screenW >= 768 && sidebarDelta >= 180) ||
        (screenW >= 768 && screenDelta >= 220 && widthRatio < 0.88) ||
        (screenW >= 600 && widthRatio < 0.78) ||
        (widthRatio < 0.60) ||
        (heightRatio < 0.60 && !isFullscreen);

      if (isSidebarOrSplitAI) {
        setIsSplitScreen(true);
        triggerLockAssessment(
          `Panel lateral o Inteligencia Artificial de navegador detectada (Brave Leo, Edge Copilot, Gemini Side Panel o división de pantalla). Ancho disponible: ${winW}px (${Math.round(widthRatio * 100)}% de pantalla). Por favor cierra la barra de IA o restaura la ventana a pantalla completa.`,
          'split_screen'
        );
      } else if (!isSecurityLocked && !isOutOfTab) {
        setIsSplitScreen(false);
      }
    }
  }, [isJoined, participantId, isFullscreen, isInsideIframe, isSecurityLocked, isOutOfTab, triggerLockAssessment]);

  const triggerFocusLossNow = useCallback((customReason?: string) => {
    if (!isJoined || !participantId) return;
    const reason = customReason || 'Cambio de pestaña o minimización de ventana detectado (Page Visibility API)';
    setIsOutOfTab(true);
    setIsSecurityLocked(true);
    setSecurityLockReason(reason);
    awayStartTimestampRef.current = Date.now();
    setAwaySeconds(0);

    // Persist lock state to local storage immediately
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`mat_security_locked_${participantId}`, 'true');
        localStorage.setItem(`mat_security_reason_${participantId}`, reason);
        localStorage.setItem(`mat_security_lock_time_${participantId}`, String(Date.now()));
      } catch {}
    }

    // Report focus escape with timestamp and specific infraction reason to database & backend
    realtimeDb.setStudentFocusState(
      participantId,
      true,
      Date.now(),
      0,
      reason
    );

    // Local stopwatch ticker for locked screen timer without flooding the network
    if (awayIntervalRef.current) clearInterval(awayIntervalRef.current);
    awayIntervalRef.current = setInterval(() => {
      if (awayStartTimestampRef.current) {
        const elapsed = Math.floor((Date.now() - awayStartTimestampRef.current) / 1000);
        setAwaySeconds(elapsed);
      }
    }, 1000);
  }, [isJoined, participantId]);

  const handleAppBlur = useCallback(() => {
    if (!isJoined || !participantId) return;

    // Do not trigger blur if student is interacting with legitimate internal tools (scratchpad, modal, camera file picker)
    if (isUploadingPhoto || isScratchpadOpen || isReportOpen || isLeaveModalOpen) {
      return;
    }

    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);

    // Wipe clipboard immediately to stop copy/paste/screenshot leaks
    try {
      navigator.clipboard?.writeText?.('');
    } catch {}

    // Fast check: if focus is lost (e.g. Windows key opened Start menu, Snipping Tool, Game Bar, or alt-tab)
    // 350ms delay gives enough cushion for internal UI re-renders, but catches OS escapes immediately!
    blurTimerRef.current = setTimeout(() => {
      if (!document.hasFocus() || document.hidden) {
        setIsBrowserDialogWarning(false);
        triggerFocusLossNow('Pérdida de foco en la ventana de evaluación (cambio de aplicación, menú Windows o herramienta de captura)');
      }
    }, 350);
  }, [
    isJoined,
    participantId,
    isUploadingPhoto,
    isScratchpadOpen,
    isReportOpen,
    isLeaveModalOpen,
    triggerFocusLossNow,
  ]);

  const handleAppFocus = useCallback(() => {
    if (blurTimerRef.current) {
      clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
    setIsBrowserDialogWarning(false);
  }, []);

  // Desbloqueo docente obligatorio con contraseña
  const handleTeacherUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const entered = teacherUnlockPasscode.trim();
    if (!entered) {
      setUnlockError('Ingresa la contraseña del docente');
      return;
    }

    const isValid =
      isValidTeacherPassword(entered) ||
      (session.adminKey && entered === session.adminKey);

    if (!isValid) {
      setUnlockError('Contraseña incorrecta. El docente debe ingresar su clave autorizada.');
      return;
    }

    setUnlockSuccess(true);
    setUnlockError(null);

    if (participantId) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(`mat_security_locked_${participantId}`);
          localStorage.removeItem(`mat_security_reason_${participantId}`);
          localStorage.removeItem(`mat_security_lock_time_${participantId}`);
        } catch {}
      }
      await realtimeDb.unlockStudentSecurity(participantId);
    }

    setTimeout(() => {
      setIsSecurityLocked(false);
      setIsOutOfTab(false);
      setIsSplitScreen(false);
      setSecurityLockReason(null);
      setTeacherUnlockPasscode('');
      setUnlockSuccess(false);
      if (awayIntervalRef.current) {
        clearInterval(awayIntervalRef.current);
        awayIntervalRef.current = null;
      }
      awayStartTimestampRef.current = null;
      enterFullscreen();
    }, 350);
  };

  // Synchronize database locked state (persists locked state or processes remote teacher unlocks)
  useEffect(() => {
    if (!currentParticipantData) return;

    if (currentParticipantData.isSecurityLocked === true || currentParticipantData.isOutOfTab === true) {
      setIsSecurityLocked(true);
      if (currentParticipantData.isOutOfTab) setIsOutOfTab(true);
      if (currentParticipantData.securityLockReason) {
        setSecurityLockReason(currentParticipantData.securityLockReason);
      }
    } else if (
      currentParticipantData.isSecurityLocked === false &&
      !currentParticipantData.isOutOfTab
    ) {
      if (isSecurityLocked || isOutOfTab) {
        if (participantId && typeof window !== 'undefined') {
          try {
            localStorage.removeItem(`mat_security_locked_${participantId}`);
            localStorage.removeItem(`mat_security_reason_${participantId}`);
            localStorage.removeItem(`mat_security_lock_time_${participantId}`);
          } catch {}
        }
        setIsSecurityLocked(false);
        setIsOutOfTab(false);
        setIsSplitScreen(false);
        setSecurityLockReason(null);
        if (awayIntervalRef.current) {
          clearInterval(awayIntervalRef.current);
          awayIntervalRef.current = null;
        }
        awayStartTimestampRef.current = null;
        enterFullscreen();
      }
    }
  }, [
    currentParticipantData?.isSecurityLocked,
    currentParticipantData?.isOutOfTab,
    currentParticipantData?.securityLockReason,
    isSecurityLocked,
    isOutOfTab,
    participantId,
    enterFullscreen,
  ]);

  // 1. High-frequency 5-second client-side Heartbeat mechanism
  useEffect(() => {
    if (!isJoined || !participantId) return;

    realtimeDb.recordHeartbeat(participantId);
    const heartbeatInterval = setInterval(() => {
      if (isJoined && participantId) {
        realtimeDb.recordHeartbeat(participantId);
      }
    }, 5000);

    return () => clearInterval(heartbeatInterval);
  }, [isJoined, participantId]);

  // 2. WebHID and USB hardware peripheral kiosk-mode detector
  useEffect(() => {
    if (!isJoined || !participantId) return;

    const handleDeviceConnected = (event: any) => {
      const deviceName = event?.device?.productName || event?.device?.name || 'Periférico USB no autorizado';
      triggerFocusLossNow(`Dispositivo USB no autorizado detectado: ${deviceName}`);
      realtimeDb.reportSecurityAlert(
        participantId,
        'shortcut_attempt',
        `Dispositivo USB / Periférico conectado durante la prueba: ${deviceName}`
      );
    };

    if (typeof navigator !== 'undefined') {
      if ('hid' in navigator && (navigator as any).hid) {
        try {
          (navigator as any).hid.addEventListener('connect', handleDeviceConnected);
        } catch {}
      }
      if ('usb' in navigator && (navigator as any).usb) {
        try {
          (navigator as any).usb.addEventListener('connect', handleDeviceConnected);
        } catch {}
      }
    }

    return () => {
      if (typeof navigator !== 'undefined') {
        if ('hid' in navigator && (navigator as any).hid) {
          try {
            (navigator as any).hid.removeEventListener('connect', handleDeviceConnected);
          } catch {}
        }
        if ('usb' in navigator && (navigator as any).usb) {
          try {
            (navigator as any).usb.removeEventListener('connect', handleDeviceConnected);
          } catch {}
        }
      }
    };
  }, [isJoined, participantId, triggerFocusLossNow]);

  // W3C Page Visibility API Tracker: Instant detection when student switches tabs or minimizes window
  useEffect(() => {
    const handleVisibilityChange = () => {
      // W3C Page Visibility API specification: document.hidden or document.visibilityState === 'hidden'
      const isHidden = document.hidden || document.visibilityState === 'hidden';
      if (isHidden) {
        // Instant trigger if tab is switched or minimized (0ms delay)
        if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
        setIsBrowserDialogWarning(false);
        triggerFocusLossNow('Cambio de pestaña o minimización de ventana detectado (Page Visibility API)');
      } else {
        handleAppFocus();
      }
    };

    const handlePointerActivity = () => {
      lastPointerActivityTimestampRef.current = Date.now();
      if (isBrowserDialogWarning) {
        setIsBrowserDialogWarning(false);
        if (blurTimerRef.current) {
          clearTimeout(blurTimerRef.current);
          blurTimerRef.current = null;
        }
      }
    };

    window.addEventListener('blur', handleAppBlur);
    window.addEventListener('focus', handleAppFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pointerdown', handlePointerActivity, { passive: true });
    window.addEventListener('pointermove', handlePointerActivity, { passive: true });
    window.addEventListener('touchstart', handlePointerActivity, { passive: true });
    window.addEventListener('click', handlePointerActivity, { passive: true });

    return () => {
      window.removeEventListener('blur', handleAppBlur);
      window.removeEventListener('focus', handleAppFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pointerdown', handlePointerActivity);
      window.removeEventListener('pointermove', handlePointerActivity);
      window.removeEventListener('touchstart', handlePointerActivity);
      window.removeEventListener('click', handlePointerActivity);
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
      if (awayIntervalRef.current) clearInterval(awayIntervalRef.current);
    };
  }, [handleAppBlur, handleAppFocus, isBrowserDialogWarning, triggerFocusLossNow]);

  // Keyboard and Security Interception (TAB, Alt+Tab, DevTools, Copy/Paste, Right Click)
  useEffect(() => {
    if (!isJoined || !participantId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 0. Prevent escaping fullscreen (F11 / Escape)
      if (e.key === 'F11' || e.key === 'Escape') {
        e.preventDefault();
        if (isFullscreenEnforced && !isFullscreen) {
          enterFullscreen();
        }
      }

      // Windows Key (Meta / Win / OS) detection
      const isMetaOrWin =
        e.key === 'Meta' ||
        e.key === 'OS' ||
        e.key === 'Win' ||
        e.code === 'OSLeft' ||
        e.code === 'OSRight' ||
        e.code === 'MetaLeft' ||
        e.code === 'MetaRight' ||
        e.metaKey;

      if (isMetaOrWin) {
        e.preventDefault();
        e.stopPropagation();
        try {
          navigator.clipboard?.writeText?.('');
        } catch {}
        triggerLockAssessment(
          'Intento de salida mediante tecla Windows / Atajo del Sistema',
          'shortcut_attempt'
        );
        return;
      }

      // 1. Detect TAB key
      if (e.key === 'Tab') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        const isInput = activeTag === 'input' || activeTag === 'textarea';
        if (!isInput) {
          e.preventDefault();
          triggerSecurityToast('⚠️ Uso de la tecla TAB bloqueado en la evaluación.');
          realtimeDb.reportSecurityAlert(
            participantId,
            'tab_attempt',
            'Intento de navegación con tecla TAB'
          );
          return;
        }
      }

      // 2. Detect PrintScreen / Screenshots (PrintScreen, PrtSc, Snapshot, Win+Shift+S, Cmd+Shift+3/4/5)
      const isPrintScreen =
        e.key === 'PrintScreen' ||
        e.code === 'PrintScreen' ||
        e.key === 'Snapshot' ||
        (e.shiftKey && (e.key === 's' || e.key === 'S') && (e.metaKey || isMetaOrWin)) ||
        (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key));

      if (isPrintScreen) {
        e.preventDefault();
        e.stopPropagation();
        try {
          navigator.clipboard?.writeText?.('');
        } catch {}
        triggerLockAssessment(
          'Intento de captura de pantalla (PrintScreen / Recortes)',
          'screenshot_attempt'
        );
        return;
      }

      // 3. Detect Print / Save PDF Shortcuts (Ctrl+P / Cmd+P)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        triggerLockAssessment(
          'Intento de imprimir o guardar pantalla como PDF (Ctrl+P)',
          'print_attempt'
        );
        return;
      }

      // 5. Detect View Source Shortcuts (Ctrl+U)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        triggerLockAssessment(
          'Intento de ver código fuente (Ctrl+U)',
          'shortcut_attempt'
        );
        return;
      }

      // 5.5. Detect Browser AI Shortcuts (Brave Leo, Edge Copilot, Chrome Gemini/Side Panel, Opera Aria)
      const isAIShortcut =
        (e.altKey && (e.key === 'b' || e.key === 'B')) || // Brave Leo AI
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === '.' || e.key === 'Y' || e.key === 'y')) || // Edge Copilot, Chrome Gemini
        ((e.ctrlKey || e.metaKey) && (e.key === '/' || e.key === '?')) || // Opera Aria AI / Quick AI
        (e.altKey && (e.key === ' ' || e.code === 'Space')) || // AI Quick Launcher
        ((e.ctrlKey || e.metaKey) && (e.key === ' ' || e.code === 'Space')); // Spotlight / Search

      if (isAIShortcut) {
        e.preventDefault();
        e.stopPropagation();
        triggerLockAssessment(
          'Atajo de Inteligencia Artificial de navegador bloqueado (Brave Leo, Copilot, Gemini Side Panel o búsqueda externa)',
          'shortcut_attempt'
        );
        return;
      }

      // 6. Detect Alt combinations (Alt+Tab, etc.)
      if (e.altKey) {
        triggerLockAssessment(
          `Intento de cambio con tecla Alt (${e.key})`,
          'shortcut_attempt'
        );
      }

      // 7. Detect Ctrl/Cmd shortcuts for tabs and browser navigation
      if ((e.ctrlKey || e.metaKey) && (e.key === 't' || e.key === 'n' || e.key === 'w' || e.key === 'Tab')) {
        e.preventDefault();
        triggerLockAssessment(
          `Intento de atajo de pestaña (${e.ctrlKey ? 'Ctrl' : 'Cmd'}+${e.key.toUpperCase()})`,
          'shortcut_attempt'
        );
        return;
      }

      // 8. Detect F12 and DevTools shortcuts
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j'))
      ) {
        e.preventDefault();
        triggerLockAssessment(
          'Intento de abrir consola / DevTools (F12/Inspect)',
          'devtools_open'
        );
        return;
      }

      // 9. Detect Copy / Cut / Paste shortcuts
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'c' || e.key === 'x' || e.key === 'v' || e.key === 'a')
      ) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        const isInput = activeTag === 'input' || activeTag === 'textarea';
        if (!isInput) {
          e.preventDefault();
          setShowCopyNotice(true);
          setTimeout(() => setShowCopyNotice(false), 3000);
          triggerLockAssessment(
            `Intento de copiar o cortar (${e.ctrlKey ? 'Ctrl' : 'Cmd'}+${e.key.toUpperCase()})`,
            'copy_attempt'
          );
        }
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerSecurityToast('⚠️ Menú contextual / clic secundario deshabilitado por seguridad.');
      realtimeDb.reportSecurityAlert(
        participantId,
        'right_click',
        'Intento de clic secundario / menú contextual'
      );
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleBeforePrint = () => {
      triggerLockAssessment(
        'Intento de imprimir la prueba',
        'print_attempt'
      );
    };

    // Global copy & cut preventer
    const handleGlobalCopy = (e: ClipboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag !== 'input' && activeTag !== 'textarea') {
        e.preventDefault();
        try {
          e.clipboardData?.setData('text/plain', '');
        } catch {}
        setShowCopyNotice(true);
        setTimeout(() => setShowCopyNotice(false), 3000);
        triggerLockAssessment(
          'Intento de copiar texto de la evaluación',
          'copy_attempt'
        );
      }
    };

    const handleGlobalPaste = (e: ClipboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag !== 'input' && activeTag !== 'textarea') {
        e.preventDefault();
        triggerSecurityToast('⚠️ Pegar contenido no está permitido.');
      }
    };

    // DevTools Detection by checking outer vs inner dimensions delta
    const checkDevTools = () => {
      // In an iframe (like AI Studio preview), outer vs inner dimensions reflect the page container, not devtools
      if (isInsideIframe) return;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > 160 || heightDiff > 160) {
        triggerLockAssessment(
          'Consola / Herramientas de desarrollador abiertas',
          'devtools_open'
        );
      }
    };
    const devtoolsInterval = setInterval(checkDevTools, 4000);

    // Multi-screen / Extended display check
    if (window.screen && (window.screen as any).isExtended) {
      realtimeDb.reportSecurityAlert(
        participantId,
        'second_monitor',
        'Segundo monitor / pantalla extendida detectada'
      );
    }

    // Cursor leaves window towards outside, top bar, or side AI panels
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientX >= window.innerWidth - 10) {
        triggerSecurityToast('⚠️ Alerta: Cursor dirigido hacia la barra lateral del navegador.');
        realtimeDb.reportSecurityAlert(
          participantId,
          'tab_attempt',
          'Intento de interacción con barra lateral del navegador / panel de IA'
        );
      } else if (e.clientY <= 0 || e.clientX <= 0 || e.clientY >= window.innerHeight) {
        triggerSecurityToast('⚠️ Cursor fuera del área de prueba. Mantén la atención en tu pantalla.');
      }
    };

    // Picture-in-picture blocking
    const handleEnterPiP = () => {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture?.().catch(() => {});
        realtimeDb.reportSecurityAlert(
          participantId,
          'pip_attempt',
          'Intento de video flotante (PiP)'
        );
      }
    };

    // KeyUp listener: catches key releases (e.g. Windows key release after Start menu prompt or PrintScreen)
    const handleKeyUp = (e: KeyboardEvent) => {
      const isMetaOrWin =
        e.key === 'Meta' ||
        e.key === 'OS' ||
        e.key === 'Win' ||
        e.code?.startsWith('Meta') ||
        e.code?.startsWith('OS') ||
        e.metaKey;

      if (isMetaOrWin) {
        e.preventDefault();
        try {
          navigator.clipboard?.writeText?.('');
        } catch {}
        triggerLockAssessment(
          'Tecla Windows detectada (Menú Inicio / Atajo del Sistema)',
          'shortcut_attempt'
        );
      }

      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.key === 'Snapshot') {
        e.preventDefault();
        try {
          navigator.clipboard?.writeText?.('');
        } catch {}
        triggerLockAssessment(
          'Captura de pantalla detectada (PrintScreen / Recortes)',
          'screenshot_attempt'
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('dragstart', handleDragStart);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('resize', checkSplitScreen);
    document.addEventListener('copy', handleGlobalCopy);
    document.addEventListener('cut', handleGlobalCopy);
    document.addEventListener('paste', handleGlobalPaste);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('enterpictureinpicture', handleEnterPiP);

    checkSplitScreen();
    const splitScreenInterval = setInterval(checkSplitScreen, 800);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('resize', checkSplitScreen);
      document.removeEventListener('copy', handleGlobalCopy);
      document.removeEventListener('cut', handleGlobalCopy);
      document.removeEventListener('paste', handleGlobalPaste);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('enterpictureinpicture', handleEnterPiP);
      clearInterval(devtoolsInterval);
      clearInterval(splitScreenInterval);
    };
  }, [isJoined, participantId, checkSplitScreen, triggerSecurityToast]);

  // Anti-Copy Interception
  const handleCopyAttempt = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setShowCopyNotice(true);
    setTimeout(() => setShowCopyNotice(false), 3000);

    if (participantId) {
      realtimeDb.reportCopyAttempt(participantId, activeQIndex);
    }
  };

  // --- Photo Upload Handling ---
  const handleTriggerCamera = () => {
    if (!NOTEBOOK_PHOTOS_ENABLED) return;
    enterFullscreen();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !participantId) return;

    try {
      setIsUploadingPhoto(true);
      const base64Photo = await compressImage(file, 1024, 0.75);

      await realtimeDb.uploadNotebookPhoto(
        participantId,
        currentQuestion?.id || String(activeQIndex),
        base64Photo
      );
    } catch (err) {
      console.error('Error subiendo foto:', err);
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // --- Group Member Handlers ---
  const handleAddMember = () => {
    if (groupMemberDetails.length < 5) {
      setGroupMemberDetails((prev) => [
        ...prev,
        { firstName: '', paternalLastName: '', maternalLastName: '', fullName: '', listNumber: undefined },
      ]);
    }
  };

  const handleRemoveMember = (index: number) => {
    if (groupMemberDetails.length > 2) {
      setGroupMemberDetails((prev) => prev.filter((_, i) => i !== index));
      setGroupMemberSearch((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
      setGroupMemberManualMode((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
      if (editingMemberIdx === index) setEditingMemberIdx(null);
    }
  };

  const handleSelectGroupMemberFromRoster = (memberIdx: number, student: (typeof ROSTER_1_MEDIO_D)[0]) => {
    setGroupMemberDetails((prev) => {
      const updated = [...prev];
      updated[memberIdx] = {
        firstName: student.firstName,
        paternalLastName: student.paternalLastName,
        maternalLastName: student.maternalLastName,
        fullName: `${student.firstName} ${student.paternalLastName} ${student.maternalLastName}`,
        listNumber: student.listNumber,
      };
      return updated;
    });
    setEditingMemberIdx(null);
    setGroupMemberSearch((prev) => ({ ...prev, [memberIdx]: '' }));
    setGroupMemberManualMode((prev) => ({ ...prev, [memberIdx]: false }));
  };

  const handleClearGroupMember = (memberIdx: number) => {
    setGroupMemberDetails((prev) => {
      const updated = [...prev];
      updated[memberIdx] = {
        firstName: '',
        paternalLastName: '',
        maternalLastName: '',
        fullName: '',
        listNumber: undefined,
      };
      return updated;
    });
    setEditingMemberIdx(memberIdx);
    setGroupMemberSearch((prev) => ({ ...prev, [memberIdx]: '' }));
  };

  const handleUpdateMember = (
    index: number,
    field: 'firstName' | 'paternalLastName' | 'maternalLastName',
    val: string
  ) => {
    setGroupMemberDetails((prev) => {
      const updated = [...prev];
      const member = { ...updated[index], [field]: val, listNumber: undefined };
      member.fullName = [member.firstName, member.paternalLastName, member.maternalLastName]
        .filter(Boolean)
        .join(' ');
      updated[index] = member;
      return updated;
    });
  };

  // --- Course Selection Handler ---
  const handleSelectCourseSection = (levelKey: string, sectionLetter: string) => {
    setSelectedLevelKey(levelKey);
    setSelectedSection(sectionLetter);
    const lvl = SCHOOL_LEVELS.find((l) => l.key === levelKey) || SCHOOL_LEVELS[2];
    const sShort = `${lvl.shortLabel}${sectionLetter}`;
    const sFull = `${lvl.label} ${sectionLetter}`;
    const sKey = `${levelKey}_${sectionLetter}`;

    localStorage.setItem(STORAGE_PARTICIPANT_LEVEL, levelKey);
    localStorage.setItem(STORAGE_PARTICIPANT_SECTION, sectionLetter);
    localStorage.setItem(STORAGE_PARTICIPANT_COURSE, sShort);
    localStorage.setItem(STORAGE_PARTICIPANT_COURSE_KEY, sKey);
  };

  const handleAdvanceFromCourse = () => {
    enterFullscreen();
    setOnboardingStep('mode');
  };

  const handleAdvanceFromMode = () => {
    enterFullscreen();
    setOnboardingStep('details');
  };

  // --- Join Handler with Strict Verification ---
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');
    setKickWarning('');
    enterFullscreen();

    const cleanPin = pinInput.trim().toUpperCase();
    if (!cleanPin) {
      setJoinError('Por favor ingresa el código PIN de la sala proyectada en la pizarra.');
      return;
    }

    if (session.status === 'paused' || session.isLobbyLocked) {
      setJoinError(
        session.roomLockedReason ||
          '🔒 SALA CERRADA POR EL PROFESOR: El acceso a la evaluación está actualmente cerrado por el docente. Solo se abrirá cuando el profesor lo autorice desde su panel de control.'
      );
      return;
    }

    if (session.pin && cleanPin !== session.pin.trim().toUpperCase()) {
      setJoinError(`El PIN "${cleanPin}" no coincide con la sala activa (${session.pin}).`);
      return;
    }

    if (participantMode === 'individual') {
      if (!isManualInputMode && !selectedRosterStudent) {
        setJoinError('Por favor selecciona tu nombre en la lista oficial del curso 1° Medio D.');
        return;
      }

      const cleanFirst = (selectedRosterStudent ? selectedRosterStudent.firstName : firstName).trim();
      const cleanPaternal = (selectedRosterStudent ? selectedRosterStudent.paternalLastName : paternalLastName).trim();
      const cleanMaternal = (selectedRosterStudent ? selectedRosterStudent.maternalLastName : maternalLastName).trim();

      if (!cleanFirst || cleanFirst.length < 2) {
        setJoinError('Por favor ingresa o selecciona tu Nombre de pila.');
        return;
      }
      if (!cleanPaternal || cleanPaternal.length < 2) {
        setJoinError('Por favor ingresa o selecciona tu Primer Apellido (Apellido Paterno).');
        return;
      }
      if (!cleanMaternal || cleanMaternal.length < 2) {
        setJoinError('Por favor ingresa o selecciona tu Segundo Apellido (Apellido Materno).');
        return;
      }

      const fullStudentName = `${cleanFirst} ${cleanPaternal} ${cleanMaternal}`.trim();

      // Validación anti-suplantación: Evitar que un alumno se anote por sobre un compañero ya registrado
      const existingClaims = Object.values(students || {}) as any[];
      const alreadyRegistered = existingClaims.some((st) => {
        if (!st || st.id === participantId) return false;
        const sFirst = (st.firstName || '').trim().toLowerCase();
        const sPaternal = (st.paternalLastName || '').trim().toLowerCase();
        const sName = (st.name || '').trim().toLowerCase();
        return (
          (sPaternal && sFirst && sPaternal === cleanPaternal.toLowerCase() && sFirst === cleanFirst.toLowerCase()) ||
          (sName && sName === fullStudentName.toLowerCase())
        );
      });

      if (alreadyRegistered) {
        setJoinError(`El estudiante "${cleanFirst} ${cleanPaternal}" ya se encuentra registrado en esta sesión. No está permitido anotarse con el nombre de otro compañero.`);
        return;
      }

      const id =
        participantId && !session.kickedStudents?.[participantId]
          ? participantId
          : `st-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const assignedVariant: TestFormVariant = getBalancedFormVariant(students, id);
      setParticipantId(id);

      localStorage.setItem(STORAGE_PARTICIPANT_ID, id);
      localStorage.setItem(STORAGE_PARTICIPANT_TYPE, 'individual');
      localStorage.setItem(STORAGE_PARTICIPANT_NAME, fullStudentName);
      localStorage.setItem(STORAGE_PARTICIPANT_FIRST_NAME, cleanFirst);
      localStorage.setItem(STORAGE_PARTICIPANT_PATERNAL, cleanPaternal);
      localStorage.setItem(STORAGE_PARTICIPANT_MATERNAL, cleanMaternal);
      localStorage.setItem(STORAGE_PARTICIPANT_LEVEL, selectedLevelKey);
      localStorage.setItem(STORAGE_PARTICIPANT_SECTION, selectedSection);
      localStorage.setItem(STORAGE_PARTICIPANT_COURSE, selectedCourseShort);
      localStorage.setItem(STORAGE_PARTICIPANT_COURSE_KEY, selectedCourseKey);
      localStorage.setItem(STORAGE_PARTICIPANT_VARIANT, assignedVariant);
      localStorage.setItem(STORAGE_PARTICIPANT_JOINED_AT, String(Date.now()));
      localStorage.setItem(STORAGE_ACK_ROOM_CLEANED_AT, String(session.lastRoomCleanedAt || Date.now()));

      if (studentEmail.trim()) {
        localStorage.setItem(STORAGE_PARTICIPANT_EMAIL, studentEmail.trim());
      }
      if (selectedRosterStudent) {
        localStorage.setItem('mat_participant_list_number', String(selectedRosterStudent.listNumber));
      }

      realtimeDb.registerOrUpdateParticipant({
        id,
        type: 'individual',
        name: fullStudentName,
        firstName: cleanFirst,
        paternalLastName: cleanPaternal,
        maternalLastName: cleanMaternal,
        listNumber: selectedRosterStudent ? selectedRosterStudent.listNumber : undefined,
        gradeLevel: currentLevelInfo.label,
        section: selectedSection,
        course: selectedCourseShort,
        courseKey: selectedCourseKey,
        members: [fullStudentName],
        membersDetails: [
          {
            firstName: cleanFirst,
            paternalLastName: cleanPaternal,
            maternalLastName: cleanMaternal,
            fullName: fullStudentName,
          },
        ],
        testVariant: assignedVariant,
        device: 'Móvil',
      });

      if (studentEmail.trim()) {
        realtimeDb.updateStudentEmail(id, studentEmail.trim());
      }
      setIsJoined(true);
    } else {
      // Group Mode Validation
      const cleanGroupNum = groupNumber.trim();
      if (!cleanGroupNum) {
        setJoinError('Por favor ingresa el número o nombre del grupo (ej: Grupo 3).');
        return;
      }

      const formattedMembers: StudentMemberDetail[] = [];
      const memberNames: string[] = [];

      for (let i = 0; i < groupMemberDetails.length; i++) {
        const m = groupMemberDetails[i];
        const f = m.firstName.trim();
        const p = m.paternalLastName.trim();
        const mat = m.maternalLastName.trim();

        if (!f || !p || !mat) {
          setJoinError(`Por favor completa Nombre y los 2 Apellidos para el Integrante ${i + 1}.`);
          return;
        }

        const memberFullName = `${f} ${p} ${mat}`;
        formattedMembers.push({
          firstName: f,
          paternalLastName: p,
          maternalLastName: mat,
          fullName: memberFullName,
          listNumber: m.listNumber,
        });
        memberNames.push(memberFullName);
      }

      if (formattedMembers.length < 2) {
        setJoinError('El grupo debe tener al menos 2 integrantes con nombres válidos.');
        return;
      }

      const uniqueNames = new Set(memberNames.map((n) => n.toLowerCase()));
      if (uniqueNames.size !== memberNames.length) {
        setJoinError('No puedes repetir nombres de integrantes dentro del mismo grupo.');
        return;
      }

      const fullGroupName = `${cleanGroupNum} (${memberNames.join(' • ')})`;
      const id =
        participantId && !session.kickedStudents?.[participantId]
          ? participantId
          : `grp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const assignedVariant: TestFormVariant = getBalancedFormVariant(students, id);
      setParticipantId(id);

      localStorage.setItem(STORAGE_PARTICIPANT_ID, id);
      localStorage.setItem(STORAGE_PARTICIPANT_TYPE, 'group');
      localStorage.setItem(STORAGE_PARTICIPANT_NAME, fullGroupName);
      localStorage.setItem(STORAGE_PARTICIPANT_GROUP_NUM, cleanGroupNum);
      localStorage.setItem(STORAGE_PARTICIPANT_MEMBERS, JSON.stringify(memberNames));
      localStorage.setItem(
        STORAGE_PARTICIPANT_MEMBERS_DETAILS,
        JSON.stringify(formattedMembers)
      );
      localStorage.setItem(STORAGE_PARTICIPANT_LEVEL, selectedLevelKey);
      localStorage.setItem(STORAGE_PARTICIPANT_SECTION, selectedSection);
      localStorage.setItem(STORAGE_PARTICIPANT_COURSE, selectedCourseShort);
      localStorage.setItem(STORAGE_PARTICIPANT_COURSE_KEY, selectedCourseKey);
      localStorage.setItem(STORAGE_PARTICIPANT_VARIANT, assignedVariant);
      localStorage.setItem(STORAGE_PARTICIPANT_JOINED_AT, String(Date.now()));
      localStorage.setItem(STORAGE_ACK_ROOM_CLEANED_AT, String(session.lastRoomCleanedAt || Date.now()));

      if (studentEmail.trim()) {
        localStorage.setItem(STORAGE_PARTICIPANT_EMAIL, studentEmail.trim());
      }

      realtimeDb.registerOrUpdateParticipant({
        id,
        type: 'group',
        name: fullGroupName,
        gradeLevel: currentLevelInfo.label,
        section: selectedSection,
        course: selectedCourseShort,
        courseKey: selectedCourseKey,
        groupNumber: cleanGroupNum,
        members: memberNames,
        membersDetails: formattedMembers,
        testVariant: assignedVariant,
        device: 'Tablet/Móvil Grupal',
      });

      if (studentEmail.trim()) {
        realtimeDb.updateStudentEmail(id, studentEmail.trim());
      }
      setIsJoined(true);
    }
  };

  const handleSubmitConsensus = async () => {
    if (!consensusDraft.trim() || !participantId) return;
    try {
      setIsSubmittingConsensus(true);
      await realtimeDb.submitGroupConsensus(participantId, consensusDraft.trim());
      setConsensusSuccess(true);
      setTimeout(() => setConsensusSuccess(false), 4000);
    } catch (err) {
      console.error('Error submitting consensus:', err);
    } finally {
      setIsSubmittingConsensus(false);
    }
  };

  // --- Answer Submission: Strict Security & Flexible Student Selection (Allows Changing Answers) ---
  const handleSelectOption = (optionIndex: number) => {
    const isLockedNow = Boolean(
      isSecurityLocked ||
      isOutOfTab ||
      isSplitScreen ||
      currentParticipantData?.isSecurityLocked ||
      currentParticipantData?.isOutOfTab ||
      isEvaluationFinalized
    );
    if (!currentQuestion || !participantId || isLockedNow) return;

    enterFullscreen();
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    const answerObj = {
      selected: optionIndex,
      option: optionIndex,
      isCorrect,
      timestamp: Date.now(),
    };

    // 1. Instant local optimistic update (0ms delay)
    setLocalAnswers((prev) => {
      const updated = { ...prev, [activeQIndex]: answerObj };
      try {
        localStorage.setItem(`mat_local_answers_${participantId}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Realtime dispatch to teacher & scoreboard
    realtimeDb.submitAnswer(participantId, activeQIndex, optionIndex, isCorrect);
  };

  const handleNextAutonomous = () => {
    const isLockedNow = Boolean(
      isSecurityLocked ||
      isOutOfTab ||
      isSplitScreen ||
      currentParticipantData?.isSecurityLocked ||
      currentParticipantData?.isOutOfTab
    );
    if (isLockedNow) return;

    enterFullscreen();
    if (localQuestionIndex < totalQuestions - 1) {
      setLocalQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevAutonomous = () => {
    const isLockedNow = Boolean(
      isSecurityLocked ||
      isOutOfTab ||
      isSplitScreen ||
      currentParticipantData?.isSecurityLocked ||
      currentParticipantData?.isOutOfTab
    );
    if (isLockedNow) return;

    enterFullscreen();
    if (localQuestionIndex > 0) {
      setLocalQuestionIndex((prev) => prev - 1);
    }
  };

  const handleConfirmLeave = () => {
    setIsJoined(false);
    setParticipantId('');
    setIsLeaveModalOpen(false);
    setOnboardingStep('course');
    setJoinError('');
    setIsEvaluationFinalized(false);

    localStorage.removeItem(STORAGE_PARTICIPANT_ID);
    localStorage.removeItem(STORAGE_PARTICIPANT_TYPE);
    localStorage.removeItem(STORAGE_PARTICIPANT_NAME);
    localStorage.removeItem(STORAGE_PARTICIPANT_FIRST_NAME);
    localStorage.removeItem(STORAGE_PARTICIPANT_PATERNAL);
    localStorage.removeItem(STORAGE_PARTICIPANT_MATERNAL);
    localStorage.removeItem(STORAGE_PARTICIPANT_MEMBERS);
    localStorage.removeItem(STORAGE_PARTICIPANT_MEMBERS_DETAILS);
    localStorage.removeItem(STORAGE_PARTICIPANT_GROUP_NUM);
    localStorage.removeItem(STORAGE_PARTICIPANT_EMAIL);
    localStorage.removeItem(STORAGE_PARTICIPANT_VARIANT);

    if (onGoToPortal) {
      onGoToPortal();
    }
  };

  const handleDeliverAndFinalize = useCallback(async () => {
    if (hasAutoFinalizedRef.current && isEvaluationFinalized) return;
    hasAutoFinalizedRef.current = true;

    realtimeDb.flushOfflineActionQueue();

    // Calculate final points & Chilean grade
    let maxPts = 0;
    let earnedPts = 0;
    let correctCount = 0;
    let errorsCount = 0;

    activeQuestionsList.forEach((q, idx) => {
      const qPts = q.points || (idx >= 10 ? 4 : 2);
      maxPts += qPts;
      const ans = currentParticipantData?.answers?.[idx] || localAnswers[idx];
      if (ans) {
        if (ans.isCorrect) {
          earnedPts += qPts;
          correctCount++;
        } else {
          errorsCount++;
        }
      }
    });

    if (maxPts === 0) maxPts = 36;
    const computedGradeResult = calculateChileanGrade(earnedPts, maxPts, 0.6);
    const numericGrade = parseFloat(computedGradeResult.grade) || 1.0;

    const fullStudentName = [firstName, paternalLastName, maternalLastName].filter(Boolean).join(' ') ||
      currentParticipantData?.name || 'Estudiante';

    await realtimeDb.finalizeStudentEvaluation({
      studentId: participantId,
      name: fullStudentName,
      firstName: firstName || selectedRosterStudent?.firstName,
      paternalLastName: paternalLastName || selectedRosterStudent?.paternalLastName,
      maternalLastName: maternalLastName || selectedRosterStudent?.maternalLastName,
      listNumber: selectedRosterStudent?.listNumber,
      course: selectedCourseShort || '1°D',
      courseKey: '1_medio_D',
      gradeLevel: '1° Medio',
      section: 'D',
      testVariant: studentFormVariant,
      grade: numericGrade,
      score: earnedPts,
      correct: correctCount,
      errors: errorsCount,
      totalQuestions: activeQuestionsList.length,
      answers: { ...(currentParticipantData?.answers || {}), ...localAnswers },
      timestamp: Date.now(),
    });

    setIsEvaluationFinalized(true);
  }, [
    activeQuestionsList,
    currentParticipantData,
    firstName,
    isEvaluationFinalized,
    localAnswers,
    participantId,
    paternalLastName,
    maternalLastName,
    selectedCourseShort,
    selectedRosterStudent,
    studentFormVariant,
  ]);

  // Auto-finalize if teacher ends session or if round terminates
  useEffect(() => {
    if (session.status === 'finished' && isJoined && !hasAutoFinalizedRef.current) {
      handleDeliverAndFinalize();
    }
  }, [session.status, isJoined, handleDeliverAndFinalize]);

  // =========================================================================
  // VIEW 1: REGISTRATION WIZARD (NOT YET JOINED)
  // =========================================================================
  if (!isJoined) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
        {/* Top Header */}
        <div className="max-w-xl w-full mx-auto flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/20">
              <School className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-slate-900 tracking-tight block">
                Colegio Don Bosco Antofagasta
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Portal de Evaluación Sumativa de Matemática
              </span>
            </div>
          </div>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Ventana' : 'Pantalla Completa'}</span>
          </button>
        </div>

        {/* Wizard Container */}
        <div className="max-w-xl w-full mx-auto my-auto py-6">
          {/* Progress Bar / Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-6 text-xs font-bold">
            <button
              onClick={() => setOnboardingStep('course')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition ${
                onboardingStep === 'course'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>1. Curso ({selectedCourseShort})</span>
            </button>
            <span className="text-slate-300">→</span>
            <button
              onClick={() => setOnboardingStep('mode')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition ${
                onboardingStep === 'mode'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>2. Modalidad</span>
            </button>
            <span className="text-slate-300">→</span>
            <button
              onClick={() => setOnboardingStep('details')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition ${
                onboardingStep === 'details'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>3. Datos y PIN</span>
            </button>
          </div>

          {/* Kicked Alert */}
          {kickWarning && (
            <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{kickWarning}</span>
            </div>
          )}

          {/* STEP 1: ESCOGER CURSO */}
          {onboardingStep === 'course' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Paso 1: Selecciona tu Curso
                  </h2>
                  <p className="text-xs text-slate-500">
                    Indica tu nivel educativo y la letra correspondiente a tu curso.
                  </p>
                </div>
              </div>

              {/* Level Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  1. Nivel Educativo
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SCHOOL_LEVELS.map((lvl) => {
                    const isSelected = selectedLevelKey === lvl.key;
                    return (
                      <button
                        key={lvl.key}
                        type="button"
                        id={`level-select-${lvl.key}`}
                        onClick={() => handleSelectCourseSection(lvl.key, selectedSection)}
                        className={`p-3 rounded-2xl text-left border transition ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-600/20 text-indigo-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-xs font-black">{lvl.shortLabel}</span>
                        <span className="block text-[11px] text-slate-500 truncate">{lvl.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section / Letter Selector (A to E) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    2. Letra del Curso
                  </label>
                  <span className="text-xs font-bold text-indigo-600">
                    Curso seleccionado: <span className="underline">{selectedCourseFull}</span> ({selectedCourseShort})
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {SCHOOL_SECTIONS.map((sec) => {
                    const isSelected = selectedSection === sec;
                    return (
                      <button
                        key={sec}
                        type="button"
                        id={`section-select-${sec}`}
                        onClick={() => handleSelectCourseSection(selectedLevelKey, sec)}
                        className={`py-3.5 rounded-2xl text-center font-black text-lg border transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {sec}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Confirm Course & Advance */}
              <div className="pt-2">
                <button
                  type="button"
                  id="student-confirm-course-btn"
                  onClick={handleAdvanceFromCourse}
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition"
                >
                  <span>Continuar con {selectedCourseFull} ({selectedCourseShort})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ESCOGER MODALIDAD */}
          {onboardingStep === 'mode' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Paso 2: ¿Cómo vas a participar?
                  </h2>
                  <p className="text-xs text-slate-500">
                    Curso: <span className="font-bold text-indigo-600">{selectedCourseFull}</span>
                  </p>
                </div>
              </div>

              {/* Mode Options Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Option 1: Solo */}
                <button
                  type="button"
                  id="student-mode-pick-individual"
                  onClick={() => {
                    setParticipantMode('individual');
                    localStorage.setItem(STORAGE_PARTICIPANT_TYPE, 'individual');
                  }}
                  className={`p-5 rounded-2xl border text-left transition flex flex-col justify-between relative ${
                    participantMode === 'individual'
                      ? 'bg-indigo-50/70 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
                      : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3">
                      <User className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900">
                      👤 Trabajo Individual
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Responderás en tu propio dispositivo móvil con tu prueba personalizada.
                    </p>
                  </div>
                  {participantMode === 'individual' && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                      <Check className="w-4 h-4" /> Seleccionado
                    </div>
                  )}
                </button>

                {/* Option 2: Group */}
                <button
                  type="button"
                  id="student-mode-pick-group"
                  onClick={() => {
                    setParticipantMode('group');
                    localStorage.setItem(STORAGE_PARTICIPANT_TYPE, 'group');
                  }}
                  className={`p-5 rounded-2xl border text-left transition flex flex-col justify-between relative ${
                    participantMode === 'group'
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900">
                      👥 En Grupo
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Aprendizaje cooperativo. Un solo dispositivo para registrar las respuestas del equipo.
                    </p>
                  </div>
                  {participantMode === 'group' && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <Check className="w-4 h-4" /> Seleccionado
                    </div>
                  )}
                </button>
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOnboardingStep('course')}
                  className="px-5 py-3.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition"
                >
                  ← Cambiar Curso
                </button>
                <button
                  type="button"
                  id="student-confirm-mode-btn"
                  onClick={handleAdvanceFromMode}
                  className={`flex-1 py-3.5 rounded-2xl text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition ${
                    participantMode === 'group'
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                  }`}
                >
                  <span>Continuar ({participantMode === 'group' ? 'En Grupo' : 'Individual'})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DATOS Y PIN */}
          {onboardingStep === 'details' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      participantMode === 'group'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {participantMode === 'group' ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900">
                      {participantMode === 'group' ? 'Registro de Integrantes del Grupo' : 'Registro de Datos del Estudiante'}
                    </h2>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Curso: <strong className="text-slate-700">{selectedCourseFull}</strong> ({selectedCourseShort})
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOnboardingStep('mode')}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Cambiar
                </button>
              </div>

              {/* 🔒 SALA CERRADA POR EL PROFESOR BANNER */}
              {(session.status === 'paused' || session.isLobbyLocked) && (
                <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-900 text-xs font-bold space-y-1 animate-in fade-in">
                  <div className="flex items-center gap-2 text-rose-700 uppercase tracking-wide font-black text-xs sm:text-sm">
                    <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>SALA CERRADA POR EL PROFESOR</span>
                  </div>
                  <p className="font-medium text-rose-800 leading-relaxed text-[11px] sm:text-xs">
                    {session.roomLockedReason ||
                      'El acceso a esta sala está actualmente cerrado por el docente. La evaluación solo se abrirá cuando el profesor la habilite desde su panel.'}
                  </p>
                </div>
              )}

              {joinError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{joinError}</span>
                </div>
              )}

              <form onSubmit={handleJoin} className="space-y-4">
                {/* PIN Input */}
                <div>
                  <label
                    htmlFor="student-pin-input"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    1. Código PIN de la Sala
                  </label>
                  <input
                    id="student-pin-input"
                    type="text"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.toUpperCase())}
                    onFocus={() => {
                      lastInputBlurTimestampRef.current = Date.now();
                    }}
                    onBlur={() => {
                      lastInputBlurTimestampRef.current = Date.now();
                    }}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    data-lpignore="true"
                    placeholder="Ej: 849201"
                    maxLength={10}
                    required
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-indigo-600 text-center font-mono font-black text-xl tracking-widest outline-none transition uppercase"
                  />
                  <p className="text-[11px] text-slate-400 mt-1 text-center">
                    El PIN se encuentra proyectado en la pizarra del profesor.
                  </p>
                </div>

                {/* INDIVIDUAL MODE: 3 Mandatory Name Fields */}
                {participantMode === 'individual' && (
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      2. Identificación Oficial (Para el Libro de Clases)
                    </label>

                    {/* Selector Interactivo de Lista de Curso 1°D con Anti-Suplantación */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <span>📋 Nómina Oficial 1° Medio D</span>
                          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-mono font-bold">
                            45 Alumnos
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsManualInputMode(!isManualInputMode)}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold underline"
                        >
                          {isManualInputMode ? 'Usar lista de curso' : 'Ingreso manual'}
                        </button>
                      </div>

                      {!isManualInputMode && (
                        <>
                          <div className="relative">
                            <input
                              type="text"
                              value={rosterSearch}
                              onChange={(e) => setRosterSearch(e.target.value)}
                              placeholder="🔍 Buscar por N° de lista o apellido (ej: 07 o Arias)..."
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                            />
                            {rosterSearch && (
                              <button
                                type="button"
                                onClick={() => setRosterSearch('')}
                                className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                            {ROSTER_1_MEDIO_D
                              .filter((student) => {
                                if (!rosterSearch.trim()) return true;
                                const query = rosterSearch.toLowerCase().trim();
                                const listStr = student.listNumber.toString().padStart(2, '0');
                                return (
                                  listStr.includes(query) ||
                                  student.listNumber.toString() === query ||
                                  student.fullName.toLowerCase().includes(query) ||
                                  student.paternalLastName.toLowerCase().includes(query) ||
                                  student.firstName.toLowerCase().includes(query)
                                );
                              })
                              .map((student) => {
                                const activeStudentsList = Object.values(data?.students || {}) as any[];
                                const isClaimed = isStudentAlreadyClaimed(student, activeStudentsList);
                                const isSelected = selectedRosterStudent?.listNumber === student.listNumber;

                                return (
                                  <button
                                    key={student.listNumber}
                                    type="button"
                                    disabled={isClaimed}
                                    onClick={() => {
                                      if (isClaimed) return;
                                      setSelectedRosterStudent(student);
                                      setFirstName(student.firstName);
                                      setPaternalLastName(student.paternalLastName);
                                      setMaternalLastName(student.maternalLastName);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                                      isSelected
                                        ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-sm'
                                        : isClaimed
                                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                                        : 'bg-white hover:bg-indigo-50 border border-slate-200 text-slate-800'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                                          isSelected
                                            ? 'bg-emerald-600 text-white'
                                            : isClaimed
                                            ? 'bg-slate-300 text-slate-600'
                                            : 'bg-slate-200 text-slate-700'
                                        }`}
                                      >
                                        N° {student.listNumber.toString().padStart(2, '0')}
                                      </span>
                                      <span className="truncate">
                                        {student.paternalLastName} {student.maternalLastName}, {student.firstName}
                                      </span>
                                    </div>

                                    {isClaimed ? (
                                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                                        <span>🔒 Ya en examen</span>
                                      </span>
                                    ) : isSelected ? (
                                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <span>✓ Seleccionado</span>
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 font-medium">
                                        Tocar para elegir
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Visual Confirmation for Roster Selection or Manual Input */}
                    {!isManualInputMode ? (
                      <div>
                        {selectedRosterStudent ? (
                          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between shadow-2xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                                {selectedRosterStudent.listNumber.toString().padStart(2, '0')}
                              </span>
                              <div className="truncate">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                                  Estudiante Seleccionado
                                </span>
                                <span className="text-xs sm:text-sm font-black text-emerald-950 block truncate">
                                  {selectedRosterStudent.paternalLastName} {selectedRosterStudent.maternalLastName}, {selectedRosterStudent.firstName}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRosterStudent(null);
                                setFirstName('');
                                setPaternalLastName('');
                                setMaternalLastName('');
                              }}
                              className="text-[11px] text-rose-600 hover:text-rose-800 font-bold underline shrink-0 cursor-pointer ml-2"
                            >
                              Cambiar
                            </button>
                          </div>
                        ) : (
                          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-2 font-medium">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                            <span>Selecciona tu nombre en la lista oficial de arriba para habilitar el ingreso.</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div>
                          <label htmlFor="student-firstname-input" className="block text-[11px] font-bold text-slate-600 mb-1">
                            Nombre(s) de Pila *
                          </label>
                          <input
                            id="student-firstname-input"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            onFocus={() => {
                              lastInputBlurTimestampRef.current = Date.now();
                            }}
                            onBlur={() => {
                              lastInputBlurTimestampRef.current = Date.now();
                            }}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            data-lpignore="true"
                            placeholder="Ej: Jorge Ignacio"
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-indigo-600 outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="student-paternal-input" className="block text-[11px] font-bold text-slate-600 mb-1">
                              Primer Apellido (Paterno) *
                            </label>
                            <input
                              id="student-paternal-input"
                              type="text"
                              value={paternalLastName}
                              onChange={(e) => setPaternalLastName(e.target.value)}
                              onFocus={() => {
                                lastInputBlurTimestampRef.current = Date.now();
                              }}
                              onBlur={() => {
                                lastInputBlurTimestampRef.current = Date.now();
                              }}
                              autoComplete="off"
                              autoCorrect="off"
                              autoCapitalize="off"
                              spellCheck={false}
                              data-lpignore="true"
                              placeholder="Ej: González"
                              required
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-indigo-600 outline-none"
                            />
                          </div>

                          <div>
                            <label htmlFor="student-maternal-input" className="block text-[11px] font-bold text-slate-600 mb-1">
                              Segundo Apellido (Materno) *
                            </label>
                            <input
                              id="student-maternal-input"
                              type="text"
                              value={maternalLastName}
                              onChange={(e) => setMaternalLastName(e.target.value)}
                              onFocus={() => {
                                lastInputBlurTimestampRef.current = Date.now();
                              }}
                              onBlur={() => {
                                lastInputBlurTimestampRef.current = Date.now();
                              }}
                              autoComplete="off"
                              autoCorrect="off"
                              autoCapitalize="off"
                              spellCheck={false}
                              data-lpignore="true"
                              placeholder="Ej: Silva"
                              required
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-indigo-600 outline-none"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label htmlFor="student-email-input" className="block text-[11px] font-bold text-slate-600 mb-1">
                        Correo Electrónico (Para recibir tu comprobante oficial)
                      </label>
                      <input
                        id="student-email-input"
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        onFocus={() => {
                          lastInputBlurTimestampRef.current = Date.now();
                        }}
                        onBlur={() => {
                          lastInputBlurTimestampRef.current = Date.now();
                        }}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        data-lpignore="true"
                        placeholder="alumno@donboscoantofagasta.cl (Opcional)"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-indigo-600 outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* GROUP MODE: Group Identifier + Detailed Members */}
                {participantMode === 'group' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label htmlFor="student-group-number-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Nombre / Número del Equipo *
                      </label>
                      <input
                        id="student-group-number-input"
                        type="text"
                        value={groupNumber}
                        onChange={(e) => setGroupNumber(e.target.value)}
                        onFocus={() => {
                          lastInputBlurTimestampRef.current = Date.now();
                        }}
                        onBlur={() => {
                          lastInputBlurTimestampRef.current = Date.now();
                        }}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        data-lpignore="true"
                        placeholder="Ej: Grupo 1 - Mesa A"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-emerald-900 focus:border-emerald-600 outline-none"
                      />
                    </div>

                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <span>Integrantes ({groupMemberDetails.length}/5)</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                            Nómina 1°D
                          </span>
                        </label>
                        {groupMemberDetails.length < 5 && (
                          <button
                            type="button"
                            onClick={handleAddMember}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Agregar Integrante
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500">
                        Selecciona el nombre de cada integrante desde la nómina oficial del <strong>1° Medio D</strong> o ingresa manualmente si se requiere.
                      </p>

                      {groupMemberDetails.map((member, idx) => {
                        const isManual = !!groupMemberManualMode[idx];
                        const isEditing = editingMemberIdx === idx;
                        const hasSelected = !!member.fullName.trim() && !isManual && !isEditing;

                        return (
                          <div
                            key={idx}
                            className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 relative"
                          >
                            {/* Member Card Header */}
                            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-mono">
                                  {idx + 1}
                                </span>
                                <span>Integrante {idx + 1}</span>
                                {member.listNumber && (
                                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                                    N° {member.listNumber.toString().padStart(2, '0')}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {isManual ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setGroupMemberManualMode((prev) => ({ ...prev, [idx]: false }));
                                      setEditingMemberIdx(idx);
                                    }}
                                    className="text-[10px] text-emerald-700 hover:text-emerald-900 font-semibold underline"
                                  >
                                    Elegir de nómina 1°D
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setGroupMemberManualMode((prev) => ({ ...prev, [idx]: true }));
                                      setEditingMemberIdx(null);
                                    }}
                                    className="text-[10px] text-slate-500 hover:text-slate-700 font-semibold underline"
                                  >
                                    Ingreso manual
                                  </button>
                                )}

                                {groupMemberDetails.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMember(idx)}
                                    className="text-rose-500 hover:text-rose-700 p-1"
                                    title="Eliminar integrante"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Option A: Confirmed Selected Student from Roster */}
                            {hasSelected && (
                              <div className="p-3 bg-emerald-50/80 border-2 border-emerald-500 rounded-xl flex items-center justify-between gap-3 animate-in fade-in">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="font-mono font-bold px-2 py-1 rounded-lg text-xs bg-emerald-600 text-white shrink-0">
                                    {member.listNumber ? `N° ${member.listNumber.toString().padStart(2, '0')}` : `#${idx + 1}`}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="text-xs font-black text-emerald-950 truncate flex items-center gap-1.5">
                                      <span>{member.paternalLastName} {member.maternalLastName}, {member.firstName}</span>
                                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">1°D</span>
                                    </div>
                                    <span className="text-[10px] text-emerald-700 font-medium">
                                      Alumno confirmado en la nómina
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleClearGroupMember(idx)}
                                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-2.5 py-1 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-50 transition shrink-0"
                                >
                                  Cambiar
                                </button>
                              </div>
                            )}

                            {/* Option B: Active Search and Selection from 1° Medio D Roster */}
                            {!hasSelected && !isManual && (
                              <div className="space-y-2">
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={groupMemberSearch[idx] || ''}
                                    onChange={(e) =>
                                      setGroupMemberSearch((prev) => ({ ...prev, [idx]: e.target.value }))
                                    }
                                    placeholder="🔍 Buscar por N° de lista o apellido (ej: 07 o Arias)..."
                                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white placeholder-slate-400 focus:border-emerald-600 focus:outline-none"
                                  />
                                  {(groupMemberSearch[idx] || '') && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setGroupMemberSearch((prev) => ({ ...prev, [idx]: '' }))
                                      }
                                      className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>

                                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                                  {ROSTER_1_MEDIO_D
                                    .filter((student) => {
                                      const q = (groupMemberSearch[idx] || '').toLowerCase().trim();
                                      if (!q) return true;
                                      const listStr = student.listNumber.toString().padStart(2, '0');
                                      return (
                                        listStr.includes(q) ||
                                        student.listNumber.toString() === q ||
                                        student.fullName.toLowerCase().includes(q) ||
                                        student.paternalLastName.toLowerCase().includes(q) ||
                                        student.firstName.toLowerCase().includes(q)
                                      );
                                    })
                                    .map((student) => {
                                      // Check if student is already in this group (another slot)
                                      const isAlreadyInThisGroup = groupMemberDetails.some(
                                        (m, otherIdx) =>
                                          otherIdx !== idx &&
                                          (m.listNumber === student.listNumber ||
                                            (m.firstName.toLowerCase() === student.firstName.toLowerCase() &&
                                              m.paternalLastName.toLowerCase() === student.paternalLastName.toLowerCase()))
                                      );
                                      // Check if student is claimed in an active test
                                      const activeStudentsList = Object.values(data?.students || {}) as any[];
                                      const isClaimedElsewhere = isStudentAlreadyClaimed(student, activeStudentsList);
                                      const isUnavailable = isAlreadyInThisGroup || isClaimedElsewhere;

                                      return (
                                        <button
                                          key={student.listNumber}
                                          type="button"
                                          disabled={isUnavailable}
                                          onClick={() => handleSelectGroupMemberFromRoster(idx, student)}
                                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                                            isUnavailable
                                              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                                              : 'bg-white hover:bg-emerald-50 border border-slate-200 text-slate-800'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span
                                              className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                                                isUnavailable ? 'bg-slate-300 text-slate-600' : 'bg-slate-200 text-slate-700'
                                              }`}
                                            >
                                              N° {student.listNumber.toString().padStart(2, '0')}
                                            </span>
                                            <span className="truncate">
                                              {student.paternalLastName} {student.maternalLastName}, {student.firstName}
                                            </span>
                                          </div>

                                          {isAlreadyInThisGroup ? (
                                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                              En este grupo
                                            </span>
                                          ) : isClaimedElsewhere ? (
                                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                              🔒 En examen
                                            </span>
                                          ) : (
                                            <span className="text-[10px] text-emerald-700 font-semibold">
                                              Elegir
                                            </span>
                                          )}
                                        </button>
                                      );
                                    })}
                                </div>
                              </div>
                            )}

                            {/* Option C: Manual 3 Input Fields */}
                            {isManual && (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  value={member.firstName}
                                  onChange={(e) => handleUpdateMember(idx, 'firstName', e.target.value)}
                                  placeholder="Nombre"
                                  required
                                  className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-medium focus:border-emerald-600 outline-none"
                                />
                                <input
                                  type="text"
                                  value={member.paternalLastName}
                                  onChange={(e) => handleUpdateMember(idx, 'paternalLastName', e.target.value)}
                                  placeholder="Ap. Paterno"
                                  required
                                  className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-medium focus:border-emerald-600 outline-none"
                                />
                                <input
                                  type="text"
                                  value={member.maternalLastName}
                                  onChange={(e) => handleUpdateMember(idx, 'maternalLastName', e.target.value)}
                                  placeholder="Ap. Materno"
                                  required
                                  className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-medium focus:border-emerald-600 outline-none"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Security Note */}
                <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Seguridad de la Evaluación:</strong> Al ingresar, la pantalla se configurará en pantalla completa y se asignará automáticamente una variante de prueba equilibrada para evitar copias.
                  </span>
                </div>

                {/* Submit button */}
                <div className="pt-2 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep('mode')}
                    className="px-5 py-4 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition"
                  >
                    ← Volver
                  </button>
                  <button
                    type="submit"
                    id="student-join-room-btn"
                    disabled={session.status === 'paused' || Boolean(session.isLobbyLocked)}
                    className={`flex-1 py-4 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition ${
                      session.status === 'paused' || Boolean(session.isLobbyLocked)
                        ? 'bg-slate-400 cursor-not-allowed opacity-80 shadow-none'
                        : participantMode === 'group'
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25'
                    }`}
                  >
                    {session.status === 'paused' || Boolean(session.isLobbyLocked) ? (
                      <>
                        <Lock className="w-4 h-4 text-white/90" />
                        <span>Sala Cerrada por el Profesor</span>
                      </>
                    ) : (
                      <>
                        <span>Ingresar a la Evaluación</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="max-w-xl w-full mx-auto text-center text-xs text-slate-400 py-3 border-t border-slate-200">
          EduMath Pro • Sistema de Evaluación Colegio Técnico Industrial Don Bosco
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: INTERACTIVE LOBBY (WAITING ROOM WITH MINI-GAMES)
  // =========================================================================
  if (session.lobbyStatus === 'waiting') {
    return (
      <>
        <InteractiveLobby
          data={data}
          participantId={participantId}
          onLeave={() => setIsLeaveModalOpen(true)}
        />
        {/* Safe Exit Confirmation Modal for Lobby */}
        {isLeaveModalOpen && (
          <div
            id="lobby-leave-confirmation-modal"
            onClick={() => setIsLeaveModalOpen(false)}
            className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 text-left space-y-5 animate-in zoom-in-95 duration-150 text-slate-900"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <LogOut className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    ¿Seguro que deseas salir de la sala de espera?
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Cerrarás la sesión en este dispositivo para poder ingresar como otro alumno o equipo.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5 pt-1">
                <button
                  type="button"
                  id="lobby-cancel-leave-btn"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition text-center"
                >
                  Seguir en la Sala
                </button>
                <button
                  type="button"
                  id="lobby-confirm-leave-btn"
                  onClick={handleConfirmLeave}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition text-center flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sí, Salir</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // =========================================================================
  // VIEW 3: FINALIZED EVALUATION SCREEN (OFFICIAL GRADE & CERTIFICATE)
  // =========================================================================
  const isSessionFinished = session.status === 'finished' || isEvaluationFinalized;

  const isGroup = currentParticipantData?.type === 'group';
  const localComputedName = [firstName, paternalLastName, maternalLastName].filter(Boolean).join(' ') || 'Estudiante';
  const displayName = currentParticipantData?.name || localComputedName;
  const localComputedMembers = groupMemberDetails
    .map((m) => [m.firstName, m.paternalLastName, m.maternalLastName].filter(Boolean).join(' '))
    .filter(Boolean);
  const membersList = currentParticipantData?.members || localComputedMembers;
  const formBadge = TEST_FORMS_CONFIG[studentFormVariant] || TEST_FORMS_CONFIG.A;

  // Grade calculations
  let maxPoints = 0;
  let studentPoints = 0;
  let answeredCount = 0;

  activeQuestionsList.forEach((q, idx) => {
    const qPoints = q.points || (idx >= 10 ? 4 : 2);
    maxPoints += qPoints;
    const ans = currentParticipantData?.answers?.[idx] || localAnswers[idx];
    if (ans) {
      answeredCount++;
      if (ans.isCorrect) {
        studentPoints += qPoints;
      }
    }
  });

  if (maxPoints === 0) maxPoints = 36;
  const gradeData = calculateChileanGrade(studentPoints, maxPoints, 0.6);

  const handleFinalSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalEmailInput.trim() || !currentParticipantData) return;

    realtimeDb.updateStudentEmail(participantId, finalEmailInput.trim());

    const emailSubject = encodeURIComponent(
      `Comprobante Oficial de Calificación Don Bosco: ${displayName} (${formBadge.label})`
    );
    const emailBody = encodeURIComponent(
      generateEmailReportBody(currentParticipantData, session, activeQuestionsList)
    );

    window.location.href = `mailto:${finalEmailInput.trim()}?subject=${emailSubject}&body=${emailBody}`;
    setFinalEmailSent(true);
    setTimeout(() => setFinalEmailSent(false), 5000);
  };

  if (isSessionFinished && currentParticipantData) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="max-w-3xl w-full mx-auto flex items-center justify-between py-2 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-slate-900 tracking-tight block">
                Colegio Técnico Industrial Don Bosco
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Comprobante Oficial de Calificación Sumativa
              </span>
            </div>
          </div>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Ventana' : 'Pantalla Completa'}</span>
          </button>
        </div>

        {/* Main Finished Card */}
        <div className="max-w-2xl w-full mx-auto my-auto py-6 space-y-5">
          {/* Official Grade Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
              <Award className="w-4 h-4" />
              <span>Evaluación Entregada y Finalizada</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {displayName}
              </h1>
              <p className="text-xs text-slate-500">
                Curso: <span className="font-bold text-slate-700">{currentParticipantData.course || '1° Medio D'}</span> •{' '}
                <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${formBadge.pillBg} border ${formBadge.borderColor}`}>
                  {formBadge.label} ({formBadge.fullName})
                </span>
              </p>
            </div>

            {/* Huge Official Grade Box */}
            <div
              className={`p-6 rounded-3xl border flex flex-col items-center justify-center gap-2 ${
                gradeData.isApproved
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Calificación Sumativa Oficial
              </span>
              <div className="text-5xl sm:text-6xl font-black tracking-tight font-mono">
                {gradeData.grade}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                (Escala chilena 1.0 a 7.0 al 60% de exigencia)
              </span>

              <div className="flex items-center gap-3 mt-2 flex-wrap justify-center font-mono text-xs">
                <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-700">
                  Puntaje: {studentPoints} / {maxPoints} pts
                </span>
                <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-700">
                  Logro: {gradeData.percentage}%
                </span>
                <span
                  className={`px-3 py-1 rounded-xl font-bold ${
                    gradeData.isApproved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {gradeData.isApproved ? '✓ APROBADO' : '✗ REQUIERE REFUERZO'}
                </span>
              </div>
            </div>

            {/* Automatic Gradebook & Confidentiality Confirmation */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-left text-xs text-emerald-950 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900 block mb-0.5">Guardado Automático en el Libro Virtual:</strong>
                Tus respuestas y tu calificación final de <span className="font-bold text-emerald-800 font-mono text-sm">{gradeData.grade}</span> han quedado guardadas automáticamente en el Libro Virtual de Clases oficial (Curso: {currentParticipantData.course || '1° Medio D'}). El profesor ya cuenta con este respaldo, protegido contra caídas de internet.
              </div>
            </div>

            {/* Confidentiality Notice */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">Seguridad y Confidencialidad Institucional:</strong>
                Por motivos de probidad académica institucional y prevención de copias en el aula, las respuestas y desarrollos no se exhiben en pantallas de los alumnos. Tu calificación y respaldo han sido archivados de forma inmutable en el libro de clases del profesor.
              </div>
            </div>

            {/* Email Dispatch Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>Enviar Comprobante Oficial a tu Correo Electrónico</span>
              </div>

              <form onSubmit={handleFinalSendEmail} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={finalEmailInput || currentParticipantData.email || ''}
                  onChange={(e) => setFinalEmailInput(e.target.value)}
                  placeholder="alumno@donboscoantofagasta.cl"
                  required
                  className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 outline-none transition"
                />
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0 shadow-md shadow-indigo-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar al Correo</span>
                </button>
              </form>

              {finalEmailSent && (
                <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>¡Se abrió tu gestor de correo para despachar el comprobante oficial!</span>
                </p>
              )}
            </div>

            {/* Buttons: PDF Download + View Breakdown + Leave */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => downloadStudentReportPDF(currentParticipantData, session, activeQuestionsList)}
                className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition"
              >
                <FileDown className="w-4 h-4" />
                <span>Descargar Certificado PDF</span>
              </button>

              <button
                onClick={() => setIsReportOpen(true)}
                className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Ver Registro de Ítems</span>
              </button>

              <button
                onClick={handleConfirmLeave}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal: Item Registry */}
        <StudentReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          student={currentParticipantData}
          session={session}
          questions={activeQuestionsList}
        />

        {/* Footer */}
        <div className="max-w-3xl w-full mx-auto text-center text-xs text-slate-400 py-3 border-t border-slate-200">
          Colegio Técnico Industrial Don Bosco Antofagasta • Sistema Salesiano
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 4: ACTIVE STUDENT / GROUP TEST ROOM (STRICT ANTI-CHEAT & NO LEAKS)
  // =========================================================================
  return (
    <div
      onCopy={handleCopyAttempt}
      onCut={handleCopyAttempt}
      className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between p-3 sm:p-5 select-none secure-exam-view"
    >
      {/* ROOM PAUSED / FROZEN BY TEACHER OVERLAY */}
      {session.status === 'paused' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 text-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900/95 p-8 rounded-3xl border-2 border-rose-500/60 shadow-2xl space-y-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-xl">
              <Pause className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-widest bg-rose-500/20 border border-rose-500/30 px-3.5 py-1 rounded-full text-rose-300 inline-block">
                ⏸️ EVALUACIÓN PAUSADA POR EL DOCENTE
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Sala desactivada temporalmente
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                El profesor ha pausado la sesión. Todas tus respuestas y avances están guardados de forma segura. Por favor mantén el orden y atiende las instrucciones en la sala.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-400 font-medium">
              Tu pantalla se reactivará automáticamente en cuanto el docente active nuevamente la sala (ON).
            </div>
          </div>
        </div>
      )}
      {/* 🔒 INESCAPABLE TEACHER-PASSWORD SECURITY LOCK OVERLAY */}
      {(isSecurityLocked ||
        isOutOfTab ||
        isSplitScreen ||
        Boolean(currentParticipantData?.isSecurityLocked) ||
        Boolean(currentParticipantData?.isOutOfTab)) &&
        isJoined && (
          <div
            id="student-security-lock-overlay"
            className="fixed inset-0 z-50 bg-slate-950/95 text-white flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-in fade-in duration-150 backdrop-blur-md select-none"
          >
            <div className="max-w-lg w-full bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left relative overflow-hidden">
              {/* Top glowing bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 animate-pulse" />

              {/* Header with lock icon */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border-2 border-rose-500 flex items-center justify-center text-rose-500 shrink-0 shadow-lg shadow-rose-950/50">
                  <Lock className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-rose-500/20 text-rose-400 px-2.5 py-0.5 rounded-full border border-rose-500/30 inline-block">
                      ⚠️ Bloqueo de Probidad Académica
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30 inline-block">
                      🛰️ Page Visibility API
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                    EVALUACIÓN BLOQUEADA
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {isGroup
                      ? `Equipo: ${currentParticipantData?.name || groupNumber || 'Grupo'}`
                      : `Alumno: ${currentParticipantData?.name || `${firstName} ${paternalLastName}`.trim() || 'Estudiante'}`}
                  </p>
                </div>
              </div>

              {/* Infraction reason banner */}
              <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-600/50 space-y-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-300 block">
                  Infracción Registrada en Base de Datos:
                </span>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    {securityLockReason ||
                      currentParticipantData?.securityLockReason ||
                      currentParticipantData?.securityViolationReason ||
                      (isOutOfTab
                        ? 'Cambio de pestaña o minimización de ventana detectado (Page Visibility API)'
                        : 'Alerta de probidad académica')}
                  </span>
                </p>
                {awaySeconds > 0 && (
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-rose-900/40 text-amber-300 font-mono">
                    <span>Tiempo fuera registrado:</span>
                    <span className="font-black text-sm">{formatSeconds(awaySeconds)}</span>
                  </div>
                )}
                {Boolean(currentParticipantData?.tabEscapes && currentParticipantData.tabEscapes > 0) && (
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-rose-900/40 text-rose-300 font-mono">
                    <span>Salidas de pantalla registradas:</span>
                    <span className="font-black text-sm text-rose-300">{currentParticipantData?.tabEscapes} vez(ces)</span>
                  </div>
                )}
              </div>

              {/* Informative Guidance: Safe progress reassurance and calm instructions */}
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <span className="text-base">📢</span>
                  <span>Aviso de Seguridad</span>
                </div>
                <p className="leading-relaxed">
                  Esta incidencia ha sido registrada en el panel docente para fines de probidad. <strong>Tus respuestas anteriores están guardadas de forma segura.</strong>
                </p>
                <p className="text-[11px] text-amber-200/90 font-medium">
                  Solicita al profesor que ingrese su contraseña de autorización para desbloquear tu pantalla.
                </p>
              </div>

              {/* Formulario de Desbloqueo Docente Obligatorio */}
              <form onSubmit={handleTeacherUnlock} className="space-y-3 pt-2">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Contraseña del Docente:</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="student-teacher-unlock-input"
                      value={teacherUnlockPasscode}
                      onChange={(e) => {
                        setTeacherUnlockPasscode(e.target.value);
                        setUnlockError(null);
                      }}
                      placeholder="Ingresa clave docente autorizada..."
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      autoFocus
                    />
                  </div>
                  {unlockError && (
                    <p className="text-[11px] text-rose-400 font-bold mt-1">
                      {unlockError}
                    </p>
                  )}
                  {unlockSuccess && (
                    <p className="text-[11px] text-emerald-400 font-bold mt-1">
                      ✓ Clave correcta. Reanudando evaluación...
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  id="student-teacher-unlock-btn"
                  className="w-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Unlock className="w-4 h-4 text-indigo-200" />
                  <span>Desbloquear y Continuar Evaluación</span>
                </button>
              </form>
            </div>
          </div>
        )}

      {/* 🛡️ PANTALLA COMPLETA OBLIGATORIA OVERLAY */}
      {isJoined &&
        !isEvaluationFinalized &&
        isFullscreenEnforced &&
        !isFullscreen &&
        !isSecurityLocked &&
        !isOutOfTab &&
        !Boolean(currentParticipantData?.isSecurityLocked) &&
        !Boolean(currentParticipantData?.isOutOfTab) && (
          <div
            id="student-fullscreen-required-overlay"
            onClick={enterFullscreen}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-in fade-in duration-150 select-none cursor-pointer"
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                enterFullscreen();
              }}
              className="max-w-md w-full bg-slate-900 border-2 border-indigo-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center text-white"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border-2 border-indigo-400 text-indigo-400 flex items-center justify-center mx-auto shadow-lg animate-pulse">
                <Maximize className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 inline-block">
                  🔒 Modo Examen Seguro
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Pantalla Completa Obligatoria
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Has salido del modo de pantalla completa. Para garantizar la probidad académica institucional y evitar el uso simultáneo de otras aplicaciones, debes permanecer en pantalla completa para responder tu evaluación.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center justify-center gap-2">
                <span>Haz clic en el botón o en cualquier parte para continuar</span>
              </div>

              <button
                type="button"
                id="resume-fullscreen-btn"
                onClick={enterFullscreen}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
              >
                <Maximize className="w-5 h-5" />
                <span>Reanudar Pantalla Completa</span>
              </button>
            </div>
          </div>
        )}

      {/* GOOGLE / BROWSER NATIVE DIALOG WARNING BANNER */}
      {isBrowserDialogWarning && !isSecurityLocked && !isOutOfTab && (
        <div
          onClick={handleAppFocus}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-indigo-600/95 text-white px-5 py-3 rounded-2xl shadow-xl border border-indigo-400 flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top duration-200 cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0" />
          <span>Aviso del navegador detectado (ej. Google / Contraseña). Haz clic aquí para continuar tu prueba.</span>
        </div>
      )}

      {/* SECURITY VIOLATION FLOATING TOAST */}
      {securityToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-rose-600 text-white px-5 py-3 rounded-2xl shadow-xl border border-rose-400 flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top duration-200">
          <ShieldAlert className="w-4 h-4 text-white shrink-0" />
          <span>{securityToast}</span>
        </div>
      )}

      {/* COPY ATTEMPT WARNING BANNER */}
      {showCopyNotice && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-amber-500 text-white px-5 py-3 rounded-2xl shadow-xl border border-amber-300 flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top duration-200">
          <Copy className="w-4 h-4 text-amber-950" />
          <span>⚠️ Acción no permitida. Fue registrada en el feed docente.</span>
        </div>
      )}

      {/* Top Student Header Bar (No score leaks) */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between gap-3 p-3.5 bg-white border border-slate-200 rounded-3xl shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
              isGroup
                ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                : 'bg-indigo-50 border border-indigo-100 text-indigo-700'
            }`}
          >
            {isGroup ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                {displayName}
              </h2>
              {currentParticipantData?.course && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200 shrink-0">
                  {currentParticipantData.course}
                </span>
              )}
              {isGroup && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                  {membersList.length} integrantes
                </span>
              )}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${formBadge.pillBg} border ${formBadge.borderColor} shrink-0`}>
                {formBadge.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {isGroup ? membersList.join(', ') : `PIN: ${session.pin} • Evaluación Sumativa`}
            </p>
          </div>
        </div>

        {/* Action Controls: Status Pill + Scratchpad + Fullscreen + Leave */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live Connection & Offline Queue Pill */}
          <div
            id="student-connection-status-pill"
            onClick={() => {
              if (connectionInfo.pendingCount > 0) {
                realtimeDb.flushOfflineActionQueue();
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition ${
              connectionInfo.isOnline && connectionInfo.pendingCount === 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : connectionInfo.pendingCount > 0
                ? 'bg-amber-50 text-amber-800 border-amber-300 cursor-pointer animate-pulse'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
            title={
              connectionInfo.pendingCount > 0
                ? `${connectionInfo.pendingCount} respuesta(s) guardadas en memoria local. Haz clic para sincronizar ahora.`
                : connectionInfo.isOnline
                ? 'Conectado al servidor en tiempo real. Todas las respuestas seguras.'
                : 'Modo fuera de línea: Tus respuestas se guardan en este dispositivo.'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                connectionInfo.isOnline && connectionInfo.pendingCount === 0
                  ? 'bg-emerald-500'
                  : connectionInfo.pendingCount > 0
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            />
            <span className="hidden sm:inline">
              {connectionInfo.isOnline && connectionInfo.pendingCount === 0
                ? 'En línea'
                : connectionInfo.pendingCount > 0
                ? `Sincronizando (${connectionInfo.pendingCount})`
                : 'Guardado local'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>{Object.keys(currentParticipantData?.answers || {}).length}/{totalQuestions}</span>
          </div>

          <button
            id="student-open-scratchpad-btn"
            onClick={() => {
              enterFullscreen();
              setIsScratchpadOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pizarra</span>
          </button>

          <button
            id="student-fullscreen-toggle-btn"
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            title={isFullscreen ? 'Pantalla completa obligatoria (bloqueada)' : 'Activar pantalla completa'}
          >
            <Maximize className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline text-xs font-bold text-slate-700">
              {isFullscreen ? 'Pantalla Completa 🔒' : 'Pantalla Completa'}
            </span>
          </button>

          <button
            id="student-leave-session-btn"
            onClick={() => setIsLeaveModalOpen(true)}
            title="Cerrar sesión en este dispositivo"
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-100"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-semibold">Salir</span>
          </button>
        </div>
      </div>

      {/* Main Student Question Content */}
      <div className="max-w-3xl w-full mx-auto my-4 flex-1 flex flex-col justify-between">
        {currentQuestion ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            {/* Question Progress Header */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-mono font-bold">
                  Pregunta {activeQIndex + 1} de {totalQuestions}
                </span>
                <span className={`px-2.5 py-0.5 rounded-xl text-xs font-bold ${formBadge.badgeColor} shadow-xs`}>
                  {formBadge.label}
                </span>
                <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">
                  Ponderación: {currentQuestion.points || (activeQIndex >= 10 ? 4 : 2)} pts
                </span>
              </div>

              {session.mode === 'autonomous' && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevAutonomous}
                    disabled={activeQIndex === 0}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-[11px] text-slate-500">
                    {activeQIndex + 1}/{totalQuestions}
                  </span>
                  <button
                    onClick={handleNextAutonomous}
                    disabled={activeQIndex >= totalQuestions - 1}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Question Text with KaTeX */}
            <div className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              <MathText content={currentQuestion.text} />
            </div>

            {/* Multimedia or Interactive Cartesian Plotter */}
            {currentQuestion.interactiveGraph ? (
              <InteractiveCartesianPlotter
                config={currentQuestion.interactiveGraph}
                disabled={Boolean(
                  isSecurityLocked ||
                  isOutOfTab ||
                  isSplitScreen ||
                  currentParticipantData?.isSecurityLocked ||
                  currentParticipantData?.isOutOfTab ||
                  isEvaluationFinalized
                )}
              />
            ) : (
              <ExerciseMedia
                svg={currentQuestion.svg}
                image={currentQuestion.image}
                title={currentQuestion.text}
                className="my-3"
              />
            )}

            {/* Action Bar: Pista Conceptual & Superpoder de Pareja */}
            <div className="flex flex-wrap items-center gap-2.5 my-3">
              {/* 💡 Apartado de Pista Pedagógica General */}
              {questionHint && (
                <button
                  type="button"
                  id={`student-toggle-hint-btn-${activeQIndex}`}
                  onClick={() => setShowHint((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer active:scale-98"
                >
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>{showHint ? 'Ocultar Pista' : '💡 Ver Pista de Apoyo General'}</span>
                </button>
              )}

              {/* ⚡ Superpoder de Pareja: Radar Isométrico (1 uso cada 15 minutos) */}
              <button
                type="button"
                id={`student-superpower-btn-${activeQIndex}`}
                onClick={handleActivateSuperpower}
                disabled={superpowerCooldownRemaining > 0 || Boolean(currentQSuperpower)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold transition shadow-xs active:scale-98 ${
                  currentQSuperpower
                    ? 'bg-purple-950 text-purple-200 border-purple-500/50 cursor-default'
                    : superpowerCooldownRemaining > 0
                    ? 'bg-slate-100 text-slate-500 border-slate-300 cursor-not-allowed opacity-80'
                    : 'bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 text-white border-purple-400 hover:brightness-110 shadow-md animate-pulse cursor-pointer'
                }`}
                title="Superpoder exclusivo de trabajo en parejas: descarta 2 opciones y despliega un análisis deductivo cada 15 minutos."
              >
                <Zap className={`w-4 h-4 ${currentQSuperpower ? 'text-purple-300' : 'text-amber-300 fill-amber-300'}`} />
                {currentQSuperpower ? (
                  <span>⚡ Radar de Pareja Activo</span>
                ) : superpowerCooldownRemaining > 0 ? (
                  <span>⏳ Radar en Recarga ({formatTimeMinutesSeconds(superpowerCooldownRemaining)})</span>
                ) : (
                  <span>⚡ Activar Superpoder de Pareja (Radar Isométrico)</span>
                )}
              </button>
            </div>

            {/* Panel de Pista Conceptual Expandida */}
            {questionHint && showHint && (
              <div className="mb-3 p-3.5 sm:p-4 rounded-2xl bg-amber-50/95 border border-amber-200/80 text-amber-950 text-xs sm:text-sm leading-relaxed shadow-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 font-black text-amber-900 mb-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Pista de Orientación Conceptual:</span>
                </div>
                <div className="text-slate-800 font-medium leading-relaxed">
                  <MathText content={questionHint} />
                </div>
                <p className="mt-2 text-[11px] text-amber-800/80 italic">
                  * Esta pista orienta el razonamiento en equipo; apliquen el cálculo riguroso en su cuaderno de trabajo.
                </p>
              </div>
            )}

            {/* Panel de Análisis Estratégico del Superpoder de Pareja */}
            {currentQSuperpower && (
              <div className="mb-3 p-4 rounded-2xl bg-gradient-to-br from-purple-950/95 via-slate-900 to-indigo-950 text-white border-2 border-purple-400/60 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-purple-800/60">
                  <div className="flex items-center gap-2 text-purple-300 font-black text-xs sm:text-sm uppercase tracking-wider">
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Radar Isométrico de Pareja • Análisis Estratégico</span>
                  </div>
                  <span className="text-[11px] bg-purple-900/80 border border-purple-400/40 text-purple-200 px-2.5 py-0.5 rounded-full font-bold">
                    2 Opciones Descartadas
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
                  {currentQSuperpower.strategicHint}
                </p>
                {currentQSuperpower.keyVertex && (
                  <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-purple-900/50 border border-purple-500/40 text-xs text-amber-200 font-semibold flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Clave de Enfoque: {currentQSuperpower.keyVertex}</span>
                  </div>
                )}
                <div className="mt-2 text-[11px] text-purple-300/80 italic">
                  * El Radar ha bloqueado 2 alternativas estructuralmente falsas para que discutan y justifiquen la opción definitiva. Próxima recarga del superpoder en 15 minutos.
                </div>
              </div>
            )}

            {/* 4 Large Tactile Alternatives (Strict Secrecy: Students can freely select and change answer before submitting) */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentQuestion.options.map((optionText, optIdx) => {
                const isSelected = activeSelectedOption === optIdx;
                const isEliminatedBySuperpower = currentQSuperpower?.eliminated?.includes(optIdx);

                const isSelectionDisabled = Boolean(
                  isSecurityLocked ||
                  isOutOfTab ||
                  isSplitScreen ||
                  currentParticipantData?.isSecurityLocked ||
                  currentParticipantData?.isOutOfTab ||
                  isEvaluationFinalized ||
                  isEliminatedBySuperpower
                );

                const btnStyle = isEliminatedBySuperpower
                  ? 'bg-slate-100/80 border border-dashed border-rose-300 text-slate-400 line-through opacity-50 cursor-not-allowed'
                  : isSelected
                  ? 'bg-indigo-50/90 border-2 border-indigo-600 text-indigo-950 ring-2 ring-indigo-500/20 font-bold shadow-xs'
                  : 'bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 text-slate-800 shadow-2xs';

                const badgeStyle = isEliminatedBySuperpower
                  ? 'bg-slate-200 text-slate-400 border border-slate-300'
                  : isSelected
                  ? 'bg-indigo-600 text-white font-black shadow-xs'
                  : 'bg-slate-100 text-slate-700 border border-slate-200';

                return (
                  <button
                    key={optIdx}
                    id={`student-option-${optIdx}-btn`}
                    disabled={isSelectionDisabled}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left font-semibold text-sm sm:text-base flex items-center gap-3.5 transition-all ${
                      isSelectionDisabled && !isEliminatedBySuperpower ? 'opacity-60 cursor-not-allowed' : ''
                    } ${isEliminatedBySuperpower ? '' : 'cursor-pointer active:scale-[0.99]'} ${btnStyle}`}
                  >
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border shadow-xs ${badgeStyle}`}
                    >
                      {['A', 'B', 'C', 'D', 'E'][optIdx] || `${optIdx + 1}`}
                    </span>
                    <div className="flex-1 min-w-0">
                      <MathText content={optionText} />
                    </div>
                    {isEliminatedBySuperpower ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-lg shrink-0 border border-rose-200 not-italic">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span className="hidden sm:inline">Descartada por Radar</span>
                      </span>
                    ) : isSelected ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-lg shrink-0 border border-indigo-200">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                        <span className="hidden sm:inline">Seleccionada</span>
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-slate-200 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Status & Correction Helper Card */}
            {hasAnswered ? (
              <div className="p-3.5 rounded-2xl border border-indigo-200 bg-indigo-50/70 text-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    Respuesta registrada: <strong>Alternativa {['A', 'B', 'C', 'D', 'E'][activeSelectedOption!] || (activeSelectedOption! + 1)}</strong>
                  </span>
                </div>
                <span className="text-[11px] text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 font-medium shadow-2xs w-fit">
                  ✏️ Puedes cambiarla haciendo clic en otra alternativa antes de entregar
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 text-slate-500 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <span>Sin respuesta seleccionada todavía en esta pregunta.</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Toca A, B, C o D para responder
                </span>
              </div>
            )}

            {/* Quick Question Navigator Palette in Autonomous Mode */}
            {session.mode === 'autonomous' && (
              <div className="pt-2 pb-1 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  <span className="flex items-center gap-1.5">
                    <span>Navegación de Preguntas</span>
                    <span className="text-slate-400 font-normal">({totalQuestions} ejercicios)</span>
                  </span>
                  <span className="text-indigo-600 font-mono font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {Object.keys(currentParticipantData?.answers || localAnswers || {}).length}/{totalQuestions} Respondidas
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {activeQuestionsList.map((_, qIdx) => {
                    const ans = currentParticipantData?.answers?.[qIdx] || localAnswers[qIdx];
                    const isAnswered = ans !== undefined && (ans.selected !== undefined || (ans as any)?.option !== undefined);
                    const isCurrent = qIdx === activeQIndex;

                    return (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() => {
                          if (isSecurityLocked || isOutOfTab) return;
                          setLocalQuestionIndex(qIdx);
                        }}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          isCurrent
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105 ring-2 ring-indigo-400 font-black'
                            : isAnswered
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                        title={`Pregunta ${qIdx + 1}${isAnswered ? ' (Respondida - Haz clic para revisar)' : ' (Pendiente)'}`}
                      >
                        {qIdx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Autonomous Mode Navigation / Finalize Delivery */}
            {session.mode === 'autonomous' && (
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={handlePrevAutonomous}
                  disabled={activeQIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 disabled:opacity-30 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                {activeQIndex < totalQuestions - 1 ? (
                  <button
                    onClick={handleNextAutonomous}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Siguiente Pregunta</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleDeliverAndFinalize}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Entregar y Ver Calificación</span>
                  </button>
                )}
              </div>
            )}

            {/* --- NOTEBOOK EVIDENCE PHOTO CAPTURE SECTION (Temporarily disabled per teacher request) --- */}
            {NOTEBOOK_PHOTOS_ENABLED && (() => {
              const currentPhotos = currentParticipantData?.notebookPhotos || {};
              const thisExercisePhoto = currentPhotos[activeQIndex] || currentPhotos[currentQuestion.id];

              return (
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">
                          Cuaderno de Evidencias (Pregunta {activeQIndex + 1})
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          Captura tus desarrollos matemáticos y bocetos para la revisión docente
                        </p>
                      </div>
                    </div>

                    {thisExercisePhoto && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Foto Enviada
                      </span>
                    )}
                  </div>

                  {/* Hidden File Input with Camera Capture on Mobile */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {thisExercisePhoto ? (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                      <div
                        onClick={() => setPreviewPhotoModalUrl(thisExercisePhoto.photoUrl)}
                        className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative shrink-0">
                          <img
                            src={thisExercisePhoto.photoUrl}
                            alt="Evidencia Cuaderno"
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-200"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition flex items-center justify-center text-white">
                            <Eye className="w-4 h-4 drop-shadow" />
                          </div>
                        </div>

                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">
                              Foto Registrada
                            </span>
                            {thisExercisePhoto.feedback?.status === 'starred' && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Destacado
                              </span>
                            )}
                            {thisExercisePhoto.feedback?.status === 'approved' && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aprobado
                              </span>
                            )}
                            {thisExercisePhoto.feedback?.status === 'needs_review' && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-rose-600" /> Revisar
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {thisExercisePhoto.feedback?.comment
                              ? `Comentario docente: "${thisExercisePhoto.feedback.comment}"`
                              : `Subida ${new Date(thisExercisePhoto.timestamp).toLocaleTimeString()}`}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleTriggerCamera}
                        disabled={isUploadingPhoto}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold shrink-0 transition flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="hidden sm:inline">Reemplazar</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      id="student-take-photo-btn"
                      onClick={handleTriggerCamera}
                      disabled={isUploadingPhoto}
                      className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      <Camera className="w-4 h-4 text-indigo-600" />
                      <span>
                        {isUploadingPhoto
                          ? 'Comprimiendo y enviando evidencia...'
                          : '📸 Tomar Foto al Cuaderno de Evidencias (+30 pts)'}
                      </span>
                    </button>
                  )}
                </div>
              );
            })()}

            {/* --- GROUP CONSENSUS DISCUSSION BOX (COOPERATIVE LEARNING) --- */}
            {isGroup && (
              <div className="pt-3 border-t border-emerald-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900">
                        Consenso y Reflexión del Equipo
                      </h4>
                      <p className="text-[10px] text-emerald-700">
                        Debatan entre los {membersList.length} integrantes y redacten su conclusión
                      </p>
                    </div>
                  </div>

                  {currentParticipantData?.groupConsensusAnswer?.approved && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                      ✓ Consenso Registrado
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <textarea
                    value={consensusDraft}
                    onChange={(e) => setConsensusDraft(e.target.value)}
                    placeholder={`Escriban aquí la justificación matemática acordada por el equipo (ej: 'Demostramos que con k=2 el volumen aumenta 8 veces debido a que 2³=8')...`}
                    rows={2}
                    className="w-full p-3 bg-emerald-50/40 border border-emerald-200 rounded-xl text-xs font-medium text-slate-800 placeholder-emerald-800/40 focus:bg-white focus:border-emerald-500 outline-none transition resize-none"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Integrantes: {membersList.join(', ')}
                    </span>

                    <button
                      onClick={handleSubmitConsensus}
                      disabled={isSubmittingConsensus || !consensusDraft.trim()}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{isSubmittingConsensus ? 'Enviando...' : 'Enviar Conclusión'}</span>
                    </button>
                  </div>

                  {consensusSuccess && (
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 text-[11px] font-bold text-center animate-in fade-in">
                      ¡Conclusión de equipo enviada exitosamente a la pizarra docente!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm">Esperando que el profesor inicie el ejercicio...</p>
          </div>
        )}
      </div>

      {/* Bottom Footer Sentinel & Network Indicator */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between text-[11px] text-slate-400 py-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              connectionInfo.isOnline && connectionInfo.pendingCount === 0
                ? 'bg-emerald-500 animate-pulse'
                : connectionInfo.pendingCount > 0
                ? 'bg-amber-500 animate-bounce'
                : 'bg-rose-500'
            }`}
          />
          <span className="font-medium">
            {connectionInfo.isOnline
              ? connectionInfo.pendingCount > 0
                ? `Sincronizando ${connectionInfo.pendingCount} respuesta(s) con la sala...`
                : 'Conectado en tiempo real • Respuestas sincronizadas'
              : 'Modo seguro local • Respuestas guardadas en tu equipo'}
          </span>
          {connectionInfo.pendingCount > 0 && (
            <button
              onClick={() => realtimeDb.flushOfflineActionQueue()}
              className="text-xs font-bold text-indigo-600 underline hover:text-indigo-800 ml-1"
            >
              Reintentar envío
            </button>
          )}
        </div>
        <span className="text-slate-400">Protección Antifraude y Sesión Activa</span>
      </div>

      {/* Scratchpad Blackboard Modal */}
      <Scratchpad
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />

      {/* Notebook Photo Lightbox Preview Modal */}
      {previewPhotoModalUrl && (
        <div
          onClick={() => setPreviewPhotoModalUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-3 max-w-2xl max-h-[85vh] w-full flex flex-col overflow-hidden shadow-2xl relative"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800">
                  Evidencia Fotográfica de tu Cuaderno
                </span>
              </div>
              <button
                onClick={() => setPreviewPhotoModalUrl(null)}
                className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-900 rounded-2xl p-2">
              <img
                src={previewPhotoModalUrl}
                alt="Cuaderno ampliado"
                className="max-h-[65vh] max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Safe Exit Confirmation Modal */}
      {isLeaveModalOpen && (
        <div
          id="student-leave-confirmation-modal"
          onClick={() => setIsLeaveModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 text-left space-y-5 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <LogOut className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  ¿Seguro que deseas salir de la sesión?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Cerrarás la sesión activa de <span className="font-bold text-slate-700">{displayName}</span> en este dispositivo.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  <strong>Tu progreso está guardado:</strong> Tus respuestas y puntaje ya enviados quedan seguros en el libro de calificaciones del profesor.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">👤</span>
                <span>
                  <strong>Cambio de usuario:</strong> Al salir voluntariamente, podrás registrar e ingresar a otro alumno o equipo en este dispositivo.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">🛡️</span>
                <span>
                  <strong>Cortes o salidas involuntarias:</strong> Si se cae internet, se cierra la pestaña o se apaga el equipo sin presionar &quot;Salir&quot;, tu sesión se restablece automáticamente.
                </span>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                id="cancel-leave-session-btn"
                onClick={() => setIsLeaveModalOpen(false)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition text-center"
              >
                Continuar en la Evaluación
              </button>
              <button
                type="button"
                id="confirm-leave-session-btn"
                onClick={handleConfirmLeave}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition text-center flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sí, Salir de la Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
