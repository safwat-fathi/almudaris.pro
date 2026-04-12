'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Copy, Download, Check } from 'lucide-react';

interface InviteQRCodeProps {
  inviteCode: string;
  baseUrl?: string;
}

export function InviteQRCode({ inviteCode, baseUrl }: InviteQRCodeProps) {
  const [copied, setCopied] = useState(false);
  const inviteUrl = `${baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')}/invite/${inviteCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const svg = document.getElementById(`qr-${inviteCode}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `invite-qr-${inviteCode}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant/20 rounded-3xl max-w-sm mx-auto shadow-sm" dir="rtl">
      <h3 className="text-xl font-headline font-bold text-on-surface mb-2">رابط دعوة المعلم</h3>
      <p className="text-sm text-on-surface-variant mb-6 text-center leading-relaxed">
        شارك رمز QR هذا أو الرابط مع أولياء الأمور حتى يتمكنوا من تسجيل أبنائهم في فصولك.
      </p>

      <div className="bg-surface-container-low p-4 rounded-xl mb-6 border border-outline-variant/10">
        <QRCode
          id={`qr-${inviteCode}`}
          value={inviteUrl}
          size={200}
          level="H"
          className="mx-auto"
        />
      </div>

      {/* رابط الدعوة مع زر النسخ */}
      <div className="w-full flex items-center bg-surface-container-low rounded-xl border border-outline-variant/20 overflow-hidden mb-4">
        <input
          type="text"
          value={inviteUrl}
          readOnly
          dir="ltr"
          className="flex-1 bg-transparent px-3 py-3 text-sm text-on-surface-variant outline-none text-left"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-3 hover:bg-surface-container transition-colors border-r border-outline-variant/20 flex items-center justify-center gap-1.5 text-sm font-semibold shrink-0"
          aria-label="نسخ الرابط"
        >
          {copied ? (
            <>
              <Check size={16} className="text-secondary" />
              <span className="text-secondary">تم النسخ</span>
            </>
          ) : (
            <>
              <Copy size={16} className="text-on-surface-variant" />
              <span className="text-on-surface-variant">نسخ</span>
            </>
          )}
        </button>
      </div>

      <button
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition active:scale-[0.98]"
      >
        <Download size={18} />
        تحميل صورة QR
      </button>
    </div>
  );
}
