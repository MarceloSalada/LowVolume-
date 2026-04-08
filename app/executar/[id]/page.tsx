"use client";

import Image from "next/image";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "@/components/workout/bottom-nav";
import { workoutPlansMap } from "@/lib/data/workout-plans";
import { exercisesMap } from "@/lib/data/exercises";
import { saveSession } from "@/lib/storage/app-storage";
import {
  appendProgression,
  getLatestPerformanceByExercise,
} from "@/lib/storage/progression-storage";
import { formatSeconds } from "@/lib/utils/workout";

type SetState = {
  reps: string;
  load: string;
  completed: boolean;
};

type SessionExerciseState = Record<string, SetState[]>;

export default function ExecuteWorkoutPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const plan = workoutPlansMap[params.id];
  if (!plan) notFound();

  const sorted = plan.exercises.slice().sort((a, b) => a.order - b.order);
  const exerciseFromQuery = searchParams.get("exercise");
  const foundIndex = sorted.findIndex((item) => item.exerciseId === exerciseFromQuery);
  const initialIndex = foundIndex >= 0 ? foundIndex : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [sessionStart] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const initialSessionState = useMemo<SessionExerciseState>(() => {
    return Object.fromEntries(
      sorted.map((item) => [
        item.exerciseId,
        Array.from({ length: item.sets }).map(() => ({
          reps: "",
          load: "",
          completed: false,
        })),
      ]),
    );
  }, [plan.id, sorted]);

  const [exerciseStates, setExerciseStates] =
    useState<SessionExerciseState>(initialSessionState);

  const current = sorted[currentIndex];
  const exercise = exercisesMap[current.exerciseId];
  const currentSets = exerciseStates[current.exerciseId] ?? [];
  const latestPerformance = getLatestPerformanceByExercise(current.exerciseId);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - sessionStart) / 1000));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [sessionStart]);

  useEffect(() => {
    if (restSecondsLeft === null || restSecondsLeft <= 0) return;

    const interval = window.setInterval(() => {
      setRestSecondsLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [restSecondsLeft]);

  function updateSet(index: number, patch: Partial<SetState>) {
    setExerciseStates((prev) => ({
      ...prev,
      [current.exerciseId]: prev[current.exerciseId].map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function markSetDone(index: number) {
    const target = currentSets[index];
    updateSet(index, { completed: !target.completed });
    if (!target.completed) {
      setRestSecondsLeft(current.restSeconds);
    }
  }

  function goToExercise(nextIndex: number) {
    if (nextIndex < 0 || nextIndex > sorted.length - 1) return;
    setCurrentIndex(nextIndex);
    setRestSecondsLeft(null);
  }

  function finishWorkout() {
    const durationSeconds = Math.max(1, elapsedSeconds);
    const performedAt = new Date().toISOString();

    const session = {
      id: crypto.randomUUID(),
      workoutPlanId: plan.id,
      performedAt,
      durationSeconds,
      notes,
      items: sorted.map((item) => ({
        exerciseId: item.exerciseId,
        sets: (exerciseStates[item.exerciseId] ?? []).map((set) => ({
          reps: Number(set.reps || 0),
          load: Number(set.load || 0),
          completed: set.completed,
        })),
      })),
    };

    saveSession(session);

    const progressionEntries = sorted.flatMap((item) => {
      const sets = exerciseStates[item.exerciseId] ?? [];
      const lastCompletedSet = [...sets]
        .reverse()
        .find((set) => set.completed && Number(set.load) > 0 && Number(set.reps) > 0);

      if (!lastCompletedSet) return [];

      return [
        {
          exerciseId: item.exerciseId,
          performedAt,
          load: Number(lastCompletedSet.load),
          reps: Number(lastCompletedSet.reps),
          workoutPlanId: plan.id,
        },
      ];
    });

    appendProgression(progressionEntries);

    window.location.href = "/historico";
  }

  const completedSets = Object.values(exerciseStates)
    .flat()
    .filter((set) => set.completed).length;

  const totalSets = sorted.reduce((sum, item) => sum + item.sets, 0);

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner compact">
          <div>
            <h1 className="title">{exercise.name}</h1>
            <p className="subtitle">
              {plan.name} • {currentIndex + 1} de {sorted.length}
            </p>
          </div>
          <div className="top-actions">
            <span className="badge">{current.repRange}</span>
            <span className="badge soft">{formatSeconds(elapsedSeconds)}</span>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="card execute-hero modern-panel">
          <div className="progress-row">
            <span className="muted">
              Progresso: {completedSets}/{totalSets} séries
            </span>
            <span className="badge">RIR {current.rirTarget}</span>
          </div>

          <Image
            src={exercise.image}
            alt={exercise.name}
            width={420}
            height={420}
            className="execute-image"
          />

          <div className="row wrap">
            <span className="badge">Descanso padrão: {current.restSeconds}s</span>
            <span className="badge soft">{exercise.primaryMuscles.join(", ")}</span>
          </div>

          <div className="card latest-load-card">
            <strong>Última carga usada</strong>
            <p className="muted" style={{ margin: "8px 0 0" }}>
              {latestPerformance
                ? `${latestPerformance.load} kg • ${latestPerformance.reps} reps`
                : "Sem histórico ainda para este exercício"}
            </p>
          </div>

          <div className="rest-card">
            <div>
              <strong>Descanso</strong>
              <p className="muted" style={{ margin: "6px 0 0" }}>
                {restSecondsLeft && restSecondsLeft > 0
                  ? `${restSecondsLeft}s restantes`
                  : "Pronto para a próxima série"}
              </p>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn secondary" onClick={() => setRestSecondsLeft(current.restSeconds)}>
                Iniciar
              </button>
              <button className="btn secondary" onClick={() => setRestSecondsLeft(null)}>
                Resetar
              </button>
            </div>
          </div>

          <div className="set-grid">
            {currentSets.map((set, index) => (
              <div key={index} className="set-row">
                <strong>S{index + 1}</strong>
                <input
                  className="input"
                  placeholder="Reps"
                  value={set.reps}
                  onChange={(e) => updateSet(index, { reps: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="Carga"
                  value={set.load}
                  onChange={(e) => updateSet(index, { load: e.target.value })}
                />
                <button
                  className={`btn secondary ${set.completed ? "is-done" : ""}`}
                  onClick={() => markSetDone(index)}
                >
                  {set.completed ? "OK" : "Feito?"}
                </button>
              </div>
            ))}
          </div>

          <textarea
            className="input notes-area"
            placeholder="Observações da sessão"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="row">
            <button
              className="btn secondary"
              onClick={() => goToExercise(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              Voltar
            </button>

            {currentIndex < sorted.length - 1 ? (
              <button className="btn" onClick={() => goToExercise(currentIndex + 1)}>
                Próximo exercício
              </button>
            ) : (
              <button className="btn" onClick={finishWorkout}>
                Finalizar treino
              </button>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
                                        }
