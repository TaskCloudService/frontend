"use client";

import { useNotifications } from "../contexts/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "./NotificationModal.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NotificationModal({ open, onClose }: Props) {
  const { notifications, markRead, deleteNotification } = useNotifications();

  if (!open) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>Notifications</h2>
          <button onClick={onClose} aria-label="Close">&times;</button>
        </header>

        {notifications.length === 0 ? (
          <p className={styles.empty}>No notifications 🎉</p>
        ) : (
          <ul className={styles.list}>
            {notifications.map((n) => (
              <li key={n.id} className={n.read ? styles.read : styles.unread}>
                <div className={styles.content}>
                  <h3>{n.title}</h3>
                  {n.message && <p>{n.message}</p>}
                  <small>
                    {new Date(n.createdUtc).toLocaleString(undefined, {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </small>
                </div>

                <div className={styles.actions}>
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      title="Mark as read"
                      className={styles.iconBtn}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    title="Delete"
                    className={styles.iconBtn}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
