"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { isWithinRadius } from "@/lib/geolocation";
import { TARGET_COORDS, LOCATION_RADIUS_M } from "@/lib/constants";

export default function LocationModal({ isOpen, onClose, onVerified, levelId }) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const handleActivateGPS = () => {
    setStatus("loading");
    setErrorMessage("");

    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMessage("Geolokasi tidak didukung oleh browser Anda.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const within = isWithinRadius(
          userLat,
          userLng,
          TARGET_COORDS.lat,
          TARGET_COORDS.lng,
          LOCATION_RADIUS_M
        );

        if (within) {
          setStatus("success");
          setTimeout(() => {
            onVerified(levelId);
            onClose();
          }, 1200);
        } else {
          setStatus("error");
          const radiusKm = (LOCATION_RADIUS_M / 1000).toFixed(LOCATION_RADIUS_M >= 1000 ? 0 : 2);
          const radiusLabel = LOCATION_RADIUS_M >= 1000 ? `${radiusKm} km` : `${LOCATION_RADIUS_M} m`;
          setErrorMessage(
            `Anda berada di luar radius yang diizinkan (${radiusLabel} dari lokasi target). Silakan mendekat ke lokasi target.`
          );
        }
      },
      (error) => {
        setStatus("error");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMessage("Akses geolokasi ditolak. Izinkan akses untuk melanjutkan.");
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage("Informasi lokasi tidak tersedia.");
            break;
          case error.TIMEOUT:
            setErrorMessage("Waktu tunggu habis. Coba lagi.");
            break;
          default:
            setErrorMessage("Terjadi kesalahan saat mengambil lokasi.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleClose = () => {
    if (status !== "loading") {
      setStatus("idle");
      setErrorMessage("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            disabled={status === "loading"}
            className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${
                status === "success"
                  ? "bg-emerald-100 text-emerald-600"
                  : status === "error"
                  ? "bg-red-100 text-red-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              {status === "loading" ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : status === "success" ? (
                <CheckCircle2 className="h-8 w-8" />
              ) : status === "error" ? (
                <AlertCircle className="h-8 w-8" />
              ) : (
                <MapPin className="h-8 w-8" />
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-zinc-800">
                Verifikasi Lokasi
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                {status === "idle" &&
                  ("Aktifkan GPS untuk memverifikasi lokasi Anda. Prototype: radius " +
                    (LOCATION_RADIUS_M >= 1000
                      ? `${(LOCATION_RADIUS_M / 1000).toFixed(0)} km`
                      : `${LOCATION_RADIUS_M} m`) +
                    " dari lokasi target.")}
                {status === "loading" && "Mendeteksi posisi Anda..."}
                {status === "success" && "Lokasi terverifikasi! Memuat tantangan..."}
                {status === "error" && errorMessage}
              </p>
            </div>

            {status === "idle" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleActivateGPS}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white shadow-lg hover:bg-amber-600"
              >
                <MapPin className="h-5 w-5" />
                Aktifkan GPS
              </motion.button>
            )}

            {status === "error" && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleActivateGPS}
                className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600"
              >
                Coba Lagi
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
