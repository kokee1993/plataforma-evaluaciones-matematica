import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Initial default preset
const PRESET_DEFAULT_QUESTIONS = [
  {
    id: 'q-demo-1',
    text: '¿Cuál es el valor de $\\sqrt{144} - \\sqrt{49}$?',
    options: ['5', '7', '12', '19'],
    correctAnswer: 0,
    explanation: '$\\sqrt{144} = 12$ y $\\sqrt{49} = 7$. Luego, $12 - 7 = 5$.',
    hint: 'Calcula primero cada raíz cuadrada por separado y luego resta.',
    topic: 'Raíces Cuadradas',
    grade: '8° Básico a 1° Medio',
  },
  {
    id: 'q-demo-2',
    text: 'Al resolver la ecuación $2x + 6 = 20$, el valor de $x$ es:',
    options: ['5', '7', '10', '14'],
    correctAnswer: 1,
    explanation: '$2x = 20 - 6 = 14 \\implies x = 14 / 2 = 7$.',
    hint: 'Resta 6 a ambos lados y luego divide por 2.',
    topic: 'Ecuaciones Lineales',
    grade: '1° Medio',
  },
  {
    id: 'q-demo-3',
    text: '¿Cuál es el resultado de $(-3)^2 + (-2)^3$?',
    options: ['1', '-1', '17', '-17'],
    correctAnswer: 0,
    explanation: '$(-3)^2 = 9$ y $(-2)^3 = -8$. Por lo tanto, $9 + (-8) = 1$.',
    hint: 'Recuerda que una base negativa con exponente par es positiva, e impar es negativa.',
    topic: 'Potencias',
    grade: '8° Básico a 1° Medio',
  },
];

interface ClassroomState {
  session: {
    pin: string;
    adminKey: string;
    mode: 'teacher_paced' | 'autonomous';
    activeQuestion: number;
    status: 'active' | 'finished' | 'paused';
    lobbyStatus?: 'waiting' | 'in_game' | 'finished';
    title: string;
    gradeLevel: string;
    quizData: any[];
    showAnswers: boolean;
    curriculum?: any;
    updatedAt: number;
    kickedStudents?: Record<string, number>;
    lastRoomCleanedAt?: number;
  };
  students: Record<string, any>;
  feed: Record<string, any>;
}

// Disk Persistence for Classroom State to survive container restarts & cold boots
const STATE_FILE_PATH = path.join(process.cwd(), '.classroom_state_cache.json');
const GRADEBOOK_FILE_PATH = path.join(process.cwd(), '.gradebook_records.json');

