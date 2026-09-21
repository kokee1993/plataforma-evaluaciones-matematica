import React, { useState, useEffect } from 'react';
import { Student, SessionData, calculateStudentScore, TestFormVariant } from '../../types';
import { TEST_FORMS_CONFIG, getBalancedFormVariant } from '../../data/donBoscoHomoteciaQuiz';
import { realtimeDb } from '../../lib/firebase';
import {
  Users,
  User,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Smartphone,
  Search,
  UserX,
  UserPlus,
  Zap,
  Sparkles,
  Trophy,
  Filter,
  Eye,
  Camera,
  Star,
  BookOpen,
  Layers,
  Lock,
  Unlock,
  WifiOff,
} from 'lucide-react';

// Notebook photos temporarily disabled per teacher request
const NOTEBOOK_PHOTOS_ENABLED = false;

interface StudentMonitorProps {
  students: Record<string, Student>;
  session: SessionData;
  onOpenNotebookModal?: (studentId?: string) => void;
}

export const StudentMonitor: React.FC<StudentMonitorProps> = ({ students, session, onOpenNotebookModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<
    'all' | 'individual' | 'group' | 'locked' | 'out_now' | 'escaped' | 'forma_A' | 'forma_B' | 'forma_C' | 'forma_D'
  >('all');
  const [now, setNow] = useState(Date.now());
  const [confirmKickId, setConfirmKickId] = useState<string | null>(null);
  const [showConfirmKickAll, setShowConfirmKickAll] = useState<boolean>(false);

  // Synchronize live clock every 1000ms for ticking out-of-tab stopwatches
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const studentEntries = (Object.entries(students || {}) as [string, Student][]).map(
    ([id, st]) => {
      const liveAwaySeconds =
        st.isOutOfTab && st.outOfTabTimestamp
          ? Math.max(0, Math.floor((now - st.outOfTabTimestamp) / 1000))
          : 0;
      const totalSecondsAway = (st.totalSecondsAway || 0) + liveAwaySeconds;
      const score = calculateStudentScore(st, liveAwaySeconds);
      return {
        id,
        ...st,
        liveAwaySeconds,
        totalSecondsAway,
        score,
      };
    }
  );

  const totalParticipants = studentEntries.length;
  const individualCount = studentEntries.filter((s) => s.type !== 'group').length;
  const groupCount = studentEntries.filter((s) => s.type === 'group').length;
  const totalStudentsInGroups = studentEntries
    .filter((s) => s.type === 'group')
    .reduce((acc, s) => acc + (s.members?.length || 2), 0);
  const totalActivePeople = individualCount + totalStudentsInGroups;

  const outNowCount = studentEntries.filter((s) => s.isOutOfTab).length;
  const lockedCount = studentEntries.filter((s) => s.isSecurityLocked || s.isOutOfTab).length;
  const totalEscapes = studentEntries.reduce((acc, s) => acc + (s.tabEscapes || 0), 0);
  const totalQuestions = session.quizData.length || 1;

  // Form variant counts
  const formaACount = studentEntries.filter((s) => (s.testVariant || 'A') === 'A').length;
  const formaBCount = studentEntries.filter((s) => s.testVariant === 'B').length;
  const formaCCount = studentEntries.filter((s) => s.testVariant === 'C').length;
  const formaDCount = studentEntries.filter((s) => s.testVariant === 'D').length;

  // Filter participants
  const filteredParticipants = studentEntries
    .filter((st) => {
      const matchName =
        st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (st.members && st.members.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase())));
      if (!matchName) return false;
      if (filterMode === 'individual') return st.type !== 'group';
      if (filterMode === 'group') return st.type === 'group';
      if (filterMode === 'locked') return Boolean(st.isSecurityLocked || st.isOutOfTab);
      if (filterMode === 'out_now') return st.isOutOfTab;
      if (filterMode === 'escaped') return (st.tabEscapes || 0) > 0;
      if (filterMode === 'forma_A') return (st.testVariant || 'A') === 'A';
      if (filterMode === 'forma_B') return st.testVariant === 'B';
      if (filterMode === 'forma_C') return st.testVariant === 'C';
      if (filterMode === 'forma_D') return st.testVariant === 'D';
      return true;
    })
    .sort((a, b) => {
      // Prioritize locked or out of tab, then by score
      const aLocked = a.isSecurityLocked || a.isOutOfTab;
      const bLocked = b.isSecurityLocked || b.isOutOfTab;
      if (aLocked && !bLocked) return -1;
      if (!aLocked && bLocked) return 1;
      return b.score - a.score;
    });

  const handleKick = (id: string) => {
    realtimeDb.kickStudent(id);
    setConfirmKickId(null);
  };

  const handleKickAll = () => {
    realtimeDb.kickAllStudents();
    setShowConfirmKickAll(false);
  };

  const handleAddDemoIndividual = (count: number = 3) => {
    const sampleNames = [
      'Valentina Morales',
      'Benjamín Silva',
      'Sofía Valenzuela',
      'Lucas Martínez',
      'Martina Rojas',
      'Mateo Díaz',
      'Isidora Castro',
      'Joaquín Araya',
    ];
    const existingNames = new Set(studentEntries.map((s) => s.name));
    const available = sampleNames.filter((n) => !existingNames.has(n));
    const toAdd = (available.length >= count ? available : sampleNames).slice(0, count);

    toAdd.forEach((name, i) => {
      const id = `demo-st-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`;
      const assignedVariant = getBalancedFormVariant(students, id);
      realtimeDb.registerOrUpdateParticipant({
        id,
        type: 'individual',
        name,
        testVariant: assignedVariant,
        device: 'Celular',
      });
    });
  };

  const handleAddDemoGroup = () => {
    const groupPresets = [
      { name: 'Grupo 1 (Álgebra)', num: '1', members: ['Dante Castro', 'Hans Fischer', 'Gabriel Soto'] },
      { name: 'Grupo 2 (Geometría)', num: '2', members: ['Valentina Paz', 'Tomás Rojas', 'Isidora M.'] },
      { name: 'Grupo 3 (Cálculo)', num: '3', members: ['Martina Vega', 'Vicente Lagos', 'Emilia Silva', 'Joaquín D.'] },
    ];
    const nextGroup = groupPresets[groupCount % groupPresets.length];
    const id = `demo-grp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const assignedVariant = getBalancedFormVariant(students, id);

    realtimeDb.registerOrUpdateParticipant({
      id,
      type: 'group',
      name: nextGroup.name,
      groupNumber: nextGroup.num,
      members: nextGroup.members,
      testVariant: assignedVariant,
      device: 'Tablet Grupal',
    });
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header and Live Overview Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Muro de Monitoreo en Vivo
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                {totalParticipants} Conexiones ({totalActivePeople} Alumnos)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Supervisión de alumnos individuales y grupos cooperativos (hasta 50 conexiones simultáneas)
            </p>
          </div>
        </div>

        {/* Quick Demo Fill & Metrics */}
        <div className="flex flex-wrap items-center gap-2">
          {outNowCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>{outNowCount} Fuera de la App</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button
              id="admin-add-individual-btn"
              onClick={() => handleAddDemoIndividual(2)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              title="Añadir 2 alumnos individuales de prueba"
            >
              <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
              <span>+ Alumno</span>
            </button>
            <button
              id="admin-add-group-btn"
              onClick={handleAddDemoGroup}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition"
              title="Añadir un grupo cooperativo de prueba"
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Grupo (Cooperativo)</span>
            </button>
            <button
              id="admin-kick-all-btn"
              onClick={() => setShowConfirmKickAll(true)}
              disabled={totalParticipants === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              title="Expulsar a todos los estudiantes de la sala actual para permitir un ingreso ordenado"
            >
              <UserX className="w-3.5 h-3.5 text-rose-600" />
              <span>Limpiar Sala ({totalParticipants})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="student-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por alumno o integrante de grupo..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 outline-none transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs bg-slate-100 p-1 rounded-xl">
          <button
            id="filter-monitor-all"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Todos ({totalParticipants})
          </button>

          <button
            id="filter-monitor-individual"
            onClick={() => setFilterMode('individual')}
            className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              filterMode === 'individual'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3 h-3" />
            <span>Individual ({individualCount})</span>
          </button>

          <button
            id="filter-monitor-group"
            onClick={() => setFilterMode('group')}
            className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              filterMode === 'group'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Grupos ({groupCount})</span>
          </button>

          <button
            id="filter-monitor-locked"
            onClick={() => setFilterMode('locked')}
            className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              filterMode === 'locked'
                ? 'bg-rose-600 text-white shadow-sm'
                : lockedCount > 0
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 animate-pulse'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Bloqueados ({lockedCount})</span>
          </button>

          <button
            id="filter-monitor-out-now"
            onClick={() => setFilterMode('out_now')}
            className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              filterMode === 'out_now'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Fuera ({outNowCount})</span>
          </button>

          {/* Form Variant Filters */}
          <button
            id="filter-monitor-forma-a"
            onClick={() => setFilterMode('forma_A')}
            className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
              filterMode === 'forma_A'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            Forma A ({formaACount})
          </button>

          <button
            id="filter-monitor-forma-b"
            onClick={() => setFilterMode('forma_B')}
            className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
              filterMode === 'forma_B'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Forma B ({formaBCount})
          </button>

          <button
            id="filter-monitor-forma-c"
            onClick={() => setFilterMode('forma_C')}
            className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
              filterMode === 'forma_C'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Forma C ({formaCCount})
          </button>

          <button
            id="filter-monitor-forma-d"
            onClick={() => setFilterMode('forma_D')}
            className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
              filterMode === 'forma_D'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            Forma D ({formaDCount})
          </button>

          {onOpenNotebookModal && (
            <button
              onClick={() => onOpenNotebookModal()}
              className="px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm"
              title="Abrir galería de cuadernos de evidencias"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cuadernos 📸</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Student and Group Cards */}
      {filteredParticipants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredParticipants.map((st) => {
            const isGroup = st.type === 'group';
            const currentQAnswer = st.answers?.[session.activeQuestion];
            const isAnsweringCurrent = currentQAnswer !== undefined;
            const isConfirmingKick = confirmKickId === st.id;
            const members = st.members || [st.name];
            const photosCount = Object.keys(st.notebookPhotos || {}).length;
            const variantKey: TestFormVariant = st.testVariant || 'A';
            const formCfg = TEST_FORMS_CONFIG[variantKey] || TEST_FORMS_CONFIG.A;

            return (
              <div
                key={st.id}
                id={`student-card-${st.id}`}
                className={`p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                  st.isOutOfTab
                    ? 'bg-rose-50 border-rose-400 shadow-md ring-2 ring-rose-400/30 animate-pulse'
                    : isGroup
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                    : (st.tabEscapes || 0) > 0
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Card Top: Type Badge, Name & Kick Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${
                          st.isOutOfTab
                            ? 'bg-rose-600 animate-ping'
                            : isGroup
                            ? 'bg-emerald-500'
                            : 'bg-indigo-500'
                        }`}
                      />
                      <div className="min-w-0">
                        {isGroup ? (
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-600 text-white tracking-wider">
                              👥 {st.name}
                            </span>
                            <span className="text-[10px] text-emerald-800 font-bold">
                              ({members.length} Alumnos)
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${formCfg.pillBg} border ${formCfg.borderColor} tracking-wider`}
                              title={`Evaluación asignada: ${formCfg.label} (${formCfg.fullName})`}
                            >
                              {formCfg.label}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4
                              className="font-bold text-slate-900 text-xs truncate"
                              title={st.name}
                            >
                              {st.name}
                            </h4>
                            <span
                              className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${formCfg.pillBg} border ${formCfg.borderColor} tracking-wider shrink-0`}
                              title={`Evaluación asignada: ${formCfg.label} (${formCfg.fullName})`}
                            >
                              {formCfg.label}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Kick Button / Confirm */}
                    {isConfirmingKick ? (
                      <div className="flex items-center gap-1 shrink-0 animate-in fade-in">
                        <button
                          onClick={() => handleKick(st.id)}
                          className="px-2 py-0.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-sm transition"
                          title="Confirmar expulsión"
                        >
                          Sí, expulsar
                        </button>
                        <button
                          onClick={() => setConfirmKickId(null)}
                          className="px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmKickId(st.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                        title={isGroup ? 'Expulsar grupo' : 'Expulsar alumno'}
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* If Group: List all member chips */}
                  {isGroup && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {members.map((member, mIdx) => (
                        <span
                          key={mIdx}
                          className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium truncate max-w-[150px]"
                          title={member}
                        >
                          • {member}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Security Locked Banner with Quick Teacher Unlock */}
                  {(st.isSecurityLocked || st.isOutOfTab) && (
                    <div className="mt-2 p-2 rounded-xl bg-rose-600 text-white text-[11px] font-bold shadow-md ring-2 ring-rose-300 space-y-1.5 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 animate-bounce" />
                          <span className="uppercase tracking-wider text-[10px]">🔒 BLOQUEADO</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            realtimeDb.unlockStudentSecurity(st.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 text-[10px] font-black shadow-xs flex items-center gap-1 cursor-pointer transition active:scale-95"
                          title="Desbloquear este alumno inmediatamente"
                        >
                          <Unlock className="w-3 h-3 text-emerald-600" />
                          <span>Desbloquear</span>
                        </button>
                      </div>
                      <div className="text-[10px] text-rose-100 flex items-center justify-between border-t border-rose-700/60 pt-1">
                        <span className="truncate max-w-[140px]" title={st.securityLockReason || 'Salida de pestaña'}>
                          {st.securityLockReason || 'Salida de pestaña'}
                        </span>
                        {st.liveAwaySeconds > 0 && (
                          <span className="font-mono font-bold text-amber-200">
                            {formatSeconds(st.liveAwaySeconds)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Split Screen Alert Banner */}
                  {st.isSplitScreen && !st.isOutOfTab && !st.isSecurityLocked && (
                    <div className="mt-2 p-1.5 rounded-xl bg-amber-600 text-white text-[11px] font-bold flex items-center justify-between shadow-sm animate-pulse">
                      <div className="flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>🪟 Pantalla Dividida Activa</span>
                      </div>
                      <span className="bg-amber-800 px-1.5 py-0.5 rounded text-[10px] font-mono">
                        #{st.splitScreenAttempts || 1}
                      </span>
                    </div>
                  )}

                  {/* Disconnected - Suspicious Alert Banner */}
                  {(st.isDisconnectedSuspicious || (!st.connected && st.lastActive && (now - (st.last_active || st.lastActive || 0) > 15000) && st.currentQ > 0)) && !st.isOutOfTab && !st.isSecurityLocked && (
                    <div className="mt-2 p-1.5 rounded-xl bg-orange-600 text-white text-[10px] font-bold flex items-center justify-between shadow-sm animate-pulse">
                      <div className="flex items-center gap-1">
                        <WifiOff className="w-3.5 h-3.5" />
                        <span>⚠️ Desconectado - Sospechoso</span>
                      </div>
                      <span className="bg-orange-800 px-1.5 py-0.5 rounded text-[9px] font-mono">
                        {Math.floor((now - (st.last_active || st.lastActive || now)) / 1000)}s
                      </span>
                    </div>
                  )}

                  {/* Score and Counters Row */}
                  <div className="grid grid-cols-4 gap-1 text-center mt-2.5 font-mono text-[11px]">
                    <div className="p-1 rounded-lg bg-indigo-50 border border-indigo-100">
                      <span className="block text-[8px] text-indigo-400 uppercase font-bold">PTS</span>
                      <span className="font-bold text-indigo-700">{st.score}</span>
                    </div>
                    <div className="p-1 rounded-lg bg-emerald-50 border border-emerald-100">
                      <span className="block text-[8px] text-emerald-500 uppercase font-bold">✓</span>
                      <span className="font-bold text-emerald-700">{st.correct}</span>
                    </div>
                    <div className="p-1 rounded-lg bg-rose-50 border border-rose-100">
                      <span className="block text-[8px] text-rose-400 uppercase font-bold">✗</span>
                      <span className="font-bold text-rose-700">{st.errors}</span>
                    </div>
                    <div className="p-1 rounded-lg bg-amber-50 border border-amber-100">
                      <span className="block text-[8px] text-amber-500 uppercase font-bold">⚠️</span>
                      <span className="font-bold text-amber-700">{st.tabEscapes || 0}</span>
                    </div>
                  </div>

                  {/* Anti-Cheat Security Violation Chips */}
                  {((st.splitScreenAttempts || 0) > 0 ||
                    (st.tabAttempts || 0) > 0 ||
                    (st.copyAttempts || 0) > 0 ||
                    (st.screenshotAttempts || 0) > 0 ||
                    (st.devtoolsAttempts || 0) > 0 ||
                    (st.secondMonitorAttempts || 0) > 0) && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(st.splitScreenAttempts || 0) > 0 && (
                        <span
                          className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
                          title="Intentos de uso de pantalla dividida / ventana reducida"
                        >
                          🪟 Dividida: {st.splitScreenAttempts}
                        </span>
                      )}
                      {(st.tabAttempts || 0) > 0 && (
                        <span
                          className="text-[9px] bg-purple-100 text-purple-900 border border-purple-300 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
                          title="Intentos de navegación con tecla TAB"
                        >
                          ⌨️ TAB: {st.tabAttempts}
                        </span>
                      )}
                      {(st.copyAttempts || 0) > 0 && (
                        <span
                          className="text-[9px] bg-rose-100 text-rose-900 border border-rose-300 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
                          title="Intentos de copia o atajos no permitidos"
                        >
                          📋 Copia: {st.copyAttempts}
                        </span>
                      )}
                      {(st.screenshotAttempts || 0) > 0 && (
                        <span
                          className="text-[9px] bg-red-100 text-red-900 border border-red-300 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
                          title="Intentos de captura de pantalla (PrintScreen / Guardar PDF)"
                        >
                          📸 Captura: {st.screenshotAttempts}
                        </span>
                      )}
                      {(st.devtoolsAttempts || 0) > 0 && (
                        <span
                          className="text-[9px] bg-red-200 text-red-950 border border-red-400 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
                          title="Consola de desarrollador abierta"
                        >
                          🛠️ DevTools: {st.devtoolsAttempts}
                        </span>
                      )}
                      {(st.secondMonitorAttempts || 0) > 0 && (
                        <span
                          className="text-[9px] bg-orange-100 text-orange-950 border border-orange-300 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
                          title="Segundo monitor / pantalla extendida detectada"
                        >
                          🖥️ 2do Monitor: {st.secondMonitorAttempts}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Notebook Photos Button (Disabled temporarily per teacher preference) */}
                  {NOTEBOOK_PHOTOS_ENABLED && photosCount > 0 && onOpenNotebookModal && (
                    <button
                      onClick={() => onOpenNotebookModal(st.id)}
                      className="mt-2 w-full py-1 px-2 rounded-lg bg-indigo-100/70 hover:bg-indigo-100 text-indigo-800 text-[10px] font-bold flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-1">
                        <Camera className="w-3 h-3 text-indigo-600" />
                        <span>{photosCount} {photosCount === 1 ? 'Foto Cuaderno' : 'Fotos Cuaderno'}</span>
                      </span>
                      <span className="text-[9px] text-indigo-600">Revisar 👁️</span>
                    </button>
                  )}
                </div>

                {/* Card Bottom: Progress Bar & Current Question Status */}
                <div className="mt-3 pt-2 border-t border-slate-200/70 text-[10px] text-slate-500 flex items-center justify-between">
                  <span className="truncate max-w-[120px]" title={st.lastAction}>
                    {st.lastAction}
                  </span>

                  <div className="flex items-center gap-1 font-mono">
                    <span className="text-slate-600">
                      P{Math.min(st.currentQ, totalQuestions)}/{totalQuestions}
                    </span>
                    {isAnsweringCurrent && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          currentQAnswer.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        title={currentQAnswer.isCorrect ? 'Correcto' : 'Incorrecto'}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 text-center bg-slate-50 rounded-2xl border border-slate-200">
          <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">
            {searchTerm
              ? 'No se encontraron participantes con ese criterio de búsqueda.'
              : 'No hay participantes conectados en la sala.'}
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <button
              onClick={() => handleAddDemoIndividual(3)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
            >
              +3 Alumnos Demo
            </button>
            <button
              onClick={handleAddDemoGroup}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
            >
              + Grupo Cooperativo Demo
            </button>
          </div>
        </div>
      )}
      {/* Modal de Confirmación de Limpieza de Sala */}
      {showConfirmKickAll && (
        <div
          id="confirm-kick-all-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            id="confirm-kick-all-modal-container"
            className="bg-white rounded-3xl border border-rose-200 max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <UserX className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">¿Limpiar sala y expulsar a todos?</h3>
                <p className="text-xs text-slate-500 font-medium">Desconexión general para reingreso ordenado</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed bg-rose-50/70 border border-rose-100 p-3.5 rounded-2xl">
              <p>
                Esta acción desconectará de inmediato a las{' '}
                <strong className="text-rose-700 font-bold">
                  {totalParticipants} conexiones ({totalActivePeople} alumnos)
                </strong>{' '}
                activas en este momento.
              </p>
              <p className="text-slate-500">
                • El código PIN <strong className="font-mono text-slate-800 font-bold">({session.pin})</strong> se mantendrá activo en pantalla.
                <br />
                • Los estudiantes verán una notificación indicando que ingresen nuevamente con sus nombres reales.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                id="cancel-kick-all-btn"
                onClick={() => setShowConfirmKickAll(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Cancelar
              </button>
              <button
                id="confirm-kick-all-action-btn"
                onClick={handleKickAll}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition active:scale-95 flex items-center gap-2"
              >
                <UserX className="w-4 h-4" />
                <span>Sí, Limpiar y Expulsar a Todos</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
