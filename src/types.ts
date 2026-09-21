export type SessionMode = 'teacher_paced' | 'autonomous';
export type SessionStatus = 'active' | 'finished' | 'paused';
export type ParticipantType = 'individual' | 'group';
export type LobbyStatus = 'waiting' | 'in_game' | 'finished';
export type TestFormVariant = 'A' | 'B' | 'C' | 'D';

export interface TestFormVariantConfig {
  formCode: TestFormVariant;
  formLetter: TestFormVariant;
  label: string;
  badgeColor: string;
  questions: Question[];
}

export const TEACHER_UNLOCK_PASSWORDS = ['jorge19931d', 'jorge19931D'];
export const isValidTeacherPassword = (pwd: string): boolean => {
  const clean = (pwd || '').trim().toLowerCase();
  return clean === 'jorge19931d' || TEACHER_UNLOCK_PASSWORDS.some((p) => p.toLowerCase() === clean);
};

export interface InteractiveGraphConfig {
  xRange: [number, number];
  yRange: [number, number];
  initialPolygon?: Array<[number, number]>;
  initialLabels?: string[];
  initialColor?: string;
  targetCount: number;
  targetLabels: string[];
  correctPoints: Array<[number, number]>;
  instruction?: string;
  transformationType?: 'traslacion' | 'rotacion' | 'reflexion' | 'composicion';
  axisOfSymmetry?: 'x' | 'y' | 'y=x';
  rotationCenter?: [number, number];
  rotationAngle?: string;
  vector?: [number, number];
}

export interface SuperpowerClue {
  eliminatedOptionIndices: number[]; // indices of 2 wrong options to eliminate
  eliminationReason: string;
  strategicHint: string;
  keyVertexHighlight?: string;
}

export interface Question {
  id: string | number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  hint?: string;
  image?: string; // Web image URL
  svg?: string;   // Embedded SVG markup
  topic?: string;
  grade?: '8° Básico' | '1° Medio' | '2° Medio' | '3° Medio' | '4° Medio' | string;
  points?: number; // e.g. 2 pts for multiple choice, 4 pts for development/context
  itemType?: 'multiple_choice' | 'development' | 'problem_solving';
  itemNumber?: number;
  variants?: Record<TestFormVariant, Question>;
  interactiveGraph?: InteractiveGraphConfig;
  superpowerClue?: SuperpowerClue;
}

export interface CurriculumConfig {
  gradeKey?: string;
  grade: string; // e.g. "2° Medio"
  axisId: string; // e.g. "algebra"
  axisName: string; // e.g. "Álgebra y Funciones"
  oasSelected: string[]; // e.g. ["OA 03", "OA 04"]
}

export interface SessionData {
  pin: string;
  adminKey?: string;
  mode: SessionMode;
  activeQuestion: number;
  status: SessionStatus;
  isLobbyLocked?: boolean; // When true, rooms are strictly closed until teacher opens them
  roomLockedReason?: string;
  lobbyStatus?: LobbyStatus;
  quizData: Question[];
  title?: string;
  gradeLevel?: string;
  curriculum?: CurriculumConfig;
  showAnswers?: boolean; // When teacher reveals answers on projector
  updatedAt?: number;
  schoolName?: string;
  kickedStudents?: Record<string, number>;
  lastRoomCleanedAt?: number;
}

export interface StudentAnswer {
  selected: number;
  option?: number; // Aliased for interoperability
  isCorrect: boolean;
  timestamp: number;
}

export interface NotebookPhotoFeedback {
  status: 'approved' | 'starred' | 'needs_review';
  comment?: string;
  teacherTimestamp?: number;
  scoreBonus?: number;
}

export interface NotebookPhoto {
  exerciseId: string | number; // e.g. 0, 1, 2...
  exerciseTitle?: string;
  photoUrl: string; // Base64 data URL (compressed)
  timestamp: number;
  studentName?: string;
  note?: string;
  feedback?: NotebookPhotoFeedback;
}

