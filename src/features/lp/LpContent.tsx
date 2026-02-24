"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function LpContent() {
  return (
    <div className="min-h-screen font-serif text-white relative flex flex-col items-center justify-center overflow-hidden">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, #450a0a 0%, #1a0303 100%)" }}
      />
      <div className="fixed inset-0 -z-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 pointer-events-none" />
      
      {/* Spotlights */}
      <div className="fixed top-0 left-1/4 w-1/2 h-1/2 bg-yellow-600/20 blur-[100px] rounded-full pointer-events-none animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-1/2 h-1/2 bg-red-900/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full px-6 py-12 flex flex-col items-center gap-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-black/40 border-2 border-yellow-600/50 shadow-[0_0_40px_rgba(234,179,8,0.3)] mb-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="text-6xl filter drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">👑</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            QUIZ KING
          </h1>
          
          <p className="text-xl md:text-2xl text-yellow-100/80 font-bold tracking-widest uppercase drop-shadow-md">
            The Ultimate Quiz Battle Platform
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/host/create" className="block group">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-black border border-yellow-600/30 p-8 text-center transition-all duration-300 hover:border-yellow-500/60 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:-translate-y-1">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="relative z-10 space-y-2">
                  <span className="text-4xl mb-2 block group-hover:scale-110 transition-transform duration-300">🎤</span>
                  <h2 className="text-2xl font-black text-yellow-500 uppercase tracking-wider">Host a Game</h2>
                  <p className="text-sm text-slate-400 font-sans">Create your own quiz show and invite players</p>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-black border border-slate-700/30 p-8 text-center transition-all duration-300 opacity-80 cursor-not-allowed">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
              <div className="relative z-10 space-y-2">
                <span className="text-4xl mb-2 block grayscale">🎮</span>
                <h2 className="text-2xl font-black text-slate-500 uppercase tracking-wider">Join a Game</h2>
                <p className="text-sm text-slate-600 font-sans">Enter a room code to participate (Coming Soon)</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-yellow-900/40 text-sm font-bold tracking-widest uppercase mt-12"
        >
          &copy; 2026 Quiz King Project
        </motion.div>
      </div>
    </div>
  )
}
