"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lock, Star, MapPin } from "lucide-react";
import { TOTAL_LEVELS } from "@/lib/constants";
import LocationModal from "./LocationModal";
import { playClickSound, playLockedSound } from "@/lib/audio";

export default function SagaMap({ unlockedLevels = [1], onLevelClick }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const containerRef = useRef(null);

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform values untuk parallax layers
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const pathY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const handleNodeClick = (level) => {
    const isUnlocked = unlockedLevels.includes(level);
    
    if (!isUnlocked) {
      playLockedSound();
      return;
    }

    playClickSound();
    setSelectedLevel(level);
    setModalOpen(true);
  };

  const handleVerified = (levelId) => {
    onLevelClick?.(levelId);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-gradient-to-b from-sky-100 via-amber-50/80 to-emerald-100 py-8"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Decorative background with parallax */}
        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ y: backgroundY }}
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />
          <div className="absolute -left-20 top-1/2 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="absolute -right-32 top-2/3 h-48 w-48 rounded-full bg-sky-200/20 blur-2xl" />
        </motion.div>

        <div className="relative mx-auto max-w-sm px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="text-2xl font-black text-amber-800 drop-shadow-sm">
              City Tour Saga
            </h1>
            <p className="mt-1 text-sm text-amber-700/80">
              Jelajahi kota dan selesaikan tantangan!
            </p>
          </motion.div>

          {/* Path & Nodes */}
          <motion.div
            className="relative flex flex-col items-center gap-0"
            style={{ y: pathY }}
          >
            {/* Vertical path line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute left-1/2 top-0 h-full w-2 -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-emerald-400"
              style={{ originY: 0 }}
            />

            {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map(
              (level, index) => {
                const isUnlocked = unlockedLevels.includes(level);
                const isCompleted = unlockedLevels.includes(level + 1);

                return (
                  <motion.div
                    key={level}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.4 }}
                    className="relative z-10 flex flex-col items-center py-4"
                  >
                    {/* Connector dot */}
                    <div className="h-3 w-3 rounded-full bg-amber-500 shadow-md" />

                    {/* Node / Level */}
                    <motion.button
                      whileHover={
                        isUnlocked
                          ? { scale: 1.05, rotate: [0, -2, 2, 0] }
                          : { scale: 1.02, x: [-2, 2, -2, 0] }
                      }
                      whileTap={isUnlocked ? { scale: 0.95 } : { scale: 0.98 }}
                      onClick={() => handleNodeClick(level)}
                      className={`relative mt-4 flex h-20 w-20 flex-col items-center justify-center rounded-2xl shadow-lg transition-all ${
                        isUnlocked
                          ? "cursor-pointer bg-gradient-to-br from-amber-400 to-amber-600 text-white hover:shadow-xl hover:shadow-amber-300/50"
                          : "cursor-not-allowed bg-zinc-300 text-zinc-500"
                      }`}
                    >
                      {!isUnlocked ? (
                        <Lock className="absolute right-1 top-1 h-4 w-4" />
                      ) : isCompleted ? (
                        <Star className="absolute right-1 top-1 h-4 w-4 fill-amber-200 text-amber-600" />
                      ) : null}
                      <MapPin className="mb-1 h-6 w-6" />
                      <span className="text-xs font-bold">Level {level}</span>
                    </motion.button>
                  </motion.div>
                );
              }
            )}

            {/* End node */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: TOTAL_LEVELS * 0.15 + 0.2 }}
              className="relative z-10 flex flex-col items-center py-4"
            >
              <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-md" />
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/80 shadow-md">
                <Star className="h-6 w-6 fill-white text-white" />
              </div>
              <span className="mt-2 text-xs font-medium text-emerald-700">
                Finish
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <LocationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedLevel(null);
        }}
        onVerified={handleVerified}
        levelId={selectedLevel}
      />
    </>
  );
}
