import React, { useState } from 'react';
import { Student, NotebookPhoto } from '../../types';
import { realtimeDb } from '../../lib/firebase';
import {
  X,
  Camera,
  ZoomIn,
  ZoomOut,
  RotateCw,
  CheckCircle2,
  Star,
  AlertTriangle,
  Users,
  User,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Eye,
  Award,
  Sparkles,
} from 'lucide-react';

interface NotebookViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Record<string, Student>;
  initialStudentId?: string | null;
  initialExerciseId?: string | number | null;
}

export const NotebookViewerModal: React.FC<NotebookViewerModalProps> = ({
  isOpen,
  onClose,
  students,
  initialStudentId,
  initialExerciseId,
}) => {
  const studentList: Student[] = Object.values(students || {}) as Student[];
  
  // Filter participants who have at least 1 photo, or all participants
  const participantsWithPhotos = studentList.filter(
    (s) => s.notebookPhotos && Object.keys(s.notebookPhotos).length > 0
  );

  const displayList = participantsWithPhotos.length > 0 ? participantsWithPhotos : studentList;

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || (displayList[0]?.id || '')
  );

  const [selectedExerciseKey, setSelectedExerciseKey] = useState<string | number>(
    initialExerciseId !== null && initialExerciseId !== undefined ? initialExerciseId : 0
  );

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState<string>('');

  if (!isOpen) return null;

  const currentStudent = students[selectedStudentId] || displayList[0];
  const photos = currentStudent?.notebookPhotos || {};
  const currentPhoto: NotebookPhoto | undefined = photos[selectedExerciseKey] || Object.values(photos)[0];

  const handleSelectStudent = (stId: string) => {
    setSelectedStudentId(stId);
    setZoomLevel(1);
    setRotation(0);
    const stPhotos = students[stId]?.notebookPhotos || {};
    const photoKeys = Object.keys(stPhotos);
    if (photoKeys.length > 0 && !stPhotos[selectedExerciseKey]) {
      setSelectedExerciseKey(photoKeys[0]);
    }
  };

  const handleGrade = (status: 'approved' | 'starred' | 'needs_review') => {
    if (!currentStudent?.id || currentPhoto === undefined) return;
    realtimeDb.gradeNotebookPhoto(
      currentStudent.id,
      currentPhoto.exerciseId,
      status,
      feedbackComment
    );
    setFeedbackComment('');
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.3, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.3, 0.7));
  };

  const isGroup = currentStudent?.type === 'group';
  const totalPhotosInClass = studentList.reduce(
    (acc, s) => acc + Object.keys(s.notebookPhotos || {}).length,
    0
  );

  return (
    <div
      id="notebook-viewer-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">
                  Inspección de Cuaderno de Evidencias en Vivo
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                  {totalPhotosInClass} fotos recibidas
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Revisión proyectada de cálculos manuscritos, bocetos isométricos y teoremas (OA 11 y OA 12).
              </p>
            </div>
          </div>

          <button
            id="close-notebook-modal-btn"
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Sidebar: Participant list */}
          <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0 overflow-hidden">
            <div className="p-3 border-b border-slate-200 bg-white">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Alumnos / Equipos ({displayList.length})
              </span>
              <span className="text-[11px] text-slate-400">
                Selecciona para inspeccionar sus capturas
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {displayList.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Aún no hay participantes conectados.
                </div>
              ) : (
                displayList.map((st) => {
                  const isStGroup = st.type === 'group';
                  const stPhotos = st.notebookPhotos || {};
                  const photoCount = Object.keys(stPhotos).length;
                  const isSelected = st.id === currentStudent?.id;

                  return (
                    <button
                      key={st.id}
                      onClick={() => st.id && handleSelectStudent(st.id)}
                      className={`w-full p-2.5 rounded-2xl text-left border transition flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : isStGroup
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          {isStGroup ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        </div>
                        <div className="truncate">
                          <h5 className="text-xs font-bold truncate">{st.name}</h5>
                          <span
                            className={`text-[10px] block truncate ${
                              isSelected ? 'text-indigo-200' : 'text-slate-400'
                            }`}
                          >
                            {isStGroup
                              ? `${st.members?.length || 2} integrantes`
                              : `Puntaje: ${st.score || 0} pts`}
                          </span>
                        </div>
                      </div>

                      {/* Photo Badge */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 font-mono ${
                          photoCount > 0
                            ? isSelected
                              ? 'bg-emerald-400 text-slate-900'
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : isSelected
                            ? 'bg-white/10 text-white/70'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        📸 {photoCount}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Main Stage: Photo Canvas & Controls */}
          <div className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
            {/* Top Toolbar: Exercise Switcher & Zoom */}
            <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              {/* Exercise Selector Tabs (Desafíos 1 a 5) */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {[0, 1, 2, 3, 4].map((idx) => {
                  const hasThisPhoto = !!photos[idx] || !!photos[`geo3d-d${idx + 1}`];
                  const isCurTab =
                    String(selectedExerciseKey) === String(idx) ||
                    String(selectedExerciseKey) === `geo3d-d${idx + 1}`;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedExerciseKey(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                        isCurTab
                          ? 'bg-slate-900 text-white shadow-sm'
                          : hasThisPhoto
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <span>Desafío {idx + 1}</span>
                      {hasThisPhoto && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Zoom and Rotate Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                <button
                  onClick={handleZoomOut}
                  title="Alejar (-)"
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-slate-700 px-1">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  title="Acercar (+)"
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-300 mx-1" />
                <button
                  onClick={handleRotate}
                  title="Rotar 90°"
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition flex items-center gap-1 text-xs font-bold"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>{rotation}°</span>
                </button>
              </div>
            </div>

            {/* Photo Canvas Stage */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-4 relative bg-slate-950/90 select-none">
              {currentPhoto ? (
                <div
                  className="transition-transform duration-200 flex flex-col items-center justify-center"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                  }}
                >
                  <img
                    src={currentPhoto.photoUrl}
                    alt="Evidencia Cuaderno"
                    className="max-h-[60vh] max-w-full rounded-2xl shadow-2xl border-4 border-slate-700 object-contain bg-white"
                  />
                </div>
              ) : (
                <div className="text-center p-8 bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 max-w-md">
                  <Camera className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <h4 className="text-sm font-bold text-slate-200 mb-1">
                    No hay foto registrada para este ejercicio
                  </h4>
                  <p className="text-xs text-slate-400">
                    {currentStudent?.name} aún no ha tomado la fotografía de su cuaderno para este desafío.
                  </p>
                </div>
              )}

              {/* Photo Meta Overlay */}
              {currentPhoto && (
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl border border-slate-700 text-xs font-medium space-y-0.5 pointer-events-none">
                  <div className="font-bold text-amber-300">{currentPhoto.exerciseTitle}</div>
                  <div className="text-[11px] text-slate-300">
                    Alumno: {currentStudent?.name} {isGroup && `(Equipo)`}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {new Date(currentPhoto.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              )}

              {/* Status Stamp if already graded */}
              {currentPhoto?.feedback && (
                <div className="absolute top-4 right-4 bg-white/95 text-slate-900 px-4 py-2 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-2 animate-in zoom-in-90">
                  {currentPhoto.feedback.status === 'starred' && (
                    <>
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <div>
                        <span className="text-xs font-black text-amber-600 block">
                          ⭐ DESTACADO
                        </span>
                        <span className="text-[10px] text-slate-500">Procedimiento impecable</span>
                      </div>
                    </>
                  )}
                  {currentPhoto.feedback.status === 'approved' && (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <div>
                        <span className="text-xs font-black text-emerald-700 block">
                          ✓ APROBADO
                        </span>
                        <span className="text-[10px] text-slate-500">Cálculos correctos</span>
                      </div>
                    </>
                  )}
                  {currentPhoto.feedback.status === 'needs_review' && (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                      <div>
                        <span className="text-xs font-black text-rose-700 block">
                          ⚠️ REVISAR
                        </span>
                        <span className="text-[10px] text-slate-500">Verificar fórmula</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Evaluation & Rubric Bar */}
            <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex-1 min-w-[240px]">
                <input
                  type="text"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Retroalimentación docente rápida (ej: 'Buen desglose del Teorema de Pitágoras')..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  disabled={!currentPhoto}
                  onClick={() => handleGrade('approved')}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ Aprobar (+30 pts)</span>
                </button>

                <button
                  disabled={!currentPhoto}
                  onClick={() => handleGrade('starred')}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>⭐ Destacar</span>
                </button>

                <button
                  disabled={!currentPhoto}
                  onClick={() => handleGrade('needs_review')}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 disabled:opacity-40 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>⚠️ Revisar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
