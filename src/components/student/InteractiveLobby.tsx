import React, { useState, useEffect, useRef } from 'react';
import { ClassroomDatabaseState, Student, ParticipantType } from '../../types';
import { realtimeDb } from '../../lib/firebase';
import {
  Gamepad2,
  Users,
  Sparkles,
  Play,
  RotateCcw,
  Zap,
  Target,
  Trophy,
  Mail,
  CheckCircle2,
  Lock,
  Smartphone,
  ChevronRight,
  HelpCircle,
  Clock,
  Volume2,
  VolumeX,
  LogOut,
} from 'lucide-react';

interface InteractiveLobbyProps {
  data: ClassroomDatabaseState;
  participantId: string;
  onStartRequest?: () => void;
  onLeave?: () => void;
}

type MiniGameTab = 'snake' | 'pinball' | 'trivia';

export const InteractiveLobby: React.FC<InteractiveLobbyProps> = ({
  data,
  participantId,
  onLeave,
}) => {
  const { session, students } = data;
  const currentParticipant = participantId ? students[participantId] : undefined;

  const [activeGame, setActiveGame] = useState<MiniGameTab>('snake');
  const [emailInput, setEmailInput] = useState<string>(currentParticipant?.email || '');
  const [emailSaved, setEmailSaved] = useState<boolean>(!!currentParticipant?.email);

  // Participant list calculation
  const studentList: Student[] = Object.values(students || {}) as Student[];
  const totalCount = studentList.length;

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantId || !emailInput.trim()) return;
    realtimeDb.updateStudentEmail(participantId, emailInput.trim());
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-3 sm:p-5 select-none relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Waiting Room Bar */}
      <header className="max-w-4xl w-full mx-auto bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-3xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-lg shadow-indigo-600/30 shrink-0 animate-pulse">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                SALA DE ESPERA ACTIVA
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">PIN: {session.pin}</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white mt-0.5">
              Esperando que el profesor inicie la evaluación...
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-700">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-2xl border border-slate-700">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">
              {totalCount} {totalCount === 1 ? 'estudiante' : 'estudiantes'} en sala
            </span>
          </div>

          {onLeave && (
            <button
              type="button"
              id="lobby-leave-header-btn"
              onClick={onLeave}
              title="Salir de la sesión en este dispositivo"
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-bold px-3.5 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Waiting Room Body */}
      <main className="max-w-4xl w-full mx-auto my-3 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 z-10">
        {/* Left Column: Interactive Mini-Games Zone */}
        <section className="lg:col-span-2 bg-slate-800/80 border border-slate-700 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold text-white">Zona de Práctica y Calentamiento</h2>
              </div>

              {/* Game Mode Tabs */}
              <div className="flex bg-slate-900 p-1 rounded-xl gap-1 text-xs font-bold">
                <button
                  onClick={() => setActiveGame('snake')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeGame === 'snake'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🐍 Snake k
                </button>
                <button
                  onClick={() => setActiveGame('pinball')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeGame === 'pinball'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Rebote Óptico
                </button>
                <button
                  onClick={() => setActiveGame('trivia')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeGame === 'trivia'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🧠 Mini Trivia
                </button>
              </div>
            </div>

            {/* Active Game Canvas / UI */}
            <div className="my-3">
              {activeGame === 'snake' && <SnakeMathGame />}
              {activeGame === 'pinball' && <HomothecyPongGame />}
              {activeGame === 'trivia' && <RapidTriviaGame />}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Entrena tus reflejos y conceptos geométricos mientras tus compañeros se conectan</span>
          </p>
        </section>

        {/* Right Column: Connected Students & Email Delivery Box */}
        <aside className="space-y-4 flex flex-col">
          {/* Email Subscription for PDF Delivery */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-300">
              <Mail className="w-4 h-4 text-sky-400" />
              <span>Recibir Reporte PDF por Correo</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Ingresa tu correo para recibir tu nota y el desarrollo paso a paso al finalizar la evaluación.
            </p>

            <form onSubmit={handleSaveEmail} className="space-y-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="alumno@donboscoantofagasta.cl"
                required
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-sky-500 outline-none transition"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md shadow-sky-600/20"
              >
                {emailSaved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>✓ Correo Guardado</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5" />
                    <span>Guardar Correo para PDF</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Connected Classmates Grid (Up to 45+) */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-4 shadow-xl flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white">Compañeros en Sala ({totalCount})</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="flex-1 max-h-56 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {studentList.map((s, idx) => {
                const isMe = s.id === participantId;
                const isTeam = s.type === 'group';
                return (
                  <div
                    key={s.id || idx}
                    className={`p-2 rounded-xl flex items-center justify-between gap-2 transition ${
                      isMe
                        ? 'bg-indigo-900/50 border border-indigo-500/50 text-indigo-200'
                        : 'bg-slate-900/60 border border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          isTeam ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
                        }`}
                      >
                        {isTeam ? '👥' : '👤'}
                      </div>
                      <span className="font-semibold truncate text-[11px]">
                        {s.name} {isMe && '(Tú)'}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {isTeam ? `${s.members?.length || 2} alumnos` : 'Listo'}
                    </span>
                  </div>
                );
              })}

              {totalCount === 0 && (
                <p className="text-slate-500 text-center py-6 text-xs italic">
                  Conectando a la sala de clases...
                </p>
              )}
            </div>
          </div>
        </aside>
      </main>

      {/* Waiting Indicator Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center text-xs text-slate-400 py-1">
        <span className="animate-pulse">🟢 Enlace con proyector en vivo activo</span> • Colegio Técnico Industrial Don Bosco
      </footer>
    </div>
  );
};

// =========================================================================
// MINI-GAME 1: SNAKE HOMOTECIA (Factores k)
// =========================================================================
function SnakeMathGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [targetFactor, setTargetFactor] = useState(3);
  const [currentChallenge, setCurrentChallenge] = useState('Come factor k = 3 (Amplía)');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snakeRef = useRef<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const dirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const foodRef = useRef<{ x: number; y: number; val: number }>({ x: 15, y: 10, val: 3 });
  const speedRef = useRef(110);

  const resetGame = () => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    dirRef.current = { x: 1, y: 0 };
    setScore(0);
    setIsGameOver(false);
    spawnFood();
  };

  const spawnFood = () => {
    const factors = [2, 3, 4, 5, 0.5];
    const picked = factors[Math.floor(Math.random() * factors.length)];
    setTargetFactor(picked);
    setCurrentChallenge(
      picked < 1
        ? `Come factor k = ${picked} (Reducción)`
        : `Come factor k = ${picked} (Ampliación)`
    );

    foodRef.current = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 15),
      val: picked,
    };
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code) && dirRef.current.y === 0) {
        dirRef.current = { x: 0, y: -1 };
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && dirRef.current.y === 0) {
        dirRef.current = { x: 0, y: 1 };
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && dirRef.current.x === 0) {
        dirRef.current = { x: -1, y: 0 };
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && dirRef.current.x === 0) {
        dirRef.current = { x: 1, y: 0 };
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = 16;
    let animationFrameId: number;
    let lastTick = Date.now();

    const loop = () => {
      const now = Date.now();
      if (now - lastTick > speedRef.current && !isGameOver) {
        lastTick = now;

        // Move head
        const head = { ...snakeRef.current[0] };
        head.x += dirRef.current.x;
        head.y += dirRef.current.y;

        // Wrap around borders
        if (head.x < 0) head.x = 24;
        if (head.x >= 25) head.x = 0;
        if (head.y < 0) head.y = 15;
        if (head.y >= 16) head.y = 0;

        // Self collision check
        if (snakeRef.current.some((seg) => seg.x === head.x && seg.y === head.y)) {
          setIsGameOver(true);
        } else {
          snakeRef.current.unshift(head);

          // Food check
          if (
            Math.abs(head.x - foodRef.current.x) <= 1 &&
            Math.abs(head.y - foodRef.current.y) <= 1
          ) {
            setScore((prev) => {
              const newScore = prev + 10;
              setHighScore((h) => Math.max(h, newScore));
              return newScore;
            });
            spawnFood();
          } else {
            snakeRef.current.pop();
          }
        }
      }

      // Render
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid dots
      ctx.fillStyle = '#1e293b';
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.fillRect(x + 7, y + 7, 2, 2);
        }
      }

      // Draw Food
      const fx = foodRef.current.x * gridSize;
      const fy = foodRef.current.y * gridSize;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(fx + gridSize / 2, fy + gridSize / 2, gridSize / 2 - 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`k=${foodRef.current.val}`, fx + gridSize / 2, fy + gridSize / 2 + 3);

      // Draw Snake
      snakeRef.current.forEach((seg, idx) => {
        ctx.fillStyle = idx === 0 ? '#10b981' : '#34d399';
        ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2);
      });

      if (!isGameOver) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isGameOver]);

  return (
    <div className="flex flex-col items-center">
      {/* Game Bar */}
      <div className="w-full flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-2xl border border-slate-700 text-xs mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-400">🎯 {currentChallenge}</span>
        </div>
        <div className="flex items-center gap-3 font-mono font-bold">
          <span className="text-emerald-400">Pts: {score}</span>
          <span className="text-slate-400">Récord: {highScore}</span>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-inner">
        <canvas ref={canvasRef} width={400} height={240} className="w-full max-w-sm block bg-slate-950" />

        {isGameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
            <Trophy className="w-8 h-8 text-amber-400 mb-1" />
            <h4 className="text-base font-black text-white">¡Fin de la Práctica!</h4>
            <p className="text-xs text-slate-300 mb-3">Puntaje logrado: {score} pts</p>
            <button
              onClick={resetGame}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Jugar de Nuevo</span>
            </button>
          </div>
        )}
      </div>

      {/* On-screen Direction Arrows for Mobile */}
      <div className="flex items-center gap-2 mt-3 sm:hidden">
        <button
          onClick={() => {
            if (dirRef.current.x === 0) dirRef.current = { x: -1, y: 0 };
          }}
          className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
        >
          ◀
        </button>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              if (dirRef.current.y === 0) dirRef.current = { x: 0, y: -1 };
            }}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
          >
            ▲
          </button>
          <button
            onClick={() => {
              if (dirRef.current.y === 0) dirRef.current = { x: 0, y: 1 };
            }}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
          >
            ▼
          </button>
        </div>
        <button
          onClick={() => {
            if (dirRef.current.x === 0) dirRef.current = { x: 1, y: 0 };
          }}
          className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// MINI-GAME 2: HOMOTHECY OPTIC PONG / PINBALL
// =========================================================================
function HomothecyPongGame() {
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const paddleXRef = useRef(150);
  const ballRef = useRef<{ x: number; y: number; dx: number; dy: number }>({
    x: 200,
    y: 100,
    dx: 3,
    dy: -3,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      paddleXRef.current = Math.max(30, Math.min(canvas.width - 30, relativeX));
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches[0]) {
        const relativeX = e.touches[0].clientX - rect.left;
        paddleXRef.current = Math.max(30, Math.min(canvas.width - 30, relativeX));
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    const loop = () => {
      const b = ballRef.current;
      b.x += b.dx;
      b.y += b.dy;

      // Bounce left/right
      if (b.x < 10 || b.x > canvas.width - 10) b.dx = -b.dx;
      // Bounce top
      if (b.y < 10) b.dy = -b.dy;

      // Bounce paddle
      if (b.y >= canvas.height - 25 && b.y <= canvas.height - 10) {
        if (Math.abs(b.x - paddleXRef.current) < 45) {
          b.dy = -Math.abs(b.dy);
          setScore((s) => s + 5);
        }
      }

      // Reset on bottom out
      if (b.y > canvas.height) {
        b.x = canvas.width / 2;
        b.y = 80;
        b.dy = -3;
      }

      // Render
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Light beam ray lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 20);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Top Center O Light
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 20, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Centro O', canvas.width / 2, 12);

      // Ball
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Paddle (Mirror Reflector)
      ctx.fillStyle = '#10b981';
      ctx.fillRect(paddleXRef.current - 40, canvas.height - 18, 80, 8);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-xs mb-2">
        <span className="text-sky-400 font-bold">⚡ Rebota el rayo óptico con el espejo inferior</span>
        <span className="font-mono text-emerald-400 font-bold">Rebotes: {score}</span>
      </div>
      <canvas ref={canvasRef} width={400} height={220} className="w-full max-w-sm rounded-2xl bg-slate-950 border border-slate-700" />
    </div>
  );
}

// =========================================================================
// MINI-GAME 3: RAPID FLASH TRIVIA
// =========================================================================
const TRIVIA_QUESTIONS = [
  {
    q: 'Si k = 4, ¿cuántas veces aumenta el área de la figura?',
    opts: ['4 veces', '8 veces', '16 veces (4²)', '2 veces'],
    c: 2,
    exp: 'El área varía con k² = 4² = 16.',
  },
  {
    q: 'Si k = -1, ¿qué transformación isométrica ocurre?',
    opts: ['Rotación de 180° (Simetría Central)', 'Traslación', 'Reflexión axial', 'Ampliación'],
    c: 0,
    exp: 'k = -1 equivale a una rotación de 180° respecto a O.',
  },
  {
    q: 'En una homotecia, ¿qué ocurre con los ángulos interiores?',
    opts: ['Se multiplican por k', 'Se conservan idénticos', 'Se dividen por k', 'Cambian a 90°'],
    c: 1,
    exp: 'La homotecia conserva la medida exacta de todos los ángulos.',
  },
  {
    q: 'Si OA = 3 cm y OA\' = 12 cm, ¿cuál es el factor k?',
    opts: ['k = 4 (12/3)', 'k = 9', 'k = 36', 'k = 0.25'],
    c: 0,
    exp: 'k = OA\' / OA = 12 / 3 = 4.',
  },
];

function RapidTriviaGame() {
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const currentQ = TRIVIA_QUESTIONS[qIdx];

  const handlePick = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === currentQ.c) {
      setScore((s) => s + 10);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setQIdx((prev) => (prev + 1) % TRIVIA_QUESTIONS.length);
  };

  return (
    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-700 space-y-3 max-w-sm mx-auto">
      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
        <span className="text-slate-400 font-mono">Trivia Flash ({qIdx + 1}/{TRIVIA_QUESTIONS.length})</span>
        <span className="font-mono text-emerald-400 font-bold">Aciertos: {score} pts</span>
      </div>

      <p className="text-xs font-bold text-white leading-snug">{currentQ.q}</p>

      <div className="grid grid-cols-1 gap-2">
        {currentQ.opts.map((opt, idx) => {
          let btnClass = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800';
          if (selectedOpt !== null) {
            if (idx === currentQ.c) {
              btnClass = 'bg-emerald-950 border-emerald-500 text-emerald-300';
            } else if (idx === selectedOpt) {
              btnClass = 'bg-rose-950 border-rose-500 text-rose-300';
            } else {
              btnClass = 'bg-slate-900 border-slate-800 text-slate-500 opacity-50';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handlePick(idx)}
              disabled={selectedOpt !== null}
              className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${btnClass}`}
            >
              <span>{opt}</span>
              {selectedOpt !== null && idx === currentQ.c && <span>✓</span>}
            </button>
          );
        })}
      </div>

      {selectedOpt !== null && (
        <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
          <span className="text-[11px] text-slate-400 italic">{currentQ.exp}</span>
          <button
            onClick={handleNext}
            className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold shrink-0 ml-2"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
