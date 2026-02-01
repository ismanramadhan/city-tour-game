"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Loader2, MapPin, AlertCircle, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getHunts } from "@/lib/hunts";
import CreateHuntModal from "@/components/CreateHuntModal";

export default function HuntsPage() {
  const { session, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [hunts, setHunts] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchHunts = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    const { data, error } = await getHunts();
    setListLoading(false);
    if (error) {
      setListError(error);
      setHunts([]);
      return;
    }
    setHunts(data ?? []);
  }, []);

  useEffect(() => {
    if (!authLoading && !session) {
      router.replace("/");
      return;
    }
    if (session) fetchHunts();
  }, [authLoading, session, router, fetchHunts]);

  const handleSignOut = () => {
    signOut();
    router.replace("/");
  };

  const handleCreateSuccess = () => {
    fetchHunts();
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-amber-50 to-emerald-100">
        <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-amber-50 to-emerald-100">
      {/* Header with Create New top right */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-amber-200/50 bg-white/80 px-4 py-3 backdrop-blur-sm">
        <h1 className="text-xl font-bold text-amber-800">Daftar Hunt</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 font-semibold text-white shadow-lg hover:bg-amber-600"
          >
            <Plus className="h-5 w-5" />
            Buat Baru
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {listLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
            <p className="text-sm text-zinc-600">Memuat daftar hunt...</p>
          </div>
        )}

        {!listLoading && listError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
          >
            <AlertCircle className="h-6 w-6 shrink-0" />
            <div>
              <p className="font-medium">Gagal memuat daftar hunt</p>
              <p className="text-sm">{listError}</p>
            </div>
            <button
              type="button"
              onClick={fetchHunts}
              className="ml-auto rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
            >
              Coba lagi
            </button>
          </motion.div>
        )}

        {!listLoading && !listError && hunts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-amber-200 bg-amber-50/80 p-8 text-center"
          >
            <MapPin className="mx-auto h-12 w-12 text-amber-600/80" />
            <p className="mt-3 font-medium text-amber-800">Belum ada hunt</p>
            <p className="mt-1 text-sm text-amber-700/80">
              Klik &quot;Buat Baru&quot; untuk membuat hunt pertama.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-4 rounded-xl bg-amber-500 px-5 py-2.5 font-semibold text-white hover:bg-amber-600"
            >
              Buat Hunt
            </button>
          </motion.div>
        )}

        {!listLoading && !listError && hunts.length > 0 && (
          <ul className="space-y-3">
            {hunts.map((hunt, index) => (
              <motion.li
                key={hunt.id ?? index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-amber-200/60 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-zinc-800">
                      {hunt.name ?? "Unnamed Hunt"}
                    </h3>
                    {hunt.description && (
                      <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
                        {hunt.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                      {hunt.startDate && (
                        <span>Mulai: {hunt.startDate}</span>
                      )}
                      {hunt.endDate && (
                        <span>Selesai: {hunt.endDate}</span>
                      )}
                      {hunt.maxParticipants != null && (
                        <span>Max: {hunt.maxParticipants} peserta</span>
                      )}
                      {hunt.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {hunt.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </main>

      <CreateHuntModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
