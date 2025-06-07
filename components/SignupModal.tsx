"use client";

import { useState } from "react";
import { Modal } from "./ui/Modal";
import { RegistrationStep } from "./RegistrationStep";
import { CodeStep } from "./CodeStep";
import styles from "./SignupModal.module.css";

export default function SignupModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [userId, setUserId] = useState("");

  const reset = () => {
    setOpen(false);
    setStep(1);
    setUserId("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={styles.openButton}
      >
        Sign Up
      </button>

      <Modal open={open} onOpenChange={setOpen}>

        {step === 1 && (
          <RegistrationStep
            onNext={(uid) => {
              setUserId(uid);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <CodeStep
            userId={userId}
            onDone={reset}
          />
        )}
      </Modal>
    </>
  );
}
