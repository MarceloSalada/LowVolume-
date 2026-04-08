"use client";

import { useMemo } from "react";
import { BottomNav } from "@/components/workout/bottom-nav";
import { getHistory } from "@/lib/storage/app-storage";
import { workoutPlansMap } from "@/lib/data/workout-plans";
import { formatSeconds } from "@/lib/utils/workout";

export default function HistoryPage() {
  const history = useMemo(() => getHistory(), []);

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
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
              return (
                <div key={session.id} className="card history-item">
                  <div className="row">
                    <strong>{plan?.name ?? session.workoutPlanId}</strong>
                    <span className="badge">
                      {new Date(session.performedAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="muted">
                    Duração: {formatSeconds(session.durationSeconds)}
                  </div>
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
