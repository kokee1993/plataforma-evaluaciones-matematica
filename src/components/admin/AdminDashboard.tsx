import React, { useState, useEffect } from 'react';
import { ClassroomDatabaseState, SessionMode, Student, calculateStudentScore } from '../../types';
import { realtimeDb } from '../../lib/firebase';
import { audioAlert } from '../../lib/audio';
import { MathText, ExerciseMedia } from '../MathRenderer';
import { LiveStatsChart } from './LiveStatsChart';
import { QuestionPerformanceTrendsChart } from './QuestionPerformanceTrendsChart';
import { LiveFeed } from './LiveFeed';
import { StudentMonitor } from './StudentMonitor';
import { ContentManagerModal } from './ContentManagerModal';
import { CurriculumSelectorModal } from './CurriculumSelectorModal';
import { QRCodeModal } from './QRCodeModal';
import { RankingModal } from './RankingModal';
import { NotebookViewerModal } from './NotebookViewerModal';
import { GradebookModal } from './GradebookModal';
import { GradebookReportModal } from './GradebookReportModal';
import { AdminResetModal } from './AdminResetModal';
import { SecurityAlertsModal } from './SecurityAlertsModal';
import { getQuestionsForSelectedCurriculum } from '../../data/mineducCurriculum';
import { CurriculumConfig, GradebookCourseRecord } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  QrCode,
  Maximize2,
  Minimize2,
  Trophy,
  Volume2,
  VolumeX,
  RotateCcw,
  GraduationCap,
  CheckCircle2,
  Eye,
  EyeOff,
  Clock,
  ShieldAlert,
  HelpCircle,
  Download,
  Lock,
  Unlock,
  Smartphone,
  Scale,
  Users,
  Target,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  School,
  Camera,
  FileSpreadsheet,
  FileText,
  Play,
  Pause,
  Power,
  AlertOctagon,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

// Notebook photos temporarily disabled per teacher request (set to true to re-enable)
const NOTEBOOK_PHOTOS_ENABLED = false;

