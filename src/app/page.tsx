"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const DEMO_NOTES = [
  {
    id: 1,
    title: "Q4 Roadmap",
    text: "Finalize feature list and assign owners before end of month.",
    color: "#3D5A47",
    x: 60,
    y: 80,
    w: 200,
    h: 130,
    delay: 0,
  },
  {
    id: 2,
    title: "Design Review",
    text: "Update component library and review spacing tokens.",
    color: "#4A3F5C",
    x: 310,
    y: 40,
    w: 190,
    h: 120,
    delay: 120,
  },
  {
    id: 3,
    title: "Standup Notes",
    text: "Blocked on API — need credentials from backend team.",
    color: "#38464F",
    x: 550,
    y: 90,
    w: 195,
    h: 115,
    delay: 240,
  },
  {
    id: 4,
    title: "Ideas",
    text: "Infinite scroll, keyboard nav, dark mode toggle.",
    color: "#5C3F3F",
    x: 140,
    y: 255,
    w: 205,
    h: 130,
    delay: 80,
  },
  {
    id: 5,
    title: "Reading List",
    text: "A Pattern Language — Christopher Alexander",
    color: "#4A4A2E",
    x: 400,
    y: 230,
    w: 185,
    h: 100,
    delay: 200,
  },
  {
    id: 6,
    title: "Sprint 12",
    text: "Auth, canvas perf, export — ship by Friday.",
    color: "#2E4A4A",
    x: 620,
    y: 260,
    w: 175,
    h: 110,
    delay: 160,
  },
];

const FEATURES = [
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
      </svg>
    ),
    title: "Infinite canvas",
    desc: "A 20,000 × 20,000 grid. Place notes anywhere and zoom from overview to detail in one scroll.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    title: "Link notes",
    desc: "Draw arrows between notes to show relationships, dependencies, and flow of ideas.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: "Instant search",
    desc: "Find any note by title or content. The canvas flies to it automatically.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
      </svg>
    ),
    title: "Pin & organise",
    desc: "Pin important notes in place. Use labels to mark groups and regions of your canvas.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "Works offline",
    desc: "All notes are stored locally on your device. No account, no internet required.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7,10 12,15 17,10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: "Export your data",
    desc: "Export all notes as JSON any time. Your data is always yours.",
  },
];

