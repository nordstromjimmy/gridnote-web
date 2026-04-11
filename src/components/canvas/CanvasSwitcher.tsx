"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSharedCanvasStore } from "@/store/sharedCanvasStore";
import type { SharedCanvas } from "@/lib/types";

interface CanvasSwitcherProps {
  activeCanvasId: string | null;
  onSwitch: (canvasId: string | null) => void;
}

export default function CanvasSwitcher({
  activeCanvasId,
  onSwitch,
}: CanvasSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [managingCanvas, setManagingCanvas] = useState<SharedCanvas | null>(
    null,
  );
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { user, isSuperuser } = useAuthStore();

  const {
    canvases,
    members,
    loading,
    loadCanvases,
    createCanvas,
    deleteCanvas,
    loadMembers,
    removeMember,
    createInviteLink,
  } = useSharedCanvasStore();

  const canCreateCanvas = isSuperuser;

  useEffect(() => {
    if (user) loadCanvases(user.id);
  }, [user]);

  if (!user) return null;

  const activeCanvas = canvases.find((c) => c.id === activeCanvasId);

  const handleCreate = async () => {
    if (!newName.trim() || !user) return;
    const canvas = await createCanvas(newName.trim(), user.id);
    if (canvas) {
      setNewName("");
      setCreating(false);
      onSwitch(canvas.id);
      setOpen(false);
    }
  };

  const handleManage = async (canvas: SharedCanvas) => {
    setManagingCanvas(canvas);
    await loadMembers(canvas.id);
  };

  const handleCreateInvite = async () => {
    if (!managingCanvas || !user) return;
    const token = await createInviteLink(managingCanvas.id, user.id);
    if (token) {
      const link = `${window.location.origin}/join/${token}`;
      setInviteLink(link);
    }
  };

  const handleCopy = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        onPointerDown={(e) => e.stopPropagation()}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all"
        style={{
          backgroundColor: "rgba(38,50,56,0.9)",
          border: activeCanvasId
            ? "1px solid rgba(84,110,122,0.4)"
            : "1px solid rgba(255,255,255,0.08)",
          color: activeCanvasId ? "#90A4AE" : "rgba(255,255,255,0.55)",
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
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        {activeCanvas ? activeCanvas.name : "My canvas"}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              setCreating(false);
              setManagingCanvas(null);
              setInviteLink(null);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          />
          <div
            className="fixed z-50 w-72 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backgroundColor: "#263238",
              border: "1px solid rgba(255,255,255,0.08)",
              top: 64,
              left: "50%",
              transform: "translateX(-50%)",
            }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {managingCanvas ? (
              // ---- Manage canvas panel ----
              <>
                <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                  <button
                    onClick={() => {
                      setManagingCanvas(null);
                      setInviteLink(null);
                    }}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(255,255,255,0.55)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12,19 5,12 12,5" />
                    </svg>
                  </button>
                  <span className="flex-1 text-white font-semibold text-sm truncate">
                    {managingCanvas.name}
                  </span>
                  {managingCanvas.ownerId === user.id && (
                    <button
                      onClick={async () => {
                        if (confirm("Delete this canvas and all its notes?")) {
                          await deleteCanvas(managingCanvas.id);
                          if (activeCanvasId === managingCanvas.id)
                            onSwitch(null);
                          setManagingCanvas(null);
                          setOpen(false);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ef5350"
                        strokeWidth="2"
                      >
                        <polyline points="3,6 5,6 21,6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="px-5 pb-5 flex flex-col gap-4">
                  {/* Invite link — owners only */}
                  {managingCanvas.ownerId === user.id && (
                    <div>
                      <p
                        className="text-[11px] font-medium tracking-wide mb-2"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        Invite link
                      </p>
                      {inviteLink ? (
                        <div className="flex gap-2">
                          <input
                            readOnly
                            value={inviteLink}
                            className="flex-1 rounded-lg px-3 py-2 text-xs text-white outline-none truncate"
                            style={{
                              backgroundColor: "#1A2530",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }}
                          />
                          <button
                            onClick={handleCopy}
                            className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                            style={{
                              backgroundColor: copied
                                ? "rgba(76,175,80,0.2)"
                                : "rgba(84,110,122,0.3)",
                              color: copied ? "#81c784" : "#90A4AE",
                            }}
                          >
                            {copied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleCreateInvite}
                          className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all"
                          style={{
                            backgroundColor: "rgba(84,110,122,0.2)",
                            border: "1px solid rgba(84,110,122,0.3)",
                            color: "#90A4AE",
                          }}
                        >
                          Generate invite link
                        </button>
                      )}
                      <p
                        className="text-[10px] mt-1.5"
                        style={{ color: "rgba(255,255,255,0.25)" }}
                      >
                        Link expires in 7 days
                      </p>
                    </div>
                  )}

                  {/* Members */}
                  <div>
                    <p
                      className="text-[11px] font-medium tracking-wide mb-2"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      Members ({members.length})
                    </p>
                    <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                      {members.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl"
                          style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                        >
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center
                            text-xs font-semibold shrink-0"
                            style={{
                              backgroundColor: "#546E7A",
                              color: "#fff",
                            }}
                          >
                            {m.email?.[0].toUpperCase() ?? "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate">
                              {m.email}
                            </p>
                            <p
                              className="text-[10px]"
                              style={{ color: "rgba(255,255,255,0.35)" }}
                            >
                              {m.role}
                            </p>
                          </div>
                          {managingCanvas.ownerId === user.id &&
                            m.userId !== user.id && (
                              <button
                                onClick={async () => {
                                  if (
                                    confirm(
                                      `Remove ${m.email ?? m.userId} from this canvas?`,
                                    )
                                  ) {
                                    await removeMember(
                                      managingCanvas.id,
                                      m.userId,
                                    );
                                  }
                                }}
                                className="p-1 rounded hover:bg-white/10 transition-colors"
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="rgba(255,255,255,0.35)"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // ---- Canvas list panel ----
              <>
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                  <div
                    className="w-10 h-1 rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  />
                </div>
                <div className="px-5 pt-4 pb-2">
                  <p className="text-white font-semibold text-base">Canvases</p>
                </div>

                <div className="px-3 pb-2 flex flex-col gap-1 max-h-64 overflow-y-auto">
                  {/* Personal canvas */}
                  <button
                    onClick={() => {
                      onSwitch(null);
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 w-full text-left px-3 py-3 rounded-xl transition-colors"
                    style={{
                      backgroundColor:
                        activeCanvasId === null
                          ? "rgba(84,110,122,0.2)"
                          : "transparent",
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">
                        My canvas
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        Personal — private
                      </p>
                    </div>
                    {activeCanvasId === null && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#90A4AE"
                        strokeWidth="2.5"
                      >
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    )}
                  </button>

                  {/* Shared canvases */}
                  {canvases.map((canvas) => (
                    <div key={canvas.id} className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          onSwitch(canvas.id);
                          setOpen(false);
                        }}
                        className="flex-1 flex items-center gap-3 text-left px-3 py-3 rounded-xl transition-colors"
                        style={{
                          backgroundColor:
                            activeCanvasId === canvas.id
                              ? "rgba(84,110,122,0.2)"
                              : "transparent",
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "rgba(84,110,122,0.25)" }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#90A4AE"
                            strokeWidth="2"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">
                            {canvas.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            {canvas.ownerId === user.id ? "Owner" : "Editor"}
                          </p>
                        </div>
                        {activeCanvasId === canvas.id && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#90A4AE"
                            strokeWidth="2.5"
                          >
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleManage(canvas)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                        title="Manage"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Create new canvas */}
                <div
                  className="px-5 pt-2 pb-5"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {creating ? (
                    <div className="flex gap-2 mt-3">
                      <input
                        autoFocus
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Canvas name…"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCreate();
                          if (e.key === "Escape") setCreating(false);
                        }}
                        className="flex-1 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                        style={{
                          backgroundColor: "#1A2530",
                          border: "1.5px solid #546E7A",
                        }}
                      />
                      <button
                        onClick={handleCreate}
                        disabled={!newName.trim()}
                        className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                        style={{
                          backgroundColor: newName.trim()
                            ? "#546E7A"
                            : "rgba(84,110,122,0.25)",
                        }}
                      >
                        Create
                      </button>
                    </div>
                  ) : canCreateCanvas ? (
                    <button
                      onClick={() => setCreating(true)}
                      className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium transition-all
        flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: "rgba(84,110,122,0.15)",
                        border: "1px solid rgba(84,110,122,0.25)",
                        color: "#90A4AE",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      New shared canvas
                    </button>
                  ) : (
                    <div
                      className="w-full mt-3 py-3 rounded-xl text-xs text-center"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      Upgrade to create shared canvases
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