interface AdminDashboardProps {
  data: ClassroomDatabaseState;
  onLogoutTeacher?: () => void;
  onReturnToHub?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ data, onLogoutTeacher, onReturnToHub }) => {
  const { session, students, feed } = data;
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isNotebookModalOpen, setIsNotebookModalOpen] = useState(false);
  const [isGradebookModalOpen, setIsGradebookModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeReportRecord, setActiveReportRecord] = useState<GradebookCourseRecord | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isSecurityAlertsModalOpen, setIsSecurityAlertsModalOpen] = useState(false);
  const [selectedNotebookStudentId, setSelectedNotebookStudentId] = useState<string | undefined>(undefined);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(audioAlert.getIsMuted());
  const [now, setNow] = useState(Date.now());

  const handleApplyCurriculum = (curriculum: CurriculumConfig) => {
    const questions = getQuestionsForSelectedCurriculum(
      curriculum.gradeKey || '8_basico',
      curriculum.axisId,
      curriculum.oasSelected
    );
    realtimeDb.setCurriculumSession(curriculum, questions);
  };

  // Live clock ticker for real-time stopwatches
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentQIndex = session.activeQuestion || 0;
  const currentQuestion = session.quizData?.[currentQIndex];
  const totalQuestions = session.quizData?.length || 0;

  // Global Metrics Calculation
  const studentEntries = Object.entries(students || {}) as [string, Student][];
  const totalStudents = studentEntries.length;
  const totalCorrect = studentEntries.reduce((acc, [_, s]) => acc + (s.correct || 0), 0);
  const totalErrors = studentEntries.reduce((acc, [_, s]) => acc + (s.errors || 0), 0);
  const totalEscapes = studentEntries.reduce((acc, [_, s]) => acc + (s.tabEscapes || 0), 0);
  const totalAnswers = totalCorrect + totalErrors;
  const globalAccuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  // Security and Lock status
  const lockedStudents = studentEntries.filter(([_, s]) => s.isSecurityLocked || s.isOutOfTab);
  const lockedStudentsCount = lockedStudents.length;
  const totalSecurityInfractions = studentEntries.reduce((acc, [_, s]) => {
    return (
      acc +
      (s.tabEscapes || 0) +
      (s.screenshotAttempts || 0) +
      (s.splitScreenAttempts || 0) +
      (s.copyAttempts || 0) +
      (s.devtoolsAttempts || 0) +
      (s.secondMonitorAttempts || 0)
    );
  }, 0);

  // Find all students currently out of tab
  const outOfTabStudents = studentEntries
    .filter(([_, s]) => s.isOutOfTab)
    .map(([id, s]) => {
      const elapsed = s.outOfTabTimestamp
        ? Math.max(0, Math.floor((now - s.outOfTabTimestamp) / 1000))
        : 0;
      return { id, name: s.name, elapsed, escapes: s.tabEscapes || 1 };
    });

  const handlePrevQuestion = () => {
    if (currentQIndex > 0) {
      realtimeDb.setActiveQuestion(currentQIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < totalQuestions - 1) {
      realtimeDb.setActiveQuestion(currentQIndex + 1);
    }
  };

  const handleToggleMode = (mode: SessionMode) => {
    realtimeDb.setSessionMode(mode);
  };

  const toggleAudioMute = () => {
    const newMuted = !isAudioMuted;
    audioAlert.setMuted(newMuted);
    setIsAudioMuted(newMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleQuickExportCSV = () => {
    const studentList = studentEntries.map(([id, st]) => {
      const liveAwaySeconds =
        st.isOutOfTab && st.outOfTabTimestamp
          ? Math.max(0, Math.floor((now - st.outOfTabTimestamp) / 1000))
          : 0;
      const totalSecondsAway = (st.totalSecondsAway || 0) + liveAwaySeconds;
      const score = calculateStudentScore(st, liveAwaySeconds);
      const answeredCount = (st.correct || 0) + (st.errors || 0);
      const accuracy = answeredCount > 0 ? Math.round(((st.correct || 0) / answeredCount) * 100) : 0;
      return {
        ...st,
        score,
        totalSecondsAway,
        accuracy,
      };
    });

    studentList.sort((a, b) => b.score - a.score);

    const headers = [
      'Posicion',
      'Nombre',
      'Puntaje',
      'Aciertos',
      'Errores',
      'Incidencias_Salida',
      'Segundos_Fuera_App',
      'Intentos_Copia',
      'Precision_Porc',
      'Dispositivo',
    ];

    const rows = studentList.map((s, idx) => [
      idx + 1,
      `"${s.name.replace(/"/g, '""')}"`,
      s.score,
      s.correct,
      s.errors,
      s.tabEscapes || 0,
      s.totalSecondsAway,
      s.copyAttempts || 0,
      `${s.accuracy}%`,
      `"${s.device || 'Movil'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `Calificaciones_${session.title.replace(/\s+/g, '_')}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-3 sm:p-5 lg:p-6 space-y-5">
      {/* 1. TOP PROJECTION CONTROL BAR */}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 bg-white border border-slate-200 rounded-3xl shadow-sm">
        {/* Left: Session Title, Grade & Curriculum Breadcrumbs */}
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono">
                {session.gradeLevel || 'MINEDUC'}
              </span>
              {session.curriculum && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {session.curriculum.axisName} • {session.curriculum.oasSelected.join(', ')}
                </span>
              )}
              <span className="text-xs text-slate-400 font-medium">Panel Docente / Proyector</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
              <span>{session.title || 'Materia de Matemáticas'}</span>
            </h1>
          </div>
        </div>

        {/* Center: Big PIN, QR Code trigger & Prominent Room Status ON/OFF Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                PIN de Ingreso Alumno
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-indigo-600">
                {session.pin}
              </span>
            </div>
            <button
              id="admin-open-qr-btn"
              onClick={() => setIsQRModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Proyectar QR</span>
            </button>
          </div>

          {/* Room Status Indicator & 1-Click Toggle: ON (Active/Open) vs OFF (Paused/Locked) */}
          {(() => {
            const isRoomActive = session.status !== 'paused' && !session.isLobbyLocked;

            return (
              <button
                id="admin-toggle-room-status-btn"
                onClick={() => {
                  const nextStatus = isRoomActive ? 'paused' : 'active';
                  realtimeDb.setSessionStatus(nextStatus);
                }}
                title={
                  isRoomActive
                    ? 'Sala ABIERTA / ACTIVA para los alumnos. Haz clic aquí para CERRAR / BLOQUEAR la sala inmediatamente.'
                    : 'Sala CERRADA / BLOQUEADA por el docente. Nadie puede ingresar sin tu autorización. Haz clic para ABRIR LA SALA (ON).'
                }
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer shadow-md select-none ${
                  isRoomActive
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-400 shadow-emerald-600/30'
                    : 'bg-rose-600 hover:bg-rose-700 text-white border-rose-300 shadow-rose-600/30 ring-2 ring-rose-500/20 animate-pulse'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3.5 w-3.5">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isRoomActive ? 'bg-emerald-200' : 'bg-rose-200'
                      }`}
                    />
                    <span
                      className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"
                    />
                  </span>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      {isRoomActive ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      <span className="text-xs sm:text-sm font-black tracking-wide uppercase">
                        {isRoomActive ? 'SALA ABIERTA (ON)' : 'SALA CERRADA (OFF)'}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold opacity-90 block leading-tight">
                      {isRoomActive ? '🟢 Alumnos autorizados • Click para Cerrar' : '🔒 Sala Bloqueada • Click para Abrir'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })()}
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Return to Teacher Hub */}
          {onReturnToHub && (
            <button
              id="admin-return-to-hub-btn"
              onClick={onReturnToHub}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition"
              title="Volver al Hub Curricular Docente"
            >
              <School className="w-4 h-4 text-amber-300" />
              <span>🏛️ Hub Curricular</span>
            </button>
          )}

          {/* Main MINEDUC Curriculum Selector Button */}
          <button
            id="admin-open-curriculum-modal-btn"
            onClick={() => setIsCurriculumModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition"
            title="Abrir Asistente Curricular MINEDUC (8° Básico a 4° Medio)"
          >
            <BookOpen className="w-4 h-4 text-indigo-200" />
            <span>⚙️ Cambiar Materia / OA</span>
          </button>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
            <button
              id="mode-teacher-paced-btn"
              onClick={() => handleToggleMode('teacher_paced')}
              title="El docente avanza las preguntas en sincronía"
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                session.mode === 'teacher_paced'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Guiado por Docente
            </button>
            <button
              id="mode-autonomous-btn"
              onClick={() => handleToggleMode('autonomous')}
              title="Los alumnos avanzan a su propio ritmo"
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                session.mode === 'autonomous'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Ritmo Autónomo
            </button>
          </div>

          <button
            id="admin-open-ranking-btn"
            onClick={() => setIsRankingModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition"
            title="Ver Podio y Tabla de Puntuaciones"
          >
            <Trophy className="w-4 h-4" />
            <span>🏆 Ranking</span>
          </button>

          {/* Security & Anti-Cheat Alerts Control Button */}
          <button
            id="admin-open-security-alerts-btn"
            onClick={() => setIsSecurityAlertsModalOpen(true)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black shadow-md transition ${
              lockedStudentsCount > 0
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-600/40 ring-2 ring-rose-400'
                : totalSecurityInfractions > 0
                ? 'bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 shadow-xs'
                : 'bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 shadow-xs'
            }`}
            title="Centro de Control de Seguridad, Probidad Académica y Desbloqueos"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>
              🛡️ Alertas de Seguridad
              {lockedStudentsCount > 0
                ? ` (${lockedStudentsCount} Bloqueados)`
                : totalSecurityInfractions > 0
                ? ` (${totalSecurityInfractions})`
                : ''}
            </span>
          </button>

          {/* Notebook Photos Button (Disabled temporarily per teacher preference) */}
          {NOTEBOOK_PHOTOS_ENABLED && (
            <button
              id="admin-open-notebook-viewer-btn"
              onClick={() => {
                setSelectedNotebookStudentId(undefined);
                setIsNotebookModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 text-indigo-900 text-xs font-bold transition shadow-xs"
              title="Inspeccionar cuadernos de evidencias y fotos en vivo"
            >
              <Camera className="w-4 h-4 text-indigo-600" />
              <span>📸 Cuadernos</span>
            </button>
          )}

          <button
            id="admin-open-gradebook-btn"
            onClick={() => setIsGradebookModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold transition shadow-xs"
            title="Libro de Calificaciones MINEDUC con escala al 60%"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>📋 Libro de Clases</span>
          </button>

          <button
            id="admin-open-report-pdf-btn"
            onClick={async () => {
              const records = await realtimeDb.fetchGradebookRecords();
              const currentPin = (session?.pin || '').trim().toUpperCase();
              const rec =
                records.find((r) => r.pin === currentPin || (r.id && r.id.includes(currentPin))) ||
                records[0];
              setActiveReportRecord(rec || null);
              setIsReportModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 text-indigo-950 text-xs font-bold transition shadow-xs cursor-pointer"
            title="Visualizar acta oficial y descargar directamente en PDF (Escala 60% MINEDUC)"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>📄 Reporte PDF</span>
          </button>

          <button
            id="admin-scroll-trends-btn"
            onClick={() => {
              const el = document.getElementById('section-performance-trends');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition shadow-xs"
            title="Ver gráficos Recharts con tendencias de precisión y detección de errores comunes"
          >
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>📈 Tendencias & Errores</span>
          </button>

          <button
            id="admin-open-content-manager-btn"
            onClick={() => setIsContentModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold transition"
            title="Editor personalizado de preguntas"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Editor Manual</span>
          </button>

          <button
            id="admin-export-csv-direct-btn"
            onClick={handleQuickExportCSV}
            title="Descargar Reporte CSV de Notas"
            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Lobby Status Controller */}
          <button
            id="admin-toggle-lobby-status-btn"
            onClick={() => {
              const nextStatus = session.lobbyStatus === 'waiting' ? 'in_game' : 'waiting';
              realtimeDb.setLobbyStatus(nextStatus);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition ${
              session.lobbyStatus === 'waiting'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse shadow-emerald-600/30'
                : 'bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700'
            }`}
            title={
              session.lobbyStatus === 'waiting'
                ? 'Los alumnos están en sala de espera. Haz clic para INICIAR la evaluación'
                : 'Habilitar sala de espera interactiva con mini-juegos'
            }
          >
            {session.lobbyStatus === 'waiting' ? (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>🚀 Iniciar Evaluación ({totalStudents})</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                <span>🎮 Sala Espera</span>
              </>
            )}
          </button>

          {/* Sound Alert Toggle */}
          <button
            id="admin-toggle-audio-btn"
            onClick={toggleAudioMute}
            title={isAudioMuted ? 'Activar sonido de alarmas' : 'Silenciar alarmas'}
            className={`p-2 rounded-xl border transition ${
              isAudioMuted
                ? 'bg-slate-100 border-slate-200 text-slate-400'
                : 'bg-indigo-50 border-indigo-200 text-indigo-600'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Admin Safe Reset Modal Trigger */}
          <button
            id="admin-open-reset-modal-btn"
            onClick={() => setIsResetModalOpen(true)}
            title="Reinicio Seguro y Gestión de Salas (Solo Admin - Guarda en Historial)"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition shadow-xs"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">Reiniciar / Nueva Sala</span>
          </button>

          <button
            id="admin-toggle-fullscreen-btn"
            onClick={toggleFullscreen}
            title="Pantalla Completa para Proyector"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onLogoutTeacher && (
            <button
              id="admin-logout-teacher-btn"
              onClick={onLogoutTeacher}
              title="Bloquear y Cerrar Sesión Docente"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cerrar Sesión</span>
            </button>
          )}
        </div>
      </div>

      {/* PAUSED ROOM PROMINENT ALERT BANNER */}
      {session.status === 'paused' && (
        <div className="max-w-7xl mx-auto p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 text-white border-2 border-rose-400 shadow-xl shadow-rose-900/25 flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
              <AlertOctagon className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-black/30 px-2.5 py-0.5 rounded-full text-rose-200 border border-white/20">
                  🔴 SALA EN PAUSA / DESACTIVADA
                </span>
                <span className="text-xs text-rose-200 font-medium">
                  Alumnos congelados ({totalStudents})
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                La sala está desactivada temporalmente: los estudiantes no pueden responder ni interactuar
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                Tus alumnos visualizan el mensaje de pausa con sus avances guardados. Haz clic en Activar cuando desees reanudar.
              </p>
            </div>
          </div>

          <button
            id="admin-banner-reactivate-btn"
            onClick={() => realtimeDb.setSessionStatus('active')}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-800 font-black text-xs sm:text-sm shadow-xl transition flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <Power className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>🟢 Reactivar Sala Ahora (ON)</span>
          </button>
        </div>
      )}

      {/* SECURITY LOCK ACTIVE ALERT BANNER */}
      {lockedStudentsCount > 0 && (
        <div className="max-w-7xl mx-auto p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 text-white border-2 border-rose-300 shadow-xl shadow-rose-950/25 flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
              <Lock className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-black/30 px-2.5 py-0.5 rounded-full text-rose-200 border border-white/20">
                  🚨 ALERTA DE PROBIDAD ACADÉMICA
                </span>
                <span className="text-xs font-mono font-black text-amber-200">
                  {lockedStudentsCount} {lockedStudentsCount === 1 ? 'Evaluación Bloqueada' : 'Evaluaciones Bloqueadas'}
                </span>
              </div>
              <h3 className="text-base font-black tracking-tight mt-0.5">
                Alumnos bloqueados por salida de pestaña o intento de atajo
              </h3>
              <p className="text-xs text-rose-100 font-medium">
                Los alumnos deben esperar a que el profesor ingrese su contraseña (ej: <strong className="font-mono bg-white/20 px-1.5 py-0.5 rounded">PROFE2025</strong>) en su dispositivo o los desbloquee desde este panel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => realtimeDb.unlockAllStudentsSecurity()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-700/40 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Unlock className="w-4 h-4" />
              <span>Desbloquear a Todos ({lockedStudentsCount})</span>
            </button>
            <button
              onClick={() => setIsSecurityAlertsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-900 font-black text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Ver Alertas & Desbloquear</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. GLOBAL LIVE METRICS SUMMARY BAR */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Alumnos Conectados
            </span>
            <div className="text-xl font-mono font-black text-slate-900">
              {totalStudents} <span className="text-xs text-slate-400 font-normal">/ 50 máx</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">
              Total Aciertos
            </span>
            <div className="text-xl font-mono font-black text-emerald-600">
              {totalCorrect}
            </div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">
              Total Errores
            </span>
            <div className="text-xl font-mono font-black text-rose-600">
              {totalErrors}
            </div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">
              Salidas de App
            </span>
            <div className="text-xl font-mono font-black text-amber-600">
              {totalEscapes}
            </div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">
              Precisión Global
            </span>
            <div className="text-xl font-mono font-black text-indigo-600">
              {globalAccuracy}%
            </div>
          </div>
        </div>
      </div>

      {/* 3. PROJECTED REGULATION & DISCIPLINARY NOTICE (LEY CERO CELULARES) */}
      <div className="max-w-7xl mx-auto">
        <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-md flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-amber-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                  NORMATIVA ESCOLAR & LEY CERO CELULARES
                </span>
                <span className="text-xs text-indigo-200 font-medium hidden md:inline">
                  Supervisión Pedagógica Activa
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                El uso del dispositivo en sala está autorizado <strong>estrictamente para responder esta evaluación</strong>. Toda salida de pantalla o minimización queda registrada con cronómetro público en la pizarra.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-300 font-mono font-bold bg-white/10 px-3 py-1.5 rounded-xl">
            <Clock className="w-4 h-4" />
            <span>Monitoreo Sentinel 1.8s Activo</span>
          </div>
        </div>
      </div>

      {/* 4. LIVE ESCAPE ALARM TICKER BANNER (If any student is currently out) */}
      {outOfTabStudents.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="p-4 rounded-3xl bg-rose-600 text-white shadow-xl flex flex-wrap items-center justify-between gap-3 animate-pulse border-2 border-rose-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white text-rose-600 shadow-md">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest bg-rose-900 px-2.5 py-0.5 rounded text-amber-300">
                  🚨 ALERTA DISCIPLINARIA DE FOCO EN VIVO ({outOfTabStudents.length} ALUMNOS)
                </span>
                <div className="text-sm font-bold mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  {outOfTabStudents.map((s) => (
                    <span key={s.id} className="inline-flex items-center gap-1.5 bg-rose-800/90 px-3 py-1 rounded-xl border border-rose-400/40">
                      <span><strong>{s.name}</strong> está fuera de la app</span>
                      <span className="font-mono text-amber-300 font-black">
                        (Lleva {formatSeconds(s.elapsed)})
                      </span>
                      <span className="text-[11px] text-white/80">| Salida #{s.escapes}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-xs font-bold text-rose-100 bg-rose-900/80 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Descontando puntos en ranking en tiempo real</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. MAIN PROJECTION GRID: Big Exercise Presentation + Live Stats + Live Feed */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Big Exercise Presentation for Projector (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {currentQuestion ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex-1 flex flex-col justify-between">
              <div>
                {/* Question Top Header */}
                <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-mono font-bold">
                      Pregunta {currentQIndex + 1} de {totalQuestions}
                    </span>
                    {currentQuestion.topic && (
                      <span className="text-xs text-slate-500 font-medium">
                        • {currentQuestion.topic}
                      </span>
                    )}
                  </div>

                  {/* Question Stepper Dots */}
                  <div className="flex items-center gap-1.5 max-w-[200px] overflow-x-auto">
                    {session.quizData.map((_, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => realtimeDb.setActiveQuestion(qIdx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          qIdx === currentQIndex
                            ? 'bg-indigo-600 scale-125 shadow-sm ring-2 ring-indigo-200'
                            : 'bg-slate-200 hover:bg-slate-300'
                        }`}
                        title={`Ir a pregunta ${qIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Big Question Prompt with Math KaTeX Rendering */}
                <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed my-4">
                  <MathText content={currentQuestion.text} />
                </div>

                {/* Centered Multimedia (SVG or Web Image) */}
                <ExerciseMedia
                  svg={currentQuestion.svg}
                  image={currentQuestion.image}
                  title={currentQuestion.text}
                  className="my-6"
                />

                {/* Question Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  {currentQuestion.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === currentQuestion.correctAnswer;
                    const isRevealed = session.showAnswers && isCorrect;

                    return (
                      <div
                        key={optIdx}
                        className={`p-4 rounded-2xl border transition-all flex items-center gap-3 text-sm sm:text-base font-semibold ${
                          isRevealed
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md ring-2 ring-emerald-400/30'
                            : session.showAnswers
                            ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                            : 'bg-slate-50/70 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                            isRevealed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-slate-700 border border-slate-200'
                          }`}
                        >
                          {['A', 'B', 'C', 'D', 'E'][optIdx] || `${optIdx + 1}`}
                        </span>
                        <div className="flex-1 min-w-0">
                          <MathText content={opt} />
                        </div>
                        {isRevealed && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Pedagogical Justification (Visible only to Teacher when Show Solution is enabled) */}
                {session.showAnswers && (currentQuestion.explanation || currentQuestion.hint) && (
                  <div className="mt-6 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-indigo-950 space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Justificación Pedagógica y Procedimiento (Vista Docente):</span>
                    </div>
                    {currentQuestion.explanation && (
                      <div className="text-xs sm:text-sm text-slate-800 leading-relaxed pl-6">
                        <MathText content={currentQuestion.explanation} />
                      </div>
                    )}
                    {currentQuestion.hint && (
                      <div className="text-xs text-indigo-600 italic pl-6">
                        💡 Pista conceptual: {currentQuestion.hint}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation and Presentation Controls */}
              <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-100">
                <button
                  id="admin-prev-question-btn"
                  onClick={handlePrevQuestion}
                  disabled={currentQIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 text-xs font-bold text-slate-700 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    id="admin-toggle-answers-btn"
                    onClick={() => realtimeDb.toggleShowAnswers()}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                      session.showAnswers
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {session.showAnswers ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4 text-indigo-600" />
                    )}
                    <span>{session.showAnswers ? 'Ocultar Solución' : 'Mostrar Solución al Curso'}</span>
                  </button>

                  <button
                    id="admin-next-question-btn"
                    onClick={handleNextQuestion}
                    disabled={currentQIndex >= totalQuestions - 1}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 mb-4">No hay ejercicios cargados en esta materia.</p>
              <button
                onClick={() => setIsContentModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow transition"
              >
                Cargar Ejercicios
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Real-Time Stats & Live Feed (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {currentQuestion && (
            <LiveStatsChart
              question={currentQuestion}
              questionIndex={currentQIndex}
              students={students}
              showAnswers={session.showAnswers || false}
              onToggleShowAnswers={() => realtimeDb.toggleShowAnswers()}
            />
          )}

          <LiveFeed feed={feed} />
        </div>
      </div>

      {/* 5.5 DATA VISUALIZATION: RECHARTS QUESTION PERFORMANCE TRENDS & MISCONCEPTION DIAGNOSTICS */}
      {session.quizData && session.quizData.length > 0 && (
        <div id="section-performance-trends" className="max-w-7xl mx-auto scroll-mt-6">
          <QuestionPerformanceTrendsChart
            questions={session.quizData}
            activeQuestionIndex={currentQIndex}
            students={students}
            onSelectQuestion={(idx) => realtimeDb.setActiveQuestion(idx)}
          />
        </div>
      )}

      {/* 6. BOTTOM SECTION: LIVE 50-STUDENT MONITOR WALL WITH KICK SYSTEM */}
      <div className="max-w-7xl mx-auto">
        <StudentMonitor
          students={students}
          session={session}
          onOpenNotebookModal={(stId) => {
            setSelectedNotebookStudentId(stId);
            setIsNotebookModalOpen(true);
          }}
        />
      </div>

      {/* MODALS */}
      {isCurriculumModalOpen && (
        <CurriculumSelectorModal
          isOpen={isCurriculumModalOpen}
          onClose={() => setIsCurriculumModalOpen(false)}
          onApply={handleApplyCurriculum}
          currentCurriculum={session.curriculum}
        />
      )}

      {isContentModalOpen && (
        <ContentManagerModal
          isOpen={isContentModalOpen}
          onClose={() => setIsContentModalOpen(false)}
          currentQuizTitle={session.title || 'Materia actual'}
        />
      )}

      {isQRModalOpen && (
        <QRCodeModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          pin={session.pin}
        />
      )}

      {isRankingModalOpen && (
        <RankingModal
          isOpen={isRankingModalOpen}
          onClose={() => setIsRankingModalOpen(false)}
          session={session}
          students={students}
        />
      )}

      {isNotebookModalOpen && (
        <NotebookViewerModal
          isOpen={isNotebookModalOpen}
          onClose={() => setIsNotebookModalOpen(false)}
          students={students}
          initialStudentId={selectedNotebookStudentId}
        />
      )}

      {isGradebookModalOpen && (
        <GradebookModal
          isOpen={isGradebookModalOpen}
          onClose={() => setIsGradebookModalOpen(false)}
          students={students}
          session={session}
        />
      )}

      {isSecurityAlertsModalOpen && (
        <SecurityAlertsModal
          isOpen={isSecurityAlertsModalOpen}
          onClose={() => setIsSecurityAlertsModalOpen(false)}
          students={students}
          feedEvents={feed}
        />
      )}

      {isResetModalOpen && (
        <AdminResetModal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          data={data}
          onOpenReport={(record) => {
            setActiveReportRecord(record);
            setIsReportModalOpen(true);
          }}
        />
      )}

      {isReportModalOpen && (
        <GradebookReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          record={activeReportRecord}
          currentPin={session?.pin}
        />
      )}
    </div>
  );
};
