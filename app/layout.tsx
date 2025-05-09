import type React from "react"
import type { Metadata } from "next"
import { Sidebar } from "../sections/Sidebar"
import { Topbar } from "../sections/Topbar"
import { Footer } from "../sections/Footer"
import { Suspense } from 'react';
import "./globals.css"
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"

config.autoAddCss = false

export const metadata: Metadata = {
  title: "Ventixe Dashboard",
  description: "Event Management Dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  )
}
