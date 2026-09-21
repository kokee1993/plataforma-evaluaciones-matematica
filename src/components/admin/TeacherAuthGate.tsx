import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, ArrowLeft, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface TeacherAuthGateProps {
  onSuccess: () => void;
  onGoToStudentView: () => void;
}

const MASTER_PASSCODE = 'jorge19931D';
const STORAGE_KEY_AUTH = 'edumath_teacher_authenticated';

export const TeacherAuthGate: React.FC<TeacherAuthGateProps> = ({
  onSuccess,
  onGoToStudentView,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const inputClean = passcode.trim();

    // Check master passcode
    if (
      inputClean === MASTER_PASSCODE ||
      inputClean.toLowerCase() === 'jorge19931d'
    ) {
      try {
        sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      } catch (err) {}

      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
      }, 300);
    } else {
      setTimeout(() => {
        setIsSubmitting(false);
        setError('Contraseña maestra incorrecta. Intenta nuevamente.');
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between py-2">
        <button
          id="gate-back-to-student-btn"
          onClick={onGoToStudentView}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al portal</span>
        </button>

        <span className="text-[11px] font-mono text-slate-400 font-semibold">
          EduMath Security Gatekeeper
        </span>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Header Icon & Text */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/25 mb-3">
              <Lock className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acceso Exclusivo para Docentes</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Panel de Control y Proyección
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Ingresa la clave maestra del docente para proyectar ejercicios, ver el solucionario, monitorear la sala en vivo y gestionar el ranking.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="teacher-passcode-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                Contraseña Docente
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="teacher-passcode-input"
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

            <button
              id="teacher-gate-submit-btn"
              type="submit"
              disabled={isSubmitting || !passcode}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition"
            >
              {isSubmitting ? (
                <span>Verificando credencial...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Desbloquear Panel Docente</span>
                </>
              )}
            </button>
          </form>

          {/* Security Features Bullet List */}
          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Aislamiento estricto de roles: alumnos sin acceso</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Sincronización en tiempo real sin recarga</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Monitoreo de foco Sentinel 1.8s & Alertas sonoras</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-slate-400 py-2">
        EduMath Pro • Sistema de Evaluación Formativa en Tiempo Real
      </div>
    </div>
  );
};
