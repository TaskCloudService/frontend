// GPT4o gave suggestions for the barcode

"use client";

import React from "react";
import Barcode from "react-barcode";
import styles from "./TiktDetails.module.css";

export interface TicketProps {
  eventImage?: string;
  eventTitle: string;
  eventLocation: string;
  eventDate: string;  
  eventTime: string;  
  buyerName: string;
  bookingId: string;
  seat: string;
  gate: string;
}

export default function TktDetails({
  eventImage,
  eventTitle,
  eventLocation,
  eventDate,
  eventTime,
  buyerName,
  bookingId,
  seat,
  gate,
}: TicketProps) {
  return (
    <div className={styles.ticket}>
      <div className={styles.left}>
        <img
          src={eventImage || "/generic-event-celebration.png"}
          alt={eventTitle}
        />
        <div className={styles.SubText}>
          <h3>{eventTitle}</h3>
        </div>
      </div>

      <div className={`${styles.middle} ${styles["mask-inward"]}`}>
        <div className={styles.ticketUpperMiddle}>
          <div className={styles.ticketUpperMiddleTop}>
          <p><span>Name: </span>{buyerName || "Guest"}</p>
          <p><span>Booking ID:</span> {bookingId.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className={styles.ticketUpperMiddleBottom}>
          <p><span>Seat:</span> {seat}</p>
          <p><span>Gate:</span> {gate}</p>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.ticketDownerMiddle}>
          <div>
            <p className={styles.location}><span>Location: </span>{eventLocation}</p>
          </div>
          <div className={styles.dateTime}>
            <p>
              <span>Date: </span>
              {new Date(eventDate).toLocaleDateString()}
            </p>
            <p>
              <span>Time: </span>
              {eventTime}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <p className={styles.rightTextUpper}><strong>Scan to Enter</strong></p>
        <Barcode value={bookingId}  height={100} width={0.5} displayValue={false} background="transparent" className={styles.barcode} />
        <p className={styles.rightTextDowner}>
          Thank you for your purchase!<br />
          Enjoy the festival and experience the rhythm like never before.
        </p>
      </div>
    </div>
  );
}