export interface StudentMemberDetail {
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  fullName: string;
  listNumber?: number;
}

export interface Student {
  id?: string;
  type?: ParticipantType; // 'individual' | 'group'
  name: string; // Full display name (e.g. "Valentina Morales Castillo" or "Grupo 3 (1°D)")
  firstName?: string; // e.g. "Valentina"
  paternalLastName?: string; // e.g. "Morales"
  maternalLastName?: string; // e.g. "Castillo"
  listNumber?: number; // Official roster list number (e.g. 1 to 45)
  gradeLevel?: string; // e.g. "1° Medio"
  section?: string; // e.g. "D"
  course?: string; // e.g. "1°D" or "1° Medio D"
  courseKey?: string; // e.g. "1_medio_D"
  email?: string; // Student or team contact email for report delivery
  groupNumber?: number | string | null; // e.g. 3 or "Grupo 3"
  members?: string[]; // e.g. ["Hans Araya Flores", "Dante González Vega"]
  membersDetails?: StudentMemberDetail[];
  currentQ: number;
  correct: number;
  errors: number;
  tabEscapes: number;
  isOutOfTab: boolean;
  outOfTabTimestamp?: number | null;
  totalSecondsAway?: number;
  copyAttempts?: number;
  splitScreenAttempts?: number;
  tabAttempts?: number;
  screenshotAttempts?: number;
  devtoolsAttempts?: number;
  secondMonitorAttempts?: number;
  isSplitScreen?: boolean;
  isSecurityLocked?: boolean;
  securityLockReason?: string | null;
  securityViolationReason?: string | null;
  securityLockTimestamp?: number | null;
  lastAction: string;
  answers: Record<string | number, StudentAnswer>;
  notebookPhotos?: Record<string | number, NotebookPhoto>;
  groupConsensusAnswer?: {
    text: string;
    submittedAt: number;
    approved?: boolean;
  };
  joinedAt?: number;
  lastActive?: number;
  last_active?: number;
  connected?: boolean;
  isDisconnectedSuspicious?: boolean;
  hardwarePeripheralsDetected?: number;
  integrityGuardFailures?: number;
  integrityGuardPending?: boolean;
  device?: string;
  score?: number;
  testVariant?: TestFormVariant;
  isFinalized?: boolean;
  finalizedAt?: number;
}

export type FeedEventType =
  | 'correct'
  | 'error'
  | 'escape'
  | 'return'
  | 'join'
  | 'quiz_reset'
  | 'kick'
  | 'copy_attempt'
  | 'photo_upload'
  | 'photo_grade'
  | 'consensus_submit'
  | 'cheat_alert'
  | 'security_unlock'
  | 'info';

export interface FeedEvent {
  id?: string;
  student: string;
  studentId?: string;
  type: FeedEventType;
  detail: string;
  timestamp: number;
}

export interface ClassroomDatabaseState {
  session: SessionData;
  students: Record<string, Student>;
  feed: Record<string, FeedEvent>;
}

export interface GradebookEntry {
  studentId: string;
  participantName: string;
  type: ParticipantType;
  course?: string; // e.g. "1°D"
  courseKey?: string; // e.g. "1_medio_D"
  gradeLevel?: string; // e.g. "1° Medio"
  section?: string; // e.g. "D"
  firstName?: string;
  paternalLastName?: string;
  maternalLastName?: string;
  listNumber?: number;
  members?: string[];
  membersDetails?: StudentMemberDetail[];
  correct: number;
  errors: number;
  totalQuestions: number;
  score: number;
  notebookPhotosCount: number;
  grade: number; // 1.0 - 7.0
  passed: boolean;
  timestamp: number;
  testVariant?: TestFormVariant;
  answers?: Record<string | number, StudentAnswer>;
  isFinalized?: boolean;
  finalizedAt?: number;
}

