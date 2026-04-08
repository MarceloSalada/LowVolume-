import { BottomNav } from "@/components/workout/bottom-nav";
import { ExerciseCard } from "@/components/workout/exercise-card";
import { exercises } from "@/lib/data/exercises";

export default function ExercisesPage() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div>
            <h1 className="title">Exercícios</h1>
            <p className="subtitle">Sua biblioteca visual</p>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="list">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              rightContent={<span className="badge">{exercise.category}</span>}
            />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
