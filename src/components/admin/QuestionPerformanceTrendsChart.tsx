import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Brain,
  Target,
  Users,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Clock,
} from 'lucide-react';
import { Question, Student } from '../../types';
import { MathText } from '../MathRenderer';

interface QuestionPerformanceTrendsChartProps {
  questions: Question[];
  activeQuestionIndex: number;
  students: Record<string, Student>;
  onSelectQuestion?: (index: number) => void;
}

export const QuestionPerformanceTrendsChart: React.FC<QuestionPerformanceTrendsChartProps> = ({
  questions,
  activeQuestionIndex,
  students,
  onSelectQuestion,
}) => {
  const [selectedQIndex, setSelectedQIndex] = useState<number>(activeQuestionIndex || 0);
  const [activeTab, setActiveTab] = useState<'trend' | 'distribution' | 'all_questions'>('trend');

  // Keep internal selected index in sync if prop changes and user hasn't explicitly diverged
  const currentQIndex = Math.min(Math.max(0, selectedQIndex), Math.max(0, questions.length - 1));
  const question = questions[currentQIndex];
  const studentList = useMemo(() => Object.values(students || {}) as Student[], [students]);

  // Handle navigation
  const handleGoQuestion = (idx: number) => {
    setSelectedQIndex(idx);
    if (onSelectQuestion) {
      onSelectQuestion(idx);
    }
  };

  // --- 1. Compute Question Specific Answer Timeline & Accuracy Over Time ---
  const { timelineData, optionCounts, answeredCount, correctCount, mostCommonWrongOption } = useMemo(() => {
    const rawAnswers: Array<{
      studentName: string;
      studentId: string;
      selected: number;
      isCorrect: boolean;
      timestamp: number;
    }> = [];

    const counts = [0, 0, 0, 0, 0];
    let correct = 0;

    studentList.forEach((st) => {
      const ans = st.answers?.[currentQIndex];
      if (ans !== undefined && typeof ans.selected === 'number') {
        const ts = ans.timestamp || st.lastActive || Date.now();
        rawAnswers.push({
          studentName: st.name,
          studentId: st.id,
          selected: ans.selected,
          isCorrect: Boolean(ans.isCorrect),
          timestamp: ts,
        });

        if (ans.selected >= 0 && ans.selected < counts.length) {
          counts[ans.selected]++;
        }
        if (ans.isCorrect) {
          correct++;
        }
      }
    });

    // Sort chronologically
    rawAnswers.sort((a, b) => a.timestamp - b.timestamp);

    let runningCorrect = 0;
    const timeline = rawAnswers.map((item, index) => {
      if (item.isCorrect) runningCorrect++;
      const runningAccuracy = Math.round((runningCorrect / (index + 1)) * 100);
      const timeLabel = new Date(item.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const letter = ['A', 'B', 'C', 'D', 'E'][item.selected] || `${item.selected + 1}`;

      return {
        order: index + 1,
        studentName: item.studentName,
        timeLabel,
        selectedOption: letter,
        isCorrect: item.isCorrect ? 1 : 0,
        resultLabel: item.isCorrect ? 'Correcto' : 'Error',
        accuracy: runningAccuracy,
        runningCorrect,
        totalSoFar: index + 1,
      };
    });

    // Determine the most common wrong option (misconception distractor)
    const correctAnswerIndex = question?.correctAnswer ?? -1;
    let maxWrongCount = 0;
    let worstOptionIdx = -1;

    counts.forEach((cnt, idx) => {
      if (idx !== correctAnswerIndex && cnt > maxWrongCount) {
        maxWrongCount = cnt;
        worstOptionIdx = idx;
      }
    });

    return {
      timelineData: timeline,
      optionCounts: counts,
      answeredCount: rawAnswers.length,
      correctCount: correct,
      mostCommonWrongOption:
        worstOptionIdx >= 0 && maxWrongCount > 0
          ? {
              index: worstOptionIdx,
              letter: ['A', 'B', 'C', 'D', 'E'][worstOptionIdx],
              count: maxWrongCount,
              percentage: rawAnswers.length > 0 ? Math.round((maxWrongCount / rawAnswers.length) * 100) : 0,
            }
          : null,
    };
  }, [studentList, currentQIndex, question]);

  // --- 2. Compute All Questions Accuracy Overview (For Tab 'all_questions') ---
  const allQuestionsAccuracy = useMemo(() => {
    return questions.map((q, idx) => {
      let qAnswered = 0;
      let qCorrect = 0;
      studentList.forEach((st) => {
        const a = st.answers?.[idx];
        if (a !== undefined && typeof a.selected === 'number') {
          qAnswered++;
          if (a.isCorrect) qCorrect++;
        }
      });
      const accuracy = qAnswered > 0 ? Math.round((qCorrect / qAnswered) * 100) : 0;
      return {
        questionNumber: `P${idx + 1}`,
        questionIndex: idx,
        accuracy,
        answered: qAnswered,
        correct: qCorrect,
        topic: q.topic || `Pregunta ${idx + 1}`,
      };
    });
  }, [questions, studentList]);

  // Current question accuracy
  const currentAccuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // Options chart data for Distribution tab
  const optionChartData = useMemo(() => {
    if (!question) return [];
    return question.options.map((optText, idx) => {
      const letter = ['A', 'B', 'C', 'D', 'E'][idx] || `${idx + 1}`;
      const count = optionCounts[idx] || 0;
      const pct = answeredCount > 0 ? Math.round((count / answeredCount) * 100) : 0;
      const isCorrect = idx === question.correctAnswer;
      const isMisconception = mostCommonWrongOption && mostCommonWrongOption.index === idx;

      return {
        name: `Opción ${letter}`,
        letter,
        text: optText,
        count,
        percentage: pct,
        isCorrect,
        isMisconception,
      };
    });
  }, [question, optionCounts, answeredCount, mostCommonWrongOption]);

  if (!question) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Top Header: Title & View Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                Tendencia de Rendimiento & Detección de Errores Comunes
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Tiempo Real
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualización con Recharts para analizar la precisión acumulada e identificar conceptos erróneos al instante.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl self-start lg:self-auto">
          <button
            id="tab-trend-accuracy"
            onClick={() => setActiveTab('trend')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'trend'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Precisión en el Tiempo</span>
          </button>
          <button
            id="tab-distractor-analysis"
            onClick={() => setActiveTab('distribution')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'distribution'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Distribución de Opciones</span>
          </button>
          <button
            id="tab-all-questions-overview"
            onClick={() => setActiveTab('all_questions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'all_questions'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Comparativa Global</span>
          </button>
        </div>
      </div>

      {/* Question Selector Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Target className="w-3.5 h-3.5" /> Preguntas:
          </span>
          {questions.map((q, idx) => {
            const isSelected = idx === currentQIndex;
            // Quick calculation of accuracy for this question
            let qAns = 0;
            let qCorr = 0;
            studentList.forEach((s) => {
              const a = s.answers?.[idx];
              if (a !== undefined && typeof a.selected === 'number') {
                qAns++;
                if (a.isCorrect) qCorr++;
              }
            });
            const acc = qAns > 0 ? Math.round((qCorr / qAns) * 100) : null;

            return (
              <button
                key={idx}
                onClick={() => handleGoQuestion(idx)}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>P{idx + 1}</span>
                {acc !== null && (
                  <span
                    className={`text-[10px] font-mono px-1 rounded ${
                      isSelected
                        ? 'bg-indigo-700/80 text-white'
                        : acc >= 70
                        ? 'bg-emerald-100 text-emerald-800'
                        : acc >= 50
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {acc}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Prev / Next controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => handleGoQuestion(Math.max(0, currentQIndex - 1))}
            disabled={currentQIndex === 0}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-600"
            title="Pregunta anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-slate-500 px-1">
            {currentQIndex + 1} / {questions.length}
          </span>
          <button
            onClick={() => handleGoQuestion(Math.min(questions.length - 1, currentQIndex + 1))}
            disabled={currentQIndex === questions.length - 1}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-600"
            title="Pregunta siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Snippet Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="min-w-0">
          <span className="font-black text-indigo-700 uppercase tracking-wider block mb-0.5">
            Pregunta {currentQIndex + 1}: {question.topic || 'Ejercicio de Evaluación'}
          </span>
          <div className="text-slate-800 line-clamp-2 font-medium">
            <MathText text={question.question} />
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Respuestas</span>
            <span className="font-mono font-black text-slate-800 text-sm">
              {answeredCount} <span className="text-slate-400 font-normal">/ {studentList.length}</span>
            </span>
          </div>
          <div className="text-right pl-3 border-l border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Precisión</span>
            <span
              className={`font-mono font-black text-sm ${
                currentAccuracy >= 70
                  ? 'text-emerald-600'
                  : currentAccuracy >= 50
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {currentAccuracy}%
            </span>
          </div>
        </div>
      </div>

      {/* MAIN VIEW 1: LineChart - Accuracy Trend Over Time */}
      {activeTab === 'trend' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Evolución de la Precisión Promedio a lo Largo de las Entregas
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">
              Total entregas: {timelineData.length}
            </span>
          </div>

          {timelineData.length === 0 ? (
            <div className="h-64 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Clock className="w-8 h-8 text-slate-300 mb-2 animate-pulse" />
              <p className="font-bold text-sm text-slate-600">Aún no hay respuestas registradas para esta pregunta</p>
              <p className="text-xs text-slate-400 mt-1">
                A medida que los estudiantes respondan en sus dispositivos, el gráfico de Recharts trazará la tendencia temporal en tiempo real.
              </p>
            </div>
          ) : (
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timelineData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="order"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickFormatter={(val) => `#${val}`}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                            <div className="font-bold text-indigo-300 flex items-center justify-between gap-3">
                              <span>{d.studentName}</span>
                              <span className="font-mono text-[10px] text-slate-400">{d.timeLabel}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>Marcó Opción:</span>
                              <span className="font-black px-1.5 py-0.2 rounded bg-slate-800 text-amber-300">
                                {d.selectedOption}
                              </span>
                              <span
                                className={`font-bold px-1.5 py-0.2 rounded ${
                                  d.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                }`}
                              >
                                {d.resultLabel}
                              </span>
                            </div>
                            <div className="pt-1 border-t border-slate-700 text-slate-300 flex justify-between gap-4 font-mono">
                              <span>Precisión acumulada:</span>
                              <span className="font-black text-white">{d.accuracy}%</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Standard benchmark line at 70% */}
                  <ReferenceLine
                    y={70}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Meta de Logro (70%)',
                      fill: '#059669',
                      fontSize: 10,
                      position: 'insideTopRight',
                    }}
                  />
                  {/* 50% warning line */}
                  <ReferenceLine
                    y={50}
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    label={{
                      value: 'Alerta (50%)',
                      fill: '#d97706',
                      fontSize: 10,
                      position: 'insideBottomRight',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    name="Precisión Promedio"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#accuracyGradient)"
                    dot={{ r: 3, fill: '#4f46e5', strokeWidth: 1, stroke: '#ffffff' }}
                    activeDot={{ r: 6, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* MAIN VIEW 2: BarChart - Option Distribution & Misconception Analysis */}
      {activeTab === 'distribution' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Distribución de Respuestas por Alternativa (A, B, C, D)
            </h4>
            <span className="text-[11px] text-slate-500">
              Total alumnos: {answeredCount}
            </span>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={optionChartData}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 'bold' }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1 max-w-xs">
                          <div className="font-bold flex items-center justify-between">
                            <span className="text-indigo-300 font-black">{d.name}</span>
                            {d.isCorrect ? (
                              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                                ✓ Correcta
                              </span>
                            ) : d.isMisconception ? (
                              <span className="text-[10px] bg-amber-500/30 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                                ⚠️ Distractor Principal
                              </span>
                            ) : (
                              <span className="text-[10px] bg-slate-700 text-slate-300 font-bold px-1.5 py-0.5 rounded">
                                Incorrecta
                              </span>
                            )}
                          </div>
                          <div className="text-slate-200 font-mono pt-1">
                            {d.count} alumno(s) ({d.percentage}%)
                          </div>
                          <div className="text-[11px] text-slate-300 border-t border-slate-700 pt-1">
                            <MathText text={d.text} />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {optionChartData.map((entry, index) => {
                    let fillColor = '#94a3b8'; // default slate
                    if (entry.isCorrect) fillColor = '#10b981'; // emerald
                    else if (entry.isMisconception) fillColor = '#f59e0b'; // amber distractor
                    return <Cell key={`cell-${index}`} fill={fillColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Options Detailed Breakdown with MathText */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {optionChartData.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex items-start justify-between gap-2 text-xs transition ${
                  item.isCorrect
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                    : item.isMisconception
                    ? 'bg-amber-50/70 border-amber-300 text-amber-900'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-black px-1.5 py-0.5 rounded bg-white/80 border text-[11px]">
                      {item.letter}
                    </span>
                    {item.isCorrect && (
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Solución Correcta
                      </span>
                    )}
                    {item.isMisconception && (
                      <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3 text-amber-700" /> Distractor Trampa
                      </span>
                    )}
                  </div>
                  <div className="text-slate-800">
                    <MathText text={item.text} />
                  </div>
                </div>
                <div className="text-right font-mono shrink-0 pl-2">
                  <span className="font-black text-sm block">{item.count}</span>
                  <span className="text-[10px] opacity-75">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN VIEW 3: Global Comparison Across All Questions */}
      {activeTab === 'all_questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              Tasa de Acierto por Pregunta en Toda la Evaluación
            </h4>
            <span className="text-[11px] text-slate-500">
              Haz clic en una barra para inspeccionar esa pregunta
            </span>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={allQuestionsAccuracy}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                onClick={(state: any) => {
                  if (state && state.activePayload && state.activePayload.length) {
                    const idx = state.activePayload[0].payload.questionIndex;
                    handleGoQuestion(idx);
                    setActiveTab('trend');
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="questionNumber"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 'bold' }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                          <span className="font-black text-indigo-300 block">{d.questionNumber} - {d.topic}</span>
                          <div className="font-mono text-slate-300">
                            Precisión: <span className="font-black text-white">{d.accuracy}%</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {d.correct} aciertos de {d.answered} respuestas
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={70}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  label={{ value: '70%', fill: '#059669', fontSize: 10 }}
                />
                <Bar dataKey="accuracy" radius={[6, 6, 0, 0]} cursor="pointer">
                  {allQuestionsAccuracy.map((entry, index) => {
                    const isCurrent = entry.questionIndex === currentQIndex;
                    let color = '#4f46e5';
                    if (entry.accuracy >= 70) color = isCurrent ? '#059669' : '#10b981';
                    else if (entry.accuracy >= 50) color = isCurrent ? '#d97706' : '#f59e0b';
                    else color = isCurrent ? '#dc2626' : '#ef4444';

                    return <Cell key={`bar-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* REAL-TIME MISCONCEPTION DIAGNOSTIC ENGINE CARD */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-indigo-500/10 border border-amber-500/20 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-900 font-black text-xs sm:text-sm">
            <Brain className="w-4 h-4 text-amber-600" />
            <span>Diagnóstico Pedagógico en Tiempo Real: Errores Frecuentes & Concepciones Alternativas</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
            IA Pedagógica
          </span>
        </div>

        {mostCommonWrongOption && mostCommonWrongOption.percentage >= 20 ? (
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-white border border-amber-200 text-slate-800 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  Alerta de Distractor Atractivo:
                </span>
                <span className="font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                  Opción {mostCommonWrongOption.letter}
                </span>
                <span className="text-slate-500 font-mono">
                  ({mostCommonWrongOption.percentage}% de las respuestas totales - {mostCommonWrongOption.count} alumnos)
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Existe una alta concentración de errores en la <strong>Opción {mostCommonWrongOption.letter}</strong>.
                Este patrón indica una concepción alternativa típica: los estudiantes no están respondiendo al azar, sino siguiendo un razonamiento erróneo recurrente (por ejemplo, aplicación indebida de la regla de signos, simplificación incompleta o confusión de operaciones inversas).
              </p>
            </div>

            {/* Pedagogical intervention advice */}
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-950">
              <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-indigo-900 block">Sugerencia de Mediación en el Aula:</span>
                <p className="text-[11px] text-indigo-800 leading-normal">
                  Pausa la prueba o proyecta esta pregunta al finalizar. Pregunta al curso: <em>"¿Por qué alguien elegiría la opción {mostCommonWrongOption.letter}?"</em> para que ellos mismos descubran la trampa antes de revelar la opción correcta.
                </p>
              </div>
            </div>
          </div>
        ) : answeredCount > 0 && currentAccuracy >= 80 ? (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block">Excelente asimilación conceptual:</span>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                La precisión promedio supera el 80%. No se detectan distractores predominantes ni confusiones cognitivas recurrentes en esta pregunta.
              </p>
            </div>
          </div>
        ) : answeredCount > 0 ? (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            <p className="text-[11px]">
              Los errores se distribuyen equitativamente entre las diferentes alternativas, lo que sugiere dudas dispersas más que un distractor engañoso específico.
            </p>
          </div>
        ) : (
          <p className="text-slate-500 text-xs italic">
            Esperando respuestas de los estudiantes para calcular el análisis de errores frecuentes y distractores cognitivos.
          </p>
        )}
      </div>
    </div>
  );
};
