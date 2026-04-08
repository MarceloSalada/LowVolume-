import Image from "next/image";
import { Exercise } from "@/lib/data/exercises";

type Props = {
  exercise: Exercise;
  rightContent?: React.ReactNode;
};

export function ExerciseCard({ exercise, rightContent }: Props) {
  return (
    <div className="card exercise-card">
      <Image
        src={exercise.image}
        alt={exercise.name}
        width={84}
        height={84}
        className="exercise-thumb"
      />
      <div>
        <div className="row">
          <div>
            <h3 className="exercise-name">{exercise.name}</h3>
            <div className="exercise-meta">
              <span>{exercise.primaryMuscles.join(", ")}</span>
              {exercise.secondaryMuscles?.length ? (
                <span>• {exercise.secondaryMuscles.join(", ")}</span>
              ) : null}
            </div>
          </div>
          {rightContent}
        </div>
      </div>
    </div>
  );
}