function loadPersistedState(): ClassroomState | null {
  try {
    if (fs.existsSync(STATE_FILE_PATH)) {
      const data = fs.readFileSync(STATE_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && parsed.session && parsed.session.pin) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read state cache from disk:', err);
  }
  return null;
}

function loadPersistedGradebook(): any[] {
  try {
    if (fs.existsSync(GRADEBOOK_FILE_PATH)) {
      const data = fs.readFileSync(GRADEBOOK_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read gradebook cache from disk:', err);
  }
  return [];
}

let gradebookRecords: any[] = loadPersistedGradebook();
let saveGradebookTimer: NodeJS.Timeout | null = null;
function persistGradebookToDisk() {
  if (saveGradebookTimer) return;
  saveGradebookTimer = setTimeout(() => {
    saveGradebookTimer = null;
    try {
      fs.writeFileSync(GRADEBOOK_FILE_PATH, JSON.stringify(gradebookRecords, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not persist gradebook to disk:', e);
    }
  }, 250);
}

function autoUpdateGradebookFromStudent(studentData: any) {
  if (!studentData || (!studentData.name && !studentData.participantName && !studentData.studentId)) return;

  const rawCourse = studentData.course || studentData.gradeLevel || classroomState.session.gradeLevel || '1° Medio D';
  const is1D = /1.*[dD]|1°.*D|1.*medio.*d/i.test(rawCourse);
  const courseName = is1D ? '1° Medio D' : rawCourse;
  const courseKey = is1D ? '1_medio_D' : (studentData.courseKey || '1_medio_D').toLowerCase().replace(/\s+/g, '_');
  const activityTitle = classroomState.session.title || 'Evaluación Formativa de Matemática';
  const currentPin = (classroomState.session.pin || 'MAT-904').trim().toUpperCase();
  const todayStr = new Date().toLocaleDateString('es-CL');

  // Find or create course record for this room and activity
  let record = gradebookRecords.find(
    (r) =>
      (r.pin === currentPin || (r.id && r.id.includes(currentPin))) &&
      (r.courseKey === courseKey || (is1D && r.courseKey.toLowerCase().includes('1_medio_d')))
  );

  if (!record) {
    record = {
      id: `gb-rec-${courseKey}-${currentPin}-${Date.now()}`,
      pin: currentPin,
      courseKey,
      courseName,
      activityTitle,
      date: todayStr,
      timestamp: Date.now(),
      totalParticipants: 0,
      averageGrade: 0,
      passingRate: 0,
      entries: [],
      isFinalized: false,
    };
    gradebookRecords.unshift(record);
  }

  // Calculate score and Chilean grade (1.0 to 7.0 at 60% requirement)
  const totalQuestions = studentData.totalQuestions || classroomState.session.quizData?.length || 14;
  const correct = studentData.correct || 0;
  const errors = studentData.errors || 0;
  const notebookPhotosCount = studentData.notebookPhotosCount ?? Object.keys(studentData.notebookPhotos || {}).length;
  const earnedScore = studentData.score ?? ((correct * 100) + (notebookPhotosCount * 30));

  const maxScore = totalQuestions * 100 + totalQuestions * 30;
  const cutoff = maxScore * 0.6;
  let grade = 1.0;
  if (cutoff > 0) {
    if (earnedScore < cutoff) {
      grade = 1.0 + 3.0 * (earnedScore / cutoff);
    } else {
      const surplus = earnedScore - cutoff;
      const remaining = maxScore - cutoff;
      grade = remaining > 0 ? 4.0 + 3.0 * (surplus / remaining) : 7.0;
    }
  }
  const roundedGrade = Math.min(7.0, Math.max(1.0, Math.round(grade * 10) / 10));

  const studentId = studentData.studentId || studentData.id || `std-${Date.now()}`;
  const participantName = studentData.name || studentData.participantName || 'Estudiante';
  const listNumber = studentData.listNumber ?? undefined;

  const entry: any = {
    studentId,
    participantName,
    type: studentData.type || 'individual',
    course: courseName,
    courseKey,
    gradeLevel: studentData.gradeLevel || '1° Medio',
    section: studentData.section || (is1D ? 'D' : 'A'),
    firstName: studentData.firstName,
    paternalLastName: studentData.paternalLastName,
    maternalLastName: studentData.maternalLastName,
    listNumber,
    testVariant: studentData.testVariant || 'A',
    correct,
    errors,
    totalQuestions,
    score: earnedScore,
    notebookPhotosCount,
    grade: studentData.grade || roundedGrade,
    passed: (studentData.grade || roundedGrade) >= 4.0,
    timestamp: Date.now(),
    answers: studentData.answers || {},
    isFinalized: Boolean(studentData.isFinalized),
    finalizedAt: studentData.finalizedAt || (studentData.isFinalized ? Date.now() : undefined),
  };

  // Match by listNumber if available, or studentId, or participantName
  const existingIdx = record.entries.findIndex((e: any) => {
    if (listNumber && e.listNumber === listNumber) return true;
    if (studentId && e.studentId === studentId) return true;
    return e.participantName.trim().toLowerCase() === participantName.trim().toLowerCase();
  });

  if (existingIdx >= 0) {
    record.entries[existingIdx] = {
      ...record.entries[existingIdx],
      ...entry,
    };
  } else {
    record.entries.push(entry);
  }

  // Recalculate summary metrics
  record.totalParticipants = record.entries.length;
  const sumGrades = record.entries.reduce((sum: number, e: any) => sum + (e.grade || 0), 0);
  record.averageGrade = Math.round((sumGrades / (record.entries.length || 1)) * 10) / 10;
  const passedCount = record.entries.filter((e: any) => (e.grade || 0) >= 4.0).length;
  record.passingRate = Math.round((passedCount / (record.entries.length || 1)) * 100);
  record.timestamp = Date.now();

  persistGradebookToDisk();
}

function archiveAllActiveStudentsToGradebook(options?: {
  finalize?: boolean;
}) {
  const students = Object.values(classroomState.students || {});
  if (students.length === 0) return null;

  students.forEach((st: any) => {
    autoUpdateGradebookFromStudent(st);
  });

  const currentPin = (classroomState.session.pin || 'MAT-904').trim().toUpperCase();
  const recordsForRoom = gradebookRecords.filter(
    (r) => r.pin === currentPin || (r.id && r.id.includes(currentPin))
  );

  if (options?.finalize && recordsForRoom.length > 0) {
    recordsForRoom.forEach((rec) => {
      rec.isFinalized = true;
      rec.finalizedAt = Date.now();
      saveGradebookReportSnapshot(rec);
    });
  }

  persistGradebookToDisk();
  return recordsForRoom;
}

function generateExecutiveGradebookReportHtml(record: any): string {
  const entries: any[] = record.entries || [];
  const total = entries.length;
  const avgGrade = record.averageGrade || 0;
  const passedCount = entries.filter((e: any) => (e.grade || 0) >= 4.0).length;
  const failedCount = total - passedCount;
  const passRate = total > 0 ? Math.round((passedCount / total) * 100) : 0;
  const totalPhotos = entries.reduce((sum: number, e: any) => sum + (e.notebookPhotosCount || 0), 0);
  const formattedDate = record.date || new Date().toLocaleDateString('es-CL');
  const courseTitle = record.courseName || '1° Medio D';
  const pin = record.pin || classroomState.session.pin || 'MAT-904';
  const evalTitle = record.activityTitle || classroomState.session.title || 'Evaluación Formativa de Matemática';

  // Sort entries by listNumber, then by participantName
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.listNumber && b.listNumber) return a.listNumber - b.listNumber;
    if (a.listNumber) return -1;
    if (b.listNumber) return 1;
    return (a.participantName || '').localeCompare(b.participantName || '');
  });

  const rowsHtml = sortedEntries
    .map((e, idx) => {
      const grade = typeof e.grade === 'number' ? e.grade.toFixed(1) : (e.grade || '1.0');
      const isPassed = (e.grade || 0) >= 4.0;
      const badgeBg = isPassed ? '#dcfce7' : '#fee2e2';
      const badgeText = isPassed ? '#166534' : '#991b1b';
      const statusLabel = isPassed ? 'Aprobado' : 'Reprobado';
      const listNum = e.listNumber ? `#${e.listNumber}` : `${idx + 1}`;
      const photos = e.notebookPhotosCount || 0;

      return `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 13px;">
        <td style="padding: 10px 12px; font-weight: bold; color: #64748b; text-align: center;">${listNum}</td>
        <td style="padding: 10px 12px; font-weight: bold; color: #1e293b;">${e.participantName}</td>
        <td style="padding: 10px 12px; text-align: center; color: #475569;"><span style="background: #f1f5f9; padding: 2px 8px; border-radius: 6px; font-weight: bold;">Forma ${e.testVariant || 'A'}</span></td>
        <td style="padding: 10px 12px; text-align: center; color: #16a34a; font-weight: bold;">${e.correct || 0}</td>
        <td style="padding: 10px 12px; text-align: center; color: #dc2626; font-weight: bold;">${e.errors || 0}</td>
        <td style="padding: 10px 12px; text-align: center; color: #475569;">${e.score || 0} pts</td>
        <td style="padding: 10px 12px; text-align: center; color: #4f46e5; font-weight: bold;">📷 ${photos}</td>
        <td style="padding: 10px 12px; text-align: center; font-size: 15px; font-weight: 900; color: ${isPassed ? '#16a34a' : '#dc2626'};">${grade}</td>
        <td style="padding: 10px 12px; text-align: center;">
          <span style="background: ${badgeBg}; color: ${badgeText}; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold;">${statusLabel}</span>
        </td>
      </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte de Evaluación - ${courseTitle} (${formattedDate})</title>
  <style>
    @media print {
      body { background: #ffffff !important; padding: 0 !important; }
      .no-print { display: none !important; }
      .report-card { border: none !important; box-shadow: none !important; }
      @page { size: A4 portrait; margin: 12mm; }
    }
  </style>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a;">
  
  <!-- Floating Print Control (hidden on print) -->
  <div class="no-print" style="max-width: 820px; margin: 0 auto 16px auto; display: flex; justify-content: space-between; align-items: center; background: #0f172a; color: #ffffff; padding: 12px 20px; border-radius: 12px;">
    <span style="font-size: 13px; font-weight: bold;">📄 Reporte Oficial de Evaluación • EduMath Pro</span>
    <div style="display: flex; gap: 10px;">
      <button onclick="window.print()" style="cursor: pointer; background: #10b981; color: #ffffff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 12px; display: flex; align-items: center; gap: 6px;">
        🖨️ Imprimir / Guardar como PDF
      </button>
    </div>
  </div>

  <div class="report-card" style="max-width: 820px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
    
    <!-- Top Banner -->
    <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%); color: #ffffff; padding: 28px 32px;">
      <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.85; margin-bottom: 6px;">
        EduMath Pro • Sistema de Evaluación Formativa en Tiempo Real
      </div>
      <h1 style="font-size: 24px; font-weight: 900; margin: 0 0 8px 0; letter-spacing: -0.5px;">
        ${evalTitle}
      </h1>
      <div style="display: flex; gap: 16px; font-size: 13px; opacity: 0.9;">
        <span><strong>Curso:</strong> ${courseTitle}</span> •
        <span><strong>Sala PIN:</strong> <span style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px; font-family: monospace;">${pin}</span></span> •
        <span><strong>Fecha:</strong> ${formattedDate}</span>
      </div>
    </div>

    <div style="padding: 28px 32px;">
      <!-- Stats Cards -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; text-align: center;">
          <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b;">Evaluados</div>
          <div style="font-size: 26px; font-weight: 900; color: #0f172a; margin-top: 4px;">${total}</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; text-align: center;">
          <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b;">Promedio Curso</div>
          <div style="font-size: 26px; font-weight: 900; color: #4338ca; margin-top: 4px;">${avgGrade.toFixed(1)}</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; text-align: center;">
          <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b;">% Aprobación</div>
          <div style="font-size: 26px; font-weight: 900; color: #16a34a; margin-top: 4px;">${passRate}%</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; text-align: center;">
          <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b;">Fotos Cuaderno</div>
          <div style="font-size: 26px; font-weight: 900; color: #0284c7; margin-top: 4px;">${totalPhotos}</div>
        </div>
      </div>

      <!-- Table Section -->
      <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-size: 16px; font-weight: 800; color: #1e293b; margin: 0;">Acta Nominal de Calificaciones (Escala 60% Chile)</h2>
        <span style="font-size: 12px; color: #64748b; font-weight: bold;">${passedCount} aprobados • ${failedCount} reprobados</span>
      </div>

      <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: #f1f5f9; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #cbd5e1;">
              <th style="padding: 10px 12px; text-align: center;">Nº</th>
              <th style="padding: 10px 12px;">Estudiante</th>
              <th style="padding: 10px 12px; text-align: center;">Formulario</th>
              <th style="padding: 10px 12px; text-align: center;">Buenas</th>
              <th style="padding: 10px 12px; text-align: center;">Malas</th>
              <th style="padding: 10px 12px; text-align: center;">Puntaje</th>
              <th style="padding: 10px 12px; text-align: center;">Evidencias</th>
              <th style="padding: 10px 12px; text-align: center;">Nota</th>
              <th style="padding: 10px 12px; text-align: center;">Estado</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="9" style="text-align:center; padding: 24px; color: #94a3b8;">No se registraron respuestas en esta sesión.</td></tr>'}
          </tbody>
        </table>
      </div>

      <!-- Footnote -->
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.6;">
        <p style="margin: 0 0 6px 0;"><strong>Escala de Evaluación:</strong> Nota mínima 1.0, de aprobación 4.0 y máxima 7.0 calculada con 60% de exigencia conforme al estándar del MINEDUC de Chile.</p>
        <p style="margin: 0;">Este documento constituye un reporte oficial y respaldado en disco de la sesión en tiempo real de EduMath Pro.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function saveGradebookReportSnapshot(record: any): {
  success: boolean;
  mode: string;
  message: string;
  previewUrl: string;
  downloadUrl: string;
} {
  const htmlContent = generateExecutiveGradebookReportHtml(record);

  // Always write report html to disk for offline safety and instant review
  try {
    fs.writeFileSync(path.join(process.cwd(), '.last_session_report.html'), htmlContent, 'utf-8');
  } catch (e) {
    console.warn('Could not write last session report to disk:', e);
  }

  persistGradebookToDisk();

  return {
    success: true,
    mode: 'stored',
    message: 'Reporte oficial generado y respaldado con éxito en el Libro de Clases.',
    previewUrl: `/api/classroom/report/preview?recordId=${record.id}`,
    downloadUrl: `/api/classroom/report/download?recordId=${record.id}`,
  };
}

let saveStateTimer: NodeJS.Timeout | null = null;
function persistStateToDisk() {
  if (saveStateTimer) return;
  saveStateTimer = setTimeout(() => {
    saveStateTimer = null;
    try {
      fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(classroomState), 'utf-8');
    } catch (e) {
      console.warn('Could not persist classroom state to disk:', e);
    }
  }, 300);
}

// In-memory Classroom State initialized from disk cache if available
const persistedState = loadPersistedState();
let classroomState: ClassroomState = persistedState || {
  session: {
    pin: 'MAT-904',
    adminKey: 'jorge19931D',
    mode: 'teacher_paced',
    activeQuestion: 0,
    status: 'active',
    lobbyStatus: 'waiting',
    title: 'Evaluación Formativa de Matemática',
    gradeLevel: '1° Medio',
    quizData: PRESET_DEFAULT_QUESTIONS,
    showAnswers: false,
    updatedAt: Date.now(),
    kickedStudents: {},
  },
  students: {},
  feed: {},
};

// In-memory cache for student notebook photos to prevent broadcasting megabytes over SSE
const notebookPhotoCache = new Map<string, string>();

// SSE Connected Clients Pool
const sseClients = new Set<express.Response>();
let broadcastDebounceTimer: NodeJS.Timeout | null = null;

function broadcastState(immediate: boolean = false) {
  if (immediate) {
    if (broadcastDebounceTimer) {
      clearTimeout(broadcastDebounceTimer);
      broadcastDebounceTimer = null;
    }
    doBroadcast();
    return;
  }
  if (!broadcastDebounceTimer) {
    broadcastDebounceTimer = setTimeout(() => {
      broadcastDebounceTimer = null;
      doBroadcast();
    }, 75);
  }
}

function doBroadcast() {
  persistStateToDisk();
  const payload = JSON.stringify({ type: 'STATE_UPDATE', state: classroomState });
  sseClients.forEach((client) => {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch (e) {
      sseClients.delete(client);
    }
  });
}

// Push feed event helper
function addFeedEvent(studentName: string, type: string, detail: string) {
  const eventId = `feed-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  classroomState.feed[eventId] = {
    id: eventId,
    student: studentName,
    type,
    detail,
    timestamp: Date.now(),
  };
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now(), clients: sseClients.size, pin: classroomState.session.pin });
});

// Endpoint to retrieve notebook photo on demand (lightweight, zero SSE payload bloat)
app.get('/api/classroom/photo/:studentId/:questionIndex', (req, res) => {
  const key = `${req.params.studentId}_${req.params.questionIndex}`;
  const photo = notebookPhotoCache.get(key);
  if (!photo) {
    return res.status(404).send('Photo not found');
  }
  if (photo.startsWith('data:')) {
    const matches = photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      res.setHeader('Content-Type', matches[1]);
      return res.send(Buffer.from(matches[2], 'base64'));
    }
  }
  res.send(photo);
});

