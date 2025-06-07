// GPT4o helped with error handling 

"use client";

import React, { useEffect, useState } from "react";
import { useAuth }               from "../../contexts/AuthContext";
import TicketSlider              from "@/components/TktSwiper";
import type { TicketProps }      from "@/components/TktDetails";
import styles                    from "./page.module.css";
import ScheduleCard from "@/components/ScheduleCard";
import TermsCard from "@/components/TermsCard";
import VenueMapCard from "@/components/VenueMapCard";
import ProhibitedItemsCard from "@/components/ProhibitedItemsCard";

interface RawTicket {
  bookingId:     string;
  eventId:       string;
  eventTitle:    string;
  eventLocation: string;
  eventDate:     string;
  eventTime:     string;
  eventImage:    string;
  buyerName:     string;
  seat:          string;
  gate:          string;
  barcodeData:   string;
}

export default function MyTicketsPage() {
  const { accessToken }              = useAuth();
  const [rawTickets, setRawTickets]  = useState<RawTicket[]>([]);
  const [loading, setLoading]        = useState(true);
  const [error, setError]            = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const location = "Gothenburg";
  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);

    fetch("/api/tickets/my", {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
        return (await res.json()) as RawTicket[];
      })
      .then((data) => {
        setRawTickets(data);
        const ids = Array.from(new Set(data.map((t) => t.eventId)));
        setSelectedEventId(ids[0] || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (!accessToken)                   return <div>Please sign in.</div>;
  if (loading)                        return <div>Loading your tickets…</div>;
  if (error)                          return <div>Error loading tickets: {error}</div>;
  if (rawTickets.length === 0)        return <div>You have no tickets.</div>;

  const ticketsByEvent = rawTickets.reduce<Record<string, RawTicket[]>>((acc, t) => {
    (acc[t.eventId] ||= []).push(t);
    return acc;
  }, {});
  const eventIds = Object.keys(ticketsByEvent);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {eventIds.map((eventId) => {
          const { eventTitle } = ticketsByEvent[eventId][0];
          const isActive = eventId === selectedEventId;
          return (
            <button
              key={eventId}
              onClick={() => setSelectedEventId(eventId)}
              className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
            >
              {eventTitle}
            </button>
          );
        })}
      </div>

      {selectedEventId && (() => {
        const tickets = ticketsByEvent[selectedEventId]!;
        const { eventTitle, eventDate, eventTime, eventLocation } = tickets[0];

        return (
          <section>
            <div className={styles.tickets}>
            <TicketSlider
              tickets={tickets.map((t) => ({
                eventImage:    t.eventImage,
                eventTitle:    t.eventTitle,
                eventLocation: t.eventLocation,
                eventDate:     t.eventDate,
                eventTime:     t.eventTime,
                buyerName:     t.buyerName,
                bookingId:     t.bookingId,
                seat:          t.seat,
                gate:          t.gate,
              }))}
            />
            </div>

            <div className={styles.moreInfo}>
              <div>
              <ScheduleCard location={eventLocation} />
              </div>
              <div>
              <VenueMapCard location={eventLocation} />
              </div>
              <div>
              <TermsCard location={eventLocation} />
              </div>
              <div>
              <ProhibitedItemsCard location={eventLocation} />
              </div>
            </div>
          </section>
        );
      })()}
    </div>
  );
}
