import type { Metadata } from "next";
import PartShell from "../hemoglobin-oxygen-saturation/components/part-shell";
import { Activity, Figure, Para, Section, SubSection } from "../hemoglobin-oxygen-saturation/components/part-content";

export const metadata: Metadata = {
  title: "Hb-O₂ Saturation Part 3: Pulse Oximetry | MedLab Virtual",
  description:
    "Learn how a pulse oximeter measures SpO₂ and pulse rate using red and infrared light absorption.",
};

export default function HemoglobinSaturationPart3Page() {
  return (
    <PartShell
      number="3"
      title="How Pulse Oximetry Measures Blood Oxygen Levels"
      subtitle="Light absorption · SpO₂ calculation · pulse rate"
      blurb="Learn about pulse oximeters, the devices used to measure blood oxygen saturation levels. Understand how they work using light emission and detection, how %SpO₂ is calculated, and how pulse rate is determined."
    >
      <Figure
        file="pulse-oximeter-views.png"
        alt="Views of a fingertip pulse oximeter and its display"
        caption="A fingertip pulse oximeter displays SpO₂ and pulse rate"
        maxWidth={640}
      />

      <Section title="What is a Pulse Oximeter?">
        <Para>
          A pulse oximeter is a small plastic device that is typically clipped to a fingertip or an
          earlobe.
        </Para>
        <Para>
          The top of the device contains a light source that emits red and infrared light, while the bottom
          has a sensor that detects the amount of light absorbed by oxygenated hemoglobin.
        </Para>
        <Para>
          A small digital display screen integrated into the device shows the user&apos;s peripheral blood
          oxygen saturation percentage (SpO<sub>2</sub>) and pulse rate (PR).
        </Para>
        <Figure
          file="pulse-oximeter.png"
          alt="A pulse oximeter clipped to a fingertip"
          caption="A pulse oximeter clipped to the fingertip"
          maxWidth={480}
        />
      </Section>

      <Section title="How Pulse Oximeters Work">
        <SubSection title="Light Emission and Detection">
          <Para>
            Embedded on one side of the oximeter are two light-emitting diodes (LEDs); one releases red
            (~660 nm) and the other infrared (~940 nm) light. These specific wavelengths are used because
            the absorption of red and infrared light differs between oxygenated and deoxygenated
            hemoglobin. Oxygenated hemoglobin absorbs more infrared light and less red light, while
            deoxygenated hemoglobin absorbs more red light and less infrared light.
          </Para>
          <Para>
            On the other side of the oximeter is a photodetector that measures the amount of light absorbed
            by the constant and variable components that make up the body part in the oximeter. The constant
            components include skin, connective tissue, bone, and nonpulsating blood. In comparison, the
            variable component consists of pulsating arterial blood caused by each heartbeat.
          </Para>
        </SubSection>

        <SubSection title="Calculation of SpO₂">
          <Para>
            A pulse oximeter calculates the oxygen-carrying capacity of all circulating hemoglobin
            molecules. It does this by projecting red and infrared light through pulsating arteries in
            peripheral blood and comparing the light absorption ratio. This calculation relies on
            algorithms programmed into the device, which consider the typical absorption characteristics of
            oxyhemoglobin and deoxyhemoglobin.
          </Para>
          <Para>
            The results of this calculation are displayed as SpO<sub>2</sub> % or percentage of oxygenated
            hemoglobin in peripheral blood. When the SpO<sub>2</sub> reading is less than 100%, the
            hemoglobin in the peripheral blood carries less than the maximum oxygen it could potentially
            carry. In other words, not all of the hemoglobin molecules are fully saturated or bound to 4 O
            <sub>2</sub> molecules.
          </Para>
          <Para>
            For example, a SpO<sub>2</sub> reading of 85% indicates that the hemoglobin in circulation
            carries 85% of its theoretical maximum oxygen capacity because many hemoglobin molecules are
            less than fully saturated.
          </Para>
          <Activity
            label="Pulse oximeter"
            file="pulse-oximetry.html"
            note="Operate the device and relate pulsatile light absorption to SpO₂ and pulse rate."
          />
        </SubSection>

        <SubSection title="Pulse Rate">
          <Para>
            In addition to measuring oxygen saturation, the pulse oximeter measures a subject&apos;s pulse
            rate. As the heart pumps blood through the arteries, the amount of light absorbed by the blood
            changes. The pulse oximeter detects the frequency of these cyclical changes in light absorption
            and uses them to calculate the patient&apos;s pulse rate, which is also displayed on the digital
            screen.
          </Para>
          <Figure
            file="pulse-oximeter-2.png"
            alt="Pulse oximeter screen showing oxygen saturation and pulse rate waveform"
            caption="The display reports SpO₂ alongside the pulsatile waveform used to derive pulse rate"
            maxWidth={620}
          />
        </SubSection>
      </Section>

      <Section title="Assessment">
        <Para>
          Explore the activity above, then answer the 7-question assessment that follows below. Questions
          are graded automatically and the Human Bio Media model answer is shown after you submit.
        </Para>
      </Section>
    </PartShell>
  );
}
