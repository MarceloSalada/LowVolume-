"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BottomNav } from "@/components/workout/bottom-nav";
import { workoutPlans } from "@/lib/data/workout-plans";
import {
  getWorkoutExerciseCount,
  getWorkoutTotalSets,
  formatSeconds,
} from "@/lib/utils/workout";
import { getHistory } from "@/lib/storage/app-storage";

function getWeekLabels() {
  return ["S", "T", "Q", "Q", "S", "S", "D"];
}

function getTodayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

function getWeekActivity(history: ReturnType<typeof getHistory>) {
  const now = new Date();
  const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }).map((_, index) => {
    const start = new Date(monday);
    start.setDate(monday.getDate() + index);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const sessions = history.filter((item) => {
      const date = new Date(item.performedAt);
      return date >= start && date <= end;
    });

    return {
      label: getWeekLabels()[index],
      sessions,
    };
  });
}

export default function HomePage() {
  const featured = workoutPlans[0];
  const history = useMemo(() => getHistory(), []);
  const recent = history.slice(0, 3);
  const week = getWeekActivity(history);
  const totalSessions = history.length;
  const totalMinutes = Math.round(
    history.reduce((sum, item) => sum + item.durationSeconds, 0) / 60,
  );
  const todayIndex = getTodayIndex();

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner compact">
          <div>
            <h1 className="title">LowVolume</h1>
            <p className="subtitle">Seu tracker pessoal de treino</p>
          </div>
          <span className="badge soft">
            {new Date().toLocaleDateString("pt-BR")}
          </span>
        </div>
      </header>

      <main className="container">
        <section className="hero modern-hero compact-hero">
          <div>
            <span className="hero-badge">Treino de hoje</span>
            <h2 className="hero-title compact">{featured.name}</h2>
            <p className="hero-meta compact">
              Foco em {featured.focus}. {featured.description}
            </p>
          </div>

          <div className="hero-actions compact">
            <Link className="btn" href={`/executar/${featured.id}`}>
              Iniciar agora
            </Link>
            <Link className="btn secondary" href={`/treinos/${featured.id}`}>
              Ver ficha
            </Link>
          </div>
        </section>

        <section>
          <h3 className="section-title">Semana</h3>
          <div className="card week-card">
            <div className="week-grid">
              {week.map((day, index) => {
                const trained = day.sessions.length > 0;
                const isToday = index === todayIndex;
                const label =
                  day.sessions[0]?.workoutPlanId === "anteriores-a"
                    ? "A"
                    : day.sessions[0]?.workoutPlanId === "posteriores-a"
                    ? "P"
                    : "";

                return (
                  <div
                    key={index}
                    className={`week-day ${trained ? "done" : ""} ${isToday ? "today" : ""}`}
                  >
                    <span className="week-label">{day.label}</span>
                    <span className="week-dot">{label || "•"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section>
          <h3 className="section-title">Resumo</h3>
          <div className="kpi-grid">
            <div className="kpi">
              <span className="kpi-value">{totalSessions}</span>
              <span className="kpi-label">Sessões</span>
            </div>
            <div className="kpi">
              <span className="kpi-value">{totalMinutes}</span>
              <span className="kpi-label">Minutos</span>
            </div>
            <div className="kpi">
              <span className="kpi-value">
                {week.filter((d) => d.sessions.length > 0).length}
              </span>
              <span className="kpi-label">Dias ativos</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="section-title">Últimos treinos</h3>
          {recent.length === 0 ? (
            <div className="card empty-state">Nenhum treino salvo ainda.</div>
          ) : (
            <div className="list">
              {recent.map((session) => {
                const plan = workoutPlans.find((p) => p.id === session.workoutPlanId);
                return (
                  <div key={session.id} className="card history-item compact-history-home">
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
        </section>

        <section>
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
        </section>
      </main>

      <BottomNav />
    </div>
  );
                    }
