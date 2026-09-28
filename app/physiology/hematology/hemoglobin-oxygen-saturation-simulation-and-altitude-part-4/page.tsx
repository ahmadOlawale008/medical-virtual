import type { Metadata } from "next";
import PartShell from "../hemoglobin-oxygen-saturation/components/part-shell";
import {
  Activity,
  BulletList,
  Callout,
  Figure,
  Para,
  Section,
  SubSection,
} from "../hemoglobin-oxygen-saturation/components/part-content";

export const metadata: Metadata = {
  title: "Hb-O₂ Saturation Part 4: Altitude Case Study | MedLab Virtual",
  description:
    "Follow a subject from sea level to high altitude and compare atmospheric pO₂, PaO₂, SpO₂, and the body's adaptive responses.",
};

export default function HemoglobinSaturationPart4Page() {
  return (
    <PartShell
      number="4"
      title="Case Study: How Altitude Alters Hemoglobin Oxygen Saturation"
      subtitle="Hypoxemia · physiological adaptation · a traveler's journey"
      blurb="Apply your knowledge through a case study examining how altitude affects oxygen pressure and hemoglobin saturation. Follow a subject from sea level to high-altitude locations, observe physiological responses, and understand adaptations to high-altitude environments."
    >
      <Figure
        file="case-study-icon.png"
        alt="Altitude case study illustration"
        caption="A case study of oxygen pressure and hemoglobin saturation across elevations"
        maxWidth={560}
      />

      <Section title="How Altitude Reduces Oxygen Pressures and Hemoglobin Saturation">
        <Para>
          At higher altitudes, the partial pressure of oxygen (pO<sub>2</sub>) in the atmosphere decreases
          while still comprising ~21% of the air, thus reducing the pO<sub>2</sub> of inhaled (alveolar)
          air.
        </Para>
        <Para>
          The drop in alveolar pO<sub>2</sub> causes a corresponding drop in arterial pO<sub>2</sub> (PaO₂).
          Since oxygen binding to hemoglobin is driven by the PaO₂, a decline in PaO₂ leads to lower
          hemoglobin oxygen saturation, which is typically determined by a pulse oximeter and reported as
          SpO₂ percentage (or % peripheral oxygen saturation).
        </Para>
        <Para>
          A decline in SpO₂ indicates low oxygen levels in the blood, a condition known as hypoxemia. This
          condition reduces oxygen delivery to tissues, decreasing the synthesis of ATP by mitochondria.
          The loss of ATP decreases the rate of cellular reactions, which can cause cell damage if
          prolonged.
        </Para>
      </Section>

      <Section title="How Oxygen Levels Change With Altitude">
        <Para>
          Drag the altitude slider from sea level to 30,000 feet and watch atmospheric oxygen pressure
          (PO₂), arterial oxygen pressure (PaO₂), and blood oxygen saturation (SpO₂) fall together — the
          percentage of oxygen in the air never changes; only the pressure it is delivered under does.
        </Para>
        <Activity
          label="Altitude explorer"
          file="altitude-oxygen-level-slider.html"
          note="Move from sea level to 30,000 ft and compare oxygen pressure, saturation, and the symptoms reported at each elevation."
        />
        <Callout title="Sea level reference">
          <p>
            Atmospheric pO₂ ≈ 160 mmHg · Arterial PaO₂ ≈ 98–104 mmHg · SpO₂ ≈ 96–100% (normal)
          </p>
        </Callout>
      </Section>

      <Section title="Altitude and Hypoxemia-Induced Physiological Effects">
        <Para>
          As altitude increases, the availability of oxygen decreases, leading to hypoxemia. This condition
          progressively impairs both physical performance and cognitive function.
        </Para>
        <BulletList
          items={[
            <>
              <strong>3,000 – 8,000 feet:</strong> Mild hypoxemia causes reduced endurance and subtle
              cognitive effects, such as reduced attention or memory.
            </>,
            <>
              <strong>8,000 – 12,000 feet:</strong> Moderate hypoxemia may trigger Acute Mountain Sickness
              (AMS), which can cause headaches, nausea, sleep disturbances, impair cognition, and reduce
              exercise tolerance.
            </>,
            <>
              <strong>12,000 – 18,000 feet:</strong> Severe hypoxemia increases the risk of High-Altitude
              Cerebral Edema (HACE), which can lead to confusion, ataxia, and severely impaired judgment.
              High-Altitude Pulmonary Edema (HAPE) can also cause shortness of breath, cough, and
              significantly decreased exercise tolerance.
            </>,
            <>
              <strong>Above 18,000 – 20,000 feet:</strong> Critical hypoxemia limits the time of useful
              consciousness, and supplemental oxygen is required to prevent severe impairment.
            </>,
          ]}
        />
      </Section>

      <Section title="Physiological Adaptations to High Altitude">
        <Para>
          Several physiological responses occur over time to compensate for decreased oxygen availability
          (hypoxemia).
        </Para>
        <BulletList
          items={[
            <>
              <strong>Immediate:</strong> Breathing becomes faster and deeper to increase ventilation. The
              heartbeat rate and stroke volume increase to improve cardiac output.
            </>,
            <>
              <strong>Hours to Days:</strong> The levels of 2,3-DPG (2,3-diphosphoglycerate) in red blood
              cells start to rise within 12 to 24 hours after the onset of hypoxemia. The binding of this
              molecule to hemoglobin causes the oxygen dissociation curve to shift to the right, which
              facilitates the release of oxygen from hemoglobin to tissue cells.
            </>,
            <>
              <strong>Hours to months:</strong> The kidneys rapidly begin secreting the hormone
              erythropoietin (EPO) in response to hypoxemia, which stimulates red blood cell production in
              the bone marrow. However, it takes weeks to months for fully mature red blood cells to appear
              in the bloodstream.
            </>,
          ]}
        />
      </Section>

      <Section title="Case Study Simulation">
        <SubSection title="Subject">
          <Para>The subject is 30 years old and in good health.</Para>
          <Para>
            She lives in Seattle, Washington, where she is a graduate student in exercise science. As part
            of her degree program, she volunteered for this study.
          </Para>
          <Para>
            Before starting the exercise, the subject had her blood tested, and the results of her
            hemoglobin concentration, hematocrit, and total RBC count were within normal range.
          </Para>
          <Figure
            file="subject.png"
            alt="The case study subject, a healthy 30-year-old graduate student in Seattle"
            caption="The subject: a healthy 30-year-old exercise-science graduate student from Seattle"
            maxWidth={620}
          />
        </SubSection>

        <SubSection title="Procedures">
          <Para>
            The subject will first obtain an oximeter reading in Seattle, which will serve as a baseline of
            comparison for readings taken at other locations.
          </Para>
          <Para>
            She will then sequentially travel to the locations shown in the following activity. At each
            location, the subject will obtain a pulse oximeter reading upon arrival. Due to its high
            altitude, the last location, Mt. Whitney, will be limited to a 15-minute flyover.
          </Para>
          <Activity
            label="Select locations"
            file="locations.html"
            note="Follow the subject's planned journey — Seattle, Salt Lake City, Santa Fe, Aspen, and a flyover of Mt. Whitney — and note each elevation."
          />
        </SubSection>

        <SubSection title="Results">
          <Para>
            The following simulation shows the subject&apos;s physiological responses to visiting the five
            selected locations. Use the &ldquo;Previous&rdquo; and &ldquo;Next&rdquo; buttons to navigate to
            the different locations. At each location:
          </Para>
          <BulletList
            items={[
              <>
                <strong>Note the pulse oximeter readings:</strong> SpO₂ (% oxygen saturation) and Pulse
                Rate (bpm).
              </>,
              <>
                <strong>Analyze the &ldquo;pO₂ vs. Altitude&rdquo; graph:</strong> identify and compare the
                atmospheric pO₂ and arterial pO₂ (PaO₂) at each location, and note how these values shift
                with increasing altitude.
              </>,
              <>
                <strong>Make connections:</strong> observe how SpO₂ (hemoglobin saturation) changes with
                altitude, and consider how decreasing atmospheric and arterial pO₂ levels impact the
                blood&apos;s ability to carry oxygen.
              </>,
            ]}
          />
          <Activity
            label="Case-study results"
            file="hb-o2-saturation-vs-altitude.html"
            note="Compare pulse oximeter readings and oxygen pressures at all five study locations."
          />
        </SubSection>
      </Section>

      <Section title="Analysis and Assessment">
        <Para>
          Work through the four case-study scenarios below — comparing Seattle with Salt Lake City,
          explaining the subject&apos;s cognitive impairment after arriving in Aspen, justifying the
          15-minute limit at Mt. Whitney, and predicting the effects of a flyover at 20,000 feet over Mt.
          McKinley. The 11-question assessment that follows below covers each scenario, is graded
          automatically, and shows the Human Bio Media model answer after you submit.
        </Para>
      </Section>
    </PartShell>
  );
}


