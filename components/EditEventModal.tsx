import { useState, FormEvent, ChangeEvent } from "react"
import styles from "./EventsList.module.css"
import { useAuth } from "../contexts/AuthContext"

export interface Category {
  id: number
  name: string
}

export interface EventVM {
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

interface EditEventModalProps {
  event: EventVM
  categories: Category[]
  onClose: () => void
  onSave: (updated: EventVM) => void
}

export default function EditEventModal({
  event,
  categories,
  onClose,
  onSave,
}: EditEventModalProps) {
  const { accessToken } = useAuth()
  const EVENTS_BASE = process.env.NEXT_PUBLIC_EVENTS_URL!

  const [form, setForm] = useState<EventVM>({ ...event })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = <K extends keyof EventVM>(key: K, value: EventVM[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(event.imageUrl || null)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("id", form.id)
      formData.append("title", form.title)
      formData.append("date", form.date)
      formData.append("time", form.time)
      formData.append("location", form.location)
      formData.append("capacity", String(form.capacity))
      formData.append("ticketsSold", String(form.ticketsSold))
      formData.append("price", String(form.price))
      formData.append("status", String(form.status))
      if (form.category?.id) {
        formData.append("categoryId", String(form.category.id))
      }
      if (selectedImage) {
        formData.append("picture", selectedImage)
      }

      const res = await fetch(`${EVENTS_BASE}/api/events/${form.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error(`Save failed: ${res.status}`)

      const updated: EventVM = {
        ...form,
        imageUrl: selectedImage ? previewUrl ?? form.imageUrl : form.imageUrl,
        percent: form.capacity === 0 ? 0 : +(form.ticketsSold / form.capacity).toFixed(2),
      }

      onSave(updated)
      onClose()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Edit event</h2>
        <form onSubmit={handleSubmit} className={styles.editForm}>
          {error && <p className="error">{error}</p>}

          <label>
            Event Image
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className={styles.previewImage} />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={saving}
            />
          </label>

          <label>
            Title
            <input value={form.title} onChange={(e) => handleChange("title", e.target.value)} disabled={saving} />
          </label>

          <label>
            Date
            <input type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} disabled={saving} />
          </label>

          <label>
            Time
            <input type="time" value={form.time} onChange={(e) => handleChange("time", e.target.value)} disabled={saving} />
          </label>

          <label>
            Location
            <input value={form.location} onChange={(e) => handleChange("location", e.target.value)} disabled={saving} />
          </label>

          <label>
            Capacity
            <input type="number" value={form.capacity} onChange={(e) => handleChange("capacity", +e.target.value)} disabled={saving} />
          </label>

          <label>
            Price (€)
            <input type="number" step="0.01" value={form.price} onChange={(e) => handleChange("price", +e.target.value)} disabled={saving} />
          </label>

          <label>
            Status
            <select value={form.status} onChange={(e) => handleChange("status", +e.target.value)} disabled={saving}>
              <option value={0}>Draft</option>
              <option value={1}>Active</option>
              <option value={2}>Past</option>
            </select>
          </label>

          <label>
            Category
            <select
              value={form.category?.id ?? ""}
              onChange={(e) => {
                const cat = categories.find((c) => c.id === +e.target.value)
                handleChange("category", cat!)
              }}
              disabled={saving}
            >
              <option value="">— none —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryBtn} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
