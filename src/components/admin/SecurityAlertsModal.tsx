import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  X,
  Clock,
  AlertTriangle,
  MonitorOff,
  Copy,
  Scissors,
  Eye,
  Camera,
  Users,
  User,
  CheckCircle2,
} from 'lucide-react';
import { Student, FeedEvent, TEACHER_UNLOCK_PASSWORDS } from '../../types';
import { realtimeDb } from '../../lib/firebase';

interface SecurityAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Record<string, Student>;
  feedEvents?: FeedEvent[] | Record<string, FeedEvent>;
}

export const SecurityAlertsModal: React.FC<SecurityAlertsModalProps> = ({
  isOpen,
  onClose,
  students,
  feedEvents = [],
}) => {
  const [filter, setFilter] = useState<'all' | 'locked' | 'history'>('locked');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const normalizedFeedEvents: FeedEvent[] = useMemo(() => {
    if (!feedEvents) return [];
    if (Array.isArray(feedEvents)) return feedEvents;
    if (typeof feedEvents === 'object') {
      return (Object.values(feedEvents) as FeedEvent[]).filter(Boolean);
    }
    return [];
  }, [feedEvents]);

  const securityEvents = useMemo(() => {
    return normalizedFeedEvents
      .filter((e) => e && (e.type === 'escape' || e.type === 'cheat_alert' || e.type === 'security_unlock'))
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 15);
  }, [normalizedFeedEvents]);

  if (!isOpen) return null;

  const studentList: Student[] = (Object.values(students || {}) as Student[]);

  // Compute metrics
  const lockedStudents = studentList.filter((st) => st.isSecurityLocked || st.isOutOfTab);
  const studentsWithViolations = studentList.filter((st) => {
    return (
      (st.tabEscapes || 0) > 0 ||
      (st.screenshotAttempts || 0) > 0 ||
      (st.splitScreenAttempts || 0) > 0 ||
      (st.copyAttempts || 0) > 0 ||
      (st.devtoolsAttempts || 0) > 0 ||
      (st.secondMonitorAttempts || 0) > 0 ||
      Boolean(st.isSecurityLocked) ||
      Boolean(st.isOutOfTab)
    );
  });

  const totalInfractions = studentList.reduce((acc, st) => {
    return (
      acc +
      (st.tabEscapes || 0) +
      (st.screenshotAttempts || 0) +
      (st.splitScreenAttempts || 0) +
      (st.copyAttempts || 0) +
      (st.devtoolsAttempts || 0) +
      (st.secondMonitorAttempts || 0)
    );
  }, 0);

  // Filtered list
  const displayList = studentList
    .filter((st) => {
      if (filter === 'locked') return st.isSecurityLocked || st.isOutOfTab;
      if (filter === 'history') {
        return (
          (st.tabEscapes || 0) > 0 ||
          (st.screenshotAttempts || 0) > 0 ||
          (st.splitScreenAttempts || 0) > 0 ||
          (st.copyAttempts || 0) > 0 ||
          (st.devtoolsAttempts || 0) > 0 ||
          (st.secondMonitorAttempts || 0) > 0
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Prioritize currently locked
      const aLocked = a.isSecurityLocked || a.isOutOfTab ? 1 : 0;
      const bLocked = b.isSecurityLocked || b.isOutOfTab ? 1 : 0;
      if (bLocked !== aLocked) return bLocked - aLocked;
      return (b.tabEscapes || 0) - (a.tabEscapes || 0);
    });

  const handleUnlockOne = async (studentId: string, studentName: string) => {
    await realtimeDb.unlockStudentSecurity(studentId);
    setActionSuccessMsg(`Se desbloqueó la evaluación de "${studentName}".`);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  const handleUnlockAll = async () => {
    await realtimeDb.unlockAllStudentsSecurity();
    setActionSuccessMsg('Se desbloquearon todas las evaluaciones bloqueadas.');
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  const formatSeconds = (sec?: number) => {
    if (!sec) return '0s';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div
      id="security-alerts-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl border border-rose-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">Centro de Control de Seguridad y Probidad</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-xs font-bold">
                  {lockedStudents.length} Bloqueados
                </span>
              </div>
              <p className="text-xs text-rose-100 font-medium">
                Monitoreo de salidas de pantalla, capturas, pantalla dividida y desbloqueo de pruebas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Success Toast */}
        {actionSuccessMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Master Passcode Info Box */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-50 to-amber-50 border-b border-rose-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl border border-amber-200">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                Contraseña Docente para Desbloqueo en el Equipo del Alumno
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-600 font-medium">
                  Utiliza tu <strong>clave de acceso docente</strong> en el equipo del alumno para desbloquear la prueba presencialmente, o pulsa el botón de desbloqueo global.
                </span>
              </div>
            </div>
          </div>

          {lockedStudents.length > 0 && (
            <button
              onClick={handleUnlockAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/30 transition transform active:scale-95"
            >
              <Unlock className="w-4 h-4" />
              <span>Desbloquear a Todos ({lockedStudents.length})</span>
            </button>
          )}
        </div>

        {/* Metrics Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-3 bg-slate-50 border-b border-slate-200 text-center">
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Bloqueados Ahora</span>
            <span className={`text-lg font-black ${lockedStudents.length > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
              {lockedStudents.length}
            </span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Infracciones</span>
            <span className="text-lg font-black text-amber-600">{totalInfractions}</span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Alumnos Infractores</span>
            <span className="text-lg font-black text-indigo-600">{studentsWithViolations.length}</span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Evaluados</span>
            <span className="text-lg font-black text-slate-800">{studentList.length}</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilter('locked')}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                filter === 'locked' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Bloqueados Actualmente ({lockedStudents.length})</span>
            </button>
            <button
              onClick={() => setFilter('history')}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                filter === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Con Historial de Alertas ({studentsWithViolations.length})</span>
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({studentList.length})
            </button>
          </div>
        </div>

        {/* Main List Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[50vh]">
          {displayList.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-black text-slate-800">
                {filter === 'locked'
                  ? '¡No hay evaluaciones bloqueadas actualmente!'
                  : 'No se registran incidencias de seguridad'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {filter === 'locked'
                  ? 'Todos los alumnos están realizando la prueba con normalidad o sin alertas activas.'
                  : 'Ningún estudiante ha intentado salir de la aplicación o realizar capturas de pantalla.'}
              </p>
            </div>
          ) : (
            displayList.map((st) => {
              const isLocked = st.isSecurityLocked || st.isOutOfTab;
              const isGroup = st.type === 'group';

              return (
                <div
                  key={st.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isLocked
                      ? 'bg-rose-50/80 border-rose-300 shadow-md ring-2 ring-rose-400/30'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                          isLocked ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isLocked ? <Lock className="w-5 h-5" /> : isGroup ? <Users className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-slate-900">{st.name}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                              isGroup ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {isGroup ? 'Grupo' : 'Individual'}
                          </span>
                          {st.testVariant && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                              Forma {st.testVariant}
                            </span>
                          )}
                          {isLocked ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs animate-pulse">
                              <Lock className="w-3 h-3" />
                              <span>BLOQUEADO</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Desbloqueado</span>
                            </span>
                          )}
                        </div>

                        {/* Members if group */}
                        {isGroup && st.members && st.members.length > 0 && (
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Integrantes: {st.members.join(', ')}
                          </p>
                        )}

                        {/* Lock / Violation reason */}
                        <p className="text-xs font-semibold text-rose-700 mt-1">
                          Motivo: {st.securityLockReason || st.securityViolationReason || st.lastAction || 'Salida de pestaña'}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isLocked ? (
                        <button
                          onClick={() => handleUnlockOne(st.id, st.name)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition transform active:scale-95"
                          title="Desbloquear la evaluación de este alumno inmediatamente"
                        >
                          <Unlock className="w-4 h-4" />
                          <span>Desbloquear Alumno</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Sin acción pendiente</span>
                      )}
                    </div>
                  </div>

                  {/* Incident Counters Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500 font-bold">Infracciones registradas:</span>
                    <span
                      className={`px-2 py-0.5 rounded-lg font-bold ${
                        (st.tabEscapes || 0) > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      🚪 {st.tabEscapes || 0} Salidas (Tiempo fuera: {formatSeconds(st.totalSecondsAway)})
                    </span>
                    {(st.screenshotAttempts || 0) > 0 && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 font-bold">
                        📸 {st.screenshotAttempts} Capturas
                      </span>
                    )}
                    {(st.splitScreenAttempts || 0) > 0 && (
                      <span className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800 font-bold">
                        🪟 {st.splitScreenAttempts} Pantalla dividida
                      </span>
                    )}
                    {(st.copyAttempts || 0) > 0 && (
                      <span className="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800 font-bold">
                        📋 {st.copyAttempts} Intentos de copia
                      </span>
                    )}
                    {(st.devtoolsAttempts || 0) > 0 && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-200 text-slate-800 font-bold">
                        🛠️ {st.devtoolsAttempts} DevTools
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Recent Security Feed Log */}
          {securityEvents.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Registro Cronológico de Alertas Recientes</span>
              </h4>
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs font-mono">
                {securityEvents.map((evt, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-700 py-1 border-b border-slate-100 last:border-0">
                    <span className="font-bold">{evt.detail}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            Al desbloquear un alumno, su pantalla se reactiva al instante sin recargar la página.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
