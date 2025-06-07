
export function validateEmail(email: string): string | null {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) return "Email is required.";
  if (!regex.test(email)) return "Please enter a valid email address.";

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password.trim()) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter.";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include a number.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must include a special character.";

  return null;
}

export function validateConfirmPassword(password: string, confirm: string): string | null {
  if (!confirm.trim()) return "Please confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return null;
}
