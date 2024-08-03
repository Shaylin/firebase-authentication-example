import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import React from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Firebase Authentication Example",
  description: "A simple application demonstrating sign up, userManagement and logout functionality.",
};

export default function RootLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
