import React, { useState, useEffect, useMemo } from 'react';
import {
  Student,
  SessionData,
  GradebookCourseRecord,
  GradebookEntry,
  calculateChileanGrade,
  calculateStudentScore,
  TestFormVariant,
} from '../../types';
import { TEST_FORMS_CONFIG } from '../../data/donBoscoHomoteciaQuiz';
import { ROSTER_1_MEDIO_D, CourseStudent } from '../../data/courseRoster1D';
import { realtimeDb } from '../../lib/firebase';
import {
  X,
  BookOpen,
  Save,
  Download,
  Printer,
  Trash2,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  Search,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  CloudCheck,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { GradebookReportModal } from './GradebookReportModal';
import { GradebookCleanupModal } from './GradebookCleanupModal';

interface GradebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Record<string, Student>;
  session: SessionData;
}

const COURSES_LIST = [
  { key: '1_medio_D', label: '1° Medio D (Nómina Oficial 45 Alumnos)' },
  { key: '1_medio_A', label: '1° Medio A' },
  { key: '1_medio_B', label: '1° Medio B' },
  { key: '8_basico_A', label: '8° Básico A' },
  { key: '8_basico_B', label: '8° Básico B' },
  { key: '2_medio_A', label: '2° Medio A' },
  { key: '2_medio_B', label: '2° Medio B' },
  { key: '3_medio_TP', label: '3° Medio TP' },
  { key: '4_medio_TP', label: '4° Medio TP' },
];

