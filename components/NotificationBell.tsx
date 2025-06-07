"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useNotifications } from "../contexts/NotificationContext";
import NotificationModal from "./NotificationModal";
import styles from "./NotificationBell.module.css";

export default function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={styles.iconButton}
        aria-label="Notifications"
        onClick={() => setOpen((p) => !p)}
      >
        <span className={styles.icon}>
          <FontAwesomeIcon icon={faBell} />
        </span>

        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount}</span>
        )}
      </button>

      <NotificationModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
