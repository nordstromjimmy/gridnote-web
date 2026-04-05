import Dexie, { type EntityTable } from "dexie";
import type { Note, NoteEdge, NoteLabel } from "./types";

const db = new Dexie("GridNotesDB") as Dexie & {
  notes: EntityTable<Note, "id">;
  edges: EntityTable<NoteEdge, "id">;
  labels: EntityTable<NoteLabel, "id">;
};

db.version(2).stores({
  notes: "id, updatedAt, pinned",
  edges: "id, source, target",
  labels: "id, updatedAt",
});

export { db };