export default function LandingPage() {
  const [notesVisible, setNotesVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHeroVisible(true), 100);
    const t2 = setTimeout(() => setNotesVisible(true), 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-[#111820] text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        .serif { font-family: 'DM Serif Display', serif; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
        }
        .fade-up {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .note-in {
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
      `}</style>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 md:px-12 py-6 relative z-10">
        <span className="serif text-xl tracking-tight">Grid Notes</span>
        <Link
          href="/canvas"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
          style={{ backgroundColor: "#546E7A" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#607D8B")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#546E7A")
          }
        >
          Open canvas
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative px-8 md:px-12 pt-12 pb-20 max-w-6xl mx-auto">
        <div className="grid-bg absolute inset-0 pointer-events-none" />

        {/* Text */}
        <div
          className={`fade-up relative z-10 max-w-2xl ${heroVisible ? "visible" : ""}`}
        >
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-widest mb-7"
            style={{
              background: "rgba(84,110,122,0.2)",
              border: "1px solid rgba(84,110,122,0.4)",
              color: "#90A4AE",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#546E7A] inline-block" />
            Infinite canvas note-taking
          </div>

          <h1 className="serif text-5xl md:text-7xl leading-none tracking-tight mb-6">
            Think in space,{" "}
            <span className="italic" style={{ color: "#607D8B" }}>
              not in lists.
            </span>
          </h1>

          <p
            className="text-lg leading-relaxed font-light mb-10 max-w-md"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            An infinite grid canvas where you place notes wherever they make
            sense. Link ideas, group concepts, and see the whole picture at
            once.
          </p>

          <div className="flex items-center gap-5 flex-wrap">
            <Link
              href="/canvas"
              className="flex items-center gap-2.5 px-9 py-4 rounded-2xl text-base font-semibold text-white transition-all active:scale-95"
              style={{ backgroundColor: "#546E7A" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "#607D8B";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "#546E7A";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(0)";
              }}
            >
              Try it free
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12,5 19,12 12,19" />
              </svg>
            </Link>
            <span
              className="text-sm font-light"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              No account required
            </span>
          </div>
        </div>

        {/* Canvas preview */}
        <div
          className={`fade-up relative z-10 mt-16 rounded-2xl overflow-hidden ${heroVisible ? "visible" : ""}`}
          style={{
            height: 420,
            backgroundColor: "#1E272C",
            border: "1px solid rgba(255,255,255,0.08)",
            transitionDelay: "200ms",
          }}
        >
          {/* Grid inside preview */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
              linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
            `,
              backgroundSize: "48px 48px",
            }}
          />

          {/* Connector lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker
                id="arr"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path
                  d="M2 2L8 5L2 8"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </marker>
            </defs>
            <path
              d="M 260 145 C 260 195 310 195 310 255"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
              markerEnd="url(#arr)"
            />
            <path
              d="M 505 100 C 505 160 550 160 550 200"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
              markerEnd="url(#arr)"
            />
          </svg>

          {/* Demo notes */}
          {DEMO_NOTES.map((note) => (
            <div
              key={note.id}
              className="note-in absolute rounded-[10px] overflow-hidden"
              style={{
                left: note.x,
                top: note.y,
                width: note.w,
                height: note.h,
                backgroundColor: note.color,
                opacity: notesVisible ? 1 : 0,
                transform: notesVisible
                  ? "translateY(0) scale(1)"
                  : "translateY(16px) scale(0.96)",
                transitionDelay: `${note.delay}ms`,
                padding: "10px 12px",
              }}
            >
              <p className="text-white text-[13px] font-bold mb-1.5 truncate">
                {note.title}
              </p>
              <p
                className="text-[11.5px] leading-relaxed overflow-hidden"
                style={{
                  color: "rgba(255,255,255,0.65)",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {note.text}
              </p>
            </div>
          ))}

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: "linear-gradient(transparent, #1E272C)" }}
          />
        </div>
      </section>

      {/* Features */}
      <section className="px-8 md:px-12 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="serif text-4xl md:text-5xl tracking-tight mb-3">
            Everything you need,{" "}
            <span className="italic" style={{ color: "#607D8B" }}>
              nothing you don&rsquo;t.
            </span>
          </h2>
          <p
            className="text-base font-light"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Built for people who think spatially.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-7 transition-all duration-200 cursor-default"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(255,255,255,0.055)";
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(255,255,255,0.03)";
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(255,255,255,0.07)";
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: "rgba(84,110,122,0.18)",
                  color: "#78909C",
                }}
              >
                {f.icon}
              </div>
              <h3 className="serif text-lg mb-2 tracking-tight">{f.title}</h3>
              <p
                className="text-sm leading-relaxed font-light"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-12 pb-24 max-w-6xl mx-auto">
        <div
          className="rounded-3xl p-16 text-center"
          style={{
            background: "rgba(84,110,122,0.1)",
            border: "1px solid rgba(84,110,122,0.2)",
          }}
        >
          <h2 className="serif text-4xl md:text-5xl tracking-tight mb-4 leading-tight">
            Ready to think differently?
          </h2>
          <p
            className="text-base font-light mb-9"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Open the canvas and place your first note.
          </p>
          <Link
            href="/canvas"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-semibold text-white transition-all active:scale-95"
            style={{ backgroundColor: "#546E7A" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "#607D8B";
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "#546E7A";
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(0)";
            }}
          >
            Open Grid Notes
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12,5 19,12 12,19" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="flex items-center justify-between flex-wrap gap-3 px-8 md:px-12 py-7"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span
          className="serif text-base"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Grid Notes
        </span>
        <span
          className="text-sm font-light"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          No tracking. No ads. No cloud.
        </span>
      </footer>
    </div>
  );
}
