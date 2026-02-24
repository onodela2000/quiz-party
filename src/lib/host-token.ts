const STORAGE_KEY = "host_tokens"

export function getHostToken(roomId: string): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const tokens: Record<string, string> = JSON.parse(raw)
    return tokens[roomId] ?? null
  } catch {
    return null
  }
}

export function setHostToken(roomId: string, hostId: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const tokens: Record<string, string> = raw ? JSON.parse(raw) : {}
    tokens[roomId] = hostId
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
  } catch {
    // ignore
  }
}
