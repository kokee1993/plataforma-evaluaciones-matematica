import React from 'react';
import { Question, Student } from '../../types';
import { MathText } from '../MathRenderer';
import { BarChart3, Users, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface LiveStatsChartProps {
  question: Question;
  questionIndex: number;
  students: Record<string, Student>;
  showAnswers: boolean;
  onToggleShowAnswers: () => void;
}

export const LiveStatsChart: React.FC<LiveStatsChartProps> = ({
  question,
  questionIndex,
  students,
  showAnswers,
  onToggleShowAnswers,
}) => {
  const studentList = (Object.values(students || {}) as Student[]);
  const totalStudents = studentList.length;

  // Calculate responses for this question index
  const counts = [0, 0, 0, 0, 0]; // Options A, B, C, D, E
  let answeredCount = 0;
  let correctCount = 0;

  studentList.forEach((st) => {
    const ans = st.answers?.[questionIndex];
    if (ans !== undefined && typeof ans.selected === 'number') {
      answeredCount++;
      if (ans.selected >= 0 && ans.selected < counts.length) {
        counts[ans.selected]++;
      }
      if (ans.isCorrect) {
        correctCount++;
      }
    }
  });

  const responseRate = totalStudents > 0 ? Math.round((answeredCount / totalStudents) * 100) : 0;
  const accuracyRate = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Distribución de Respuestas</h3>
            <span className="text-[11px] text-slate-400">Pregunta {questionIndex + 1} en tiempo real</span>
          </div>
        </div>

        <button
          id="toggle-reveal-answer-chart-btn"
          onClick={onToggleShowAnswers}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            showAnswers
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {showAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-indigo-600" />}
          <span>{showAnswers ? 'Ocultar' : 'Revelar Solución'}</span>
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
          <span className="text-[10px] uppercase font-bold text-indigo-600 block">Participación</span>
          <div className="text-xl font-black text-indigo-900 font-mono mt-0.5">
            {answeredCount} <span className="text-xs font-normal text-indigo-500">/ {totalStudents}</span>
          </div>
          <span className="text-[10px] text-indigo-600 font-semibold">{responseRate}% del curso</span>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
          <span className="text-[10px] uppercase font-bold text-emerald-600 block">Aciertos</span>
          <div className="text-xl font-black text-emerald-900 font-mono mt-0.5">
            {accuracyRate}%
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">{correctCount} respuestas correctas</span>
        </div>
      </div>

      {/* Bars Breakdown */}
      <div className="space-y-3 pt-1">
        {question.options.map((opt, idx) => {
          const count = counts[idx] || 0;
          const percentage = answeredCount > 0 ? Math.round((count / answeredCount) * 100) : 0;
          const isCorrect = idx === question.correctAnswer;
          const isRevealed = showAnswers && isCorrect;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                      isRevealed
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {['A', 'B', 'C', 'D', 'E'][idx] || `${idx + 1}`}
                  </span>
                  <div className="truncate text-slate-700 font-medium text-[11px]">
                    <MathText content={opt} />
                  </div>
                  {isRevealed && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded shrink-0">
                      Correcta
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono shrink-0">
                  <span className="text-slate-400 text-[11px]">{count} votos</span>
                  <span className="font-bold text-slate-800 text-xs w-9 text-right">{percentage}%</span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isRevealed
                      ? 'bg-emerald-500'
                      : percentage > 0
                      ? 'bg-indigo-600'
                      : 'bg-slate-200'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
