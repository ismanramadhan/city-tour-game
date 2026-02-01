// Mock auth utilities - simulates NextAuth pattern

export const mockSignIn = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("city-tour-auth", "authenticated");
    return Promise.resolve({ ok: true });
  }
  return Promise.resolve({ ok: true });
};

export const mockSignOut = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("city-tour-auth");
  }
};

export const mockGetSession = () => {
  if (typeof window !== "undefined") {
    const auth = localStorage.getItem("city-tour-auth");
    if (auth === "authenticated") {
      return {
        user: {
          name: "Tour Player",
          email: "player@example.com",
          image: null,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
    }
  }
  return null;
};
