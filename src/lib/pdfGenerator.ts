import { jsPDF } from 'jspdf';
import { Student, Question, SessionData, GradebookCourseRecord, GradebookEntry } from '../types';
import { TEST_FORMS_CONFIG } from '../data/donBoscoHomoteciaQuiz';

export function calculateChileanGrade(
  score: number,
  maxScore: number,
  exigence = 0.6
): { grade: string; percentage: number; isApproved: boolean } {
  if (maxScore <= 0) return { grade: '1.0', percentage: 0, isApproved: false };
  const safeScore = Math.max(0, Math.min(score, maxScore));
  const percentage = Math.round((safeScore / maxScore) * 100);
  const cutoff = maxScore * exigence;

  let gradeNum = 1.0;
  if (safeScore < cutoff) {
    // 1.0 to 4.0
    gradeNum = 1.0 + 3.0 * (safeScore / cutoff);
  } else {
    // 4.0 to 7.0
    const surplus = safeScore - cutoff;
    const remaining = maxScore - cutoff;
    gradeNum = remaining > 0 ? 4.0 + 3.0 * (surplus / remaining) : 7.0;
  }

  // Round to 1 decimal place
  const rounded = Math.round(gradeNum * 10) / 10;
  const gradeStr = rounded.toFixed(1);
  return {
    grade: gradeStr,
    percentage,
    isApproved: rounded >= 4.0,
  };
}

