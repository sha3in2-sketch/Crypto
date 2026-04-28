import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert ArrayBuffer to Hex string
export function bufferToHex(buffer: ArrayBuffer) {
  const hashArray = Array.from(new Uint8Array(buffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Generate an Evidence ID
export function generateEvidenceId() {
  return 'EV-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}
