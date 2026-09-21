import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, Copy, Check, ExternalLink, Smartphone } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pin: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, pin }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const studentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?view=student&pin=${pin}`
    : `/?view=student&pin=${pin}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(studentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-center">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-indigo-600">
            <QrCode className="w-5 h-5" />
            <span className="font-bold text-slate-800 text-sm">Acceso Rápido para Alumnos</span>
          </div>
          <button
            id="close-qr-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Projector Display Content */}
        <div className="p-6 sm:p-8 flex flex-col items-center">
          <div className="mb-3">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
              Código PIN de la Sala
            </span>
            <div className="text-4xl sm:text-5xl font-mono font-black text-indigo-600 tracking-wider my-1">
              {pin}
            </div>
          </div>

          {/* QR Code Container */}
          <div className="p-4 bg-white rounded-3xl shadow-lg border-2 border-indigo-100 my-3 flex items-center justify-center ring-4 ring-indigo-50">
            <QRCodeSVG
              value={studentUrl}
              size={220}
              level="H"
              includeMargin={false}
              fgColor="#0f172a"
              bgColor="#ffffff"
            />
          </div>

          <p className="text-xs text-slate-500 max-w-xs mt-2 font-medium">
            Apunta la cámara del celular al código QR para ingresar directamente como alumno.
          </p>

          {/* URL & Action buttons */}
          <div className="w-full mt-5 space-y-2.5">
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 text-left">
              <Smartphone className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              <input
                id="qr-student-url-input"
                type="text"
                readOnly
                value={studentUrl}
                className="bg-transparent text-xs text-slate-700 font-mono w-full outline-none select-all"
              />
              <button
                id="copy-student-url-btn"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-sm transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <a
              id="open-student-tab-link"
              href={studentUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <ExternalLink className="w-4 h-4 text-indigo-600" />
              <span>Abrir vista de alumno en nueva pestaña</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400">
          Enlace exclusivo para vista estudiantil (sin acceso al panel docente)
        </div>
      </div>
    </div>
  );
};
