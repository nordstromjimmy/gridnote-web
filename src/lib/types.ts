export interface Note {
  id: string;
  title: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  colorValue: string;
  pinned: boolean;
  imagePaths: string[];
  videoPaths: [];
  videoThumbPaths: [];
  pdfPaths: [];
  createdAt: string;
  updatedAt: string;
}

export interface NoteEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  createdAt: string;
}

export interface NoteLabel {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: "sm" | "md" | "lg";
  createdAt: string;
  updatedAt: string;
}

export type CreateNoteInput = Pick<Note, "title" | "text" | "colorValue"> & {
  x: number;
  y: number;
};