export const GradebookModal: React.FC<GradebookModalProps> = ({
  isOpen,
  onClose,
  students,
  session,
}) => {
  const [records, setRecords] = useState<GradebookCourseRecord[]>([]);
  const [selectedCourseKey, setSelectedCourseKey] = useState<string>('1_medio_D');
  const [viewRecordId, setViewRecordId] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFullRoster, setShowFullRoster] = useState<boolean>(true);
  const [inspectingEntry, setInspectingEntry] = useState<GradebookEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isCleanupModalOpen, setIsCleanupModalOpen] = useState<boolean>(false);

  // Sync records from server on open and periodically
  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const serverRecords = await realtimeDb.fetchGradebookRecords();
      setRecords(serverRecords);
    } catch (e) {
      console.warn('Error loading gradebook records:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadRecords();
      const interval = setInterval(loadRecords, 6000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const studentList: Student[] = Object.values(students || {}) as Student[];
  const totalQuestions = session.quizData.length || 14;

  // Build live entries from current active session
  const currentLiveEntries: GradebookEntry[] = studentList.map((st) => {
    const isGroup = st.type === 'group';
    const score = calculateStudentScore(st);
    const photoCount = Object.keys(st.notebookPhotos || {}).length;

    // Calculate grade based on correct answers and notebook evidence bonus
    const maxScore = totalQuestions * 100 + totalQuestions * 30;
    const earnedScore = (st.correct || 0) * 100 + photoCount * 30;
    const grade = calculateChileanGrade(earnedScore, maxScore, 0.6);

    return {
      studentId: st.id || '',
      participantName: st.name,
      type: st.type || 'individual',
      members: st.members,
      firstName: st.firstName,
      paternalLastName: st.paternalLastName,
      maternalLastName: st.maternalLastName,
      listNumber: st.listNumber,
      course: st.course || '1° Medio D',
      courseKey: st.courseKey || '1_medio_D',
      testVariant: st.testVariant || 'A',
      correct: st.correct || 0,
      errors: st.errors || 0,
      totalQuestions,
      score,
      notebookPhotosCount: photoCount,
      grade,
      passed: grade >= 4.0,
      timestamp: st.lastActive || Date.now(),
      answers: st.answers,
      isFinalized: Boolean(st.isFinalized),
      finalizedAt: st.finalizedAt,
    };
  });

  const liveAvgGrade =
    currentLiveEntries.length > 0
      ? Math.round(
          (currentLiveEntries.reduce((acc, e) => acc + e.grade, 0) / currentLiveEntries.length) * 10
        ) / 10
      : 0;

  const handleManualArchive = async () => {
    realtimeDb.archiveCurrentSession();
    const updated = await realtimeDb.fetchGradebookRecords();
    setRecords(updated);
    setSaveSuccessMsg('¡Respaldo sincronizado y guardado con éxito en el disco del servidor!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleDeleteRecord = (id: string) => {
    realtimeDb.deleteGradebookRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
    if (viewRecordId === id) setViewRecordId(null);
  };

  const activeViewRecord = viewRecordId
    ? records.find((r) => r.id === viewRecordId)
    : null;

  const rawEntries = activeViewRecord ? activeViewRecord.entries : currentLiveEntries;
  const isViewing1D = selectedCourseKey === '1_medio_D' || (activeViewRecord?.courseKey === '1_medio_D');

  // If viewing 1° Medio D with showFullRoster enabled, merge with official 45 roster
  const displayEntries: Array<GradebookEntry & { isAbsentOrPending?: boolean; officialRosterItem?: CourseStudent }> = (() => {
    if (isViewing1D && showFullRoster) {
      return ROSTER_1_MEDIO_D.map((official) => {
        // Find if this student has an entry
        const found = rawEntries.find((e) => {
          if (e.listNumber && e.listNumber === official.listNumber) return true;
          const eName = (e.participantName || '').toLowerCase().trim();
          const oFull = official.fullName.toLowerCase().trim();
          const oLast = `${official.paternalLastName} ${official.maternalLastName}`.toLowerCase().trim();
          return eName.includes(official.paternalLastName.toLowerCase()) || oFull.includes(eName);
        });

        if (found) {
          return {
            ...found,
            listNumber: official.listNumber,
            firstName: found.firstName || official.firstName,
            paternalLastName: found.paternalLastName || official.paternalLastName,
            maternalLastName: found.maternalLastName || official.maternalLastName,
            officialRosterItem: official,
            isAbsentOrPending: false,
          };
        }

        // Student hasn't joined or submitted yet
        return {
          studentId: `roster-${official.listNumber}`,
          participantName: official.fullName,
          firstName: official.firstName,
          paternalLastName: official.paternalLastName,
          maternalLastName: official.maternalLastName,
          listNumber: official.listNumber,
          type: 'individual',
          course: '1° Medio D',
          courseKey: '1_medio_D',
          testVariant: 'A',
          correct: 0,
          errors: 0,
          totalQuestions,
          score: 0,
          notebookPhotosCount: 0,
          grade: 1.0,
          passed: false,
          timestamp: 0,
          officialRosterItem: official,
          isAbsentOrPending: true,
        };
      });
    }

    return rawEntries.map((e) => ({ ...e, isAbsentOrPending: false }));
  })();

  // Filter by search query
  const filteredEntries = displayEntries.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = (e.participantName || '').toLowerCase().includes(q);
    const listMatch = e.listNumber ? String(e.listNumber) === q : false;
    const patMatch = (e.paternalLastName || '').toLowerCase().includes(q);
    const matMatch = (e.maternalLastName || '').toLowerCase().includes(q);
    return nameMatch || listMatch || patMatch || matMatch;
  });

  const evaluatedEntries = displayEntries.filter((e) => !e.isAbsentOrPending);
  const avgGrade =
    evaluatedEntries.length > 0
      ? Math.round(
          (evaluatedEntries.reduce((acc, e) => acc + e.grade, 0) / evaluatedEntries.length) * 10
        ) / 10
      : 0;

  const passedCount = evaluatedEntries.filter((e) => e.passed).length;
  const approvedPct =
    evaluatedEntries.length > 0
      ? Math.round((passedCount / evaluatedEntries.length) * 100)
      : 0;

  const displayTitle = activeViewRecord
    ? `${activeViewRecord.courseName} - ${activeViewRecord.activityTitle} (${activeViewRecord.date})`
    : `Sesión en Vivo: ${session.title || 'Evaluación Actual'}`;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'N° Lista',
      'Apellido Paterno',
      'Apellido Materno',
      'Nombres',
      'Nombre Completo',
      'Curso',
      'Forma Evaluación',
      'Correctas',
      'Errores',
      'Puntaje',
      'Nota (1.0-7.0)',
      'Estado Aprobación',
      'Estado Rendición',
    ];

    const rows = filteredEntries.map((e) => {
      const variantKey = e.testVariant || 'A';
      const formLabel = TEST_FORMS_CONFIG[variantKey]?.label || `Forma ${variantKey}`;
      const statusRendicion = e.isAbsentOrPending
        ? 'Sin rendir / Ausente'
        : e.isFinalized
        ? 'Entregada y Finalizada'
        : 'En progreso';

      return [
        e.listNumber || '-',
        `"${(e.paternalLastName || '').replace(/"/g, '""')}"`,
        `"${(e.maternalLastName || '').replace(/"/g, '""')}"`,
        `"${(e.firstName || '').replace(/"/g, '""')}"`,
        `"${(e.participantName || '').replace(/"/g, '""')}"`,
        `"${e.course || selectedCourseKey}"`,
        `"${formLabel}"`,
        e.isAbsentOrPending ? '-' : e.correct,
        e.isAbsentOrPending ? '-' : e.errors,
        e.isAbsentOrPending ? '-' : e.score,
        e.isAbsentOrPending ? '-' : e.grade.toFixed(1),
        e.isAbsentOrPending ? '-' : e.passed ? 'Aprobado' : 'Reprobado',
        `"${statusRendicion}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Libro_Virtual_${selectedCourseKey}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="gradebook-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-6xl h-[94vh] flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  Libro Virtual de Clases y Calificaciones
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Auto-Guardado Continuo en Servidor
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
                  Escala MINEDUC 60%
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Almacenamiento persistente en disco y memoria local contra caídas de internet. Todo se registra automáticamente por estudiante y curso.
              </p>
            </div>
          </div>

          <button
            id="close-gradebook-modal-btn"
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Sidebar: Courses & History */}
          <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0 overflow-hidden">
            {/* Active Course Selector */}
            <div className="p-3.5 border-b border-slate-200 bg-white space-y-2.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Seleccionar Curso
              </label>
              <select
                value={selectedCourseKey}
                onChange={(e) => {
                  setSelectedCourseKey(e.target.value);
                  setViewRecordId(null);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
              >
                {COURSES_LIST.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>

              {/* Informative Auto-Sync Badge */}
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block">100% Automático:</strong>
                  No requieres presionar nada. Las notas y respuestas quedan grabadas en el servidor al instante.
                </div>
              </div>

              {/* Manual Backup Sync Button */}
              <button
                onClick={handleManualArchive}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                title="Fuerza una sincronización inmediata de la sesión actual al disco del servidor"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Forzar Respaldo Inmediato</span>
              </button>
            </div>

            {/* Success Feedback Banner */}
            {saveSuccessMsg && (
              <div className="p-3 bg-emerald-100/80 border-b border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Saved Evaluations History */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              <div className="flex items-center justify-between px-2 py-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Historial en Disco</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {records.length} guardadas
                  </span>
                  <button
                    onClick={() => setIsCleanupModalOpen(true)}
                    title="Limpieza y depuración de datos acumulados"
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-rose-600 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Live Session Button */}
              <button
                onClick={() => setViewRecordId(null)}
                className={`w-full p-2.5 rounded-2xl text-left border transition flex items-center justify-between cursor-pointer ${
                  viewRecordId === null
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h5 className="text-xs font-bold">Sesión en Vivo Actual</h5>
                  </div>
                  <span
                    className={`text-[10px] block ${
                      viewRecordId === null ? 'text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    {currentLiveEntries.length} alumnos activos
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {liveAvgGrade > 0 ? liveAvgGrade.toFixed(1) : '---'}
                </span>
              </button>

              {records.map((rec) => {
                const isSelected = viewRecordId === rec.id;
                return (
                  <div
                    key={rec.id}
                    className={`p-2.5 rounded-2xl border transition flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    <button
                      onClick={() => setViewRecordId(rec.id)}
                      className="flex-1 text-left min-w-0 cursor-pointer"
                    >
                      <h5 className="text-xs font-bold truncate">{rec.activityTitle}</h5>
                      <div
                        className={`text-[10px] flex items-center gap-1.5 flex-wrap ${
                          isSelected ? 'text-indigo-200' : 'text-slate-400'
                        }`}
                      >
                        <span className="font-semibold">{rec.courseName}</span>
                        {rec.pin && (
                          <span className={`px-1.5 py-0.2 rounded font-mono font-bold text-[9px] ${
                            isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-700'
                          }`}>
                            PIN: {rec.pin}
                          </span>
                        )}
                        <span>•</span>
                        <span>{rec.date}</span>
                      </div>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                          rec.averageGrade >= 4.0
                            ? isSelected
                              ? 'bg-emerald-400 text-slate-900'
                              : 'bg-emerald-100 text-emerald-800'
                            : isSelected
                            ? 'bg-rose-400 text-slate-900'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rec.averageGrade ? rec.averageGrade.toFixed(1) : '---'}
                      </span>

                      <button
                        onClick={() => handleDeleteRecord(rec.id)}
                        className={`p-1 rounded-lg transition cursor-pointer ${
                          isSelected
                            ? 'text-indigo-200 hover:text-white hover:bg-indigo-700'
                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Main Stage: Gradebook Table */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Table Action Bar */}
            <div className="p-3.5 sm:p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50 shrink-0">
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>{displayTitle}</span>
                  {isViewing1D && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[11px] font-bold">
                      Nómina Oficial Don Bosco
                    </span>
                  )}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span>
                    Rindieron: <strong className="text-slate-800 font-bold">{evaluatedEntries.length}</strong> /{' '}
                    {isViewing1D && showFullRoster ? 45 : displayEntries.length}
                  </span>
                  <span>•</span>
                  <span>
                    Promedio del Curso:{' '}
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      {avgGrade > 0 ? avgGrade.toFixed(1) : '---'}
                    </span>
                  </span>
                  <span>•</span>
                  <span>
                    Aprobación:{' '}
                    <span className="font-mono font-bold text-slate-800">
                      {approvedPct}% ({passedCount} alumnos)
                    </span>
                  </span>
                </div>
              </div>

              {/* Action Buttons & Search */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por N° lista o nombre..."
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 w-44 sm:w-56"
                  />
                </div>

                {/* 1° Medio D Toggle Full Roster vs Only Evaluated */}
                {isViewing1D && (
                  <button
                    onClick={() => setShowFullRoster(!showFullRoster)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      showFullRoster
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{showFullRoster ? 'Ver Solo Evaluados' : 'Ver Todos (45 Alumnos)'}</span>
                  </button>
                )}

                <button
                  onClick={handleExportCSV}
                  disabled={filteredEntries.length === 0}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel (CSV)</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Imprimir</span>
                </button>

                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  title="Visualizar acta oficial en pantalla y descargar como PDF"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Reporte / PDF</span>
                </button>

                <button
                  onClick={() => setIsCleanupModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Depurar y limpiar evaluaciones acumuladas"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Limpiar Datos</span>
                </button>
              </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-auto p-4">
              {filteredEntries.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-bold text-slate-600">No se encontraron registros para este filtro</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Prueba cambiando la búsqueda o seleccionando otro curso en el panel lateral.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider bg-slate-50">
                      <th className="p-3 text-center w-12">N°</th>
                      <th className="p-3">Estudiante (Nómina Oficial)</th>
                      <th className="p-3 text-center">Forma</th>
                      <th className="p-3 text-center">Correctas</th>
                      <th className="p-3 text-center">Errores</th>
                      <th className="p-3 text-center">Puntaje</th>
                      <th className="p-3 text-center font-black">Nota Oficial</th>
                      <th className="p-3 text-center">Estado</th>
                      <th className="p-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEntries.map((entry, idx) => {
                      const variantKey: TestFormVariant = entry.testVariant || 'A';
                      const formCfg = TEST_FORMS_CONFIG[variantKey] || TEST_FORMS_CONFIG.A;
                      const hasAnswers = entry.answers && Object.keys(entry.answers).length > 0;

                      return (
                        <tr
                          key={entry.studentId || idx}
                          className={`hover:bg-slate-50/90 transition ${
                            entry.isAbsentOrPending ? 'bg-slate-50/40 text-slate-400' : ''
                          }`}
                        >
                          {/* List Number */}
                          <td className="p-3 text-center font-mono font-black text-slate-500">
                            {entry.listNumber ?? idx + 1}
                          </td>

                          {/* Student Name */}
                          <td className="p-3">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>
                                {entry.paternalLastName || entry.maternalLastName
                                  ? `${entry.paternalLastName || ''} ${entry.maternalLastName || ''}, ${entry.firstName || ''}`
                                  : entry.participantName}
                              </span>
                              {entry.isFinalized && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  Entregada
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {entry.course || selectedCourseKey}
                              {entry.finalizedAt && (
                                <> • {new Date(entry.finalizedAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</>
                              )}
                            </div>
                          </td>

                          {/* Form Variant */}
                          <td className="p-3 text-center">
                            {entry.isAbsentOrPending ? (
                              <span className="text-slate-300 font-mono">---</span>
                            ) : (
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${formCfg.pillBg} border ${formCfg.borderColor}`}
                                title={formCfg.fullName}
                              >
                                {formCfg.label}
                              </span>
                            )}
                          </td>

                          {/* Correct Answers */}
                          <td className="p-3 text-center font-mono font-bold text-emerald-600">
                            {entry.isAbsentOrPending ? '---' : entry.correct}
                          </td>

                          {/* Errors */}
                          <td className="p-3 text-center font-mono font-bold text-rose-500">
                            {entry.isAbsentOrPending ? '---' : entry.errors}
                          </td>

                          {/* Score */}
                          <td className="p-3 text-center font-mono font-bold text-indigo-600">
                            {entry.isAbsentOrPending ? '---' : entry.score}
                          </td>

                          {/* Official Grade (1.0 to 7.0) */}
                          <td className="p-3 text-center">
                            {entry.isAbsentOrPending ? (
                              <span className="text-slate-300 font-mono">---</span>
                            ) : (
                              <span
                                className={`px-2.5 py-1 rounded-xl font-mono font-black text-sm ${
                                  entry.grade >= 4.0
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                                }`}
                              >
                                {entry.grade.toFixed(1)}
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="p-3 text-center">
                            {entry.isAbsentOrPending ? (
                              <span className="px-2 py-0.5 rounded-full font-semibold text-[10px] bg-slate-100 text-slate-500 border border-slate-200">
                                Pendiente
                              </span>
                            ) : (
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                  entry.passed
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {entry.passed ? '✓ Aprobado' : '✗ Reprobado'}
                              </span>
                            )}
                          </td>

                          {/* Action: Inspect Answers */}
                          <td className="p-3 text-center">
                            <button
                              onClick={() => setInspectingEntry(entry)}
                              disabled={entry.isAbsentOrPending && !hasAnswers}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                              title="Ver respuestas detalladas por pregunta"
                            >
                              <Eye className="w-3 h-3 text-indigo-600" />
                              <span>Respuestas</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Modal: Detailed Student Response Inspector */}
        {inspectingEntry && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>
                      {inspectingEntry.listNumber ? `N° ${inspectingEntry.listNumber} - ` : ''}
                      {inspectingEntry.participantName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 text-xs font-mono">
                      Forma {inspectingEntry.testVariant || 'A'}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    Nota: <strong className="text-emerald-400 font-mono text-sm">{inspectingEntry.grade.toFixed(1)}</strong> • Puntaje: {inspectingEntry.score} pts • Correctas: {inspectingEntry.correct} • Errores: {inspectingEntry.errors}
                  </p>
                </div>
                <button
                  onClick={() => setInspectingEntry(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider pb-1 border-b border-slate-100">
                  <span>Desafíos Respondidos</span>
                  <span>Resultado</span>
                </div>

                {Array.from({ length: totalQuestions }).map((_, qIdx) => {
                  const ans = inspectingEntry.answers?.[qIdx];
                  const qItem = session.quizData[qIdx];
                  const optionLetters = ['A', 'B', 'C', 'D'];
                  const selectedLetter = ans !== undefined && ans.selected !== undefined ? optionLetters[ans.selected] : null;

                  return (
                    <div
                      key={qIdx}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                        ans
                          ? ans.isCorrect
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/60 border-rose-200 text-rose-950'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div>
                        <span className="font-bold block">
                          Desafío {qIdx + 1}
                          {qItem?.topic && <span className="font-normal text-slate-500"> ({qItem.topic})</span>}
                        </span>
                        {ans ? (
                          <span className="text-[11px] text-slate-600">
                            Marcó alternativa: <strong className="font-black text-slate-900 font-mono">[{selectedLetter}]</strong>
                            {ans.timestamp && (
                              <span className="text-slate-400 ml-2 font-mono">
                                ({new Date(ans.timestamp).toLocaleTimeString('es-CL')})
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-[11px] italic text-slate-400">Sin responder aún</span>
                        )}
                      </div>

                      <div>
                        {ans ? (
                          ans.isCorrect ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1">
                              <Check className="w-3 h-3" /> Correcta
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold text-[10px]">
                              ✗ Incorrecta
                            </span>
                          )
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-medium">
                            Pendiente
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 border-t border-slate-200 bg-slate-50 text-right">
                <button
                  onClick={() => setInspectingEntry(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  Cerrar Detalle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Executive Report & PDF Download Modal */}
        <GradebookReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          record={activeViewRecord}
          currentPin={session.pin}
        />

        {/* Data Cleanup / Purge Modal */}
        <GradebookCleanupModal
          isOpen={isCleanupModalOpen}
          onClose={() => setIsCleanupModalOpen(false)}
          records={records}
          onCleanupCompleted={loadRecords}
        />
      </div>
    </div>
  );
};
