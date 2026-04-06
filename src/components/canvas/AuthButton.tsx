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
      className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all"
      style={{
        backgroundColor: "rgba(38,50,56,0.9)",
        border: user
          ? "1px solid rgba(76,175,80,0.3)"
          : "1px solid rgba(255,255,255,0.08)",
        color: user ? "#a5d6a7" : "rgba(255,255,255,0.55)",
        backdropFilter: "blur(8px)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "#fff";
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(255,255,255,0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = user
          ? "#a5d6a7"
          : "rgba(255,255,255,0.55)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = user
          ? "rgba(76,175,80,0.3)"
          : "rgba(255,255,255,0.08)";
      }}
    >
      {user ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          {user.email?.split("@")[0]}
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
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Sign in
        </>
      )}
    </button>
  );
}
