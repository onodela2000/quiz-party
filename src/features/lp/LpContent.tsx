"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView, AnimatePresence } from "framer-motion"

// ─── 共通アニメーション ───────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// ─── ヘッダー ─────────────────────────────────────────────────
function Header() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-yellow-600/20 py-3" : "py-5",
      ].join(" ")}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👑</span>
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 tracking-widest text-lg uppercase">
            Quiz Party JP
          </span>
        </div>
        <Link
          href="/host/create"
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-yellow-700 to-yellow-500 text-black font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-[0_4px_15px_rgba(234,179,8,0.3)]"
        >
          無料で作る
        </Link>
      </div>
    </motion.header>
  )
}

// ─── ヒーロー ─────────────────────────────────────────────────
const FLOATING_ICONS = ["🦊","🐺","🦁","🐻","🦄","🐸","🐯","🦋","🐬","🦉","🐼","🐨"]

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 overflow-hidden">
      {/* 浮遊アイコン */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOATING_ICONS.map((icon, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl select-none"
            style={{
              left: `${6 + (i % 6) * 16}%`,
              top: `${8 + Math.floor(i / 6) * 50}%`,
              opacity: 0.07,
            }}
            animate={{ y: [0, -24, 0], opacity: [0.04, 0.12, 0.04] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
          >
            {icon}
          </motion.span>
        ))}
      </div>

      {/* スポットライト */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "radial-gradient(circle, rgba(234,179,8,0.18) 0%, transparent 70%)" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-4xl"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          className="text-7xl mb-6 inline-block filter drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]"
        >
          👑
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-500/60 mb-4"
        >
          Quiz Party JP
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-6"
        >
          クイズ大会を、<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
            たった３分で作れる。
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed mb-10 font-sans"
        >
          飲み会・研修・配信、どこでも盛り上がるクイズ大会を無料で。<br />
          URLを共有するだけで、全員がスマホから参加できる。
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          {["完全無料", "ログイン不要", "スマホ対応", "リアルタイム"].map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-yellow-900/30 border border-yellow-600/40 text-yellow-300/80 text-xs font-bold uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/host/create"
            className="px-10 py-5 rounded-xl bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-600 text-black font-black text-xl uppercase tracking-widest shadow-[0_4px_30px_rgba(234,179,8,0.4)] hover:shadow-[0_8px_40px_rgba(234,179,8,0.65)] hover:-translate-y-1 transition-all duration-200"
          >
            無料でクイズ大会を作る
          </Link>
          <a
            href="#how"
            className="px-8 py-4 rounded-xl border border-white/20 text-white/75 font-bold text-base hover:border-white/40 hover:text-white transition-all duration-200 font-sans"
          >
            使い方を見る →
          </a>
        </motion.div>
      </motion.div>

      {/* スクロール誘導 */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-white/35" />
        </div>
      </motion.div>
    </section>
  )
}

// ─── ユースケース ─────────────────────────────────────────────
const USE_CASES = [
  { icon: "🏢", title: "企業研修・チームビルディング", desc: "社内研修をゲーム化して知識定着率UP。全員参加型で眠い研修がガラリと変わる。", example: "例：「社内ルール、一番詳しいのは誰だ？」", tag: "企業向け" },
  { icon: "🍻", title: "歓迎会・忘年会・宴会", desc: "誰もが主役になれる余興に。幹事の準備ゼロ、その場で作ってすぐ盛り上がれる。", example: "例：「新メンバーの意外な一面クイズ」", tag: "イベント" },
  { icon: "🎓", title: "学校・授業・サークル", desc: "授業の理解度をリアルタイムでチェック。サークルの新歓やLT大会にも最適。", example: "例：「期末前の英単語バトル」", tag: "教育" },
  { icon: "📡", title: "オンライン配信・ライブ", desc: "視聴者参加型コンテンツで配信を盛り上げる。URLを貼るだけで全員が参加できる。", example: "例：「リスナー vs 配信者 雑学チャレンジ」", tag: "配信" },
]

function UseCasesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-500/60 mb-3">Use Cases</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            こんな場面で<span className="text-yellow-400">使われています</span>
          </h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {USE_CASES.map((uc) => (
            <motion.div key={uc.title} variants={fadeUp} className="p-6 rounded-2xl border border-yellow-600/20 bg-black/40 backdrop-blur-sm hover:border-yellow-500/40 hover:bg-yellow-900/10 transition-all duration-300">
              <div className="text-5xl mb-4">{uc.icon}</div>
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-600/70 mb-2 block">{uc.tag}</span>
              <h3 className="text-base font-black text-white mb-3 leading-tight">{uc.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed font-sans">{uc.desc}</p>
              <p className="text-xs text-yellow-500/70 font-bold mt-2 font-sans">{uc.example}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── 使い方 3ステップ ─────────────────────────────────────────
const STEPS = [
  { num: "01", icon: "✍️", title: "クイズを作る", desc: "タイトルと問題を入力するだけ。難しい設定は一切不要。3分あれば大会が完成。" },
  { num: "02", icon: "🔗", title: "URLを共有する", desc: "自動生成された参加URLをLINEやSlackで送るだけ。アプリインストール不要。" },
  { num: "03", icon: "🎉", title: "リアルタイムで盛り上がる", desc: "ホスト画面に全員の回答が集まり、正解発表・ランキングで一気に盛り上がる。" },
]

function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <section id="how" className="py-24 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-500/60 mb-3">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            たった<span className="text-yellow-400">３ステップ</span>で開催
          </h2>
          <p className="text-white/50 mt-4 font-sans">準備から開催まで、最短3分。難しい操作は一切ありません。</p>
        </motion.div>
        <div className="relative">
          <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px bg-gradient-to-r from-yellow-700/40 via-yellow-400/40 to-yellow-700/40" />
          <motion.div variants={stagger} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map((step) => (
              <motion.div key={step.num} variants={fadeUp} className="flex flex-col items-center text-center">
                <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-900/60 to-black border-2 border-yellow-600/60 flex flex-col items-center justify-center mb-6 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                  <span className="text-3xl">{step.icon}</span>
                  <span className="text-xs font-black text-yellow-600/70 tracking-widest">{step.num}</span>
                </div>
                <h3 className="text-xl font-black text-white mb-3">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-sans max-w-xs">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="text-center mt-12">
          <Link href="/host/create" className="inline-block px-8 py-4 rounded-xl border-2 border-yellow-600/50 text-yellow-300 font-bold hover:bg-yellow-900/20 transition-all duration-200 text-base">
            今すぐ試してみる →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─── 機能 ─────────────────────────────────────────────────────
const FEATURES = [
  { icon: "⚡", title: "リアルタイム同期", desc: "参加者の回答がホスト画面に即時反映。全員の状況が一目でわかる。" },
  { icon: "📱", title: "スマホ完全対応", desc: "参加者はURLにアクセスするだけ。アプリ不要でどの端末でも動く。" },
  { icon: "🎯", title: "自動採点・スコア集計", desc: "正解・不正解を自動判定。スコアをリアルタイムで集計・表示。" },
  { icon: "🏆", title: "表彰・ランキング発表", desc: "ポディウム演出でドラマチックな結果発表。1位には王冠が輝く。" },
  { icon: "✏️", title: "Markdown対応", desc: "問題文にMarkdownが使える。数式・コードブロック・装飾自在。" },
  { icon: "🆓", title: "完全無料・制限なし", desc: "登録不要ですぐ使える。問題数・参加者数に制限なし。" },
]

function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-500/60 mb-3">Features</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            盛り上がるための<span className="text-yellow-400">機能が揃っている</span>
          </h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <motion.div key={f.title} variants={fadeUp} className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-yellow-600/30 hover:bg-yellow-900/10 transition-all duration-300">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-base font-black text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed font-sans">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── デモプレビュー ───────────────────────────────────────────
const DEMO_PARTICIPANTS = [
  { name: "ゆうき", icon: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=alpha", choice: 0 },
  { name: "さくら", icon: "https://api.dicebear.com/9.x/adventurer/svg?seed=bravo", choice: 0 },
  { name: "たける", icon: "https://api.dicebear.com/9.x/bottts/svg?seed=charlie", choice: 1 },
  { name: "あいこ", icon: "https://api.dicebear.com/9.x/dylan/svg?seed=delta", choice: 0 },
  { name: "けんた", icon: "https://api.dicebear.com/9.x/pixel-art/svg?seed=echo", choice: 2 },
  { name: "みく",   icon: "https://api.dicebear.com/9.x/notionists/svg?seed=foxtrot", choice: 0 },
  { name: "りょう", icon: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=golf", choice: 0 },
  { name: "はるな", icon: "https://api.dicebear.com/9.x/adventurer/svg?seed=hotel", choice: 3 },
]
const DEMO_CORRECT_INDEX = 0 // A: 富士山

const CHOICE_LABELS = ["A", "B", "C", "D"] as const
const CHOICE_BADGE_COLORS = [
  "text-blue-900 bg-gradient-to-br from-blue-200 to-blue-400 border-blue-500",
  "text-red-900 bg-gradient-to-br from-red-200 to-red-400 border-red-500",
  "text-green-900 bg-gradient-to-br from-green-200 to-green-400 border-green-500",
  "text-yellow-900 bg-gradient-to-br from-yellow-200 to-yellow-400 border-yellow-500",
] as const

function DemoPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [visibleCount, setVisibleCount] = useState(0)
  const [revealed, setRevealed] = useState(false)

  // 固定幅960pxのコンテナを親幅に合わせてスケール
  const wrapperRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [innerH, setInnerH] = useState<number | undefined>(undefined)
  useEffect(() => {
    const el = wrapperRef.current
    const inner = innerRef.current
    if (!el || !inner) return
    const update = () => {
      const s = Math.min(el.clientWidth / 960, 1)
      setScale(s)
      setInnerH(inner.offsetHeight * s)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    ro.observe(inner)
    return () => ro.disconnect()
  }, [])

  // 参加者が順次回答するアニメーション
  useEffect(() => {
    if (!isInView) return
    if (visibleCount >= DEMO_PARTICIPANTS.length) {
      // 全員回答後、少し待ってからreveal
      const t = setTimeout(() => setRevealed(true), 800)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setVisibleCount((v) => v + 1), 500)
    return () => clearTimeout(t)
  }, [isInView, visibleCount])

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-500/60 mb-3">Live Demo</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            こんな<span className="text-yellow-400">ライブ感</span>が生まれる
          </h2>
          <p className="text-white/50 mt-4 font-sans">参加者の回答がリアルタイムでホスト画面に集まる様子</p>
        </motion.div>

        {/* スケールラッパー: 内部は固定幅960px、親幅に合わせて縮小 */}
        <motion.div
          ref={wrapperRef}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="overflow-hidden"
          style={{ height: innerH }}
        >
          <div
            ref={innerRef}
            className="w-[960px] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]"
            style={{
              background: "radial-gradient(ellipse at center, #450a0a 0%, #1a0303 100%)",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              marginLeft: scale < 1 ? 0 : `calc((100% - 960px) / 2)`,
            }}
          >
          {/* ヘッダーバー */}
          <div className="border-b border-yellow-600/20 px-6 py-4 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">👑</span>
              <span className="text-white font-black text-sm uppercase tracking-widest">ホスト画面</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-yellow-500/70">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
              LIVE
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-10 gap-6">
              {/* Left Column (6): QuizCard風 */}
              <div className="col-span-6">
                <div className="w-full h-full rounded-sm bg-[#fffbf0] border-[8px] border-double border-yellow-600/40 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden p-6 md:p-10 flex flex-col justify-center">
                  {/* Paper texture */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60 pointer-events-none mix-blend-multiply" />
                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-600/60 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-600/60 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-600/60 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-600/60 pointer-events-none" />

                  {/* Question counter */}
                  <div className="flex items-center justify-center gap-4 relative z-10 mb-8">
                    <div className="h-px w-12 bg-yellow-600/30" />
                    <span className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-800/70 font-serif">Question 1</span>
                    <div className="h-px w-12 bg-yellow-600/30" />
                  </div>

                  {/* Question text */}
                  <p className="font-black text-slate-900 leading-tight relative z-10 text-center font-serif text-xl md:text-2xl lg:text-3xl" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    日本で一番高い山は？
                  </p>

                  {/* Bottom decoration */}
                  <div className="flex justify-center relative z-10 mt-8">
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-600/40 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Right Column (4): Choices + AnswerGrid */}
              <div className="col-span-4 flex flex-col gap-4">
                {/* Answer count */}
                {!revealed && (
                  <div className="flex items-baseline justify-center gap-2 py-2">
                    <motion.span
                      key={visibleCount}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-4xl font-black tabular-nums text-cyan-400 drop-shadow-md"
                    >
                      {visibleCount}
                    </motion.span>
                    <span className="text-slate-400 text-lg font-bold">/ {DEMO_PARTICIPANTS.length}</span>
                  </div>
                )}

                {/* Choices - QuizChoices風 */}
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: "A", text: "富士山", labelCls: "bg-gradient-to-br from-blue-900 to-blue-950 border-blue-500/50 text-blue-200" },
                    { label: "B", text: "北岳", labelCls: "bg-gradient-to-br from-red-900 to-red-950 border-red-500/50 text-red-200" },
                    { label: "C", text: "奥穂高岳", labelCls: "bg-gradient-to-br from-green-900 to-green-950 border-green-500/50 text-green-200" },
                    { label: "D", text: "間ノ岳", labelCls: "bg-gradient-to-br from-yellow-900 to-yellow-950 border-yellow-500/50 text-yellow-200" },
                  ].map((c, i) => {
                    const isCorrect = revealed && i === DEMO_CORRECT_INDEX
                    const isWrong = revealed && i !== DEMO_CORRECT_INDEX
                    return (
                      <div
                        key={c.label}
                        className={[
                          "flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all duration-500 shadow-lg",
                          isCorrect
                            ? "bg-gradient-to-r from-red-900 via-red-800 to-red-900 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.4)]"
                            : isWrong
                            ? "bg-slate-900/60 border-slate-800 opacity-30 grayscale"
                            : "bg-black/40 border-white/10",
                        ].join(" ")}
                      >
                        <span className={[
                          "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black font-serif shadow-inner border",
                          c.labelCls,
                        ].join(" ")}>
                          {c.label}
                        </span>
                        <span className={[
                          "flex-1 text-lg font-bold leading-snug tracking-wide",
                          isCorrect ? "text-yellow-100" : "text-slate-200",
                        ].join(" ")}>
                          {c.text}
                        </span>
                        {isCorrect && (
                          <motion.span
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="flex-shrink-0 text-3xl filter drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                          >
                            👑
                          </motion.span>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* AnswerGrid風 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2 py-2 border-b border-white/10">
                    <span className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-500/80 font-serif">Status</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white font-serif">{visibleCount}</span>
                      <span className="text-sm text-white/40 font-serif">/ {DEMO_PARTICIPANTS.length}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1 bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-200"
                      animate={{ width: `${(visibleCount / DEMO_PARTICIPANTS.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Participant cells - AnswerCell風 */}
                  <div className="grid grid-cols-4 gap-3">
                    <AnimatePresence>
                      {DEMO_PARTICIPANTS.slice(0, visibleCount).map((p) => {
                        const isCorrect = revealed && p.choice === DEMO_CORRECT_INDEX
                        return (
                          <motion.div
                            key={p.name}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={
                              revealed
                                ? isCorrect
                                  ? { opacity: 1, scale: 1 }
                                  : { opacity: 0.4, scale: 0.85, filter: "grayscale(100%)" }
                                : { opacity: 1, scale: 1 }
                            }
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="relative"
                          >
                            <div className={[
                              "flex flex-col items-center gap-2 p-3 pb-5 rounded-lg border-4 transition-all duration-500",
                              isCorrect
                                ? "bg-gradient-to-b from-yellow-100 to-white border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.6)]"
                                : "bg-[#1a1a1a] border-[#333] shadow-md",
                            ].join(" ")}>
                              {/* Corner accents for correct */}
                              {isCorrect && (
                                <>
                                  <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-[3px] border-l-[3px] border-yellow-600 rounded-tl-lg" />
                                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-[3px] border-r-[3px] border-yellow-600 rounded-tr-lg" />
                                  <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-[3px] border-l-[3px] border-yellow-600 rounded-bl-lg" />
                                  <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-[3px] border-r-[3px] border-yellow-600 rounded-br-lg" />
                                </>
                              )}

                              {/* Avatar */}
                              <div className="relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.icon} alt="" width={40} height={40} className="rounded-lg object-cover" />
                                {isCorrect && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="absolute -top-3 -right-3 text-lg drop-shadow-md"
                                  >
                                    👑
                                  </motion.div>
                                )}
                              </div>

                              {/* Name */}
                              <span className={[
                                "text-[10px] font-bold truncate max-w-full text-center leading-tight tracking-wide font-serif",
                                isCorrect ? "text-yellow-900" : "text-gray-400",
                              ].join(" ")}>
                                {p.name}
                              </span>

                              {/* Choice badge */}
                              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                                {revealed ? (
                                  <motion.div
                                    initial={{ scale: 0, y: 10 }}
                                    animate={{ scale: 1, y: 0 }}
                                    className={[
                                      "flex items-center justify-center w-7 h-7 rounded-full border-2 text-xs font-black font-serif shadow-lg",
                                      CHOICE_BADGE_COLORS[p.choice % CHOICE_BADGE_COLORS.length],
                                    ].join(" ")}
                                  >
                                    {CHOICE_LABELS[p.choice % CHOICE_LABELS.length]}
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    initial={{ scale: 0, y: 10 }}
                                    animate={{ scale: 1, y: 0 }}
                                    className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-emerald-500 bg-emerald-900/60 text-emerald-300 text-xs font-black"
                                  >
                                    ✓
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </motion.div>

        {/* ─── ランキング表示 ─── */}
        <DemoPodium wrapperRef={wrapperRef} />
      </div>
    </section>
  )
}

// ─── LP用 表彰台 ─────────────────────────────────────────────
const DEMO_RANKED = [
  { name: "ゆうき", icon: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=alpha", score: 5 },
  { name: "さくら", icon: "https://api.dicebear.com/9.x/adventurer/svg?seed=bravo", score: 4 },
  { name: "あいこ", icon: "https://api.dicebear.com/9.x/dylan/svg?seed=delta", score: 4 },
]

const DEMO_PODIUM_CONFIG = [
  {
    rank: 1, order: 2, height: "h-28", delay: 0.6,
    label: "1st", labelColor: "text-yellow-600", textSize: "text-4xl",
    badgeSize: 64, borderColor: "border-yellow-400",
    glow: "shadow-[0_0_40px_rgba(234,179,8,0.6)]",
    bg: "bg-gradient-to-b from-yellow-500/30 to-yellow-700/20 border-yellow-500/60",
    nameSize: "text-lg", scoreSize: "text-xl", scoreColor: "text-yellow-400",
    crown: true,
  },
  {
    rank: 2, order: 1, height: "h-20", delay: 0.2,
    label: "2nd", labelColor: "text-slate-500", textSize: "text-3xl",
    badgeSize: 52, borderColor: "border-slate-300",
    glow: "shadow-[0_0_24px_rgba(148,163,184,0.4)]",
    bg: "bg-gradient-to-b from-slate-500/25 to-slate-700/15 border-slate-400/50",
    nameSize: "text-base", scoreSize: "text-lg", scoreColor: "text-slate-400",
    crown: false,
  },
  {
    rank: 3, order: 3, height: "h-14", delay: 0.9,
    label: "3rd", labelColor: "text-amber-600", textSize: "text-2xl",
    badgeSize: 44, borderColor: "border-amber-600",
    glow: "shadow-[0_0_20px_rgba(217,119,6,0.35)]",
    bg: "bg-gradient-to-b from-amber-800/25 to-amber-900/15 border-amber-700/50",
    nameSize: "text-sm", scoreSize: "text-base", scoreColor: "text-amber-500",
    crown: false,
  },
]

const SPARKLE_CHARS = ["★", "✦", "◆", "✸", "⬟"]
const SPARKLE_POS = [
  { x: 10, y: 70, d: 0 }, { x: 25, y: 50, d: 0.3 }, { x: 50, y: 80, d: 0.6 },
  { x: 70, y: 55, d: 0.15 }, { x: 85, y: 68, d: 0.45 }, { x: 40, y: 45, d: 0.9 },
]

function DemoPodium({ wrapperRef }: { wrapperRef: React.RefObject<HTMLDivElement | null> }) {
  const podiumOrder = [1, 0, 2] // 2nd, 1st, 3rd
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })

  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [innerH, setInnerH] = useState<number | undefined>(undefined)
  useEffect(() => {
    const parent = wrapperRef.current
    const inner = innerRef.current
    if (!parent || !inner) return
    const update = () => {
      const s = Math.min(parent.clientWidth / 960, 1)
      setScale(s)
      setInnerH(inner.offsetHeight * s)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(parent)
    ro.observe(inner)
    return () => ro.disconnect()
  }, [wrapperRef])

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="mt-10 overflow-hidden"
      style={{ height: innerH }}
    >
      <div
        ref={innerRef}
        className="w-[960px] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]"
        style={{
          background: "radial-gradient(ellipse at center, #450a0a 0%, #1a0303 100%)",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          marginLeft: scale < 1 ? 0 : `calc((100% - 960px) / 2)`,
        }}
      >
        {/* ヘッダーバー（上のデモと同じスタイル） */}
        <div className="border-b border-yellow-600/20 px-6 py-4 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">👑</span>
            <span className="text-white font-black text-sm uppercase tracking-widest">リザルト画面</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-yellow-500/70">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            LIVE
          </div>
        </div>

        <div className="relative py-10 px-6">
          {/* Sparkles */}
          {SPARKLE_POS.map((pos, i) => (
            <motion.span
              key={i}
              className="absolute text-lg pointer-events-none select-none text-yellow-500/60"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1, 0],
                y: [-10, -40, -60],
                rotate: [0, 30, -20, 0],
              }}
              transition={{ duration: 1.8, delay: pos.d, repeat: Infinity, repeatDelay: 2.5, ease: "easeOut" }}
            >
              {SPARKLE_CHARS[i % SPARKLE_CHARS.length]}
            </motion.span>
          ))}

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: -16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="text-3xl md:text-4xl font-black tracking-tight text-center mb-10"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              結果発表
            </span>
          </motion.h3>

          {/* Podium */}
          <div className="relative z-10 flex items-end justify-center gap-6 max-w-2xl mx-auto">
            {podiumOrder.map((rankIdx) => {
              const p = DEMO_RANKED[rankIdx]
              const c = DEMO_PODIUM_CONFIG[rankIdx]
              return (
                <motion.div
                  key={c.rank}
                  className="flex flex-col items-center gap-2"
                  style={{ order: c.order }}
                  initial={{ opacity: 0, y: 80 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: c.delay, type: "spring", stiffness: 120, damping: 20 }}
                >
                  {c.crown && (
                    <motion.span
                      initial={{ scale: 0, rotate: -30, y: 20 }}
                      animate={isInView ? { scale: 1, rotate: 0, y: 0 } : {}}
                      transition={{ delay: 1.2, type: "spring", stiffness: 300, damping: 12 }}
                      className="text-5xl select-none filter drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]"
                    >
                      👑
                    </motion.span>
                  )}

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: c.delay + 0.2, type: "spring", stiffness: 260, damping: 20 }}
                    className={[
                      "flex items-center justify-center rounded-2xl border-4 bg-black/60 relative z-10",
                      c.borderColor, c.glow,
                    ].join(" ")}
                    style={{ width: c.badgeSize, height: c.badgeSize }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.icon} alt="" width={c.badgeSize - 12} height={c.badgeSize - 12} className="rounded-lg" />
                  </motion.div>

                  <span className={`font-black text-white text-center leading-tight tracking-wide drop-shadow-md ${c.nameSize}`}>
                    {p.name}
                  </span>

                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: c.delay + 0.4 }}
                    className={`font-black tabular-nums ${c.scoreSize} ${c.scoreColor} drop-shadow-sm`}
                  >
                    {p.score}<span className="text-xs font-bold text-white/50 ml-1">pt</span>
                  </motion.span>

                  <motion.div
                    className={[
                      "w-32 rounded-t-lg border-x-2 border-t-2 shadow-[0_0_30px_rgba(0,0,0,0.5)]",
                      c.height, c.bg,
                      "flex items-center justify-center relative overflow-hidden backdrop-blur-sm",
                    ].join(" ")}
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ delay: c.delay, type: "spring", stiffness: 150, damping: 24 }}
                    style={{ transformOrigin: "bottom" }}
                  >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 mix-blend-overlay" />
                    <span className={`font-black ${c.textSize} ${c.labelColor} select-none drop-shadow-md relative z-10`}>
                      {c.label}
                    </span>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── 最終CTA ──────────────────────────────────────────────────
function FinalCta() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <section className="py-32 px-6 relative overflow-hidden" ref={ref}>
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        animate={{ opacity: [0.12, 0.25, 0.12] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ background: "radial-gradient(ellipse, rgba(234,179,8,0.2) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div variants={stagger} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <motion.div variants={fadeUp} className="text-6xl mb-6">🏆</motion.div>
          <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
            さあ、<span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700">はじめよう。</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/55 text-lg mb-8 font-sans">
            登録不要・完全無料。今すぐクイズ大会を作って、<br className="hidden md:block" />参加者を驚かせよう。
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 mb-10">
            {["完全無料", "準備3分", "ログイン不要", "参加者数無制限"].map((badge) => (
              <span key={badge} className="px-4 py-1.5 rounded-full border border-yellow-600/40 text-yellow-400/80 text-xs font-bold uppercase tracking-wider bg-yellow-900/20">
                {badge}
              </span>
            ))}
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link
              href="/host/create"
              className="inline-block px-12 py-6 rounded-xl bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-600 text-black font-black text-2xl uppercase tracking-widest shadow-[0_8px_40px_rgba(234,179,8,0.5)] hover:shadow-[0_12px_60px_rgba(234,179,8,0.7)] hover:-translate-y-1.5 transition-all duration-200"
            >
              クイズ大会を作る 👑
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── フッター ─────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 px-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-xl">👑</span>
        <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 tracking-widest text-sm uppercase">
          Quiz Party JP
        </span>
      </div>
      <p className="text-xs text-white/25 font-sans">© 2026 Quiz Party JP. All rights reserved.</p>
    </footer>
  )
}

// ─── セパレーター ─────────────────────────────────────────────
function Divider({ gold = false }: { gold?: boolean }) {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className={`h-px bg-gradient-to-r from-transparent ${gold ? "via-yellow-600/30" : "via-white/10"} to-transparent`} />
    </div>
  )
}

// ─── メイン ───────────────────────────────────────────────────
export function LpContent() {
  return (
    <div
      className="min-h-screen font-serif text-white relative"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #3d0808 0%, #150202 50%, #0a0101 100%)" }}
    >
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10 pointer-events-none" />
      <Header />
      <Hero />
      <Divider gold />
      <UseCasesSection />
      <Divider />
      <HowItWorksSection />
      <Divider />
      <FeaturesSection />
      <Divider gold />
      <DemoPreview />
      <Divider gold />
      <FinalCta />
      <Footer />
    </div>
  )
}
