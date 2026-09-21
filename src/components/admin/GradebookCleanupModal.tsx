import React, { useState } from 'react';
import { GradebookCourseRecord } from '../../types';
import { realtimeDb } from '../../lib/firebase';
import {
  Trash2,
  ShieldAlert,
  Download,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  Layers,
  Calendar,
} from 'lucide-react';

interface GradebookCleanupModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: GradebookCourseRecord[];
  onCleanupCompleted: () => void;
}

export const GradebookCleanupModal: React.FC<GradebookCleanupModalProps> = ({
  isOpen,
  onClose,
  records,
  onCleanupCompleted,
}) => {
  const [purgeType, setPurgeType] = useState<'older_than_30_days' | 'course' | 'all'>('older_than_30_days');
  const [targetCourseKey, setTargetCourseKey] = useState<string>('1_medio_D');
  const [passcode, setPasscode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate and trigger download of backup JSON
  const handleDownloadBackup = () => {
    try {
      const jsonStr = JSON.stringify(records, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Respaldo_Completo_Libro_Clases_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('Could not export backup:', e);
    }
  };

  const handleExecutePurge = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanPass = passcode.trim();
    if (!cleanPass) {
      setErrorMessage('Debe ingresar la contraseña de seguridad de docente.');
      return;
    }

    if (cleanPass !== 'jorge19931D' && cleanPass.toLowerCase() !== 'jorge19931d') {
      setErrorMessage('Contraseña de seguridad incorrecta. Acceso denegado.');
      return;
    }

    setIsProcessing(true);

    try {
      // Always trigger automatic browser backup first
      handleDownloadBackup();

      const res = await realtimeDb.purgeGradebookRecords(cleanPass, purgeType, targetCourseKey);

      if (res.success) {
        setSuccessMessage(
          `Limpieza completada exitosamente. Se eliminaron ${res.purgedCount ?? 0} evaluaciones. Quedan ${res.remainingCount ?? 0} registros en el libro.`
        );
        setPasscode('');
        onCleanupCompleted();
        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        setErrorMessage(res.error || 'Error al ejecutar limpieza.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión con el servidor.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Distinct courses in current records
  const uniqueCourses: string[] = Array.from(
    new Set<string>(records.map((r) => r.courseKey || '1_medio_D'))
  );

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-rose-950 text-white flex items-center justify-between border-b border-rose-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-md">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Limpieza y Depuración de Datos</h3>
              <p className="text-xs text-rose-200">Optimizar almacenamiento y depurar registros acumulados</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-rose-900/60 hover:bg-rose-900 text-rose-200 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleExecutePurge} className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold block">Protección de Datos Activa:</strong>
              <p className="text-[11px] leading-relaxed">
                Antes de borrar cualquier información, el sistema descargará automáticamente una copia de respaldo completa a su computador.
              </p>
            </div>
          </div>

          {/* Backup Button */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-800 block">Descargar Respaldo Manual</span>
              <span className="text-[11px] text-slate-400">Guarda un archivo .JSON con todas las {records.length} evaluaciones</span>
            </div>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Descargar .JSON</span>
            </button>
          </div>

          {/* Purge Options */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block uppercase text-[10px]">
              Seleccione el tipo de limpieza:
            </label>

            {/* Option 1: Older than 30 days */}
            <label
              className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
                purgeType === 'older_than_30_days'
                  ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="purgeType"
                value="older_than_30_days"
                checked={purgeType === 'older_than_30_days'}
                onChange={() => setPurgeType('older_than_30_days')}
                className="mt-1"
              />
              <div>
                <span className="font-bold block">Depurar evaluaciones de más de 30 días (Recomendado)</span>
                <span className="text-[11px] text-slate-500 block">
                  Mantiene todas las evaluaciones del último mes y libera el historial antiguo.
                </span>
              </div>
            </label>

            {/* Option 2: By Course */}
            <label
              className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
                purgeType === 'course'
                  ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="purgeType"
                value="course"
                checked={purgeType === 'course'}
                onChange={() => setPurgeType('course')}
                className="mt-1"
              />
              <div className="flex-1">
                <span className="font-bold block">Limpiar solo un curso específico</span>
                <span className="text-[11px] text-slate-500 block mb-2">
                  Borra las evaluaciones archivadas correspondientes al curso seleccionado.
                </span>
                {purgeType === 'course' && (
                  <select
                    value={targetCourseKey}
                    onChange={(e) => setTargetCourseKey(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    {uniqueCourses.map((c) => (
                      <option key={c} value={c}>
                        {c.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </label>

            {/* Option 3: Complete Reset */}
            <label
              className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
                purgeType === 'all'
                  ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="purgeType"
                value="all"
                checked={purgeType === 'all'}
                onChange={() => setPurgeType('all')}
                className="mt-1"
              />
              <div>
                <span className="font-bold text-rose-700 block">Limpieza Total (Borrar todo el historial)</span>
                <span className="text-[11px] text-slate-500 block">
                  Vacía todos los registros acumulados en el servidor y memoria local.
                </span>
              </div>
            </label>
          </div>

          {/* Security Passcode Confirmation */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">
              Contraseña Maestra de Seguridad Docente
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Ingrese contraseña de confirmación"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              Acción protegida para evitar pérdidas accidentales de datos.
            </span>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando Limpieza...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Confirmar Limpieza</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
