import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "soNIC — AI Deal Matchmaking Platform",
  description:
    "soNIC accelerates Vietnam's innovation ecosystem by connecting startups with corporations, universities, research institutions, and investment funds through AI-powered matchmaking.",
  keywords: [
    "startup matchmaking", "Vietnam innovation", "AI deal matching", "NIC Vietnam",
    "startup investment", "open innovation", "kết nối startup", "hệ sinh thái đổi mới",
  ],
  openGraph: {
    title: "soNIC — AI Deal Matchmaking Platform",
    description: "Accelerating Vietnam's Innovation Ecosystem with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
