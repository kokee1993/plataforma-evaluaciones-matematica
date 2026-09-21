import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  Sparkles,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { ParticipantType, TEACHER_UNLOCK_PASSWORDS } from '../types';

interface EntryPortalProps {
  onSelectTeacher: () => void;
  onSelectStudent: (mode: ParticipantType) => void;
  onOpenGradebook?: () => void;
}

const MASTER_PASSCODE = 'jorge19931D';
const STORAGE_KEY_AUTH = 'edumath_teacher_authenticated';

export const EntryPortal: React.FC<EntryPortalProps> = ({
  onSelectTeacher,
  onSelectStudent,
  onOpenGradebook,
}) => {
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showStudentModeSelect, setShowStudentModeSelect] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Gradebook quick access passcode modal states
  const [showGradebookPasscodeModal, setShowGradebookPasscodeModal] = useState(false);
  const [gradebookPasscode, setGradebookPasscode] = useState('');
  const [gradebookPasscodeError, setGradebookPasscodeError] = useState<string | null>(null);
  const [isVerifyingGradebook, setIsVerifyingGradebook] = useState(false);

  const handleGradebookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGradebookPasscodeError(null);
    setIsVerifyingGradebook(true);

    const inputClean = gradebookPasscode.trim();
    const isValid =
      inputClean === MASTER_PASSCODE ||
      inputClean.toLowerCase() === 'jorge19931d' ||
      TEACHER_UNLOCK_PASSWORDS.some((p) => p.toLowerCase() === inputClean.toLowerCase());

    if (isValid) {
      try {
        sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      } catch {}

      setTimeout(() => {
        setIsVerifyingGradebook(false);
        setShowGradebookPasscodeModal(false);
        setGradebookPasscode('');
        if (onOpenGradebook) onOpenGradebook();
      }, 300);
    } else {
      setTimeout(() => {
        setIsVerifyingGradebook(false);
        setGradebookPasscodeError('Contraseña incorrecta. Intenta nuevamente.');
      }, 300);
    }
  };

  const handleStudentSelect = (mode: ParticipantType) => {
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
    } catch {}
    onSelectStudent(mode);
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);
    setIsVerifying(true);

    const inputClean = passcode.trim();

    if (
      inputClean === MASTER_PASSCODE ||
      inputClean.toLowerCase() === 'jorge19931d'
    ) {
      try {
        sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      } catch {}

      setTimeout(() => {
        setIsVerifying(false);
        setShowTeacherModal(false);
        onSelectTeacher();
      }, 300);
    } else {
      setTimeout(() => {
        setIsVerifying(false);
        setPasscodeError('Clave maestra incorrecta. Intenta nuevamente.');
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar Branding */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-black text-slate-900 tracking-tight block">
              EduMath Pro
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Plataforma de Evaluación Interactiva en Tiempo Real
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenGradebook && (
            <button
              id="portal-top-gradebook-btn"
              type="button"
              onClick={() => {
                setGradebookPasscode('');
                setGradebookPasscodeError(null);
                setShowGradebookPasscodeModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-900 transition shadow-xs cursor-pointer"
              title="Acceso directo al Libro Virtual de Clases y Calificaciones"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Ver Libro de Clases</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Salas de hasta 50 participantes</span>
          </div>
        </div>
      </div>

      {/* Main Choice Section */}
      <div className="max-w-3xl w-full mx-auto my-auto py-8 sm:py-12">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
            <span>Portal de Entrada Inteligente</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            ¿Cómo deseas ingresar a la sesión?
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
            Selecciona tu rol para proyectar la clase como docente o participar activamente desde tu celular o tablet.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* OPTION A: SOY MAESTRO */}
          <button
            id="portal-teacher-card-btn"
            onClick={() => {
              setPasscode('');
              setPasscodeError(null);
              setShowTeacherModal(true);
            }}
            className="group relative bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-indigo-600 rounded-3xl p-6 sm:p-8 text-left transition-all duration-200 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/25 mb-5 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Acceso Protegido
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                👨‍🏫 Soy Maestro
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Panel de control, proyector para la pizarra, monitoreo de 50 alumnos, ranking en vivo y exportación de notas.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-indigo-600">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                Requiere clave de acceso
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* OPTION B: SOY ALUMNO */}
          <button
            id="portal-student-card-btn"
            onClick={() => handleStudentSelect('individual')}
            className="group relative bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-emerald-500 rounded-3xl p-6 sm:p-8 text-left transition-all duration-200 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/25 mb-5 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Acceso Estudiantil
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                🎓 Soy Alumno
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Ingresa seleccionando tu curso (ej: <strong>1°D</strong>), modalidad individual o grupal, y tus nombres completos para unirte con el PIN.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-emerald-700">
              <span>Elegir Curso y Conectarse</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Quick Access to Gradebook Button Card */}
        {onOpenGradebook && (
          <div className="mt-6 flex justify-center">
            <button
              id="portal-quick-gradebook-card-btn"
              type="button"
              onClick={() => {
                setGradebookPasscode('');
                setGradebookPasscodeError(null);
                setShowGradebookPasscodeModal(true);
              }}
              className="w-full max-w-xl p-4 rounded-2xl bg-white hover:bg-amber-50/50 border-2 border-amber-200 hover:border-amber-400 text-slate-800 flex items-center justify-between gap-4 transition shadow-xs hover:shadow-md cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">
                      Acceso Rápido: Libro de Calificaciones
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Actas Oficiales
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Consultar notas calculadas, escala al 60%, respuestas y actas por curso
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-900 font-bold bg-amber-100/70 group-hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-200 transition shrink-0">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Ver Libro</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-slate-400 py-3 border-t border-slate-200">
        EduMath Pro • Sistema de Evaluación Formativa con Registro por Curso (7° Básico a 4° Medio • A a E)
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: TEACHER MASTER PASSCODE GATE */}
      {/* ======================================================== */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/20 mb-3">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Autenticación Docente
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Ingresa la clave maestra del profesor para acceder al panel y proyector de la sala.
              </p>
            </div>

            {passcodeError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{passcodeError}</span>
              </div>
            )}

            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="portal-teacher-passcode-input"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Contraseña Docente
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="portal-teacher-passcode-input"
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Ingresa tu clave secreta"
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Cancelar
                </button>

                <button
                  id="portal-teacher-submit-btn"
                  type="submit"
                  disabled={isVerifying || !passcode}
                  className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition"
                >
                  {isVerifying ? (
                    <span>Verificando...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Ingresar al Panel</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: STUDENT MODE SELECT (INDIVIDUAL VS GROUP) */}
      {/* ======================================================== */}
      {showStudentModeSelect && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20 mb-3">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Modalidad de Participación
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                ¿Cómo vas a responder la evaluación en esta sesión?
              </p>
            </div>

            <div className="space-y-3">
              {/* Option 1: Individual */}
              <button
                id="portal-select-individual-btn"
                onClick={() => {
                  setShowStudentModeSelect(false);
                  onSelectStudent('individual');
                }}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-600 bg-slate-50 hover:bg-white text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      👤 Modo Individual
                    </h4>
                    <p className="text-xs text-slate-500">
                      Un teléfono por alumno con tu propio Nombre y Apellido.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
              </button>

              {/* Option 2: Group (Cooperative Learning) */}
              <button
                id="portal-select-group-btn"
                onClick={() => {
                  setShowStudentModeSelect(false);
                  onSelectStudent('group');
                }}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-600 bg-slate-50 hover:bg-white text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900">
                        👥 Modo En Grupo
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        2 a 10 integrantes
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Aprendizaje cooperativo compartiendo un solo dispositivo para el equipo.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowStudentModeSelect(false)}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Volver al Menú Principal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: GRADEBOOK PASSCODE GATE (NO PASSWORD LEAKS) */}
      {/* ======================================================== */}
      {showGradebookPasscodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-500/20 mb-3">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Libro de Calificaciones
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Ingresa la contraseña docente para consultar las actas de evaluación y el registro por curso.
              </p>
            </div>

            {gradebookPasscodeError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{gradebookPasscodeError}</span>
              </div>
            )}

            <form onSubmit={handleGradebookSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="portal-gradebook-passcode-input"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Contraseña de Acceso
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="portal-gradebook-passcode-input"
                    type="password"
                    value={gradebookPasscode}
                    onChange={(e) => setGradebookPasscode(e.target.value)}
                    placeholder="Ingresa tu contraseña..."
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGradebookPasscodeModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Cancelar
                </button>

                <button
                  id="portal-gradebook-submit-btn"
                  type="submit"
                  disabled={isVerifyingGradebook || !gradebookPasscode}
                  className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition"
                >
                  {isVerifyingGradebook ? (
                    <span>Verificando...</span>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      <span>Ver Libro</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
