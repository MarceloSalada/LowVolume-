export type ExercisePerformance = {
  exerciseId: string;
  performedAt: string;
  load: number;
  reps: number;
  workoutPlanId: string;
};

const PROGRESSION_KEY = "lowvolume:progression";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getProgression(): ExercisePerformance[] {
  if (!isBrowser()) return [];

  const raw = window.localStorage.getItem(PROGRESSION_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as ExercisePerformance[];
  } catch {
    return [];
  }
}

export function saveProgression(entries: ExercisePerformance[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(PROGRESSION_KEY, JSON.stringify(entries));
}

export function appendProgression(entries: ExercisePerformance[]) {
  const current = getProgression();
  saveProgression([...entries, ...current]);
}

export function getLatestPerformanceByExercise(exerciseId: string) {
  return getProgression().find((item) => item.exerciseId === exerciseId) ?? null;
}

export function getExerciseHistory(exerciseId: string) {
  return getProgression().filter((item) => item.exerciseId === exerciseId);
}
