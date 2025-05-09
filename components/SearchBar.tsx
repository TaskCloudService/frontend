// components/SearchBar.tsx
'use client'

import { useEffect, useState } from 'react'
import styles from '../styles/Topbar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export function SearchBar() {
  // Use state to control rendering
  const [isClient, setIsClient] = useState(false)
  
  // Only render after component mounts on client
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Return null during SSR
  if (!isClient) {
    return <div className={styles.searchContainer}></div> // Empty placeholder during SSR
  }
  
  // Actual component only rendered on client
  return (
    <div className={styles.searchContainer}>
      <input type="text" className={styles.searchInput} placeholder="Search anything" />
      <button className={styles.searchButton}>
        <span className={styles.searchIcon}>
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </button>
    </div>
  )
}