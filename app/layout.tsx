// app/layout.tsx
import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Sidebar } from "../sections/Sidebar";
import { Topbar } from "../sections/Topbar";
import { Footer } from "../sections/Footer";
import { AuthProvider } from "../contexts/AuthContext";
import SignInModal from "../components/SignInModal";
import SignupModal from "../components/SignupModal";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { NotificationProvider } from "../contexts/NotificationContext";
import Script from "next/script";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Ventixe Dashboard",
  description: "Event Management Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          	<Script id="cookieyes" src="https://cdn-cookieyes.com/client_data/854c54b96ddb531fadaf43fc/script.js" strategy="beforeInteractive" />
        </header>
        <AuthProvider>
          <NotificationProvider>
          <div className="grid-layout">
            <div className="topbar-area">
              <Suspense fallback={<div>Loading...</div>}>
                <Topbar />
              </Suspense>
            </div>
            <div className="sidebar-area">
              <Sidebar />
            </div>
            <div className="main-content">
              <main className="content">{children}</main>
            </div>
            <div className="footer-area">
              <Footer />
            </div>
          </div>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
