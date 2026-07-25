const LOCAL_REPORTS_KEY = "tailsguide:local-reports";

export const PETS_INVALIDATE_EVENT = "tailsguide:pets-invalidate";

export function invalidatePetsCache() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PETS_INVALIDATE_EVENT));
  }
}

export function getLocalReports() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_REPORTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/** Persist a submitted report so dashboard/search show it even if API list is empty. */
export function saveLocalReport(pet) {
  if (typeof window === "undefined" || !pet) return;
  try {
    const prev = getLocalReports();
    const id =
      typeof pet.id === "number" && pet.id > 0
        ? pet.id
        : -Math.floor(Date.now() / 1000);
    const entry = {
      ...pet,
      id,
      isDummy: !(typeof pet.id === "number" && pet.id > 0),
      isLocal: true,
      thumbnailUrl: pet.thumbnailUrl || "/dog-default.svg",
      lastSeenDate: pet.lastSeenDate || new Date().toISOString().slice(0, 10),
    };
    const next = [entry, ...prev.filter((p) => p.id !== entry.id)].slice(0, 40);
    localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(next));
    invalidatePetsCache();
  } catch {
    // ignore quota / private mode
  }
}

/** API pets first, then locally submitted reports. Deduped by id. */
export function mergePets(apiPets = []) {
  const seen = new Set();
  const out = [];
  const push = (p) => {
    if (p?.id == null || seen.has(p.id)) return;
    seen.add(p.id);
    out.push(p);
  };
  for (const p of apiPets) push(p);
  for (const p of getLocalReports()) push(p);
  return out;
}
