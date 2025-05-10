"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome as fadHome,
  faCalendarAlt,
  faFileInvoice,
  faEnvelope,
  faTicketAlt,
  faDollarSign,
  faImages,
  faStar,
  faClipboardList,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons"
import styles from "../styles/Sidebar.module.css"

interface NavItem {
  id: string
  label: string
  icon: any
  path: string
}

export function Sidebar() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: fadHome, path: "/" },
    { id: "bookings", label: "Bookings", icon: faClipboardList, path: "/bookings" },
    { id: "invoices", label: "Invoices", icon: faFileInvoice, path: "/invoices" },
    { id: "inbox", label: "Inbox", icon: faEnvelope, path: "/inbox" },
    { id: "calendar", label: "Calendar", icon: faCalendarAlt, path: "/calendar" },
    { id: "events", label: "Events", icon: faTicketAlt, path: "/events" },
    { id: "financials", label: "Financials", icon: faDollarSign, path: "/financials" },
    { id: "gallery", label: "Gallery", icon: faImages, path: "/gallery" },
    { id: "feedback", label: "Feedback", icon: faStar, path: "/feedback" },
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContainer}>
          <div className={styles.sidebarContentTop}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <a href="/">
                <img src="./images/logos/company-logo.svg" alt="" />
                </a>
              </div>
              <h1 className={styles.logoText}>Ventixe</h1>
            </div>

            <nav className={styles.nav}>
              <ul className={styles.navList}>
                {navItems.map((item) => {
                  const isActive = pathname === item.path
                  return (
                    <li key={item.id} className={`${styles.navItem} ${isActive ? styles.active : ""}`}>
                      <Link href={item.path} className={styles.navLink}>
                        <span className={styles.navIcon}>
                          <FontAwesomeIcon icon={item.icon} />
                        </span>
                        <span className={styles.navLabel}>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

        <div className={styles.sidebarContentBottom}>
          <div className={styles.sidebarFooter}>
            <div className={styles.promoBox}>
              <div className={styles.promoImage}>
                <img src="/mobile-app-illustration.png" alt="Mobile app" />
              </div>
              <p className={styles.promoText}>
                Experience enhanced features and a smoother interface with the latest version of Ventixe
              </p>
              <button className={styles.promoButton}>Try New Version</button>
            </div>

            <button className={styles.signOutButton}>
              <span className={styles.signOutIcon}>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </span>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
