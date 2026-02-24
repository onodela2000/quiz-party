"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView, AnimatePresence } from "framer-motion"

// ─── SVG アイコン (Lucide風 / 1.5pxストローク) ────────────────
function Svg({ className = "w-6 h-6", children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

const IconBolt = ({ c }: { c?: string }) => <Svg className={c}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></Svg>
const IconPhone = ({ c }: { c?: string }) => <Svg className={c}><rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" /></Svg>
const IconTrophy = ({ c }: { c?: string }) => <Svg className={c}><path d="M8 21h8M12 17v4M6 3h12v6a6 6 0 01-12 0V3z" /><path d="M6 6H3v3a3 3 0 003 3M18 6h3v3a3 3 0 01-3 3" /></Svg>
const IconPencil = ({ c }: { c?: string }) => <Svg className={c}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></Svg>
const IconLink = ({ c }: { c?: string }) => <Svg className={c}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></Svg>
const IconUsers = ({ c }: { c?: string }) => <Svg className={c}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></Svg>
const IconBuilding = ({ c }: { c?: string }) => <Svg className={c}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></Svg>
const IconVideo = ({ c }: { c?: string }) => <Svg className={c}><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></Svg>
const IconBook = ({ c }: { c?: string }) => <Svg className={c}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></Svg>
const IconCheck = ({ c }: { c?: string }) => <Svg className={c}><polyline points="20 6 9 17 4 12" /></Svg>
const IconStar = ({ c }: { c?: string }) => <Svg className={c}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Svg>
const IconParty = ({ c }: { c?: string }) => <Svg className={c}><path d="M5.8 11.3L2 22l10.7-3.79M4 3h.01M22 8h.01M15 2h.01M22 20h.01M2 8h.01" /><path d="M19.44 4.56l-5.78 5.78M10.67 15.38l-2.05 2.06M6.34 19.72l-1.34-1.34M16.67 4.78l2.55 9.54-9.54-2.55z" /></Svg>
const IconMd = ({ c }: { c?: string }) => <Svg className={c}><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12v3l2-2 2 2v-3M16 9v6M13 9l3 3 3-3" /></Svg>
const IconFree = ({ c }: { c?: string }) => <Svg className={c}><circle cx="12" cy="12" r="10" /><path d="M9.5 9.5s.3-1.5 2.5-1.5 2.5 1.5 2.5 2.5c0 2.5-5 2.5-5 5h5M12 19v.5" /></Svg>

// ─── アニメーション定数 ───────────────────────────────────────
const inUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } } }
const stagger = (d = 0.08) => ({ hidden: {}, visible: { transition: { staggerChildren: d } } })

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return <section id={id} className={`py-24 px-6 ${className}`}>{children}</section>
}

function SectionLabel({ text }: { text: string }) {
  return <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-amber-500/50 mb-4">{text}</p>
}

// ─── ヘッダー ─────────────────────────────────────────────────
function Header() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-white/5 py-3" : "py-5",
      ].join(" ")}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* ロゴ */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
            <IconTrophy c="w-4 h-4 text-black" />
          </div>
          <span className="font-black text-white tracking-tight text-base">
            Quiz Party <span className="text-amber-400">JP</span>
          </span>
        </div>
        <Link
          href="/host/create"
          className="px-5 py-2.5 rounded-lg bg-amber-500 text-black font-black text-sm tracking-wide hover:bg-amber-400 transition-colors"
        >
          無料で始める
        </Link>
      </div>
    </motion.header>
  )
}

// ─── ヒーロー ─────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden">
      {/* 背景デコ */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] opacity-[0.07]"
          style={{ background: "radial-gradient(ellipse, #B45309 0%, transparent 70%)" }}
        />
        {/* 大きな装飾文字 */}
        <div
          className="absolute bottom-0 right-0 text-[280px] font-black text-white/[0.025] leading-none select-none pointer-events-none translate-x-8 translate-y-12"
          style={{ fontFamily: "serif" }}
        >
          問
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-4xl"
      >
        {/* バッジ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-amber-400 tracking-wider">完全無料 · ログイン不要 · 今すぐ開催</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-[clamp(2.8rem,8vw,5.5rem)] font-black text-white leading-[1.1] tracking-tight mb-6"
        >
          スマホだけで、<br />
          <span className="text-amber-400">会場が熱狂する。</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-[1.1rem] text-white/55 max-w-xl mx-auto leading-relaxed mb-12"
        >
          URLを共有するだけで参加者全員がリアルタイムで繋がる、<br className="hidden md:block" />
          クイズ大会プラットフォーム。準備はたった3分。
        </motion.p>

        {/* CTAボタン */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/host/create"
            className="px-10 py-4 rounded-xl bg-amber-500 text-black font-black text-lg tracking-wide shadow-[0_0_40px_rgba(245,158,11,0.35)] hover:bg-amber-400 hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 transition-all duration-200"
          >
            クイズ大会を作る
          </Link>
          <a
            href="#how"
            className="flex items-center gap-2 text-white/50 font-medium hover:text-white/80 transition-colors text-sm"
          >
            使い方を見る
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
          </a>
        </motion.div>

        {/* スタッツ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="grid grid-cols-3 gap-6 max-w-md mx-auto"
        >
          {[
            { val: "0円", label: "完全無料" },
            { val: "3分", label: "準備時間" },
            { val: "∞", label: "参加者数" },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-amber-400 mb-0.5">{val}</div>
              <div className="text-xs text-white/35 font-medium">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* スクロールインジケーター */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="text-[10px] text-white/40 font-medium tracking-widest uppercase">Scroll</div>
        <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
      </motion.div>
    </section>
  )
}

