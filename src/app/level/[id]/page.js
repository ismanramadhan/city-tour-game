"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, MapPin, BookOpen, ArrowLeft, Scan } from "lucide-react";
import LocationBasedChallenge from "@/components/LocationBasedChallenge";
import WebARHunter from "@/components/WebARHunter";
import Trivia from "@/components/Trivia";

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const levelId = parseInt(params?.id || "1", 10);
  const [view, setView] = useState("challenge-select"); // challenge-select | location | ar | trivia

  const handleBackToMap = () => {
    router.push("/map");
  };

  const handleChallengeComplete = (score) => {
    // Mark level as completed - will be handled when navigating back
    router.push("/map?completed=" + levelId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-amber-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={
            view === "challenge-select"
              ? handleBackToMap
              : () => setView("challenge-select")
          }
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow hover:bg-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>
        <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
          Level {levelId}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {view === "challenge-select" && (
          <motion.div
            key="challenge-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-4 mt-8"
          >
            <h2 className="mb-2 text-xl font-bold text-zinc-800">
              Pilih Tantangan
            </h2>
            <p className="mb-6 text-sm text-zinc-600">
              Lokasi terverifikasi! Pilih tantangan untuk menyelesaikan level.
            </p>

            <div className="space-y-4 pb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView("location")}
                className="flex w-full items-center gap-4 rounded-2xl border-2 border-amber-200 bg-white p-6 text-left shadow-md transition-all hover:border-amber-400 hover:bg-amber-50"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100">
                  <MapPin className="h-7 w-7 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-800">
                    Tantangan Berbasis Lokasi
                  </h3>
                  <p className="text-sm text-zinc-600">
                    Tantangan keluar berdasarkan geolokasi (lat/lng) Anda
                  </p>
                </div>
                <Gamepad2 className="ml-auto h-5 w-5 text-zinc-400" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView("ar")}
                className="flex w-full items-center gap-4 rounded-2xl border-2 border-violet-200 bg-white p-6 text-left shadow-md transition-all hover:border-violet-400 hover:bg-violet-50"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100">
                  <Scan className="h-7 w-7 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-800">Web AR Hunter</h3>
                  <p className="text-sm text-zinc-600">
                    Demo Augmented Reality di browser (kamera + overlay)
                  </p>
                </div>
                <Gamepad2 className="ml-auto h-5 w-5 text-zinc-400" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView("trivia")}
                className="flex w-full items-center gap-4 rounded-2xl border-2 border-emerald-200 bg-white p-6 text-left shadow-md transition-all hover:border-emerald-400 hover:bg-emerald-50"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100">
                  <BookOpen className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-800">Trivia Heritage</h3>
                  <p className="text-sm text-zinc-600">
                    3 pertanyaan pilihan ganda tentang sejarah kota
                  </p>
                </div>
                <Gamepad2 className="ml-auto h-5 w-5 text-zinc-400" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {view === "location" && (
          <motion.div
            key="location"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LocationBasedChallenge
              onComplete={handleChallengeComplete}
              onBack={() => setView("challenge-select")}
            />
          </motion.div>
        )}

        {view === "ar" && (
          <motion.div
            key="ar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WebARHunter
              onComplete={handleChallengeComplete}
              onBack={() => setView("challenge-select")}
            />
          </motion.div>
        )}

        {view === "trivia" && (
          <motion.div
            key="trivia"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Trivia
              onComplete={(score) => {
                handleChallengeComplete(score);
              }}
              onBack={() => setView("challenge-select")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
