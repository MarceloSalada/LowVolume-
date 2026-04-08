export type WorkoutExercise = {
  exerciseId: string;
  order: number;
  sets: number;
  repRange: string;
  rirTarget: string;
  restSeconds: number;
};

export type WorkoutPlan = {
  id: string;
  name: string;
  focus: string;
  description: string;
  exercises: WorkoutExercise[];
};

export const workoutPlans: WorkoutPlan[] = [
  {
    id: "anteriores-a",
    name: "Anteriores A",
    focus: "Peito",
    description: "Peito primeiro, ombro depois, pernas como suporte.",
    exercises: [
      { exerciseId: "supino-maquina-reto", order: 1, sets: 2, repRange: "6-10", rirTarget: "1-2", restSeconds: 180 },
      { exerciseId: "crucifixo-maquina-unilateral", order: 2, sets: 2, repRange: "8-12", rirTarget: "1-2", restSeconds: 120 },
      { exerciseId: "flexao-de-ombro-inclinado", order: 3, sets: 2, repRange: "8-12", rirTarget: "1-2", restSeconds: 90 },
      { exerciseId: "elevacao-lateral-maquina", order: 4, sets: 2, repRange: "10-15", rirTarget: "1-2", restSeconds: 90 },
      { exerciseId: "leg-press-45", order: 5, sets: 2, repRange: "8-12", rirTarget: "1-2", restSeconds: 180 },
      { exerciseId: "cadeira-extensora", order: 6, sets: 1, repRange: "10-15", rirTarget: "1-2", restSeconds: 90 },
      { exerciseId: "cadeira-adutora", order: 7, sets: 1, repRange: "10-15", rirTarget: "1-2", restSeconds: 90 },
      { exerciseId: "extensao-de-cotovelo", order: 8, sets: 1, repRange: "8-12", rirTarget: "1-2", restSeconds: 90 },
    ],
  },
  {
    id: "posteriores-a",
    name: "Posteriores A",
    focus: "Costas e Bíceps",
    description: "Costas primeiro, bíceps depois, posterior como suporte.",
    exercises: [
      { exerciseId: "puxada-unilateral-com-extensao-de-ombro", order: 1, sets: 2, repRange: "6-10", rirTarget: "1-2", restSeconds: 120 },
      { exerciseId: "puxada-alta-aberta", order: 2, sets: 2, repRange: "8-12", rirTarget: "1-2", restSeconds: 120 },
      { exerciseId: "kelso-shrugs", order: 3, sets: 2, repRange: "8-12", rirTarget: "1-2", restSeconds: 90 },
      { exerciseId: "rosca-bayesiana-unilateral", order: 4, sets: 2, repRange: "8-12", rirTarget: "1-2", restSeconds: 90 },
      { exerciseId: "rosca-inversa-limitada", order: 5, sets: 1, repRange: "10-15", rirTarget: "1-2", restSeconds: 90 },
      { exerciseId: "cadeira-flexora", order: 6, sets: 2, repRange: "8-12", rirTarget: "1-2", restSeconds: 120 },
      { exerciseId: "hyperextensao-banco-romano", order: 7, sets: 1, repRange: "10-15", rirTarget: "1-2", restSeconds: 90 },
    ],
  },
];

export const workoutPlansMap = Object.fromEntries(
  workoutPlans.map((plan) => [plan.id, plan]),
) as Record<string, WorkoutPlan>;
