"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { RoomProvider, useRoom } from "@/providers/RoomProvider";
import { GameProvider } from "@/providers/GameProvider";
import { QuizCard } from "@/components/quiz/QuizCard";
import { QuizExplanation } from "@/components/quiz/QuizExplanation";
import { ParticipantBadge } from "@/components/badge/ParticipantBadge";
import { QuizChoices } from "@/components/quiz/QuizChoices";
import { AnswerGrid } from "./AnswerGrid";
import { ScoreBoard } from "./ScoreBoard";
import { ResultScreen } from "@/features/result/ResultScreen";
import type { Quiz, Answer } from "@/types/quiz";

// ── SWR fetcher ──────────────────────────────────────────────────────────────
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

// ── Inner board (needs RoomProvider context) ─────────────────────────────────
function BoardInner({ roomId }: { roomId: string }) {
  const { phase, currentQuizIndex, participants } = useRoom();

  // Fetch quiz list
  const { data } = useSWR<{ quizzes: Quiz[] }>(
    `/api/quizzes?roomId=${roomId}`,
    fetcher
  );
  const quizzes = data?.quizzes ?? [];
  const currentQuiz = quizzes[currentQuizIndex] ?? null;

  // answersMap: participantId → choiceIndex  (for current quiz)
  const [answersMap, setAnswersMap] = useState<Map<string, number>>(new Map());
  const [showExplanation, setShowExplanation] = useState(false);
  const [showRanking, setShowRanking] = useState(false);

  // Reset answersMap when quiz changes
  useEffect(() => {
    setAnswersMap(new Map());
    setShowExplanation(false);
    setShowRanking(false);
  }, [currentQuizIndex]);

  // Realtime subscription for answers
  useEffect(() => {
    if (!currentQuiz) return;

    const supabase = createClient();

    // Fetch existing answers for this quiz
    supabase
      .from("answers")
      .select("*")
      .eq("quiz_id", currentQuiz.id)
      .then(({ data: rows }) => {
        if (rows) {
          setAnswersMap((prev) => {
            const next = new Map(prev);
            (rows as Answer[]).forEach((row) => {
              next.set(row.participant_id, row.choice_index);
            });
            return next;
          });
        }
      });

    const channel = supabase
      .channel(`answers:quiz:${currentQuiz.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "answers",
          filter: `quiz_id=eq.${currentQuiz.id}`,
        },
        (payload) => {
          const row = payload.new as Answer;
          setAnswersMap((prev) => {
            const next = new Map(prev);
            next.set(row.participant_id, row.choice_index);
            return next;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentQuiz]);

  // ── Phase: result ────────────────────────────────────────────────────────
  if (phase === "result") {
    return <ResultScreen participants={participants} />;
  }

  // ── Phase: waiting ───────────────────────────────────────────────────────
  if (phase === "waiting") {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,#be123c_0%,#881337_40%,#4c0519_100%)] flex flex-col items-center justify-center relative overflow-hidden text-white font-serif">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
        
        {/* Golden frame border */}
        <div className="absolute inset-4 border-2 border-yellow-600/30 rounded-3xl pointer-events-none" />
        <div className="absolute inset-6 border border-yellow-600/20 rounded-2xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl px-6 space-y-16 text-center">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="space-y-6"
          >
            <div className="inline-block relative">
              <motion.div 
                className="absolute -inset-8 bg-yellow-500/20 blur-3xl rounded-full"
                animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <h1 className="relative text-7xl md:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
                  style={{ textShadow: "0 2px 0 #713f12, 0 4px 0 #451a03, 0 10px 20px rgba(0,0,0,0.5)" }}>
                格付<span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">王</span>
              </h1>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
              <p className="text-yellow-100/80 text-xl font-medium tracking-[0.2em] uppercase font-sans">
                Quiz King Check
              </p>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
            </div>
            
            <p className="text-white/90 text-2xl font-bold tracking-widest bg-black/20 py-2 px-8 rounded-full inline-block backdrop-blur-sm border border-white/10">
              参加者待機中...
            </p>
          </motion.div>

          {/* Participant list */}
          {participants.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-6 p-8 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-sm max-w-md mx-auto"
            >
              <div className="w-20 h-20 rounded-full border-4 border-yellow-500/30 border-t-yellow-400 animate-spin" />
              <p className="text-yellow-100 text-xl font-bold tracking-wider">
                エントリー受付中
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-transparent via-black/30 to-transparent">
                <span className="text-yellow-400 text-lg">◆</span>
                <p className="text-xl font-bold tracking-widest text-white">
                  現在の挑戦者: <span className="text-yellow-400 text-3xl mx-2">{participants.length}</span> 名
                </p>
                <span className="text-yellow-400 text-lg">◆</span>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <AnimatePresence>
                  {participants.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.7, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    >
                      <ParticipantBadge name={p.name} icon={p.icon} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // ── Phase: question / reveal ─────────────────────────────────────────────
  return (
    <div
      className="h-screen w-full font-serif text-slate-50 relative overflow-hidden flex flex-col"
      style={{ background: "radial-gradient(ellipse at center, #450a0a 0%, #1a0303 100%)" }}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 pointer-events-none" />

      {/* Main Content Area */}
      <div className="flex-1 w-full h-full p-4 md:p-6 lg:p-8 flex flex-col gap-6 relative z-10">
        
        {/* Phase: question OR reveal */}
        {(phase === "question" || phase === "reveal") && currentQuiz && (
          <div className="h-full grid grid-cols-10 gap-6">
            {/* Left Column (6): Question */}
            <div className="col-span-6 h-full flex flex-col relative">
              <QuizCard
                question={currentQuiz.question}
                questionNumber={currentQuizIndex + 1}
                total={quizzes.length}
                compact={false}
              />
              
              {/* Explanation Button (Reveal Phase Only) */}
              {phase === 'reveal' && (
                <button
                  onClick={() => setShowExplanation(true)}
                  className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 hover:bg-black/60 border border-white/20 text-white/90 hover:text-white transition-all text-sm font-bold uppercase tracking-wider backdrop-blur-md cursor-pointer shadow-lg"
                >
                  <span className="text-xl">💡</span>
                  <span>Explanation</span>
                </button>
              )}
            </div>

            {/* Right Column (4): Side Panel */}
            <div className="col-span-4 h-full flex flex-col gap-4 min-h-0 overflow-y-auto">
              {/* Top Status Area */}
              {phase === 'reveal' ? (
                /* Correct answer banner */
                <div className="hidden" />
              ) : (
                /* Answer Count */
                <div className="flex-shrink-0 flex items-center justify-center py-2">
                  <div className="flex items-baseline gap-2 text-white">
                    <span className="text-4xl font-black tabular-nums text-cyan-400 drop-shadow-md">
                      {answersMap.size}
                    </span>
                    <span className="text-slate-400 text-lg font-bold">
                      / {participants.length}
                    </span>
                  </div>
                </div>
              )}

              {/* Quiz Choices */}
              <div className="flex-shrink-0">
                <QuizChoices
                  choices={currentQuiz.choices}
                  correctIndex={phase === 'reveal' ? currentQuiz.correct_index : undefined}
                  disabled={true}
                />
              </div>

              {/* Answer Grid */}
              <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                <AnswerGrid
                  participants={participants}
                  answersMap={answersMap}
                  correctIndex={currentQuiz.correct_index}
                  revealed={phase === 'reveal'}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Explanation Modal */}
      <AnimatePresence>
        {showExplanation && currentQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowExplanation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[85vh] overflow-y-auto relative"
            >
              <QuizExplanation explanation={currentQuiz.explanation} />
              
              <button
                onClick={() => setShowExplanation(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Root export (wraps providers) ─────────────────────────────────────────────
export function BoardContent() {
  const params = useParams();
  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : (params.roomId as string);

  if (!roomId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-400 text-xl font-bold">Room ID が見つかりません</p>
      </div>
    );
  }

  return (
    <RoomProvider roomId={roomId}>
      <GameProvider roomId={roomId}>
        <BoardInner roomId={roomId} />
      </GameProvider>
    </RoomProvider>
  );
}
