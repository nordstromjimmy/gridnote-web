"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useNoteStore } from "@/store/noteStore";
import Canvas from "@/components/canvas/Canvas";

export default function CanvasPage() {
  const init = useNoteStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <main className="w-screen h-screen overflow-hidden relative">
      <Canvas />
      {/* Back to landing */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-xl
    text-xs font-medium transition-colors"
        style={{
          backgroundColor: "rgba(38,50,56,0.9)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(8px)",
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="shrink-0"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12,19 5,12 12,5" />
        </svg>
        <span className="hidden sm:inline">Grid Notes</span>
      </Link>
    </main>
  );
}
