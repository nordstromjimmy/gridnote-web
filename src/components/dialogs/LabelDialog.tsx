"use client";

import { useState, useEffect, useRef } from "react";
import type { NoteLabel } from "@/lib/types";

const FONT_SIZES = {
  sm: { label: "Small", px: "13px" },
  md: { label: "Medium", px: "18px" },
  lg: { label: "Large", px: "26px" },
} as const;

interface LabelDialogProps {
  label: NoteLabel | null;
  onClose: () => void;
  onSave: (id: string, text: string, fontSize: "sm" | "md" | "lg") => void;
  onDelete: (id: string) => void;
  isOwner?: boolean;
}

export default function LabelDialog({
  label,
  onClose,
  onSave,
  onDelete,
  isOwner = true,
}: LabelDialogProps) {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (label) {
      setText(label.text);
      setFontSize(label.fontSize ?? "md");
      setConfirmDelete(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [label]);

  if (!label) return null;

  const handleSave = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSave(label.id, trimmed, fontSize);
    onClose();
  };

  const handleDelete = () => {
    onDelete(label.id);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      if (confirmDelete) {
        setConfirmDelete(false);
        return;
      }
      onClose();
    }
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
  };

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
        <div className="flex items-center gap-2 px-5 pt-5 pb-3">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
          >
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <span className="flex-1 text-white font-semibold text-base">
            Label
          </span>
          {isOwner && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
              title="Delete"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef5350"
                strokeWidth="2"
              >
                <polyline points="3,6 5,6 21,6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-5 pb-2 flex flex-col gap-4">
          {/* Text field */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-medium tracking-wide"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Text
            </label>
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Label text…"
              className="w-full rounded-[10px] px-3.5 py-3 text-sm text-white outline-none transition-all"
              style={{
                backgroundColor: "#1A2530",
                border: "1.5px solid transparent",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#546E7A")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            />
          </div>

          {/* Font size picker */}
          <div className="flex flex-col gap-2">
            <label
              className="text-[11px] font-medium tracking-wide"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Size
            </label>
            <div className="flex gap-2">
              {(
                Object.entries(FONT_SIZES) as [
                  "sm" | "md" | "lg",
                  { label: string; px: string },
                ][]
              ).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFontSize(key)}
                  className="flex-1 py-2.5 rounded-xl text-white transition-all"
                  style={{
                    backgroundColor:
                      fontSize === key ? "#546E7A" : "rgba(255,255,255,0.06)",
                    border:
                      fontSize === key
                        ? "1.5px solid #607D8B"
                        : "1.5px solid transparent",
                    fontSize: val.px,
                    fontWeight: 600,
                    opacity: fontSize === key ? 1 : 0.45,
                  }}
                >
                  A
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {(["sm", "md", "lg"] as const).map((key) => (
                <div
                  key={key}
                  className="flex-1 text-center text-[10px]"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {FONT_SIZES[key].label}
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            className="rounded-xl px-4 py-3 flex items-center justify-center"
            style={{ backgroundColor: "#1A2530", minHeight: 52 }}
          >
            <span
              className="font-semibold text-center"
              style={{
                fontSize: FONT_SIZES[fontSize].px,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {text || "Preview"}
            </span>
          </div>
        </div>

        {/* Delete confirmation */}
        {confirmDelete && (
          <div
            className="mx-5 mb-4 rounded-xl p-4 flex flex-col gap-3"
            style={{ backgroundColor: "#1A2530" }}
          >
            <p className="text-sm text-white m-0">
              Delete this label? This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 rounded-lg text-sm transition-colors"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: "#c62828" }}
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        {!confirmDelete && (
          <div className="flex items-center justify-between px-5 pb-5 pt-2">
            <button
              onClick={onClose}
              className="text-sm px-2 py-1"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!text.trim()}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
              style={{
                backgroundColor: text.trim()
                  ? "#546E7A"
                  : "rgba(84,110,122,0.25)",
                cursor: text.trim() ? "pointer" : "not-allowed",
              }}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
