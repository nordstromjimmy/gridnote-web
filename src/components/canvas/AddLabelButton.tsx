"use client";

interface AddLabelButtonProps {
  onAdd: () => void;
}

export default function AddLabelButton({ onAdd }: AddLabelButtonProps) {
  return (
    <button
      onClick={onAdd}
      className="flex items-center gap-2 px-5 py-3.5 md:py-3 rounded-2xl text-white text-sm font-semibold shadow-lg transition-all active:scale-95"
      style={{ backgroundColor: "#37474F", minWidth: 44, minHeight: 44 }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#455A64")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#37474F")}
      title="Add label"
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
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
      <span className="hidden sm:inline">New label</span>
      <span className="sm:hidden">Label</span>
    </button>
  );
}
