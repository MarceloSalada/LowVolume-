import Link from "next/link";
import { ExerciseCard } from "./exercise-card";
import { exercisesMap } from "@/lib/data/exercises";
import { WorkoutExercise } from "@/lib/data/workout-plans";

type Props = {
  workoutId: string;
  item: WorkoutExercise;
};

export function SessionExerciseCard({ workoutId, item }: Props) {
  const exercise = exercisesMap[item.exerciseId];

  return (
    <ExerciseCard
      exercise={exercise}
      rightContent={
        <Link
          href={`/executar/${workoutId}?exercise=${item.exerciseId}`}
          className="badge"
        >
          Abrir
        </Link>
      }
    />
  );
}
