"use client";

import { useState, useEffect, useRef } from "react";
import { NOTE_COLORS } from "@/lib/noteColors";

interface CreateNoteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    title: string;
    text: string;
    colorValue: string;
  }) => void;
}

export default function CreateNoteDialog({
  open,
  onClose,
  onConfirm,
}: CreateNoteDialogProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const titleRef = useRef<HTMLInputElement>(null);

  const canCreate = title.trim().length > 0 || text.trim().length > 0;

  // Reset state when dialog opens and autofocus title.
  useEffect(() => {
    if (open) {
      setTitle("");
      setText("");
      setSelectedColor(0);
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSubmit = () => {
    if (!canCreate) return;
    onConfirm({
      title: title.trim(),
      text,
      colorValue: NOTE_COLORS[selectedColor],
    });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
    }
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onKeyDown={handleKeyDown}
    >
      <div
        className="w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: "#263238",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Title */}
        <h2 className="text-white font-semibold text-base m-0">New note</h2>

        {/* Title field */}
        <div className="flex flex-col gap-1.5">
          <label
            className="text-[11px] font-medium tracking-wide"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Title
          </label>
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write a title…"
            className="w-full rounded-[10px] px-3.5 py-3 text-sm text-white outline-none transition-all"
            style={{
              backgroundColor: "#1A2530",
              border: "1.5px solid transparent",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#546E7A")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
          />
        </div>

        {/* Text field */}
        <div className="flex flex-col gap-1.5">
          <label
            className="text-[11px] font-medium tracking-wide"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your note…"
            rows={4}
            className="w-full rounded-[10px] px-3.5 py-3 text-sm text-white outline-none resize-none transition-all"
            style={{
              backgroundColor: "#1A2530",
              border: "1.5px solid transparent",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#546E7A")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
          />
        </div>

        {/* Color picker */}
        <div className="flex flex-col gap-2">
          <label
            className="text-[11px] font-medium tracking-wide"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {NOTE_COLORS.map((color, i) => (
              <button
                key={color}
                onClick={() => setSelectedColor(i)}
                className="w-7 h-7 rounded-full transition-all flex items-center justify-center"
                style={{
                  backgroundColor: color,
                  border:
                    selectedColor === i
                      ? "2px solid white"
                      : "2px solid transparent",
                  boxShadow:
                    selectedColor === i ? `0 0 0 1px ${color}` : "none",
                }}
              >
                {selectedColor === i && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  >
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onClose}
            className="text-sm transition-colors px-2 py-1"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canCreate}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
            style={{
              backgroundColor: canCreate ? "#546E7A" : "rgba(84,110,122,0.25)",
              cursor: canCreate ? "pointer" : "not-allowed",
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
