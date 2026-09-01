export type Objective = 4 | 10 | 40 | 100;
export type CellType =
  | "Neutrophil"
  | "Lymphocyte"
  | "Monocyte"
  | "Eosinophil"
  | "Basophil";

export type SmearCell = {
  id: string;
  x: number;
  y: number;
  radius: number;
  rotation: number;
};

export type Leukocyte = SmearCell & {
  type: CellType;
};

export const OBJECTIVE_ZOOM: Record<Objective, number> = {
  4: 0.98,
  10: 1.83,
  40: 7,
  100: 18.2,
};

export const CELL_TYPES: CellType[] = [
  "Neutrophil",
  "Lymphocyte",
  "Monocyte",
  "Eosinophil",
  "Basophil",
];

const DISTRIBUTION: Record<CellType, number> = {
  Neutrophil: 60,
  Lymphocyte: 30,
  Monocyte: 5,
  Eosinophil: 4,
  Basophil: 1,
};

function seededFraction(value: number) {
  const raw = Math.sin(value * 83.173 + 23.71) * 100003;
  return raw - Math.floor(raw);
}

const typePool = CELL_TYPES.flatMap((type) =>
  Array.from({ length: DISTRIBUTION[type] }, () => type),
).sort((a, b) => {
  const aIndex = CELL_TYPES.indexOf(a);
  const bIndex = CELL_TYPES.indexOf(b);
  return seededFraction(aIndex * 31 + bIndex * 17) - 0.5;
});

export const LEUKOCYTES: Leukocyte[] = typePool.map((type, index) => ({
  id: `wbc-${index + 1}`,
  type,
  x: 0.08 + seededFraction(index * 2.71) * 2.84,
  y: 0.08 + seededFraction(index * 5.39 + 13) * 2.84,
  radius: type === "Monocyte"
    ? 0.014 + seededFraction(index * 3.2) * 0.002
    : 0.009 + seededFraction(index * 3.2) * 0.002,
  rotation: seededFraction(index * 9.17) * Math.PI * 2,
}));

export const ERYTHROCYTES: SmearCell[] = Array.from(
  { length: 5000 },
  (_, index) => ({
    id: `rbc-${index + 1}`,
    x: 0.02 + seededFraction(index * 1.91 + 3) * 2.96,
    y: 0.02 + seededFraction(index * 4.73 + 29) * 2.96,
    radius: 0.0034 + seededFraction(index * 6.21) * 0.00055,
    rotation: seededFraction(index * 10.9) * Math.PI,
  }),
);

export function emptyCounts(): Record<CellType, number> {
  return {
    Neutrophil: 0,
    Lymphocyte: 0,
    Monocyte: 0,
    Eosinophil: 0,
    Basophil: 0,
  };
}
