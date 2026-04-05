export const NOTE_COLORS = [
  "#38464F",
  "#3D5A47",
  "#4A3F5C",
  "#5C3F3F",
  "#4A4A2E",
  "#2E4A4A",
  "#4A3F2E",
  "#3F4A3F",
];

export function getNoteColorIndex(colorValue: string): number {
  const idx = NOTE_COLORS.indexOf(colorValue);
  return idx >= 0 ? idx : 0;
}
