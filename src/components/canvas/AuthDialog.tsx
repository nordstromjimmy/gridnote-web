"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNoteStore } from "@/store/noteStore";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthDialog({ open, onClose }: AuthDialogProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signIn, signUp, signOut, user, loading } = useAuthStore();
  const { init: initNotes, setUserId } = useNoteStore();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (mode === "signup") {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
        return;
      }
      setSuccess("Check your email to confirm your account, then sign in.");
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      return;
    }

    // Set userId first, then init so notes load with auth context
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      setUserId(currentUser.id);
      await initNotes();
    }
    onClose();
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onKeyDown={handleKeyDown}
    >
      <div
        className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: "#263238",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-white font-semibold text-base mb-1">
            {user
              ? "Your account"
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </h2>
          <p
            className="text-xs font-light"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {user
              ? `Signed in as ${user.email}`
              : mode === "signin"
                ? "Sign in to sync your notes across devices."
                : "Create a free account to sync your notes across devices."}
          </p>
        </div>

        <div className="px-6 pb-6 pt-4 flex flex-col gap-4">
          {user ? (
            // Signed in state
            <>
              <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{ backgroundColor: "#546E7A", color: "#fff" }}
                >
                  {user.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{user.email}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    <span
                      className="text-[11px]"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      Synced
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm transition-colors"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  Close
                </button>
                <button
                  onClick={handleSignOut}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: "rgba(239,83,80,0.15)",
                    color: "#ef9a9a",
                    border: "1px solid rgba(239,83,80,0.2)",
                  }}
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            // Sign in / sign up form
            <>
              {/* Mode toggle */}
              <div
                className="flex rounded-xl overflow-hidden"
                style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                {(["signin", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m);
                      setError(null);
                      setSuccess(null);
                    }}
                    className="flex-1 py-2 text-sm font-medium transition-all"
                    style={{
                      backgroundColor: mode === m ? "#546E7A" : "transparent",
                      color: mode === m ? "#fff" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {m === "signin" ? "Sign in" : "Sign up"}
                  </button>
                ))}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[11px] font-medium tracking-wide"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-[10px] px-3.5 py-3 text-sm text-white outline-none transition-all"
                  style={{
                    backgroundColor: "#1A2530",
                    border: "1.5px solid transparent",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#546E7A")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "transparent")
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[11px] font-medium tracking-wide"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === "signup" ? "At least 6 characters" : "••••••••"
                  }
                  className="w-full rounded-[10px] px-3.5 py-3 text-sm text-white outline-none transition-all"
                  style={{
                    backgroundColor: "#1A2530",
                    border: "1.5px solid transparent",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#546E7A")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "transparent")
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>

              {/* Error / success */}
              {error && (
                <p
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{
                    color: "#ef9a9a",
                    backgroundColor: "rgba(239,83,80,0.1)",
                    border: "1px solid rgba(239,83,80,0.2)",
                  }}
                >
                  {error}
                </p>
              )}
              {success && (
                <p
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{
                    color: "#a5d6a7",
                    backgroundColor: "rgba(76,175,80,0.1)",
                    border: "1px solid rgba(76,175,80,0.2)",
                  }}
                >
                  {success}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={onClose}
                  className="text-sm px-2 py-1"
                  style={{ color: "rgba(255,255,255,0.38)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
                  style={{
                    backgroundColor: loading
                      ? "rgba(84,110,122,0.4)"
                      : "#546E7A",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading
                    ? "Loading…"
                    : mode === "signin"
                      ? "Sign in"
                      : "Create account"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
