"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import useSWRMutation from "swr/mutation"
import { QuizEditor, type QuizForm } from "./QuizEditor"
import type { Room } from "@/types/room"
import { QuizCard } from "@/components/quiz/QuizCard"
import { QuizChoices } from "@/components/quiz/QuizChoices"
import { setHostToken } from "@/lib/host-token"

type CreateRoomResponse = {
  room: Room
  host_id: string
}

type CreateRoomArgs = {
  title: string
  subtitle: string
  password: string
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
  const [subtitle, setSubtitle] = useState("")
  const [password, setPassword] = useState("")
  const [quizzes, setQuizzes] = useState<QuizForm[]>([createEmptyQuiz()])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [previewQuiz, setPreviewQuiz] = useState<QuizForm | null>(null)

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
    if (!password || password.length < 4) {
      setErrorMsg("パスワードは4文字以上で入力してください")
      return
    }
    if (quizzes.length === 0) {
      setErrorMsg("クイズを1問以上登録してください")
      return
    }

    try {
      const result = await trigger({
        title: title.trim(),
        subtitle: subtitle.trim(),
        password,
        quizzes: quizzes.map((q, i) => ({ ...q, order: i })),
      })
      setHostToken(result.room.id, result.host_id)
      router.push(`/host/${result.room.id}/board`)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "エラーが発生しました")
    }
  }

  return (
    <div className="min-h-screen font-serif text-white relative">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, #450a0a 0%, #1a0303 100%)" }}
      />
      <div className="fixed inset-0 -z-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 pointer-events-none" />

      {/* Scrollable Content */}
      <div className="px-4 py-12 max-w-3xl mx-auto space-y-10 relative z-10">
        {/* ページタイトル */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black/40 border border-yellow-600/50 shadow-[0_0_20px_rgba(234,179,8,0.2)] mb-2">
            <span className="text-4xl">👑</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700 drop-shadow-sm">
            クイズ大会を作成
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* タイトル入力 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-3"
          >
            <label htmlFor="title" className="block text-xs font-bold text-yellow-500/80 uppercase tracking-wider">
              選手権タイトル <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 第1回 プログラミング王決定戦"
              className="w-full px-6 py-4 rounded-xl bg-black/40 border border-yellow-600/30 focus:border-yellow-500/70 focus:outline-none text-white placeholder-slate-500 text-lg shadow-inner transition-all duration-200 font-sans"
            />
          </motion.div>

          {/* サブタイトル入力 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="space-y-3"
          >
            <label htmlFor="subtitle" className="block text-xs font-bold text-yellow-500/80 uppercase tracking-wider">
              サブタイトル <span className="text-slate-500 text-[10px] ml-1">任意</span>
            </label>
            <input
              id="subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="例: Quiz King Check"
              className="w-full px-6 py-4 rounded-xl bg-black/40 border border-yellow-600/30 focus:border-yellow-500/70 focus:outline-none text-white placeholder-slate-500 text-lg shadow-inner transition-all duration-200 font-sans"
            />
          </motion.div>

          {/* パスワード入力 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-3"
          >
            <label htmlFor="password" className="block text-xs font-bold text-yellow-500/80 uppercase tracking-wider">
              管理者パスワード <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="4文字以上（管理画面アクセス用）"
              className="w-full px-6 py-4 rounded-xl bg-black/40 border border-yellow-600/30 focus:border-yellow-500/70 focus:outline-none text-white placeholder-slate-500 text-lg shadow-inner transition-all duration-200 font-sans"
            />
          </motion.div>

          {/* クイズリスト */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-sm font-bold text-yellow-500/80 uppercase tracking-wider">
                クイズ一覧 ({quizzes.length}問)
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
                  onPreview={() => setPreviewQuiz(quizzes[i])}
                />
              ))}
            </AnimatePresence>

            {/* クイズ追加ボタン */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.01, backgroundColor: "rgba(234, 179, 8, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddQuiz}
                className="w-full border-2 border-dashed border-yellow-600/30 text-yellow-500/60 hover:border-yellow-500/50 hover:text-yellow-400 h-16 uppercase tracking-widest font-bold rounded-xl transition-colors"
              >
                + クイズを追加
              </motion.button>
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
                className="text-red-400 text-sm bg-red-900/20 border border-red-500/20 rounded-lg px-4 py-3 text-center font-bold"
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
            className="pt-4"
          >
            <button
              type="submit"
              disabled={isMutating}
              className={[
                "w-full py-5 rounded-xl font-black text-xl tracking-widest uppercase transition-all duration-200",
                "bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 bg-[length:200%_100%]",
                "text-black shadow-[0_4px_20px_rgba(234,179,8,0.3)]",
                "hover:bg-[100%_0] hover:shadow-[0_6px_25px_rgba(234,179,8,0.4)] hover:-translate-y-0.5",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
              ].join(" ")}
            >
              {isMutating ? "作成中..." : "大会を作成する"}
            </button>
          </motion.div>
        </form>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewQuiz(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[90vh] overflow-y-auto relative bg-transparent"
            >
              <div className="grid grid-cols-10 gap-6">
                {/* Left Column (6): Question */}
                <div className="col-span-10 md:col-span-6 flex flex-col relative min-h-[400px]">
                  <QuizCard
                    question={previewQuiz.question || "（問題文が未入力です）"}
                    questionNumber={1}
                    total={1}
                    compact={false}
                    imageUrl={previewQuiz.image_url}
                  />
                </div>

                {/* Right Column (4): Choices */}
                <div className="col-span-10 md:col-span-4 flex flex-col gap-4">
                  <div className="bg-black/40 backdrop-blur-md border border-yellow-600/30 rounded-xl p-4">
                    <p className="text-xs font-bold text-yellow-500/80 uppercase tracking-wider mb-3 text-center">
                      Preview Mode
                    </p>
                    <QuizChoices
                      choices={previewQuiz.choices.map(c => c || "（選択肢）")}
                      correctIndex={undefined} // プレビューでは正解を表示しない（出題中を想定）
                      disabled={false}
                    />
                  </div>
                  
                  {/* Explanation Preview (Optional) */}
                  {previewQuiz.explanation && (
                    <div className="bg-indigo-900/40 backdrop-blur-md border border-indigo-500/30 rounded-xl p-4">
                      <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
                        Explanation (Hidden)
                      </p>
                      <p className="text-sm text-indigo-100 line-clamp-3">
                        {previewQuiz.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => setPreviewQuiz(null)}
                className="absolute -top-12 right-0 md:-right-12 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
