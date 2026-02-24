"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/button/Button"

const EMOJI_OPTIONS = ["😊", "🔥", "⚡", "🎯", "🏆", "👾", "🦊", "🐯"]

interface EntryFormProps {
  roomId: string
  onEntered: (participantId: string) => void
}

export function EntryForm({ roomId, onEntered }: EntryFormProps) {
  const [name, setName] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
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
        .insert({
          name: name.trim(),
          icon: selectedEmoji,
          room_id: roomId,
        })
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
        className="w-full max-w-sm relative z-10"
      >
        {/* Card Container */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-yellow-600/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />
          
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 text-4xl shadow-[0_0_20px_rgba(234,179,8,0.3)] bg-gradient-to-br from-slate-800 to-black border border-yellow-600/50"
            >
              👑
            </motion.div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700 tracking-tight drop-shadow-sm mb-2">
              格付王
            </h1>
            <p className="text-xs text-yellow-500/60 tracking-[0.2em] uppercase">Quiz King Check</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-yellow-500/80 uppercase tracking-wider">
                ENTRY NAME
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
                  "focus:outline-none focus:border-yellow-500/70 focus:bg-black/60 focus:shadow-[0_0_15px_rgba(234,179,8,0.15)]",
                  "transition-all duration-200 font-sans",
                ].join(" ")}
              />
            </div>

            {/* Emoji selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-yellow-500/80 uppercase tracking-wider">
                SELECT ICON
              </label>
              <div className="grid grid-cols-4 gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <motion.button
                    key={emoji}
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={[
                      "aspect-square rounded-lg text-2xl flex items-center justify-center",
                      "border transition-all duration-200",
                      selectedEmoji === emoji
                        ? "bg-yellow-500/20 border-yellow-400/80 shadow-[0_0_12px_rgba(234,179,8,0.3)] scale-105"
                        : "bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10",
                    ].join(" ")}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-400 text-center font-sans bg-red-900/20 py-2 rounded border border-red-500/20"
              >
                {error}
              </motion.p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={[
                "w-full py-4 rounded-lg font-bold text-lg tracking-widest uppercase transition-all duration-200",
                "bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 bg-[length:200%_100%]",
                "text-black shadow-[0_4px_15px_rgba(234,179,8,0.3)]",
                "hover:bg-[100%_0] hover:shadow-[0_6px_20px_rgba(234,179,8,0.4)] hover:-translate-y-0.5",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
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
