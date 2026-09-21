/**
 * offlineAnswersDb.ts
 * IndexedDB-based local state synchronization strategy to buffer student answers
 * during network instability, guaranteeing zero data loss across brief disconnects.
 */

export interface BufferedAnswer {
  id: string; // `${participantId}_q${questionIndex}`
  participantId: string;
  questionIndex: number;
  selectedOption: number;
  isCorrect: boolean;
  timestamp: number;
  synced: boolean;
  retryCount: number;
  lastAttemptAt?: number;
}

const DB_NAME = 'MatematicaEvaluacionesDB';
const DB_VERSION = 1;
const STORE_NAME = 'buffered_student_answers';

let dbInstance: IDBDatabase | null = null;
let dbInitPromise: Promise<IDBDatabase | null> | null = null;

/**
 * Initialize or get open instance of IndexedDB
 */
export async function getAnswersDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return null;
  }

  if (dbInstance) {
    return dbInstance;
  }

  if (dbInitPromise) {
    return dbInitPromise;
  }

  dbInitPromise = new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('by_participant', 'participantId', { unique: false });
          store.createIndex('by_synced', 'synced', { unique: false });
          store.createIndex('by_timestamp', 'timestamp', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        dbInstance = (event.target as IDBOpenDBRequest).result;
        dbInstance.onversionchange = () => {
          dbInstance?.close();
          dbInstance = null;
        };
        resolve(dbInstance);
      };

      request.onerror = (err) => {
        console.warn('IndexedDB failed to open, fallback to in-memory/localStorage:', err);
        resolve(null);
      };
    } catch (e) {
      console.warn('IndexedDB initialization exception:', e);
      resolve(null);
    }
  });

  return dbInitPromise;
}

/**
 * Buffer a student answer locally in IndexedDB immediately upon selection
 */
export async function bufferAnswerLocally(
  participantId: string,
  questionIndex: number,
  selectedOption: number,
  isCorrect: boolean
): Promise<BufferedAnswer> {
  const answerRecord: BufferedAnswer = {
    id: `${participantId}_q${questionIndex}`,
    participantId,
    questionIndex,
    selectedOption,
    isCorrect,
    timestamp: Date.now(),
    synced: false,
    retryCount: 0,
  };

  try {
    const db = await getAnswersDB();
    if (db) {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(answerRecord);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } else {
      // Fallback to localStorage if IndexedDB is unavailable
      const storageKey = `mat_idb_fallback_${participantId}_q${questionIndex}`;
      localStorage.setItem(storageKey, JSON.stringify(answerRecord));
    }
  } catch (err) {
    console.warn('Failed to write to IndexedDB, fallback stored:', err);
    try {
      const storageKey = `mat_idb_fallback_${participantId}_q${questionIndex}`;
      localStorage.setItem(storageKey, JSON.stringify(answerRecord));
    } catch {}
  }

  return answerRecord;
}

/**
 * Mark a buffered answer as successfully synced to Firebase / Server
 */
export async function markAnswerAsSynced(participantId: string, questionIndex: number): Promise<void> {
  const id = `${participantId}_q${questionIndex}`;
  try {
    const db = await getAnswersDB();
    if (db) {
      await new Promise<void>((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get(id);
        getReq.onsuccess = () => {
          const item = getReq.result as BufferedAnswer | undefined;
          if (item) {
            item.synced = true;
            item.lastAttemptAt = Date.now();
            store.put(item);
          }
          resolve();
        };
        getReq.onerror = () => resolve();
      });
    }

    // Clean up fallback if present
    const storageKey = `mat_idb_fallback_${id}`;
    localStorage.removeItem(storageKey);
  } catch (err) {
    console.warn('Error marking answer synced in IndexedDB:', err);
  }
}

/**
 * Retrieve all unsynced answers (optionally filtered by participantId)
 */
export async function getUnsyncedAnswers(participantId?: string): Promise<BufferedAnswer[]> {
  try {
    const db = await getAnswersDB();
    if (db) {
      return new Promise<BufferedAnswer[]>((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          let list = (req.result as BufferedAnswer[]) || [];
          list = list.filter((item) => !item.synced);
          if (participantId) {
            list = list.filter((item) => item.participantId === participantId);
          }
          resolve(list);
        };
        req.onerror = () => resolve([]);
      });
    }
  } catch (err) {
    console.warn('Error reading unsynced answers from IndexedDB:', err);
  }

  // Fallback check in localStorage
  const fallbackList: BufferedAnswer[] = [];
  if (typeof window !== 'undefined') {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('mat_idb_fallback_')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const item = JSON.parse(raw) as BufferedAnswer;
            if (!item.synced && (!participantId || item.participantId === participantId)) {
              fallbackList.push(item);
            }
          }
        }
      }
    } catch {}
  }

  return fallbackList;
}

/**
 * Retrieve all buffered answers for a specific student to recover state upon reconnection
 */
export async function getAllBufferedAnswers(participantId: string): Promise<BufferedAnswer[]> {
  try {
    const db = await getAnswersDB();
    if (db) {
      return new Promise<BufferedAnswer[]>((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          const list = (req.result as BufferedAnswer[]) || [];
          resolve(list.filter((item) => item.participantId === participantId));
        };
        req.onerror = () => resolve([]);
      });
    }
  } catch (err) {
    console.warn('Error reading buffered answers from IndexedDB:', err);
  }

  return [];
}

/**
 * Clear all buffered records for a student when a session is finalized or cleaned
 */
export async function clearStudentAnswersBuffer(participantId: string): Promise<void> {
  try {
    const db = await getAnswersDB();
    if (db) {
      const all = await getAllBufferedAnswers(participantId);
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      all.forEach((item) => store.delete(item.id));
    }
  } catch (err) {
    console.warn('Error clearing IndexedDB student buffer:', err);
  }
}
