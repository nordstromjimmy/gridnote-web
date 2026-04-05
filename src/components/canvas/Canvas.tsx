"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  type OnConnect,
  ReactFlowProvider,
  useReactFlow,
  MarkerType,
  ConnectionMode,
  MiniMap,
} from "@xyflow/react";
import { useNoteStore } from "@/store/noteStore";
import NoteNode from "./NoteNode";
import CanvasControls from "./CanvasControls";
import AddNoteButton from "./AddNoteButton";
import SearchBar from "./SearchBar";
import CreateNoteDialog from "@/components/dialogs/CreateNoteDialog";
import NoteDialog from "@/components/dialogs/NoteDialog";
import type { Note, NoteLabel } from "@/lib/types";
import LabelNode from "./LabelNode";
import AddLabelButton from "./AddLabelButton";
import LabelDialog from "../dialogs/LabelDialog";
import CanvasHelp from "./CanvasHelp";

function noteToNode(note: Note, onOpen: (note: Note) => void): Node {
  return {
    id: note.id,
    type: "note",
    position: { x: note.x, y: note.y },
    data: { note, onOpen },
    draggable: !note.pinned,
    style: { width: note.width, height: note.height },
  };
}

function labelToNode(
  label: NoteLabel,
  onOpen: (label: NoteLabel) => void,
): Node {
  return {
    id: label.id,
    type: "label",
    position: { x: label.x, y: label.y },
    data: { label, onOpen },
    draggable: true,
    style: { width: label.width, height: label.height },
  };
}

function CanvasInner() {
  const {
    notes,
    labels,
    edges: storedEdges,
    addNote,
    addLabel,
    moveNote,
    moveLabel,
    updateNote,
    updateLabel,
    updateLabelFontSize,
    deleteNote,
    deleteLabel,
    resizeLabel,
    addEdge: addStoredEdge,
    deleteEdge,
  } = useNoteStore();

  const { screenToFlowPosition, setCenter } = useReactFlow();

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<NoteLabel | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const pendingPosition = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const nodeTypes = { note: NoteNode, label: LabelNode };

  // Define handleNoteOpen before the useEffect that references it.
  const handleNoteOpen = useCallback(
    (note: Note) => {
      setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
      setSelectedNote(note);
    },
    [setNodes],
  );

  const handleLabelOpen = useCallback(
    (label: NoteLabel) => {
      setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
      setSelectedLabel(label);
    },
    [setNodes],
  );

  // Single effect — syncs store notes to ReactFlow nodes.
  useEffect(() => {
    if (isDragging.current) return;
    const noteNodes = notes.map((n) => noteToNode(n, handleNoteOpen));
    const labelNodes = labels.map((l) => labelToNode(l, handleLabelOpen));
    setNodes([...noteNodes, ...labelNodes]);
  }, [notes, labels, setNodes, handleNoteOpen, handleLabelOpen]);

  // Sync stored edges to ReactFlow edges.
  useEffect(() => {
    setEdges(
      storedEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
        type: "default",
        animated: false,
        style: { stroke: "rgba(255,255,255,0.35)", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: "rgba(255,255,255,0.35)",
        },
      })),
    );
  }, [storedEdges, setEdges]);

  const onNodeDragStart = useCallback(() => {
    isDragging.current = true;
  }, []);

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, __: Node, draggedNodes: Node[]) => {
      isDragging.current = false;
      draggedNodes.forEach((n) => {
        // Check if it's a label or a note by looking at the type.
        if (n.type === "label") {
          moveLabel(n.id, n.position.x, n.position.y);
        } else {
          moveNote(n.id, n.position.x, n.position.y);
        }
      });
    },
    [moveNote, moveLabel],
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      if (connection.source === connection.target) return;
      addStoredEdge(
        connection.source,
        connection.target,
        connection.sourceHandle ?? undefined,
        connection.targetHandle ?? undefined,
      );
    },
    [addStoredEdge],
  );

  const onEdgeDoubleClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      deleteEdge(edge.id);
    },
    [deleteEdge],
  );

  const handleAddNote = useCallback(() => {
    const center = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    pendingPosition.current = { x: center.x - 100, y: center.y - 70 };
    setCreateOpen(true);
  }, [screenToFlowPosition]);

  const handleCreateConfirm = useCallback(
    async (data: { title: string; text: string; colorValue: string }) => {
      const pos = pendingPosition.current ?? { x: 0, y: 0 };
      await addNote({ ...data, x: pos.x, y: pos.y });
      pendingPosition.current = null;
    },
    [addNote],
  );

  const handleSave = useCallback(
    (id: string, changes: Partial<Note>) => {
      updateNote(id, changes);
      setSelectedNote((prev) =>
        prev?.id === id ? { ...prev, ...changes } : prev,
      );
    },
    [updateNote],
  );

  const handleSearchSelect = useCallback(
    (note: Note) => {
      setSelectedNote(note);
      setCenter(note.x + note.width / 2, note.y + note.height / 2, {
        zoom: 1.5,
        duration: 600,
      });
    },
    [setCenter],
  );

  const handleAddLabel = useCallback(() => {
    const center = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    addLabel(center.x - 40, center.y - 16);
  }, [screenToFlowPosition, addLabel]);

  const handleLabelSave = useCallback(
    (id: string, text: string, fontSize: "sm" | "md" | "lg") => {
      updateLabel(id, text);
      updateLabelFontSize(id, fontSize);
      setSelectedLabel((prev) =>
        prev?.id === id ? { ...prev, text, fontSize } : prev,
      );
    },
    [updateLabel, updateLabelFontSize],
  );

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        connectionMode={ConnectionMode.Loose}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        onEdgeDoubleClick={onEdgeDoubleClick}
        nodeTypes={nodeTypes}
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
        deleteKeyCode={null}
        selectionKeyCode="Control"
        multiSelectionKeyCode="Control"
        selectionOnDrag={false}
        fitView={false}
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={64}
          size={1}
          color="rgba(255,255,255,0.06)"
        />
        <CanvasControls />

        <MiniMap
          position="bottom-left"
          nodeColor={(node) => {
            const note = node.data?.note as { colorValue?: string } | undefined;
            return note?.colorValue ?? "#38464F";
          }}
          maskColor="rgba(0,0,0,0.6)"
          style={{
            backgroundColor: "#1A2530",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
          }}
          nodeStrokeWidth={0}
          pannable
          zoomable
        />
      </ReactFlow>

      <CanvasHelp />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        <AddNoteButton onAdd={handleAddNote} />
        <AddLabelButton onAdd={handleAddLabel} />
      </div>
      <SearchBar onSelect={handleSearchSelect} />

      <CreateNoteDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onConfirm={handleCreateConfirm}
      />

      <NoteDialog
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onSave={handleSave}
        onDelete={deleteNote}
      />
      <LabelDialog
        label={selectedLabel}
        onClose={() => setSelectedLabel(null)}
        onSave={handleLabelSave}
        onDelete={deleteLabel}
      />
    </div>
  );
}

export default function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
