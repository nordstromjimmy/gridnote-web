import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { demoDB } from "@/lib/demoDB";
import type { Note, NoteEdge, NoteLabel, CreateNoteInput } from "@/lib/types";

const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 140;
const DEFAULT_COLOR = "#38464F";
export const DEMO_NOTE_LIMIT = 5;

interface DemoStore {
  notes: Note[];
  edges: NoteEdge[];
  labels: NoteLabel[];
  initialized: boolean;
  limitReached: boolean;

  init: () => Promise<void>;

  addNote: (input: CreateNoteInput) => Promise<Note | null>;
  updateNote: (id: string, changes: Partial<Note>) => Promise<void>;
  moveNote: (id: string, x: number, y: number) => Promise<void>;
  resizeNote: (id: string, width: number, height: number) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  search: (query: string) => Note[];

  addEdge: (
    source: string,
    target: string,
    sourceHandle?: string,
    targetHandle?: string,
  ) => Promise<void>;
  deleteEdge: (id: string) => Promise<void>;

  addLabel: (x: number, y: number) => Promise<NoteLabel>;
  updateLabel: (id: string, text: string) => Promise<void>;
  updateLabelFontSize: (
    id: string,
    fontSize: "sm" | "md" | "lg",
  ) => Promise<void>;
  moveLabel: (id: string, x: number, y: number) => Promise<void>;
  resizeLabel: (id: string, width: number, height: number) => Promise<void>;
  deleteLabel: (id: string) => Promise<void>;
}

export const useDemoStore = create<DemoStore>((set, get) => ({
  notes: [],
  edges: [],
  labels: [],
  initialized: false,
  limitReached: false,

  init: async () => {
    const [notes, edges, labels] = await Promise.all([
      demoDB.notes.orderBy("updatedAt").reverse().toArray(),
      demoDB.edges.toArray(),
      demoDB.labels.toArray(),
    ]);
    set({
      notes,
      edges,
      labels,
      initialized: true,
      limitReached: notes.length >= DEMO_NOTE_LIMIT,
    });
  },

  addNote: async (input) => {
    if (get().notes.length >= DEMO_NOTE_LIMIT) {
      set({ limitReached: true });
      return null;
    }
    const now = new Date().toISOString();
    const note: Note = {
      id: uuidv4(),
      title: input.title,
      text: input.text,
      x: input.x,
      y: input.y,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      colorValue: input.colorValue || DEFAULT_COLOR,
      pinned: false,
      imagePaths: [],
      videoPaths: [],
      videoThumbPaths: [],
      pdfPaths: [],
      createdAt: now,
      updatedAt: now,
    };
    await demoDB.notes.add(note);
    const newNotes = [...get().notes, note];
    set({
      notes: newNotes,
      limitReached: newNotes.length >= DEMO_NOTE_LIMIT,
    });
    return note;
  },

  updateNote: async (id, changes) => {
    const updatedAt = new Date().toISOString();
    await demoDB.notes.update(id, { ...changes, updatedAt });
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === id ? { ...n, ...changes, updatedAt } : n,
      ),
    }));
  },

  moveNote: async (id, x, y) => {
    if (get().notes.find((n) => n.id === id)?.pinned) return;
    const updatedAt = new Date().toISOString();
    await demoDB.notes.update(id, { x, y, updatedAt });
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, x, y, updatedAt } : n)),
    }));
  },

  resizeNote: async (id, width, height) => {
    const updatedAt = new Date().toISOString();
    await demoDB.notes.update(id, { width, height, updatedAt });
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === id ? { ...n, width, height, updatedAt } : n,
      ),
    }));
  },

  deleteNote: async (id) => {
    const connectedEdges = get().edges.filter(
      (e) => e.source === id || e.target === id,
    );
    await demoDB.notes.delete(id);
    await Promise.all(connectedEdges.map((e) => demoDB.edges.delete(e.id)));
    const newNotes = get().notes.filter((n) => n.id !== id);
    set({
      notes: newNotes,
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      limitReached: newNotes.length >= DEMO_NOTE_LIMIT,
    });
  },

  togglePin: async (id) => {
    const note = get().notes.find((n) => n.id === id);
    if (!note) return;
    const pinned = !note.pinned;
    const updatedAt = new Date().toISOString();
    await demoDB.notes.update(id, { pinned, updatedAt });
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === id ? { ...n, pinned, updatedAt } : n,
      ),
    }));
  },

  search: (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return get().notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.text.toLowerCase().includes(q),
    );
  },

  addEdge: async (source, target, sourceHandle, targetHandle) => {
    const exists = get().edges.some(
      (e) =>
        (e.source === source && e.target === target) ||
        (e.source === target && e.target === source),
    );
    if (exists) return;
    const edge: NoteEdge = {
      id: uuidv4(),
      source,
      target,
      sourceHandle,
      targetHandle,
      createdAt: new Date().toISOString(),
    };
    await demoDB.edges.add(edge);
    set((s) => ({ edges: [...s.edges, edge] }));
  },

  deleteEdge: async (id) => {
    await demoDB.edges.delete(id);
    set((s) => ({ edges: s.edges.filter((e) => e.id !== id) }));
  },

  addLabel: async (x, y) => {
    const now = new Date().toISOString();
    const label: NoteLabel = {
      id: uuidv4(),
      text: "Label",
      x,
      y,
      width: 160,
      height: 40,
      fontSize: "md",
      createdAt: now,
      updatedAt: now,
    };
    await demoDB.labels.add(label);
    set((s) => ({ labels: [...s.labels, label] }));
    return label;
  },

  updateLabel: async (id, text) => {
    const updatedAt = new Date().toISOString();
    await demoDB.labels.update(id, { text, updatedAt });
    set((s) => ({
      labels: s.labels.map((l) =>
        l.id === id ? { ...l, text, updatedAt } : l,
      ),
    }));
  },

  updateLabelFontSize: async (id, fontSize) => {
    const updatedAt = new Date().toISOString();
    await demoDB.labels.update(id, { fontSize, updatedAt });
    set((s) => ({
      labels: s.labels.map((l) =>
        l.id === id ? { ...l, fontSize, updatedAt } : l,
      ),
    }));
  },

  moveLabel: async (id, x, y) => {
    const updatedAt = new Date().toISOString();
    await demoDB.labels.update(id, { x, y, updatedAt });
    set((s) => ({
      labels: s.labels.map((l) =>
        l.id === id ? { ...l, x, y, updatedAt } : l,
      ),
    }));
  },

  resizeLabel: async (id, width, height) => {
    const updatedAt = new Date().toISOString();
    await demoDB.labels.update(id, { width, height, updatedAt });
    set((s) => ({
      labels: s.labels.map((l) =>
        l.id === id ? { ...l, width, height, updatedAt } : l,
      ),
    }));
  },

  deleteLabel: async (id) => {
    await demoDB.labels.delete(id);
    set((s) => ({ labels: s.labels.filter((l) => l.id !== id) }));
  },
}));
