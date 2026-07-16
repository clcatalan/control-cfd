const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

// Formats a Date as 'YYYY-MM-DD HH:MM:ss' in the participant's local time
export function formatTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

// Fire-and-forget UI event logger. Failures are swallowed (logged only) so event
// tracking never blocks or breaks the participant-facing study flow.
export async function logEvent(participantId, eventName, metadata) {
  try {
    await fetch(`${API_URL}/users/${encodeURIComponent(participantId)}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName, metadata }),
    })
  } catch (err) {
    console.error(`Error logging event "${eventName}":`, err)
  }
}
