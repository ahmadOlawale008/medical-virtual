export type Objective = 4 | 10 | 40 | 100;
export type RegionId = "R1" | "R2" | "R3" | "R4" | "R5";

export type Erythrocyte = {
  id: string;
  x: number;
  y: number;
  radius: number;
  rotation: number;
  region: RegionId | null;
};

export const OBJECTIVE_ZOOM: Record<Objective, number> = {
  4: 0.98,
  10: 1.83,
  40: 7,
  100: 18.2,
};

export const REGIONS: Record<
  RegionId,
  { label: string; row: number; column: number; center: [number, number] }
> = {
  R1: { label: "Upper left", row: 0, column: 0, center: [1.1, 1.1] },
  R2: { label: "Upper right", row: 0, column: 4, center: [1.9, 1.1] },
  R3: { label: "Center", row: 2, column: 2, center: [1.5, 1.5] },
  R4: { label: "Lower left", row: 4, column: 0, center: [1.1, 1.9] },
  R5: { label: "Lower right", row: 4, column: 4, center: [1.9, 1.9] },
};

function seededFraction(value: number) {
  const raw = Math.sin(value * 74.371 + 11.29) * 99991;
  return raw - Math.floor(raw);
}

function getRegion(x: number, y: number): RegionId | null {
  for (const [id, region] of Object.entries(REGIONS) as [RegionId, (typeof REGIONS)[RegionId]][]) {
    const left = 1 + region.column * 0.2;
    const top = 1 + region.row * 0.2;
    if (x >= left && x < left + 0.2 && y >= top && y < top + 0.2) return id;
  }
  return null;
}

export const ERYTHROCYTES: Erythrocyte[] = Array.from(
  { length: 2500 },
  (_, index) => {
    const x = 1.008 + seededFraction(index * 2.17) * 0.984;
    const y = 1.008 + seededFraction(index * 5.31 + 19) * 0.984;
    return {
      id: `rbc-${index + 1}`,
      x,
      y,
      radius: 0.0034 + seededFraction(index * 7.23) * 0.00055,
      rotation: seededFraction(index * 11.91) * Math.PI,
      region: getRegion(x, y),
    };
  },
);

export function calculateRbc(cellCount: number) {
  return cellCount * 10_000;
}
