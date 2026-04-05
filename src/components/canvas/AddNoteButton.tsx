"use client";

interface AddNoteButtonProps {
  onAdd: () => void;
}

export default function AddNoteButton({ onAdd }: AddNoteButtonProps) {
  return (
    <button
      onClick={onAdd}
      className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-lg transition-all active:scale-95"
      style={{ backgroundColor: "#546E7A" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#607D8B")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#546E7A")}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      New note
    </button>
  );
}
