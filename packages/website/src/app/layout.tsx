import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WebsiteLayout from "./components/WebsiteLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RobotComLab",
  description: "Modern LIMS Desktop Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WebsiteLayout>{children}</WebsiteLayout>
      </body>
    </html>
  );
}
