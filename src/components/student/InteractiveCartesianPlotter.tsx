import React, { useState, useRef, useCallback, useEffect } from 'react';
import { InteractiveGraphConfig } from '../../types';
import {
  RotateCcw,
  Undo2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Maximize2,
  Sparkles,
  MapPin,
  Compass,
} from 'lucide-react';

interface InteractiveCartesianPlotterProps {
  config: InteractiveGraphConfig;
  onPointsChange?: (points: Array<[number, number]>) => void;
  onMatchOption?: (matchedOptionIndex: number) => void;
  disabled?: boolean;
}

export const InteractiveCartesianPlotter: React.FC<InteractiveCartesianPlotterProps> = ({
  config,
  onPointsChange,
  onMatchOption,
  disabled = false,
}) => {
  const [plottedPoints, setPlottedPoints] = useState<Array<[number, number]>>([]);
  const [hoverCoord, setHoverCoord] = useState<[number, number] | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'warning' | 'info' | null;
    message: string;
  }>({ type: null, message: '' });

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Grid dimensions
  const svgWidth = 460;
  const svgHeight = 360;
  const padding = 35;

  const [minX, maxX] = config.xRange || [-8, 8];
  const [minY, maxY] = config.yRange || [-8, 8];

  const toSvgX = useCallback(
    (x: number) => padding + ((x - minX) / (maxX - minX)) * (svgWidth - 2 * padding),
    [minX, maxX, padding, svgWidth]
  );

  const toSvgY = useCallback(
    (y: number) => svgHeight - padding - ((y - minY) / (maxY - minY)) * (svgHeight - 2 * padding),
    [minY, maxY, padding, svgHeight]
  );

  const toCartesian = useCallback(
    (svgX: number, svgY: number): [number, number] => {
      const rawX = minX + ((svgX - padding) / (svgWidth - 2 * padding)) * (maxX - minX);
      const rawY = minY + ((svgHeight - padding - svgY) / (svgHeight - 2 * padding)) * (maxY - minY);
      const snappedX = Math.round(Math.max(minX, Math.min(maxX, rawX)));
      const snappedY = Math.round(Math.max(minY, Math.min(maxY, rawY)));
      return [snappedX, snappedY];
    },
    [minX, maxX, minY, maxY, padding, svgWidth, svgHeight]
  );

  // Reset points when config changes (new question)
  useEffect(() => {
    setPlottedPoints([]);
    setFeedback({
      type: 'info',
      message:
        config.instruction ||
        `Haz clic en el plano para situar los ${config.targetCount} vértices de la figura transformada.`,
    });
  }, [config]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (disabled || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scaleX = svgWidth / rect.width;
    const scaleY = svgHeight / rect.height;
    const [cx, cy] = toCartesian(x * scaleX, y * scaleY);
    setHoverCoord([cx, cy]);
  };

  const handleMouseLeave = () => {
    setHoverCoord(null);
  };

  const handleGridClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (disabled || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scaleX = svgWidth / rect.width;
    const scaleY = svgHeight / rect.height;
    const [cx, cy] = toCartesian(x * scaleX, y * scaleY);

    // Check if clicked an existing plotted point (toggle/remove)
    const existingIndex = plottedPoints.findIndex(([px, py]) => px === cx && py === cy);
    if (existingIndex >= 0) {
      const updated = plottedPoints.filter((_, idx) => idx !== existingIndex);
      setPlottedPoints(updated);
      onPointsChange?.(updated);
      setFeedback({
        type: 'info',
        message: `Vértice (${cx}, ${cy}) eliminado. Puedes volver a marcarlo.`,
      });
      return;
    }

    if (plottedPoints.length >= config.targetCount) {
      setFeedback({
        type: 'warning',
        message: `Ya ubicaste los ${config.targetCount} vértices necesarios. Puedes borrar uno haciendo clic sobre él o usar "Deshacer".`,
      });
      return;
    }

    const updated = [...plottedPoints, [cx, cy] as [number, number]];
    setPlottedPoints(updated);
    onPointsChange?.(updated);

    if (updated.length < config.targetCount) {
      const nextLabel = config.targetLabels[updated.length] || `P${updated.length + 1}`;
      setFeedback({
        type: 'info',
        message: `Vértice ${config.targetLabels[updated.length - 1]} fijado en (${cx}, ${cy}). Ahora ubica el vértice ${nextLabel}.`,
      });
    } else {
      // All points placed -> check match
      verifyPointsMatch(updated);
    }
  };

  const verifyPointsMatch = (points: Array<[number, number]>) => {
    if (!config.correctPoints || config.correctPoints.length === 0) return;

    // Check if all correctPoints exist in points
    const allFound = config.correctPoints.every(([cx, cy]) =>
      points.some(([px, py]) => px === cx && py === cy)
    );

    if (allFound) {
      setFeedback({
        type: 'success',
        message:
          '¡Excelente trabajo en pareja! Todos los vértices fueron ubicados en las coordenadas transformadas exactas.',
      });
      onMatchOption?.(0);
    } else {
      setFeedback({
        type: 'warning',
        message:
          'Uno o más vértices no coinciden con la transformación requerida. Revisen los cálculos de traslación, rotación o reflexión en su cuaderno.',
      });
    }
  };

  const handleUndo = () => {
    if (plottedPoints.length === 0) return;
    const updated = plottedPoints.slice(0, -1);
    setPlottedPoints(updated);
    onPointsChange?.(updated);
    setFeedback({
      type: 'info',
      message: 'Último vértice deshecho.',
    });
  };

  const handleReset = () => {
    setPlottedPoints([]);
    onPointsChange?.([]);
    setFeedback({
      type: 'info',
      message: `Plano reiniciado. Haz clic para situar el vértice ${config.targetLabels[0] || 'A\'"'}`,
    });
  };

  const originX = toSvgX(0);
  const originY = toSvgY(0);

  // Compute pre-image polygon SVG points
  const initialPolygonSvg = config.initialPolygon
    ? config.initialPolygon.map(([x, y]) => `${toSvgX(x)},${toSvgY(y)}`).join(' ')
    : '';

  // Compute student placed polygon SVG points
  const plottedPolygonSvg = plottedPoints
    .map(([x, y]) => `${toSvgX(x)},${toSvgY(y)}`)
    .join(' ');

  return (
    <div className="w-full my-4 p-3.5 sm:p-5 bg-slate-900 rounded-3xl border-2 border-indigo-500/40 shadow-xl text-white select-none">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-indigo-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider uppercase text-indigo-300">
                Herramienta Interactiva de Graficación
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/40 text-[10px] font-bold text-indigo-200">
                Trabajo en Pareja
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Ubica con precisión los vértices en el plano cartesiano digital.
            </p>
          </div>
        </div>

        {/* Live Coordinate Display */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Cursor:</span>
          <span className="font-mono font-black text-indigo-300 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 min-w-[70px] text-center">
            {hoverCoord ? `(${hoverCoord[0]}, ${hoverCoord[1]})` : '— , —'}
          </span>
        </div>
      </div>

      {/* Interactive Cartesian Grid */}
      <div className="relative w-full max-w-lg mx-auto bg-slate-950 rounded-2xl p-2 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto cursor-crosshair touch-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleGridClick}
        >
          <defs>
            <marker
              id="cartesian-arrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Background grid lines */}
          {Array.from({ length: maxX - minX + 1 }).map((_, i) => {
            const xVal = minX + i;
            const sx = toSvgX(xVal);
            const isAxis = xVal === 0;
            return (
              <g key={`v-${xVal}`}>
                <line
                  x1={sx}
                  y1={padding}
                  x2={sx}
                  y2={svgHeight - padding}
                  stroke={isAxis ? '#64748b' : '#1e293b'}
                  strokeWidth={isAxis ? 2 : 1}
                  strokeDasharray={isAxis ? 'none' : undefined}
                />
                {xVal !== 0 && xVal % 2 === 0 && (
                  <text
                    x={sx}
                    y={Math.min(Math.max(originY + 12, padding + 10), svgHeight - padding + 12)}
                    fontSize="9"
                    fill="#64748b"
                    textAnchor="middle"
                    className="font-mono select-none pointer-events-none"
                  >
                    {xVal}
                  </text>
                )}
              </g>
            );
          })}

          {Array.from({ length: maxY - minY + 1 }).map((_, i) => {
            const yVal = minY + i;
            const sy = toSvgY(yVal);
            const isAxis = yVal === 0;
            return (
              <g key={`h-${yVal}`}>
                <line
                  x1={padding}
                  y1={sy}
                  x2={svgWidth - padding}
                  y2={sy}
                  stroke={isAxis ? '#64748b' : '#1e293b'}
                  strokeWidth={isAxis ? 2 : 1}
                />
                {yVal !== 0 && yVal % 2 === 0 && (
                  <text
                    x={Math.max(Math.min(originX - 6, svgWidth - padding - 4), padding - 14)}
                    y={sy + 3}
                    fontSize="9"
                    fill="#64748b"
                    textAnchor="end"
                    className="font-mono select-none pointer-events-none"
                  >
                    {yVal}
                  </text>
                )}
              </g>
            );
          })}

          {/* Primary Axes */}
          <line
            x1={padding - 10}
            y1={originY}
            x2={svgWidth - padding + 10}
            y2={originY}
            stroke="#94a3b8"
            strokeWidth="2"
            markerEnd="url(#cartesian-arrow)"
          />
          <line
            x1={originX}
            y1={svgHeight - padding + 10}
            x2={originX}
            y2={padding - 10}
            stroke="#94a3b8"
            strokeWidth="2"
            markerEnd="url(#cartesian-arrow)"
          />

          <text
            x={svgWidth - padding + 8}
            y={originY - 6}
            fontSize="11"
            fontWeight="bold"
            fill="#cbd5e1"
            className="select-none pointer-events-none"
          >
            X
          </text>
          <text
            x={originX + 8}
            y={padding - 6}
            fontSize="11"
            fontWeight="bold"
            fill="#cbd5e1"
            className="select-none pointer-events-none"
          >
            Y
          </text>

          {/* Special Visual Aid: Axis of Symmetry (Dashed Cyan) */}
          {config.axisOfSymmetry === 'x' && (
            <line
              x1={padding}
              y1={originY}
              x2={svgWidth - padding}
              y2={originY}
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              className="pointer-events-none opacity-80"
            />
          )}
          {config.axisOfSymmetry === 'y' && (
            <line
              x1={originX}
              y1={padding}
              x2={originX}
              y2={svgHeight - padding}
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              className="pointer-events-none opacity-80"
            />
          )}
          {config.axisOfSymmetry === 'y=x' && (
            <line
              x1={toSvgX(minX)}
              y1={toSvgY(minX)}
              x2={toSvgX(maxX)}
              y2={toSvgY(maxX)}
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              className="pointer-events-none opacity-80"
            />
          )}

          {/* Special Visual Aid: Center of Rotation (Point O) */}
          {config.rotationCenter && (
            <g className="pointer-events-none">
              <circle
                cx={toSvgX(config.rotationCenter[0])}
                cy={toSvgY(config.rotationCenter[1])}
                r="6"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <circle
                cx={toSvgX(config.rotationCenter[0])}
                cy={toSvgY(config.rotationCenter[1])}
                r="2"
                fill="#f59e0b"
              />
              <text
                x={toSvgX(config.rotationCenter[0]) + 8}
                y={toSvgY(config.rotationCenter[1]) - 6}
                fontSize="10"
                fontWeight="bold"
                fill="#f59e0b"
              >
                O(0,0) [Centro Giro]
              </text>
            </g>
          )}

          {/* Initial Pre-Image Polygon (Original Figure) */}
          {config.initialPolygon && config.initialPolygon.length > 0 && (
            <g className="pointer-events-none">
              <polygon
                points={initialPolygonSvg}
                fill="rgba(148, 163, 184, 0.18)"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="3 2"
                strokeLinejoin="round"
              />
              {config.initialPolygon.map(([ix, iy], idx) => {
                const sx = toSvgX(ix);
                const sy = toSvgY(iy);
                const label = config.initialLabels?.[idx] || String.fromCharCode(65 + idx);
                return (
                  <g key={`orig-${idx}`}>
                    <circle cx={sx} cy={sy} r="4" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.5" />
                    <text
                      x={sx + 6}
                      y={sy - 4}
                      fontSize="10"
                      fontWeight="bold"
                      fill="#cbd5e1"
                      className="font-mono"
                    >
                      {label}({ix},{iy})
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Student Plotted Polygon (Real-Time) */}
          {plottedPoints.length > 1 && (
            <polygon
              points={plottedPolygonSvg}
              fill="rgba(99, 102, 241, 0.28)"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="pointer-events-none animate-in fade-in duration-200"
            />
          )}

          {/* Student Plotted Points */}
          {plottedPoints.map(([px, py], idx) => {
            const sx = toSvgX(px);
            const sy = toSvgY(py);
            const label = config.targetLabels[idx] || `P${idx + 1}`;
            return (
              <g key={`plotted-${idx}`} className="cursor-pointer group">
                <circle
                  cx={sx}
                  cy={sy}
                  r="8"
                  fill="rgba(99, 102, 241, 0.3)"
                  className="animate-ping"
                />
                <circle
                  cx={sx}
                  cy={sy}
                  r="5"
                  fill="#4f46e5"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <rect
                  x={sx + 6}
                  y={sy - 16}
                  width="54"
                  height="16"
                  rx="4"
                  fill="#1e1b4b"
                  stroke="#6366f1"
                  strokeWidth="1"
                />
                <text
                  x={sx + 33}
                  y={sy - 4}
                  fontSize="9"
                  fontWeight="bold"
                  fill="#e0e7ff"
                  textAnchor="middle"
                  className="font-mono pointer-events-none"
                >
                  {label}({px},{py})
                </text>
              </g>
            );
          })}

          {/* Crosshair on Hover */}
          {hoverCoord && !disabled && (
            <g className="pointer-events-none opacity-70">
              <circle
                cx={toSvgX(hoverCoord[0])}
                cy={toSvgY(hoverCoord[1])}
                r="4"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            </g>
          )}
        </svg>

        {/* Legend Overlay at Top Corner */}
        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700 text-[10px] space-y-0.5 font-medium">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-500/40 border border-slate-400 inline-block" />
            <span>Pre-imagen original</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500/50 border border-indigo-400 inline-block" />
            <span>Vértices fijados por Uds.</span>
          </div>
        </div>
      </div>

      {/* Control Buttons & Plotted Chips */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 mr-1">Vértices Marcados:</span>
          {plottedPoints.length === 0 ? (
            <span className="text-xs text-slate-500 italic">Ningún punto marcado aún</span>
          ) : (
            plottedPoints.map(([px, py], idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-200 text-xs font-mono font-bold"
              >
                <span>
                  {config.targetLabels[idx] || `P${idx + 1}`}({px}, {py})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = plottedPoints.filter((_, i) => i !== idx);
                    setPlottedPoints(updated);
                    onPointsChange?.(updated);
                  }}
                  className="hover:text-rose-400 ml-0.5 text-slate-400"
                  title="Eliminar este punto"
                >
                  ✕
                </button>
              </span>
            ))
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={plottedPoints.length === 0 || disabled}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Deshacer</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={plottedPoints.length === 0 || disabled}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar Plano</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div
          className={`mt-3 p-3 rounded-xl text-xs sm:text-sm font-medium flex items-start gap-2 animate-in fade-in duration-150 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
              : feedback.type === 'warning'
              ? 'bg-amber-950/80 border border-amber-500/50 text-amber-200'
              : 'bg-indigo-950/60 border border-indigo-500/30 text-indigo-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : feedback.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
};
