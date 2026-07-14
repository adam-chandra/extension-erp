/**
 * Formatting utilities untuk finance/accounting pages
 */

export function formatIDR(value: number): string {
  if (!Number.isFinite(value)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMonthLabel(monthIso: string): string {
  const [y, m] = monthIso.split('-');
  const date = new Date(Number(y), Number(m) - 1, 1);
  const short = date.toLocaleString('id-ID', { month: 'short' });
  return `${short} '${y.slice(-2)}`;
}

export const RETUR_PENJUALAN_COLUMNS = (noWidth: string = '80px', nilaiWidth: string = '200px') => [
  { key: 'no', label: 'No', width: noWidth, align: 'center' as const },
  { key: 'code', label: 'COA', width: '110px', align: 'left' as const },
  { key: 'deskripsi', label: 'Deskripsi', align: 'left' as const },
  {
    key: 'nilaiRetur',
    label: 'Nilai Retur',
    width: nilaiWidth,
    align: 'right' as const,
    render: (value: number) => formatIDR(value),
  },
  { key: 'persentaseRetur', label: '% Retur', width: '100px', align: 'center' as const },
];
