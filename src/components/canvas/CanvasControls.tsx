"use client";

import { useReactFlow } from "@xyflow/react";

export default function CanvasControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div
      className="absolute right-4 flex flex-col gap-2 z-10"
      style={{ bottom: "max(24px, env(safe-area-inset-bottom, 24px) + 16px)" }}
    >
      <button
        onClick={() => zoomIn()}
        className="w-10 h-10 md:w-9 md:h-9 rounded-lg flex items-center justify-center text-white text-lg font-light transition-colors"
        style={{ backgroundColor: "#263238" }}
      >
        +
      </button>
      <button
        onClick={() => zoomOut()}
        className="w-10 h-10 md:w-9 md:h-9 rounded-lg flex items-center justify-center text-white text-lg font-light transition-colors"
        style={{ backgroundColor: "#263238" }}
      >
        −
      </button>
      <button
        onClick={() => fitView({ padding: 0.2 })}
        className="w-10 h-10 md:w-9 md:h-9 rounded-lg flex items-center justify-center text-white transition-colors"
        style={{ backgroundColor: "#263238" }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>
    </div>
  );
}
