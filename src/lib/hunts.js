const STORAGE_KEY = "city-tour-hunts";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? "";
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "";
};

function readFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToStorage(hunts) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hunts));
}

/**
 * List hunts — dari localStorage (tanpa backend) atau dari API jika NEXT_PUBLIC_API_URL diatur
 * @returns {{ data?: Array, error?: string }}
 */
export async function getHunts() {
  const base = getBaseUrl();
  if (!base) {
    const data = readFromStorage();
    return { data, error: null };
  }
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/hunts`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const text = await res.text();
      return { data: null, error: text || `Error ${res.status}` };
    }
    const data = await res.json();
    return { data: Array.isArray(data) ? data : data?.hunts ?? [], error: null };
  } catch (err) {
    return {
      data: null,
      error: err?.message || "Gagal memuat daftar hunt",
    };
  }
}

/**
 * Buat hunt baru — simpan ke localStorage (tanpa backend) atau POST ke API jika diatur
 * @param {{
 *   name: string;
 *   description?: string;
 *   startDate: string;
 *   endDate: string;
 *   maxParticipants: number;
 *   location?: string;
 * }} payload
 * @returns {{ data?: object, error?: string }}
 */
export async function createHunt(payload) {
  const base = getBaseUrl();
  if (!base) {
    const list = readFromStorage();
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `hunt-${Date.now()}`;
    const hunt = {
      id,
      ...payload,
      createdAt: new Date().toISOString(),
    };
    list.push(hunt);
    writeToStorage(list);
    return { data: hunt, error: null };
  }
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/hunts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      return { data: null, error: text || `Error ${res.status}` };
    }
    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err?.message || "Gagal membuat hunt",
    };
  }
}
