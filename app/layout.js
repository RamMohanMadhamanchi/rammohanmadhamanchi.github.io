import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { education, site } from "@/content/site";
import { isPlaceholder } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/interactive/Cursor";
import { Providers } from "@/components/system/Providers";
import { InlineScript } from "@/components/system/InlineScript";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.formerRole} → ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Engineered to Evolve`,
    description: site.description,
    locale: "en",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} — ${site.role}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Engineered to Evolve`,
    description: site.description,
    images: ["/og.png"],
  },
};

export const viewport = {
  themeColor: "#0b0c0c",
  colorScheme: "dark",
};

// Decide before first paint whether the hero intro plays. It plays once
// per session, only on a direct visit to "/" without a hash, and never
// when the visitor prefers reduced motion.
const introGate = `(function(){try{var d=document.documentElement;if(location.pathname!=='/'||location.hash)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(sessionStorage.getItem('intro-played'))return;d.dataset.intro='play'}catch(e){}})();`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  ...(isPlaceholder(site.currentTitle) ? {} : { jobTitle: site.currentTitle }),
  worksFor: { "@type": "Organization", name: site.currentOrg },
  alumniOf: { "@type": "CollegeOrUniversity", name: education.institution },
  knowsAbout: ["Data engineering", "AI", "Multi-agent orchestration", "ETL", "Mechanical engineering"],
  url: site.url,
  sameAs: site.links.map((l) => l.href).filter((href) => href.startsWith("http")),
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="min-h-dvh bg-ink text-paper">
        <InlineScript html={introGate} />
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a
          href="#main"
          className="label sr-only bg-signal px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}
