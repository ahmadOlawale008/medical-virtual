export type SimulationOption = {
  slug: string;
  title: string;
  discipline: "Physiology" | "Pathophysiology";
};

export const simulationCatalog: SimulationOption[] = [
  {
    slug: "physiology/hematology/wbc-count",
    title: "WBC Count (TLC)",
    discipline: "Physiology",
  },
  {
    slug: "physiology/hematology/rbc-count",
    title: "RBC Count",
    discipline: "Physiology",
  },
  {
    slug: "physiology/hematology/dlc-count",
    title: "DLC Count",
    discipline: "Physiology",
  },
  {
    slug: "physiology/hematology/hematocrit",
    title: "Hematocrit Test",
    discipline: "Physiology",
  },
  {
    slug: "physiology/hematology/hematocrit-case-studies",
    title: "Hematocrit Case Studies",
    discipline: "Physiology",
  },
  {
    slug: "physiology/hematology/blood-typing",
    title: "Blood Typing Lab Test",
    discipline: "Physiology",
  },
  {
    slug: "physiology/hematology/hemoglobin-oxygen-saturation",
    title: "Hemoglobin Oxygen Saturation",
    discipline: "Physiology",
  },
  {
    slug: "physiology/hematology/hemoglobin-oxygen-saturation-simulation-and-altitude-part-1",
    title: "Hb-O₂ Saturation Part 1: Oxygen & Hemoglobin",
    discipline: "Physiology",
  },
  {
    slug: "physiology/hematology/hemoglobin-oxygen-saturation-simulation-and-altitude-part-2",
    title: "Hb-O₂ Saturation Part 2: Dissociation Curve",
    discipline: "Physiology",
  },
  {
    slug: "physiology/hematology/hemoglobin-oxygen-saturation-simulation-and-altitude-part-3",
    title: "Hb-O₂ Saturation Part 3: Pulse Oximetry",
    discipline: "Physiology",
  },
  {
    slug: "physiology/hematology/hemoglobin-oxygen-saturation-simulation-and-altitude-part-4",
    title: "Hb-O₂ Saturation Part 4: Altitude Case Study",
    discipline: "Physiology",
  },
  {
    slug: "physiology/amphibian-physiology/simple-muscle-twitch",
    title: "Simple Muscle Twitch",
    discipline: "Physiology",
  },
  {
    slug: "physiology/amphibian-physiology/effect-of-temperature",
    title: "Effect of Temperature",
    discipline: "Physiology",
  },
  {
    slug: "physiology/amphibian-physiology/two-successive-stimuli",
    title: "Effect of Two Successive Stimuli",
    discipline: "Physiology",
  },
  {
    slug: "physiology/amphibian-physiology/genesis-of-tetanus",
    title: "Genesis of Tetanus",
    discipline: "Physiology",
  },
  {
    slug: "physiology/amphibian-physiology/effect-of-load",
    title: "Effect of Load",
    discipline: "Physiology",
  },
  {
    slug: "physiology/amphibian-physiology/genesis-of-fatigue",
    title: "Genesis of Fatigue",
    discipline: "Physiology",
  },
  {
    slug: "physiology/amphibian-physiology/effect-of-stimulus-strength",
    title: "Effect of Stimulus Strength",
    discipline: "Physiology",
  },
  {
    slug: "physiology/amphibian-physiology/conduction-velocity",
    title: "Conduction Velocity",
    discipline: "Physiology",
  },
  {
    slug: "physiology/amphibian-physiology/normal-cardiogram",
    title: "Normal Cardiogram",
    discipline: "Physiology",
  },
  {
    slug: "physiology/amphibian-physiology/properties-of-cardiac-muscle",
    title: "Properties of Cardiac Muscle",
    discipline: "Physiology",
  },
  {
    slug: "physiology/cardiovascular/cardiac-cycle",
    title: "Cardiac Cycle",
    discipline: "Physiology",
  },
  {
    slug: "physiology/neurophysiology/resting-membrane-potential",
    title: "Resting Membrane Potential",
    discipline: "Physiology",
  },
  {
    slug: "physiology/neurophysiology/action-potential",
    title: "Action Potential",
    discipline: "Physiology",
  },
  {
    slug: "physiology/renal-physiology/urine-test-strip",
    title: "Urine Test Strip",
    discipline: "Physiology",
  },
  {
    slug: "physiology/microscope-master",
    title: "Microscope Master",
    discipline: "Physiology",
  },
  {
    slug: "pathophysiology/heart-failure",
    title: "Heart Failure & Compensatory Mechanisms",
    discipline: "Pathophysiology",
  },
  {
    slug: "pathophysiology/obstructive-lung-disease",
    title: "Obstructive Lung Disease",
    discipline: "Pathophysiology",
  },
  {
    slug: "pathophysiology/acute-kidney-injury",
    title: "Acute Kidney Injury",
    discipline: "Pathophysiology",
  },
  {
    slug: "pathophysiology/diabetic-ketoacidosis",
    title: "Diabetic Ketoacidosis",
    discipline: "Pathophysiology",
  },
  {
    slug: "pathophysiology/circulatory-shock",
    title: "Circulatory Shock",
    discipline: "Pathophysiology",
  },
];
