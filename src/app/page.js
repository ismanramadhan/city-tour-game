"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { session, loading, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.replace("/map");
    }
  }, [session, loading, router]);

  const handleLogin = async () => {
    await signIn();
    router.push("/map");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-amber-50 to-emerald-100">
        <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-amber-50 to-emerald-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur"
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg"
          >
            <MapPin className="h-10 w-10 text-white" />
          </motion.div>

          <div>
            <h1 className="text-2xl font-black text-amber-800">
              HUNT J.
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Jelajahi kota dengan tantangan seru!
            </p>
          </div>

          {/* NextAuth-style Login with Google button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-zinc-200 bg-white px-6 py-4 font-semibold text-zinc-700 shadow-md transition-all hover:border-amber-300 hover:bg-amber-50"
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Login with Google
          </motion.button>

          <p className="text-xs text-zinc-500">
            Prototype mockup - tidak memerlukan akun Google asli
          </p>
        </div>
      </motion.div>
    </div>
  );
}
