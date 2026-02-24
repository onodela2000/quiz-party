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
          スマホだけで、<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
            会場が熱狂する。
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed mb-10 font-sans"
        >
          クイズ大会を、今すぐ無料で開催しよう。<br />
          URLを共有するだけで参加者全員がリアルタイムで繋がる。
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
  { icon: "🏢", title: "企業研修・チームビルディング", desc: "社内研修をゲーム化して知識定着率UP。全員参加型で眠い研修がガラリと変わる。", tag: "企業向け" },
  { icon: "🍻", title: "歓迎会・忘年会・宴会", desc: "誰もが主役になれる余興に。幹事の準備ゼロ、その場で作ってすぐ盛り上がれる。", tag: "イベント" },
  { icon: "🎓", title: "学校・授業・サークル", desc: "授業の理解度をリアルタイムでチェック。サークルの新歓やLT大会にも最適。", tag: "教育" },
  { icon: "📡", title: "オンライン配信・ライブ", desc: "視聴者参加型コンテンツで配信を盛り上げる。URLを貼るだけで全員が参加できる。", tag: "配信" },
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
            たった<span className="text-yellow-400">3ステップ</span>で開催
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
  { name: "田中", correct: true }, { name: "鈴木", correct: false },
  { name: "佐藤", correct: true }, { name: "山田", correct: true },
  { name: "伊藤", correct: false }, { name: "渡辺", correct: true },
  { name: "中村", correct: true }, { name: "小林", correct: false },
]

function DemoPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    if (visibleCount >= DEMO_PARTICIPANTS.length) return
    const t = setTimeout(() => setVisibleCount((v) => v + 1), 400)
    return () => clearTimeout(t)
  }, [isInView, visibleCount])

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-500/60 mb-3">Live Demo</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            こんな<span className="text-yellow-400">ライブ感</span>が生まれる
          </h2>
          <p className="text-white/50 mt-4 font-sans">参加者の回答がリアルタイムでホスト画面に集まる様子</p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}
          className="rounded-2xl border border-yellow-600/30 bg-black/60 backdrop-blur-sm overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]"
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

          <div className="p-6 md:p-8 space-y-6">
            {/* クイズ問題 */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-red-950/60 to-black/60 border border-yellow-600/20">
              <span className="text-xs font-black text-yellow-600/70 uppercase tracking-widest block mb-2">Q.1 / 5</span>
              <p className="text-white font-black text-xl md:text-2xl">日本で一番高い山はどれ？</p>
            </div>

            {/* 選択肢 */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "A", text: "富士山", cls: "from-blue-900/60 to-blue-950/60 border-blue-500/30" },
                { label: "B", text: "北岳", cls: "from-red-900/60 to-red-950/60 border-red-500/30" },
                { label: "C", text: "奥穂高岳", cls: "from-green-900/60 to-green-950/60 border-green-500/30" },
                { label: "D", text: "槍ヶ岳", cls: "from-yellow-900/60 to-yellow-950/60 border-yellow-500/30" },
              ].map((c) => (
                <div key={c.label} className={`flex items-center gap-3 p-3 rounded-xl border bg-gradient-to-r ${c.cls}`}>
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-white text-sm shrink-0">{c.label}</span>
                  <span className="text-white font-bold text-sm">{c.text}</span>
                </div>
              ))}
            </div>

            {/* 回答グリッド */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs font-bold text-white/40 uppercase tracking-widest">
                <span>回答状況</span>
                <span>{visibleCount} / {DEMO_PARTICIPANTS.length}</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-200"
                  animate={{ width: `${(visibleCount / DEMO_PARTICIPANTS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                <AnimatePresence>
                  {DEMO_PARTICIPANTS.slice(0, visibleCount).map((p) => (
                    <motion.div
                      key={p.name}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className={[
                        "aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border-2",
                        p.correct ? "bg-yellow-900/30 border-yellow-500/50" : "bg-slate-900/50 border-slate-600/30",
                      ].join(" ")}
                    >
                      <span className="text-xs font-black text-white/60">{p.name}</span>
                      <span className="text-sm">{p.correct ? "✓" : "✕"}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
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
