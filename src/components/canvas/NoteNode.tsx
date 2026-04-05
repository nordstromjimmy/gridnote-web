"use client";

import { memo, useCallback } from "react";
import {
  type NodeProps,
  Handle,
  Position,
  NodeResizer,
  useConnection,
} from "@xyflow/react";
import { useNoteStore } from "@/store/noteStore";
import type { Note } from "@/lib/types";

function NoteNode({ data, selected }: NodeProps) {
  const { togglePin, resizeNote } = useNoteStore();
  const note = data.note as Note;
  const onOpen = data.onOpen as ((note: Note) => void) | undefined;
  const connection = useConnection();

  // Show handles when selected OR when a connection is being dragged.
  const isConnecting = connection.inProgress;
  const showHandles = selected || isConnecting;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      e.stopPropagation();
      onOpen?.(note);
    },
    [onOpen, note],
  );

  const handleStyle = (visible: boolean) => ({
    width: 12,
    height: 12,
    backgroundColor: "#546E7A",
    border: "2px solid white",
    opacity: visible ? 1 : 0,
    transition: "opacity 0.15s",
    zIndex: 10,
  });

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={150}
        minHeight={100}
        onResizeEnd={(_, params) => {
          resizeNote(note.id, params.width, params.height);
        }}
        lineStyle={{ borderColor: "rgba(255,255,255,0.3)" }}
        handleStyle={{
          width: 8,
          height: 8,
          borderRadius: 2,
          backgroundColor: "#546E7A",
          border: "1.5px solid white",
        }}
      />

      {/* Source handles — shown when selected */}
      {[Position.Top, Position.Right, Position.Bottom, Position.Left].map(
        (pos) => (
          <Handle
            key={pos}
            type="source"
            position={pos}
            id={pos}
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#546E7A",
              border: "2px solid white",
              opacity: showHandles ? 1 : 0,
              transition: "opacity 0.15s",
              zIndex: 10,
            }}
          />
        ),
      )}

      {/* Note card */}
      <div
        className="w-full h-full rounded-[10px] overflow-hidden flex flex-col cursor-pointer select-none"
        style={{
          backgroundColor: note.colorValue,
          outline: selected ? "2px solid rgba(255,255,255,0.4)" : "none",
          outlineOffset: 2,
        }}
        onClick={handleClick}
      >
        {/* Header */}
        <div className="flex items-center gap-1 px-2.5 pt-2 pr-1">
          <span className="flex-1 text-white font-semibold text-[13px] truncate leading-tight">
            {note.title || ""}
          </span>
          <button
            className="w-7 h-7 flex items-center justify-center shrink-0 rounded hover:bg-black/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              togglePin(note.id);
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill={note.pinned ? "white" : "none"}
              stroke="white"
              strokeWidth="2"
              style={{ opacity: note.pinned ? 1 : 0.3 }}
            >
              <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {note.text && (
          <div className="flex-1 px-2.5 pt-1 pb-2 overflow-hidden">
            <p
              className="text-[12px] leading-[1.45] overflow-hidden m-0"
              style={{
                color: "rgba(255,255,255,0.72)",
                display: "-webkit-box",
                WebkitLineClamp: 6,
                WebkitBoxOrient: "vertical",
              }}
            >
              {note.text}
            </p>
          </div>
        )}

        {!note.text && <div className="flex-1" />}

        {/* Media footer */}
        {note.imagePaths.length > 0 && (
          <div
            className="flex items-center gap-2 px-2.5 py-1"
            style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
          >
            <span
              className="flex items-center gap-1 text-[10px]"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21,15 16,10 5,21" />
              </svg>
              {note.imagePaths.length}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

export default memo(NoteNode);
