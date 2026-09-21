import React, { useState } from 'react';
import { Question, QuizPreset } from '../../types';
import { PRESET_QUIZZES } from '../../data/presetQuizzes';
import { realtimeDb } from '../../lib/firebase';
import { MathText, ExerciseMedia } from '../MathRenderer';
import {
  Sparkles,
  Upload,
  BookOpen,
  Plus,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Code,
  Image as ImageIcon,
  Send,
  Eye,
} from 'lucide-react';

interface ContentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuizTitle: string;
}

export const ContentManagerModal: React.FC<ContentManagerModalProps> = ({
  isOpen,
  onClose,
  currentQuizTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'ai_text' | 'file' | 'manual'>('presets');
  const [quizTitle, setQuizTitle] = useState('Evaluación Formativa de Matemáticas');
  const [gradeLevel, setGradeLevel] = useState('1° Medio');
  const [rawText, setRawText] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Manual questions state
  const [manualQuestions, setManualQuestions] = useState<Question[]>([
    {
      id: 'manual-1',
      text: 'Calcula el valor de la expresión $2x^2 - 3x + 5$ cuando $x = 4$:',
      options: ['$25$', '$20$', '$29$', '$15$'],
      correctAnswer: 0,
      explanation: 'Sustituyendo $x=4$: $2(4^2) - 3(4) + 5 = 2(16) - 12 + 5 = 32 - 12 + 5 = 25$.',
      hint: 'Eleva al cuadrado el 4 antes de multiplicar por 2.',
      grade: '8° Básico',
      topic: 'Valorización Algebraica',
    },
  ]);

  if (!isOpen) return null;

  // 1. Handle Selecting a Preset Quiz
  const handleSelectPreset = (preset: QuizPreset) => {
    setQuizTitle(preset.title);
    setGradeLevel(preset.grade);
    setParsedQuestions(preset.questions);
    setParseError(null);
  };

  // 2. Parse Raw Text / AI Prompt JSON
  const handleParseText = () => {
    setParseError(null);
    if (!rawText.trim()) {
      setParseError('Por favor ingresa texto o JSON con ejercicios.');
      return;
    }

    try {
      let jsonMatch = rawText.trim();
      const fenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (fenceMatch) {
        jsonMatch = fenceMatch[1];
      }

      const parsed = JSON.parse(jsonMatch);
      let list: any[] = [];

      if (Array.isArray(parsed)) {
        list = parsed;
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        list = parsed.questions;
        if (parsed.title) setQuizTitle(parsed.title);
        if (parsed.grade) setGradeLevel(parsed.grade);
      } else {
        throw new Error('El JSON debe ser un array de ejercicios o contener la propiedad "questions".');
      }

      const validated: Question[] = list.map((item, idx) => ({
        id: item.id || `q-parsed-${idx + 1}`,
        text: item.text || item.question || `Pregunta ${idx + 1}`,
        options: Array.isArray(item.options) ? item.options : ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correctAnswer: typeof item.correctAnswer === 'number' ? item.correctAnswer : 0,
        explanation: item.explanation || '',
        hint: item.hint || '',
        image: item.image || '',
        svg: item.svg || '',
        topic: item.topic || 'Matemáticas',
        grade: item.grade || gradeLevel,
      }));

      if (validated.length === 0) {
        throw new Error('No se encontraron preguntas válidas en el JSON.');
      }

      setParsedQuestions(validated);
      setParseError(null);
    } catch (err: any) {
      try {
        const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
        const autoQuestions: Question[] = [];
        let currentQ: Partial<Question> | null = null;

        lines.forEach((line) => {
          if (line.match(/^(\d+[\.\)]|¿|Pregunta|\#)/i)) {
            if (currentQ && currentQ.text && (currentQ.options?.length || 0) > 1) {
              autoQuestions.push({
                id: `q-auto-${autoQuestions.length + 1}`,
                text: currentQ.text,
                options: currentQ.options || [],
                correctAnswer: currentQ.correctAnswer || 0,
                explanation: currentQ.explanation || '',
                grade: gradeLevel,
              });
            }
            currentQ = {
              text: line.replace(/^(\d+[\.\)]|\#+)\s*/, ''),
              options: [],
              correctAnswer: 0,
            };
          } else if (line.match(/^[A-Da-d][\.\)]/)) {
            if (currentQ) {
              const optText = line.replace(/^[A-Da-d][\.\)]\s*/, '');
              const isMarkedCorrect = line.includes('*') || line.toLowerCase().includes('(correcta)');
              const cleanText = optText.replace(/\*|\(correcta\)/gi, '').trim();
              if (isMarkedCorrect) {
                currentQ.correctAnswer = currentQ.options?.length || 0;
              }
              currentQ.options = [...(currentQ.options || []), cleanText];
            }
          }
        });

        if (currentQ && (currentQ as any).text && ((currentQ as any).options?.length || 0) > 1) {
          autoQuestions.push({
            id: `q-auto-${autoQuestions.length + 1}`,
            text: (currentQ as any).text,
            options: (currentQ as any).options || [],
            correctAnswer: (currentQ as any).correctAnswer || 0,
            grade: gradeLevel,
          });
        }

        if (autoQuestions.length > 0) {
          setParsedQuestions(autoQuestions);
          setParseError(null);
          return;
        }
      } catch (fallbackErr) {}

      setParseError(
        `Error al procesar formato: ${err.message || 'Verifica la estructura JSON o sintaxis'}. Puedes usar el botón de ejemplo.`
      );
    }
  };

  // 3. Handle File Upload (.json or .txt)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
        setActiveTab('ai_text');
        try {
          const parsed = JSON.parse(content);
          const list = Array.isArray(parsed) ? parsed : parsed.questions || [];
          if (list.length > 0) {
            setParsedQuestions(list);
            if (parsed.title) setQuizTitle(parsed.title);
            if (parsed.grade) setGradeLevel(parsed.grade);
            setParseError(null);
          }
        } catch {}
      }
    };
    reader.readAsText(file);
  };

  // Example Prompt Loader
  const handleLoadSampleJSON = () => {
    const sample = JSON.stringify(
      {
        title: 'Evaluación Rápida: Ecuaciones y Geometría',
        grade: '2° Medio',
        questions: [
          {
            id: 'sample-1',
            text: 'En la ecuación cuadrática $x^2 - 5x + 6 = 0$, el producto de las soluciones $x_1 \\cdot x_2$ es:',
            options: ['$6$', '$-5$', '$-6$', '$5$'],
            correctAnswer: 0,
            explanation: 'Por el Teorema de Vieta, en $ax^2+bx+c=0$, el producto es $\\frac{c}{a} = \\frac{6}{1} = 6$.',
            svg: '<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto"><rect x="10" y="10" width="220" height="80" rx="8" fill="#eef2ff" stroke="#6366f1" stroke-width="2"/><text x="120" y="55" fill="#4338ca" font-size="16" text-anchor="middle" font-weight="bold">x² - 5x + 6 = (x-2)(x-3)</text></svg>',
          },
          {
            id: 'sample-2',
            text: '¿Cuál es la pendiente $m$ de la recta que pasa por los puntos $P(2, 3)$ y $Q(6, 11)$?',
            options: ['$m = 2$', '$m = 4$', '$m = \\frac{1}{2}$', '$m = 8$'],
            correctAnswer: 0,
            explanation: '$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{11 - 3}{6 - 2} = \\frac{8}{4} = 2$.',
          },
        ],
      },
      null,
      2
    );
    setRawText(sample);
  };

  // Publish Questions to Classroom
  const handlePublishToClass = async () => {
    let questionsToPublish: Question[] = [];

    if (activeTab === 'manual') {
      questionsToPublish = manualQuestions;
    } else {
      questionsToPublish = parsedQuestions;
    }

    if (questionsToPublish.length === 0) {
      setParseError('No hay preguntas listas para publicar. Selecciona una plantilla o procesa tu texto/JSON.');
      return;
    }

    setIsPublishing(true);
    try {
      await realtimeDb.publishQuiz(questionsToPublish, quizTitle, gradeLevel);
      setPublishSuccess(true);
      setTimeout(() => {
        setPublishSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      setParseError(`Error al publicar en Firebase: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const activeQuestionList = activeTab === 'manual' ? manualQuestions : parsedQuestions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">Gestor Dinámico de Materia y Ejercicios</h2>
              <p className="text-xs text-slate-500">
                Materia activa: <span className="text-indigo-600 font-bold">{currentQuizTitle}</span>
              </p>
            </div>
          </div>
          <button
            id="close-content-manager-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Quiz Title & Grade Settings */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Título del Cuestionario / Unidad
            </label>
            <input
              id="quiz-title-input"
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:border-indigo-500 outline-none transition"
              placeholder="Ej: Teorema de Pitágoras y Álgebra"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nivel Escolar
            </label>
            <select
              id="grade-level-select"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:border-indigo-500 outline-none transition"
            >
              <option value="8° Básico">8° Básico</option>
              <option value="1° Medio">1° Medio</option>
              <option value="2° Medio">2° Medio</option>
              <option value="3° Medio">3° Medio</option>
              <option value="4° Medio">4° Medio</option>
            </select>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto">
          <button
            id="tab-presets-btn"
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'presets'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Banco Curricular (8° a 4° Medio)</span>
          </button>
          <button
            id="tab-ai-text-btn"
            onClick={() => setActiveTab('ai_text')}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'ai_text'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Creador Rápido / Prompt IA (JSON / Texto)</span>
          </button>
          <button
            id="tab-file-btn"
            onClick={() => setActiveTab('file')}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'file'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importar Archivo (.json / .txt)</span>
          </button>
          <button
            id="tab-manual-btn"
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'manual'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Editor Manual ({manualQuestions.length})</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-[#f8fafc]">
          {/* TAB 1: CURRICULAR PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-800 font-medium">
                Selecciona una unidad curricular lista para usar con diagramas SVG interactivos, fórmulas KaTeX y soluciones explicadas:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {PRESET_QUIZZES.map((preset) => {
                  const isSelected = quizTitle === preset.title;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                          {preset.grade}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {preset.questions.length} ejercicios
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{preset.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">{preset.description}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                        <span className="text-indigo-600 font-bold">{preset.topic}</span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-emerald-600 font-bold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Seleccionado
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: AI PROMPT / TEXT AREA CREATOR */}
          {activeTab === 'ai_text' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 text-xs">
                <p className="text-slate-600">
                  Pega directamente un JSON o texto generado por IA con ejercicios matemáticos:
                </p>
                <button
                  id="load-sample-json-btn"
                  type="button"
                  onClick={handleLoadSampleJSON}
                  className="text-indigo-600 hover:text-indigo-500 font-bold underline shrink-0"
                >
                  Cargar Ejemplo
                </button>
              </div>

              <div className="relative">
                <textarea
                  id="ai-prompt-json-textarea"
                  rows={9}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={`Ejemplo de formato soportado:
[
  {
    "text": "Resuelve la ecuación $2x + 7 = 19$. ¿Cuánto vale $x$?",
    "options": ["$x = 6$", "$x = 5$", "$x = 8$", "$x = 12$"],
    "correctAnswer": 0,
    "explanation": "$2x = 19 - 7 = 12 \\implies x = 6$",
    "svg": "<svg>...</svg>",
    "image": "https://..."
  }
]`}
                  className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs font-mono focus:border-indigo-500 outline-none resize-y custom-scrollbar shadow-inner"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  id="parse-text-btn"
                  type="button"
                  onClick={handleParseText}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Procesar y Previsualizar</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: FILE IMPORT (JSON/TXT) */}
          {activeTab === 'file' && (
            <div className="space-y-4">
              <label
                htmlFor="file-upload-input"
                className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-white hover:bg-slate-50 transition group shadow-sm"
              >
                <div className="p-4 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 mb-3 transition">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">
                  Arrastra tu archivo aquí o haz clic para explorar
                </h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Formatos compatibles: <span className="font-mono text-indigo-600 font-bold">.json</span> o{' '}
                  <span className="font-mono text-indigo-600 font-bold">.txt</span> estructurado.
                </p>
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".json,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* TAB 4: MANUAL QUESTION BUILDER */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">
                  Crea o edita preguntas directamente con soporte para KaTeX, SVG e Imágenes:
                </span>
                <button
                  id="add-manual-question-btn"
                  type="button"
                  onClick={() => {
                    setManualQuestions([
                      ...manualQuestions,
                      {
                        id: `manual-${Date.now()}`,
                        text: 'Nueva pregunta matemática $x = \\dots$',
                        options: ['$A$', '$B$', '$C$', '$D$'],
                        correctAnswer: 0,
                        explanation: 'Explicación de la respuesta...',
                        grade: gradeLevel,
                      },
                    ]);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-xs font-bold text-indigo-700 transition border border-indigo-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Pregunta</span>
                </button>
              </div>

              <div className="space-y-4">
                {manualQuestions.map((q, qIndex) => (
                  <div key={q.id || qIndex} className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-indigo-600 font-mono">Pregunta {qIndex + 1}</span>
                      {manualQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setManualQuestions(manualQuestions.filter((_, idx) => idx !== qIndex));
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Enunciado (Usa $...$ para KaTeX)</label>
                      <input
                        type="text"
                        value={q.text}
                        onChange={(e) => {
                          const updated = [...manualQuestions];
                          updated[qIndex].text = e.target.value;
                          setManualQuestions(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-indigo-500"
                      />
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-opt-${qIndex}`}
                            checked={q.correctAnswer === optIdx}
                            onChange={() => {
                              const updated = [...manualQuestions];
                              updated[qIndex].correctAnswer = optIdx;
                              setManualQuestions(updated);
                            }}
                            className="accent-emerald-600"
                            title="Marcar como respuesta correcta"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updated = [...manualQuestions];
                              updated[qIndex].options[optIdx] = e.target.value;
                              setManualQuestions(updated);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs outline-none focus:bg-white focus:border-indigo-500"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Multimedia inputs: Image & SVG */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-indigo-500" />
                          URL Imagen Web (Opcional)
                        </label>
                        <input
                          type="text"
                          value={q.image || ''}
                          placeholder="https://ejemplo.com/grafico.png"
                          onChange={(e) => {
                            const updated = [...manualQuestions];
                            updated[qIndex].image = e.target.value;
                            setManualQuestions(updated);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs outline-none focus:bg-white focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                          <Code className="w-3 h-3 text-indigo-500" />
                          Código SVG Embebido (Opcional)
                        </label>
                        <input
                          type="text"
                          value={q.svg || ''}
                          placeholder="<svg viewBox='...'>...</svg>"
                          onChange={(e) => {
                            const updated = [...manualQuestions];
                            updated[qIndex].svg = e.target.value;
                            setManualQuestions(updated);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs outline-none focus:bg-white focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PREVIEW OF LOADED / PARSED QUESTIONS */}
          {activeQuestionList.length > 0 && (
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Previsualización ({activeQuestionList.length} Ejercicios Listos)
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Soporte KaTeX, SVG e Imágenes Activo
                </span>
              </div>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {activeQuestionList.map((q, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-bold text-indigo-700 font-mono shrink-0">P{idx + 1}:</span>
                      <div className="flex-1 font-semibold text-slate-900">
                        <MathText content={q.text} />
                      </div>
                    </div>

                    <ExerciseMedia svg={q.svg} image={q.image} title={q.text} className="my-2" />

                    <div className="grid grid-cols-2 gap-1.5 mt-2">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-xl text-[11px] flex items-center gap-1.5 ${
                            oIdx === q.correctAnswer
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold'
                              : 'bg-white text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-md flex items-center justify-center text-[10px] bg-slate-100 font-bold">
                            {['A', 'B', 'C', 'D', 'E'][oIdx] || `${oIdx + 1}`}
                          </span>
                          <MathText content={opt} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback & Error Messages */}
          {parseError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{parseError}</span>
            </div>
          )}

          {publishSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                ¡Materia publicada exitosamente! Todos los alumnos conectados fueron sincronizados al instante.
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
          <div className="text-xs text-slate-500">
            {activeQuestionList.length > 0 ? (
              <span className="text-slate-800 font-bold">
                {activeQuestionList.length} ejercicios listos para enviar a la clase
              </span>
            ) : (
              'Elige una plantilla o procesa tus ejercicios'
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="cancel-content-manager-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              id="publish-quiz-to-class-btn"
              type="button"
              disabled={isPublishing || activeQuestionList.length === 0}
              onClick={handlePublishToClass}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPublishing ? 'Publicando a la Clase...' : 'Publicar a la Clase'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
