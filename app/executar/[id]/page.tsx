"use client";

import Image from "next/image";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { BottomNav } from "@/components/workout/bottom-nav";
import { workoutPlansMap } from "@/lib/data/workout-plans";
import { exercisesMap } from "@/lib/data/exercises";
import { saveSession } from "@/lib/storage/app-storage";

type SetState = {
  reps: string;
  load: string;
  completed: boolean;
};

export default function ExecuteWorkoutPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const plan = workoutPlansMap[params.id];
  if (!plan) notFound();

  const sorted = plan.exercises.slice().sort((a, b) => a.order - b.order);
  const exerciseFromQuery = searchParams.get("exercise");
  const initialIndex = Math.max(
    0,
    sorted.findIndex((item) => item.exerciseId === exerciseFromQuery),
  );

  const [currentIndex, setCurrentIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0,
  );
  const [sessionStart] = useState(Date.now());

  const current = sorted[currentIndex];
  const exercise = exercisesMap[current.exerciseId];

  const initialSets = useMemo<SetState[]>(
    () =>
      Array.from({ length: current.sets }).map(() => ({
        reps: "",
        load: "",
        completed: false,
      })),
    [current.exerciseId, current.sets],
  );

  const [sets, setSets] = useState<SetState[]>(initialSets);

  function updateSet(index: number, patch: Partial<SetState>) {
    setSets((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function goNextExercise() {
    if (currentIndex < sorted.length - 1) {
      const next = sorted[currentIndex + 1];
      setCurrentIndex((value) => value + 1);
      setSets(
        Array.from({ length: next.sets }).map(() => ({
          reps: "",
          load: "",
          completed: false,
        })),
      );
    }
  }

  function finishWorkout() {
    const durationSeconds = Math.max(
      1,
      Math.floor((Date.now() - sessionStart) / 1000),
    );

    const session = {
      id: crypto.randomUUID(),
      workoutPlanId: plan.id,
      performedAt: new Date().toISOString(),
      durationSeconds,
      items: sorted.map((item) => ({
        exerciseId: item.exerciseId,
        sets:
          item.exerciseId === current.exerciseId
            ? sets.map((set) => ({
                reps: Number(set.reps || 0),
                load: Number(set.load || 0),
                completed: set.completed,
              }))
            : [],
      })),
    };

    saveSession(session);
    window.location.href = "/historico";
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div>
            <h1 className="title">{exercise.name}</h1>
            <p className="subtitle">
              {plan.name} • {currentIndex + 1} de {sorted.length}
            </p>
          </div>
          <span className="badge">{current.repRange}</span>
        </div>
      </header>

      <main className="container">
        <div className="card execute-hero">
          <Image
            src={exercise.image}
            alt={exercise.name}
            width={420}
            height={420}
            className="execute-image"
          />

          <div className="row">
            <span className="badge">RIR alvo: {current.rirTarget}</span>
            <span className="badge">Descanso: {current.restSeconds}s</span>
          </div>

          <div className="set-grid">
            {sets.map((set, index) => (
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
                  className="btn secondary"
                  onClick={() =>
                    updateSet(index, { completed: !set.completed })
                  }
                >
                  {set.completed ? "OK" : "Feito?"}
                </button>
              </div>
            ))}
          </div>

          <div className="row">
            <button
              className="btn secondary"
              onClick={() => setCurrentIndex((v) => Math.max(0, v - 1))}
              disabled={currentIndex === 0}
            >
              Voltar
            </button>

            {currentIndex < sorted.length - 1 ? (
              <button className="btn" onClick={goNextExercise}>
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
