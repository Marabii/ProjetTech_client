import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import React from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "Projet Tech",
//   description: "This is the interface of our ProjetTech project",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        {/* Header */}
        <header className="bg-white shadow-md py-4">
          <div className="container mx-auto flex justify-between items-center px-6">
            <Link href="/">
              <h1 className="text-2xl font-bold">Projet Tech</h1>
            </Link>
            <nav className="flex space-x-4">
              <Link
                href="/stats"
                className="text-lg  text-gray-700 hover:text-blue-500"
              >
                Statistiques
              </Link>
              <Link
                href="/admin"
                className="text-lg  text-gray-700 hover:text-blue-500"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>
        {/* Main content */}
        <main className="container mx-auto mt-6 px-6">{children}</main>
      </body>
    </html>
  );
}
