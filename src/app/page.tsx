"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

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
        <polyline points="23,4 23,10 17,10" />
        <polyline points="1,20 1,14 7,14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
    title: "Sync across devices",
    desc: "Your notes stay in sync across all your devices. Pick up where you left off, anywhere.",
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
    <>
      <JsonLd />
      <div
        className="min-h-screen bg-[#111820] text-white overflow-x-hidden"
        style={{ fontFamily: "'Outfit', 'Helvetica Neue', sans-serif" }}
      >
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
        .display { font-family: 'Syne', sans-serif; }
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
        <nav className="flex items-center justify-end px-8 md:px-12 py-6 relative z-10">
          <Link
            href="/demo"
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
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-widest mb-7"
              style={{
                background: "rgba(84,110,122,0.2)",
                border: "1px solid rgba(84,110,122,0.4)",
                color: "#90A4AE",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#546E7A] inline-block" />
              Infinite canvas note-taking
            </div>

            <h1 className="display text-3xl md:text-4xl leading-none tracking-tight mb-6 font-bold">
              Grid Notes App{" "}
            </h1>

            {/* Main hero h1 — two lines */}
            <h1 className="display text-5xl md:text-7xl leading-none tracking-tight mb-6 font-bold">
              Think in space,{" "}
              <span style={{ color: "#607D8B" }}>not in lists.</span>
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
                href="/demo"
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
            {/* Features section heading */}
            <h2 className="display text-4xl md:text-5xl tracking-tight mb-3 font-bold">
              Everything you need,{" "}
              <span style={{ color: "#607D8B" }}>nothing you don&rsquo;t.</span>
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
                {/* Feature card titles */}
                <h3 className="display text-lg mb-2 tracking-tight font-semibold">
                  {f.title}
                </h3>
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
            {/* CTA heading */}
            <h2 className="display text-4xl md:text-5xl tracking-tight mb-4 leading-tight font-bold">
              Ready to think differently?
            </h2>
            <p
              className="text-base font-light mb-9"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Open the canvas and place your first note.
            </p>
            <Link
              href="/demo"
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
        {/* Footer */}
        <footer
          className="px-8 md:px-12 pt-12 pb-8 mt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Top row */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-10">
              {/* Brand */}
              <div className="flex flex-col gap-3 max-w-xs">
                <span className="display text-lg font-bold tracking-tight">
                  Grid Notes
                </span>
                <p
                  className="text-sm font-light leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  An infinite canvas for your ideas. Place notes anywhere, link
                  them together, and see the whole picture at once.
                </p>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-12">
                <div className="flex flex-col gap-3">
                  <span
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Product
                  </span>
                  <Link
                    href="/demo"
                    className="text-sm font-light transition-colors"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                    }
                  >
                    Try the demo
                  </Link>
                  {/*                 <a
      href="https://play.google.com/store"
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-light transition-colors"
      style={{ color: "rgba(255,255,255,0.5)" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
      }
    >
      Android app ↗
    </a> */}
                </div>

                <div className="flex flex-col gap-3">
                  <span
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Legal
                  </span>
                  <Link
                    href="/privacy"
                    className="text-sm font-light transition-colors"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                    }
                  >
                    Privacy policy
                  </Link>
                  <Link
                    href="/terms"
                    className="text-sm font-light transition-colors"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                    }
                  >
                    Terms of service
                  </Link>
                </div>

                <div className="flex flex-col gap-3">
                  <span
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Connect
                  </span>
                  <a
                    href="mailto:info@gridnoteapp.com"
                    className="text-sm font-light transition-colors"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                    }
                  >
                    Contact us
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span
                className="text-xs font-light"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                © {new Date().getFullYear()} Grid Notes. All rights reserved.
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
