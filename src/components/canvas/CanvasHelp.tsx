"use client";

import { useEffect, useRef, useState } from "react";

const SHORTCUTS = [
  { keys: ["Click"], desc: "Open note" },
  { keys: ["Ctrl", "Click"], desc: "Select note" },
  { keys: ["Ctrl", "Drag"], desc: "Multi-select" },
  { keys: ["Scroll"], desc: "Zoom in / out" },
  { keys: ["Drag canvas"], desc: "Pan" },
  { keys: ["Drag handle"], desc: "Connect notes" },
  { keys: ["Double-click arrow"], desc: "Delete connection" },
];

export default function CanvasHelp() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        onPointerDown={(e) => e.stopPropagation()}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all"
        style={{
          backgroundColor: open ? "#263238" : "rgba(38,50,56,0.85)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(8px)",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        How to use
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </button>

      {/* Dropdown — positioned below the button, left-aligned to it */}
      {open && (
        <div
          className="absolute top-full left-0 mt-2 rounded-2xl py-3 px-1 min-w-[280px]"
          style={{
            backgroundColor: "#263238",
            border: "1px solid rgba(255,255,255,0.08)",
            zIndex: 50,
          }}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {SHORTCUTS.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-2"
              style={{
                borderBottom:
                  i < SHORTCUTS.length - 1
                    ? "1px solid rgba(255,255,255,0.04)"
                    : "none",
              }}
            >
              <div className="flex items-center gap-1">
                {s.keys.map((k, j) => (
                  <span key={j} className="flex items-center gap-1">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-semibold"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {k}
                    </span>
                    {j < s.keys.length - 1 && (
                      <span
                        className="text-[10px]"
                        style={{ color: "rgba(255,255,255,0.25)" }}
                      >
                        +
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <span
                className="text-xs ml-4 text-right"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {s.desc}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
