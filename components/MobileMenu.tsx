"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome as fadHome,
  faFileInvoice,
  faEnvelope,
  faTicketAlt,
  faClipboardList,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons"
import styles from "./MobileMenu.module.css"
import { useAuth } from "../contexts/AuthContext"

interface NavItem {
  id: string
  label: string
  icon: any
  path: string
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

export default function MobileMenu({ isOpen, onClose, user }: MobileMenuProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

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

  const navItems = user ? allNavItems : allNavItems.filter((item) => item.id === "events")

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isOpen && target.classList.contains(styles.menuOverlay)) {
        onClose()
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isOpen, onClose])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

    const handleLinkClick = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={styles.menuOverlay}>
      <div className={`${styles.menuContainer} ${isOpen ? styles.open : ""}`}>
        <div className={styles.sidebarContainer}>
          <div className={styles.sidebarContentTop}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <Link href="/" onClick={handleLinkClick}>
                  <img src="https://pavadoblob.blob.core.windows.net/event-images/company-logo.svg" alt="Ventixe logo" />
                </Link>
              </div>
              <h1 className={styles.logoText}>Ventixe</h1>
            </div>

            <nav className={styles.nav}>
              <ul className={styles.navList}>
                {navItems.map((item) => {
                  const isActive = pathname === item.path
                  return (
                    <li key={item.id} className={`${styles.navItem} ${isActive ? styles.active : ""}`}>
                      <Link href={item.path} className={styles.navLink} onClick={handleLinkClick}>
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
                <button
                  className={styles.signOutButton}
                  onClick={() => {
                    logout()
                    onClose()
                  }}
                >
                  <span className={styles.signOutIcon}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                  </span>
                  <span className={styles.signOutText}>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
