import React, { useRef, useState, useEffect } from 'react';
import { Edit3, Eraser, Trash2, X } from 'lucide-react';

interface ScratchpadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Scratchpad: React.FC<ScratchpadProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#4f46e5');
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = mode === 'eraser' ? 24 : lineWidth;
    ctx.strokeStyle = mode === 'eraser' ? '#ffffff' : color;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Scratchpad Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-slate-900 text-sm">Borrador Matemático / Pizarra</span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <button
            id="scratchpad-pen-btn"
            onClick={() => setMode('pen')}
            className={`p-2 rounded-xl transition ${
              mode === 'pen'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="Lápiz de cálculo"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            id="scratchpad-eraser-btn"
            onClick={() => setMode('eraser')}
            className={`p-2 rounded-xl transition ${
              mode === 'eraser'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="Borrador"
          >
            <Eraser className="w-4 h-4" />
          </button>

          <button
            id="scratchpad-clear-btn"
            onClick={handleClear}
            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-600 transition"
            title="Limpiar toda la pizarra"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            id="scratchpad-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Touch Canvas with clean grid paper style */}
      <div className="flex-1 relative bg-white touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair"
        />
        <div className="absolute bottom-3 left-4 text-[11px] text-slate-400 pointer-events-none font-medium">
          Pizarra táctil para tus cálculos y desarrollo algebraico
        </div>
      </div>
    </div>
  );
};
