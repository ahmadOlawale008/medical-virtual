export type PhysiologyExperiment = {
  number: string;
  title: string;
  description: string;
  href?: string;
};

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
];

export const amphibianExperiments: PhysiologyExperiment[] = [
  { number: "01", title: "Simple Muscle Twitch", description: "Record the latent period, contraction period, and relaxation period of a single twitch.", href: "/physiology/amphibian-physiology/simple-muscle-twitch" },
  { number: "02", title: "Effect of Temperature", description: "Compare muscle contraction after cooling and warming the preparation.", href: "/physiology/amphibian-physiology/effect-of-temperature" },
  { number: "03", title: "Effect of Two Successive Stimuli", description: "Change the interval between two stimuli and observe summation or separate contractions." },
  { number: "04", title: "Genesis of Tetanus", description: "Increase stimulation frequency to produce incomplete and complete tetanus." },
  { number: "05", title: "Effect of Load", description: "Alter the attached load and examine changes in shortening and work performed." },
  { number: "06", title: "Genesis of Fatigue", description: "Apply repeated stimulation and track the progressive decline in contraction force." },
  { number: "07", title: "Effect of Stimulus Strength", description: "Move from subthreshold to maximal stimulation and compare contraction amplitude." },
  { number: "08", title: "Conduction Velocity", description: "Stimulate at two points on the nerve and calculate impulse conduction velocity." },
  { number: "09", title: "Normal Cardiogram", description: "Record the normal amphibian cardiac cycle and relate atrial and ventricular contractions." },
  { number: "10", title: "Properties of Cardiac Muscle", description: "Investigate rhythmicity, refractory behavior, extrasystole, and compensatory pause." },
];
