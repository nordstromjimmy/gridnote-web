"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useNoteStore } from "@/store/noteStore";
import type { Note } from "@/lib/types";

interface SearchBarProps {
  onSelect: (note: Note) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Note[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const search = useNoteStore((s) => s.search);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }
    setResults(search(query));
  }, [query, search]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  const handleSelect = useCallback(
    (note: Note) => {
      onSelect(note);
      handleClose();
    },
    [onSelect, handleClose],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleClose();
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={handleOpen}
        className="absolute bottom-48 md:bottom-40 right-4 z-10 w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all active:scale-95"
        style={{ backgroundColor: "#263238" }}
        title="Search notes"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {/* Search overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
          onKeyDown={handleKeyDown}
        >
          <div
            className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: "#263238" }}
          >
            {/* Input */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                className="shrink-0"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes…"
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:opacity-30"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-xs px-1"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {query.trim().length > 0 && results.length === 0 && (
                <div
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}

              {results.map((note) => (
                <button
                  key={note.id}
                  onClick={() => handleSelect(note)}
                  className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-white/5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  {/* Color dot */}
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: note.colorValue }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate m-0">
                      {note.title || (
                        <span style={{ color: "rgba(255,255,255,0.3)" }}>
                          Untitled
                        </span>
                      )}
                    </p>
                    {note.text && (
                      <p
                        className="text-xs mt-0.5 truncate m-0"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {note.text}
                      </p>
                    )}
                  </div>
                </button>
              ))}

              {!query && (
                <div
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  Start typing to search your notes
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
