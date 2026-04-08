import Link from "next/link";
import { BottomNav } from "@/components/workout/bottom-nav";
import { workoutPlans } from "@/lib/data/workout-plans";
import { getWorkoutExerciseCount, getWorkoutTotalSets } from "@/lib/utils/workout";

export default function HomePage() {
  const featured = workoutPlans[0];

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div>
            <h1 className="title">LowVolume</h1>
            <p className="subtitle">Seu tracker pessoal de treino</p>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <span className="hero-badge">Treino do dia</span>
          <h2 className="hero-title">{featured.name}</h2>
          <p className="hero-meta">
            Foco em {featured.focus}. {featured.description}
          </p>
          <div style={{ marginTop: 16 }}>
            <Link className="btn" href={`/treinos/${featured.id}`}>
              Abrir treino
            </Link>
          </div>
        </section>

        <h3 className="section-title">Suas fichas</h3>
        <div className="list">
          {workoutPlans.map((plan) => (
            <Link key={plan.id} href={`/treinos/${plan.id}`} className="card">
              <div className="row">
                <div>
                  <h3 className="exercise-name" style={{ marginBottom: 4 }}>
                    {plan.name}
                  </h3>
                  <p className="muted" style={{ margin: 0 }}>
                    {plan.description}
                  </p>
                </div>
                <span className="badge">{plan.focus}</span>
              </div>

              <div className="kpi-grid">
                <div className="kpi">
                  <span className="kpi-value">{getWorkoutExerciseCount(plan)}</span>
                  <span className="kpi-label">Exercícios</span>
                </div>
                <div className="kpi">
                  <span className="kpi-value">{getWorkoutTotalSets(plan)}</span>
                  <span className="kpi-label">Séries</span>
                </div>
                <div className="kpi">
                  <span className="kpi-value">{plan.focus}</span>
                  <span className="kpi-label">Foco</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
