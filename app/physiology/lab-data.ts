export type PhysiologyExperiment = {
  number: string;
  title: string;
  description: string;
  href?: string;
  /** Optional short label shown in tab-style navigation strips. */
  shortTitle?: string;
};

export const cardiovascularExperiments: PhysiologyExperiment[] = [
  { number: "01", title: "Cardiac Cycle Simulation", description: "Coordinate systole, diastole, valve events, ECG, pressures, volumes, blood flow, and heart sounds using the Wiggers diagram.", href: "/physiology/cardiovascular/cardiac-cycle" },
];

export const neurophysiologyExperiments: PhysiologyExperiment[] = [
  { number: "01", title: "Resting Membrane Potential", description: "Measure membrane voltage, manipulate ion gradients and permeability, calculate equilibrium potentials, and explore clinical cases.", href: "/physiology/neurophysiology/resting-membrane-potential" },
  { number: "02", title: "Action Potential", description: "Explore action-potential phases, temporal and spatial summation, all-or-none behavior, and refractory periods.", href: "/physiology/neurophysiology/action-potential" },
];

export const renalPhysiologyExperiments: PhysiologyExperiment[] = [
  { number: "01", title: "Urine Test Strip", description: "Perform a chemical urinalysis using reagent pads and interpret leukocytes, nitrites, protein, glucose, ketones, and other findings.", href: "/physiology/renal-physiology/urine-test-strip" },
];

export const hematologyExperiments: PhysiologyExperiment[] = [
  {
    number: "01",
    title: "WBC Count (TLC)",
    description: "Use a Neubauer chamber to identify counting regions and calculate total leukocyte count.",
    href: "/physiology/hematology/wbc-count",
  },
  {
    number: "02",
    title: "RBC Count",
    description: "Count erythrocytes within the hemocytometer grid and determine cells per microliter.",
    href: "/physiology/hematology/rbc-count",
  },
  {
    number: "03",
    title: "DLC Count",
    description: "Identify leukocyte morphology and determine the differential leukocyte count.",
    href: "/physiology/hematology/dlc-count",
  },
  {
    number: "04",
    title: "Hematocrit Test",
    description: "Prepare and centrifuge a capillary blood sample, then determine packed cell volume using a reader card.",
    href: "/physiology/hematology/hematocrit",
  },
  {
    number: "05",
    title: "Hematocrit Case Studies",
    description: "Measure and interpret hematocrit values across eight simulated clinical patient scenarios.",
    href: "/physiology/hematology/hematocrit-case-studies",
  },
  {
    number: "06",
    title: "Blood Typing Lab Test",
    description: "Perform ABO and Rh typing, observe agglutination, and analyze pregnancy and transfusion compatibility.",
    href: "/physiology/hematology/blood-typing",
  },
  {
    number: "07",
    title: "Hemoglobin Oxygen Saturation",
    description: "Explore oxygen transport, the dissociation curve, pulse oximetry, and physiological responses to altitude.",
    href: "/physiology/hematology/hemoglobin-oxygen-saturation",
  },
];

export const hemoglobinSaturationParts: PhysiologyExperiment[] = [
  {
    number: "01",
    title: "The Structure and Functions of Oxygen and Hemoglobin",
    description:
      "Follow oxygen from the alveoli into the blood and on to tissue cells, examine hemoglobin's structure, and learn how partial pressure drives oxygen binding.",
    href: "/physiology/hematology/hemoglobin-oxygen-saturation-simulation-and-altitude-part-1",
    shortTitle: "Oxygen & hemoglobin",
  },
  {
    number: "02",
    title: "The Oxygen-Hemoglobin Dissociation Curve",
    description:
      "Explore cooperative binding, oxygen loading in the lungs, unloading in the tissues, and the factors that shift hemoglobin's oxygen affinity.",
    href: "/physiology/hematology/hemoglobin-oxygen-saturation-simulation-and-altitude-part-2",
    shortTitle: "Dissociation curve",
  },
  {
    number: "03",
    title: "How Pulse Oximetry Measures Blood Oxygen Levels",
    description:
      "Operate a pulse oximeter, relate red and infrared light absorption to SpO₂, and see how the device calculates pulse rate.",
    href: "/physiology/hematology/hemoglobin-oxygen-saturation-simulation-and-altitude-part-3",
    shortTitle: "Pulse oximetry",
  },
  {
    number: "04",
    title: "Case Study: How Altitude Alters Hemoglobin Oxygen Saturation",
    description:
      "Follow a subject from sea level to high-altitude locations and compare atmospheric pO₂, PaO₂, SpO₂, and the body's adaptive responses.",
    href: "/physiology/hematology/hemoglobin-oxygen-saturation-simulation-and-altitude-part-4",
    shortTitle: "Altitude case study",
  },
];

export const amphibianExperiments: PhysiologyExperiment[] = [
  { number: "01", title: "Simple Muscle Twitch", description: "Record the latent period, contraction period, and relaxation period of a single twitch.", href: "/physiology/amphibian-physiology/simple-muscle-twitch" },
  { number: "02", title: "Effect of Temperature", description: "Compare muscle contraction after cooling and warming the preparation.", href: "/physiology/amphibian-physiology/effect-of-temperature" },
  { number: "03", title: "Effect of Two Successive Stimuli", description: "Change the interval between two stimuli and observe summation or separate contractions.", href: "/physiology/amphibian-physiology/two-successive-stimuli" },
  { number: "04", title: "Genesis of Tetanus", description: "Increase stimulation frequency to produce incomplete and complete tetanus.", href: "/physiology/amphibian-physiology/genesis-of-tetanus" },
  { number: "05", title: "Effect of Load", description: "Alter the attached load and examine changes in shortening and work performed.", href: "/physiology/amphibian-physiology/effect-of-load" },
  { number: "06", title: "Genesis of Fatigue", description: "Apply repeated stimulation and track the progressive decline in contraction force.", href: "/physiology/amphibian-physiology/genesis-of-fatigue" },
  { number: "07", title: "Effect of Stimulus Strength", description: "Move from subthreshold to maximal stimulation and compare contraction amplitude.", href: "/physiology/amphibian-physiology/effect-of-stimulus-strength" },
  { number: "08", title: "Conduction Velocity", description: "Stimulate at two points on the nerve and calculate impulse conduction velocity.", href: "/physiology/amphibian-physiology/conduction-velocity" },
  { number: "09", title: "Normal Cardiogram", description: "Record the normal amphibian cardiac cycle and relate atrial and ventricular contractions.", href: "/physiology/amphibian-physiology/normal-cardiogram" },
  { number: "10", title: "Properties of Cardiac Muscle", description: "Investigate rhythmicity, refractory behavior, extrasystole, and compensatory pause.", href: "/physiology/amphibian-physiology/properties-of-cardiac-muscle" },
];
