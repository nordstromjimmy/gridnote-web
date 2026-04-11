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
  videoPaths: string[];
  videoThumbPaths: string[];
  pdfPaths: string[];
  canvasId?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NoteEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  canvasId?: string | null;
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
  canvasId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SharedCanvas {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

export interface CanvasMember {
  id: string;
  canvasId: string;
  userId: string;
  role: "owner" | "editor";
  email?: string;
  joinedAt: string;
}

export interface CanvasInvite {
  id: string;
  canvasId: string;
  token: string;
  createdBy: string;
  expiresAt: string;
  createdAt: string;
}

export type CreateNoteInput = Pick<Note, "title" | "text" | "colorValue"> & {
  x: number;
  y: number;
};
