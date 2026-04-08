"use client";

export type SessionSet = {
  reps: number;
  load: number;
  completed: boolean;
};

export type SessionItem = {
  exerciseId: string;
  sets: SessionSet[];
};

export type WorkoutSession = {
  id: string;
  workoutPlanId: string;
  performedAt: string;
  durationSeconds: number;
  notes?: string;
  items: SessionItem[];
};

const HISTORY_KEY = "lowvolume_history";
const LAST_PLAN_KEY = "lowvolume_last_plan";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getHistory(): WorkoutSession[] {
  if (typeof window === "undefined") return [];
  return safeParse<WorkoutSession[]>(window.localStorage.getItem(HISTORY_KEY), []);
}

export function saveSession(session: WorkoutSession) {
  if (typeof window === "undefined") return;
  const history = getHistory();
  const next = [session, ...history];
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  window.localStorage.setItem(LAST_PLAN_KEY, session.workoutPlanId);
}

export function getLastPlanId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LAST_PLAN_KEY);
}
