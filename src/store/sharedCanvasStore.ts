import { create } from "zustand";
import type { SharedCanvas, CanvasMember } from "@/lib/types";
import * as canvasService from "@/lib/canvasService";

interface SharedCanvasStore {
  canvases: SharedCanvas[];
  activeCanvasId: string | null;
  members: CanvasMember[];
  loading: boolean;

  loadCanvases: (userId: string) => Promise<void>;
  setActiveCanvas: (id: string | null) => void;
  createCanvas: (name: string, userId: string) => Promise<SharedCanvas | null>;
  deleteCanvas: (id: string) => Promise<void>;
  loadMembers: (canvasId: string) => Promise<void>;
  removeMember: (canvasId: string, userId: string) => Promise<void>;
  createInviteLink: (
    canvasId: string,
    userId: string,
  ) => Promise<string | null>;
}

export const useSharedCanvasStore = create<SharedCanvasStore>((set, get) => ({
  canvases: [],
  activeCanvasId: null,
  members: [],
  loading: false,

  loadCanvases: async (userId) => {
    set({ loading: true });
    const canvases = await canvasService.getUserCanvases(userId);
    set({ canvases, loading: false });
  },

  setActiveCanvas: (id) => set({ activeCanvasId: id }),

  createCanvas: async (name, userId) => {
    const canvas = await canvasService.createSharedCanvas(name, userId);
    if (canvas) {
      set((s) => ({ canvases: [canvas, ...s.canvases] }));
    }
    return canvas;
  },

  deleteCanvas: async (id) => {
    await canvasService.deleteCanvas(id);
    set((s) => ({
      canvases: s.canvases.filter((c) => c.id !== id),
      activeCanvasId: s.activeCanvasId === id ? null : s.activeCanvasId,
    }));
  },

  loadMembers: async (canvasId) => {
    const members = await canvasService.getCanvasMembers(canvasId);
    set({ members });
  },

  removeMember: async (canvasId, userId) => {
    await canvasService.removeMember(canvasId, userId);
    set((s) => ({
      members: s.members.filter((m) => m.userId !== userId),
    }));
  },

  createInviteLink: async (canvasId, userId) => {
    return canvasService.createInviteLink(canvasId, userId);
  },
}));
