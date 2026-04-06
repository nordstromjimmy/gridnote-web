"use client";

import { useState } from "react";

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

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-2">
      {/* Trigger pill */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all"
        style={{
          backgroundColor: open ? "#263238" : "rgba(38,50,56,0.85)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(8px)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = "rgba(255,255,255,0.85)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = open
            ? "rgba(255,255,255,0.85)"
            : "rgba(255,255,255,0.55)")
        }
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

      {/* Dropdown panel */}
      {open && (
        <div
          className="rounded-2xl py-3 px-1 min-w-[280px]"
          style={{
            backgroundColor: "#263238",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
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
              {/* Key badges */}
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

              {/* Description */}
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