// Get current state
app.get('/api/classroom/state', (req, res) => {
  res.json(classroomState);
});

// Gradebook Endpoints for durable Virtual Class Book persistence
app.get('/api/classroom/gradebook', (req, res) => {
  const courseKey = req.query.courseKey as string | undefined;
  if (courseKey) {
    const is1D = /1.*[dD]|1°.*D|1.*medio.*d/i.test(courseKey);
    const filtered = gradebookRecords.filter((r) =>
      r.courseKey === courseKey || (is1D && r.courseKey.toLowerCase().includes('1_medio_d'))
    );
    return res.json({ success: true, records: filtered });
  }
  return res.json({ success: true, records: gradebookRecords });
});

app.post('/api/classroom/gradebook', (req, res) => {
  try {
    const { record, records } = req.body;
    if (record && record.id) {
      const existingIdx = gradebookRecords.findIndex((r) => r.id === record.id);
      if (existingIdx >= 0) {
        gradebookRecords[existingIdx] = record;
      } else {
        gradebookRecords.unshift(record);
      }
    } else if (Array.isArray(records)) {
      gradebookRecords = records;
    }
    persistGradebookToDisk();
    return res.json({ success: true, count: gradebookRecords.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error saving gradebook' });
  }
});

app.delete('/api/classroom/gradebook/:id', (req, res) => {
  const id = req.params.id;
  gradebookRecords = gradebookRecords.filter((r) => r.id !== id);
  persistGradebookToDisk();
  return res.json({ success: true, remaining: gradebookRecords.length });
});

// Purge / Cleanup Endpoint for Gradebook Records with Safety Backup
app.post('/api/classroom/gradebook/purge', (req, res) => {
  try {
    const { adminPasscode, purgeType, courseKey } = req.body;
    const cleanCode = (adminPasscode || '').trim().toLowerCase();
    if (cleanCode !== 'jorge19931d') {
      return res.status(403).json({ error: 'Contraseña maestra de seguridad incorrecta.' });
    }

    // 1. Create safety backup on disk before purging
    const backupPath = path.join(process.cwd(), `.gradebook_records_backup_${Date.now()}.json`);
    try {
      fs.writeFileSync(backupPath, JSON.stringify(gradebookRecords, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not write purge backup:', e);
    }

    const initialCount = gradebookRecords.length;

    if (purgeType === 'older_than_30_days') {
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      gradebookRecords = gradebookRecords.filter((r) => (r.timestamp || 0) >= thirtyDaysAgo);
    } else if (purgeType === 'course' && courseKey) {
      gradebookRecords = gradebookRecords.filter((r) => r.courseKey !== courseKey);
    } else if (purgeType === 'all') {
      gradebookRecords = [];
    }

    persistGradebookToDisk();
    return res.json({
      success: true,
      purgedCount: initialCount - gradebookRecords.length,
      remainingCount: gradebookRecords.length,
    });
  } catch (err: any) {
    console.error('Error in gradebook purge:', err);
    return res.status(500).json({ error: err.message || 'Error al ejecutar limpieza de datos' });
  }
});

// Send Report Email Endpoint (Manual trigger or resend)
app.post('/api/classroom/send-report', async (req, res) => {
  try {
    const { email, recordId, pin } = req.body;
    const targetEmail = (email || process.env.TEACHER_REPORT_EMAIL || 'jtorrejon93@gmail.com').trim();

    let record = null;
    if (recordId) {
      record = gradebookRecords.find((r) => r.id === recordId);
    }
    if (!record && pin) {
      record = gradebookRecords.find((r) => r.pin === pin || (r.id && r.id.includes(pin)));
    }
    if (!record && gradebookRecords.length > 0) {
      record = gradebookRecords[0];
    }

    if (!record) {
      // Create snapshot from current classroom students if available
      const created = archiveAllActiveStudentsToGradebook({ finalize: true });
      if (created && created.length > 0) {
        record = created[0];
      }
    }

    if (!record) {
      return res.status(404).json({ error: 'No se encontraron registros de evaluación para emitir el reporte.' });
    }

    const result = saveGradebookReportSnapshot(record);
    return res.json({ success: true, ...result, recordId: record.id });
  } catch (err: any) {
    console.error('Error generating report:', err);
    return res.status(500).json({ error: err.message || 'Error al generar reporte' });
  }
});

// Preview HTML Email Report
app.get('/api/classroom/report/preview', (req, res) => {
  const recordId = req.query.recordId as string;
  let record = null;
  if (recordId) {
    record = gradebookRecords.find((r) => r.id === recordId);
  }
  if (!record && gradebookRecords.length > 0) {
    record = gradebookRecords[0];
  }
  if (!record) {
    return res.status(404).send('No se han generado reportes de evaluación aún.');
  }

  const html = generateExecutiveGradebookReportHtml(record);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// Download HTML Report
app.get('/api/classroom/report/download', (req, res) => {
  const recordId = req.query.recordId as string;
  let record = null;
  if (recordId) {
    record = gradebookRecords.find((r) => r.id === recordId);
  }
  if (!record && gradebookRecords.length > 0) {
    record = gradebookRecords[0];
  }
  if (!record) {
    return res.status(404).send('No hay reporte disponible.');
  }

  const html = generateExecutiveGradebookReportHtml(record);
  const safeFilename = `Acta_Evaluacion_${record.courseKey || 'Curso'}_${record.pin || 'Sala'}.html`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
  res.send(html);
});

// SSE Streaming endpoint for instant real-time sync across all devices
app.get('/api/classroom/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial state immediately
  res.write(`data: ${JSON.stringify({ type: 'STATE_UPDATE', state: classroomState })}\n\n`);

  sseClients.add(res);

  // Heartbeat to keep connection alive
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch (e) {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

// Action dispatcher (supports single and queued batch actions)
app.post('/api/classroom/action', (req, res) => {
  try {
    let actionList: Array<{ action: string; payload: any }> = [];
    if (Array.isArray(req.body)) {
      actionList = req.body;
    } else if (req.body && Array.isArray(req.body.actions)) {
      actionList = req.body.actions;
    } else if (req.body && req.body.action) {
      actionList = [{ action: req.body.action, payload: req.body.payload }];
    }

    if (actionList.length === 0) {
      return res.status(400).json({ error: 'Action or actions array is required' });
    }

    for (const item of actionList) {
      const action = item.action;
      const payload = item.payload;
      if (!action) continue;

      switch (action) {
      case 'update_session': {
        classroomState.session = {
          ...classroomState.session,
          ...payload,
          updatedAt: Date.now(),
        };
        if (payload && payload.status === 'finished') {
          archiveAllActiveStudentsToGradebook({ finalize: true });
        }
        break;
      }

      case 'set_lobby_status': {
        const lobbyStatus = payload.lobbyStatus;
        classroomState.session.lobbyStatus = lobbyStatus;
        classroomState.session.updatedAt = Date.now();
        if (lobbyStatus === 'finished') {
          classroomState.session.status = 'finished';
          archiveAllActiveStudentsToGradebook({ finalize: true });
        }
        addFeedEvent(
          'Docente',
          'info',
          lobbyStatus === 'waiting'
            ? 'Sala de Espera habilitada. Los estudiantes pueden ingresar a la sala.'
            : lobbyStatus === 'in_game'
            ? '🚀 ¡Evaluación iniciada! Los estudiantes han ingresado a los ejercicios.'
            : 'Evaluación finalizada. Reporte oficial generado y disponible en PDF.'
        );
        break;
      }

      case 'start_new_room': {
        // ALWAYS archive current room students permanently before creating new room!
        archiveAllActiveStudentsToGradebook({ finalize: true });

        const newPin = (payload.pin || `MAT-${Math.floor(100 + Math.random() * 900)}`).trim().toUpperCase();
        classroomState.session = {
          ...classroomState.session,
          pin: newPin,
          activeQuestion: 0,
          showAnswers: false,
          status: 'active',
          lobbyStatus: 'waiting',
          updatedAt: Date.now(),
          kickedStudents: {},
        };
        classroomState.students = {};
        classroomState.feed = {};
        addFeedEvent('Docente', 'quiz_reset', `Nueva Sala creada con PIN ${newPin}. Estado: Sala de Espera Activa. Datos archivados en Libro Virtual.`);
        break;
      }

      case 'reset_active_round': {
        if (payload?.archiveToHistory !== false) {
          archiveAllActiveStudentsToGradebook({ finalize: false });
        }

        const resetStudents: Record<string, any> = {};
        Object.entries(classroomState.students).forEach(([id, s]) => {
          resetStudents[id] = {
            ...s,
            currentQ: 0,
            correct: 0,
            errors: 0,
            tabEscapes: 0,
            isOutOfTab: false,
            outOfTabTimestamp: null,
            totalSecondsAway: 0,
            copyAttempts: 0,
            lastAction: 'Ronda reiniciada por docente',
            answers: {},
          };
        });

        classroomState.session = {
          ...classroomState.session,
          activeQuestion: 0,
          showAnswers: false,
          status: 'active',
          lobbyStatus: 'in_game',
          updatedAt: Date.now(),
          kickedStudents: {},
        };
        classroomState.students = resetStudents;
        addFeedEvent('Docente', 'quiz_reset', 'Ronda de preguntas reiniciada.');
        break;
      }

      case 'set_curriculum': {
        const { curriculum, questions, pin } = payload;
        const currentPin = pin || classroomState.session.pin;
        classroomState.session = {
          ...classroomState.session,
          pin: currentPin,
          quizData: questions || [],
          activeQuestion: 0,
          showAnswers: false,
          title: curriculum?.axisName ? `${curriculum.axisName} (${(curriculum.oasSelected || []).join(', ')})` : classroomState.session.title,
          gradeLevel: curriculum?.grade || classroomState.session.gradeLevel,
          curriculum: curriculum,
          status: 'active',
          updatedAt: Date.now(),
        };
        // Reset students for new curriculum
        const resetStudents: Record<string, any> = {};
        Object.entries(classroomState.students).forEach(([id, s]) => {
          resetStudents[id] = {
            ...s,
            currentQ: 0,
            correct: 0,
            errors: 0,
            tabEscapes: 0,
            answers: {},
            lastAction: `Currículum asignado: ${curriculum?.grade || ''}`,
          };
        });
        classroomState.students = resetStudents;
        addFeedEvent(
          'Docente',
          'quiz_reset',
          `Currículum activado: ${curriculum?.grade || ''} > ${curriculum?.axisName || ''} (${(questions || []).length} preguntas)`
        );
        break;
      }

      case 'register_participant': {
        const participant = payload;
        if (participant && participant.id) {
          if (classroomState.session.kickedStudents && classroomState.session.kickedStudents[participant.id]) {
            delete classroomState.session.kickedStudents[participant.id];
          }
          const existing = classroomState.students[participant.id] || {};
          const isSecurityLocked = Boolean(existing.isSecurityLocked || participant.isSecurityLocked);
          const isOutOfTab = Boolean(existing.isOutOfTab || participant.isOutOfTab);
          const securityLockReason = isSecurityLocked
            ? (existing.securityLockReason || participant.securityLockReason || 'Salida de pestaña o minimización detectada')
            : null;
          const securityLockTimestamp = isSecurityLocked
            ? (existing.securityLockTimestamp || participant.securityLockTimestamp || Date.now())
            : null;

          classroomState.students[participant.id] = {
            ...existing,
            ...participant,
            isSecurityLocked,
            isOutOfTab,
            securityLockReason,
            securityLockTimestamp,
            connected: true,
            lastActive: Date.now(),
            currentQ: existing.currentQ ?? 0,
            correct: existing.correct ?? 0,
            errors: existing.errors ?? 0,
            tabEscapes: existing.tabEscapes ?? 0,
            answers: existing.answers || {},
            notebookPhotos: existing.notebookPhotos || {},
          };
          addFeedEvent(
            participant.name || 'Estudiante',
            'join',
            `${participant.name} (${participant.course || 'Curso'}) se ha conectado a la sala.`
          );
        }
        break;
      }

      case 'submit_answer': {
        const { studentId, questionIndex, optionIndex, isCorrect } = payload;
        const student = classroomState.students[studentId];
        if (student) {
          const answers = { ...(student.answers || {}) };
          const previousAnswer = answers[questionIndex];

          answers[questionIndex] = {
            selected: optionIndex,
            option: optionIndex,
            isCorrect,
            timestamp: Date.now(),
          };

          let correct = student.correct || 0;
          let errors = student.errors || 0;

          if (!previousAnswer) {
            if (isCorrect) correct += 1;
            else errors += 1;
          } else if (previousAnswer.isCorrect !== isCorrect) {
            if (isCorrect) {
              correct += 1;
              errors = Math.max(0, errors - 1);
            } else {
              errors += 1;
              correct = Math.max(0, correct - 1);
            }
          }

          classroomState.students[studentId] = {
            ...student,
            answers,
            correct,
            errors,
            currentQ: questionIndex + 1,
            lastActive: Date.now(),
            lastAction: isCorrect ? 'Respuesta Correcta ✓' : 'Respuesta Incorrecta ✗',
          };

          // Auto-persist immediately into Libro Virtual / Gradebook cache
          autoUpdateGradebookFromStudent(classroomState.students[studentId]);

          addFeedEvent(
            student.name || 'Estudiante',
            isCorrect ? 'correct' : 'error',
            isCorrect
              ? `¡Respuesta correcta en Desafío ${questionIndex + 1}!`
              : `Respuesta incorrecta en Desafío ${questionIndex + 1}.`
          );
        }
        break;
      }

      case 'upload_notebook_photo': {
        const { studentId, questionIndex, photoBase64, exerciseTitle } = payload;
        const student = classroomState.students[studentId];
        if (student) {
          // Cache photo separately to avoid bloating the SSE stream
          const photoKey = `${studentId}_${questionIndex}`;
          notebookPhotoCache.set(photoKey, photoBase64);

          const notebookPhotos = { ...(student.notebookPhotos || {}) };
          notebookPhotos[questionIndex] = {
            exerciseId: questionIndex,
            exerciseTitle: exerciseTitle || `Desafío ${questionIndex + 1}`,
            photoUrl: `/api/classroom/photo/${studentId}/${questionIndex}`,
            timestamp: Date.now(),
            studentName: student.name,
          };

          classroomState.students[studentId] = {
            ...student,
            notebookPhotos,
            lastActive: Date.now(),
            lastAction: `📸 Cuaderno enviado (${exerciseTitle || `D${questionIndex + 1}`})`,
          };

          addFeedEvent(
            student.name || 'Estudiante',
            'notebook_photo',
            `📸 Foto de cuaderno enviada para ${exerciseTitle || `Desafío ${questionIndex + 1}`}.`
          );
        }
        break;
      }

      case 'record_security_alert': {
        const { studentId, alertType, detail } = payload;
        const student = classroomState.students[studentId];
        if (student) {
          const splitScreenAttempts = (student.splitScreenAttempts || 0) + (alertType === 'split_screen' ? 1 : 0);
          const tabAttempts = (student.tabAttempts || 0) + (alertType === 'tab_attempt' ? 1 : 0);
          const copyAttempts = (student.copyAttempts || 0) + (alertType === 'copy_attempt' || alertType === 'right_click' ? 1 : 0);
          const screenshotAttempts = ((student as any).screenshotAttempts || 0) + (alertType === 'screenshot_attempt' || alertType === 'print_attempt' ? 1 : 0);
          const devtoolsAttempts = ((student as any).devtoolsAttempts || 0) + (alertType === 'devtools_open' ? 1 : 0);
          const secondMonitorAttempts = ((student as any).secondMonitorAttempts || 0) + (alertType === 'second_monitor' ? 1 : 0);
          const isSplitScreen = alertType === 'split_screen';

          classroomState.students[studentId] = {
            ...student,
            splitScreenAttempts,
            tabAttempts,
            copyAttempts,
            screenshotAttempts,
            devtoolsAttempts,
            secondMonitorAttempts,
            isSplitScreen,
            isSecurityLocked: true,
            securityLockReason: detail || alertType,
            securityLockTimestamp: Date.now(),
            securityViolationReason: detail || alertType,
            lastActive: Date.now(),
            lastAction: `🚨 ${detail || 'Incidencia de seguridad'}`,
          };

          addFeedEvent(
            student.name || 'Estudiante',
            'cheat_alert',
            `🚨 ${student.name}: ${detail || 'Incidencia de seguridad detectada.'}`
          );
        }
        break;
      }

      case 'heartbeat': {
        const { studentId, timestamp } = payload;
        const student = classroomState.students[studentId];
        if (student) {
          const now = timestamp || Date.now();
          classroomState.students[studentId] = {
            ...student,
            connected: true,
            lastActive: now,
            last_active: now,
            isDisconnectedSuspicious: false,
          };
        }
        break;
      }

      case 'unlock_student_security': {
        const { studentId } = payload;
        const student = classroomState.students[studentId];
        if (student) {
          classroomState.students[studentId] = {
            ...student,
            isSecurityLocked: false,
            isOutOfTab: false,
            securityLockReason: null,
            securityViolationReason: null,
            outOfTabTimestamp: null,
            lastActive: Date.now(),
            lastAction: 'Prueba desbloqueada por docente 🔓',
          };
          addFeedEvent(
            'Docente',
            'security_unlock',
            `🔓 El docente desbloqueó la evaluación de ${student.name}.`
          );
        }
        break;
      }

      case 'unlock_all_students': {
        Object.keys(classroomState.students || {}).forEach((stId) => {
          if (classroomState.students[stId]) {
            classroomState.students[stId] = {
              ...classroomState.students[stId],
              isSecurityLocked: false,
              isOutOfTab: false,
              securityLockReason: null,
              securityViolationReason: null,
              lastActive: Date.now(),
              lastAction: 'Desbloqueado por docente 🔓',
            };
          }
        });
        addFeedEvent(
          'Docente',
          'security_unlock',
          `🔓 El docente desbloqueó a todos los estudiantes bloqueados.`
        );
        break;
      }

      case 'focus_change': {
        const { studentId, isOutOfTab, outOfTabTimestamp, awaySecondsToAdd, reason } = payload;
        const student = classroomState.students[studentId];
        if (student) {
          const isAlreadyOutOfTab = Boolean(student.isOutOfTab);
          const isNewEscape = isOutOfTab && !isAlreadyOutOfTab;
          const tabEscapes = (student.tabEscapes || 0) + (isNewEscape ? 1 : 0);
          const totalSecondsAway = (student.totalSecondsAway || 0) + (awaySecondsToAdd || 0);
          const lockReason = reason || (isOutOfTab ? 'Salida de pestaña o minimización detectada (Page Visibility API)' : student.securityLockReason);

          classroomState.students[studentId] = {
            ...student,
            tabEscapes,
            isOutOfTab,
            isSecurityLocked: isOutOfTab ? true : student.isSecurityLocked,
            securityLockReason: isOutOfTab ? lockReason : student.securityLockReason,
            securityLockTimestamp: isOutOfTab ? Date.now() : student.securityLockTimestamp,
            outOfTabTimestamp: isOutOfTab ? (outOfTabTimestamp || Date.now()) : null,
            totalSecondsAway,
            lastActive: Date.now(),
            lastAction: isOutOfTab ? `🚨 ${lockReason}` : (student.isSecurityLocked ? '🔒 Bloqueado por seguridad' : 'Foco activo'),
          };

          if (isNewEscape) {
            addFeedEvent(
              student.name || 'Estudiante',
              'cheat_alert',
              `🚨 ${student.name}: ${lockReason} (#${tabEscapes}). Evaluación bloqueada.`
            );
          }
        }
        break;
      }

      case 'allow_student_reentry': {
        const { studentId } = payload;
        if (classroomState.session.kickedStudents && classroomState.session.kickedStudents[studentId]) {
          delete classroomState.session.kickedStudents[studentId];
        }
        addFeedEvent('Docente', 'info', `Se ha habilitado el reingreso para el estudiante.`);
        break;
      }

      case 'submit_consensus': {
        const { studentId, consensusText } = payload;
        const student = classroomState.students[studentId];
        if (student) {
          classroomState.students[studentId] = {
            ...student,
            consensus: consensusText,
            lastActive: Date.now(),
            lastAction: 'Consenso Grupal Registrado 📝',
          };
          addFeedEvent(
            student.name || 'Grupo',
            'consensus',
            `📝 Consenso grupal registrado por ${student.name}.`
          );
        }
        break;
      }

      case 'record_tab_escape': {
        const { studentId, secondsAway, isLeaving } = payload;
        const student = classroomState.students[studentId];
        if (student) {
          const tabEscapes = (student.tabEscapes || 0) + (isLeaving ? 1 : 0);
          const totalSecondsAway = (student.totalSecondsAway || 0) + (secondsAway || 0);

          classroomState.students[studentId] = {
            ...student,
            tabEscapes,
            isOutOfTab: isLeaving,
            outOfTabTimestamp: isLeaving ? Date.now() : null,
            totalSecondsAway,
            lastActive: Date.now(),
            lastAction: isLeaving ? '🚨 Salida de pestaña detectada' : 'Foco restablecido',
          };

          if (isLeaving) {
            addFeedEvent(
              student.name || 'Estudiante',
              'cheat_alert',
              `⚠️ ${student.name} cambió de pestaña o minimizó la ventana.`
            );
          }
        }
        break;
      }

      case 'kick_student': {
        const { studentId } = payload;
        const student = classroomState.students[studentId];
        if (student) {
          const studentName = student.name;
          delete classroomState.students[studentId];
          addFeedEvent('Docente', 'cheat_alert', `El estudiante ${studentName} fue retirado de la sala.`);
        }
        if (!classroomState.session.kickedStudents) {
          classroomState.session.kickedStudents = {};
        }
        classroomState.session.kickedStudents[studentId] = Date.now();
        break;
      }

      case 'kick_all_students': {
        const count = Object.keys(classroomState.students || {}).length;
        classroomState.students = {};
        classroomState.session.kickedStudents = {};
        classroomState.session.lastRoomCleanedAt = Date.now();
        classroomState.session.updatedAt = Date.now();
        addFeedEvent('Docente', 'cheat_alert', `🧹 Limpieza general de sala: Se expulsaron ${count} participantes para reingreso ordenado.`);
        break;
      }

      case 'update_student_email': {
        const { studentId, email } = payload;
        const student = classroomState.students[studentId];
        if (student) {
          classroomState.students[studentId] = {
            ...student,
            email: (email || '').trim(),
            lastActive: Date.now(),
          };
        }
        break;
      }

      case 'publish_quiz': {
        const { questions, title, gradeLevel } = payload;
        classroomState.session = {
          ...classroomState.session,
          quizData: questions || [],
          activeQuestion: 0,
          showAnswers: false,
          title: title || classroomState.session.title,
          gradeLevel: gradeLevel || classroomState.session.gradeLevel,
          status: 'active',
          updatedAt: Date.now(),
        };
        addFeedEvent('Docente', 'quiz_reset', `Nueva materia publicada: "${classroomState.session.title}"`);
        break;
      }

      case 'finalize_student_evaluation': {
        const studentData = payload;
        if (studentData && (studentData.studentId || studentData.id)) {
          const stId = studentData.studentId || studentData.id;
          const existing = classroomState.students[stId] || {};
          const mergedStudent = {
            ...existing,
            ...studentData,
            id: stId,
            isFinalized: true,
            finalizedAt: Date.now(),
            lastActive: Date.now(),
            lastAction: `✅ Evaluación entregada (Nota: ${studentData.grade || '---'})`,
          };
          classroomState.students[stId] = mergedStudent;

          // Auto-persist immediately to the permanent server Gradebook
          autoUpdateGradebookFromStudent(mergedStudent);

          addFeedEvent(
            mergedStudent.name || 'Estudiante',
            'info',
            `✅ ${mergedStudent.name} (${mergedStudent.course || '1°D'}) completó y entregó su evaluación. Nota: ${mergedStudent.grade || '---'}. Guardada en Libro Virtual.`
          );
        }
        break;
      }

      case 'archive_session_to_gradebook': {
        const archived = archiveAllActiveStudentsToGradebook({ finalize: false });
        addFeedEvent(
          'Docente',
          'info',
          `📚 Sesión archivada automáticamente en el Libro Virtual (${archived?.length || 0} actas guardadas en disco).`
        );
        break;
      }

      case 'finalize_evaluation':
      case 'finalize_evaluation_and_email_report': {
        classroomState.session.status = 'finished';
        classroomState.session.lobbyStatus = 'finished';
        classroomState.session.updatedAt = Date.now();
        const records = archiveAllActiveStudentsToGradebook({
          finalize: true,
        });
        addFeedEvent(
          'Docente',
          'info',
          `🏁 Evaluación finalizada. Notas oficiales archivadas en Libro de Clases (${records?.length || 0} cursos) y listas para descargar en PDF.`
        );
        break;
      }

      default:
        break;
      }
    }

    broadcastState();
    return res.json({ success: true, processed: actionList.length, state: classroomState });
  } catch (err: any) {
    console.error('API action error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: 3000 },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

// Background heartbeat watchdog: marks students as 'Disconnected - Suspicious' if heartbeat ceases for > 15s
setInterval(() => {
  const now = Date.now();
  let stateChanged = false;
  Object.keys(classroomState.students || {}).forEach((stId) => {
    const student = classroomState.students[stId];
    if (student && student.connected) {
      const last = student.last_active || student.lastActive || student.joinedAt || 0;
      if (now - last > 15000 && !student.isDisconnectedSuspicious) {
        student.isDisconnectedSuspicious = true;
        student.connected = false;
        student.lastAction = '⚠️ Desconectado - Sospechoso';
        stateChanged = true;
        addFeedEvent(
          student.name || 'Estudiante',
          'cheat_alert',
          `⚠️ ${student.name}: Sin señal de latido (Heartbeat > 15s). Estado: Desconectado - Sospechoso.`
        );
      }
    }
  });
  if (stateChanged) {
    broadcastState();
  }
}, 4000);

startServer();
