"use client";

import Link from "next/link";
import { DEMO_NOTE_LIMIT } from "@/store/demoStore";

interface DemoLimitBannerProps {
  onDismiss: () => void;
}

export default function DemoLimitBanner({ onDismiss }: DemoLimitBannerProps) {
  return (
    <div
      className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm rounded-2xl px-5 py-4 shadow-2xl"
      style={{
        backgroundColor: "#263238",
        border: "1px solid rgba(84,110,122,0.4)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: "rgba(84,110,122,0.2)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#78909C"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white mb-1">
            Demo limit reached
          </p>
          <p
            className="text-xs leading-relaxed mb-3"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            The demo is limited to {DEMO_NOTE_LIMIT} notes. Sign up to get
            unlimited notes, sync across devices, and more.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex-1 text-center py-2 rounded-xl text-xs font-semibold text-white transition-all active:scale-95"
              style={{ backgroundColor: "#546E7A" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#607D8B")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#546E7A")
              }
            >
              Learn more
            </Link>
            <button
              onClick={onDismiss}
              className="text-xs px-3 py-2 rounded-xl transition-colors"
              style={{
                color: "rgba(255,255,255,0.35)",
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
