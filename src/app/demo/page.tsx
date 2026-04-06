"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDemoStore } from "@/store/demoStore";
import DemoCanvas from "@/components/canvas/DemoCanvas";

export default function DemoPage() {
  const init = useDemoStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <main className="w-screen h-screen overflow-hidden relative">
      <DemoCanvas />

      {/* Back to landing */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors"
        style={{
          backgroundColor: "rgba(38,50,56,0.9)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(8px)",
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
