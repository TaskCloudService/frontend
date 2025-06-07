// GPT4o made the carousel i added the rest
// Carousel shows tickeets in a swipeable format


"use client";

import React, { useState, TouchEvent } from "react";
import Ticket, { TicketProps } from "./TktDetails";
import styles from "./TktSwiper.module.css";

export default function TktSwiper({ tickets }: { tickets: TicketProps[] }) {
  const [idx, setIdx] = useState(0);

  if (tickets.length === 0) return null;
  if (tickets.length === 1) return <Ticket {...tickets[0]} />;

  const prev = () => setIdx(i => (i === 0 ? tickets.length - 1 : i - 1));
  const next = () => setIdx(i => (i === tickets.length - 1 ? 0 : i + 1));

  let startX = 0;
  const onTouchStart = (e: TouchEvent) => (startX = e.touches[0].clientX);
  const onTouchEnd   = (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
  };

  return (
    <div className={styles.slider}>
      <button onClick={prev} className={styles.nav} aria-label="Previous">‹</button>

      <div
        className={styles.viewport}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Ticket {...tickets[idx]} />
      </div>

      <button onClick={next} className={styles.nav} aria-label="Next">›</button>

      <div className={styles.dots}>
        {tickets.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`${styles.dot} ${i === idx ? styles.active : ""}`}
            aria-label={`Ticket ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
