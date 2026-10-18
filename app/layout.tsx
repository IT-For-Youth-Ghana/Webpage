import type { Metadata } from "next";

import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource-variable/playfair-display/wght.css";
// The hero headline sets its accented phrase in real Playfair italic. Without
// this face the browser synthesises an oblique by shearing the roman, which
// loses the calligraphic letterforms the treatment is built on.
import "@fontsource-variable/playfair-display/wght-italic.css";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://itforyouthghana.org"),
  title: {
    default: "IT For Youth Ghana",
    template: "%s | IT For Youth Ghana",
  },
  description:
    "Next.js rebuild foundation for IT For Youth Ghana, with a new public information architecture and CMS-ready scaffolding.",
  applicationName: "IT For Youth Ghana",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.svg",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
