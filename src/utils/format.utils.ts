export function splitName(fullName: string): { first: string; last: string } {
  const idx = fullName.indexOf(' ');
  if (idx === -1) return { first: fullName, last: '' };
  return { first: fullName.slice(0, idx), last: fullName.slice(idx + 1) };
}

export function formatDate(date?: number | null) {
  if (!date) {
    return
  }
  return new Date(date).toLocaleString();
}