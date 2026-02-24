"use client"

import { useState } from "react"

// ── DiceBear ──────────────────────────────────────────────────────────────────
const DICEBEAR_STYLES = [
  "pixel-art",
  "fun-emoji",
  "bottts",
  "adventurer",
  "lorelei",
  "big-smile",
  "croodles",
  "miniavs",
  "dylan",
  "notionists",
] as const

const SEEDS = [
  "alpha", "bravo", "charlie", "delta", "echo",
  "foxtrot", "golf", "hotel", "india", "juliet",
  "kilo", "lima", "mike", "november", "oscar", "papa",
]

function avatarUrl(style: string, seed: string) {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`
}

// ── Emoji sets ────────────────────────────────────────────────────────────────
const EMOJI_CATEGORIES: Record<string, string[]> = {
  "動物": [
    "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯",
    "🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦅",
    "🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌",
    "🐞","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🐡","🐠",
    "🐟","🐬","🐳","🦈","🐊","🐅","🐆","🦓","🐘","🦒",
    "🦘","🦬","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙",
  ],
  "海・水": [
    "🐬","🐳","🦈","🐙","🦑","🦞","🦀","🦐","🐡","🐠",
    "🐟","🐚","🪸","🌊","⛵","🏄","🤿","🐋","🦭","🪼",
  ],
  "鳥・空": [
    "🦅","🦆","🦉","🐦","🐧","🐔","🦚","🦜","🦢","🕊",
    "🪶","🦩","🦤","🪹","🪺","🐓","🦃","🪽","🦋","🐝",
  ],
  "食べ物": [
    "🍎","🍊","🍋","🍇","🍓","🫐","🍑","🥭","🍍","🥝",
    "🍕","🍔","🌮","🍜","🍣","🍱","🧁","🍰","🍩","🍫",
    "🍬","🍭","🍦","🧇","🥞","🍙","🍚","🍛","🥘","🫕",
  ],
  "スポーツ": [
    "⚽","🏀","🏈","⚾","🎾","🏐","🎱","🏓","🏸","🥊",
    "🎯","🥋","🎿","🏂","🪂","🏋","🤸","🏄","🧗","🤺",
  ],
  "自然・植物": [
    "🌸","🌺","🌻","🌹","🌷","🌼","💐","🌿","🍀","🍁",
    "🍂","🍃","🌱","🌲","🌳","🌴","🪴","🎋","🎍","🌾",
    "🍄","🌵","🐾","⛰","🌋","🗻","🏔","🌊","🌈","❄",
  ],
  "宇宙・天気": [
    "🌟","⭐","🌙","☀","🌤","⛅","🌩","❄","🌈","☄",
    "🪐","🌍","🌏","🌕","🔭","🛸","🚀","🛰","💫","✨",
  ],
  "ゲーム・エンタメ": [
    "🎮","🕹","🎲","🎭","🎨","🎬","🎵","🎸","🎹","🥁",
    "🎺","🎻","🪗","🎤","🎧","🎯","🏆","🥇","🎖","🃏",
  ],
  "魔法・ファンタジー": [
    "🧙","🧝","🧛","🧜","🧚","🦸","🦹","👺","👹","👻",
    "💀","🎃","🔮","🪄","⚔","🛡","🗡","🧿","🔯","⚡",
  ],
  "顔": [
    "😊","😎","🥳","🤩","😈","🤖","👾","😸","🙈","😂",
    "🥹","😍","🤯","🥸","🫠","🤠","😤","🤑","🥴","👽",
  ],
}

// ── RoboHash ─────────────────────────────────────────────────────────────────
const ROBOHASH_SETS = [
  { id: "set1", label: "ロボット",   desc: "カラフルなメカキャラ" },
  { id: "set2", label: "モンスター", desc: "丸くてかわいいクリーチャー" },
  { id: "set3", label: "ロボット頭", desc: "シンプルな頭部のみ" },
  { id: "set4", label: "ネコ",       desc: "David Revoy 作の猫キャラ" },
  { id: "set5", label: "人間",       desc: "Pablo Stanley 作のキャラ" },
] as const

function roboUrl(seed: string, set: string, size = 96) {
  return `https://robohash.org/${encodeURIComponent(seed)}.png?set=${set}&size=${size}x${size}`
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
type TabType = "dicebear" | "robohash" | "emoji"

export function PlaygroundContent() {
  const [tab, setTab] = useState<TabType>("dicebear")

  // DiceBear state
  const [activeStyle, setActiveStyle] = useState<string>("pixel-art")
  const [selectedSeed, setSelectedSeed] = useState<string | null>(null)

  // RoboHash state
  const [roboSet, setRoboSet] = useState<string>("set1")
  const [selectedRoboSeed, setSelectedRoboSeed] = useState<string | null>(null)

  // Emoji state
  const [activeCategory, setActiveCategory] = useState<string>("動物")
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)

  return (
    <div
      className="min-h-screen font-serif text-white"
      style={{ background: "radial-gradient(ellipse at center, #450a0a 0%, #1a0303 100%)" }}
    >
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-xs text-yellow-500/60 uppercase tracking-[0.3em] font-bold">Debug</p>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700">
            Icon Preview
          </h1>
        </div>

        {/* Main tabs */}
        <div className="flex gap-2 justify-center flex-wrap">
          {([
            ["dicebear", "DiceBear"],
            ["robohash", "RoboHash"],
            ["emoji",    "絵文字セット"],
          ] as const).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "px-6 py-2.5 rounded-lg text-sm font-black uppercase tracking-wider border transition-all",
                tab === t
                  ? "bg-yellow-500/20 border-yellow-400/60 text-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                  : "bg-black/30 border-white/10 text-slate-400 hover:border-white/20 hover:text-white",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── DiceBear Tab ── */}
        {tab === "dicebear" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-yellow-600/20 bg-yellow-900/10 text-sm text-yellow-200/70">
              💡 DiceBearに動物専用スタイルはありません。ゲーム向けなら <strong className="text-yellow-300">pixel-art</strong> / <strong className="text-yellow-300">fun-emoji</strong> / <strong className="text-yellow-300">bottts</strong> がおすすめ。
            </div>

            {/* Style Tabs */}
            <div className="flex flex-wrap gap-2">
              {DICEBEAR_STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => { setActiveStyle(style); setSelectedSeed(null) }}
                  className={[
                    "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all",
                    activeStyle === style
                      ? "bg-yellow-500/20 border-yellow-400/60 text-yellow-300"
                      : "bg-black/30 border-white/10 text-slate-400 hover:border-white/20 hover:text-white",
                  ].join(" ")}
                >
                  {style}
                </button>
              ))}
            </div>

            {/* Avatar Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {SEEDS.map((seed) => (
                <button
                  key={seed}
                  onClick={() => setSelectedSeed(seed === selectedSeed ? null : seed)}
                  className={[
                    "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                    selectedSeed === seed
                      ? "bg-yellow-500/20 border-yellow-400/60 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                      : "bg-black/30 border-white/10 hover:border-white/20 hover:bg-black/50",
                  ].join(" ")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl(activeStyle, seed)}
                    alt={seed}
                    width={56}
                    height={56}
                    className="rounded-lg"
                  />
                  <span className="text-[10px] text-slate-500 font-mono truncate w-full text-center">
                    {seed}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Preview */}
            {selectedSeed && (
              <div className="flex items-center gap-8 p-6 rounded-2xl border border-yellow-600/30 bg-black/40 backdrop-blur-md">
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl(activeStyle, selectedSeed)}
                    alt={selectedSeed}
                    width={120}
                    height={120}
                    className="rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.2)]"
                  />
                  <p className="text-yellow-400 font-black">{selectedSeed}</p>
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-xs font-bold text-yellow-500/80 uppercase tracking-wider">URL</p>
                  <code className="block text-xs text-slate-300 bg-black/60 border border-white/10 rounded-lg px-4 py-3 font-mono break-all">
                    {avatarUrl(activeStyle, selectedSeed)}
                  </code>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── RoboHash Tab ── */}
        {tab === "robohash" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-yellow-600/20 bg-yellow-900/10 text-sm text-yellow-200/70">
              💡 RoboHash はテキストseedから画像を決定論的生成。完全無料・制限なし・npmパッケージ不要。
            </div>

            {/* Set selector */}
            <div className="flex flex-wrap gap-3">
              {ROBOHASH_SETS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setRoboSet(s.id); setSelectedRoboSeed(null) }}
                  className={[
                    "flex flex-col items-start px-4 py-2.5 rounded-xl border transition-all text-left",
                    roboSet === s.id
                      ? "bg-yellow-500/20 border-yellow-400/60 text-yellow-200"
                      : "bg-black/30 border-white/10 text-slate-400 hover:border-white/20 hover:text-white",
                  ].join(" ")}
                >
                  <span className="text-xs font-black uppercase tracking-wider">{s.label}</span>
                  <span className="text-[10px] opacity-60 mt-0.5">{s.desc}</span>
                </button>
              ))}
            </div>

            {/* Avatar Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {SEEDS.map((seed) => (
                <button
                  key={seed}
                  onClick={() => setSelectedRoboSeed(seed === selectedRoboSeed ? null : seed)}
                  className={[
                    "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                    selectedRoboSeed === seed
                      ? "bg-yellow-500/20 border-yellow-400/60 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                      : "bg-black/30 border-white/10 hover:border-white/20 hover:bg-black/50",
                  ].join(" ")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={roboUrl(seed, roboSet, 80)}
                    alt={seed}
                    width={56}
                    height={56}
                    className="rounded-lg"
                  />
                  <span className="text-[10px] text-slate-500 font-mono truncate w-full text-center">
                    {seed}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Preview */}
            {selectedRoboSeed && (
              <div className="flex items-center gap-8 p-6 rounded-2xl border border-yellow-600/30 bg-black/40 backdrop-blur-md">
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={roboUrl(selectedRoboSeed, roboSet, 200)}
                    alt={selectedRoboSeed}
                    width={120}
                    height={120}
                    className="rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.2)]"
                  />
                  <p className="text-yellow-400 font-black">{selectedRoboSeed}</p>
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-xs font-bold text-yellow-500/80 uppercase tracking-wider">URL</p>
                  <code className="block text-xs text-slate-300 bg-black/60 border border-white/10 rounded-lg px-4 py-3 font-mono break-all">
                    {roboUrl(selectedRoboSeed, roboSet, 128)}
                  </code>
                  <p className="text-xs text-slate-500">
                    seedは任意の文字列（プレイヤー名など）。同じseedは常に同じ画像を返します。
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Emoji Tab ── */}
        {tab === "emoji" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-yellow-600/20 bg-yellow-900/10 text-sm text-yellow-200/70">
              💡 絵文字はOSによって見た目が変わります。iOSは可愛いですが、Androidでは地味になることがあります。
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(EMOJI_CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setSelectedEmoji(null) }}
                  className={[
                    "px-4 py-1.5 rounded-lg text-xs font-bold border transition-all",
                    activeCategory === cat
                      ? "bg-yellow-500/20 border-yellow-400/60 text-yellow-300"
                      : "bg-black/30 border-white/10 text-slate-400 hover:border-white/20 hover:text-white",
                  ].join(" ")}
                >
                  {cat} ({EMOJI_CATEGORIES[cat].length})
                </button>
              ))}
            </div>

            {/* Emoji Grid */}
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2">
              {EMOJI_CATEGORIES[activeCategory].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji === selectedEmoji ? null : emoji)}
                  className={[
                    "aspect-square flex items-center justify-center text-3xl rounded-xl border transition-all",
                    selectedEmoji === emoji
                      ? "bg-yellow-500/20 border-yellow-400/60 shadow-[0_0_15px_rgba(234,179,8,0.3)] scale-110"
                      : "bg-black/30 border-white/5 hover:border-white/20 hover:bg-black/50 hover:scale-105",
                  ].join(" ")}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Selected preview */}
            {selectedEmoji && (
              <div className="flex items-center gap-6 p-6 rounded-2xl border border-yellow-600/30 bg-black/40 backdrop-blur-md">
                <div className="text-8xl">{selectedEmoji}</div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-yellow-500/80 uppercase tracking-wider">選択中</p>
                  <p className="text-3xl font-black text-yellow-200">
                    {selectedEmoji} &nbsp;
                    <span className="text-slate-400 text-sm font-mono">U+{selectedEmoji.codePointAt(0)?.toString(16).toUpperCase()}</span>
                  </p>
                  <p className="text-xs text-slate-500">この絵文字をそのまま icon フィールドに保存できます（スキーマ変更不要）</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
