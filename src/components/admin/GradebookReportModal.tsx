import React, { useRef } from 'react';
import { GradebookCourseRecord } from '../../types';
import { downloadCourseExecutiveReportPDF } from '../../lib/pdfGenerator';
import {
  FileText,
  Download,
  Printer,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  Camera,
  School,
  Award,
  Users,
  Percent,
} from 'lucide-react';

interface GradebookReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: GradebookCourseRecord | null;
  currentPin?: string;
}

export const GradebookReportModal: React.FC<GradebookReportModalProps> = ({
  isOpen,
  onClose,
  record,
  currentPin,
}) => {
  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !record) return null;

  const entries = [...(record.entries || [])].sort((a, b) => {
    if (a.listNumber && b.listNumber) return a.listNumber - b.listNumber;
    if (a.listNumber) return -1;
    if (b.listNumber) return 1;
    return (a.participantName || '').localeCompare(b.participantName || '');
  });

  const total = entries.length;
  const avgGrade = record.averageGrade || 0;
  const passedCount = entries.filter((e) => (e.grade || 0) >= 4.0).length;
  const failedCount = total - passedCount;
  const passRate = total > 0 ? Math.round((passedCount / total) * 100) : 0;
  const totalPhotos = entries.reduce((sum, e) => sum + (e.notebookPhotosCount || 0), 0);

  const handleDownloadPDF = () => {
    downloadCourseExecutiveReportPDF(record);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'Nº Lista',
      'Estudiante',
      'Curso',
      'Forma',
      'Correctas',
      'Errores',
      'Puntaje',
      'Fotos Cuaderno',
      'Nota (Escala 60%)',
      'Estado',
    ];

    const rows = entries.map((e, idx) => {
      const isApproved = (e.grade || 0) >= 4.0;
      const gradeStr = typeof e.grade === 'number' ? e.grade.toFixed(1) : (e.grade || '1.0');
      return [
        e.listNumber || idx + 1,
        `"${(e.participantName || '').replace(/"/g, '""')}"`,
        `"${e.course || record.courseName || ''}"`,
        e.testVariant || 'A',
        e.correct || 0,
        e.errors || 0,
        e.score || 0,
        e.notebookPhotosCount || 0,
        gradeStr,
        isApproved ? 'Aprobado' : 'Reprobado',
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Acta_${record.courseKey || 'Curso'}_${record.pin || 'SALA'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Top Control Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Acta Oficial de Evaluación</h3>
                <span className="px-2 py-0.5 rounded-md bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-bold">
                  PIN: {record.pin || currentPin || 'MAT-904'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Visualización en pantalla y descarga directa en PDF (Escala MINEDUC 60%)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition cursor-pointer"
              title="Descargar archivo PDF oficial al computador"
            >
              <Download className="w-4 h-4" />
              <span>Descargar como PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Imprimir o guardar como PDF desde el navegador"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Exportar archivo de calificaciones a Excel / CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Excel / CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title="Cerrar vista de reporte"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Canvas (Document View) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/70">
          <div
            ref={printableRef}
            className="bg-white border border-slate-300 rounded-2xl shadow-sm p-6 sm:p-8 max-w-3xl mx-auto space-y-6 print:border-none print:shadow-none print:p-0"
          >
            {/* Institution Brand Header */}
            <div className="border-b-2 border-indigo-900 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-900">
                    Colegio Técnico Industrial Don Bosco
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    Área Académica • Departamento de Matemática • Salesianos Antofagasta
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                    Acta Oficial Respaldada
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {record.activityTitle || 'Evaluación Formativa de Matemática'}
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-600">
                  <span><strong>Curso:</strong> {record.courseName || '1° Medio D'}</span>
                  <span><strong>Sala PIN:</strong> <span className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded">{record.pin || currentPin || 'MAT-904'}</span></span>
                  <span><strong>Fecha:</strong> {record.date || new Date().toLocaleDateString('es-CL')}</span>
                  <span><strong>Exigencia:</strong> 60% (MINEDUC)</span>
                </div>
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center justify-center gap-1">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span>Evaluados</span>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {passedCount} Aprob. / {failedCount} Reprob.
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center justify-center gap-1">
                  <Award className="w-3 h-3 text-indigo-500" />
                  <span>Promedio Curso</span>
                </div>
                <div className="text-2xl font-black text-indigo-700 mt-1">
                  {avgGrade.toFixed(1)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Escala 1.0 a 7.0</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center justify-center gap-1">
                  <Percent className="w-3 h-3 text-emerald-500" />
                  <span>% Aprobación</span>
                </div>
                <div className="text-2xl font-black text-emerald-600 mt-1">{passRate}%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {passedCount} de {total} aprobados
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center justify-center gap-1">
                  <Camera className="w-3 h-3 text-sky-500" />
                  <span>Evidencias</span>
                </div>
                <div className="text-2xl font-black text-sky-600 mt-1">{totalPhotos}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Fotos en cuaderno</div>
              </div>
            </div>

            {/* Roster Grades Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Nómina de Calificaciones y Rendimiento Individual
                </h3>
                <span className="text-[11px] font-medium text-slate-500">
                  Ordenado por Nº de lista
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase border-b border-slate-200">
                        <th className="py-2.5 px-3 text-center w-10">Nº</th>
                        <th className="py-2.5 px-3">Estudiante</th>
                        <th className="py-2.5 px-3 text-center">Forma</th>
                        <th className="py-2.5 px-3 text-center text-emerald-700">Buenas</th>
                        <th className="py-2.5 px-3 text-center text-rose-700">Malas</th>
                        <th className="py-2.5 px-3 text-center">Puntaje</th>
                        <th className="py-2.5 px-3 text-center">Evidencias</th>
                        <th className="py-2.5 px-3 text-center font-bold">Nota</th>
                        <th className="py-2.5 px-3 text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {entries.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                            No hay estudiantes registrados en esta evaluación.
                          </td>
                        </tr>
                      ) : (
                        entries.map((entry, idx) => {
                          const isApproved = (entry.grade || 0) >= 4.0;
                          const gradeFormatted =
                            typeof entry.grade === 'number'
                              ? entry.grade.toFixed(1)
                              : (entry.grade || '1.0');
                          const listNum = entry.listNumber ? `#${entry.listNumber}` : `${idx + 1}`;

                          return (
                            <tr key={entry.studentId || idx} className="hover:bg-slate-50 transition-colors">
                              <td className="py-2 px-3 text-center font-mono font-bold text-slate-400">
                                {listNum}
                              </td>
                              <td className="py-2 px-3 font-bold text-slate-900">
                                {entry.participantName}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                                  Forma {entry.testVariant || 'A'}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-center font-bold text-emerald-600">
                                {entry.correct || 0}
                              </td>
                              <td className="py-2 px-3 text-center font-bold text-rose-600">
                                {entry.errors || 0}
                              </td>
                              <td className="py-2 px-3 text-center text-slate-600 font-mono">
                                {entry.score || 0} pts
                              </td>
                              <td className="py-2 px-3 text-center">
                                {entry.notebookPhotosCount && entry.notebookPhotosCount > 0 ? (
                                  <span className="inline-flex items-center gap-1 font-bold text-sky-600 text-[11px]">
                                    <Camera className="w-3 h-3" />
                                    {entry.notebookPhotosCount}
                                  </span>
                                ) : (
                                  <span className="text-slate-300">—</span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <span
                                  className={`text-sm font-black font-mono ${
                                    isApproved ? 'text-emerald-700' : 'text-rose-600'
                                  }`}
                                >
                                  {gradeFormatted}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-center">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    isApproved
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {isApproved ? 'Aprobado' : 'Reprobado'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Institutional Signatures & Legal Note */}
            <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 space-y-6">
              <p className="text-[11px] leading-relaxed text-slate-500">
                <strong>Certificación de Evaluación:</strong> Las notas han sido calculadas con el 60% de exigencia reglamentaria conforme a los decretos del MINEDUC de Chile. Las evidencias y respuestas individuales quedan archivadas en la base de datos de EduMath Pro.
              </p>

              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="text-center space-y-1">
                  <div className="h-12 border-b border-slate-300 w-3/4 mx-auto mb-2"></div>
                  <div className="font-bold text-slate-800 text-xs">Docente Responsable de Matemática</div>
                  <div className="text-[11px] text-slate-500">Colegio Técnico Industrial Don Bosco</div>
                </div>

                <div className="text-center space-y-1">
                  <div className="h-12 border-b border-slate-300 w-3/4 mx-auto mb-2"></div>
                  <div className="font-bold text-slate-800 text-xs">Unidad Técnico Pedagógica (UTP)</div>
                  <div className="text-[11px] text-slate-500">Registro Curricular • Salesianos Antofagasta</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 px-6 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="text-[11px]">
            💡 Consejo: Haz clic en <strong>"Descargar como PDF"</strong> para guardar el archivo oficial de notas en tu computador.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
