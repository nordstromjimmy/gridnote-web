"use client";

import { useEffect } from "react";
import { useNoteStore } from "@/store/noteStore";
import Canvas from "@/components/canvas/Canvas";

export default function Home() {
  const init = useNoteStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <main className="w-screen h-screen overflow-hidden">
      <Canvas />
    </main>
  );
}
