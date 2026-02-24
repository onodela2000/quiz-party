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

  // Reset answersMap when quiz changes
  useEffect(() => {
    setAnswersMap(new Map());
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
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glow orb */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 w-full max-w-4xl px-6 space-y-12">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="text-center space-y-2"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
              Quiz King
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">
              参加者<span className="text-cyan-400">待機中</span>
            </h1>
            <p className="text-white/40 text-lg font-semibold">
              Waiting for players...
            </p>
          </motion.div>

          {/* Participant list */}
          {participants.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/30 text-2xl font-bold"
            >
              まだ誰も参加していません
            </motion.p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-white/50 text-center">
                {participants.length} 名が参加中
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <AnimatePresence>
                  {participants.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
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
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-indigo-600/8 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Quiz card */}
        {currentQuiz && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`quiz-${currentQuizIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
            >
              <QuizCard
                question={currentQuiz.question}
                questionNumber={currentQuizIndex + 1}
                total={quizzes.length}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Phase: question — show answer count */}
        {phase === "question" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4"
          >
            <div
              className={[
                "flex items-center gap-3 px-6 py-3 rounded-2xl",
                "bg-white/[0.05] border border-white/10",
                "shadow-[0_0_24px_rgba(6,182,212,0.12)]",
              ].join(" ")}
            >
              <motion.span
                key={answersMap.size}
                initial={{ scale: 1.5, color: "#06b6d4" }}
                animate={{ scale: 1, color: "#ffffff" }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-black tabular-nums text-white"
              >
                {answersMap.size}
              </motion.span>
              <span className="text-white/50 text-xl font-semibold">
                / {participants.length}
              </span>
              <span className="text-white/60 text-lg font-bold ml-1">人回答済み</span>
            </div>
          </motion.div>
        )}

        {/* Phase: reveal — answer grid + explanation */}
        {phase === "reveal" && currentQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Correct answer announcement */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className={[
                "flex items-center justify-center gap-4 py-4 px-6 rounded-2xl",
                "bg-red-500/15 border border-red-500/50",
                "shadow-[0_0_36px_rgba(239,68,68,0.3)]",
              ].join(" ")}
            >
              <span className="text-red-400 text-3xl">★</span>
              <span className="text-2xl md:text-3xl font-black text-red-300">
                正解:{" "}
                <span className="text-white">
                  {(currentQuiz.choices as string[])[currentQuiz.correct_index]}
                </span>
              </span>
              <span className="text-red-400 text-3xl">★</span>
            </motion.div>

            <AnswerGrid
              participants={participants}
              answersMap={answersMap}
              correctIndex={currentQuiz.correct_index}
              revealed={true}
            />

            <QuizExplanation explanation={currentQuiz.explanation} />

            {/* Score board */}
            <ScoreBoard participants={participants} />
          </motion.div>
        )}

        {/* Phase: question — answer grid (unrevealed) */}
        {phase === "question" && currentQuiz && participants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AnswerGrid
              participants={participants}
              answersMap={answersMap}
              correctIndex={currentQuiz.correct_index}
              revealed={false}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Root export (wraps providers) ─────────────────────────────────────────────
export function BoardContent() {
  const params = useParams();
  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : (params.roomId as string);

  if (!roomId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-white/40 text-xl font-bold">Room ID が見つかりません</p>
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
