const LOCAL_REPORTS_KEY = "tailsguide:local-reports";

/** Demo LOST/FOUND pets shown alongside live API reports. Negative IDs never collide with backend. */
export const DUMMY_PETS = [
  {
    id: -101,
    isDummy: true,
    petName: "Buddy",
    breed: "Golden Retriever",
    reportType: "LOST",
    lastSeenLocation: "Central Park, near the reservoir",
    lastSeenDate: "2026-07-20",
    primaryColor: "Golden",
    thumbnailUrl: "/dog-default.svg",
  },
  {
    id: -102,
    isDummy: true,
    petName: "Luna",
    breed: "Tabby Cat",
    reportType: "LOST",
    lastSeenLocation: "Oak Street & 5th Ave",
    lastSeenDate: "2026-07-22",
    primaryColor: "Orange",
    thumbnailUrl: "/dog-default.svg",
  },
  {
    id: -103,
    isDummy: true,
    petName: "Max",
    breed: "Beagle",
    reportType: "LOST",
    lastSeenLocation: "Riverside Trail parking lot",
    lastSeenDate: "2026-07-18",
    primaryColor: "Tri-color",
    thumbnailUrl: "/dog-default.svg",
  },
  {
    id: -201,
    isDummy: true,
    petName: "Daisy",
    breed: "Cocker Spaniel",
    reportType: "FOUND",
    lastSeenLocation: "Maple Grove shopping center",
    lastSeenDate: "2026-07-24",
    primaryColor: "Cream",
    thumbnailUrl: "/dog-default.svg",
  },
  {
    id: -202,
    isDummy: true,
    petName: "Shadow",
    breed: "Black Cat",
    reportType: "FOUND",
    lastSeenLocation: "Near City Library steps",
    lastSeenDate: "2026-07-23",
    primaryColor: "Black",
    thumbnailUrl: "/dog-default.svg",
  },
  {
    id: -203,
    isDummy: true,
    petName: "Cooper",
    breed: "Mixed Breed",
    reportType: "FOUND",
    lastSeenLocation: "Harbor pier boardwalk",
    lastSeenDate: "2026-07-21",
    primaryColor: "Brown",
    thumbnailUrl: "/dog-default.svg",
  },
];

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

/** API pets first, then local submissions, then demo seed. Deduped by id. */
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
  for (const p of DUMMY_PETS) push(p);
  return out;
}
