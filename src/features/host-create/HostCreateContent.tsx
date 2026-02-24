"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import useSWRMutation from "swr/mutation"
import { Button } from "@/components/button/Button"
import { QuizEditor, type QuizForm } from "./QuizEditor"
import type { Room } from "@/types/room"

type CreateRoomResponse = {
  room: Room
  host_id: string
}

type CreateRoomArgs = {
  title: string
  quizzes: (QuizForm & { order: number })[]
}

async function postRoom(url: string, { arg }: { arg: CreateRoomArgs }): Promise<CreateRoomResponse> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error ?? "Failed to create room")
  }
  return res.json()
}

const createEmptyQuiz = (): QuizForm => ({
  question: "",
  choices: ["", "", "", ""],
  correct_index: 0,
  explanation: "",
})

export function HostCreateContent() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [quizzes, setQuizzes] = useState<QuizForm[]>([createEmptyQuiz()])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { trigger, isMutating } = useSWRMutation("/api/rooms", postRoom)

  const handleAddQuiz = () => {
    setQuizzes((prev) => [...prev, createEmptyQuiz()])
  }

  const handleRemoveQuiz = (index: number) => {
    setQuizzes((prev) => prev.filter((_, i) => i !== index))
  }

  const handleChangeQuiz = (index: number, quiz: QuizForm) => {
    setQuizzes((prev) => prev.map((q, i) => (i === index ? quiz : q)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!title.trim()) {
      setErrorMsg("タイトルを入力してください")
      return
    }
    if (quizzes.length === 0) {
      setErrorMsg("クイズを1問以上登録してください")
      return
    }

    try {
      const result = await trigger({
        title: title.trim(),
        quizzes: quizzes.map((q, i) => ({ ...q, order: i })),
      })
      // ローカルストレージに hostId を保存
      localStorage.setItem("hostId", result.host_id)
      router.push(`/host/${result.room.id}?hostId=${result.host_id}`)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "エラーが発生しました")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* ページタイトル */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-indigo-400">選手権</span>を作成
          </h1>
          <p className="text-white/50 text-sm">
            タイトルとクイズを設定して選手権を始めましょう。
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* タイトル入力 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-2"
          >
            <label htmlFor="title" className="block text-sm font-medium text-white/70">
              選手権タイトル <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 第1回 プログラミング王決定戦"
              className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-white placeholder-white/20 px-4 py-3 text-base transition-colors"
            />
          </motion.div>

          {/* クイズリスト */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                クイズ ({quizzes.length}問)
              </h2>
            </div>

            <AnimatePresence mode="popLayout">
              {quizzes.map((quiz, i) => (
                <QuizEditor
                  key={i}
                  index={i}
                  quiz={quiz}
                  onChange={(q) => handleChangeQuiz(i, q)}
                  onRemove={() => handleRemoveQuiz(i)}
                />
              ))}
            </AnimatePresence>

            {/* クイズ追加ボタン */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleAddQuiz}
                className="w-full border-dashed"
              >
                + クイズを追加
              </Button>
            </motion.div>
          </div>

          {/* エラー表示 */}
          <AnimatePresence>
            {errorMsg && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2"
              >
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>

          {/* 送信ボタン */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isMutating}
              className="w-full"
            >
              {isMutating ? "作成中..." : "選手権を作成する"}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
