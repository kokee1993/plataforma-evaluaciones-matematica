import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Lightbulb,
  FileText,
  Play,
  ChevronRight,
  ArrowLeft,
  Download,
  Eye,
  CheckSquare,
  Sparkles,
  Layers,
  MonitorPlay,
  LogOut,
  ChevronDown,
  Info,
  ExternalLink,
  Search,
  School,
  X,
  Target,
  MessageSquareText,
  Cpu,
  LayoutGrid,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import {
  CURRICULUM_RECURSOS,
  CourseCurriculumItem,
  UnitResourceItem,
  OAResources,
  StudyResourceItem,
  GuidedExerciseItem,
  ProposedExerciseItem
} from '../../data/curriculumResources';
import {
  CURRICULUM_COMPLETO_MINEDUC,
  HABILIDADES_TRONCALES_MINEDUC,
  ACTITUDES_OAA_MINEDUC,
  CurriculumOAItem
} from '../../data/mineducCurriculum';
import { ResourceViewerModal } from './ResourceViewerModal';
import { AdminResetModal } from './AdminResetModal';
import { GradebookReportModal } from './GradebookReportModal';
import { MathText } from '../MathRenderer';
import { ClassroomDatabaseState, GradebookCourseRecord } from '../../types';
import { RotateCcw } from 'lucide-react';

export type HubStep = 'select_course' | 'select_unit' | 'select_activity' | 'oa_breakdown' | 'live_config';
export type ActivityType = 'material' | 'guided' | 'proposed' | 'live';

interface TeacherHubProps {
  onLogout: () => void;
  onLaunchLiveClass: (selectedCourseKey: string, selectedAxisKey: string, selectedOAIds: string[]) => void;
  onOpenLiveDashboard?: () => void;
  onOpenGradebook?: () => void;
  isLiveSessionActive?: boolean;
  data?: ClassroomDatabaseState;
}

