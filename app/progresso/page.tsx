"use client";

import Image from "next/image";
import { BottomNav } from "@/components/workout/bottom-nav";
import { exercises } from "@/lib/data/exercises";
import { getExerciseHistory } from "@/lib/storage/progression-storage";
import { getProgressSummary } from "@/lib/utils/progression";

export default function ProgressPage() {
  const items = exercises.map((exercise) => {
    const history = getExerciseHistory(exercise.id);
    const summary = getProgressSummary(history);

    return {
      exercise,
      history,
      summary,
    };
  });

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner compact">
          <div>
            <h1 className="title">Progresso</h1>
            <p className="subtitle">Evolução por exercício</p>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="list">
          {items.map(({ exercise, history, summary }) => (
            <div key={exercise.id} className="card progress-card modern-panel">
              <div className="exercise-card progress-exercise-card">
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
                    <span className="badge">
                      {summary.trend === "subindo"
                        ? "Subindo"
                        : summary.trend === "estável"
                          ? "Estável"
                          : summary.trend === "caindo"
                            ? "Caindo"
                            : "Sem dados"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="progress-grid">
                <div className="mini-kpi">
                  <span className="mini-kpi-value">
                    {summary.latest ? `${summary.latest.load} kg` : "-"}
                  </span>
                  <span className="mini-kpi-label">Última carga</span>
                </div>

                <div className="mini-kpi">
                  <span className="mini-kpi-value">
                    {summary.latest ? `${summary.latest.reps}` : "-"}
                  </span>
                  <span className="mini-kpi-label">Últimas reps</span>
                </div>

                <div className="mini-kpi">
                  <span className="mini-kpi-value">
                    {summary.bestLoad ? `${summary.bestLoad} kg` : "-"}
                  </span>
                  <span className="mini-kpi-label">Melhor carga</span>
                </div>
              </div>

              <div className="progress-grid">
                <div className="mini-kpi">
                  <span className="mini-kpi-value">
                    {summary.bestReps ?? "-"}
                  </span>
                  <span className="mini-kpi-label">Melhores reps</span>
                </div>

                <div className="mini-kpi">
                  <span className="mini-kpi-value">{history.length}</span>
                  <span className="mini-kpi-label">Registros</span>
                </div>

                <div className="mini-kpi">
                  <span className="mini-kpi-value">
                    {summary.latest
                      ? new Date(summary.latest.performedAt).toLocaleDateString("pt-BR")
                      : "-"}
                  </span>
                  <span className="mini-kpi-label">Última data</span>
                </div>
              </div>

              <div className="history-exercise-grid">
                {history.slice(0, 4).map((entry, index) => (
                  <div
                    key={`${exercise.id}-${index}`}
                    className="history-exercise-box"
                  >
                    <span className="history-exercise-name">
                      {new Date(entry.performedAt).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="muted history-exercise-result">
                      {entry.load} kg • {entry.reps} reps
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
