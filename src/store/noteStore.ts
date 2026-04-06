import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import type { Note, NoteEdge, CreateNoteInput, NoteLabel } from "@/lib/types";
import { useAuthStore } from "./authStore";
import * as sync from "@/lib/syncService";
import { supabase } from "@/lib/supabase";

const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 140;
const DEFAULT_COLOR = "#38464F";

interface NoteStore {
  notes: Note[];
  edges: NoteEdge[];
  initialized: boolean;
  labels: NoteLabel[];
  userId: string | null;
  subscribeToRealtime: () => void;
  unsubscribeFromRealtime: () => void;

  setUserId: (id: string | null) => void;
  init: () => Promise<void>;

  addNote: (input: CreateNoteInput) => Promise<Note>;
  updateNote: (id: string, changes: Partial<Note>) => Promise<void>;
  moveNote: (id: string, x: number, y: number) => Promise<void>;
  resizeNote: (id: string, width: number, height: number) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  search: (query: string) => Note[];

  addLabel: (x: number, y: number) => Promise<NoteLabel>;
  updateLabel: (id: string, text: string) => Promise<void>;
  moveLabel: (id: string, x: number, y: number) => Promise<void>;
  deleteLabel: (id: string) => Promise<void>;
  resizeLabel: (id: string, width: number, height: number) => Promise<void>;
  updateLabelFontSize: (
    id: string,
    fontSize: "sm" | "md" | "lg",
  ) => Promise<void>;

  addEdge: (
    source: string,
    target: string,
    sourceHandle?: string,
    targetHandle?: string,
  ) => Promise<void>;
  deleteEdge: (id: string) => Promise<void>;
}

function mergeByUpdatedAt<T extends { id: string; updatedAt: string }>(
  local: T[],
  remote: T[],
): T[] {
  const map = new Map<string, T>();
  for (const item of local) map.set(item.id, item);
  for (const item of remote) {
    const existing = map.get(item.id);
    if (!existing || item.updatedAt > existing.updatedAt) {
      map.set(item.id, item);
    }
  }
  return Array.from(map.values());
}

