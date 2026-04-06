export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Grid Notes",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Android, Web",
    description:
      "An infinite canvas note-taking app. Place notes anywhere on a zoomable grid, link ideas together, and see the whole picture at once.",
    url: "https://gridnoteapp.com",
    author: {
      "@type": "Organization",
      name: "Grid Notes",
      url: "https://gridnoteapp.com",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free to use, no account required",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
