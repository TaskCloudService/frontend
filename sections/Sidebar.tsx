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
import styles from "./Sidebar.module.css"
import { useAuth } from "../contexts/AuthContext"

interface NavItem {
  id: string
  label: string
  icon: any
  path: string
}

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const allNavItems: NavItem[] = [
    // { id: "dashboard", label: "Dashboard", icon: fadHome, path: "/" },
    { id: "events", label: "Events", icon: faTicketAlt, path: "/events" },
    // { id: "bookings", label: "Bookings", icon: faClipboardList, path: "/bookings" },
    { id: "profile", label: "Profile", icon: faFileInvoice, path: "/profile" },
    { id: "mytickets", label: "Tickets", icon: faEnvelope, path: "/mytickets" },
    // { id: "calendar", label: "Calendar", icon: faCalendarAlt, path: "/calendar" },
    // { id: "financials", label: "Financials", icon: faDollarSign, path: "/financials" },
    // { id: "gallery", label: "Gallery", icon: faImages, path: "/gallery" },
    // { id: "feedback", label: "Feedback", icon: faStar, path: "/feedback" },
  ]

  const navItems = user
    ? allNavItems 
    : allNavItems.filter((item) => item.id === "events") 

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContainer}>
        <div className={styles.sidebarContentTop}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <a href="/">
                <img src="./images/logos/company-logo.svg" alt="Ventixe logo" />
              </a>
            </div>
            <h1 className={styles.logoText}>Ventixe</h1>
          </div>

          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {navItems.map((item) => {
                const isActive = pathname === item.path
                return (
                  <li
                    key={item.id}
                    className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                  >
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

        {user && (
          <div className={styles.sidebarContentBottom}>
            <div className={styles.sidebarFooter}>
            
              <button className={styles.signOutButton} onClick={logout}>
                <span className={styles.signOutIcon}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </span>
                <span className={styles.signOutText}>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
