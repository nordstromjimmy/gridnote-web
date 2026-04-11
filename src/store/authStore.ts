import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { db } from "@/lib/db";

interface AuthStore {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  isSuperuser: boolean;

  init: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

async function fetchSuperuser(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("users")
    .select("superuser")
    .eq("id", userId)
    .single();
  return data?.superuser ?? false;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,
  isSuperuser: false,

  init: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const isSuperuser = session?.user
      ? await fetchSuperuser(session.user.id)
      : false;

    set({
      user: session?.user ?? null,
      session,
      initialized: true,
      isSuperuser,
    });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      const isSuperuser = session?.user
        ? await fetchSuperuser(session.user.id)
        : false;
      set({
        user: session?.user ?? null,
        session,
        isSuperuser,
      });
    });
  },

  signUp: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    set({ loading: false });
    if (error) return { error: error.message };
    return { error: null };
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    set({ loading: false });
    if (error) return { error: error.message };
    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();

    // Remove all shared canvas data from local IndexedDB
    const allNotes = await db.notes.toArray();
    const allEdges = await db.edges.toArray();
    const allLabels = await db.labels.toArray();

    const sharedNoteIds = allNotes.filter((n) => n.canvasId).map((n) => n.id);
    const sharedEdgeIds = allEdges.filter((e) => e.canvasId).map((e) => e.id);
    const sharedLabelIds = allLabels.filter((l) => l.canvasId).map((l) => l.id);

    await Promise.all([
      db.notes.bulkDelete(sharedNoteIds),
      db.edges.bulkDelete(sharedEdgeIds),
      db.labels.bulkDelete(sharedLabelIds),
    ]);

    set({ user: null, session: null, isSuperuser: false });
  },
}));
