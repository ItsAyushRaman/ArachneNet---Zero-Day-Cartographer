export const formatISO = (dateStr) => {
  if (!dateStr) return 'PENDING'
  try {
    return new Date(dateStr).toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
  } catch {
    return dateStr
  }
}

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toISOString().slice(0, 10)
  } catch {
    return dateStr
  }
}

export const truncate = (str, n = 45) =>
  str?.length > n ? str.slice(0, n) + '...' : (str ?? '')

export const formatLiveClock = () => {
  const n = new Date()
  const p = x => String(x).padStart(2, '0')
  return `${n.getUTCFullYear()}-${p(n.getUTCMonth()+1)}-${p(n.getUTCDate())} ` +
         `${p(n.getUTCHours())}:${p(n.getUTCMinutes())}:${p(n.getUTCSeconds())} UTC`
}
