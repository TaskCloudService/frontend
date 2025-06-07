"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Modal } from "./ui/Modal"; 
import styles from "./ProfileForm.module.css";

interface FormState {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const ProfileForm = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const { accessToken, logout } = useAuth();

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [isNew, setIsNew] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.ok) {
          const { success, data } = await res.json();
          if (success && data) {
            setIsNew(false);
            setForm({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              phoneNumber: data.phoneNumber || "",
              line1: data.address?.line1 || "",
              line2: data.address?.line2 || "",
              city: data.address?.city || "",
              state: data.address?.state || "",
              postalCode: data.address?.postalCode || "",
              country: data.address?.country || "",
            });
          }
        } else {
          const body = await res.json().catch(() => ({}));
          setError(body.message || body.error || "Server error");
        }
      } catch {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const method = isNew ? "POST" : "PUT";

    const res = await fetch("/api/profile", {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        address: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
        },
      }),
    });

    if (res.ok) {
      onClose(); 
    } else {
      const { error: msg } = await res.json();
      setError(msg || "Failed to save");
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
         <h2 className={styles.heading}>
            {isNew ? "Complete Your Profile" : "Edit Your Profile"}
          </h2>

          <fieldset className={styles.fieldset}>
              <legend>Personal Info</legend>

              <label htmlFor="firstName" className={styles.label}>First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className={styles.input}
                value={form.firstName}
                onChange={handleChange}
                required
              />

              <label htmlFor="lastName" className={styles.label}>Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className={styles.input}
                value={form.lastName}
                onChange={handleChange}
                required
              />

              <label htmlFor="phoneNumber" className={styles.label}>Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                className={styles.input}
                value={form.phoneNumber}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Address</legend>

              <label htmlFor="line1" className={styles.label}>Address Line 1</label>
              <input
                id="line1"
                name="line1"
                type="text"
                className={styles.input}
                value={form.line1}
                onChange={handleChange}
                required
              />

              <label htmlFor="line2" className={styles.label}>Address Line 2</label>
              <input
                id="line2"
                name="line2"
                type="text"
                className={styles.input}
                value={form.line2}
                onChange={handleChange}
              />

              <div className={styles.row}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="city" className={styles.label}>City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className={styles.input}
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label htmlFor="state" className={styles.label}>State/Province</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    className={styles.input}
                    value={form.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="postalCode" className={styles.label}>Postal Code</label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    className={styles.input}
                    value={form.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label htmlFor="country" className={styles.label}>Country</label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    className={styles.input}
                    value={form.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </fieldset>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.buttonSubmit} disabled={saving}>
              {isNew ? "Save Profile" : "Update Profile"}
            </button>
            <button type="button" className={styles.buttonCancel} onClick={onClose}>
              Cancel
            </button>
          </div>

        </form>
      )}
    </Modal>
  );
};
