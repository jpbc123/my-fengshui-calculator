import React from "react";
import html2canvas from "html2canvas";
import { Share2, Download } from "lucide-react";

interface ShareResultProps {
  targetId: string;
}

const ShareResult: React.FC<ShareResultProps> = ({ targetId }) => {
  const addBranding = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const brandingText = "Feng Shui & Beyond";

    // Position safely near bottom-left with margin
    const margin = 20;
    const centerX = 60;
    const centerY = canvas.height - margin - 25;

    // Glow circle
    ctx.save();
    ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    // Chinese character
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("福", centerX, centerY);

    // Branding text
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#fff"; // white text on black bg
    ctx.textAlign = "left";
    ctx.fillText(brandingText, centerX + 40, centerY + 5);
  };

  const applyRoundedCorners = (canvas: HTMLCanvasElement, radius = 20) => {
    const roundedCanvas = document.createElement("canvas");
    roundedCanvas.width = canvas.width;
    roundedCanvas.height = canvas.height;

    const ctx = roundedCanvas.getContext("2d");
    if (!ctx) return canvas;

    // Clip rounded rect
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(canvas.width - radius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
    ctx.lineTo(canvas.width, canvas.height - radius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
    ctx.lineTo(radius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(canvas, 0, 0);

    return roundedCanvas;
  };

  const captureCanvas = async () => {
    const element = document.getElementById(targetId);
    if (!element) return null;

    const canvas = await html2canvas(element, {
      scale: window.devicePixelRatio || 2,
      backgroundColor: "#000", // black background
    });

    addBranding(canvas);

    // Apply rounded corners
    return applyRoundedCorners(canvas, 20); // radius should match your CSS border-radius
  };

  const captureAndDownload = async () => {
    const canvas = await captureCanvas();
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "result.png";
    link.click();
  };

  const captureAndShare = async () => {
    const canvas = await captureCanvas();
    if (!canvas) return;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );

    if (
      blob &&
      navigator.canShare &&
      navigator.canShare({
        files: [new File([blob], "result.png", { type: "image/png" })],
      })
    ) {
      const file = new File([blob], "result.png", { type: "image/png" });
      await navigator.share({
        files: [file],
        title: "My Feng Shui & Beyond Result",
        text: "Check out my result!",
      });
    } else {
      captureAndDownload();
    }
  };

  return (
    <div className="flex gap-3 mt-4">
      {/* Gold Save Button */}
      <button
        onClick={captureAndDownload}
        className="px-3 py-2 bg-yellow-500 text-black rounded-lg shadow hover:bg-yellow-600 flex items-center gap-2"
      >
        <Download size={18} /> Save
      </button>

      {/* Black Share Button */}
      <button
        onClick={captureAndShare}
        className="px-3 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-800 flex items-center gap-2"
      >
        <Share2 size={18} /> Share
      </button>
    </div>
  );
};

export default ShareResult;
