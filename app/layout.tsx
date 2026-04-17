import type { Metadata } from "next";
import "./globals.css";

const APP_TITLE = "skill-share";
const APP_DESCRIPTION =
  "Internal Cars24 workspace for sharing, browsing, and downloading markdown-based AI skills.";

function getMetadataBase() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  try {
    return new URL(configuredUrl ?? "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  title: {
    default: APP_TITLE,
    template: "%s | skill-share",
  },
  description: APP_DESCRIPTION,
  metadataBase: getMetadataBase(),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    siteName: APP_TITLE,
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: APP_TITLE,
    description: APP_DESCRIPTION,
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
