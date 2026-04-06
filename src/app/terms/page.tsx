import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Grid Notes",
  description: "Grid Notes terms of service.",
};

export default function TermsPage() {
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
          Terms of Service
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
            title: "Acceptance of terms",
            body: "By using Grid Notes — either the web app or the Android application — you agree to these terms. If you do not agree, please do not use the service.",
          },
          {
            title: "Description of service",
            body: "Grid Notes is an infinite canvas note-taking tool. It is available as a free demo (limited to 5 notes, no account required), as a full web app (unlimited notes, account required for cloud sync), and as an Android application. The core experience is free to use.",
          },
          {
            title: "Local-first data",
            body: "By default, all your notes are stored locally on your device — in your browser's IndexedDB on the web, or in on-device storage on Android. We have no access to locally stored data. You are responsible for maintaining backups of locally stored notes using the export feature, as local data may be lost if browser storage is cleared.",
          },
          {
            title: "Cloud sync (optional)",
            body: "If you create an account and enable cloud sync, your notes are stored on our servers so you can access them across devices. You may disable sync and request deletion of your cloud data at any time by contacting us. Deleting your account permanently removes all associated cloud data.",
          },
          {
            title: "Your content",
            body: "You own all content you create in Grid Notes. We make no claim over your notes, labels, or connections. When cloud sync is enabled, we store your data solely to provide the sync service — it is never used for advertising, training AI models, or any other purpose.",
          },
          {
            title: "Export and portability",
            body: "You can export all your notes as a JSON file at any time. This works for both local and cloud-synced notes. We are committed to never locking your data into our platform.",
          },
          {
            title: "Acceptable use",
            body: "You agree to use Grid Notes only for lawful purposes. You may not attempt to reverse engineer, disrupt, or exploit the service or its infrastructure. You may not use the service to store or distribute unlawful content.",
          },
          {
            title: "Service availability",
            body: "We aim to keep the service available at all times but make no uptime guarantees. The local-first architecture means that even if our servers are unavailable, your locally stored notes remain fully accessible.",
          },
          {
            title: "Disclaimer of warranties",
            body: 'Grid Notes is provided "as is" without warranty of any kind. We do not guarantee that the service will be error-free or uninterrupted. We strongly recommend using the export feature to maintain your own backups.',
          },
          {
            title: "Limitation of liability",
            body: "To the maximum extent permitted by law, Grid Notes shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service, including loss of data. Our liability is limited to the amount you have paid us in the twelve months prior to the claim.",
          },
          {
            title: "Changes to terms",
            body: "We may update these terms as the service evolves. Account holders will be notified by email of any material changes. Continued use of Grid Notes after changes constitutes acceptance of the updated terms.",
          },
          {
            title: "Contact",
            body: "Questions about these terms? Contact us at info@gridnoteapp.com.",
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