function mergeEdges(local: NoteEdge[], remote: NoteEdge[]): NoteEdge[] {
  const map = new Map<string, NoteEdge>();
  for (const e of local) map.set(e.id, e);
  for (const e of remote) map.set(e.id, e);
  return Array.from(map.values());
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  edges: [],
  labels: [],
  initialized: false,
  userId: null,

  setUserId: (id) => set({ userId: id }),

  init: async () => {
    const [localNotes, localEdges, localLabels] = await Promise.all([
      db.notes.orderBy("updatedAt").reverse().toArray(),
      db.edges.toArray(),
      db.labels.toArray(),
    ]);

    const user = useAuthStore.getState().user;

    if (user) {
      const remote = await sync.pullAll(user.id);

      const remoteNoteIds = new Set(remote.notes.map((n) => n.id));
      const remoteEdgeIds = new Set(remote.edges.map((e) => e.id));
      const remoteLabelIds = new Set(remote.labels.map((l) => l.id));

      const localOnlyNotes = localNotes.filter((n) => !remoteNoteIds.has(n.id));
      const localOnlyEdges = localEdges.filter((e) => !remoteEdgeIds.has(e.id));
      const localOnlyLabels = localLabels.filter(
        (l) => !remoteLabelIds.has(l.id),
      );

      await Promise.all([
        ...localOnlyNotes.map((n) => sync.pushNote(n, user.id)),
        ...localOnlyEdges.map((e) => sync.pushEdge(e, user.id)),
        ...localOnlyLabels.map((l) => sync.pushLabel(l, user.id)),
      ]);

      const mergedNotes = mergeByUpdatedAt(localNotes, remote.notes);
      const mergedEdges = mergeEdges(localEdges, remote.edges);
      const mergedLabels = mergeByUpdatedAt(localLabels, remote.labels);

      await db.notes.bulkPut(mergedNotes);
      await db.edges.bulkPut(mergedEdges);
      await db.labels.bulkPut(mergedLabels);

      set({
        notes: mergedNotes,
        edges: mergedEdges,
        labels: mergedLabels,
        initialized: true,
      });
    } else {
      set({
        notes: localNotes,
        edges: localEdges,
        labels: localLabels,
        initialized: true,
      });
    }
  },

  subscribeToRealtime: () => {
    const userId = get().userId;
    if (!userId) return;

    // Remove any existing channels before re-subscribing.
    supabase.removeAllChannels();

    supabase
      .channel("realtime-notes")
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "notes",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const id = payload.old.id as string;
          db.notes.delete(id);
          set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notes",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new;
          const note: Note = {
            id: row.id,
            title: row.title,
            text: row.text,
            x: row.x,
            y: row.y,
            width: row.width,
            height: row.height,
            colorValue: row.color_value,
            pinned: row.pinned,
            imagePaths: row.image_paths ?? [],
            videoPaths: [],
            videoThumbPaths: [],
            pdfPaths: [],
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
          db.notes.put(note);
          set((s) => {
            const exists = s.notes.some((n) => n.id === note.id);
            return { notes: exists ? s.notes : [...s.notes, note] };
          });
        },
      )
      .subscribe();

    supabase
      .channel("realtime-labels")
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "labels",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const id = payload.old.id as string;
          db.labels.delete(id);
          set((s) => ({ labels: s.labels.filter((l) => l.id !== id) }));
        },
      )
      .subscribe();

    supabase
      .channel("realtime-edges")
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "edges",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const id = payload.old.id as string;
          db.edges.delete(id);
          set((s) => ({ edges: s.edges.filter((e) => e.id !== id) }));
        },
      )
      .subscribe();
  },

  unsubscribeFromRealtime: () => {
    supabase.removeAllChannels();
  },

  // ------------------------------------------------------------------ notes

  addNote: async (input) => {
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
    await db.notes.add(note);
    set((s) => ({ notes: [...s.notes, note] }));
    const userId = get().userId;
    if (userId) await sync.pushNote(note, userId);
    return note;
  },

  updateNote: async (id, changes) => {
    const updatedAt = new Date().toISOString();
    await db.notes.update(id, { ...changes, updatedAt });
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === id ? { ...n, ...changes, updatedAt } : n,
      ),
    }));
    const userId = get().userId;
    if (userId) {
      const note = get().notes.find((n) => n.id === id);
      if (note) await sync.pushNote({ ...note, ...changes, updatedAt }, userId);
    }
  },

  moveNote: async (id, x, y) => {
    if (get().notes.find((n) => n.id === id)?.pinned) return;
    const updatedAt = new Date().toISOString();
    await db.notes.update(id, { x, y, updatedAt });
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, x, y, updatedAt } : n)),
    }));
    const userId = get().userId;
    if (userId) {
      const note = get().notes.find((n) => n.id === id);
      if (note) await sync.pushNote(note, userId);
    }
  },

  resizeNote: async (id, width, height) => {
    const updatedAt = new Date().toISOString();
    await db.notes.update(id, { width, height, updatedAt });
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === id ? { ...n, width, height, updatedAt } : n,
      ),
    }));
    const userId = get().userId;
    if (userId) {
      const note = get().notes.find((n) => n.id === id);
      if (note) await sync.pushNote(note, userId);
    }
  },

  deleteNote: async (id) => {
    const connectedEdges = get().edges.filter(
      (e) => e.source === id || e.target === id,
    );
    await db.notes.delete(id);
    await Promise.all(connectedEdges.map((e) => db.edges.delete(e.id)));
    set((s) => ({
      notes: s.notes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
    }));
    const userId = get().userId;
    if (userId) await sync.deleteNote(id);
  },

  togglePin: async (id) => {
    const note = get().notes.find((n) => n.id === id);
    if (!note) return;
    const pinned = !note.pinned;
    const updatedAt = new Date().toISOString();
    await db.notes.update(id, { pinned, updatedAt });
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === id ? { ...n, pinned, updatedAt } : n,
      ),
    }));
    const userId = get().userId;
    if (userId) {
      const updated = get().notes.find((n) => n.id === id);
      if (updated) await sync.pushNote(updated, userId);
    }
  },

  search: (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return get().notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.text.toLowerCase().includes(q),
    );
  },

  // ------------------------------------------------------------------ edges

  addEdge: async (source, target, sourceHandle?, targetHandle?) => {
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
    await db.edges.add(edge);
    set((s) => ({ edges: [...s.edges, edge] }));
    const userId = get().userId;
    if (userId) await sync.pushEdge(edge, userId);
  },

  deleteEdge: async (id) => {
    await db.edges.delete(id);
    set((s) => ({ edges: s.edges.filter((e) => e.id !== id) }));
    const userId = get().userId;
    if (userId) await sync.deleteEdge(id);
  },

  // ------------------------------------------------------------------ labels

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
    await db.labels.add(label);
    set((s) => ({ labels: [...s.labels, label] }));
    const userId = get().userId;
    if (userId) await sync.pushLabel(label, userId);
    return label;
  },

  updateLabel: async (id, text) => {
    const updatedAt = new Date().toISOString();
    await db.labels.update(id, { text, updatedAt });
    set((s) => ({
      labels: s.labels.map((l) =>
        l.id === id ? { ...l, text, updatedAt } : l,
      ),
    }));
    const userId = get().userId;
    if (userId) {
      const label = get().labels.find((l) => l.id === id);
      if (label) await sync.pushLabel({ ...label, text, updatedAt }, userId);
    }
  },

  updateLabelFontSize: async (id, fontSize) => {
    const updatedAt = new Date().toISOString();
    await db.labels.update(id, { fontSize, updatedAt });
    set((s) => ({
      labels: s.labels.map((l) =>
        l.id === id ? { ...l, fontSize, updatedAt } : l,
      ),
    }));
    const userId = get().userId;
    if (userId) {
      const label = get().labels.find((l) => l.id === id);
      if (label)
        await sync.pushLabel({ ...label, fontSize, updatedAt }, userId);
    }
  },

  moveLabel: async (id, x, y) => {
    const updatedAt = new Date().toISOString();
    await db.labels.update(id, { x, y, updatedAt });
    set((s) => ({
      labels: s.labels.map((l) =>
        l.id === id ? { ...l, x, y, updatedAt } : l,
      ),
    }));
    const userId = get().userId;
    if (userId) {
      const label = get().labels.find((l) => l.id === id);
      if (label) await sync.pushLabel({ ...label, x, y, updatedAt }, userId);
    }
  },

  resizeLabel: async (id, width, height) => {
    const updatedAt = new Date().toISOString();
    await db.labels.update(id, { width, height, updatedAt });
    set((s) => ({
      labels: s.labels.map((l) =>
        l.id === id ? { ...l, width, height, updatedAt } : l,
      ),
    }));
    const userId = get().userId;
    if (userId) {
      const label = get().labels.find((l) => l.id === id);
      if (label)
        await sync.pushLabel({ ...label, width, height, updatedAt }, userId);
    }
  },

  deleteLabel: async (id) => {
    await db.labels.delete(id);
    set((s) => ({ labels: s.labels.filter((l) => l.id !== id) }));
    const userId = get().userId;
    if (userId) await sync.deleteLabel(id);
  },
}));
