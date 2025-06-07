"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { ProfileForm } from "../../components/ProfileForm";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "delete">("profile");
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const { accessToken, logout } = useAuth();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("This will permanently delete your account. Continue?")) return;

    try {
      setDeleting(true);
      const res = await fetch("/api/profile", {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.ok) {
        await logout();
        router.push("/goodbye");
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error || body.detail || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      setError(err.message ?? "Network error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.menu}>
        <button
          onClick={() => setActiveTab("profile")}
          className={`${styles.tabButton} ${activeTab === "profile" ? styles.tabButtonActive : ""}`}
        >
          Profile Info
        </button>

        <button
          onClick={() => setActiveTab("delete")}
          className={`${styles.tabButton} ${activeTab === "delete" ? styles.tabButtonActive : ""}`}
        >
          Delete Account
        </button>
      </nav>

      <div className={styles.content}>
        {activeTab === "profile" && (
          <>
            <button className={styles.profileButton} onClick={() => setShowModal(true)}>Edit Profile</button>
            <ProfileForm isOpen={showModal} onClose={() => setShowModal(false)} />
          </>
        )}

        {activeTab === "delete" && (
          <div className={styles.deleteAccount}>
            <h2>Delete Account</h2>
            <p>This action is permanent and cannot be undone.</p>
            {error && <p className={styles.error}>{error}</p>}
            <button onClick={handleDelete} disabled={deleting} className={styles.danger}>
              {deleting ? "Deleting…" : "Confirm Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}