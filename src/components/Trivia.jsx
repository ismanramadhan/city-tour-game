"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, Lightbulb } from "lucide-react";

// Normalisasi item trivia: correct_answer (string) → correct (index)
function normalizeTrivia(trivia) {
  if (!Array.isArray(trivia)) return [];
  return trivia.map((item) => {
    const options = item.options ?? [];
    const idx = options.findIndex((o) => String(o).trim() === String(item.correct_answer).trim());
    const correct = idx >= 0 ? idx : 0;
    return { ...item, options, correct, fact: item.fact ?? "" };
  });
}

export default function Trivia({ trivia = [], onComplete, onBack }) {
  const questions = useMemo(() => normalizeTrivia(trivia), [trivia]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = questions[currentIndex];
  const isLastQuestion = questions.length > 0 && currentIndex === questions.length - 1;

  const handleSelectAnswer = (index) => {
    if (selectedAnswer !== null || !question) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === question.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete?.(score);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-amber-50 to-orange-50 p-4">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="rounded-lg bg-white/80 px-4 py-2 text-sm font-medium text-zinc-700 shadow hover:bg-white"
          >
            Kembali
          </button>
        </div>
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6 text-center">
          <p className="font-medium text-amber-800">Tidak ada pertanyaan untuk level ini.</p>
          <p className="mt-2 text-sm text-zinc-600">
            Edit <code className="rounded bg-amber-100 px-1">public/levels.json</code> dan isi <code className="rounded bg-amber-100 px-1">trivia</code> untuk level yang dipilih.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-amber-50 to-orange-50 p-4">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-lg bg-white/80 px-4 py-2 text-sm font-medium text-zinc-700 shadow hover:bg-white"
        >
          Kembali
        </button>
        <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
          {currentIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="mb-8 h-2 overflow-hidden rounded-full bg-amber-200">
        <motion.div
          className="h-full rounded-full bg-amber-500"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1"
        >
          <h2 className="mb-6 text-xl font-bold text-zinc-800">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correct;
              const isSelected = selectedAnswer === index;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <motion.button
                  key={index}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showResult}
                  className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left font-medium transition-all ${
                    showCorrect
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : showWrong
                      ? "border-red-500 bg-red-50 text-red-800"
                      : isSelected
                      ? "border-amber-500 bg-amber-50 text-amber-800"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-amber-300 hover:bg-amber-50/50"
                  }`}
                >
                  <span>{option}</span>
                  {showCorrect && <CheckCircle2 className="h-6 w-6 text-emerald-600" />}
                  {showWrong && <XCircle className="h-6 w-6 text-red-600" />}
                </motion.button>
              );
            })}
          </div>

          {showResult && question.fact && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50/80 p-4"
            >
              <Lightbulb className="h-5 w-5 shrink-0 text-amber-600" />
              <p className="text-sm text-amber-900">
                <span className="font-semibold">Fakta:</span> {question.fact}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-4 font-semibold text-white shadow-lg hover:bg-amber-600"
          >
            {isLastQuestion ? (
              <>Lihat Skor ({score}/{questions.length})</>
            ) : (
              <>
                Lanjut
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {isLastQuestion && showResult && (
        <div className="mt-4 rounded-xl bg-white/90 p-4 text-center shadow">
          <p className="text-lg font-bold text-zinc-800">
            Skor: {score} / {questions.length}
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            Klik &quot;Lihat Skor&quot; untuk menyelesaikan tantangan.
          </p>
        </div>
      )}
    </div>
  );
}
