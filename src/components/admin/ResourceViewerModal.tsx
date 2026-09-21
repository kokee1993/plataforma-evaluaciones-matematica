import React, { useState } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  Printer,
  Download,
  Play,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Lightbulb,
  FileText,
  Eye,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { MathText } from '../MathRenderer';
import { StudyResourceItem, GuidedExerciseItem, ProposedExerciseItem } from '../../data/curriculumResources';

interface ResourceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: {
    type: 'material' | 'guided' | 'proposed';
    courseName: string;
    unitTitle: string;
    oaId: string;
    oaTitle: string;
    data: StudyResourceItem | GuidedExerciseItem | ProposedExerciseItem;
  } | null;
  onStartLiveSession?: (oaId: string) => void;
}

export const ResourceViewerModal: React.FC<ResourceViewerModalProps> = ({
  isOpen,
  onClose,
  resource,
  onStartLiveSession
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState<number[]>([0]); // for guided exercises
  const [showTeacherSolutions, setShowTeacherSolutions] = useState(true); // for proposed worksheets

  if (!isOpen || !resource) return null;

  const toggleStep = (index: number) => {
    if (revealedSteps.includes(index)) {
      setRevealedSteps(revealedSteps.filter(s => s !== index));
    } else {
      setRevealedSteps([...revealedSteps, index]);
    }
  };

  const revealAllSteps = (total: number) => {
    setRevealedSteps(Array.from({ length: total }, (_, i) => i));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="resource-viewer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
    >
      <div
        id="resource-viewer-modal-container"
        className={`bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 transition-all duration-200 overflow-hidden ${
          isFullScreen
            ? 'w-full h-full max-w-none rounded-none'
            : 'w-full max-w-4xl max-h-[90vh]'
        }`}
      >
        {/* Modal Top Header */}
        <div
          id="resource-viewer-header"
          className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4 flex-shrink-0"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 flex-shrink-0">
              {resource.type === 'material' && <BookOpen className="w-5 h-5" />}
              {resource.type === 'guided' && <Lightbulb className="w-5 h-5" />}
              {resource.type === 'proposed' && <FileText className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                  {resource.courseName}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {resource.unitTitle}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                  {resource.oaId}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 truncate mt-0.5">
                {'title' in resource.data ? resource.data.title : 'Recurso Pedagógico'}
              </h2>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              id="btn-print-resource"
              onClick={handlePrint}
              title="Imprimir / Guardar como PDF"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors flex items-center gap-1.5 text-xs font-medium border border-slate-300"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              id="btn-toggle-fullscreen"
              onClick={() => setIsFullScreen(!isFullScreen)}
              title={isFullScreen ? 'Salir de pantalla completa' : 'Pantalla Completa (Modo Proyector)'}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors border border-slate-300"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              id="btn-close-viewer-modal"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div id="resource-viewer-body" className="p-6 overflow-y-auto flex-1 bg-white text-slate-800">
          {/* 1. Material de Estudio */}
          {resource.type === 'material' && (() => {
            const mat = resource.data as StudyResourceItem;
            return (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                      {mat.tag} • Tiempo estimado: {mat.readTime}
                    </span>
                    <p className="text-sm text-slate-700 mt-1 font-medium">
                      {mat.summary}
                    </p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none space-y-4">
                  {mat.contentMarkdown.split('\n\n').map((block, idx) => {
                    if (block.startsWith('### ')) {
                      return (
                        <h3 key={idx} className="text-lg font-bold text-slate-900 pt-2 border-b border-slate-100 pb-1 flex items-center gap-2">
                          <MathText content={block.replace('### ', '')} />
                        </h3>
                      );
                    }
                    if (block.startsWith('---')) {
                      return <hr key={idx} className="border-slate-200 my-4" />;
                    }
                    return (
                      <div key={idx} className="text-slate-700 leading-relaxed text-sm sm:text-base bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                        <MathText content={block} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* 2. Ejercicios Guiados */}
          {resource.type === 'guided' && (() => {
            const guided = resource.data as GuidedExerciseItem;
            return (
              <div className="space-y-6 max-w-3xl mx-auto">
                {/* Statement Card */}
                <div className="p-5 bg-amber-50/50 rounded-xl border border-amber-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                      Dificultad: {guided.difficulty}
                    </span>
                    <button
                      id="btn-reveal-all-steps"
                      onClick={() => revealAllSteps(guided.steps.length)}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline"
                    >
                      Revelar todos los pasos
                    </button>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-500 mb-1">Enunciado del Problema Modelo:</h3>
                  <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                    <MathText content={guided.statement} />
                  </div>
                </div>

                {/* Steps Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Resolución Guiada en Pizarra (Paso a Paso):
                  </h4>
                  {guided.steps.map((step, idx) => {
                    const isRevealed = revealedSteps.includes(idx);
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                          isRevealed
                            ? 'bg-white border-indigo-200 shadow-sm'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <button
                          onClick={() => toggleStep(idx)}
                          className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 font-semibold text-slate-800 hover:bg-slate-50/80"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <span className="text-sm sm:text-base text-slate-900">{step.title}</span>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              isRevealed ? 'rotate-90 text-indigo-600' : ''
                            }`}
                          />
                        </button>

                        {isRevealed && (
                          <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-sm space-y-3 animate-fade-in">
                            <p className="text-slate-700">
                              <MathText content={step.description} />
                            </p>
                            {step.mathExpression && (
                              <div className="p-3 bg-slate-900 text-emerald-300 rounded-lg font-mono text-center overflow-x-auto shadow-inner text-base">
                                <MathText content={`$$${step.mathExpression}$$`} />
                              </div>
                            )}
                            {step.pedagogicalTip && (
                              <div className="p-2.5 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg text-xs text-amber-900 flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <span><strong>Consejo para el Maestro:</strong> {step.pedagogicalTip}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Final Answer Banner */}
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                        Respuesta Final Verificada
                      </div>
                      <div className="text-base font-bold text-slate-900 mt-0.5">
                        <MathText content={guided.finalAnswer} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 3. Ejercicios Propuestos */}
          {resource.type === 'proposed' && (() => {
            const prop = resource.data as ProposedExerciseItem;
            return (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Tiempo Sugerido: {prop.estimatedTime}
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5 italic">
                      {prop.studentInstructions}
                    </p>
                  </div>
                  <button
                    id="btn-toggle-solution-key"
                    onClick={() => setShowTeacherSolutions(!showTeacherSolutions)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                      showTeacherSolutions
                        ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {showTeacherSolutions ? 'Ocultar Solucionario' : 'Ver Solucionario Docente'}
                  </button>
                </div>

                {/* Problems list */}
                <div className="space-y-4">
                  {prop.problems.map((prob) => (
                    <div
                      key={prob.number}
                      className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {prob.number}
                          </span>
                          <div className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                            <MathText content={prob.statement} />
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 flex-shrink-0">
                          {prob.points} pts
                        </span>
                      </div>

                      {showTeacherSolutions && (
                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs sm:text-sm text-emerald-950 flex items-start gap-2 animate-fade-in">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Solución Oficial y Criterio:</strong>{' '}
                            <MathText content={prob.solution} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Modal Bottom Footer */}
        <div
          id="resource-viewer-footer"
          className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4 flex-shrink-0"
        >
          <button
            id="btn-footer-close"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-200/80 font-medium text-sm transition-colors"
          >
            Cerrar Visor
          </button>

          {onStartLiveSession && (
            <button
              id="btn-footer-launch-live"
              onClick={() => {
                onClose();
                onStartLiveSession(resource.oaId);
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center gap-2 transition-transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Lanzar Evaluación en Vivo para {resource.oaId}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
