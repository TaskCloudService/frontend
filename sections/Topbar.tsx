"use client"

import { useState } from "react"
import styles from "./Topbar.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGear, faBars, faTimes } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "../contexts/AuthContext"
import SignInModal from "../components/SignInModal"
import SignupModal from "../components/SignupModal"
import NotificationBell from "../components/NotificationBell"
import MobileMenu from "../components/MobileMenu"

export function Topbar() {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.hamburgerWrapper}>
          <button 
            className={styles.hamburgerButton} 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
          </button>
        </div>
        
        <div className={styles.pageInfo}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.welcomeMessage}>{user ? `Hello ${user.email}, welcome back!` : `Welcome to Ventixe`}</p>
        </div>

        <div className={styles.userActions}>
          {user ? (
            <>
              
              <a href="/profile" className={`${styles.iconButton} ${styles.icon}`}>
                <FontAwesomeIcon icon={faGear} />
              </a>
              

              <NotificationBell />

              <div className={styles.userProfile}>
                <div className={styles.avatar}>
                  <span>{user.email[0].toUpperCase()}</span>
                </div>
                <div className={styles.userInfo}>
                  <p className={styles.userName}>{user.email}</p>
                  <p className={styles.userRole}>{user.roles?.join(", ")}</p>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.authButtons}>
              <SignInModal />
              <SignupModal />
            </div>
          )}
        </div>
      </header>
      
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} user={user} />
    </>
  )
}

