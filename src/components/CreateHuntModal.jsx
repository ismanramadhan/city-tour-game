"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, AlertCircle } from "lucide-react";
import { createHunt } from "@/lib/hunts";

const today = () => new Date().toISOString().slice(0, 10);

export default function CreateHuntModal({ isOpen, onClose, onSuccess }) {
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: today(),
    endDate: today(),
    maxParticipants: 10,
    location: "",
  });

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrorMessage("");
  };

  const validate = () => {
    const name = (form.name || "").trim();
    if (!name) {
      setErrorMessage("Nama hunt wajib diisi.");
      return false;
    }
    const start = form.startDate ? new Date(form.startDate).getTime() : 0;
    const end = form.endDate ? new Date(form.endDate).getTime() : 0;
    if (!form.startDate || !form.endDate) {
      setErrorMessage("Tanggal mulai dan selesai wajib diisi.");
      return false;
    }
    if (end < start) {
      setErrorMessage("Tanggal selesai harus setelah tanggal mulai.");
      return false;
    }
    const max = Number(form.maxParticipants);
    if (Number.isNaN(max) || !Number.isInteger(max) || max < 1) {
      setErrorMessage("Max peserta harus bilangan bulat minimal 1.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setErrorMessage("");
    const max = Number(form.maxParticipants);
    const payload = {
      name: form.name.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      maxParticipants: Number.isInteger(max) && max >= 1 ? max : 10,
    };
    if (form.description.trim()) payload.description = form.description.trim();
    if (form.location.trim()) payload.location = form.location.trim();

    const { data, error } = await createHunt(payload);
    if (error) {
      setStatus("error");
      setErrorMessage(error);
      return;
    }
    setStatus("idle");
    setForm({
      name: "",
      description: "",
      startDate: today(),
      endDate: today(),
      maxParticipants: 10,
      location: "",
    });
    onSuccess?.(data);
    onClose();
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleClose}
            disabled={status === "loading"}
            className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>

          <h3 className="text-xl font-bold text-zinc-800">Buat Hunt Baru</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Isi data hunt. Field bertanda * wajib diisi.
          </p>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Nama Hunt *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Contoh: City Tour Jakarta"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-800 placeholder-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                disabled={status === "loading"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Deskripsi (opsional)
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Deskripsi singkat hunt"
                rows={2}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-800 placeholder-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                disabled={status === "loading"}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Tanggal Mulai *
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-800 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                  disabled={status === "loading"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Tanggal Selesai *
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => update("endDate", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-800 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                  disabled={status === "loading"}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Max Peserta *
              </label>
              <input
                type="number"
                min={1}
                value={form.maxParticipants === "" ? "" : form.maxParticipants}
                onChange={(e) => {
                  const v = e.target.value;
                  const num = v === "" ? "" : parseInt(v, 10);
                  update("maxParticipants", num === "" ? "" : (Number.isNaN(num) ? form.maxParticipants : num));
                }}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-800 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                disabled={status === "loading"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Lokasi (opsional)
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Contoh: Jakarta"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-800 placeholder-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                disabled={status === "loading"}
              />
            </div>

            {status === "error" && errorMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={status === "loading"}
                className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white shadow-lg hover:bg-amber-600 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Membuat...
                  </>
                ) : (
                  "Buat Hunt"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
