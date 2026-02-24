"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { getHostToken, setHostToken } from "@/lib/host-token"

type Status = "checking" | "authenticated" | "password_required"

export function HostAuthGate({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const roomId = typeof params?.roomId === "string" ? params.roomId : ""

  const [status, setStatus] = useState<Status>("checking")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // On mount: check localStorage token
  useEffect(() => {
    if (!roomId) {
      setStatus("password_required")
      return
    }

    const token = getHostToken(roomId)
    if (!token) {
      setStatus("password_required")
      return
    }

    // Verify token against API
    fetch(`/api/rooms/${roomId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ host_id: token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setStatus("authenticated")
        } else {
          setStatus("password_required")
        }
      })
      .catch(() => {
        setStatus("password_required")
      })
  }, [roomId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const res = await fetch(`/api/rooms/${roomId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (data.valid && data.host_id) {
        setHostToken(roomId, data.host_id)
        setStatus("authenticated")
      } else {
        setError("パスワードが正しくありません")
      }
    } catch {
      setError("エラーが発生しました")
    } finally {
      setSubmitting(false)
    }
  }

  if (status === "checking") {
    return (
      <div
        className="min-h-screen font-serif text-white flex items-center justify-center"
        style={{ background: "radial-gradient(ellipse at center, #450a0a 0%, #1a0303 100%)" }}
      >
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="text-yellow-500/60 text-sm uppercase tracking-widest font-bold"
        >
          認証確認中...
        </motion.div>
      </div>
    )
  }

  if (status === "password_required") {
    return (
      <div
        className="min-h-screen font-serif text-white flex items-center justify-center px-4"
        style={{ background: "radial-gradient(ellipse at center, #450a0a 0%, #1a0303 100%)" }}
      >
        <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-sm space-y-8 text-center"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/40 border border-yellow-600/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
              <span className="text-3xl">🔒</span>
            </div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700">
              ホスト認証
            </h1>
            <p className="text-sm text-white/50">
              管理画面にアクセスするには<br />パスワードを入力してください
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              autoFocus
              className="w-full px-6 py-4 rounded-xl bg-black/40 border border-yellow-600/30 focus:border-yellow-500/70 focus:outline-none text-white placeholder-slate-500 text-lg shadow-inner transition-all duration-200 font-sans text-center tracking-widest"
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm font-bold"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={submitting || !password}
              className={[
                "w-full py-4 rounded-xl font-black text-lg tracking-widest uppercase transition-all duration-200",
                "bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 bg-[length:200%_100%]",
                "text-black shadow-[0_4px_20px_rgba(234,179,8,0.3)]",
                "hover:bg-[100%_0] hover:shadow-[0_6px_25px_rgba(234,179,8,0.4)] hover:-translate-y-0.5",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
              ].join(" ")}
            >
              {submitting ? "確認中..." : "ログイン"}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // Authenticated
  return <>{children}</>
}
