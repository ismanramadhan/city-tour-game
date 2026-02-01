"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2, Trophy, Scan, Target, Zap } from "lucide-react";

export default function WebARHunter({ onComplete, onBack }) {
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState("");
  const [capturedCount, setCapturedCount] = useState(0);
  const [arObjects, setArObjects] = useState([]);
  const [showCaptureEffect, setShowCaptureEffect] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const TARGET_COUNT = 3;

  // Initialize camera
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setErrorMessage("Kamera tidak didukung oleh browser Anda.");
      return;
    }

    let stream = null;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        stream = s;
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
        setStatus("ready");
      })
      .catch((err) => {
        setStatus("error");
        setErrorMessage(
          err.name === "NotAllowedError"
            ? "Akses kamera ditolak. Izinkan kamera di pengaturan browser."
            : "Tidak dapat mengakses kamera."
        );
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      streamRef.current = null;
    };
  }, []);

  // Spawn AR objects randomly (simulated location-based objects)
  useEffect(() => {
    if (status !== "ready") return;

    // Spawn 3 AR objects at random positions
    const objects = [
      {
        id: 1,
        type: "heritage",
        icon: "🏛️",
        name: "Monumen Bersejarah",
        x: Math.random() * 60 + 20, // 20-80%
        y: Math.random() * 60 + 20,
      },
      {
        id: 2,
        type: "artifact",
        icon: "🗿",
        name: "Artefak Kuno",
        x: Math.random() * 60 + 20,
        y: Math.random() * 60 + 20,
      },
      {
        id: 3,
        type: "landmark",
        icon: "🏰",
        name: "Landmark Kota",
        x: Math.random() * 60 + 20,
        y: Math.random() * 60 + 20,
      },
    ];
    setArObjects(objects);
  }, [status]);

  const handleCaptureObject = (objectId) => {
    // Remove captured object
    setArObjects((prev) => prev.filter((obj) => obj.id !== objectId));
    setCapturedCount((prev) => prev + 1);

    // Show capture effect
    setShowCaptureEffect(true);
    setTimeout(() => setShowCaptureEffect(false), 500);

    // Check if all objects captured
    if (capturedCount + 1 >= TARGET_COUNT) {
      setTimeout(() => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        onComplete?.(TARGET_COUNT);
      }, 1000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 to-amber-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow hover:bg-zinc-50"
        >
          Kembali
        </button>
        <div className="flex items-center gap-2 rounded-lg bg-violet-100 px-4 py-2">
          <Scan className="h-4 w-4 text-violet-600" />
          <span className="text-sm font-bold text-violet-800">Web AR Hunter</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-1 flex-col"
      >
        <div className="mb-4 rounded-xl border-2 border-violet-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-zinc-800">Web AR Hunter</h3>
              <p className="mt-1 text-sm text-zinc-600">
                Tangkap {TARGET_COUNT} objek AR berbasis lokasi
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-violet-100 px-3 py-2">
              <Target className="h-5 w-5 text-violet-600" />
              <span className="font-bold text-violet-800">
                {capturedCount}/{TARGET_COUNT}
              </span>
            </div>
          </div>
        </div>

        {status === "loading" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/50 py-12">
            <Loader2 className="h-12 w-12 animate-spin text-violet-500" />
            <p className="text-sm text-zinc-600">Mengaktifkan kamera...</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-red-200 bg-red-50/50 py-12 px-4">
            <Camera className="h-12 w-12 text-red-400" />
            <p className="text-center text-sm text-zinc-700">{errorMessage}</p>
          </div>
        )}

        {status === "ready" && (
          <div className="relative overflow-hidden rounded-2xl border-2 border-violet-300 bg-zinc-900 shadow-xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="aspect-[3/4] w-full object-cover"
            />

            {/* AR Objects - location-based */}
            <AnimatePresence>
              {arObjects.map((obj) => (
                <motion.button
                  key={obj.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0, rotate: 360 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCaptureObject(obj.id)}
                  className="absolute flex flex-col items-center gap-1"
                  style={{
                    left: `${obj.x}%`,
                    top: `${obj.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* AR Object Icon */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-yellow-400 bg-gradient-to-br from-yellow-300 to-orange-400 text-3xl shadow-lg shadow-yellow-500/50"
                  >
                    {obj.icon}
                  </motion.div>
                  {/* Object name */}
                  <div className="rounded-lg bg-black/70 px-2 py-1 backdrop-blur-sm">
                    <p className="text-xs font-semibold text-white">{obj.name}</p>
                  </div>
                  {/* Tap indicator */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex items-center gap-1 rounded-full bg-violet-500 px-2 py-0.5"
                  >
                    <Target className="h-3 w-3 text-white" />
                    <span className="text-xs font-bold text-white">TAP</span>
                  </motion.div>
                </motion.button>
              ))}
            </AnimatePresence>

            {/* Capture effect */}
            <AnimatePresence>
              {showCaptureEffect && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center bg-yellow-400/30"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 0] }}
                    className="flex h-32 w-32 items-center justify-center rounded-full bg-yellow-400/80"
                  >
                    <Zap className="h-16 w-16 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success overlay */}
            {capturedCount >= TARGET_COUNT && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-violet-600/90 to-purple-600/90 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.8 }}
                >
                  <Trophy className="h-20 w-20 text-yellow-300" />
                </motion.div>
                <h3 className="mt-4 text-2xl font-bold text-white">
                  Misi Selesai!
                </h3>
                <p className="mt-2 text-white/90">
                  {TARGET_COUNT} objek AR berhasil ditangkap
                </p>
              </motion.div>
            )}

            {/* AR Scanner UI overlay */}
            {capturedCount < TARGET_COUNT && (
              <div className="pointer-events-none absolute inset-0">
                {/* Corner brackets */}
                <div className="absolute left-4 top-4 h-8 w-8 border-l-4 border-t-4 border-violet-400" />
                <div className="absolute right-4 top-4 h-8 w-8 border-r-4 border-t-4 border-violet-400" />
                <div className="absolute bottom-4 left-4 h-8 w-8 border-b-4 border-l-4 border-violet-400" />
                <div className="absolute bottom-4 right-4 h-8 w-8 border-b-4 border-r-4 border-violet-400" />

                {/* Instruction */}
                <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-lg bg-black/70 px-4 py-2 backdrop-blur-sm">
                  <p className="text-center text-sm font-semibold text-white">
                    <Scan className="inline h-4 w-4" /> Cari & tap objek AR
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info box */}
        {status === "ready" && capturedCount < TARGET_COUNT && (
          <div className="mt-4 rounded-xl border-2 border-amber-200 bg-amber-50/80 p-4">
            <p className="text-xs text-zinc-700">
              <strong>Konsep Produksi:</strong> Objek AR muncul berdasarkan koordinat GPS user. Setiap lokasi heritage memiliki objek AR unik (3D models, animasi, info sejarah). User menangkap objek dengan tap untuk menyelesaikan tantangan.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
