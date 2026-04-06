"use client";

import { useState, useEffect, useRef } from "react";
import { NOTE_COLORS } from "@/lib/noteColors";
import type { Note } from "@/lib/types";

interface NoteDialogProps {
  note: Note | null;
  onClose: () => void;
  onSave: (id: string, changes: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

export default function NoteDialog({
  note,
  onClose,
  onSave,
  onDelete,
}: NoteDialogProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const open = note !== null;

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setText(note.text);
      setSelectedColor(
        NOTE_COLORS.indexOf(note.colorValue) >= 0
          ? NOTE_COLORS.indexOf(note.colorValue)
          : 0,
      );
      setEditing(false);
      setConfirmDelete(false);
    }
  }, [note]);

  useEffect(() => {
    if (editing) {
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [editing]);

  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation(); // stops ALL other listeners including ReactFlow
        if (confirmDelete) {
          setConfirmDelete(false);
          return;
        }
        if (editing) {
          setEditing(false);
          return;
        }
        onClose();
      }
    };

    // useCapture: true means this runs before ReactFlow's listener
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [open, confirmDelete, editing, onClose]);

  if (!open) return null;

  const handleSave = () => {
    if (!note) return;
    onSave(note.id, {
      title: title.trim(),
      text,
      colorValue: NOTE_COLORS[selectedColor],
    });
    setEditing(false);
  };

  const handleDelete = () => {
    if (!note) return;
    onDelete(note.id);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && editing) {
      handleSave();
    }
  };

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
        {/* Header */}
        <div className="flex items-center gap-2 px-5 pt-5 pb-3">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: note.colorValue }}
          />
          <span className="flex-1 text-white font-semibold text-base">
            {editing ? "Edit note" : "Note"}
          </span>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
              title="Edit"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
          {!editing && (
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
        <div className="px-5 pb-2 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          {editing ? (
            <>
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
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#546E7A")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "transparent")
                  }
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
                  rows={5}
                  className="w-full rounded-[10px] px-3.5 py-3 text-sm text-white outline-none resize-none transition-all"
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
            </>
          ) : (
            <>
              {/* View mode */}
              {note.title && (
                <h3 className="text-white font-bold text-lg m-0 leading-snug">
                  {note.title}
                </h3>
              )}
              {note.text && (
                <p
                  className="text-sm leading-relaxed m-0 whitespace-pre-wrap"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  {note.text}
                </p>
              )}
              {!note.title && !note.text && (
                <p
                  className="text-sm italic m-0"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  Empty note
                </p>
              )}
            </>
          )}
        </div>

        {/* Delete confirmation */}
        {confirmDelete && (
          <div
            className="mx-5 mb-4 rounded-xl p-4 flex flex-col gap-3"
            style={{ backgroundColor: "#1A2530" }}
          >
            <p className="text-sm text-white m-0">
              Delete this note? This cannot be undone.
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
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
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
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="text-sm px-2 py-1 transition-colors"
                  style={{ color: "rgba(255,255,255,0.38)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
                  style={{ backgroundColor: "#546E7A" }}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <div />
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
                  style={{ backgroundColor: "#546E7A" }}
                >
                  Close
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
