// GPT4o helped with the map markers array which adds the icon onto the map

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import styles from "./VenueMapCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faParking,
  faRestroom,
  faUserShield,
  faPersonBooth,
  faStar,
  faFaceGrin,
  faChartArea,
  faBrain,
  faFirstAid,
  faInfo,
  faUtensils,
  faCircle} from "@fortawesome/free-solid-svg-icons";

type VenueMapEntry = {
  id: number;
  location: string;
  mapUrl: string;
};

type LegendItem = {
  icon: React.ReactNode; 
  label: string;
  color: string
};

type MapMarker = {
  id: number;
  icon: React.ReactNode;
  label: string;
  x: number;
  y: number; 
  colorClass: string; 
};

const mapMarkers: MapMarker[] = [
  {
    id: 1,
    icon: <FontAwesomeIcon icon={faParking} />,
    label: "Parking Area",
    x: 10,
    y: 20,
    colorClass: "icon-ticket",
  },
  {
    id: 2,
    icon: <FontAwesomeIcon icon={faRestroom} />,
    label: "Restroom",
    x: 30,
    y: 45,
    colorClass: "icon-restroom",
  },
 {
    id: 3,
    icon: <FontAwesomeIcon icon={faUserShield} />,
    label: "Security Checkpoint",
    x: 25,
    y: 20,
    colorClass: "icon-Shield",
  },
  {
    id: 4,
    icon: <FontAwesomeIcon icon={faPersonBooth} />,
    label: "Merchandise Booth",
    x: 35,
    y: 30,
    colorClass: "icon-Booth",
  },
  {
    id: 5,
    icon: <FontAwesomeIcon icon={faStar} />,
    label: "VIP Lounge",
    x: 45,
    y: 15,
    colorClass: "icon-Star",
  },
  {
    id: 6,
    icon: <FontAwesomeIcon icon={faFaceGrin} />,
    label: "Kid’s Zone",
    x: 55,
    y: 50,
    colorClass: "icon-Grin",
  },
  {
    id: 7,
    icon: <FontAwesomeIcon icon={faChartArea} />,
    label: "General Admission Area",
    x: 65,
    y: 60,
    colorClass: "icon-Area",
  },
  {
    id: 8,
    icon: <FontAwesomeIcon icon={faBrain} />,
    label: "Art Installations",
    x: 75,
    y: 25,
    colorClass: "icon-Brain",
  },
  {
    id: 9,
    icon: <FontAwesomeIcon icon={faFirstAid} />,
    label: "First Aid",
    x: 85,
    y: 70,
    colorClass: "icon-FirstAid",
  },
  {
    id: 10,
    icon: <FontAwesomeIcon icon={faInfo} />,
    label: "Information Booth",
    x: 20,
    y: 75,
    colorClass: "icon-Info",
  },
  {
    id: 11,
    icon: <FontAwesomeIcon icon={faUtensils} />,
    label: "Food Court",
    x: 40,
    y: 80,
    colorClass: "icon-Utensils",
  },
  {
    id: 12,
    icon: <FontAwesomeIcon icon={faCircle} />,
    label: "Main Stage",
    x: 60,
    y: 35,
    colorClass: "icon-Circle",
  },
];


export default function VenueMapCard({ location }: { location: string }) {
  const { accessToken } = useAuth();
  const [maps, setMaps] = useState<VenueMapEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const legendItems: LegendItem[] = [
  { icon: <FontAwesomeIcon icon={faParking} />, label: "Parking Area", color: "icon-ticket" },
  { icon: <FontAwesomeIcon icon={faRestroom} />, label: "Restrooms", color: "icon-restroom" },
  { icon: <FontAwesomeIcon icon={faUserShield} />, label: "Kid’s Zone", color: "icon-Shield" },
  { icon: <FontAwesomeIcon icon={faPersonBooth} />, label: "Security Checkpoints", color: "icon-Booth" },
  { icon: <FontAwesomeIcon icon={faStar} />, label: "Merchandise Booths", color: "icon-Star" },
  { icon: <FontAwesomeIcon icon={faFaceGrin} />, label: "VIP Lounge", color: "icon-Grin" },
  { icon: <FontAwesomeIcon icon={faChartArea} />, label: "General Admission Area", color: "icon-Area" },
  { icon: <FontAwesomeIcon icon={faBrain} />, label: "Art Installations Zone", color: "icon-Brain" },
  { icon: <FontAwesomeIcon icon={faFirstAid} />, label: "First Aid Station", color: "icon-FirstAid" },
  { icon: <FontAwesomeIcon icon={faInfo} />, label: "Information Booth", color: "icon-Info" },
  { icon: <FontAwesomeIcon icon={faUtensils} />, label: "Food & Beverage Area", color: "icon-Utensils" },
  { icon: <FontAwesomeIcon icon={faCircle} />, label: "Main Stage", color: "icon-Circle" },
];

  useEffect(() => {
    if (!accessToken) {
      setError("Please sign in to view the venue map.");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get<VenueMapEntry[]>(`/api/venue-map/${encodeURIComponent(location)}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setMaps(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load venue map:", err.response || err);
        if (err.response) {
          setError(
            `Error ${err.response.status}: ${
              (err.response.data as any)?.error || err.response.statusText
            }`
          );
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [location, accessToken]);

  if (loading) {
    return <div className={styles.card}>Loading map…</div>;
  }
  if (error) {
    return <div className={styles.card}>⚠️ {error}</div>;
  }
  if (maps.length === 0) {
    return <div className={styles.card}>No map found for “{location}.”</div>;
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Venue Map ({location})</h3>
      <div className={styles.mapWrapper}>
        {maps.map((m) => (
          <div key={m.id} className={styles.mapImageContainer}>
            <img
              src={m.mapUrl}
              alt={`Map for ${location}`}
              className={styles.image}
            />
            {mapMarkers.map((marker) => (
              <span
                key={marker.id}
                className={`${styles.mapDot} ${styles[marker.colorClass]}`}
                style={{ top: `${marker.y}%`, left: `${marker.x}%` }}
                title={marker.label}
              >
                {marker.icon}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.legendArea}>
        <h5>Legend</h5>
        <ul className={styles.legendList}>
          {legendItems.map((item, index) => (
            <li key={index} className={styles.legendItem}>
              <span className={`${styles.legendIcon} ${styles[item.color]}`}>
                {item.icon}
              </span>
              <span className={styles.legendLabel}>{item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
