"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import * as canvasService from "@/lib/canvasService";

export default function JoinPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { user, init: initAuth } = useAuthStore();
  const [status, setStatus] = useState<
    "loading" | "joining" | "success" | "error" | "needsAuth"
  >("loading");
  const [canvasName, setCanvasName] = useState("");

  useEffect(() => {
    const handle = async () => {
      await initAuth();
      const currentUser = useAuthStore.getState().user;

      const invite = await canvasService.getInviteByToken(token);
      if (!invite) {
        setStatus("error");
        return;
      }

      // Only fetch canvas name if authenticated — skip for anonymous users
      if (currentUser) {
        const { supabase } = await import("@/lib/supabase");
        const { data } = await supabase
          .from("canvases")
          .select("name")
          .eq("id", invite.canvasId)
          .single();
        if (data) setCanvasName(data.name);
      }

      // Fetch canvas name
      const { supabase } = await import("@/lib/supabase");
      const { data } = await supabase
        .from("canvases")
        .select("name")
        .eq("id", invite.canvasId)
        .single();
      if (data) setCanvasName(data.name);

      if (!currentUser) {
        setStatus("needsAuth");
        // Store token in sessionStorage so we can complete join after auth
        sessionStorage.setItem("pendingJoinToken", token);
        return;
      }

      setStatus("joining");
      const joined = await canvasService.joinCanvas(
        invite.canvasId,
        currentUser.id,
      );
      if (joined) {
        setStatus("success");
        setTimeout(
          () => router.push(`/canvas?shared=${invite.canvasId}`),
          1500,
        );
      } else {
        setStatus("error");
      }
    };

    handle();
  }, [token]);

  return (
    <div
      className="min-h-screen bg-[#111820] flex items-center justify-center p-6"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Outfit:wght@300;400;500&display=swap');
        .display { font-family: 'Syne', sans-serif; }`}</style>

      <div
        className="w-full max-w-sm rounded-2xl p-8 text-center"
        style={{
          backgroundColor: "#263238",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Link
          href="/"
          className="display text-xl font-bold text-white mb-8 block"
        >
          Grid Notes
        </Link>

        {status === "loading" && (
          <>
            <div
              className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80
              animate-spin mx-auto mb-4"
            />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Checking invite…
            </p>
          </>
        )}

        {status === "needsAuth" && (
          <>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "rgba(84,110,122,0.2)" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#78909C"
                strokeWidth="1.5"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="display text-lg font-bold text-white mb-2">
              You&apos;re invited
            </h2>
            {canvasName ? (
              <p
                className="text-sm mb-4"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Join <strong className="text-white">{canvasName}</strong> on
                Grid Notes
              </p>
            ) : (
              <p
                className="text-sm mb-4"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                You have been invited to join a shared canvas on Grid Notes.
              </p>
            )}
            <p
              className="text-xs mb-6"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Create a free account or sign in to join this canvas.
            </p>
            <Link
              href="/canvas"
              onClick={() => sessionStorage.setItem("pendingJoinToken", token)}
              className="block w-full py-3 rounded-xl text-sm font-semibold text-white
    text-center transition-all active:scale-95"
              style={{ backgroundColor: "#546E7A" }}
            >
              Sign in to join
            </Link>
          </>
        )}

        {status === "joining" && (
          <>
            <div
              className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80
              animate-spin mx-auto mb-4"
            />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Joining canvas…
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "rgba(76,175,80,0.15)" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#81c784"
                strokeWidth="2"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            <h2 className="display text-lg font-bold text-white mb-2">
              Joined!
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Taking you to the canvas…
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "rgba(239,83,80,0.15)" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef9a9a"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="display text-lg font-bold text-white mb-2">
              Invalid invite
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              This invite link has expired or is invalid.
            </p>
            <Link href="/" className="text-sm" style={{ color: "#78909C" }}>
              Go to Grid Notes
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
