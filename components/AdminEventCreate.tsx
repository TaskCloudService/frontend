
"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Modal } from "./ui/Modal";
import styles from "./AdminEventCreate.module.css";

interface Category {
  id: number;
  name: string;
}

export function AdminEventCreate() {
  const { user, accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [cats, setCats] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    price: "",
    status: "Draft",
    categoryId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    fetch("/api/events/categories", {
      method: "GET",
      credentials: "include",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((data) => setCats(data))
      .catch(() => setCats([]));
  }, [open, accessToken]);

  if (!user?.roles?.includes("Admin")) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError("");

  if (!file) {
    setError("Please choose an image");
    return;
  }


  const enumMap: Record<string, number> = { Draft: 0, Active: 1, Past: 2 };

  
  const fd = new FormData();
  fd.append("Title",      form.title);
  fd.append("Date",       form.date);
  fd.append("Time",       form.time.length === 5 ? `${form.time}:00` : form.time);
  fd.append("Location",   form.location);
  fd.append("Capacity",   form.capacity);
  fd.append("Price",      form.price);
  fd.append("Status",     enumMap[form.status].toString());
  fd.append("CategoryId", form.categoryId);
  fd.append("Picture",    file);             
  if (!form.categoryId) {
  setError("Please choose a category");
  return;
}


  const res = await fetch("/api/events", {
    method: "POST",
    credentials: "include",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: fd,                
  });

  if (res.ok) {
    setOpen(false);
    window.location.reload();
  } else {
    const { error: msg } = await res.json().catch(() => ({}));
    setError(msg || "Failed to create event");
  }
};


  return (
    <>
      <button className={styles.openButton} onClick={() => setOpen(true)}>
        + Create Event
      </button>

      <Modal open={open} onOpenChange={setOpen}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>New Event</h2>

          <label>
            Poster / Image
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              required              
            />
          </label>


          <label>
            Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Date
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Time
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Location
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Capacity
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Price (€)
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option>Draft</option>
              <option>Active</option>
              <option>Past</option>
            </select>
          </label>

          <label>
            Category
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">— Select —</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">Create</button>
        </form>
      </Modal>
    </>
  );
}
