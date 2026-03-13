import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JalRakshak AI - Water Crisis Intelligence Platform",
  description: "AI-powered water crisis intelligence and solar-remediation planning platform for India. Solar-driven biological wastewater treatment with MPEC, ICPB, and SPB systems.",
  keywords: ["water treatment", "AI", "SDBWT", "MPEC", "ICPB", "SPB", "wastewater", "solar treatment", "India", "Indore", "JalRakshak"],
  authors: [{ name: "Ansh Sharma" }],
  openGraph: {
    title: "JalRakshak AI - Water Crisis Intelligence",
    description: "Protecting India's Water Future with AI-powered treatment recommendations",
    siteName: "JalRakshak AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JalRakshak AI - Water Crisis Intelligence",
    description: "AI-powered water crisis intelligence and solar-remediation planning",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
