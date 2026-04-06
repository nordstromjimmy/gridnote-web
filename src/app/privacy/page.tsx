import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Grid Notes",
  description:
    "Grid Notes privacy policy. Local-first by default, optional cloud sync when you choose.",
};

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen bg-[#111820] text-white"
      style={{ fontFamily: "'Outfit', 'Helvetica Neue', sans-serif" }}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Outfit:wght@300;400;500&display=swap');
        .display { font-family: 'Syne', sans-serif; }`}
      </style>

      <nav
        className="flex items-center justify-between px-8 md:px-12 py-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link href="/" className="display text-lg font-bold tracking-tight">
          Grid Notes
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-8 py-16">
        <h1 className="display text-4xl font-bold tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm mb-12" style={{ color: "rgba(255,255,255,0.3)" }}>
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {[
          {
            title: "Our approach",
            body: "Grid Notes is built on a local-first principle — your data lives on your device by default and never leaves it unless you explicitly choose to enable cloud sync. You are always in control of where your data lives.",
          },
          {
            title: "Local-only users (no account)",
            body: "If you use Grid Notes without creating an account, all your data — notes, labels, and connections — is stored exclusively in your browser's IndexedDB or, on Android, in the on-device Hive database. We have no access to this data whatsoever. Note that this data may be lost if you clear your browser storage, which is why we offer export and cloud sync options.",
          },
          {
            title: "Users with an account (optional sync)",
            body: "If you choose to create a Grid Notes account, your notes are synced to our cloud infrastructure (Supabase) so you can access them across multiple devices and browsers. This is entirely opt-in. Your data is stored securely and is only accessible to you — we enforce Row Level Security so no one, including us, can access another user's notes. You can export and delete your data at any time.",
          },
          {
            title: "Data we collect when you create an account",
            body: "When you create an account we collect your email address and a hashed password. We do not collect your name, location, phone number, or any other personal information. We do not build profiles, serve ads, or sell your data to any third party.",
          },
          {
            title: "Data we do not collect",
            body: "We do not use cookies for tracking, analytics tools, crash reporting services, or any third-party advertising infrastructure. The web app loads fonts from Google Fonts — this is the only external request made to a third party, and no user data is involved.",
          },
          {
            title: "Export and deletion",
            body: "You can export all your notes as a JSON file at any time using the export feature — no account required. If you have an account, you can request full deletion of your account and all associated data by contacting us. Deletion is permanent and irreversible.",
          },
          {
            title: "Data sharing",
            body: "We do not share your data with any third parties. Your notes are your notes. The only infrastructure your data touches when sync is enabled is Supabase, our database provider, which is hosted in the EU and complies with GDPR.",
          },
          {
            title: "Children's privacy",
            body: "Grid Notes does not knowingly collect information from children under 13. If you believe a child has provided personal information through our service, please contact us and we will delete it promptly.",
          },
          {
            title: "Changes to this policy",
            body: "We may update this policy as the product evolves, particularly as cloud sync and account features are rolled out. Changes will be reflected in the date at the top of this page. We will notify account holders of any material changes by email.",
          },
          {
            title: "Contact",
            body: "If you have questions about this privacy policy or want to request deletion of your data, please contact us at info@gridnoteapp.com.",
          },
        ].map((section) => (
          <section key={section.title} className="mb-10">
            <h2 className="display text-lg font-semibold mb-3 tracking-tight">
              {section.title}
            </h2>
            <p
              className="text-sm leading-relaxed font-light"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {section.body}
            </p>
          </section>
        ))}
      </main>

      <footer
        className="px-8 md:px-12 py-6 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          © {new Date().getFullYear()} Grid Notes. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