export interface CourseSectionInfo {
  key: string; // e.g. "1_medio_D"
  levelKey: string; // e.g. "1_medio"
  levelLabel: string; // e.g. "1° Medio"
  section: string; // e.g. "D"
  shortLabel: string; // e.g. "1°D"
  fullLabel: string; // e.g. "1° Medio D"
}

export const SCHOOL_LEVELS = [
  { key: '7_basico', label: '7° Básico', shortLabel: '7°', category: 'basica' },
  { key: '8_basico', label: '8° Básico', shortLabel: '8°', category: 'basica' },
  { key: '1_medio', label: '1° Medio', shortLabel: '1°', category: 'media' },
  { key: '2_medio', label: '2° Medio', shortLabel: '2°', category: 'media' },
  { key: '3_medio', label: '3° Medio', shortLabel: '3°', category: 'media' },
  { key: '4_medio', label: '4° Medio', shortLabel: '4°', category: 'media' },
] as const;

export const SCHOOL_SECTIONS = ['A', 'B', 'C', 'D', 'E'] as const;

export const ALL_SCHOOL_COURSES: CourseSectionInfo[] = SCHOOL_LEVELS.flatMap((lvl) =>
  SCHOOL_SECTIONS.map((sec) => ({
    key: `${lvl.key}_${sec}`,
    levelKey: lvl.key,
    levelLabel: lvl.label,
    section: sec,
    shortLabel: `${lvl.shortLabel}${sec}`,
    fullLabel: `${lvl.label} ${sec}`,
  }))
);

export interface GradebookCourseRecord {
  id: string;
  courseKey: string; // e.g. "8_basico_A"
  courseName: string; // e.g. "8° Básico A"
  activityTitle: string;
  pin?: string; // Room PIN e.g. "MAT-904"
  date: string;
  timestamp: number;
  totalParticipants: number;
  averageGrade: number;
  passingRate?: number;
  entries: GradebookEntry[];
  isFinalized?: boolean;
  finalizedAt?: number;
  reportSentTo?: string;
  reportSentAt?: number;
}

export interface FirebaseConfigOptions {
  apiKey?: string;
  authDomain?: string;
  databaseURL: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export interface QuizPreset {
  id: string;
  title: string;
  grade: '8° Básico' | '1° Medio' | '2° Medio' | '3° Medio' | '4° Medio';
  topic: string;
  description: string;
  questions: Question[];
  variants?: TestFormVariantConfig[];
}

/**
 * Dynamic classroom score formula:
 * Score = (Correct * 100) + (NotebookPhotos * 30) - (Errors * 20) - (Escapes * 50) - (SecondsAway * 1)
 */
export function calculateStudentScore(student: Student, currentLiveAwaySeconds: number = 0): number {
  const correctPoints = (student.correct || 0) * 100;
  const photoBonus = Object.keys(student.notebookPhotos || {}).length * 30;
  const errorPenalty = (student.errors || 0) * 20;
  const escapePenalty = (student.tabEscapes || 0) * 50;
  const totalSeconds = (student.totalSecondsAway || 0) + currentLiveAwaySeconds;
  const timeAwayPenalty = totalSeconds * 1;
  return Math.max(0, correctPoints + photoBonus - errorPenalty - escapePenalty - timeAwayPenalty);
}

/**
 * Chilean Grading Scale (Escala de notas 1.0 a 7.0 al 60% de exigencia)
 */
export function calculateChileanGrade(score: number, maxScore: number, demandPct: number = 0.6): number {
  if (maxScore <= 0) return 7.0;
  const safeScore = Math.max(0, Math.min(score, maxScore));
  const cutOff = maxScore * demandPct;

  if (safeScore < cutOff) {
    // 1.0 to 4.0
    const grade = 1.0 + 3.0 * (safeScore / cutOff);
    return Math.round(grade * 10) / 10;
  } else {
    // 4.0 to 7.0
    const grade = 4.0 + 3.0 * ((safeScore - cutOff) / (maxScore - cutOff));
    return Math.round(grade * 10) / 10;
  }
}
