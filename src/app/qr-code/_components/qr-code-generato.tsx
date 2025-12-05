"use client";

import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QRCodeGenerator() {
  const [text, setText] = useState("https://example.com");
  const [selectedSize, setSelectedSize] = useState("1080");
  const qrRef = useRef(null);

  const sizes = {
    "720": { label: "HD (720p)", size: 720 },
    "1080": { label: "Full HD (1080p)", size: 1080 },
    "1440": { label: "2K (1440p)", size: 1440 },
    "2160": { label: "4K (2160p)", size: 2160 },
  };

  const downloadQRCode = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const downloadSize = sizes[selectedSize].size;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();

    img.onload = () => {
      canvas.width = downloadSize;
      canvas.height = downloadSize;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, downloadSize, downloadSize);
      ctx.drawImage(img, 0, 0, downloadSize, downloadSize);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `qrcode-${selectedSize}p.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Gerador de QR Code
        </h1>

        <div className="mb-6">
          <label className="block text-gray-900 font-medium mb-2">
            Digite o texto ou URL:
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Digite algo..."
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-900 font-medium mb-2">
            Tamanho do download:
          </label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            {Object.entries(sizes).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center bg-gray-50 p-6 rounded-lg">
          <QRCodeSVG ref={qrRef} value={text} size={200} level="H" />
        </div>

        <button
          onClick={downloadQRCode}
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Baixar QR Code ({sizes[selectedSize].label})
        </button>

        <p className="text-sm text-gray-600 mt-4 text-center">
          O QR code é gerado automaticamente
        </p>
      </div>
    </div>
  );
}
