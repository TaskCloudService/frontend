"use client";

import { useEffect, useState } from "react";
import { Modal } from "./ui/Modal";
import { EmailStep } from "./EmailStep";
import { PasswordStep } from "./PasswordStep";
import { CodeStep } from "./CodeStep";
import styles from "./SignInModal.module.css";

interface SignInModalProps {
  open?: boolean;
  onClose?: () => void;
}

export default function SignInModal({ open, onClose }: SignInModalProps) {

  const [isOpen, setIsOpen] = useState(open ?? false);
  useEffect(() => {
    if (open !== undefined) setIsOpen(open);
  }, [open]);

  const [step, setStep]   = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  function reset() {
    setStep(1);
    setEmail("");
    setUserId("");
    setIsOpen(false);
    onClose?.();
  }


  return (
    <>
      {open === undefined && (
        <button onClick={() => setIsOpen(true)} className={styles.openButton}>
          Sign&nbsp;In
        </button>
      )}

      <Modal
        open={isOpen}
        onOpenChange={(state) => {
          setIsOpen(state);
          if (!state) onClose?.();
        }}
      >
        {step === 1 && (
          <EmailStep
            onNext={(uid, em) => {
              setUserId(uid);
              setEmail(em);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <PasswordStep
            email={email}
            onNext={() => reset()}
            onVerificationNeeded={(uid) => {
              setUserId(uid);
              setStep(3);
            }}
          />
        )}

        {step === 3 && <CodeStep userId={userId} onDone={() => reset()} />}
      </Modal>
    </>
  );
}
