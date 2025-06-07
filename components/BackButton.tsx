"use client";

import { useRouter } from "next/navigation";
import styles from "./BackButton.module.css";


export default function BackButton() {
  const router = useRouter();

  const handleClick = () => {
    if (window.history.length > 1) router.back();
    else router.push("/events");
  };

  return (
    <button className={styles.btn} onClick={handleClick}>
      ← Back to events
    </button>
  );
}
