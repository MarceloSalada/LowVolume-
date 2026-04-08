import { exercisesMap } from "../data/exercises";
import { WorkoutPlan } from "../data/workout-plans";

export function getWorkoutExerciseCount(plan: WorkoutPlan) {
  return plan.exercises.length;
}

export function getWorkoutTotalSets(plan: WorkoutPlan) {
  return plan.exercises.reduce((sum, item) => sum + item.sets, 0);
}

export function formatSeconds(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return hours > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function getResolvedExercises(plan: WorkoutPlan) {
  return plan.exercises
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      ...item,
      exercise: exercisesMap[item.exerciseId],
    }));
}