export const TeacherHub: React.FC<TeacherHubProps> = ({
  onLogout,
  onLaunchLiveClass,
  onOpenLiveDashboard,
  onOpenGradebook,
  isLiveSessionActive = false,
  data
}) => {
  // Navigation State
  const [currentStep, setCurrentStep] = useState<HubStep>('select_course');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('2_medio');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('unidad_2');
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('material');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeReportRecord, setActiveReportRecord] = useState<GradebookCourseRecord | null>(null);
  
  // Live Config Multi-Select OAs
  const [selectedLiveOAIds, setSelectedLiveOAIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Curriculum Matrix Modal State
  const [showCurriculumMatrix, setShowCurriculumMatrix] = useState<boolean>(false);
  const [matrixTab, setMatrixTab] = useState<'habilidades' | 'actitudes' | 'oas'>('habilidades');

  // Resource Viewer Modal State
  const [viewerData, setViewerData] = useState<{
    type: 'material' | 'guided' | 'proposed';
    courseName: string;
    unitTitle: string;
    oaId: string;
    oaTitle: string;
    data: StudyResourceItem | GuidedExerciseItem | ProposedExerciseItem;
  } | null>(null);

  // Active Selected Objects
  const currentCourse: CourseCurriculumItem | undefined = CURRICULUM_RECURSOS[selectedCourseId];
  const currentUnit: UnitResourceItem | undefined = currentCourse?.units.find(u => u.id === selectedUnitId);

  // Helper to find official MINEDUC OA metadata (code, indicators)
  const getMineducOAMetadata = (oaId: string): CurriculumOAItem | undefined => {
    const course = CURRICULUM_COMPLETO_MINEDUC[selectedCourseId];
    if (!course || !currentUnit) return undefined;
    const axis = course.ejes[currentUnit.axisKey];
    if (!axis) return undefined;
    return axis.oas.find(o => o.id === oaId || o.code === oaId);
  };

  // Handlers for step transitions
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    // Default to first unit
    const c = CURRICULUM_RECURSOS[courseId];
    if (c && c.units.length > 0) {
      setSelectedUnitId(c.units[0].id);
    }
    setCurrentStep('select_unit');
  };

  const handleSelectUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    setCurrentStep('select_activity');
  };

  const handleSelectActivity = (activity: ActivityType) => {
    setSelectedActivity(activity);
    if (activity === 'live') {
      // Preselect all OAs for the unit
      if (currentUnit) {
        setSelectedLiveOAIds(currentUnit.oas.map(o => o.oaId));
      }
      setCurrentStep('live_config');
    } else {
      setCurrentStep('oa_breakdown');
    }
  };

  const handleBack = () => {
    if (currentStep === 'select_unit') {
      setCurrentStep('select_course');
    } else if (currentStep === 'select_activity') {
      setCurrentStep('select_unit');
    } else if (currentStep === 'oa_breakdown' || currentStep === 'live_config') {
      setCurrentStep('select_activity');
    }
  };

  // Open viewer modal
  const handleOpenViewer = (
    type: 'material' | 'guided' | 'proposed',
    oa: OAResources,
    data: StudyResourceItem | GuidedExerciseItem | ProposedExerciseItem
  ) => {
    if (!currentCourse || !currentUnit) return;
    setViewerData({
      type,
      courseName: currentCourse.name,
      unitTitle: currentUnit.title,
      oaId: oa.oaId,
      oaTitle: oa.title,
      data
    });
  };

  // Start live evaluation directly for a single OA
  const handleStartLiveForOA = (oaId: string) => {
    if (!currentUnit) return;
    onLaunchLiveClass(selectedCourseId, currentUnit.axisKey, [oaId]);
  };

  // Start live evaluation from multi-check config
  const handleStartLiveSelected = () => {
    if (!currentUnit || selectedLiveOAIds.length === 0) return;
    onLaunchLiveClass(selectedCourseId, currentUnit.axisKey, selectedLiveOAIds);
  };

  const toggleLiveOASelection = (oaId: string) => {
    if (selectedLiveOAIds.includes(oaId)) {
      setSelectedLiveOAIds(selectedLiveOAIds.filter(id => id !== oaId));
    } else {
      setSelectedLiveOAIds([...selectedLiveOAIds, oaId]);
    }
  };

  const selectAllLiveOAs = () => {
    if (!currentUnit) return;
    setSelectedLiveOAIds(currentUnit.oas.map(o => o.oaId));
  };

  const deselectAllLiveOAs = () => {
    setSelectedLiveOAIds([]);
  };

  return (
    <div id="teacher-hub-root" className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased">
      {/* Top Universal Navbar */}
      <header
        id="teacher-hub-topbar"
        className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm px-4 sm:px-8 py-3.5 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-slate-900">
                HUB DOCENTE MINEDUC
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                8° Básico a 4° Medio Oficial 2026
              </span>
            </div>
            <p className="text-xs text-slate-500">Planificación Curricular & Evaluaciones en Vivo</p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Button to open Gradebook */}
          {onOpenGradebook && (
            <button
              id="btn-teacher-hub-gradebook"
              onClick={onOpenGradebook}
              className="px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              title="Ver Libro Virtual de Clases y Calificaciones"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Libro de Clases</span>
              <span className="md:hidden">Libro</span>
            </button>
          )}

          {/* Button to open MINEDUC Matrix */}
          <button
            id="btn-open-matrix-modal"
            onClick={() => setShowCurriculumMatrix(true)}
            className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            title="Ver Habilidades Troncales y Actitudes Transversales (OAA)"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Matriz MINEDUC 2026</span>
            <span className="md:hidden">Matriz</span>
          </button>

          {data && (
            <button
              id="btn-teacher-hub-reset-modal"
              onClick={() => setIsResetModalOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              title="Gestión de Sala y Reinicio Seguro (Solo Admin)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Gestionar Sala</span>
            </button>
          )}

          {isLiveSessionActive && onOpenLiveDashboard && (
            <button
              id="btn-goto-live-monitor"
              onClick={onOpenLiveDashboard}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm animate-pulse"
            >
              <MonitorPlay className="w-4 h-4" />
              <span className="hidden sm:inline">Sala en Vivo Activa</span>
            </button>
          )}

          <button
            id="btn-teacher-logout"
            onClick={onLogout}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors text-xs font-semibold flex items-center gap-1.5"
            title="Cerrar sesión del portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="teacher-hub-main" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Navigation Breadcrumb & Back button (shown when not on course selection) */}
        {currentStep !== 'select_course' && (
          <div
            id="teacher-hub-breadcrumb"
            className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 animate-fade-in"
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 flex-wrap">
              <button
                onClick={() => setCurrentStep('select_course')}
                className="hover:text-indigo-600 text-slate-500 font-semibold transition-colors flex items-center gap-1"
              >
                <School className="w-4 h-4" />
                Cursos
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

              <button
                onClick={() => setCurrentStep('select_unit')}
                className={`font-semibold transition-colors ${
                  currentStep === 'select_unit' ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
                }`}
              >
                {currentCourse?.name}
              </button>

              {(currentStep === 'select_activity' || currentStep === 'oa_breakdown' || currentStep === 'live_config') && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <button
                    onClick={() => setCurrentStep('select_activity')}
                    className={`font-semibold transition-colors ${
                      currentStep === 'select_activity' ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
                    }`}
                  >
                    {currentUnit?.shortTitle}
                  </button>
                </>
              )}

              {currentStep === 'oa_breakdown' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-indigo-600 font-bold">
                    {selectedActivity === 'material' && '📖 Material de Estudio'}
                    {selectedActivity === 'guided' && '✍️ Ejercicios Guiados'}
                    {selectedActivity === 'proposed' && '🎯 Ejercicios Propuestos'}
                  </span>
                </>
              )}

              {currentStep === 'live_config' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-rose-600 font-bold">📊 Evaluación en Vivo</span>
                </>
              )}
            </div>

            <button
              id="btn-hub-back"
              onClick={handleBack}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PANTALLA 1: BIENVENIDA Y SELECCIÓN DE CURSO */}
        {/* ========================================================================= */}
        {currentStep === 'select_course' && (
          <div id="step-select-course" className="space-y-6 animate-fade-in">
            {/* Banner de Bienvenida */}
            <div
              id="hub-welcome-banner"
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 text-white p-6 sm:p-8 shadow-lg shadow-indigo-100 border border-indigo-600"
            >
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-indigo-100 mb-3 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Plataforma Docente MINEDUC 2026
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  ¡Bienvenido, Maestro Jorge!
                </h1>
                <p className="text-indigo-100 text-sm sm:text-base mt-2 font-normal">
                  ¿Con qué curso trabajaremos hoy? Selecciona un nivel curricular para acceder al material didáctico oficial, resolución de problemas modelo paso a paso, guías y salas interactivas en vivo.
                </p>
              </div>

              {/* Background decorative circles */}
              <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute right-32 bottom-0 -mb-12 w-48 h-48 bg-indigo-400/20 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Transversal Skills Quick Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {HABILIDADES_TRONCALES_MINEDUC.map((hab) => (
                <div
                  key={hab.id}
                  onClick={() => {
                    setMatrixTab('habilidades');
                    setShowCurriculumMatrix(true);
                  }}
                  className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    {hab.icon === 'Target' && <Target className="w-4 h-4" />}
                    {hab.icon === 'MessageSquareText' && <MessageSquareText className="w-4 h-4" />}
                    {hab.icon === 'Cpu' && <Cpu className="w-4 h-4" />}
                    {hab.icon === 'LayoutGrid' && <LayoutGrid className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{hab.nombre}</h4>
                    <p className="text-[10px] text-slate-500 truncate">Habilidad Troncal MINEDUC</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Course Selection Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span>Selecciona un Curso</span>
                  <span className="text-xs font-normal text-slate-500">(Niveles Curriculares Oficiales MINEDUC 2026)</span>
                </h2>
              </div>

              <div id="course-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from(new Map(Object.values(CURRICULUM_RECURSOS).map((c) => [c.id, c])).values()).map((course) => {
                  return (
                    <div
                      key={course.id}
                      id={`card-course-${course.id}`}
                      onClick={() => handleSelectCourse(course.id)}
                      className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
                    >
                      {/* Top badge & number badge */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg shadow-sm ${course.colorBadge} group-hover:scale-105 transition-transform`}
                          >
                            {course.badgeNumber}
                          </span>
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {course.category}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {course.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      {/* Bottom Footer */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                        <span>4 Unidades MINEDUC</span>
                        <div className="flex items-center gap-1">
                          <span>Ingresar</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PANTALLA 2: SELECCIÓN DE UNIDAD / EJE TEMÁTICO */}
        {/* ========================================================================= */}
        {currentStep === 'select_unit' && currentCourse && (
          <div id="step-select-unit" className="space-y-6 animate-fade-in">
            {/* Header with selected course info */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-md ${currentCourse.colorBadge}`}
                >
                  {currentCourse.badgeNumber}
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    {currentCourse.category}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900">{currentCourse.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{currentCourse.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Selecciona una de las 4 Unidades oficiales:
                </span>
              </div>
            </div>

            {/* 4 Unit Cards Grid */}
            <div id="unit-cards-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCourse.units.map((unit) => {
                return (
                  <div
                    key={unit.id}
                    id={`card-unit-${unit.id}`}
                    onClick={() => handleSelectUnit(unit.id)}
                    className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {unit.icon}
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${unit.colorTheme.badge}`}>
                          Unidad {unit.unitNumber}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {unit.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {unit.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>{unit.oas.length} Objetivos de Aprendizaje (OAs)</span>
                      <div className="flex items-center gap-1 text-indigo-600 group-hover:translate-x-1 transition-transform">
                        <span>Explorar Actividades</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PANTALLA 3: MENÚ DE ACTIVIDAD "¿QUÉ VEREMOS HOY?" */}
        {/* ========================================================================= */}
        {currentStep === 'select_activity' && currentCourse && currentUnit && (
          <div id="step-select-activity" className="space-y-6 animate-fade-in">
            {/* Header info */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="text-3xl">{currentUnit.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                      {currentCourse.name}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Unidad {currentUnit.unitNumber}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                    {currentUnit.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{currentUnit.description}</p>
                </div>
              </div>

              <span className="text-xs font-bold text-indigo-600 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 self-start sm:self-center">
                ¿Qué trabajaremos en la clase de hoy?
              </span>
            </div>

            {/* 4 Quadrants Grid */}
            <div id="activity-quadrants-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quadrant 1: Material de Estudio */}
              <div
                id="quadrant-material"
                onClick={() => handleSelectActivity('material')}
                className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-900">
                      Presentaciones y Conceptos
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    1. Material de Estudio
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Resúmenes teóricos, presentaciones formales, fichas de fórmulas en KaTeX y mapas conceptuales listos para proyectar en el aula.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Explorar presentaciones por OA</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Quadrant 2: Ejercicios Guiados */}
              <div
                id="quadrant-guided"
                onClick={() => handleSelectActivity('guided')}
                className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
                      <Lightbulb className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                      Modelamiento en Pizarra
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    2. Ejercicios Guiados
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Problemas modelo resueltos paso a paso con revelación progresiva, notas pedagógicas para el profesor y fórmulas en KaTeX.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                  <span>Abrir visor de problemas modelo</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Quadrant 3: Ejercicios Propuestos */}
              <div
                id="quadrant-proposed"
                onClick={() => handleSelectActivity('proposed')}
                className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
                      Guías y Talleres
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    3. Ejercicios Propuestos
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Guías de trabajo autónomo y grupal con solucionario docente, puntajes sugeridos y opción de impresión en PDF.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                  <span>Ver guías y solucionario</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Quadrant 4: Evaluaciones en Vivo */}
              <div
                id="quadrant-live"
                onClick={() => handleSelectActivity('live')}
                className="group cursor-pointer bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-indigo-500 hover:border-rose-400 hover:shadow-2xl transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-rose-400" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/30">
                      Interactiva en Tiempo Real
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors flex items-center gap-2">
                    <span>4. Evaluaciones en Vivo</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Lanza la sala interactiva con código PIN y QR para los celulares de hasta 50 estudiantes, temporizador de 60s, alarma Sentinel y ranking en proyector.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-rose-300">
                  <span>Configurar y lanzar sala</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PANTALLA 4: LISTADO DESGLOSADO POR OA (OBJETIVOS DE APRENDIZAJE) */}
        {/* ========================================================================= */}
        {currentStep === 'oa_breakdown' && currentCourse && currentUnit && (
          <div id="step-oa-breakdown" className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                    {currentCourse.name}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {currentUnit.title}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                  {selectedActivity === 'material' && '📖 Material de Estudio'}
                  {selectedActivity === 'guided' && '✍️ Ejercicios Guiados en Pizarra'}
                  {selectedActivity === 'proposed' && '🎯 Ejercicios Propuestos y Guías'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecciona un Objetivo de Aprendizaje (OA) para proyectar, descargar o iniciar directamente en clase.
                </p>
              </div>

              {/* Quick switch between activities */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 flex-wrap">
                <button
                  onClick={() => setSelectedActivity('material')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedActivity === 'material'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Material
                </button>
                <button
                  onClick={() => setSelectedActivity('guided')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedActivity === 'guided'
                      ? 'bg-white text-amber-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Guiados
                </button>
                <button
                  onClick={() => setSelectedActivity('proposed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedActivity === 'proposed'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Propuestos
                </button>
              </div>
            </div>

            {/* OAs List */}
            <div className="space-y-4">
              {currentUnit.oas.map((oa) => {
                const mineducMeta = getMineducOAMetadata(oa.oaId);
                const officialCode = mineducMeta?.code || oa.oaId;
                const indicadores = mineducMeta?.indicadores || [];

                return (
                  <div
                    key={oa.oaId}
                    id={`oa-card-${oa.oaId}`}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                  >
                    {/* OA Header */}
                    <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-black text-sm shadow-sm text-center">
                            {oa.oaId}
                          </span>
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded text-center">
                            {officialCode}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">
                            {oa.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            {oa.description}
                          </p>

                          {/* Indicadores oficiales MINEDUC */}
                          {indicadores.length > 0 && (
                            <div className="mt-2.5 pt-2 border-t border-slate-200/80">
                              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Indicadores de Evaluación Oficiales:
                              </span>
                              <ul className="space-y-1">
                                {indicadores.map((ind, idx) => (
                                  <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5 leading-tight">
                                    <span className="text-indigo-500 font-bold">•</span>
                                    <span><MathText content={ind} /></span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick start live class button */}
                      <button
                        id={`btn-launch-oa-${oa.oaId}`}
                        onClick={() => handleStartLiveForOA(oa.oaId)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-colors flex-shrink-0 self-start sm:self-center"
                        title="Iniciar evaluación formativa en vivo de este OA"
                      >
                        <Play className="w-3.5 h-3.5 fill-indigo-600" />
                        <span>Evaluar en Vivo</span>
                      </button>
                    </div>

                    {/* Resources for this OA based on selected activity */}
                    <div className="p-5">
                      {/* 1. Material de Estudio */}
                      {selectedActivity === 'material' && (
                        <div className="space-y-3">
                          {oa.materials.map((mat) => (
                            <div
                              key={mat.id}
                              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <BookOpen className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900">{mat.title}</h4>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                                      {mat.tag}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-0.5">{mat.summary}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  id={`btn-view-${mat.id}`}
                                  onClick={() => handleOpenViewer('material', oa, mat)}
                                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Ver / Proyectar</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 2. Ejercicios Guiados */}
                      {selectedActivity === 'guided' && (
                        <div className="space-y-3">
                          {oa.guidedExercises.map((guided) => (
                            <div
                              key={guided.id}
                              className="p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Lightbulb className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900">{guided.title}</h4>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                      {guided.difficulty}
                                    </span>
                                  </div>
                                  <div className="text-xs text-slate-600 mt-1 font-medium line-clamp-1">
                                    <MathText content={guided.statement} />
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  id={`btn-view-${guided.id}`}
                                  onClick={() => handleOpenViewer('guided', oa, guided)}
                                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Ver Paso a Paso</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 3. Ejercicios Propuestos */}
                      {selectedActivity === 'proposed' && (
                        <div className="space-y-3">
                          {oa.proposedWorksheets.map((prop) => (
                            <div
                              key={prop.id}
                              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900">{prop.title}</h4>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                      {prop.problems.length} Problemas
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    {prop.studentInstructions} • Estimado: {prop.estimatedTime}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  id={`btn-view-${prop.id}`}
                                  onClick={() => handleOpenViewer('proposed', oa, prop)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Ver Guía & Solución</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PANTALLA 4 (VARIANTE): CONFIGURACIÓN DE EVALUACIÓN EN VIVO */}
        {/* ========================================================================= */}
        {currentStep === 'live_config' && currentCourse && currentUnit && (
          <div id="step-live-config" className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    SALA INTERACTIVA EN TIEMPO REAL
                  </span>
                  <span className="text-xs text-slate-400">
                    {currentCourse.name} • {currentUnit.title}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white mt-1">
                  Seleccionar OAs para la Evaluación en Vivo
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Marca las casillas de los Objetivos de Aprendizaje que deseas evaluar hoy. Los alumnos se conectarán con el código PIN o QR.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={selectAllLiveOAs}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Marcar Todos
                </button>
                <button
                  onClick={deselectAllLiveOAs}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Desmarcar
                </button>
              </div>
            </div>

            {/* OA Selection Checkboxes Grid */}
            <div className="space-y-3">
              {currentUnit.oas.map((oa) => {
                const isChecked = selectedLiveOAIds.includes(oa.oaId);
                const mineducMeta = getMineducOAMetadata(oa.oaId);
                const officialCode = mineducMeta?.code || oa.oaId;
                const indicadores = mineducMeta?.indicadores || [];

                return (
                  <label
                    key={oa.oaId}
                    id={`checkbox-oa-${oa.oaId}`}
                    className={`block cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                      isChecked
                        ? 'bg-indigo-50/80 border-indigo-400 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleLiveOASelection(oa.oaId)}
                        className="mt-1 w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-sm text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded">
                            {oa.oaId}
                          </span>
                          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                            {officialCode}
                          </span>
                          <span className="font-bold text-sm text-slate-900">
                            {oa.title}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({oa.questions.length} preguntas disponibles)
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {oa.description}
                        </p>

                        {indicadores.length > 0 && (
                          <div className="mt-2 text-[11px] text-slate-500">
                            <span className="font-semibold text-slate-700">Indicadores clave: </span>
                            {indicadores.join(' • ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Launch Action Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                  OAs Seleccionados: {selectedLiveOAIds.length} de {currentUnit.oas.length}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Al iniciar, se creará la sala de juego y podrás proyectar el código QR en la pantalla del salón.
                </p>
              </div>

              <button
                id="btn-launch-live-class"
                disabled={selectedLiveOAIds.length === 0}
                onClick={handleStartLiveSelected}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-rose-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>¡Iniciar Sala Interactiva en Vivo!</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Curriculum Matrix Modal (MINEDUC 2026) */}
      {showCurriculumMatrix && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">
                    Matriz Curricular Oficial de Matemática (MINEDUC)
                  </h3>
                  <p className="text-xs text-indigo-200">
                    Bases Curriculares 2026: 8° Básico a 4° Medio • Plan de Formación General
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCurriculumMatrix(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-3 border-b border-slate-200 flex gap-4 bg-slate-50">
              <button
                onClick={() => setMatrixTab('habilidades')}
                className={`pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors ${
                  matrixTab === 'habilidades'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Target className="w-4 h-4" />
                Habilidades Troncales (4)
              </button>
              <button
                onClick={() => setMatrixTab('actitudes')}
                className={`pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors ${
                  matrixTab === 'actitudes'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Actitudes Transversales (OAA)
              </button>
              <button
                onClick={() => setMatrixTab('oas')}
                className={`pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors ${
                  matrixTab === 'oas'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                Niveles y Cobertura
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {matrixTab === 'habilidades' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                    Las 4 Habilidades Troncales se desarrollan de manera continua e integrada desde 8° Básico hasta 4° Medio en todos los ejes temáticos (Números, Álgebra, Geometría y Probabilidades).
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {HABILIDADES_TRONCALES_MINEDUC.map((hab) => (
                      <div key={hab.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                            {hab.icon === 'Target' && <Target className="w-4 h-4" />}
                            {hab.icon === 'MessageSquareText' && <MessageSquareText className="w-4 h-4" />}
                            {hab.icon === 'Cpu' && <Cpu className="w-4 h-4" />}
                            {hab.icon === 'LayoutGrid' && <LayoutGrid className="w-4 h-4" />}
                          </div>
                          <h4 className="font-bold text-sm text-slate-900">{hab.nombre}</h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {hab.descripcion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matrixTab === 'actitudes' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-900 leading-relaxed">
                    Objetivos de Aprendizaje Actitudinales (OAA) que orientan la formación ética, científica y social en la clase de Matemática.
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {ACTITUDES_OAA_MINEDUC.map((act) => (
                      <div key={act.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-extrabold text-xs flex-shrink-0">
                          {act.codigo}
                        </span>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">
                          {act.descripcion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matrixTab === 'oas' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 leading-relaxed">
                    Resumen de los niveles curriculares integrados en EduMath Pro con sus códigos oficiales MINEDUC 2026.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(CURRICULUM_COMPLETO_MINEDUC).map(([key, nivel]) => {
                      const totalOas = Object.values(nivel.ejes).reduce((acc, eje) => acc + eje.oas.length, 0);
                      const totalQuestions = Object.values(nivel.ejes).reduce(
                        (acc, eje) => acc + eje.oas.reduce((accQ, o) => accQ + (o.questions?.length || 0), 0),
                        0
                      );

                      return (
                        <div key={key} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-sm text-slate-900">{nivel.nivel}</h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {totalOas} OAs Oficiales
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 space-y-1">
                              {Object.entries(nivel.ejes).map(([ejeKey, eje]) => (
                                <div key={ejeKey} className="flex justify-between text-[11px]">
                                  <span className="capitalize">{eje.nombre}:</span>
                                  <span className="font-semibold text-slate-700">{eje.oas.length} OAs</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-indigo-600">
                            <span>{totalQuestions} reactivos formativos</span>
                            <button
                              onClick={() => {
                                setShowCurriculumMatrix(false);
                                handleSelectCourse(key);
                              }}
                              className="hover:underline flex items-center gap-0.5"
                            >
                              <span>Ir al curso</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowCurriculumMatrix(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resource Viewer Modal */}
      <ResourceViewerModal
        isOpen={viewerData !== null}
        onClose={() => setViewerData(null)}
        resource={viewerData}
        onStartLiveSession={(oaId) => handleStartLiveForOA(oaId)}
      />

      {/* Admin Reset and Room Management Modal */}
      {data && (
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
          currentPin={data?.session?.pin}
        />
      )}
    </div>
  );
};
