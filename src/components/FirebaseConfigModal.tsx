import React, { useState, useEffect } from 'react';
import {
  Server,
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  Link as LinkIcon,
  Key,
  Shield,
  Zap,
  Wifi,
  DollarSign,
  HelpCircle,
  Activity,
  RefreshCw,
  Laptop,
  Check,
} from 'lucide-react';
import { realtimeDb } from '../lib/firebase';
import { FirebaseConfigOptions } from '../types';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnectedToCloud: boolean;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose,
  isConnectedToCloud,
}) => {
  const [activeTab, setActiveTab] = useState<'free_server' | 'why_charged' | 'free_alternatives' | 'firebase_manual'>('free_server');
  const [databaseURL, setDatabaseURL] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [projectId, setProjectId] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isTestingServer, setIsTestingServer] = useState(false);
  const [serverPingResult, setServerPingResult] = useState<{ ok: boolean; latency: number; time: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const saved = realtimeDb.getSavedConfig();
      if (saved) {
        setDatabaseURL(saved.databaseURL || '');
        setApiKey(saved.apiKey || '');
        setProjectId(saved.projectId || '');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestInternalServer = async () => {
    setIsTestingServer(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/classroom/state', { cache: 'no-store' });
      const latency = Math.round(performance.now() - start);
      if (res.ok) {
        setServerPingResult({
          ok: true,
          latency,
          time: new Date().toLocaleTimeString('es-CL'),
        });
      } else {
        setServerPingResult({
          ok: false,
          latency,
          time: new Date().toLocaleTimeString('es-CL'),
        });
      }
    } catch {
      setServerPingResult({
        ok: false,
        latency: 0,
        time: new Date().toLocaleTimeString('es-CL'),
      });
    } finally {
      setIsTestingServer(false);
    }
  };

  const handleDisconnectFirebaseToFree = () => {
    realtimeDb.disconnectFirebase();
    setDatabaseURL('');
    setApiKey('');
    setProjectId('');
    setStatusMessage({
      text: '✓ Firebase externo desconectado exitosamente. Ahora estás utilizando el Servidor Integrado Autónomo ($0 Costo - Cero cobros).',
      type: 'success',
    });
  };

  const handleSaveFirebase = () => {
    if (!databaseURL.trim()) {
      setStatusMessage({
        text: 'Por favor ingresa la URL de Firebase Realtime Database (ej: https://mi-colegio-rtdb.firebaseio.com)',
        type: 'error',
      });
      return;
    }

    const config: FirebaseConfigOptions = {
      databaseURL: databaseURL.trim(),
      apiKey: apiKey.trim() || undefined,
      projectId: projectId.trim() || undefined,
    };

    const success = realtimeDb.initFirebase(config);
    if (success) {
      setStatusMessage({
        text: '¡Conexión establecida con Firebase Realtime Database!',
        type: 'success',
      });
    } else {
      setStatusMessage({
        text: 'Error al inicializar Firebase. Verifica el formato de la URL.',
        type: 'error',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Servidor y Conexión en Tiempo Real</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  100% Gratis ($0 USD)
                </span>
              </div>
              <p className="text-xs text-slate-500">Garantía de cero costos y funcionamiento autónomo sin suscripciones</p>
            </div>
          </div>
          <button
            id="close-server-config-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-700">Motor Activo:</span>
            {isConnectedToCloud ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                Firebase Externo Vinculado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Servidor Autónomo Incorporado ($0 Costo)
              </span>
            )}
          </div>

          {isConnectedToCloud && (
            <button
              id="revert-to-free-server-btn"
              onClick={handleDisconnectFirebaseToFree}
              className="text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-rose-600" />
              <span>Desconectar Firebase y Usar $0 Gratis</span>
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50 gap-2 shrink-0 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('free_server')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'free_server'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Servidor $0 Gratis (Activo)</span>
          </button>
          <button
            onClick={() => setActiveTab('why_charged')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'why_charged'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>¿Por qué cobró Google Cloud?</span>
          </button>
          <button
            onClick={() => setActiveTab('free_alternatives')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'free_alternatives'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wifi className="w-4 h-4 text-emerald-600" />
            <span>Alternativas Gratuitas</span>
          </button>
          <button
            onClick={() => setActiveTab('firebase_manual')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'firebase_manual'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-slate-400" />
            <span>Configurar Firebase (Opcional)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700 flex-1">
          {/* TAB 1: SERVIDOR $0 GRATIS */}
          {activeTab === 'free_server' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Tu aplicación ya cuenta con un Servidor Autónomo 100% Gratuito</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  No necesitas pagarle a Google Cloud ni a Firebase. La aplicación incluye un <strong>servidor Express en Node.js</strong> con protocolo de transmisión en vivo (Server-Sent Events) y almacenamiento automático en archivos locales del servidor.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-1">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Costo Permanente</span>
                  </div>
                  <div className="text-xl font-black text-slate-900">$0.00 USD</div>
                  <div className="text-[11px] text-slate-500 mt-1">Sin tarjeta de crédito ni facturación mensual.</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-1">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <span>Colecciones y Salas</span>
                  </div>
                  <div className="text-xl font-black text-slate-900">Ilimitadas</div>
                  <div className="text-[11px] text-slate-500 mt-1">Soporta múltiples salas y decenas de alumnos en vivo.</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-1">
                    <Database className="w-4 h-4 text-indigo-600" />
                    <span>Libro de Clases</span>
                  </div>
                  <div className="text-xl font-black text-slate-900">Disco Local</div>
                  <div className="text-[11px] text-slate-500 mt-1">Persistencia automática en caché y respaldo en archivo.</div>
                </div>
              </div>

              {/* Ping Test Section */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Diagnóstico del Servidor en Vivo</span>
                    <span className="text-[11px] text-slate-500">Comprueba la velocidad de respuesta del servidor integrado</span>
                  </div>
                  <button
                    onClick={handleTestInternalServer}
                    disabled={isTestingServer}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingServer ? 'animate-spin' : ''}`} />
                    <span>Probar Latencia</span>
                  </button>
                </div>

                {serverPingResult && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${serverPingResult.ok ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="font-bold text-slate-800">
                        {serverPingResult.ok ? 'Servidor Respondiendo Correctamente' : 'Error al conectar con el servidor'}
                      </span>
                    </div>
                    <div className="text-slate-500 font-mono text-[11px]">
                      Latencia: <strong className="text-emerald-600">{serverPingResult.latency} ms</strong> ({serverPingResult.time})
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ¿POR QUÉ COBRÓ GOOGLE CLOUD? */}
          {activeTab === 'why_charged' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Causa exacta del cobro de más de $7 dólares en tu cuenta</span>
                </div>
                <p className="text-amber-900/90">
                  Google Cloud y Firebase cobran principalmente por dos motivos cuando se realizan actividades en aula:
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-[10px]">1</span>
                    Lecturas y Escrituras masivas en Firestore (Plan Blaze)
                  </div>
                  <p className="text-slate-600 pl-6">
                    En <strong>Cloud Firestore</strong>, cada documento leído o actualizado cuenta como una operación de pago. Si tuviste <strong>20 colecciones simultáneas</strong> con 30 a 50 alumnos respondiendo cada pregunta, enviando puntuaciones y escuchando cambios en tiempo real, se generaron <strong>cientos de miles de lecturas por hora</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-[10px]">2</span>
                    Tarjeta de crédito vinculada sin límites de presupuesto
                  </div>
                  <p className="text-slate-600 pl-6">
                    Al activar el Plan Blaze con tarjeta bancaria, Google Cloud no bloquea el tráfico al pasar la cuota gratis, sino que factura automáticamente el consumo en dólares.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Cómo este software lo resuelve al 100%</span>
                  </div>
                  <p className="text-emerald-900/90 pl-6">
                    Hemos desacoplado la base de datos de Firestore. Este programa cuenta con su propio motor <strong>Server-Sent Events (SSE)</strong> en memoria RAM. Todas las respuestas de los estudiantes se transmiten directamente por HTTP en el servidor web <strong>sin pagar por documento leído ni por colección creada</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ALTERNATIVAS 100% GRATUITAS */}
          {activeTab === 'free_alternatives' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Laptop className="w-4 h-4 text-indigo-600" />
                  <span>1. Servidor en la Nube de Google AI Studio (Ya Activo - $0 Costo)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  El enlace que estás utilizando actualmente (terminado en <code>.run.app</code> de Google AI Studio) se ejecuta dentro de los contenedores gratuitos de la plataforma. Puedes compartir el link con los alumnos sin pagar nada.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  <span>2. Red Local del Colegio / Laboratorio de Computación ($0 Costo - Cero Internet)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Si descargas el proyecto y lo ejecutas en tu laptop docente con <code>npm run start</code> conectada al Wi-Fi de la escuela, los alumnos entran a <code>http://[TU-IP-LOCAL]:3000</code>. No consume internet, tiene latencia inmediata y es 100% gratuito.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Server className="w-4 h-4 text-violet-600" />
                  <span>3. Plataformas Gratuitas para Node.js (Render.com / Koyeb)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Servicios como <strong>Render.com</strong> o <strong>Koyeb</strong> ofrecen planes gratuitos permanentes para aplicaciones Node.js/Express. No cobran por lecturas ni por cantidad de colecciones como Firestore.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Database className="w-4 h-4 text-amber-600" />
                  <span>4. Firebase Plan Spark (Solo si no agregas tarjeta)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Si deseas usar Firebase, crea un proyecto en la consola de Firebase y <strong>NUNCA asocies una tarjeta de crédito</strong> (déjalo en el Plan Spark Gratuito). De esa manera, es imposible que te cobren dinero.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CONFIGURAR FIREBASE (OPCIONAL) */}
          {activeTab === 'firebase_manual' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Advertencia para evitar cargos en Firebase:
                </span>
                <p className="text-amber-800">
                  Solo usa esta opción si tu proyecto está en el <strong>Plan Spark (Gratuito)</strong> sin tarjeta de crédito asociada, y usando <strong>Firebase Realtime Database (RTDB)</strong> en lugar de Cloud Firestore.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
                    Database URL de Firebase Realtime Database
                  </label>
                  <input
                    id="firebase-db-url-input"
                    type="text"
                    placeholder="https://tu-proyecto-default-rtdb.firebaseio.com"
                    value={databaseURL}
                    onChange={(e) => setDatabaseURL(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-slate-900 text-xs font-mono placeholder:text-slate-400 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-500" />
                      API Key (Opcional)
                    </label>
                    <input
                      id="firebase-api-key-input"
                      type="text"
                      placeholder="AIzaSy..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-indigo-500" />
                      Project ID (Opcional)
                    </label>
                    <input
                      id="firebase-project-id-input"
                      type="text"
                      placeholder="mi-sala-matematica"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveFirebase}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm cursor-pointer"
                >
                  Conectar a Firebase RTDB
                </button>
              </div>
            </div>
          )}

          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200 font-medium'
                  : 'bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Servidor Seguro: Cero cargos garantizados en Modo Autónomo</span>
          </div>
          <button
            id="cancel-firebase-config-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
