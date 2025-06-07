import EventExtraInfo from "@/components/EventExtraInfo";
import BookingButton   from "@/components/BookingButton";
import { notFound }    from "next/navigation";
import styles from "./EventPageId.module.css"; 
import BackButton from "@/components/BackButton";

interface EventVM {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  ticketsSold: number;
  price: number;
}

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_EVENTS_URL}/api/events/${params.id}`,
    { cache: "no-cache" }
  );

  if (!res.ok) return notFound();

  const ev: EventVM = await res.json();
  const pct = Math.round((ev.ticketsSold / ev.capacity) * 100);

  return (
    <div className={styles.wrapper}>
        <BackButton />
        <div className={styles.topContent}>
            <h1>Event Details:</h1>
            <h2>{ev.title}</h2>

            <BookingButton eventId={ev.id} />
        </div>
        <div className={styles.bottomContent}>
        <EventExtraInfo location={ev.location} />
        </div>
    </div>
  );
}
