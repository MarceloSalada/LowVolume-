import { ExercisePerformance } from "@/lib/storage/progression-storage";

export function getBestLoad(entries: ExercisePerformance[]) {
  if (entries.length === 0) return null;
  return Math.max(...entries.map((item) => item.load));
}

export function getBestReps(entries: ExercisePerformance[]) {
  if (entries.length === 0) return null;
  return Math.max(...entries.map((item) => item.reps));
}

export function getProgressSummary(entries: ExercisePerformance[]) {
  if (entries.length === 0) {
    return {
      latest: null,
      previous: null,
      bestLoad: null,
      bestReps: null,
      trend: "sem dados" as const,
    };
  }

  const latest = entries[0] ?? null;
  const previous = entries[1] ?? null;

  let trend: "subindo" | "estável" | "caindo" | "sem dados" = "sem dados";

  if (latest && previous) {
    if (latest.load > previous.load || latest.reps > previous.reps) {
      trend = "subindo";
    } else if (latest.load === previous.load && latest.reps === previous.reps) {
      trend = "estável";
    } else {
      trend = "caindo";
    }
  }

  return {
    latest,
    previous,
    bestLoad: getBestLoad(entries),
    bestReps: getBestReps(entries),
    trend,
  };
                          }
