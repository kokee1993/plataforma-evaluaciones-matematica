import React from 'react';
import { Student, SessionData } from '../../types';
import { Trophy, Medal, Download, X, CheckCircle, XCircle, AlertTriangle, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionData;
  students: Record<string, Student>;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  session,
  students,
}) => {
  if (!isOpen) return null;

  const studentList = (Object.entries(students || {}) as [string, Student][]).map(([id, st]) => ({
    id,
    ...st,
    totalAnswered: st.correct + st.errors,
    accuracy: (st.correct + st.errors) > 0
      ? Math.round((st.correct / (st.correct + st.errors)) * 100)
      : 0,
  }));

  studentList.sort((a, b) => {
    if (b.correct !== a.correct) return b.correct - a.correct;
    return a.errors - b.errors;
  });

  const top3 = studentList.slice(0, 3);
  const totalQuestions = session.quizData.length;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleExportCSV = () => {
    const headers = ['Nombre', 'Aciertos', 'Errores', 'Total Respondidas', '% Precision', 'Salidas de Pestana', 'Estado'];
    const rows = studentList.map((s) => [
      `"${s.name}"`,
      s.correct,
      s.errors,
      s.totalAnswered,
      `${s.accuracy}%`,
      s.tabEscapes,
      `"${s.lastAction}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_clase_${session.pin}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base sm:text-lg">Resultados de la Clase de Matemáticas</h3>
              <p className="text-xs text-slate-400">
                {session.title} • {studentList.length} alumnos participantes
              </p>
            </div>
          </div>
          <button
            id="close-results-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Podium for Top 3 */}
          {top3.length > 0 && (
            <div className="p-5 bg-gradient-to-b from-indigo-950/40 to-slate-950/60 rounded-2xl border border-indigo-900/40 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Medal className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
                  Podio de Rendimiento y Precisión
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end justify-center pt-3 pb-1">
                {/* 2nd place */}
                {top3[1] ? (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-500 flex items-center justify-center text-slate-200 font-bold text-xs mb-1 shadow">
                      2
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 w-full text-center">
                      <p className="font-bold text-slate-200 text-xs truncate">{top3[1].name}</p>
                      <p className="text-[11px] font-mono text-emerald-400 font-semibold">{top3[1].correct} correctas</p>
                      <p className="text-[10px] text-slate-400">{top3[1].accuracy}% precisión</p>
                    </div>
                    <div className="h-14 w-full bg-slate-800/80 rounded-t-lg mt-1 border-t-2 border-slate-400" />
                  </div>
                ) : <div />}

                {/* 1st place */}
                {top3[0] ? (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-500 border-2 border-amber-300 flex items-center justify-center text-slate-950 font-black text-sm mb-1 shadow-lg shadow-amber-500/30 animate-pulse">
                      1
                    </div>
                    <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/60 w-full text-center">
                      <p className="font-bold text-amber-200 text-xs sm:text-sm truncate">{top3[0].name}</p>
                      <p className="text-xs font-mono text-amber-400 font-bold">{top3[0].correct} / {totalQuestions} correctas</p>
                      <p className="text-[11px] text-amber-300/80 font-semibold">{top3[0].accuracy}% precisión</p>
                    </div>
                    <div className="h-20 w-full bg-amber-500/20 rounded-t-lg mt-1 border-t-2 border-amber-400" />
                  </div>
                ) : <div />}

                {/* 3rd place */}
                {top3[2] ? (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-800 border border-amber-600 flex items-center justify-center text-amber-200 font-bold text-xs mb-1 shadow">
                      3
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 w-full text-center">
                      <p className="font-bold text-slate-200 text-xs truncate">{top3[2].name}</p>
                      <p className="text-[11px] font-mono text-emerald-400 font-semibold">{top3[2].correct} correctas</p>
                      <p className="text-[10px] text-slate-400">{top3[2].accuracy}% precisión</p>
                    </div>
                    <div className="h-10 w-full bg-slate-800/60 rounded-t-lg mt-1 border-t-2 border-amber-700" />
                  </div>
                ) : <div />}
              </div>
            </div>
          )}

          {/* Full Student Roster Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" />
              Detalle Completo por Alumno
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="p-2.5 pl-3">#</th>
                    <th className="p-2.5">Alumno</th>
                    <th className="p-2.5 text-center">Aciertos</th>
                    <th className="p-2.5 text-center">Errores</th>
                    <th className="p-2.5 text-center">% Éxito</th>
                    <th className="p-2.5 text-center">Distracciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {studentList.map((st, idx) => (
                    <tr key={st.id} className="hover:bg-slate-900/50 transition">
                      <td className="p-2.5 pl-3 font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-2.5 font-semibold text-slate-200">{st.name}</td>
                      <td className="p-2.5 text-center font-mono text-emerald-400 font-bold">{st.correct}</td>
                      <td className="p-2.5 text-center font-mono text-rose-400">{st.errors}</td>
                      <td className="p-2.5 text-center font-mono text-slate-300">{st.accuracy}%</td>
                      <td className="p-2.5 text-center font-mono">
                        {st.tabEscapes > 0 ? (
                          <span className="text-amber-400 font-semibold" title={`${st.tabEscapes} salidas de pantalla`}>
                            ⚠️ {st.tabEscapes}
                          </span>
                        ) : (
                          <span className="text-slate-500">0</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/90">
          <button
            id="celebrate-btn"
            type="button"
            onClick={triggerConfetti}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Celebrar con Confeti</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="export-csv-btn"
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Descargar CSV para Libro de Clases</span>
            </button>
            <button
              id="close-results-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
            >
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
