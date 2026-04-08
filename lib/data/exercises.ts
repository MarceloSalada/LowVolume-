export type ExerciseCategory = "anteriores" | "posteriores";

export type Exercise = {
  id: string;
  name: string;
  image: string;
  category: ExerciseCategory;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  notes?: string;
};

export const exercises: Exercise[] = [
  { id: "supino-maquina-reto", name: "Supino máquina reto", image: "/images/exercises/supino-maquina-reto.png", category: "anteriores", primaryMuscles: ["Peito"], secondaryMuscles: ["Tríceps", "Ombro anterior"] },
  { id: "crucifixo-maquina-unilateral", name: "Crucifixo máquina unilateral", image: "/images/exercises/crucifixo-maquina-unilateral.png", category: "anteriores", primaryMuscles: ["Peito"] },
  { id: "flexao-de-ombro-inclinado", name: "Flexão de ombro inclinado", image: "/images/exercises/flexao-de-ombro-inclinado.png", category: "anteriores", primaryMuscles: ["Ombro anterior"] },
  { id: "elevacao-lateral-maquina", name: "Elevação lateral máquina", image: "/images/exercises/elevacao-lateral-maquina.png", category: "anteriores", primaryMuscles: ["Deltoide lateral"] },
  { id: "leg-press-45", name: "Leg press 45", image: "/images/exercises/leg-press-45.png", category: "anteriores", primaryMuscles: ["Quadríceps"], secondaryMuscles: ["Glúteos"] },
  { id: "cadeira-extensora", name: "Cadeira extensora", image: "/images/exercises/cadeira-extensora.png", category: "anteriores", primaryMuscles: ["Quadríceps"] },
  { id: "cadeira-adutora", name: "Cadeira adutora", image: "/images/exercises/cadeira-adutora.png", category: "anteriores", primaryMuscles: ["Adutores"] },
  { id: "extensao-de-cotovelo", name: "Extensão de cotovelo", image: "/images/exercises/extensao-de-cotovelo.png", category: "anteriores", primaryMuscles: ["Tríceps"] },
  { id: "puxada-unilateral-com-extensao-de-ombro", name: "Puxada unilateral com extensão de ombro", image: "/images/exercises/puxada-unilateral-com-extensao-de-ombro.png", category: "posteriores", primaryMuscles: ["Dorsais"], secondaryMuscles: ["Braço"] },
  { id: "puxada-alta-aberta", name: "Puxada alta aberta", image: "/images/exercises/puxada-alta-aberta.png", category: "posteriores", primaryMuscles: ["Costas"], secondaryMuscles: ["Dorsais", "Bíceps"] },
  { id: "kelso-shrugs", name: "Kelso shrugs", image: "/images/exercises/kelso-shrugs.png", category: "posteriores", primaryMuscles: ["Trapézio médio"], secondaryMuscles: ["Parte alta das costas"] },
  { id: "rosca-bayesiana-unilateral", name: "Rosca bayesiana unilateral", image: "/images/exercises/rosca-bayesiana-unilateral.png", category: "posteriores", primaryMuscles: ["Bíceps"] },
  { id: "rosca-inversa-limitada", name: "Rosca inversa limitada", image: "/images/exercises/rosca-inversa-limitada.png", category: "posteriores", primaryMuscles: ["Braquiorradial"], secondaryMuscles: ["Antebraço", "Bíceps"] },
  { id: "cadeira-flexora", name: "Cadeira flexora", image: "/images/exercises/cadeira-flexora.png", category: "posteriores", primaryMuscles: ["Posterior de coxa"] },
  { id: "hyperextensao-banco-romano", name: "Hiperextensão banco romano", image: "/images/exercises/hyperextensao-banco-romano.png", category: "posteriores", primaryMuscles: ["Lombar"], secondaryMuscles: ["Glúteos", "Posterior de coxa"] },
];

export const exercisesMap = Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise])) as Record<string, Exercise>;
