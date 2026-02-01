"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogOut, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import SagaMap from "@/components/SagaMap";

function MapContent() {
  const { session, loading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [unlockedLevels, setUnlockedLevels] = useState([1]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("city-tour-unlocked");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUnlockedLevels(parsed);
        } catch (_) {}
      }
    }
  }, []);

  // Handle level completion from query param
  useEffect(() => {
    const completed = searchParams.get("completed");
    if (completed) {
      const levelId = parseInt(completed, 10);
      setUnlockedLevels((prev) => {
        const nextLevel = levelId + 1;
        const updated = prev.includes(nextLevel)
          ? prev
          : [...prev, nextLevel].sort((a, b) => a - b);
        if (typeof window !== "undefined") {
          localStorage.setItem("city-tour-unlocked", JSON.stringify(updated));
        }
        return updated;
      });
      router.replace("/map");
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/");
    }
  }, [session, loading, router]);

  const handleLevelClick = (levelId) => {
    router.push(`/level/${levelId}?from=map`);
  };

  const handleSignOut = () => {
    signOut();
    router.replace("/");
  };

  if (loading) {
    return null;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="relative">
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <Link
          href="/hunts"
          className="flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-zinc-700 shadow hover:bg-white"
        >
          <MapPin className="h-4 w-4" />
          Hunts
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-zinc-700 shadow hover:bg-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
      <SagaMap
        unlockedLevels={unlockedLevels}
        onLevelClick={handleLevelClick}
      />
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
