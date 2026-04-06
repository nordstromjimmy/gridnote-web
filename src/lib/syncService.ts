import { supabase } from "./supabase";
import type { Note, NoteEdge, NoteLabel } from "./types";

// ---- Notes ----

export async function pushNote(note: Note, userId: string) {
  const { error } = await supabase.from("notes").upsert({
    id: note.id,
    user_id: userId,
    title: note.title,
    text: note.text,
    x: note.x,
    y: note.y,
    width: note.width,
    height: note.height,
    color_value: note.colorValue,
    pinned: note.pinned,
    image_paths: note.imagePaths,
    video_paths: note.videoPaths,
    video_thumb_paths: note.videoThumbPaths,
    pdf_paths: note.pdfPaths,
    created_at: note.createdAt,
    updated_at: note.updatedAt,
  });
  if (error) console.error("pushNote error:", error);
}

export async function deleteNote(id: string) {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) console.error("deleteNote error:", error);
}

export async function pullNotes(userId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("pullNotes error:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
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
    videoPaths: row.video_paths ?? [],
    videoThumbPaths: row.video_thumb_paths ?? [],
    pdfPaths: row.pdf_paths ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

// ---- Edges ----

export async function pushEdge(edge: NoteEdge, userId: string) {
  const { error } = await supabase.from("edges").upsert({
    id: edge.id,
    user_id: userId,
    source: edge.source,
    target: edge.target,
    source_handle: edge.sourceHandle,
    target_handle: edge.targetHandle,
    created_at: edge.createdAt,
  });
  if (error) console.error("pushEdge error:", error);
}

export async function deleteEdge(id: string) {
  const { error } = await supabase.from("edges").delete().eq("id", id);
  if (error) console.error("deleteEdge error:", error);
}

export async function pullEdges(userId: string): Promise<NoteEdge[]> {
  const { data, error } = await supabase
    .from("edges")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("pullEdges error:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    source: row.source,
    target: row.target,
    sourceHandle: row.source_handle,
    targetHandle: row.target_handle,
    createdAt: row.created_at,
  }));
}

// ---- Labels ----

export async function pushLabel(label: NoteLabel, userId: string) {
  const { error } = await supabase.from("labels").upsert({
    id: label.id,
    user_id: userId,
    text: label.text,
    x: label.x,
    y: label.y,
    width: label.width,
    height: label.height,
    font_size: label.fontSize,
    created_at: label.createdAt,
    updated_at: label.updatedAt,
  });
  if (error) console.error("pushLabel error:", error);
}

export async function deleteLabel(id: string) {
  const { error } = await supabase.from("labels").delete().eq("id", id);
  if (error) console.error("deleteLabel error:", error);
}

export async function pullLabels(userId: string): Promise<NoteLabel[]> {
  const { data, error } = await supabase
    .from("labels")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("pullLabels error:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    text: row.text,
    x: row.x,
    y: row.y,
    width: row.width,
    height: row.height,
    fontSize: row.font_size as "sm" | "md" | "lg",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

// ---- Full sync ----

export async function pullAll(userId: string) {
  const [notes, edges, labels] = await Promise.all([
    pullNotes(userId),
    pullEdges(userId),
    pullLabels(userId),
  ]);
  return { notes, edges, labels };
}

export async function pushAll(
  notes: Note[],
  edges: NoteEdge[],
  labels: NoteLabel[],
  userId: string,
) {
  await Promise.all([
    ...notes.map((n) => pushNote(n, userId)),
    ...edges.map((e) => pushEdge(e, userId)),
    ...labels.map((l) => pushLabel(l, userId)),
  ]);
}
