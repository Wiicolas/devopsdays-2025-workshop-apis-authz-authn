import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SessionCheck } from "./session-check";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { TopBar } from "@/components/top-bar";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
});


export const metadata: Metadata = {
  title: "DevOpsBeerer Backoffice",
  description: "Backoffice of beers",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <SessionCheck />
          <TopBar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
