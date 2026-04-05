export const NOTE_COLORS = [
  // Neutrals
  "#38464F", // slate blue-grey (default)
  "#2E3A42", // deep navy
  "#3A3F45", // cool charcoal

  // Greens
  "#3D5A47", // forest
  "#2E4A3A", // deep moss
  "#3A4A2E", // olive

  // Blues
  "#2E3F5C", // steel blue
  "#2E4A5C", // ocean
  "#2E3A5C", // midnight blue

  // Purples
  "#4A3F5C", // dusk purple
  "#3F2E5C", // deep violet
  "#4A3A54", // plum

  // Reds / Browns
  "#5C3F3F", // muted terracotta
  "#4A2E2E", // deep rust
  "#4A3A2E", // warm brown

  // Warm
  "#4A4A2E", // dark khaki
];

export function getNoteColorIndex(colorValue: string): number {
  const idx = NOTE_COLORS.indexOf(colorValue);
  return idx >= 0 ? idx : 0;
}
