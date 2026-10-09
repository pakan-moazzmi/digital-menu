"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export function QrCodeCard({
  menuUrl,
  restaurantName,
}: {
  menuUrl: string;
  restaurantName: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, menuUrl, {
      width: 240,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    }).catch(() => {
      setError("خطا در ساخت QR کد");
    });
  }, [menuUrl]);

  function handleDownload() {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.download = `qr-${restaurantName}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 p-6">
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <canvas ref={canvasRef} />
      )}

      <p className="break-all text-center text-xs text-gray-400" dir="ltr">
        {menuUrl}
      </p>

      <button
        onClick={handleDownload}
        className="rounded-lg bg-black px-5 py-2 text-sm text-white hover:bg-gray-800"
      >
        دانلود QR کد
      </button>
    </div>
  );
}