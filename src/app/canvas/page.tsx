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
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(38,50,56,0.9)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          padding: "8px 14px",
          color: "rgba(255,255,255,0.55)",
          fontSize: 13,
          fontWeight: 500,
          textDecoration: "none",
          backdropFilter: "blur(8px)",
          transition: "color 0.15s, border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
          (e.currentTarget as HTMLAnchorElement).style.borderColor =
            "rgba(255,255,255,0.2)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color =
            "rgba(255,255,255,0.55)";
          (e.currentTarget as HTMLAnchorElement).style.borderColor =
            "rgba(255,255,255,0.08)";
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
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12,19 5,12 12,5" />
        </svg>
        Grid Notes
      </Link>
    </main>
  );
}
