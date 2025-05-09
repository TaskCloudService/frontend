"use client"

import { SearchBar } from "../components/SearchBar"
import styles from "../styles/Topbar.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"

export function Topbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.pageInfo}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.welcomeMessage}>Hello Orlando, welcome back!</p>
      </div>

      <SearchBar />

      <div className={styles.userActions}>
        <button className={styles.iconButton}>
          <span className={styles.icon}>
            <span className="icon icon-bell"></span>
          </span>
        </button>
        <button className={styles.iconButton}>
          <span className={styles.icon}>
            <span className="icon icon-settings"><FontAwesomeIcon icon={faSignOutAlt} /></span>
          </span>
        </button>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <span>OL</span>
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>Orlando Laurentius</p>
            <p className={styles.userRole}>Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
