export type Objective = 4 | 10 | 40 | 100;
export type SquareId = "W1" | "W2" | "W3" | "W4";

export type Leukocyte = {
  id: string;
  square: SquareId;
  x: number;
  y: number;
  radius: number;
  lobes: number;
};

export const SQUARES: Record<SquareId, { label: string; center: [number, number] }> = {
  W1: { label: "Upper left", center: [0.5, 0.5] },
  W2: { label: "Upper right", center: [2.5, 0.5] },
  W3: { label: "Lower left", center: [0.5, 2.5] },
  W4: { label: "Lower right", center: [2.5, 2.5] },
};

const CELL_COUNTS: Record<SquareId, number> = {
  W1: 50,
  W2: 50,
  W3: 50,
  W4: 50,
};

const SQUARE_ORIGINS: Record<SquareId, [number, number]> = {
  W1: [0, 0],
  W2: [2, 0],
  W3: [0, 2],
  W4: [2, 2],
};

function seededFraction(value: number) {
  const raw = Math.sin(value * 91.173 + 17.41) * 104729;
  return raw - Math.floor(raw);
}

export const LEUKOCYTES: Leukocyte[] = (
  Object.keys(CELL_COUNTS) as SquareId[]
).flatMap((square, squareIndex) => {
  const [originX, originY] = SQUARE_ORIGINS[square];

  return Array.from({ length: CELL_COUNTS[square] }, (_, index) => ({
    id: `${square}-${index + 1}`,
    square,
    x: originX + 0.07 + seededFraction(index + squareIndex * 41) * 0.86,
    y: originY + 0.07 + seededFraction(index * 3.7 + squareIndex * 67) * 0.86,
    // Leukocytes are roughly 10–20 μm across. Chamber coordinates are millimetres.
    radius: 0.006 + seededFraction(index * 7.2 + squareIndex) * 0.0035,
    lobes: 1 + Math.floor(seededFraction(index * 12.3 + squareIndex) * 3),
  }));
});

export const OBJECTIVE_ZOOM: Record<Objective, number> = {
  4: 0.98,
  10: 1.83,
  40: 7,
  100: 18.2,
};

export function getStageCenter(
  objective: Objective,
  activeSquare: SquareId,
  stage: { x: number; y: number },
) {
  const base = objective === 4 ? [1.5, 1.5] : SQUARES[activeSquare].center;
  return {
    x: base[0] + stage.x,
    y: base[1] + stage.y,
  };
}

export function calculateTlc(cellCount: number) {
  return cellCount * 50;
}
