"use client";

import { useMemo } from "react";
import { BottomNav } from "@/components/workout/bottom-nav";
import { getHistory } from "@/lib/storage/app-storage";
import { workoutPlansMap } from "@/lib/data/workout-plans";
import { exercisesMap } from "@/lib/data/exercises";
import { formatSeconds } from "@/lib/utils/workout";

export default function HistoryPage() {
  const history = useMemo(() => getHistory(), []);

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner compact">
          <div>
            <h1 className="title">Histórico</h1>
            <p className="subtitle">Sessões concluídas</p>
          </div>
        </div>
      </header>

      <main className="container">
        {history.length === 0 ? (
          <div className="card empty-state">
            Nenhum treino salvo ainda.
          </div>
        ) : (
          <div className="list">
            {history.map((session) => {
              const plan = workoutPlansMap[session.workoutPlanId];
              const completedExercises = session.items.filter((item) =>
                item.sets.some((set) => set.completed),
              );

              return (
                <div key={session.id} className="card history-item modern-panel">
                  <div className="row">
                    <strong>{plan?.name ?? session.workoutPlanId}</strong>
                    <span className="badge">
                      {new Date(session.performedAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <div className="history-meta-grid">
                    <div className="mini-kpi">
                      <span className="mini-kpi-value">{formatSeconds(session.durationSeconds)}</span>
                      <span className="mini-kpi-label">Duração</span>
                    </div>
                    <div className="mini-kpi">
                      <span className="mini-kpi-value">{completedExercises.length}</span>
                      <span className="mini-kpi-label">Exercícios</span>
                    </div>
                    <div className="mini-kpi">
                      <span className="mini-kpi-value">
                        {session.items.reduce((sum, item) => sum + item.sets.filter((s) => s.completed).length, 0)}
                      </span>
                      <span className="mini-kpi-label">Séries</span>
                    </div>
                  </div>

                  <div className="history-exercise-list">
                    {completedExercises.slice(0, 3).map((item) => {
                      const exercise = exercisesMap[item.exerciseId];
                      const lastCompletedSet = [...item.sets].reverse().find((set) => set.completed);
                      return (
                        <div key={item.exerciseId} className="history-exercise-row">
                          <span>{exercise?.name ?? item.exerciseId}</span>
                          <span className="muted">
                            {lastCompletedSet ? `${lastCompletedSet.load} kg • ${lastCompletedSet.reps} reps` : "Sem dados"}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {session.notes ? (
                    <div className="notes-chip">{session.notes}</div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
