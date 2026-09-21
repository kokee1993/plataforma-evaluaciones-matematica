import React, { useState } from 'react';
import { Student, SessionData, Question } from '../../types';
import {
  calculateChileanGrade,
  downloadStudentReportPDF,
  generateEmailReportBody,
} from '../../lib/pdfGenerator';
import { realtimeDb } from '../../lib/firebase';
import { TEST_FORMS_CONFIG } from '../../data/donBoscoHomoteciaQuiz';
import {
  FileDown,
  Mail,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  Share2,
  X,
  Send,
  HelpCircle,
  FileText,
  ShieldCheck,
  Check,
  GraduationCap,
} from 'lucide-react';

interface StudentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  session: SessionData;
  questions: Question[];
}

export const StudentReportModal: React.FC<StudentReportModalProps> = ({
  isOpen,
  onClose,
  student,
  session,
  questions,
}) => {
  const [emailInput, setEmailInput] = useState<string>(student?.email || '');
  const [emailSent, setEmailSent] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  // Compute points
  let maxPoints = 0;
  let studentPoints = 0;
  let correctCount = 0;
  let answeredCount = 0;

  questions.forEach((q, idx) => {
    const qPoints = q.points || (idx >= 10 ? 4 : 2);
    maxPoints += qPoints;
    const ans = student.answers?.[idx];
    if (ans) {
      answeredCount++;
      if (ans.isCorrect) {
        studentPoints += qPoints;
        correctCount++;
      }
    }
  });

  if (maxPoints === 0) maxPoints = 36;
  const gradeData = calculateChileanGrade(studentPoints, maxPoints, 0.6);
  const variantKey = student.testVariant || 'A';
  const formCfg = TEST_FORMS_CONFIG[variantKey] || TEST_FORMS_CONFIG.A;

  const handleDownloadPDF = () => {
    downloadStudentReportPDF(student, session, questions);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    // Save in student record in real-time
    if (student.id) {
      realtimeDb.updateStudentEmail(student.id, emailInput.trim());
    }

    const emailSubject = encodeURIComponent(
      `Comprobante Oficial de Calificación Don Bosco: ${student.name} (${formCfg.label})`
    );
    const emailBody = encodeURIComponent(generateEmailReportBody(student, session, questions));

    // Open mail client
    window.location.href = `mailto:${emailInput.trim()}?subject=${emailSubject}&body=${emailBody}`;

    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 5000);
  };

  const handleCopySummary = () => {
    const text = generateEmailReportBody(student, session, questions);
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-900 to-indigo-900 p-4 sm:p-6 text-white flex items-center justify-between border-b border-indigo-700/50">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold tracking-widest text-indigo-300 uppercase bg-indigo-950/70 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                COLEGIO TÉCNICO INDUSTRIAL DON BOSCO
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${formCfg.pillBg} border ${formCfg.borderColor}`}>
                {formCfg.label}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black mt-1">
              Certificado Oficial de Calificación Sumativa
            </h2>
            <p className="text-xs text-indigo-200">
              1° Medio — Homotecia Geométrica (MA01 OA 08)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-100 flex-1">
          {/* Grade Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              className={`sm:col-span-2 p-4 rounded-2xl border flex flex-col justify-between ${
                gradeData.isApproved
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-300">
                    {student.type === 'group' ? 'Equipo:' : 'Estudiante:'} {student.name}
                  </span>
                  {student.course && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 border border-slate-700">
                      {student.course}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    gradeData.isApproved
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {gradeData.isApproved ? '✓ APROBADO' : '✗ REQUIERE REFUERZO'}
                </span>
              </div>

              <div className="my-2 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black tracking-tight">
                  Nota {gradeData.grade}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  (Escala 1.0 a 7.0 al 60% exigencia)
                </span>
              </div>

              <div className="text-xs text-slate-300 flex items-center justify-between pt-2 border-t border-slate-700/50 font-mono">
                <span>
                  Puntaje: <strong>{studentPoints}</strong> / {maxPoints} pts
                </span>
                <span>Logro: <strong>{gradeData.percentage}%</strong></span>
                <span>
                  Respondidas: <strong>{answeredCount}</strong> / {questions.length}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 justify-center">
              <button
                onClick={handleDownloadPDF}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
              >
                <FileDown className="w-4 h-4" />
                <span>Descargar Certificado PDF</span>
              </button>

              <button
                onClick={handleCopySummary}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>{isCopied ? '✓ Copiado' : 'Copiar Resumen'}</span>
              </button>
            </div>
          </div>

          {/* Email Delivery Box */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
              <Mail className="w-4 h-4" />
              <span>Enviar Certificado Oficial y Calificación a tu Correo</span>
            </div>

            <form onSubmit={handleSendEmail} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="alumno@donboscoantofagasta.cl"
                required
                className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-sky-500 outline-none transition"
              />
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar al Correo</span>
              </button>
            </form>

            {emailSent && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>¡Se abrió tu cliente de correo para enviar el comprobante oficial!</span>
              </p>
            )}
          </div>

          {/* Security & Confidentiality Banner */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-indigo-300 block mb-0.5">Seguridad y Probidad Académica Institucional:</strong>
              Por normativa académica y prevención de copias en el aula, las respuestas correctas de la evaluación no se publican en pantallas estudiantiles. Tu calificación y respaldo están guardados de forma segura e inmutable en el libro de clases digital del profesor.
            </div>
          </div>

          {/* Secure Registry of Submitted Exercises */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-700">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Registro de Ítems Evaluados ({questions.length} Preguntas)
              </h3>
            </div>

            <div className="divide-y divide-slate-800 bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden">
              {questions.map((q, idx) => {
                const ans = student.answers?.[idx];
                const isAnswered = ans !== undefined;
                const qPoints = q.points || (idx >= 10 ? 4 : 2);

                return (
                  <div
                    key={q.id || idx}
                    className="p-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <span className="font-bold text-slate-200 block truncate">
                          {q.topic || `Ejercicio ${idx + 1}`}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Ponderación: {qPoints} pts
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isAnswered ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Registrada
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-medium">
                          Omitida
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Colegio Técnico Industrial Don Bosco Antofagasta
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
