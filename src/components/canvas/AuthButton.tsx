"use client";

import { useAuthStore } from "@/store/authStore";

interface AuthButtonProps {
  onOpen: () => void;
}

export default function AuthButton({ onOpen }: AuthButtonProps) {
  const { user, initialized } = useAuthStore();

  if (!initialized) return null;

  return (
    <button
      onClick={onOpen}
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-2 rounded-xl
        text-xs font-medium transition-all"
      style={{
        backgroundColor: "rgba(38,50,56,0.9)",
        border: user
          ? "1px solid rgba(76,175,80,0.3)"
          : "1px solid rgba(255,255,255,0.08)",
        color: user ? "#a5d6a7" : "rgba(255,255,255,0.55)",
        backdropFilter: "blur(8px)",
      }}
    >
      {user ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shrink-0" />
          <span className="hidden sm:inline truncate max-w-[100px]">
            {user.email?.split("@")[0]}
          </span>
        </>
      ) : (
        <>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="hidden sm:inline">Sign in</span>
        </>
      )}
    </button>
  );
}
