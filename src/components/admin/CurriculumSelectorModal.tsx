import React, { useState, useMemo } from 'react';
import {
  X,
  GraduationCap,
  BookOpen,
  CheckSquare,
  Square,
  Search,
  Sparkles,
  ChevronRight,
  Layers,
  Award,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CURRICULUM_COMPLETO_MINEDUC, getQuestionsForSelectedCurriculum } from '../../data/mineducCurriculum';
import { CurriculumConfig } from '../../types';

interface CurriculumSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (curriculum: CurriculumConfig, questionsCount: number) => void;
  currentCurriculum?: CurriculumConfig;
}

export const CurriculumSelectorModal: React.FC<CurriculumSelectorModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentCurriculum,
}) => {
  const [selectedGradeKey, setSelectedGradeKey] = useState<string>(
    currentCurriculum?.gradeKey || '8_basico'
  );
  const [selectedAxisKey, setSelectedAxisKey] = useState<string>(
    currentCurriculum?.axisId || 'numeros'
  );
  const [selectedOAs, setSelectedOAs] = useState<string[]>(
    currentCurriculum?.oasSelected || ['OA 01']
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [step, setStep] = useState<number>(1);
  const [isApplying, setIsApplying] = useState(false);

  const currentGradeData = CURRICULUM_COMPLETO_MINEDUC[selectedGradeKey] || CURRICULUM_COMPLETO_MINEDUC['8_basico'];
  const availableAxes = currentGradeData ? Object.entries(currentGradeData.ejes) : [];

  // If currently selected axis is not in the new grade, select the first available axis
  const validAxisKey = currentGradeData?.ejes[selectedAxisKey]
    ? selectedAxisKey
    : availableAxes[0]?.[0] || 'numeros';

  const currentAxisData = currentGradeData?.ejes[validAxisKey] || currentGradeData?.ejes['numeros'];
  const allOAsInAxis = currentAxisData?.oas || [];

  // Filter OAs by search
  const filteredOAs = useMemo(() => {
    if (!searchTerm.trim()) return allOAsInAxis;
    const term = searchTerm.toLowerCase();
    return allOAsInAxis.filter(
      (oa) =>
        oa.id.toLowerCase().includes(term) ||
        oa.desc.toLowerCase().includes(term)
    );
  }, [allOAsInAxis, searchTerm]);

  const calculatedQuestions = useMemo(() => {
    return getQuestionsForSelectedCurriculum(selectedGradeKey, validAxisKey, selectedOAs);
  }, [selectedGradeKey, validAxisKey, selectedOAs]);

  if (!isOpen) return null;

  const handleGradeChange = (gradeKey: string) => {
    setSelectedGradeKey(gradeKey);
    const newGrade = CURRICULUM_COMPLETO_MINEDUC[gradeKey];
    if (newGrade) {
      const firstAxis = Object.keys(newGrade.ejes)[0];
      setSelectedAxisKey(firstAxis);
      const firstOA = newGrade.ejes[firstAxis]?.oas[0]?.id;
      setSelectedOAs(firstOA ? [firstOA] : []);
    }
  };

  const handleAxisChange = (axisKey: string) => {
    setSelectedAxisKey(axisKey);
    const axis = currentGradeData?.ejes[axisKey];
    if (axis && axis.oas.length > 0) {
      // Default to first OA or all OAs of new axis
      setSelectedOAs([axis.oas[0].id]);
    } else {
      setSelectedOAs([]);
    }
  };

  const toggleOA = (oaId: string) => {
    setSelectedOAs((prev) => {
      if (prev.includes(oaId)) {
        // Don't allow empty if it's the last one, or let them uncheck and show warning
        return prev.filter((id) => id !== oaId);
      } else {
        return [...prev, oaId];
      }
    });
  };

  const selectAllOAs = () => {
    const allIds = allOAsInAxis.map((oa) => oa.id);
    setSelectedOAs(allIds);
  };

  const deselectAllOAs = () => {
    setSelectedOAs([]);
  };

  const handleApply = () => {
    if (selectedOAs.length === 0) return;
    setIsApplying(true);

    const curriculumConfig: CurriculumConfig = {
      gradeKey: selectedGradeKey,
      grade: currentGradeData.nivel,
      axisId: validAxisKey,
      axisName: currentAxisData.nombre,
      oasSelected: selectedOAs,
    };

    setTimeout(() => {
      onApply(curriculumConfig, calculatedQuestions.length);
      setIsApplying(false);
      onClose();
    }, 400);
  };

  return (
    <div
      id="curriculum-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="curriculum-modal-container"
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Selector Curricular MINEDUC
                <span className="text-xs px-2.5 py-0.5 font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  8° Básico — 4° Medio
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Configura los Objetivos de Aprendizaje oficiales para la sesión interactiva
              </p>
            </div>
          </div>
          <button
            id="close-curriculum-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Step Pills */}
        <div className="grid grid-cols-3 gap-2 px-6 py-3 bg-slate-950/50 border-b border-slate-800/80 text-xs font-semibold">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition ${
              step === 1
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">1</span>
            1. Nivel y Curso
          </button>
          <button
            onClick={() => setStep(2)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition ${
              step === 2
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">2</span>
            2. Eje Temático
          </button>
          <button
            onClick={() => setStep(3)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition ${
              step === 3
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">3</span>
            3. Selección OAs ({selectedOAs.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Step 1: Grade Level Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Nivel Educativo Oficial MINEDUC
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {Object.entries(CURRICULUM_COMPLETO_MINEDUC).map(([key, data]) => {
                const isSelected = selectedGradeKey === key;
                const totalOAs = Object.values(data.ejes).reduce((acc, eje) => acc + eje.oas.length, 0);

                return (
                  <button
                    key={key}
                    id={`grade-btn-${key}`}
                    onClick={() => handleGradeChange(key)}
                    className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-950'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-bold text-sm">{data.nivel}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {totalOAs} Objetivos
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Axis Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Eje Temático del Nivel ({currentGradeData.nivel})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {availableAxes.map(([key, eje]) => {
                const isSelected = validAxisKey === key;
                return (
                  <button
                    key={key}
                    id={`axis-btn-${key}`}
                    onClick={() => handleAxisChange(key)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-600/20 border-emerald-500 text-white ring-2 ring-emerald-500/40'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm line-clamp-1">{eje.nombre}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-700 rounded-md text-slate-300 font-mono">
                        {eje.oas.length} OAs
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {eje.oas.map((o) => o.id).join(', ')}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Multi-select OA Checkboxes */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                Objetivos de Aprendizaje a Evaluar ({selectedOAs.length} seleccionados)
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={selectAllOAs}
                  className="px-2.5 py-1 text-xs font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-700/50 rounded-lg hover:bg-indigo-900 transition"
                >
                  Marcar Todos ({allOAsInAxis.length})
                </button>
                <button
                  type="button"
                  onClick={deselectAllOAs}
                  className="px-2.5 py-1 text-xs font-medium text-slate-400 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition"
                >
                  Desmarcar
                </button>
              </div>
            </div>

            {/* Filter / Search input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar por código (ej: OA 03) o palabras clave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* OAs list with checkboxes */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredOAs.map((oa) => {
                const isChecked = selectedOAs.includes(oa.id);
                return (
                  <div
                    key={oa.id}
                    id={`oa-checkbox-card-${oa.id.replace(/\s+/g, '')}`}
                    onClick={() => toggleOA(oa.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'bg-indigo-950/40 border-indigo-500/80 ring-1 ring-indigo-500/40'
                        : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-indigo-400 focus:outline-none"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-indigo-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-xs font-bold font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                          {oa.id}
                        </span>
                        {oa.questions && oa.questions.length > 0 && (
                          <span className="text-[10px] text-emerald-400 font-medium">
                            {oa.questions.length} ejercicios prediseñados
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{oa.desc}</p>
                    </div>
                  </div>
                );
              })}

              {filteredOAs.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No se encontraron OAs que coincidan con &quot;{searchTerm}&quot;
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Summary & Apply Action */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/95 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-indigo-400 font-bold">{currentGradeData.nivel}</span>
              <span className="text-slate-600">&gt;</span>
              <span className="text-emerald-400 font-semibold">{currentAxisData.nombre}</span>
              <span className="text-slate-600">&gt;</span>
              <span className="px-2 py-0.5 bg-slate-800 rounded font-mono text-slate-200">
                {selectedOAs.length > 0 ? selectedOAs.join(', ') : 'Ninguno'}
              </span>
            </div>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {calculatedQuestions.length} ejercicios listos
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="cancel-curriculum-btn"
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              id="apply-curriculum-btn"
              type="button"
              disabled={selectedOAs.length === 0 || isApplying}
              onClick={handleApply}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white rounded-xl transition shadow-lg ${
                selectedOAs.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
              }`}
            >
              {isApplying ? (
                <span>Aplicando a la sala...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>🚀 Aplicar Configuración y Activar Sala</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
