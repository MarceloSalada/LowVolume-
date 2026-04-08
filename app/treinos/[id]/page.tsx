import Link from "next/link";
import { notFound } from "next/navigation";
import { BottomNav } from "@/components/workout/bottom-nav";
import { SessionExerciseCard } from "@/components/workout/session-exercise-card";
import { workoutPlansMap } from "@/lib/data/workout-plans";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WorkoutDetailPage({ params }: Props) {
  const { id } = await params;
  const plan = workoutPlansMap[id];

  if (!plan) {
    notFound();
  }

  const sorted = plan.exercises.slice().sort((a, b) => a.order - b.order);

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div>
            <h1 className="title">{plan.name}</h1>
            <p className="subtitle">{plan.description}</p>
          </div>
          <Link className="btn secondary" href={`/executar/${plan.id}`}>
            Iniciar
          </Link>
        </div>
      </header>

      <main className="container">
        <section className="card">
          <div className="row">
            <div>
              <strong>Foco:</strong> {plan.focus}
            </div>
            <span className="badge">{sorted.length} exercícios</span>
          </div>
        </section>

        <h3 className="section-title">Exercícios</h3>
        <div className="list">
          {sorted.map((item) => (
            <SessionExerciseCard
              key={item.exerciseId}
              workoutId={plan.id}
              item={item}
            />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
