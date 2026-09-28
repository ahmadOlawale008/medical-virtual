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
  title: "Hb-O₂ Saturation Part 2: Dissociation Curve | MedLab Virtual",
  description:
    "Explore cooperative binding, oxygen loading in the lungs, unloading in the tissues, and the factors that shift the oxyhemoglobin dissociation curve.",
};

export default function HemoglobinSaturationPart2Page() {
  return (
    <PartShell
      number="2"
      title="The Oxygen-Hemoglobin Dissociation Curve"
      subtitle="Cooperative binding · loading and unloading · curve shifts"
      blurb="Discover the oxyhemoglobin dissociation curve and how it illustrates the relationship between arterial oxygen pressure and hemoglobin saturation. Understand oxygen loading in the lungs, unloading in tissues, cooperative binding, and how factors like pH, temperature, and 2,3-DPG affect oxygen affinity."
    >
      <Figure
        file="o2-hb-dissociation-curve.png"
        alt="The sigmoidal oxyhemoglobin dissociation curve"
        caption="The oxyhemoglobin dissociation curve relates PaO₂ to hemoglobin oxygen saturation"
        maxWidth={640}
      />

      <Section title="What The Oxyhemoglobin Dissociation Curve Represents">
        <Para>
          The oxyhemoglobin dissociation curve illustrates the relationship between the arterial partial
          pressure of oxygen (PaO₂) and the levels of hemoglobin oxygen saturation.
        </Para>

        <SubSection title="Oxygen Loading in the Lungs">
          <Para>
            The left side of the curve is relatively flattened compared to its middle portion, indicating
            that a relatively significant increase in PaO<sub>2</sub> is needed to bind the first oxygen
            molecule. This occurs because unsaturated hemoglobin is in a tense (T) conformational state and
            has a low affinity for oxygen.
          </Para>
          <Para>
            The middle portion of the curve is the steepest, indicating that relatively small increases in
            PaO<sub>2</sub> are needed to saturate the hemoglobin molecules further.
          </Para>
          <Para>
            The binding of the first oxygen molecule to hemoglobin, which results in 25% saturation, shifts
            the molecule to a relaxed (R) state. This change in shape increases hemoglobin&apos;s affinity
            for oxygen, facilitating the binding of the second (50% saturation) and third (75% saturation)
            oxygen molecules. This phenomenon is referred to as cooperative binding.
          </Para>
          <Para>
            The right portion of the oxyhemoglobin dissociation curve is the flattest. With only one
            binding site available, a relatively large increase in PaO<sub>2</sub> is required to bind the
            fourth oxygen to hemoglobin, making it 100% saturated.
          </Para>
          <Figure
            file="hb-o2-dissociation-curve-portions.png"
            alt="The flat left, steep middle, and flat right portions of the dissociation curve"
            caption="Left (flat), middle (steep), and right (flat) portions of the curve"
            maxWidth={560}
          />
          <Callout title="Summary">
            <p>
              When no O₂ molecules are bound to hemoglobin, it assumes a tensed (T) shape, which has a low
              affinity for O₂. While in this state, it requires a significant increase in PaO<sub>2</sub> to
              bind the first O₂. This binding triggers a conformational change in the hemoglobin molecule,
              causing it to shift to a relaxed (R) state. This conformational state increases
              hemoglobin&apos;s affinity for oxygen, making it easier for the second and third O₂ molecules
              to bind. However, binding the fourth O₂ molecule to hemoglobin is the most difficult,
              requiring the largest increase in PaO<sub>2</sub>.
            </p>
          </Callout>
        </SubSection>

        <SubSection title="Oxygen Unloading in the Tissues">
          <Para>
            The PaO₂ near the tissues drops significantly because tissue cells remove the O
            <sub>2</sub> from the extracellular environment to produce ATP. Under resting conditions, the
            PaO₂ is ~40 mmHg, which causes hemoglobin to release the fourth (last-loaded) O
            <sub>2</sub>.
          </Para>
          <Para>
            Tissue cells consume more O<sub>2</sub> as their activity increases, reducing the PaO₂. The
            lower oxygen pressure causes the second and third oxygen molecules to readily unbind from
            hemoglobin, as indicated in the steep portion of the oxyhemoglobin dissociation curve. This
            ensures efficient oxygen unloading, making more O<sub>2</sub> available to the active cells.
          </Para>
        </SubSection>

        <SubSection title="Other Affecting Factors">
          <Para>
            In addition to the partial pressure of oxygen (PaO₂), hemoglobin&apos;s affinity for oxygen
            (O₂) is influenced by conditions that shift the oxyhemoglobin dissociation curve to the right
            or left, making it easier or more difficult for hemoglobin to bind O₂. Three common factors
            are:
          </Para>
          <BulletList
            items={[
              <>Fluctuating levels of pH and/or CO₂ (Bohr Effect) resulting from changes in cell activity.</>,
              <>Variations in temperature due to changes in cell activity, environmental conditions, or fever.</>,
              <>Changing amounts of 2,3-DPG (2,3-diphosphoglycerate) in red blood cells caused by hypoxemia or anemia.</>,
            ]}
          />
        </SubSection>
      </Section>

      <Section title="Oxyhemoglobin Dissociation Curve Simulator">
        <Para>
          Use the simulator below to explore the curve. Drag the PaO₂ slider and note the hemoglobin
          oxygen saturation at each pressure — determine the pressures needed to reach 25%, 50%, 75%, and
          100% saturation, then set the pressure to resting tissue levels (~40 mmHg) and to active tissue
          levels (~18 mmHg) to watch oxygen unloading.
        </Para>
        <Activity
          label="Curve simulator"
          file="oxyhemoglobin-dissociation-curve-simulator.html"
          note="Change PaO₂ and inspect the corresponding percentage saturation on the sigmoidal curve — the normal curve uses P₅₀ ≈ 27 mmHg."
        />
        <Para>
          You can also apply the common right-shifting factors (↑ CO₂, ↑ temperature, ↓ pH, or ↑ 2,3-DPG)
          in the simulator and compare the altered curve against the normal reference curve.
        </Para>
      </Section>

      <Section title="Assessment">
        <Para>
          Use the simulator above to work through each scenario, then answer the 11-question assessment
          that follows below. Questions are graded automatically and the Human Bio Media model answer is
          shown after you submit.
        </Para>
      </Section>
    </PartShell>
  );
}

