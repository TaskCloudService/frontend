"use client";
import { useRef } from "react";
import styles from "./NumberInput.module.css";

type Props = {
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
};

export default function NumberInput({ value, min = 1, max = 10, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= min && val <= max) {
      onChange(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (value < max) onChange(value + 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (value > min) onChange(value - 1);
    }
  };

  const decrease = () => value > min && onChange(value - 1);
  const increase = () => value < max && onChange(value + 1);

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={decrease}
        className={styles.button}
        aria-label="Decrease quantity"
      >
        –
      </button>
      <input
        ref={inputRef}
        className={styles.input}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        onClick={increase}
        className={styles.button}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}