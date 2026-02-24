"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"

const STYLES = ["fun-emoji", "bottts", "dylan", "notionists", "pixel-art", "adventurer"] as const

const SEEDS = [
  "alpha", "bravo", "charlie", "delta",
  "echo", "foxtrot", "golf", "hotel",
  "india", "juliet", "kilo", "lima",
]

// 全スタイル × 全seed の組み合わせ一覧
const ALL_AVATARS = STYLES.flatMap((style) =>
  SEEDS.map((seed) => ({ style, seed, url: `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}` }))
)

interface EntryFormProps {
  roomId: string
  title: string
  subtitle: string | null
  onEntered: (participantId: string) => void
}

export function EntryForm({ roomId, title, subtitle, onEntered }: EntryFormProps) {
  const [name, setName] = useState("")
  const [selectedUrl, setSelectedUrl] = useState<string>(ALL_AVATARS[0].url)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("名前を入力してください")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error: insertError } = await supabase
        .from("participants")
        .insert({ name: name.trim(), icon: selectedUrl, room_id: roomId })
        .select()
        .single()
      if (insertError || !data) {
        setError("参加に失敗しました。もう一度お試しください。")
        return
      }
      localStorage.setItem("participantId", data.id)
      onEntered(data.id)
    } catch {
      setError("エラーが発生しました。もう一度お試しください。")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 font-serif"
      style={{ background: "radial-gradient(ellipse at center, #450a0a 0%, #1a0303 100%)" }}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 26 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/80 backdrop-blur-md border border-yellow-600/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-[0_0_20px_rgba(234,179,8,0.3)] bg-gradient-to-br from-slate-800 to-black border border-yellow-600/50"
            >
              👑
            </motion.div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700 tracking-tight drop-shadow-sm mb-2">
              {title || <span className="opacity-40 animate-pulse">Loading...</span>}
            </h1>
            {subtitle && (
              <p className="text-xs text-yellow-500/60 tracking-[0.2em] uppercase">{subtitle}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-yellow-500/80 uppercase tracking-wider">
                名前
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="名前を入力..."
                maxLength={20}
                className={[
                  "w-full px-4 py-3.5 rounded-lg text-white text-base",
                  "bg-black/40 border border-yellow-600/30",
                  "placeholder:text-slate-600",
                  "focus:outline-none focus:border-yellow-500/70 focus:shadow-[0_0_15px_rgba(234,179,8,0.15)]",
                  "transition-all duration-200 font-sans",
                ].join(" ")}
              />
            </div>

            {/* Avatar selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-yellow-500/80 uppercase tracking-wider">
                  アイコン
                </label>
                {/* Selected preview */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedUrl} alt="selected" width={36} height={36} className="rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.4)]" />
              </div>

              {/* Scrollable avatar grid */}
              <div className="h-52 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-2">
                <div className="grid grid-cols-6 gap-2">
                  {ALL_AVATARS.map(({ style, seed, url }) => (
                    <button
                      key={`${style}-${seed}`}
                      type="button"
                      onClick={() => setSelectedUrl(url)}
                      className={[
                        "aspect-square rounded-xl border-2 overflow-hidden transition-all",
                        selectedUrl === url
                          ? "border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)] scale-105"
                          : "border-transparent hover:border-white/30",
                      ].join(" ")}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" width={64} height={64} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-400 text-center font-sans bg-red-900/20 py-2 rounded border border-red-500/20"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={[
                "w-full py-4 rounded-lg font-bold text-lg tracking-widest uppercase transition-all duration-200",
                "bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 bg-[length:200%_100%]",
                "text-black shadow-[0_4px_15px_rgba(234,179,8,0.3)]",
                "hover:bg-[100%_0] hover:shadow-[0_6px_20px_rgba(234,179,8,0.4)] hover:-translate-y-0.5",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              ].join(" ")}
            >
              {isLoading ? "LOADING..." : "ENTRY"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
