import React, { useState } from 'react';
import { ClassroomDatabaseState } from '../../types';
import { realtimeDb } from '../../lib/firebase';
import {
  RotateCcw,
  Archive,
  KeyRound,
  AlertTriangle,
  Play,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  Users,
  Layers,
  Shuffle,
  RefreshCw,
  Info,
  Lock,
  UserX,
  FileText,
  Trash2,
  Download,
} from 'lucide-react';

interface AdminResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ClassroomDatabaseState;
  onOpenReport?: (record?: any) => void;
}

export const AdminResetModal: React.FC<AdminResetModalProps> = ({
  isOpen,
  onClose,
  data,
  onOpenReport,
}) => {
  const { session, students } = data || {};
  const [selectedAction, setSelectedAction] = useState<
    'reset_round' | 'kick_all' | 'new_room' | 'finalize_and_report' | 'purge_history'
  >('reset_round');
  const [customPin, setCustomPin] = useState(
    `MAT-${Math.floor(100 + Math.random() * 900)}`
  );
  const [purgeOption, setPurgeOption] = useState<'older_than_30_days' | 'all'>('older_than_30_days');
  const [purgePasscode, setPurgePasscode] = useState('');
  const [archiveBeforeReset, setArchiveBeforeReset] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [showAdminPasscodeVerification, setShowAdminPasscodeVerification] = useState(false);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalStudents = Object.keys(students || {}).length;

  const generateNewRandomPin = () => {
    const letters = ['MAT', 'NUM', 'ALG', 'GEO', 'PROB'];
    const prefix = letters[Math.floor(Math.random() * letters.length)];
    const num = Math.floor(100 + Math.random() * 900);
    setCustomPin(`${prefix}-${num}`);
  };

  const handleExecute = async () => {
    setPasscodeError(null);

    // Optional admin security passcode verification
    if (showAdminPasscodeVerification || selectedAction === 'purge_history') {
      const checkVal = selectedAction === 'purge_history' ? purgePasscode.trim() : adminKeyInput.trim();
      if (
        checkVal !== 'jorge19931D' &&
        checkVal.toLowerCase() !== 'jorge19931d' &&
        checkVal !== session?.adminKey
      ) {
        setPasscodeError('Clave de administrador incorrecta. Ingrese la clave maestra docente.');
        return;
      }
    }

    setIsProcessing(true);

    try {
      if (selectedAction === 'reset_round') {
        // 1. REINICIAR RONDA: limpia respuestas y estados manteniendo la conexión
        realtimeDb.resetActiveRound(archiveBeforeReset);
        setSuccessMessage(
          `✓ Ronda reiniciada con éxito. Los ${totalStudents} estudiantes continúan conectados en la Pregunta 1.` +
            (archiveBeforeReset ? ' (Resultados archivados en el Libro de Clases)' : '')
        );
      } else if (selectedAction === 'kick_all') {
        // 2. LIMPIEZA DE SALA: Expulsa a todos manteniendo el PIN para reingreso ordenado
        realtimeDb.kickAllStudents();
        setSuccessMessage(
          `✓ Sala limpiada con éxito (${totalStudents} participantes desconectados). Pueden ingresar ordenadamente con el PIN ${session.pin}.`
        );
      } else if (selectedAction === 'new_room') {
        // 3. NUEVA SALA: genera nuevo PIN y archiva sesión
        const cleanPin = customPin.trim().toUpperCase() || `MAT-${Math.floor(100 + Math.random() * 900)}`;
        realtimeDb.startNewRoomSession(cleanPin);
        setSuccessMessage(
          `✓ Nueva Sala iniciada con PIN: ${cleanPin}. Sesión anterior respaldada en el Historial.`
        );
      } else if (selectedAction === 'finalize_and_report') {
        // 4. FINALIZAR Y VISUALIZAR REPORTE / DESCARGAR PDF
        await realtimeDb.finalizeEvaluation();
        const serverRecords = await realtimeDb.fetchGradebookRecords();
        const currentPin = (session?.pin || '').trim().toUpperCase();
        const currentRec =
          serverRecords.find((r) => r.pin === currentPin || (r.id && r.id.includes(currentPin))) ||
          serverRecords[0];

        if (onOpenReport && currentRec) {
          onClose();
          onOpenReport(currentRec);
          return;
        }

        setSuccessMessage(
          '✓ Evaluación finalizada y respaldada en el Libro de Clases. El reporte oficial está disponible para visualizar y descargar en PDF.'
        );
      } else if (selectedAction === 'purge_history') {
        // 5. LIMPIEZA DE DATOS
        const res = await realtimeDb.purgeGradebookRecords('jorge19931D', purgeOption);
        if (res.success) {
          setSuccessMessage(
            `✓ Limpieza completada. Se depuraron ${res.purgedCount ?? 0} evaluaciones antiguas del sistema.`
          );
        } else {
          setPasscodeError(res.error || 'Error al depurar datos.');
          setIsProcessing(false);
          return;
        }
      }

      setTimeout(() => {
        setIsProcessing(false);
        setSuccessMessage(null);
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Error al ejecutar operación docente:', err);
      setIsProcessing(false);
    }
  };

  const handleStartGameFromWaiting = () => {
    realtimeDb.setLobbyStatus('in_game');
    realtimeDb.setActiveQuestion(0);
    setSuccessMessage('🚀 ¡Evaluación iniciada! Todos los estudiantes han ingresado a la pregunta 1.');
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1400);
  };

  return (
    <div
      id="admin-reset-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        id="admin-reset-modal-container"
        className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 p-5 text-white flex items-center justify-between border-b border-rose-900/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-600/30 text-rose-400 border border-rose-500/40 flex items-center justify-center font-bold shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 bg-rose-950/90 px-2 py-0.5 rounded-full border border-rose-500/30">
                  Permisos Exclusivos de Administrador
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                Gestión de Sala y Reinicio de Sesión
              </h2>
            </div>
          </div>

          <button
            id="admin-reset-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scroll */}
        <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
          {/* Current Live Session Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">PIN Actual:</span>
              <span className="text-sm font-bold text-indigo-400">{session.pin}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Estudiantes:</span>
              <span className="text-sm font-bold text-emerald-400">{totalStudents} activos</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Estado de Sala:</span>
              <span className="text-xs font-bold text-amber-300">
                {session.lobbyStatus === 'waiting' ? '⏳ Sala de Espera' : '🎮 En Evaluación'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Pregunta Activa:</span>
              <span className="text-xs font-bold text-sky-400">
                {(session.activeQuestion || 0) + 1} de {session.quizData?.length || 1}
              </span>
            </div>
          </div>

          {/* Quick Start from Lobby if in Waiting mode */}
          {session.lobbyStatus === 'waiting' && (
            <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Alumnos en Sala de Espera ({totalStudents})
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Listos para evaluar</span>
              </div>
              <button
                id="admin-reset-launch-game-btn"
                onClick={handleStartGameFromWaiting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>🚀 INICIAR EVALUACIÓN PARA TODOS (Lanzar Pregunta 1)</span>
              </button>
            </div>
          )}

          {/* Reset Action Selection Cards */}
          <div className="space-y-3">
            <label className="font-bold text-slate-200 block text-xs uppercase tracking-wider">
              Selecciona la operación docente:
            </label>

            {/* Option 1: Reiniciar Ronda */}
            <div
              id="action-card-reset-round"
              onClick={() => setSelectedAction('reset_round')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                selectedAction === 'reset_round'
                  ? 'bg-indigo-950/50 border-indigo-500 ring-1 ring-indigo-500/50 text-indigo-100 shadow-md'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedAction === 'reset_round'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">
                      1. Reiniciar Ronda
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Mantiene Conexión
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Limpia las respuestas, puntajes, errores y tiempo fuera de foco de los estudiantes.
                    <strong> Los alumnos continúan conectados en la misma sesión y avanzan a la Pregunta 1</strong> sin necesidad de reingresar el PIN.
                  </p>
                </div>
              </div>
            </div>

            {/* Option 2: Limpieza de Sala (Expulsar a todos manteniendo PIN) */}
            <div
              id="action-card-kick-all"
              onClick={() => setSelectedAction('kick_all')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                selectedAction === 'kick_all'
                  ? 'bg-amber-950/50 border-amber-500 ring-1 ring-amber-500/50 text-amber-100 shadow-md'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedAction === 'kick_all'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  <UserX className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">
                      2. Limpieza de Sala (Expulsar a Todos)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Mantiene PIN ({session.pin})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Desconecta de inmediato a los <strong>{totalStudents} alumnos actuales</strong> para que ingresen de forma ordenada con sus nombres reales.
                    <strong> Mantiene el mismo código PIN ({session.pin})</strong> en la pizarra para que no tengan que cambiar de sala.
                  </p>
                </div>
              </div>
            </div>

            {/* Option 3: Nueva Sala */}
            <div
              id="action-card-new-room"
              onClick={() => setSelectedAction('new_room')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                selectedAction === 'new_room'
                  ? 'bg-rose-950/50 border-rose-500 ring-1 ring-rose-500/50 text-rose-100 shadow-md'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedAction === 'new_room'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">
                      3. Nueva Sala
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Nuevo Código PIN
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Archiva la sesión actual en el Libro de Calificaciones, <strong>genera un nuevo código PIN de ingreso</strong> y abre la Sala de Espera para un nuevo curso o grupo de estudiantes.
                  </p>

                  {/* PIN Generator Controls */}
                  {selectedAction === 'new_room' && (
                    <div className="mt-3 pt-3 border-t border-rose-900/40 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-300">Nuevo PIN sugerido:</span>
                      <input
                        type="text"
                        value={customPin}
                        onChange={(e) => setCustomPin(e.target.value.toUpperCase())}
                        maxLength={10}
                        className="px-3 py-1 bg-slate-950 border border-rose-500/50 rounded-lg text-xs font-mono font-bold text-amber-300 uppercase outline-none focus:ring-1 focus:ring-rose-400 w-28"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          generateNewRandomPin();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition"
                      >
                        <Shuffle className="w-3 h-3" />
                        <span>Generar otro</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Option 4: Finalizar Evaluación y Ver Reporte / Descargar PDF */}
            <div
              id="action-card-finalize-and-report"
              onClick={() => setSelectedAction('finalize_and_report')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                selectedAction === 'finalize_and_report'
                  ? 'bg-emerald-950/50 border-emerald-500 ring-1 ring-emerald-500/50 text-emerald-100 shadow-md'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedAction === 'finalize_and_report'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">
                      4. Finalizar Evaluación y Descargar Reporte PDF
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Descarga Directa PDF
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Cierra la sala para los estudiantes (mostrando su estado de prueba finalizada), archiva permanentemente todas las notas en el Libro de Clases y <strong>despliega el acta oficial en pantalla con un botón para descargar directamente el PDF oficial</strong>.
                  </p>

                  {selectedAction === 'finalize_and_report' && (
                    <div className="mt-3 pt-3 border-t border-emerald-900/40 space-y-1.5 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                      <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                        <Download className="w-4 h-4" />
                        <span>Sin configuración de servidores ni correos</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-tight">
                        Al pulsar el botón inferior se cerrará la sala y se abrirá de inmediato el visualizador del acta institucional con el botón de descarga en PDF (Escala 60% MINEDUC).
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Option 5: Limpieza de Datos */}
            <div
              id="action-card-purge-history"
              onClick={() => setSelectedAction('purge_history')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                selectedAction === 'purge_history'
                  ? 'bg-rose-950/60 border-rose-500 ring-1 ring-rose-500/50 text-rose-100 shadow-md'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedAction === 'purge_history'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">
                      5. Limpieza de Datos (Liberar Espacio)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Depuración de Registros
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Depura evaluaciones anteriores si los datos se acumulan demasiado en el sistema.
                  </p>

                  {selectedAction === 'purge_history' && (
                    <div className="mt-3 pt-3 border-t border-rose-900/40 space-y-2.5">
                      <div className="flex gap-4 text-xs text-slate-300">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="adminPurgeType"
                            checked={purgeOption === 'older_than_30_days'}
                            onChange={() => setPurgeOption('older_than_30_days')}
                          />
                          <span>Mayores a 30 días</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="adminPurgeType"
                            checked={purgeOption === 'all'}
                            onChange={() => setPurgeOption('all')}
                          />
                          <span>Limpieza Total</span>
                        </label>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          Contraseña de seguridad de docente:
                        </label>
                        <input
                          type="password"
                          value={purgePasscode}
                          onChange={(e) => setPurgePasscode(e.target.value)}
                          placeholder="Ingrese contraseña de seguridad..."
                          className="w-full px-3 py-1.5 bg-slate-950 border border-rose-500/50 rounded-lg text-xs font-mono text-white outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Automatic Archive Notice Checkbox */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex items-start gap-3">
            <input
              id="checkbox-archive-history"
              type="checkbox"
              checked={archiveBeforeReset}
              onChange={(e) => setArchiveBeforeReset(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-900 cursor-pointer"
            />
            <label htmlFor="checkbox-archive-history" className="cursor-pointer space-y-0.5">
              <span className="font-bold text-slate-200 block text-xs flex items-center gap-1.5">
                <Archive className="w-3.5 h-3.5 text-amber-400" />
                Archivar automáticamente en el Libro de Clases / Historial
              </span>
              <span className="text-[11px] text-slate-400 block leading-relaxed">
                Guarda una copia completa con las notas MINEDUC (escala al 60%), respuestas y evidencias de los estudiantes antes de resetear.
              </span>
            </label>
          </div>

          {/* Optional Admin Passcode Protection Toggle */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowAdminPasscodeVerification(!showAdminPasscodeVerification)}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showAdminPasscodeVerification ? 'Ocultar confirmación de clave' : 'Requerir confirmación con clave maestra docente'}</span>
            </button>

            {showAdminPasscodeVerification && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 animate-fade-in">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Ingresa la clave de administrador para autorizar:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={adminKeyInput}
                    onChange={(e) => setAdminKeyInput(e.target.value)}
                    placeholder="Contraseña docente requerida..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white outline-none focus:border-rose-500"
                  />
                </div>
                {passcodeError && (
                  <p className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{passcodeError}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 bg-emerald-950/90 border border-emerald-500 text-emerald-300 rounded-2xl font-bold text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            id="admin-reset-cancel-btn"
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            id="admin-reset-confirm-execute-btn"
            type="button"
            onClick={handleExecute}
            disabled={isProcessing}
            className={`px-6 py-2.5 rounded-xl text-white text-xs font-black flex items-center gap-2 shadow-lg transition active:scale-95 disabled:opacity-50 ${
              selectedAction === 'reset_round'
                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                : selectedAction === 'kick_all'
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : selectedAction === 'finalize_and_report'
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
            }`}
          >
            {isProcessing ? (
              <span>Procesando...</span>
            ) : selectedAction === 'reset_round' ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Ejecutar Reinicio de Ronda</span>
              </>
            ) : selectedAction === 'kick_all' ? (
              <>
                <UserX className="w-4 h-4" />
                <span>Limpiar Sala y Expulsar a Todos ({totalStudents})</span>
              </>
            ) : selectedAction === 'finalize_and_report' ? (
              <>
                <Download className="w-4 h-4" />
                <span>Finalizar y Descargar Reporte PDF</span>
              </>
            ) : selectedAction === 'purge_history' ? (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Confirmar Depuración de Datos</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Crear Nueva Sala con PIN {customPin}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
