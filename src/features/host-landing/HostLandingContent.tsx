"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { setHostToken } from "@/lib/host-token"

type Tab = "login" | "create"

export function HostLandingContent() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("login")

  return (
    <div className="min-h-screen font-serif text-white relative">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, #450a0a 0%, #1a0303 100%)" }}
      />
      <div className="fixed inset-0 -z-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 pointer-events-none" />

      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black/40 border border-yellow-600/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
              <span className="text-4xl">👑</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700">
              ホスト管理
            </h1>
            <p className="text-sm text-white/40">
              クイズ大会の作成・管理
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl overflow-hidden border border-yellow-600/30 bg-black/20">
            <button
              type="button"
              onClick={() => setTab("login")}
              className={[
                "flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200",
                tab === "login"
                  ? "bg-yellow-600/25 text-yellow-300 shadow-inner"
                  : "text-white/30 hover:text-white/50",
              ].join(" ")}
            >
              ログイン
            </button>
            <div className="w-px bg-yellow-600/20" />
            <button
              type="button"
              onClick={() => setTab("create")}
              className={[
                "flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200",
                tab === "create"
                  ? "bg-yellow-600/25 text-yellow-300 shadow-inner"
                  : "text-white/30 hover:text-white/50",
              ].join(" ")}
            >
              新規作成
            </button>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <LoginForm />
              </motion.div>
            ) : (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CreatePanel onNavigate={() => router.push("/host/create")} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

// ── Login Form ──────────────────────────────────────────────────────────────
function LoginForm() {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!roomCode.trim()) {
      setError("ルームコードを入力してください")
      return
    }
    if (!password) {
      setError("パスワードを入力してください")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/rooms/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_code: roomCode.trim(), password }),
      })
      const data = await res.json()

      if (!res.ok || !data.valid) {
        setError(data.error ?? "ログインに失敗しました")
        return
      }

      // Save host_id to localStorage
      setHostToken(data.room_id, data.host_id)

      // Navigate to board with room code
      router.push(`/host/${data.room_id}/board?code=${data.room_code}`)
    } catch {
      setError("エラーが発生しました")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-black/30 border border-white/10 rounded-xl p-6 space-y-5">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-yellow-500/70 uppercase tracking-wider">
            ルームコード
          </label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="例: quiz-2024"
            autoFocus
            className="w-full px-5 py-3.5 rounded-lg bg-black/40 border border-yellow-600/30 focus:border-yellow-500/70 focus:outline-none text-white placeholder-slate-500 text-base shadow-inner transition-all duration-200 font-mono"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-yellow-500/70 uppercase tracking-wider">
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="管理者パスワード"
            className="w-full px-5 py-3.5 rounded-lg bg-black/40 border border-yellow-600/30 focus:border-yellow-500/70 focus:outline-none text-white placeholder-slate-500 text-base shadow-inner transition-all duration-200 font-sans"
          />
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-red-400 text-sm font-bold text-center bg-red-900/20 border border-red-500/20 rounded-lg px-4 py-2.5"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={submitting}
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
  )
}

// ── Create Panel ────────────────────────────────────────────────────────────
function CreatePanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="space-y-5">
      <div className="bg-black/30 border border-white/10 rounded-xl p-6 space-y-4 text-center">
        <div className="text-5xl mb-2">🎯</div>
        <h3 className="text-lg font-bold text-white/90">
          新しいクイズ大会を作る
        </h3>
        <p className="text-sm text-white/40 leading-relaxed">
          タイトル・クイズ問題・ルームコードを設定して<br />
          オリジナルのクイズ大会を開催しましょう
        </p>
      </div>

      <button
        type="button"
        onClick={onNavigate}
        className={[
          "w-full py-4 rounded-xl font-black text-lg tracking-widest uppercase transition-all duration-200",
          "bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 bg-[length:200%_100%]",
          "text-black shadow-[0_4px_20px_rgba(234,179,8,0.3)]",
          "hover:bg-[100%_0] hover:shadow-[0_6px_25px_rgba(234,179,8,0.4)] hover:-translate-y-0.5",
        ].join(" ")}
      >
        作成画面へ
      </button>
    </div>
  )
}