export function generateStudentReportPDF(
  student: Student,
  session: SessionData,
  questions: Question[]
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    // Decorative top brand bar
    doc.setFillColor(30, 58, 138); // Dark Navy / Salesianos Blue
    doc.rect(margin, y, contentWidth, 2, 'F');
  };

  // 1. School Header Banner
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text('COLEGIO TÉCNICO INDUSTRIAL DON BOSCO', pageWidth / 2, y + 6, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Área Académica — Salesianos Antofagasta', pageWidth / 2, y + 11, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    '“HACER LO QUE ÉL LES DIGA, CREYENTES LIBRES PARA SERVIR”',
    pageWidth / 2,
    y + 16,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    'CERTIFICADO OFICIAL DE EVALUACIÓN SUMATIVA: HOMOTECIA GEOMÉTRICA (MA01 OA 08)',
    pageWidth / 2,
    y + 22,
    { align: 'center' }
  );

  y += 30;

  // Calculate Scores and Chilean Grade
  const totalQuestions = questions.length;
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

  // 2. Student Info & Summary Grid
  const isGroup = student.type === 'group';
  const displayName = student.name || 'Estudiante';
  const membersText = isGroup && student.members?.length ? student.members.join(', ') : 'Individual';

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 34, 'FD');

  // Left column: Student Data
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('ALUMNO / EQUIPO:', margin + 4, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.text(displayName.substring(0, 42), margin + 36, y + 6);

  if (isGroup) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Integrantes: ${membersText}`.substring(0, 75), margin + 4, y + 12);
  } else {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text('CORREO:', margin + 4, y + 12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 58, 138);
    doc.text(student.email || 'Registro en sala digital', margin + 36, y + 12);
  }

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('CURSO / FORMA:', margin + 4, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(
    `${student.course || '1° Medio D'} — ${formCfg.label} (${formCfg.fullName})`,
    margin + 36,
    y + 18
  );

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('FECHA / HORA:', margin + 4, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(new Date().toLocaleString('es-CL'), margin + 36, y + 24);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('SALA / PIN:', margin + 4, y + 30);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${session.pin} (Plataforma Salesianos Antofagasta)`, margin + 36, y + 30);

  // Right box: Grade & Score Card
  const boxX = margin + contentWidth - 58;
  const boxW = 54;
  doc.setFillColor(
    gradeData.isApproved ? 236 : 254,
    gradeData.isApproved ? 253 : 242,
    gradeData.isApproved ? 245 : 242
  );
  doc.setDrawColor(
    gradeData.isApproved ? 16 : 225,
    gradeData.isApproved ? 185 : 29,
    gradeData.isApproved ? 129 : 72
  );
  doc.roundedRect(boxX, y + 3, boxW, 28, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('CALIFICACIÓN OFICIAL', boxX + boxW / 2, y + 8, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(
    gradeData.isApproved ? 4 : 190,
    gradeData.isApproved ? 120 : 18,
    gradeData.isApproved ? 87 : 60
  );
  doc.text(`NOTA: ${gradeData.grade}`, boxX + boxW / 2, y + 16, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Puntaje: ${studentPoints} / ${maxPoints} pts (${gradeData.percentage}%)`,
    boxX + boxW / 2,
    y + 22,
    { align: 'center' }
  );
  doc.setFont('helvetica', 'bold');
  doc.text(
    gradeData.isApproved ? '✓ APROBADO (Exigencia 60%)' : '✗ REQUIERE REFUERZO',
    boxX + boxW / 2,
    y + 27,
    { align: 'center' }
  );

  y += 40;

  // 3. Objectives & Standards (OA)
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 14, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('OBJETIVO DE APRENDIZAJE:', margin + 3, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(
    'MA01 OA 08: Comprender homotecia geométrica, centro O, razón k, paralelismo, variación de áreas y perímetros.',
    margin + 45,
    y + 4.5
  );

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('HABILIDADES EVALUADAS:', margin + 3, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(
    'Representar, Modelar, Argumentar, Resolver problemas en contextos geométricos y de escala.',
    margin + 45,
    y + 10
  );

  y += 18;

  // 4. Section Title: Registered Items Table
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('REGISTRO OFICIAL DE ÍTEMS Y DESAFÍOS EVALUADOS', margin, y);
  y += 4;

  // Table Header
  doc.setFillColor(30, 58, 138);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('#', margin + 3, y + 4.2);
  doc.text('CONTENIDO / TÓPICO EVALUADO', margin + 12, y + 4.2);
  doc.text('PUNTOS', margin + contentWidth - 45, y + 4.2);
  doc.text('ESTADO DE ENTREGA', margin + contentWidth - 25, y + 4.2);
  y += 6;

  // Render Item Rows
  questions.forEach((q, idx) => {
    checkPageBreak(8);
    const ans = student.answers?.[idx];
    const isAnswered = ans !== undefined;
    const qPoints = q.points || (idx >= 10 ? 4 : 2);

    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 6, 'FD');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`${idx + 1}`, margin + 3, y + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.text((q.topic || `Ejercicio ${idx + 1}`).substring(0, 65), margin + 12, y + 4.2);

    doc.setFont('helvetica', 'bold');
    doc.text(`${qPoints} pts`, margin + contentWidth - 45, y + 4.2);

    doc.setFontSize(7);
    if (isAnswered) {
      doc.setTextColor(22, 101, 52);
      doc.text('✓ Registrada', margin + contentWidth - 25, y + 4.2);
    } else {
      doc.setTextColor(148, 163, 184);
      doc.text('— Omitida', margin + contentWidth - 25, y + 4.2);
    }

    y += 6;
  });

  y += 6;

  // Security Note
  checkPageBreak(16);
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 12, 1, 1, 'FD');
  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(71, 85, 105);
  const secText =
    'Nota de Seguridad y Confidencialidad: Las claves de respuestas y solucionarios no se exhiben en este documento para resguardar la integridad y probidad de la evaluación en aula. La calificación oficial queda archivada en el libro de clases.';
  doc.text(doc.splitTextToSize(secText, contentWidth - 6), margin + 3, y + 4);
  y += 16;

  // 5. Institutional Signatures
  checkPageBreak(30);
  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, margin + contentWidth, y);
  y += 8;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);

  const colW = contentWidth / 2;
  // Left: Teacher
  doc.text('Docente Responsable de Matemática', margin + 10, y);
  doc.setFont('helvetica', 'normal');
  doc.text('Colegio Técnico Industrial Don Bosco', margin + 10, y + 4);
  doc.text('Antofagasta, Chile', margin + 10, y + 8);
  doc.line(margin + 10, y + 16, margin + 75, y + 16);
  doc.text('Firma y Timbre Docente', margin + 10, y + 20);

  // Right: Validation Stamp
  doc.setFont('helvetica', 'bold');
  doc.text('Certificado de Evaluación Digital', margin + colW + 10, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`ID Validación: DB-${Date.now().toString(36).toUpperCase()}`, margin + colW + 10, y + 4);
  doc.text('Sistema Salesianos Antofagasta', margin + colW + 10, y + 8);
  doc.line(margin + colW + 10, y + 16, margin + colW + 75, y + 16);
  doc.text('Firma Estudiante / Apoderado', margin + colW + 10, y + 20);

  return doc;
}

export function downloadStudentReportPDF(
  student: Student,
  session: SessionData,
  questions: Question[]
): void {
  const doc = generateStudentReportPDF(student, session, questions);
  const safeName = (student.name || 'Alumno').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Certificado_Homotecia_1Medio_${safeName}_DonBosco.pdf`;
  doc.save(filename);
}

export function generateEmailReportBody(
  student: Student,
  session: SessionData,
  questions: Question[]
): string {
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

  const lines = [
    `Estimado/a ${student.name}:`,
    ``,
    `Te enviamos el comprobante oficial de tu Evaluación Sumativa de Matemática realizada en el Colegio Técnico Industrial Don Bosco:`,
    `--------------------------------------------------`,
    `COLEGIO TÉCNICO INDUSTRIAL DON BOSCO - ANTOFAGASTA`,
    `Evaluación: Homotecia Geométrica - 1° Medio (MA01 OA 08)`,
    `Forma Asignada: ${formCfg.label} (${formCfg.fullName})`,
    `Curso: ${student.course || '1° Medio'}`,
    `Fecha: ${new Date().toLocaleDateString('es-CL')}`,
    `--------------------------------------------------`,
    `CALIFICACIÓN OFICIAL / NOTA: ${gradeData.grade}`,
    `Puntaje Obtenido: ${studentPoints} de ${maxPoints} puntos (${gradeData.percentage}% de logro)`,
    `Estado Académico: ${gradeData.isApproved ? 'APROBADO' : 'REQUIERE REFUERZO'}`,
    `Preguntas respondidas: ${answeredCount} de ${questions.length}`,
    `--------------------------------------------------`,
    `Tu registro y respuestas han quedado guardados de manera definitiva e inmutable en el libro de clases digital del profesor.`,
    ``,
    `Atentamente,`,
    `Departamento de Matemática`,
    `Colegio Técnico Industrial Don Bosco Antofagasta`,
  ];

  return lines.join('\n');
}

/**
 * Generates an official institutional PDF Acta / Course Gradebook Report
 * with Chilean 60% exigence scale, student nominal roster, KPIs, and signatures.
 */
export function generateCourseExecutiveReportPDF(record: GradebookCourseRecord): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;
  let pageNumber = 1;

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

  const drawPageFooter = () => {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(
      `EduMath Pro • Sistema de Evaluación Salesianos Antofagasta • Página ${pageNumber}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 15) {
      drawPageFooter();
      doc.addPage();
      pageNumber++;
      y = margin;
      // Repeat mini header on subsequent pages
      doc.setFillColor(30, 58, 138);
      doc.rect(margin, y, contentWidth, 2, 'F');
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 58, 138);
      doc.text(
        `ACTA DE EVALUACIÓN: ${record.courseName || 'Curso'} — ${record.activityTitle || 'Matemática'} (Continuación)`,
        margin,
        y
      );
      y += 6;
      drawTableHeader();
    }
  };

  // 1. Institutional Header Banner
  doc.setFillColor(30, 58, 138); // Salesianos Navy Blue
  doc.rect(margin, y, contentWidth, 2.5, 'F');
  y += 4.5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text('COLEGIO TÉCNICO INDUSTRIAL DON BOSCO', pageWidth / 2, y + 6, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Área Académica — Departamento de Matemática • Salesianos Antofagasta', pageWidth / 2, y + 11, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(
    'ACTA OFICIAL DE RENDIMIENTO Y CALIFICACIONES (ESCALA MINEDUC 60%)',
    pageWidth / 2,
    y + 18,
    { align: 'center' }
  );

  y += 27;

  // 2. Evaluation Metadata Card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('EVALUACIÓN:', margin + 4, y + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text((record.activityTitle || 'Evaluación Formativa de Matemática').substring(0, 50), margin + 30, y + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('CURSO / SALA:', margin + 4, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${record.courseName || '1° Medio D'} — Sala PIN: ${record.pin || '---'}`, margin + 30, y + 11);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('FECHA EMISIÓN:', margin + contentWidth - 65, y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(record.date || new Date().toLocaleDateString('es-CL'), margin + contentWidth - 36, y + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('ESTADO ACTA:', margin + contentWidth - 65, y + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text(record.isFinalized ? 'CERRADA Y ARCHIVADA' : 'FINALIZADA EN SALA', margin + contentWidth - 36, y + 11);

  y += 22;

  // 3. Stat KPI Cards
  const kpiW = (contentWidth - 9) / 4;
  const kpis = [
    { label: 'EVALUADOS', val: `${total}`, sub: `${passedCount} Aprob. / ${failedCount} Reprob.`, color: [15, 23, 42] },
    { label: 'PROMEDIO CURSO', val: avgGrade.toFixed(1), sub: 'Escala 1.0 a 7.0 (60%)', color: [67, 56, 202] },
    { label: '% APROBACIÓN', val: `${passRate}%`, sub: `${passedCount} de ${total} alumnos`, color: [22, 101, 52] },
    { label: 'EVIDENCIAS CUADERNO', val: `${totalPhotos}`, sub: 'Fotografías validadas', color: [2, 132, 199] },
  ];

  kpis.forEach((k, idx) => {
    const kX = margin + idx * (kpiW + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(kX, y, kpiW, 16, 1.5, 1.5, 'FD');

    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(k.label, kX + kpiW / 2, y + 4.5, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(k.color[0], k.color[1], k.color[2]);
    doc.text(k.val, kX + kpiW / 2, y + 10, { align: 'center' });

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(k.sub, kX + kpiW / 2, y + 14, { align: 'center' });
  });

  y += 20;

  // 4. Roster Table
  const drawTableHeader = () => {
    doc.setFillColor(30, 58, 138);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);

    doc.text('Nº', margin + 3, y + 4.2);
    doc.text('ESTUDIANTE / EQUIPO', margin + 12, y + 4.2);
    doc.text('FORMA', margin + 86, y + 4.2, { align: 'center' });
    doc.text('BUENAS', margin + 102, y + 4.2, { align: 'center' });
    doc.text('MALAS', margin + 116, y + 4.2, { align: 'center' });
    doc.text('PUNTAJE', margin + 132, y + 4.2, { align: 'center' });
    doc.text('EVID.', margin + 147, y + 4.2, { align: 'center' });
    doc.text('NOTA', margin + 162, y + 4.2, { align: 'center' });
    doc.text('ESTADO', margin + contentWidth - 10, y + 4.2, { align: 'center' });
    y += 6;
  };

  drawTableHeader();

  // Render Table Rows
  entries.forEach((e, idx) => {
    checkPageBreak(6.2);

    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 5.8, 'FD');

    const grade = typeof e.grade === 'number' ? e.grade.toFixed(1) : (e.grade || '1.0');
    const isApproved = (e.grade || 0) >= 4.0;
    const listNum = e.listNumber ? `${e.listNumber}` : `${idx + 1}`;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(listNum, margin + 3, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text((e.participantName || 'Estudiante').substring(0, 36), margin + 12, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Forma ${e.testVariant || 'A'}`, margin + 86, y + 4, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 101, 52);
    doc.text(`${e.correct || 0}`, margin + 102, y + 4, { align: 'center' });

    doc.setTextColor(220, 38, 38);
    doc.text(`${e.errors || 0}`, margin + 116, y + 4, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(`${e.score || 0} pts`, margin + 132, y + 4, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(2, 132, 199);
    doc.text(`${e.notebookPhotosCount || 0}`, margin + 147, y + 4, { align: 'center' });

    // Note highlight
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    if (isApproved) {
      doc.setTextColor(22, 101, 52);
    } else {
      doc.setTextColor(220, 38, 38);
    }
    doc.text(grade, margin + 162, y + 4, { align: 'center' });

    doc.setFontSize(6.5);
    doc.text(isApproved ? 'APROBADO' : 'REPROBADO', margin + contentWidth - 10, y + 4, { align: 'center' });

    y += 5.8;
  });

  // 5. Signatures and Legal Footer
  checkPageBreak(32);
  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Certificación Oficial: Notas calculadas con 60% de exigencia conforme a la escala reglamentaria del MINEDUC de Chile. Acta respaldada digitalmente en Libro de Clases.',
    margin,
    y
  );

  y += 12;

  const colW = contentWidth / 2;
  // Left: Docente
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Docente Responsable de Matemática', margin + 12, y);
  doc.setFont('helvetica', 'normal');
  doc.text('Colegio Técnico Industrial Don Bosco', margin + 12, y + 3.5);
  doc.line(margin + 12, y + 14, margin + 75, y + 14);
  doc.text('Firma y Timbre Docente', margin + 12, y + 18);

  // Right: Jefatura
  doc.setFont('helvetica', 'bold');
  doc.text('Unidad Técnico Pedagógica / Registro Curricular', margin + colW + 12, y);
  doc.setFont('helvetica', 'normal');
  doc.text('Salesianos Antofagasta — Chile', margin + colW + 12, y + 3.5);
  doc.line(margin + colW + 12, y + 14, margin + colW + 75, y + 14);
  doc.text('Validación Institucional', margin + colW + 12, y + 18);

  drawPageFooter();

  return doc;
}

export function downloadCourseExecutiveReportPDF(record: GradebookCourseRecord): void {
  const doc = generateCourseExecutiveReportPDF(record);
  const safeCourse = (record.courseName || record.courseKey || 'Curso').replace(/[^a-zA-Z0-9_-]/g, '_');
  const safePin = (record.pin || 'SALA').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Acta_Oficial_Evaluacion_${safeCourse}_${safePin}.pdf`;
  doc.save(filename);
}

