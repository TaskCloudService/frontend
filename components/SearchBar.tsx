'use client'

import { useEffect, useState } from 'react'
import styles from './SearchBar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function SearchBar({ query, onQueryChange }: SearchBarProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className={styles.searchContainer}></div>;
  }

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search anything"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <button className={styles.searchButton}>
        <span className={styles.searchIcon}>
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </button>
    </div>
  );
}
