// GPT4o Helped error handling with the props

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import SignInModal from "./SignInModal";
import { Modal } from "./ui/Modal";
import NumberInput from "./NumberInput";
import { ProfileForm } from "./ProfileForm";
import styles from "./BookingButton.module.css";

interface Props {
  eventId: string;
  className?: string;
}

export default function BookingButton({ eventId, className = "" }: Props) {
  const { user, accessToken } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showQty, setShowQty] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [qty, setQty] = useState(1);

  async function handleClick() {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const res = await fetch("/api/profile", {
      method: "GET",
      credentials: "include",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      setShowProfileModal(true);
      return;
    }

    const { data } = await res.json();

    const hasProfile =
      data?.firstName &&
      data?.lastName &&
      data?.address?.line1 &&
      data?.address?.city &&
      data?.address?.postalCode;

    if (!hasProfile) {
      setShowProfileModal(true);
    } else {
      setShowQty(true);
    }
  }

  async function confirm() {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ eventId, qty }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message ?? "Unable to create booking");
      }

      const { id } = await res.json();
      router.push(`/mytickets`);
    } catch (err: any) {
      alert(err.message ?? "Booking failed");
    } finally {
      setLoading(false);
      setShowQty(false);
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`${styles.button} ${className}`}
      >
        {loading ? "Booking…" : "Book tickets"}
      </button>

      <SignInModal open={showLogin} onClose={() => setShowLogin(false)} />

      <Modal open={showQty} onOpenChange={setShowQty}>
        <div className={styles.modalBody}>
          <h3 className={styles.modalTitle}>Select quantity</h3>
          <NumberInput value={qty} min={1} max={10} onChange={setQty} />
          <div className={styles.actions}>
            <button className={styles.button} onClick={() => setShowQty(false)}>
              Cancel
            </button>
            <button
              className={styles.button}
              onClick={confirm}
              disabled={loading}
            >
              {loading ? "Booking…" : "Confirm"}
            </button>
          </div>
        </div>
      </Modal>


      <ProfileForm
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setTimeout(() => {
            handleClick(); 
          }, 500);
        }}
      />
    </>
  );
}