// ─── ユースケース ─────────────────────────────────────────────
const USE_CASES = [
  {
    icon: <IconBuilding c="w-5 h-5" />,
    tag: "企業研修",
    title: "研修・チームビルディング",
    desc: "社内研修をゲーム化して知識定着率UP。全員参加型で眠い研修がガラリと変わる。",
  },
  {
    icon: <IconParty c="w-5 h-5" />,
    tag: "イベント",
    title: "歓迎会・忘年会・宴会",
    desc: "準備ゼロで会場が一体になる余興。その場で作ってすぐ盛り上がれる。",
  },
  {
    icon: <IconBook c="w-5 h-5" />,
    tag: "教育",
    title: "授業・サークル・新歓",
    desc: "理解度をリアルタイムでチェック。LT大会や部活の勉強会にも。",
  },
  {
    icon: <IconVideo c="w-5 h-5" />,
    tag: "配信",
    title: "オンライン配信・ライブ",
    desc: "視聴者参加型コンテンツでエンゲージ爆増。URLを貼るだけで全員参加。",
  },
]

function UseCasesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <Section ref={ref}>
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div variants={inUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mb-14">
          <SectionLabel text="Use Cases" />
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            あらゆる場面で<br />
            <span className="text-amber-400">使われています。</span>
          </h2>
        </motion.div>
        <motion.div
          variants={stagger()}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {USE_CASES.map((uc, i) => (
            <motion.div
              key={uc.tag}
              variants={inUp}
              className="group flex gap-5 p-6 rounded-2xl border border-white/8 bg-white/[0.03] hover:border-amber-500/25 hover:bg-amber-500/[0.04] transition-all duration-300"
            >
              <div className="shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-amber-400 group-hover:border-amber-500/30 transition-colors">
                  {uc.icon}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-500/60 mb-1.5 block">{uc.tag}</span>
                <h3 className="text-base font-black text-white mb-2">{uc.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{uc.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}

// ─── 使い方 ───────────────────────────────────────────────────
const STEPS = [
  { icon: <IconPencil c="w-6 h-6" />, title: "クイズを作る", desc: "タイトルと問題を入力するだけ。難しい設定は一切不要。3分で大会が完成する。" },
  { icon: <IconLink c="w-6 h-6" />, title: "URLを共有する", desc: "自動生成された参加URLをLINEやSlackで送るだけ。アプリインストール不要。" },
  { icon: <IconUsers c="w-6 h-6" />, title: "全員でリアルタイム", desc: "ホスト画面に全員の回答がリアルタイムに集まる。正解発表・ランキングで熱狂が生まれる。" },
]

function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <Section id="how" ref={ref}>
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div variants={inUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mb-14">
          <SectionLabel text="How It Works" />
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            3ステップで<br />
            <span className="text-amber-400">開催できる。</span>
          </h2>
          <p className="text-white/45 mt-4 text-base">準備から本番まで、最短3分。むずかしい設定はゼロ。</p>
        </motion.div>

        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* 縦線 */}
          <div className="hidden md:block absolute left-[3.5rem] top-10 bottom-10 w-px bg-gradient-to-b from-amber-500/0 via-amber-500/20 to-amber-500/0" />
          <div className="space-y-2">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                variants={inUp}
                className="flex gap-7 md:gap-10 items-start p-6 md:p-8 rounded-2xl hover:bg-white/[0.02] transition-colors group"
              >
                {/* 番号 + アイコン */}
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl border border-amber-500/25 bg-amber-500/8 flex items-center justify-center text-amber-400 group-hover:border-amber-500/50 group-hover:bg-amber-500/15 transition-all">
                    {step.icon}
                  </div>
                  <span className="text-xs font-black text-white/20 tracking-widest">0{i + 1}</span>
                </div>
                {/* テキスト */}
                <div className="pt-1">
                  <h3 className="text-xl font-black text-white mb-2">{step.title}</h3>
                  <p className="text-white/45 leading-relaxed text-sm max-w-md">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={inUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mt-10 pl-6 md:pl-[6.5rem]">
          <Link
            href="/host/create"
            className="inline-flex items-center gap-2 text-amber-400 font-bold hover:text-amber-300 transition-colors text-sm"
          >
            今すぐ試してみる
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
          </Link>
        </motion.div>
      </div>
    </Section>
  )
}

// ─── 機能 ─────────────────────────────────────────────────────
const FEATURES = [
  { icon: <IconBolt c="w-5 h-5" />, title: "リアルタイム同期", desc: "参加者の回答がホスト画面に即時反映。全員の状況が一目でわかる。" },
  { icon: <IconPhone c="w-5 h-5" />, title: "スマホ完全対応", desc: "参加者はURLを開くだけ。アプリ不要でどの端末でも動く。" },
  { icon: <IconCheck c="w-5 h-5" />, title: "自動採点・スコア集計", desc: "正解・不正解を自動判定。スコアをリアルタイムで集計・表示。" },
  { icon: <IconTrophy c="w-5 h-5" />, title: "ドラマチックなランキング", desc: "ポディウム演出で盛り上がる結果発表。1位には王冠が輝く。" },
  { icon: <IconMd c="w-5 h-5" />, title: "Markdown対応", desc: "問題文にMarkdownが使える。コードブロック・数式・装飾自在。" },
  { icon: <IconFree c="w-5 h-5" />, title: "完全無料・制限なし", desc: "登録不要ですぐ使える。問題数・参加者数に制限なし。" },
]

function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <Section ref={ref} className="border-t border-white/5">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <div className="md:flex md:gap-16 md:items-start">
          {/* 左：見出し */}
          <motion.div
            variants={inUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="md:w-72 mb-12 md:mb-0 md:sticky md:top-32"
          >
            <SectionLabel text="Features" />
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
              盛り上がるための<br />機能が全部揃っている。
            </h2>
            <p className="text-white/40 mt-4 text-sm leading-relaxed">
              クイズ大会に必要なものは全部ここにある。追加費用なし、面倒な設定なし。
            </p>
          </motion.div>

          {/* 右：機能リスト */}
          <motion.div
            variants={stagger(0.07)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex-1 divide-y divide-white/6"
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={inUp}
                className="flex items-start gap-4 py-5 group hover:bg-white/[0.02] -mx-4 px-4 rounded-xl transition-colors"
              >
                <div className="shrink-0 mt-0.5 w-9 h-9 rounded-lg border border-white/10 bg-white/4 flex items-center justify-center text-amber-400 group-hover:border-amber-500/30 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-black text-white text-sm mb-1">{f.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  )
}

// ─── デモプレビュー ───────────────────────────────────────────
const DEMO_PPTS = [
  { name: "田中K", idx: 0 }, { name: "鈴木M", idx: 1 },
  { name: "佐藤Y", idx: 0 }, { name: "山田T", idx: 2 },
  { name: "伊藤H", idx: 3 }, { name: "渡辺S", idx: 0 },
  { name: "中村A", idx: 0 }, { name: "小林R", idx: 1 },
  { name: "加藤D", idx: 0 }, { name: "吉田C", idx: 2 },
  { name: "高橋B", idx: 0 }, { name: "松本E", idx: 3 },
]
const CHOICE_COLORS = [
  { bg: "bg-blue-900/50 border-blue-500/40", label: "bg-blue-600 text-white", text: "富士山" },
  { bg: "bg-rose-900/50 border-rose-500/40", label: "bg-rose-600 text-white", text: "北岳" },
  { bg: "bg-emerald-900/50 border-emerald-500/40", label: "bg-emerald-600 text-white", text: "奥穂高岳" },
  { bg: "bg-amber-900/50 border-amber-500/40", label: "bg-amber-600 text-black", text: "槍ヶ岳" },
]

function DemoPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView || count >= DEMO_PPTS.length) return
    const t = setTimeout(() => setCount((v) => v + 1), 380)
    return () => clearTimeout(t)
  }, [isInView, count])

  return (
    <Section ref={ref} className="border-t border-white/5">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div variants={inUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mb-12 text-center">
          <SectionLabel text="Live Demo" />
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            こんな<span className="text-amber-400">ライブ感</span>が生まれる。
          </h2>
          <p className="text-white/40 mt-3 text-sm">参加者の回答がリアルタイムでホスト画面に集まる様子</p>
        </motion.div>

        <motion.div
          variants={inUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="rounded-2xl border border-white/10 bg-[#0F0F14] overflow-hidden"
          style={{ boxShadow: "0 0 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)" }}
        >
          {/* タイトルバー */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/6 bg-white/[0.02]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-white/25 font-mono">quizparty.jp/host/a3f9k</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </div>
          </div>

          <div className="p-5 md:p-7 space-y-5">
            {/* 問題 */}
            <div className="p-5 rounded-xl border border-white/8 bg-white/[0.03]">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-black text-white/30 bg-white/8 px-2.5 py-1 rounded-full">Q 1 / 5</span>
                <div className="flex-1 h-px bg-white/6" />
                <span className="text-xs font-mono text-amber-500/60">00:23</span>
              </div>
              <p className="text-white font-black text-xl md:text-2xl leading-snug">日本で一番高い山はどれ？</p>
            </div>

            {/* 選択肢 */}
            <div className="grid grid-cols-2 gap-2.5">
              {CHOICE_COLORS.map((c, i) => (
                <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border ${c.bg}`}>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${c.label}`}>
                    {"ABCD"[i]}
                  </span>
                  <span className="text-white/80 font-bold text-sm">{c.text}</span>
                </div>
              ))}
            </div>

            {/* 回答状況 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white/30 uppercase tracking-widest">回答状況</span>
                <span className="text-xs font-mono text-amber-500/60">{count} / {DEMO_PPTS.length} 人</span>
              </div>
              <div className="h-1 bg-white/8 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-amber-500"
                  animate={{ width: `${(count / DEMO_PPTS.length) * 100}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              <div className="grid grid-cols-6 gap-2">
                <AnimatePresence>
                  {DEMO_PPTS.slice(0, count).map((p) => (
                    <motion.div
                      key={p.name}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border border-white/10 bg-white/5"
                    >
                      <div className={`w-4 h-4 rounded-full ${CHOICE_COLORS[p.idx].label.split(" ")[0]}`} />
                      <span className="text-[9px] font-bold text-white/40">{p.name}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}

// ─── 最終CTA ──────────────────────────────────────────────────
function FinalCta() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="py-32 px-6 relative overflow-hidden border-t border-white/5" ref={ref}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(180,83,9,0.12) 0%, transparent 65%)" }}
      />
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div variants={stagger(0.1)} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <motion.div variants={inUp}>
            <SectionLabel text="Get Started" />
          </motion.div>
          <motion.h2 variants={inUp} className="text-5xl md:text-6xl font-black text-white tracking-tight mb-5">
            さあ、<span className="text-amber-400">はじめよう。</span>
          </motion.h2>
          <motion.p variants={inUp} className="text-white/45 text-base mb-10 leading-relaxed">
            登録不要・完全無料。今すぐクイズ大会を作って、<br className="hidden md:block" />
            参加者を驚かせよう。
          </motion.p>
          <motion.div variants={inUp} className="flex flex-wrap justify-center gap-2 mb-10">
            {["完全無料", "準備3分", "ログイン不要", "参加者数無制限"].map((b) => (
              <span key={b} className="px-3.5 py-1.5 rounded-full border border-white/10 text-white/40 text-xs font-bold">
                {b}
              </span>
            ))}
          </motion.div>
          <motion.div variants={inUp}>
            <Link
              href="/host/create"
              className="inline-block px-12 py-5 rounded-xl bg-amber-500 text-black font-black text-xl tracking-wide shadow-[0_0_50px_rgba(245,158,11,0.4)] hover:bg-amber-400 hover:shadow-[0_0_70px_rgba(245,158,11,0.6)] hover:-translate-y-1 transition-all duration-200"
            >
              クイズ大会を作る
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
    <footer className="border-t border-white/5 py-8 px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center">
            <IconTrophy c="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-black text-white/70 text-sm tracking-tight">
            Quiz Party <span className="text-amber-400/80">JP</span>
          </span>
        </div>
        <p className="text-xs text-white/20">© 2026 Quiz Party JP</p>
      </div>
    </footer>
  )
}

// ─── メイン ───────────────────────────────────────────────────
export function LpContent() {
  return (
    <div
      className="min-h-screen text-white relative"
      style={{ background: "#0A0A0F" }}
    >
      {/* 微細なグリッドパターン */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      <Header />
      <Hero />
      <div className="h-px max-w-5xl mx-auto bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <UseCasesSection />
      <div className="h-px max-w-5xl mx-auto bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <HowItWorksSection />
      <FeaturesSection />
      <DemoPreview />
      <FinalCta />
      <Footer />
    </div>
  )
}
