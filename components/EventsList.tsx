// GPT4o made the calculations for the procentage bar
// And to add the props for the filter and query

"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import BookingButton from "./BookingButton"
import EditEventModal from "./EditEventModal"
import styles from "./EventsList.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircle, faEllipsisV, faLocation } from "@fortawesome/free-solid-svg-icons"
import router from "next/router"
import Link from "next/link"

interface Category {
  id: number
  name: string
}

interface EventsListProps {
  filter: "active" | "draft" | "past";
  query: string;
   onCountUpdate?: (counts: { active: number; draft: number; past: number }) => void;
}

interface EventVM {
  id: string
  title: string
  date: string
  time: string
  location: string
  capacity: number
  ticketsSold: number
  left: number
  percent: number  
  price: number
  status: number   
  imageUrl?: string 
  category?: Category
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ""
  let day: string, month: number, year: string

  if (dateString.includes("-")) {
    const parts = dateString.split("-")
    if (parts[0].length === 4) {
      year = parts[0]; month = +parts[1]; day = parts[2]
    } else {
      day = parts[0]; month = +parts[1]; year = parts[2]
    }
  } else if (dateString.includes(".")) {
    const parts = dateString.split(".")
    day = parts[0]; month = +parts[1]; year = parts[2]
  } else {
    return dateString
  }

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ]
  return `${day} ${monthNames[month-1]} ${year}`
}

export default function EventsList({ filter, query, onCountUpdate  }: EventsListProps) {
  const { accessToken, user } = useAuth()
  const isAdmin = user?.roles.includes("Admin")

  const [events,      setEvents]      = useState<EventVM[]>([])
  const [categories, setCategories]  = useState<Category[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState("")

  const [menuOpenId,   setMenuOpenId]   = useState<string|null>(null)
  const [deleteId,     setDeleteId]     = useState<string|null>(null)
  const [editingEvent, setEditingEvent] = useState<EventVM|null>(null)

  const EVENTS_BASE = process.env.NEXT_PUBLIC_EVENTS_URL!

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`${EVENTS_BASE}/api/events`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (!res.ok) throw new Error(`Failed to load events: ${res.status}`)
        const data: EventVM[] = await res.json()
        setEvents(data)

        const counts = {
        draft: data.filter((e) => e.status === 0).length,
        active: data.filter((e) => e.status === 1).length,
        past: data.filter((e) => e.status === 2).length,
      };

      onCountUpdate?.(counts);

        
        if (isAdmin) {
          const cRes = await fetch(`${EVENTS_BASE}/api/events/categories`, {
            credentials: "include",
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          if (cRes.ok) setCategories(await cRes.json())
        }
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [EVENTS_BASE, accessToken, isAdmin, onCountUpdate])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    try {
      const res = await fetch(`${EVENTS_BASE}/api/events/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
      setEvents((evts) => evts.filter((e) => e.id !== id))
    } catch (e: any) {
      alert(e.message)
    }
  }

  if (loading) return <div className={styles.loadingState}>Loading events…</div>
  if (error)   return <div className={styles.errorState}>{error}</div>
  if (!events.length) return <div className={styles.emptyState}>No events found.</div>

  const statusMap = {
    draft: 0,
    active: 1,
    past: 2,
  };

 const filteredEvents = events
  .filter((ev) => ev.status === statusMap[filter])
  .filter((ev) =>
    ev.title.toLowerCase().includes(query.toLowerCase())
  );


  return (
    <div className={styles.eventsContainer}>
      <ul className={styles.eventsList}>
        {filteredEvents.map((ev) => {
          const pct = Math.max(0, Math.min(100, ev.percent * 100))

          return (
            <li key={ev.id} className={styles.eventCard}>
              <Link href={`/events/${ev.id}`} className={styles.cardLink}>
              <div className={styles.eventImageWrapper}>
                <img
                  src={ev.imageUrl
                      ?? "/generic-event-celebration.png"}      
                  alt={ev.title}
                  className={styles.eventImage}
                />

                {ev.category && (
                  <span className={styles.categoryBadge}>
                    {ev.category.name}
                  </span>
                )}

                <span
                  className={`${styles.statusBadge} ${
                    styles[`status${["Draft","Active","Past"][ev.status]}`]
                  }`}
                >
                  <FontAwesomeIcon icon={faCircle} className={styles.statusDot}/>
                  <span className={styles.statusText}>
                    {["Draft","Active","Past"][ev.status]}
                  </span>
                </span>
              </div>

              <div className={styles.eventContent}>
                <p className={styles.eventDateTime}>
                  {formatDate(ev.date)} @ {ev.time.slice(0,5)}
                </p>
                <div className={styles.eventDetails}>
                  <h3 className={styles.eventTitle}>{ev.title}</h3>
                  <p className={styles.eventLocation}><span> <FontAwesomeIcon icon={faLocation} /></span>{ev.location}</p>
                </div>

                <div className={styles.progressWrapper}>
                  <div className={styles.fullProgressBar}>
                    <div
                      className={styles.soldTickets}
                      style={{ width: `${pct}%` }}
                      />
                  </div>
                  <span className={styles.progressPercent}>
                    {pct.toFixed(0)}%
                  </span>
                  <p className={styles.eventPrice}>€{ev.price.toFixed(2)}</p>
                </div>

                <div className={styles.ticketInfo}>
                  <div>

                  <p className={styles.ticketsLeft}>{ev.left} tickets left</p>
                  </div>
                </div>
              </div>
                  </Link>
                    <BookingButton eventId={ev.id} />
                      {isAdmin && (
                        <button
                          className={styles.adminMenuBtn}
                          onClick={() =>
                            setMenuOpenId(menuOpenId === ev.id ? null : ev.id)
                          }
                        >
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </button>
                      )}
      
                      {menuOpenId === ev.id && (
                        <div className={styles.adminMenu}>
                          <button onClick={() => {
                            setEditingEvent(ev)
                            setMenuOpenId(null)
                          }}>
                            Edit
                          </button>
                          <button onClick={() => {
                            setDeleteId(ev.id)
                            setMenuOpenId(null)
                          }}>
                            Delete
                          </button>
                        </div>
                      )}
            </li>
          )
        })}
      </ul>

      {deleteId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Confirm delete?</h2>
            <p>Are you sure you want to delete this event?</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteId(null)}>Cancel</button>
              <button
                onClick={() => {
                  handleDelete(deleteId)
                  setDeleteId(null)
                }}
                className={styles.primaryBtn}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

        {editingEvent && (
          <EditEventModal
            event={editingEvent}
            categories={categories}
            onClose={() => setEditingEvent(null)}
            onSave={(updated) =>
              setEvents((evs) =>
                evs.map((e) => (e.id === updated.id ? updated : e))
              )
            }
          />
      )}
    </div>
  )
}


