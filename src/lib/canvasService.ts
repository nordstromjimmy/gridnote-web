import { supabase } from "./supabase";
import type { SharedCanvas, CanvasMember, CanvasInvite } from "./types";
import { v4 as uuidv4 } from "uuid";

export async function createSharedCanvas(
  name: string,
  userId: string,
): Promise<SharedCanvas | null> {
  const { data, error } = await supabase
    .from("canvases")
    .insert({ name, owner_id: userId })
    .select()
    .single();

  if (error) {
    console.error("createSharedCanvas error:", error);
    return null;
  }

  // Add owner as a member with role 'owner'
  await supabase.from("canvas_members").insert({
    canvas_id: data.id,
    user_id: userId,
    role: "owner",
  });

  return {
    id: data.id,
    name: data.name,
    ownerId: data.owner_id,
    createdAt: data.created_at,
  };
}

export async function getUserCanvases(userId: string): Promise<SharedCanvas[]> {
  const { data, error } = await supabase
    .from("canvases")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getUserCanvases error:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    ownerId: row.owner_id,
    createdAt: row.created_at,
  }));
}

export async function getCanvasMembers(
  canvasId: string,
): Promise<CanvasMember[]> {
  const { data: members, error } = await supabase
    .from("canvas_members")
    .select("*")
    .eq("canvas_id", canvasId);

  if (error) {
    console.error("getCanvasMembers error:", error);
    return [];
  }
  if (!members || members.length === 0) return [];

  const userIds = members.map((m) => m.user_id);

  // Use RPC to bypass RLS on the users table
  const { data: users } = await supabase.rpc("get_user_emails", {
    user_ids: userIds,
  });

  const emailMap = new Map(
    (users ?? []).map((u: { id: string; email: string }) => [u.id, u.email]),
  );

  return members.map((row) => ({
    id: row.id,
    canvasId: row.canvas_id,
    userId: row.user_id,
    role: row.role,
    email: emailMap.get(row.user_id) ?? row.user_id,
    joinedAt: row.joined_at,
  }));
}

export async function removeMember(
  canvasId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("canvas_members")
    .delete()
    .eq("canvas_id", canvasId)
    .eq("user_id", userId);

  if (error) console.error("removeMember error:", error);
}

export async function createInviteLink(
  canvasId: string,
  userId: string,
): Promise<string | null> {
  const token = uuidv4().replace(/-/g, "");

  const { error } = await supabase.from("canvas_invites").insert({
    canvas_id: canvasId,
    token,
    created_by: userId,
  });

  if (error) {
    console.error("createInviteLink error:", error);
    return null;
  }

  return token;
}

export async function getInviteByToken(
  token: string,
): Promise<CanvasInvite | null> {
  const { data, error } = await supabase
    .from("canvas_invites")
    .select("*")
    .eq("token", token)
    .single();

  if (error) {
    console.error("getInviteByToken error:", error);
    return null;
  }

  // Check expiry client-side
  if (new Date(data.expires_at) < new Date()) {
    console.log("Invite expired");
    return null;
  }

  return {
    id: data.id,
    canvasId: data.canvas_id,
    token: data.token,
    createdBy: data.created_by,
    expiresAt: data.expires_at,
    createdAt: data.created_at,
  };
}

export async function joinCanvas(
  canvasId: string,
  userId: string,
): Promise<boolean> {
  // Check if already a member
  const { data: existing } = await supabase
    .from("canvas_members")
    .select("id")
    .eq("canvas_id", canvasId)
    .eq("user_id", userId)
    .single();

  if (existing) return true; // already a member

  const { error } = await supabase.from("canvas_members").insert({
    canvas_id: canvasId,
    user_id: userId,
    role: "editor",
  });

  if (error) {
    console.error("joinCanvas error:", error);
    return false;
  }
  return true;
}

export async function deleteCanvas(canvasId: string): Promise<void> {
  const { error } = await supabase.from("canvases").delete().eq("id", canvasId);
  if (error) console.error("deleteCanvas error:", error);
}
