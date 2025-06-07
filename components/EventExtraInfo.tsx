// components/EventExtraInfo.tsx
"use client";
import ScheduleCard from "./ScheduleCard";
import VenueMapCard from "./VenueMapCard";
import TermsCard from "./TermsCard";
import ProhibitedItemsCard from "./ProhibitedItemsCard";
import styles from "./EventExtraInfo.module.css";

export default function EventExtraInfo({ location }: { location: string }) {
  return (
    <section className={styles.wrapper}>
      <ScheduleCard        location={location} />
      <VenueMapCard        location={location} />
      <TermsCard           location={location} />
      <ProhibitedItemsCard location={location} />
    </section>
  );
}
