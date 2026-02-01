"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2, Trophy, Scan, Target, Zap } from "lucide-react";

const TARGET_COUNT = 3;
const OBJECT_TEMPLATES = [
  { id: 1, type: "heritage", icon: "🏛️", name: "Monumen Bersejarah" },
  { id: 2, type: "artifact", icon: "🗿", name: "Artefak Kuno" },
  { id: 3, type: "landmark", icon: "🏰", name: "Landmark Kota" },
];

// Seperti script GPS: offset acak di sekitar user → azimuth (derajat dari utara), elevation ≈ 0
function placeObjectsAroundUser() {
  const objects = [];
  for (let i = 0; i < TARGET_COUNT; i++) {
    const t = OBJECT_TEMPLATES[i];
    const latOffset = (Math.random() - 0.5) * 0.0006;
    const lonOffset = (Math.random() - 0.5) * 0.0006;
    const azimuth = (Math.atan2(lonOffset, latOffset) * (180 / Math.PI) + 360) % 360;
    const elevation = (Math.random() - 0.5) * 20;
    objects.push({ ...t, azimuth, elevation });
  }
  return objects;
}

export default function WebARHunter({ onComplete, onBack }) {
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState("");
  const [capturedCount, setCapturedCount] = useState(0);
  const [arObjects, setArObjects] = useState([]);
  const [showCaptureEffect, setShowCaptureEffect] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const hasSpawnedRef = useRef(false);

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

  // Set video srcObject when video element mounts (after status === "ready")
  useEffect(() => {
    if (status !== "ready" || !videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    videoRef.current.play().catch(() => {});
  }, [status]);

  const FOV_H = 50;
  const FOV_V = 45;

  const [orientation, setOrientation] = useState(null);
  const [orientationReady, setOrientationReady] = useState(false);

  const handleOrientationRef = useRef((e) => {
    const alpha = e.alpha != null ? e.alpha : 0;
    const beta = e.beta != null ? e.beta : 90;
    setOrientation((prev) => (prev?.alpha === alpha && prev?.beta === beta ? prev : { alpha, beta }));
  });

  useEffect(() => {
    if (status !== "ready") return;

    const needsUserGesture =
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function";

    if (!needsUserGesture) {
      setOrientationReady(true);
      window.addEventListener("deviceorientation", handleOrientationRef.current, true);
      return () => window.removeEventListener("deviceorientation", handleOrientationRef.current, true);
    }
  }, [status]);

  const requestOrientationOnTap = async () => {
    if (orientationReady) return;
    if (typeof DeviceOrientationEvent === "undefined" || typeof DeviceOrientationEvent.requestPermission !== "function") {
      setOrientationReady(true);
      return;
    }
    try {
      const perm = await DeviceOrientationEvent.requestPermission();
      if (perm === "granted") {
        window.addEventListener("deviceorientation", handleOrientationRef.current, true);
      }
      setOrientationReady(true);
    } catch {
      setOrientationReady(true);
    }
  };

  // Arah pandang: alpha = compass (0–360). viewPitch = 90 - beta agar "pegang normal" = horizon (0°).
  // Di DeviceOrientation: beta ≈ 90 saat layar tegak (lihat horizon), beta ≈ 0 saat kamera ke bawah.
  const fallbackSpread = { 1: { x: 20, y: 35 }, 2: { x: 50, y: 55 }, 3: { x: 80, y: 40 } };
  const getObjectView = (obj) => {
    if (!orientation) {
      const pos = fallbackSpread[obj.id] || { x: 50, y: 50 };
      return { inView: true, x: pos.x, y: pos.y };
    }
    const wrapAngle = (a) => ((a % 360) + 360) % 360;
    const deltaH = wrapAngle(obj.azimuth - orientation.alpha);
    const deltaHNorm = deltaH > 180 ? deltaH - 360 : deltaH;
    const viewPitch = 90 - orientation.beta;
    const deltaV = obj.elevation - viewPitch;
    const inView = Math.abs(deltaHNorm) < FOV_H / 2 && Math.abs(deltaV) < FOV_V / 2;
    const x = 50 + (deltaHNorm / (FOV_H / 2)) * 45;
    const y = 50 + (deltaV / (FOV_V / 2)) * 40;
    return { inView, x: Math.max(5, Math.min(95, x)), y: Math.max(10, Math.min(90, y)) };
  };

  // Spawn objek seperti script GPS: posisi acak di sekitar user (azimuth + elevation dari offset)
  useEffect(() => {
    if (status !== "ready" || hasSpawnedRef.current) return;
    hasSpawnedRef.current = true;
    setArObjects(placeObjectsAroundUser());
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

            {/* AR Objects - only visible when in view (user must rotate 360° to find) */}
            <AnimatePresence>
              {arObjects.map((obj) => {
                const { inView, x, y } = getObjectView(obj);
                if (!inView) return null;
                return (
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
                    left: `${x}%`,
                    top: `${y}%`,
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
                );
              })}
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

            {/* Satu tap di area AR = mulai 360° (izin orientasi di iOS). Tanpa tombol terpisah. */}
            {capturedCount < TARGET_COUNT && !orientationReady && (
              <button
                type="button"
                onClick={requestOrientationOnTap}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <p className="text-center text-base font-semibold text-white drop-shadow">
                  Tap layar untuk mulai
                </p>
                <p className="mt-2 text-center text-sm text-white/90">
                  Lalu putar perangkat 360° untuk mencari objek
                </p>
              </button>
            )}

            {/* AR Scanner UI overlay (pointer-events-none agar tap ke video/objek) */}
            {capturedCount < TARGET_COUNT && (
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-4 top-4 h-8 w-8 border-l-4 border-t-4 border-violet-400" />
                <div className="absolute right-4 top-4 h-8 w-8 border-r-4 border-t-4 border-violet-400" />
                <div className="absolute bottom-4 left-4 h-8 w-8 border-b-4 border-l-4 border-violet-400" />
                <div className="absolute bottom-4 right-4 h-8 w-8 border-b-4 border-r-4 border-violet-400" />
                {orientationReady && (
                  <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-lg bg-black/70 px-4 py-2 backdrop-blur-sm">
                    <p className="text-center text-sm font-semibold text-white">
                      <Scan className="inline h-4 w-4" /> Putar perangkat 360° untuk mencari objek
                    </p>
                  </div>
                )}
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
