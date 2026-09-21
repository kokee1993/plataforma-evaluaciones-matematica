import React, { useState, useEffect } from 'react';
import { SessionData, Student, calculateStudentScore } from '../../types';
import {
  Trophy,
  Medal,
  Download,
  X,
  Search,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  User,
} from 'lucide-react';

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionData;
  students: Record<string, Student>;
}

export const RankingModal: React.FC<RankingModalProps> = ({
  isOpen,
  onClose,
  session,
  students,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'individual' | 'group' | 'alert'>('all');
  const [now, setNow] = useState(Date.now());

  // Keep live timers synchronized every second
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const totalQuestions = session.quizData?.length || 1;

  // Process and sort participants by dynamic formula score
  const participantList = (Object.entries(students || {}) as [string, Student][]).map(
    ([id, st]) => {
      const liveAwaySeconds =
        st.isOutOfTab && st.outOfTabTimestamp
          ? Math.max(0, Math.floor((now - st.outOfTabTimestamp) / 1000))
          : 0;

      const totalSecondsAway = (st.totalSecondsAway || 0) + liveAwaySeconds;
      const score = calculateStudentScore(st, liveAwaySeconds);
      const answeredCount = (st.correct || 0) + (st.errors || 0);
      const accuracy = answeredCount > 0 ? Math.round(((st.correct || 0) / answeredCount) * 100) : 0;
      const progress = Math.round((Math.min(st.currentQ || 0, totalQuestions) / totalQuestions) * 100);

      return {
        id,
        ...st,
        liveAwaySeconds,
        totalSecondsAway,
        score,
        answeredCount,
        accuracy,
        progress,
      };
    }
  );

  // Sort by score descending, then by correct answers descending
  participantList.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.correct - a.correct;
  });

  // Top 3 Podium
  const top1 = participantList[0];
  const top2 = participantList[1];
  const top3 = participantList[2];

  const filteredParticipants = participantList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.members && s.members.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase())));
    if (!matchesSearch) return false;
    if (filterMode === 'individual') return s.type !== 'group';
    if (filterMode === 'group') return s.type === 'group';
    if (filterMode === 'alert') return (s.tabEscapes || 0) > 0 || s.isOutOfTab;
    return true;
  });

  const handleExportCSV = () => {
    const headers = [
      'Posición',
      'Tipo',
      'Nombre_o_Grupo',
      'Integrantes',
      'Puntaje',
      'Aciertos',
      'Errores',
      'Incidencias_Salida',
      'Segundos_Fuera_App',
      'Intentos_Copia',
      'Precision_Porc',
      'Avance_Porc',
      'Dispositivo',
    ];

    const rows = participantList.map((s, idx) => {
      const typeStr = s.type === 'group' ? 'Grupo Cooperativo' : 'Individual';
      const membersStr = (s.members && s.members.length > 0) ? s.members.join('; ') : s.name;

      return [
        idx + 1,
        `"${typeStr}"`,
        `"${s.name.replace(/"/g, '""')}"`,
        `"${membersStr.replace(/"/g, '""')}"`,
        s.score,
        s.correct,
        s.errors,
        s.tabEscapes || 0,
        s.totalSecondsAway,
        s.copyAttempts || 0,
        `${s.accuracy}%`,
        `${s.progress}%`,
        `"${s.device || 'Móvil'}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute(
      'download',
      `Ranking_Calificaciones_${(session.title || 'Matematicas').replace(/\s+/g, '_')}_${dateStr}.csv`
    );
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-mono">
                  En Tiempo Real
                </span>
                <span className="text-xs text-slate-500">{session.title}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Ranking y Podio de la Sala
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="export-ranking-csv-btn"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
              title="Descargar calificaciones en CSV con detalle de integrantes"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar CSV Completo</span>
            </button>

            <button
              id="close-ranking-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">
          {/* Formula Callout Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-slate-800">Fórmula Ponderada:</span>
              <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                (Aciertos × 100) − (Errores × 20) − (Salidas × 50) − (Segundos Fuera × 1)
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Total Conexiones: <strong className="text-slate-800">{participantList.length}</strong>
            </div>
          </div>

          {/* Visual Podium (Top 3) */}
          {participantList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 pb-2 items-end">
              {/* 2nd Place (Silver) */}
              <div className="order-2 md:order-1 flex flex-col items-center">
                {top2 ? (
                  <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-3xl p-4 text-center shadow-sm relative pt-7 flex flex-col items-center hover:border-slate-300 transition">
                    <div className="absolute -top-4 w-9 h-9 rounded-full bg-slate-300 border-2 border-white shadow-md flex items-center justify-center font-black text-slate-700 text-sm">
                      🥈 2
                    </div>
                    {top2.type === 'group' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 mb-1">
                        👥 Grupo ({top2.members?.length} alumnos)
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900 text-base truncate max-w-full">
                      {top2.name}
                    </h3>
                    {top2.type === 'group' && top2.members && (
                      <p className="text-[11px] text-slate-500 truncate max-w-full mt-0.5">
                        {top2.members.join(', ')}
                      </p>
                    )}
                    <div className="text-2xl font-black text-slate-700 font-mono my-1">
                      {top2.score} <span className="text-xs font-normal text-slate-500">pts</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-2 font-mono">
                      <span className="text-emerald-600 font-bold">✓ {top2.correct}</span>
                      <span className="text-rose-500">✗ {top2.errors}</span>
                      <span className="text-amber-600">⚠️ {top2.tabEscapes || 0}</span>
                    </div>
                    <div className="mt-3 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-slate-500 h-full rounded-full"
                        style={{ width: `${top2.accuracy}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">{top2.accuracy}% Precisión</span>
                  </div>
                ) : (
                  <div className="w-full p-4 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
                    2° Lugar disponible
                  </div>
                )}
              </div>

              {/* 1st Place (Gold) - Elevated */}
              <div className="order-1 md:order-2 flex flex-col items-center -mt-2">
                {top1 ? (
                  <div className="w-full bg-gradient-to-b from-amber-50 to-white border-2 border-amber-400 rounded-3xl p-5 text-center shadow-lg shadow-amber-500/10 relative pt-8 flex flex-col items-center ring-4 ring-amber-400/20">
                    <div className="absolute -top-5 w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-white shadow-lg flex items-center justify-center font-black text-white text-base">
                      🥇 1
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Líder de la Clase
                      </span>
                      {top1.type === 'group' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          👥 Equipo ({top1.members?.length} alumnos)
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-slate-900 text-lg truncate max-w-full">
                      {top1.name}
                    </h3>
                    {top1.type === 'group' && top1.members && (
                      <p className="text-xs text-emerald-800 font-medium truncate max-w-full mt-0.5">
                        Integrantes: {top1.members.join(', ')}
                      </p>
                    )}

                    <div className="text-3xl font-black text-amber-600 font-mono my-1">
                      {top1.score} <span className="text-sm font-normal text-slate-500">pts</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-700 mt-2 font-mono">
                      <span className="text-emerald-600 font-bold">✓ {top1.correct}</span>
                      <span className="text-rose-500">✗ {top1.errors}</span>
                      <span className="text-amber-600">⚠️ {top1.tabEscapes || 0}</span>
                      <span className="text-slate-500">⏱️ {top1.totalSecondsAway}s</span>
                    </div>
                    <div className="mt-3 w-full bg-amber-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${top1.accuracy}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 mt-1">
                      {top1.accuracy}% Precisión ({top1.progress}% Avance)
                    </span>
                  </div>
                ) : (
                  <div className="w-full p-4 border border-dashed border-amber-200 rounded-2xl text-center text-xs text-slate-400">
                    Esperando respuestas...
                  </div>
                )}
              </div>

              {/* 3rd Place (Bronze) */}
              <div className="order-3 md:order-3 flex flex-col items-center">
                {top3 ? (
                  <div className="w-full bg-amber-50/40 border-2 border-amber-200/80 rounded-3xl p-4 text-center shadow-sm relative pt-7 flex flex-col items-center hover:border-amber-300 transition">
                    <div className="absolute -top-4 w-9 h-9 rounded-full bg-amber-600 border-2 border-white shadow-md flex items-center justify-center font-black text-white text-sm">
                      🥉 3
                    </div>
                    {top3.type === 'group' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 mb-1">
                        👥 Grupo ({top3.members?.length} alumnos)
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900 text-base truncate max-w-full">
                      {top3.name}
                    </h3>
                    {top3.type === 'group' && top3.members && (
                      <p className="text-[11px] text-slate-500 truncate max-w-full mt-0.5">
                        {top3.members.join(', ')}
                      </p>
                    )}
                    <div className="text-2xl font-black text-amber-800 font-mono my-1">
                      {top3.score} <span className="text-xs font-normal text-slate-500">pts</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-2 font-mono">
                      <span className="text-emerald-600 font-bold">✓ {top3.correct}</span>
                      <span className="text-rose-500">✗ {top3.errors}</span>
                      <span className="text-amber-600">⚠️ {top3.tabEscapes || 0}</span>
                    </div>
                    <div className="mt-3 w-full bg-amber-200/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full"
                        style={{ width: `${top3.accuracy}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">{top3.accuracy}% Precisión</span>
                  </div>
                ) : (
                  <div className="w-full p-4 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
                    3° Lugar disponible
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Controls: Search & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-ranking-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por participante o integrante..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs bg-slate-100 p-1 rounded-xl">
              <button
                id="ranking-filter-all"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  filterMode === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Todos ({participantList.length})
              </button>
              <button
                id="ranking-filter-individual"
                onClick={() => setFilterMode('individual')}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                  filterMode === 'individual'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-3 h-3" />
                <span>Individuales</span>
              </button>
              <button
                id="ranking-filter-group"
                onClick={() => setFilterMode('group')}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                  filterMode === 'group'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>Grupos</span>
              </button>
              <button
                id="ranking-filter-alert"
                onClick={() => setFilterMode('alert')}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                  filterMode === 'alert'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Con Alertas</span>
              </button>
            </div>
          </div>

          {/* Full Leaderboard Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-3 px-3 text-center w-12">#</th>
                    <th className="py-3 px-4">Participante / Integrantes</th>
                    <th className="py-3 px-3 text-center">Tipo</th>
                    <th className="py-3 px-3 text-center">Puntaje</th>
                    <th className="py-3 px-3 text-center">Aciertos (✓)</th>
                    <th className="py-3 px-3 text-center">Errores (✗)</th>
                    <th className="py-3 px-3 text-center">Salidas (⚠️)</th>
                    <th className="py-3 px-3 text-center">Tiempo Fuera</th>
                    <th className="py-3 px-3 text-center">Precisión</th>
                    <th className="py-3 px-3 text-center">Avance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredParticipants.length > 0 ? (
                    filteredParticipants.map((st, index) => {
                      const isTop3 = index < 3;
                      const isGroup = st.type === 'group';

                      return (
                        <tr
                          key={st.id}
                          className={`hover:bg-slate-50/80 transition ${
                            st.isOutOfTab
                              ? 'bg-rose-50/70'
                              : isTop3
                              ? 'bg-amber-50/30 font-medium'
                              : ''
                          }`}
                        >
                          {/* Rank Column */}
                          <td className="py-3 px-3 text-center font-bold">
                            {index === 0 && <span className="text-amber-500 font-black">🥇 1</span>}
                            {index === 1 && <span className="text-slate-400 font-black">🥈 2</span>}
                            {index === 2 && <span className="text-amber-700 font-black">🥉 3</span>}
                            {index > 2 && <span className="text-slate-400 font-mono">#{index + 1}</span>}
                          </td>

                          {/* Participant Name, Members & Live Status */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  st.isOutOfTab
                                    ? 'bg-rose-500 animate-ping'
                                    : isGroup
                                    ? 'bg-emerald-500'
                                    : 'bg-indigo-500'
                                }`}
                              />
                              <span className="font-bold text-slate-900">{st.name}</span>
                              {st.isOutOfTab && (
                                <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[9px] font-bold animate-pulse">
                                  FUERA: {formatSeconds(st.liveAwaySeconds)}
                                </span>
                              )}
                            </div>

                            {/* If group, show member chips */}
                            {isGroup && st.members && (
                              <div className="text-[11px] text-slate-600 mt-1 flex flex-wrap gap-1">
                                {st.members.map((m, mi) => (
                                  <span
                                    key={mi}
                                    className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-700 border border-slate-200"
                                  >
                                    {m}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {st.device || 'Dispositivo'} • {st.lastAction}
                            </div>
                          </td>

                          {/* Type Badge */}
                          <td className="py-3 px-3 text-center">
                            {isGroup ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                👥 Grupo
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                                👤 Individual
                              </span>
                            )}
                          </td>

                          {/* Score */}
                          <td className="py-3 px-3 text-center font-mono font-black text-sm text-indigo-600">
                            {st.score}
                          </td>

                          {/* Correct */}
                          <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">
                            {st.correct}
                          </td>

                          {/* Errors */}
                          <td className="py-3 px-3 text-center font-mono font-bold text-rose-500">
                            {st.errors}
                          </td>

                          {/* Escapes */}
                          <td className="py-3 px-3 text-center">
                            {(st.tabEscapes || 0) > 0 ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono font-bold text-[11px]">
                                {st.tabEscapes}
                              </span>
                            ) : (
                              <span className="text-slate-400">0</span>
                            )}
                          </td>

                          {/* Time Away */}
                          <td className="py-3 px-3 text-center font-mono text-slate-600">
                            {st.totalSecondsAway > 0 ? (
                              <span className="text-rose-600 font-bold">
                                {formatSeconds(st.totalSecondsAway)}
                              </span>
                            ) : (
                              <span className="text-slate-400">00:00</span>
                            )}
                          </td>

                          {/* Accuracy */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-slate-700">{st.accuracy}%</span>
                              <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-0.5">
                                <div
                                  className={`h-full rounded-full ${
                                    st.accuracy >= 70
                                      ? 'bg-emerald-500'
                                      : st.accuracy >= 40
                                      ? 'bg-amber-500'
                                      : 'bg-rose-500'
                                  }`}
                                  style={{ width: `${st.accuracy}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Progress */}
                          <td className="py-3 px-3 text-center">
                            <span className="font-mono text-slate-600">
                              {Math.min(st.currentQ, totalQuestions)} / {totalQuestions}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                        No hay participantes registrados con ese filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Las puntuaciones se recalculan en tiempo real según aciertos, errores y salidas de pantalla.
          </div>
          <button
            id="ranking-modal-close-bottom-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
