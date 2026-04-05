"use client";

import { memo, useCallback } from "react";
import { type NodeProps, NodeResizer } from "@xyflow/react";
import type { NoteLabel } from "@/lib/types";

const FONT_SIZES = {
  sm: "13px",
  md: "18px",
  lg: "26px",
} as const;

function LabelNode({ data, selected }: NodeProps) {
  const label = data.label as NoteLabel;
  const onOpen = data.onOpen as ((label: NoteLabel) => void) | undefined;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      e.stopPropagation();
      onOpen?.(label);
    },
    [onOpen, label],
  );

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={80}
        minHeight={36}
        lineStyle={{ borderColor: "rgba(255,255,255,0.2)" }}
        handleStyle={{
          width: 8,
          height: 8,
          borderRadius: 2,
          backgroundColor: "#546E7A",
          border: "1.5px solid white",
        }}
      />

      <div
        className="w-full h-full rounded-lg flex items-center justify-center px-3 cursor-pointer select-none"
        style={{
          backgroundColor: selected
            ? "rgba(255,255,255,0.18)"
            : "rgba(255,255,255,0.16)",
          border: selected
            ? "1px solid rgba(255,255,255,0.2)"
            : "1px solid rgba(255,255,255,0.08)",
          outline: selected ? "2px solid rgba(255,255,255,0.25)" : "none",
          outlineOffset: 2,
          transition: "background-color 0.15s, border-color 0.15s",
        }}
        onClick={handleClick}
      >
        <span
          className="font-semibold truncate"
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: FONT_SIZES[label.fontSize ?? "md"],
          }}
        >
          {label.text}
        </span>
      </div>
    </>
  );
}

export default memo(LabelNode);
