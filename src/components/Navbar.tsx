import React, { useState } from 'react';
import { ClassroomDatabaseState, SessionMode } from '../types';
import { realtimeDb } from '../lib/firebase';
import { audioAlert } from '../lib/audio';
import {
  GraduationCap,
  Smartphone,
  Trophy,
  Cloud,
  CloudOff,
  Server,
  AlertTriangle,
  Volume2,
  VolumeX,
  Sparkles,
  QrCode,
  Lock,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface NavbarProps {
  data?: ClassroomDatabaseState;
  onOpenFirebaseModal: () => void;
  onOpenContentModal: () => void;
  onOpenQRModal: () => void;
  onOpenRankingModal: () => void;
  onOpenGradebook?: () => void;
  onGoToStudentView: () => void;
  onLogoutTeacher: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  data,
  onOpenFirebaseModal,
  onOpenContentModal,
  onOpenQRModal,
  onOpenRankingModal,
  onOpenGradebook,
  onGoToStudentView,
  onLogoutTeacher,
}) => {
  const session = data?.session || {
    pin: '---',
    title: 'Evaluación de Matemáticas',
    mode: 'teacher_paced',
    activeQuestion: 0,
    quizData: [],
  };
  const students = data?.students || {};
  const isCloudConnected = realtimeDb.isConnectedToCloud();
  const studentCount = Object.keys(students || {}).length;
  const [isMuted, setIsMuted] = useState(audioAlert.getIsMuted());

  const toggleMute = () => {
    const next = !isMuted;
    audioAlert.setMuted(next);
    setIsMuted(next);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand & Room Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/20 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900 truncate">
                EduMath Pro • Panel Docente
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono text-[11px] font-bold">
                PIN: {session.pin}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              {session.title || 'Evaluación de Matemáticas'} ({studentCount} alumnos conectados)
            </p>
          </div>
        </div>

        {/* Right: Teacher Actions */}
        <div className="flex items-center gap-2">
          {/* Libro de Calificaciones button */}
          {onOpenGradebook && (
            <button
              id="nav-open-gradebook-btn"
              onClick={onOpenGradebook}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold shadow-xs transition"
              title="Abrir Libro Virtual de Calificaciones y Actas"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Libro de Clases</span>
              <span className="md:hidden">Libro</span>
            </button>
          )}

          {/* Ranking / Podium button */}
          <button
            id="nav-open-ranking-btn"
            onClick={onOpenRankingModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold shadow-sm transition"
            title="Ver Podio y Ranking en tiempo real"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden md:inline">🏆 Ranking</span>
          </button>

          {/* QR Code button */}
          <button
            id="nav-open-qr-btn"
            onClick={onOpenQRModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-100 transition"
            title="Proyectar Código QR para alumnos"
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">QR Alumnos</span>
          </button>

          {/* Cargar Materia button */}
          <button
            id="nav-open-content-btn"
            onClick={onOpenContentModal}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Cargar Nueva Materia (JSON o IA)"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </button>

          {/* Audio toggle */}
          <button
            id="nav-toggle-audio-btn"
            onClick={toggleMute}
            className={`p-2 rounded-xl border transition ${
              isMuted
                ? 'bg-slate-100 border-slate-200 text-slate-400'
                : 'bg-indigo-50 border-indigo-200 text-indigo-600'
            }`}
            title={isMuted ? 'Activar sonido de alertas' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Servidor y Conexión Status ($0 Gratis) */}
          <button
            id="nav-firebase-config-btn"
            onClick={onOpenFirebaseModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
              isCloudConnected
                ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
            }`}
            title={
              isCloudConnected
                ? 'Alerta: Firebase externo vinculado. Clic para desconectar y usar Servidor 100% Gratis.'
                : 'Servidor Autónomo Integrado (100% Gratuito - $0 Costo)'
            }
          >
            {isCloudConnected ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden lg:inline">Firebase Externo</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden lg:inline">Servidor $0 Gratis</span>
              </>
            )}
          </button>

          {/* Go to Student View preview */}
          <button
            id="nav-preview-student-btn"
            onClick={onGoToStudentView}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            title="Abrir vista de alumno"
          >
            <Smartphone className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden xl:inline">Vista Alumno</span>
          </button>

          {/* Logout Teacher Lock */}
          <button
            id="nav-logout-teacher-btn"
            onClick={onLogoutTeacher}
            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition"
            title="Bloquear y Cerrar Sesión Docente"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
