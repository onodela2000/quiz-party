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
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #0f0f23 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 26 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 text-3xl"
            style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.5)" }}
          >
            🎮
          </motion.div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Quiz King
          </h1>
          <p className="text-sm text-slate-400 mt-1">クイズに参加する</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300">
              あなたの名前
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="名前を入力..."
              maxLength={20}
              className={[
                "w-full px-4 py-3.5 rounded-xl text-white text-base",
                "bg-white/[0.06] border border-white/15",
                "placeholder:text-slate-500",
                "focus:outline-none focus:border-indigo-500/70 focus:bg-white/[0.08]",
                "transition-colors duration-150",
              ].join(" ")}
            />
          </div>

          {/* Emoji selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300">
              アイコンを選択
            </label>
            <div className="grid grid-cols-4 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <motion.button
                  key={emoji}
                  type="button"
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={[
                    "aspect-square rounded-xl text-2xl flex items-center justify-center",
                    "border transition-colors duration-150",
                    selectedEmoji === emoji
                      ? "bg-indigo-500/30 border-indigo-400/80 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                      : "bg-white/[0.04] border-white/10 hover:bg-white/[0.08]",
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
              className="text-sm text-red-400 text-center"
            >
              {error}
            </motion.p>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            size="lg"
            variant="primary"
            disabled={isLoading}
            className="w-full mt-2"
          >
            {isLoading ? "参加中..." : `${selectedEmoji} 参加する`}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
