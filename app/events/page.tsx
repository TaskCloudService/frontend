
"use client";


import React, { useEffect, useState } from "react";
import styles from "./EventsPage.module.css";
import EventsList from "../../components/EventsList";
import { AdminEventCreate } from "../../components/AdminEventCreate";
import { SearchBar } from "@/components/SearchBar";



export default function EventsPage() {
  const [filter, setFilter] = useState<"active" | "draft" | "past">("active");
  const [query, setQuery] = useState("");
  const [counts, setCounts] = useState({ active: 0, draft: 0, past: 0 });

  return (
    <div className={styles.wrapper}>
      <div className={styles.menuMainContent}>
        <div className={styles.menuLeft}>
          <button onClick={() => setFilter("active")} className={filter === "active" ? styles.activeButton : ""}>
            Active ({counts.active})
          </button>
          <button onClick={() => setFilter("draft")} className={filter === "draft" ? styles.activeButton : ""}>
            Draft ({counts.draft})
          </button>
          <button onClick={() => setFilter("past")} className={filter === "past" ? styles.activeButton : ""}>
            Past ({counts.past})
          </button>
          <AdminEventCreate />
        </div>
        <div className={styles.menuRight}>
          <SearchBar query={query} onQueryChange={setQuery} />
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.cards}>
          <EventsList filter={filter} query={query} onCountUpdate={setCounts} />
        </div>
      </div>
    </div>
  );
}
