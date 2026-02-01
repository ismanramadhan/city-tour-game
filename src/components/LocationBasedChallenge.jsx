"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2, CheckCircle2, Trophy } from "lucide-react";

export default function LocationBasedChallenge({ onComplete, onBack }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolokasi tidak didukung");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setError("Tidak dapat mengambil lokasi");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const handleComplete = () => {
    onComplete?.(1);
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
        <div className="flex items-center gap-2 rounded-lg bg-amber-100 px-4 py-2">
          <Trophy className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-bold text-amber-800">
            Tantangan Berbasis Lokasi
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-1 flex-col"
      >
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100">
              <MapPin className="h-7 w-7 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-800">
                Tantangan Berbasis Geolokasi
              </h2>
              <p className="text-sm text-zinc-600">
                Tantangan disesuaikan berdasarkan lokasi Anda
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-amber-500" />
              <p className="text-sm text-zinc-600">Mendeteksi lokasi Anda...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-4 text-center text-red-700">
              <p className="font-medium">{error}</p>
            </div>
          ) : (
            <>
              {/* Koordinat User */}
              <div className="mb-6 rounded-xl bg-sky-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-600">
                  Lokasi Anda (Geolocation)
                </p>
                <div className="space-y-1 font-mono text-sm text-zinc-700">
                  <p>
                    <span className="text-zinc-500">Latitude:</span>{" "}
                    {location?.lat?.toFixed(6)}
                  </p>
                  <p>
                    <span className="text-zinc-500">Longitude:</span>{" "}
                    {location?.lng?.toFixed(6)}
                  </p>
                </div>
              </div>

              {/* Informasi untuk Investor */}
              <div className="rounded-xl border-2 border-amber-200 bg-amber-50/80 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800">
                  <CheckCircle2 className="h-4 w-4" />
                  Konsep Produksi
                </p>
                <p className="text-sm leading-relaxed text-amber-900/90">
                  Dalam versi produksi, tantangan akan muncul secara dinamis
                  berdasarkan koordinat geolokasi (latitude & longitude) pengguna.
                  Setiap titik lokasi memiliki tantangan unik—misalnya dekat
                  Monas, Museum, atau destinasi heritage lainnya.
                </p>
              </div>

              <p className="mt-4 text-center text-xs text-zinc-500">
                Prototype ini menunjukkan kemampuan game untuk mengakses dan
                memanfaatkan geolokasi dalam menentukan tantangan.
              </p>
            </>
          )}
        </div>

        <div className="mt-6 flex-1" />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleComplete}
          disabled={loading || !!error}
          className="w-full rounded-xl bg-amber-500 py-4 font-semibold text-white shadow-lg hover:bg-amber-600 disabled:opacity-50 disabled:hover:bg-amber-500"
        >
          Selesai
        </motion.button>
      </motion.div>
    </div>
  );
}
