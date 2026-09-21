import React, { useMemo, useState } from 'react';
import { FeedEvent, FeedEventType } from '../../types';
import { realtimeDb } from '../../lib/firebase';
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  LogIn,
  RotateCcw,
  Trash2,
  Info,
  ShieldAlert,
  ArrowRightCircle,
  UserX,
  Copy,
  Clock,
} from 'lucide-react';

interface LiveFeedProps {
  feed: Record<string, FeedEvent>;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ feed }) => {
  const [filterType, setFilterType] = useState<FeedEventType | 'all'>('all');

  const sortedEvents = useMemo(() => {
    const list = (Object.entries(feed || {}) as [string, FeedEvent][]).map(([key, item]) => ({
      ...item,
      id: item.id || key,
    }));
    list.sort((a, b) => b.timestamp - a.timestamp);
    return list;
  }, [feed]);

  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return sortedEvents;
    return sortedEvents.filter((evt) => evt.type === filterType);
  }, [sortedEvents, filterType]);

  const getEventIcon = (type: FeedEventType) => {
    switch (type) {
      case 'correct':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      case 'escape':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'return':
        return <ArrowRightCircle className="w-4 h-4 text-blue-600" />;
      case 'copy_attempt':
        return <Copy className="w-4 h-4 text-amber-600" />;
      case 'kick':
        return <UserX className="w-4 h-4 text-rose-600" />;
      case 'join':
        return <LogIn className="w-4 h-4 text-indigo-600" />;
      case 'quiz_reset':
        return <RotateCcw className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const getEventBadgeClass = (type: FeedEventType) => {
    switch (type) {
      case 'correct':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'error':
        return 'bg-rose-50 border-rose-200 text-rose-800';
      case 'escape':
        return 'bg-rose-100 border-rose-300 text-rose-900 animate-pulse';
      case 'return':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'copy_attempt':
        return 'bg-amber-100 border-amber-300 text-amber-900';
      case 'kick':
        return 'bg-rose-100 border-rose-300 text-rose-900';
      case 'join':
        return 'bg-indigo-50 border-indigo-200 text-indigo-800';
      case 'quiz_reset':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const formatTime = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col h-[340px]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Feed de Auditoría en Vivo</h3>
            <span className="text-[10px] text-slate-400">Eventos de foco y respuestas</span>
          </div>
        </div>

        <button
          id="clear-feed-btn"
          onClick={() => realtimeDb.clearFeed()}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          title="Limpiar registro de eventos"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-semibold">
        <button
          onClick={() => setFilterType('all')}
          className={`px-2.5 py-1 rounded-lg transition shrink-0 ${
            filterType === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Todos ({sortedEvents.length})
        </button>
        <button
          onClick={() => setFilterType('escape')}
          className={`px-2.5 py-1 rounded-lg transition shrink-0 ${
            filterType === 'escape'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Salidas
        </button>
        <button
          onClick={() => setFilterType('correct')}
          className={`px-2.5 py-1 rounded-lg transition shrink-0 ${
            filterType === 'correct'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Aciertos
        </button>
        <button
          onClick={() => setFilterType('copy_attempt')}
          className={`px-2.5 py-1 rounded-lg transition shrink-0 ${
            filterType === 'copy_attempt'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Copias
        </button>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition ${getEventBadgeClass(
                evt.type
              )}`}
            >
              <div className="shrink-0 mt-0.5">{getEventIcon(evt.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-slate-900 truncate">{evt.student}</strong>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {formatTime(evt.timestamp)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{evt.detail}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
            <Activity className="w-6 h-6 mb-1 text-slate-300" />
            <span>Esperando actividad de la clase...</span>
          </div>
        )}
      </div>
    </div>
  );
};
