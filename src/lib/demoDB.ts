import Dexie, { type EntityTable } from "dexie";
import type { Note, NoteEdge, NoteLabel } from "./types";

const demoDB = new Dexie("GridNotesDemoDB") as Dexie & {
  notes: EntityTable<Note, "id">;
  edges: EntityTable<NoteEdge, "id">;
  labels: EntityTable<NoteLabel, "id">;
};

demoDB.version(1).stores({
  notes: "id, updatedAt, pinned",
  edges: "id, source, target",
  labels: "id, updatedAt",
});

export { demoDB };
