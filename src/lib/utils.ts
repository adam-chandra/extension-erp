import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format angka biasa pakai separator ribuan ala Indonesia.
 * formatNumber(12458) -> "12.458"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString("id-ID");
}

/**
 * Format nilai rupiah jadi bentuk ringkas (Miliar/Juta).
 * formatCurrency(12118959616.49) -> "Rp. 12,1 M"
 * formatCurrency(2200000)        -> "Rp. 2,2 Jt"
 * formatCurrency(850000)         -> "Rp. 850.000"
 */
export function formatCurrency(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 1_000_000_000) {
    return `Rp. ${(value / 1_000_000_000).toLocaleString("id-ID", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })} M`;
  }

  if (abs >= 1_000_000) {
    return `Rp. ${(value / 1_000_000).toLocaleString("id-ID", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })} Jt`;
  }

  return `Rp. ${value.toLocaleString("id-ID", {
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Format mata uang full tanpa singkatan, contoh: IDR 48.750.000.000
 */
export function formatCurrencyIDR(value: number): string {
  return `Rp. ${value.toLocaleString("id-ID", {
    maximumFractionDigits: 0,
  })}`;
}