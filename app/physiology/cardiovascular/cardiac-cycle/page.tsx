import type { Metadata } from "next";
import SimulationShell from "./components/simulation-shell";
import {
  Activity,
  BulletList,
  Callout,
  Figure,
  MinorHeading,
  Para,
  Section,
  SubSection,
} from "./components/part-content";

const SECTIONS = [
  { id: "foundations", label: "Foundations" },
  { id: "wiggers", label: "Wiggers diagram" },
  { id: "isovolumetric-contraction", label: "Isovolumetric contraction" },
  { id: "ventricular-ejection", label: "Ventricular ejection" },
  { id: "isovolumetric-relaxation", label: "Isovolumetric relaxation" },
  { id: "passive-filling", label: "Passive filling" },
  { id: "atrial-systole", label: "Atrial systole" },
  { id: "assessments", label: "Assessments" },
];

export const metadata: Metadata = {
  title: "Cardiac Cycle | MedLab Virtual",
  description:
    "One 0.8-second heartbeat on a single page: the heart as a dual pump, the Wiggers diagram, and every phase of the cardiac cycle with its activity and assessment.",
};

export default function CardiacCyclePage() {
  return (
    <SimulationShell
      parentHref="/physiology/cardiovascular"
      parentLabel="Cardiovascular Physiology"
      kicker="PHYSIOLOGY · CARDIOVASCULAR · CARDIAC CYCLE"
      title="Cardiac Cycle"
      subtitle="Systole · diastole · the five phases of one heartbeat"
      blurb="One 0.8-second heartbeat on a single page: how the heart works as a dual pump, how to read the Wiggers diagram, and what happens in every phase — with a scan activity for each phase."
      facts={[
        { label: "one cycle at 75 bpm", value: "0.8 s" },
        { label: "phases of the cycle", value: "5" },
        { label: "practice questions", value: "45" },
      ]}
      jumpLinks={SECTIONS}
    >
      <Section id="foundations" title="Introduction">
        <Para>
          The cardiac cycle is the sequence of mechanical and electrical events during a single heartbeat. When
          the heart beats 75 times per minute, one cardiac cycle lasts 0.8 seconds. The duration shortens as the
          heart rate increases and lengthens as the heart rate decreases. Because it is recurring, the end of one
          cycle immediately precedes and prepares the heart for the start of the next cycle.
        </Para>
        <Figure
          file="cardiac-cycle-diagram.png"
          alt="Overview of the cardiac cycle linking heart actions with pressure, volume, valve, ECG, and sound events"
          caption="The cardiac cycle at a glance"
          maxWidth={460}
        />
      </Section>

      <Section title="The Heart as a Dual Pump">
        <Para>
          During each cardiac cycle, the heart functions as two coordinated pumps working in parallel to drive
          blood through two circulatory pathways simultaneously. The right side receives deoxygenated blood from
          the body and pumps it to the lungs through the pulmonary circulation, where it picks up oxygen and
          releases carbon dioxide. At the same time, the left side receives this oxygen-rich blood from the lungs
          and pumps it through the systemic circulation to supply all tissues of the body, from the head and
          upper limbs to the abdomen and lower limbs.
        </Para>
        <Figure
          file="heart-and-circulation.gif"
          alt="Animated heart pumping blood through the pulmonary and systemic circulations"
          caption="Two pumps working in parallel"
          maxWidth={440}
        />
      </Section>

      <Section title="Heart Structures Review">
        <Para>
          Before continuing the presentation of the cardiac cycle, it may be beneficial to first review the major
          heart structures.
        </Para>
        <Activity
          label="Heart structures"
          note="Interactive review of the chambers, valves, and vessels involved in each cycle."
          file="heart-structures.html"
        />
      </Section>

      <Section title="Cardiac Cycle Segments">
        <Para>
          The cardiac cycle includes two major segments. During ventricular systole, the heart&apos;s ventricles
          pump blood out of the chambers. It accounts for about 1/3 of the cardiac cycle. During ventricular
          diastole, the ventricular chambers relax and fill with blood. This segment is about 2/3 of the cardiac
          cycle.
        </Para>
        <BulletList
          items={[
            <>
              <strong>Ventricular systole</strong> — the ventricles contract and eject blood; about 1/3 of the
              cycle.
            </>,
            <>
              <strong>Ventricular diastole</strong> — the ventricles relax and refill; about 2/3 of the cycle.
            </>,
          ]}
        />
      </Section>
      <Section title="Phases and Basic Events">
        <Para>
          Physiologists typically subdivide ventricular systole and diastole periods into several phases (or
          stages) to better study the events in the heart chambers and major blood vessels. The approach and
          number of phases vary, but generally resemble the scheme below.
        </Para>

        <SubSection title="Ventricular Systole">
          <MinorHeading title="Ventricular Isovolumetric Contraction" />
          <Para>
            The blood-filled ventricles start contracting during this phase, increasing the pressure in the
            chambers. When the ventricular pressures rise above the atrial pressures, the atrioventricular valves
            close. Because all the heart valves are closed, blood cannot exit the ventricles; therefore, the blood
            volume in these chambers remains unchanged, or &ldquo;isovolumetric.&rdquo;
          </Para>
          <MinorHeading title="Ventricular Ejection" />
          <Para>
            The ventricular walls continue to contract, causing the blood pressure in these chambers to increase.
            When the ventricular blood pressures rise above those in the large arteries of the heart, it forces
            the semilunar valves to open, allowing blood to flow into the aorta and pulmonary trunk arteries.
            Initially, the blood flows rapidly out of the ventricles but slows as the phase continues.
          </Para>
        </SubSection>

        <SubSection title="Ventricular Diastole">
          <MinorHeading title="Ventricular Isovolumetric Relaxation" />
          <Para>
            The ventricles begin to relax, decreasing the blood pressure in the chambers. When the ventricular
            pressures fall below the pressures in the large arteries, the semilunar valves close. Because all the
            heart valves are closed, blood cannot enter the ventricles; therefore, the blood volume in these
            chambers remains unchanged, or &ldquo;isovolumetric.&rdquo;
          </Para>
          <MinorHeading title="Passive Ventricular Filling" />
          <Para>
            The pressure on the blood in the ventricular chambers decreases as the ventricular walls continue to
            relax. When the ventricular pressures fall below the atrial pressures, it forces the atrioventricular
            valves to open. Initially, blood in the atria rapidly enters the ventricles. Filling slows as blood
            from the heart&rsquo;s large veins flows into the ventricles after passing through the atria.
          </Para>
          <MinorHeading title="Atrial Systole" />
          <Para>
            The previous phase nearly fills the ventricles with blood. To complete the filling process, the atria
            contract to actively inject additional blood into the ventricles just before they contract.
          </Para>
        </SubSection>

        <Activity
          label="Phase sequence"
          note="Watch the five phases run in sequence and compare them with the event graphs."
          file="phase-sequence.html"
        />
      </Section>
      <Section title="Cardiac Cycle Starting Points">
        <Para>
          Because the phases are part of a cyclic process, there is no set (or standardized) starting point for
          the cardiac cycle. Physiologists often select the atrial systole phase as the starting point of the
          cardiac cycle because it coincides with the P wave at the beginning of the electrocardiogram. Another
          commonly used starting point is the ventricular isovolumetric contraction phase. It is selected because
          it marks the beginning of ventricular systole.
        </Para>
        <Figure
          file="atrial-systole.png"
          alt="Atrial systole chosen as a starting point of the cardiac cycle"
          caption="Atrial Systole Start Point"
          maxWidth={460}
        />
        <Figure
          file="isovolumetric-contraction.png"
          alt="Ventricular isovolumetric contraction chosen as a starting point of the cardiac cycle"
          caption="Isovolumetric Contraction Start Point"
          maxWidth={460}
        />
      </Section>

      <Section title="Blood Flow Regulation">
        <Para>
          Blood flows through the heart from areas of higher pressure to areas of lower pressure, a process that
          changes with each phase of the cardiac cycle. The pressure in the heart chambers increases when
          cardiomyocytes (also known as myocardiocytes or heart muscle cells) contract and decreases when they
          relax. Electrochemical activity (action potentials) in cardiomyocyte membranes controls their rhythmic
          contraction and relaxation. The pace of cardiomyocyte action potentials is, in turn, regulated by the
          heart&rsquo;s conduction system.
        </Para>
        <Para>
          Heart valves direct blood flow by allowing blood to enter only the proper low-pressure areas. As blood
          moves from areas of higher pressure to lower pressure, it produces corresponding changes in the blood
          volumes of the heart chambers.
        </Para>
        <Figure
          file="bloodflow.gif"
          alt="Animated blood flow through the heart driven by pressure differences"
          caption="Pressure differences drive flow through the valves"
          maxWidth={460}
        />
      </Section>
      <Section id="wiggers" title="The Wiggers Diagram">
        <Para>
          The Wiggers diagram, named after its developer, Carl Wiggers, is a composite of several graphs related
          to the cardiac cycle. Physiologists use the information the Wiggers diagram provides to interpret and
          comprehend the changing events associated with each part of a heartbeat.
        </Para>
        <Figure
          file="wiggers-diagram.png"
          alt="Wiggers diagram combining pressure, volume, ECG, and heart sound graphs over one cardiac cycle"
          caption="The Wiggers diagram"
          maxWidth={520}
        />
      </Section>

      <Section title="X-Axis Components">
        <Para>
          The X-axis (horizontal axis) of the Wiggers diagram displays the sequence and durations of the main
          divisions and subdivisions (phases) of the cardiac cycle.
        </Para>
        <Figure
          file="wiggers-diagram-x-axis.png"
          alt="X-axis of the Wiggers diagram showing the sequence and durations of the cardiac cycle phases"
          caption="X-axis — sequence and durations of divisions and phases"
          maxWidth={520}
        />
      </Section>

      <Section title="Y-Axis Components">
        <Para>
          The Y-axis (vertical axis) displays the amplitudes of several heart events associated with each part of
          the cardiac cycle, including chamber pressures, chamber volumes, electrical activity, and sounds. The
          recordings are taken from the left side of the heart because the ventricle is thicker and produces more
          forceful contractions than the right.
        </Para>
        <Figure
          file="wiggers-diagram-pressures.png"
          alt="Wiggers diagram y-axis trace of atrial, ventricular, and arterial pressures"
          caption="Chamber and Arterial Pressures"
          maxWidth={520}
        />
        <Figure
          file="wiggers-diagram-volumes.png"
          alt="Wiggers diagram y-axis trace of ventricular blood volume"
          caption="Ventricular Volumes"
          maxWidth={520}
        />
        <Figure
          file="wiggers-diagram-electrocardiogram.png"
          alt="Wiggers diagram y-axis trace of the electrocardiogram"
          caption="Electrical Activity"
          maxWidth={520}
        />
        <Figure
          file="wiggers-diagram-phonocardiogram.png"
          alt="Wiggers diagram y-axis trace of heart sounds"
          caption="Heart Sounds"
          maxWidth={520}
        />
      </Section>

      <Section title="Interactive Display">
        <Para>
          Use the interactive display below to put the cardiac cycle events in continuous motion. As the sequence
          of phases sweeps across the screen, notice how the heart&rsquo;s electrical and mechanical activities
          are related. Additionally, observe how the heart&rsquo;s mechanical activities affect heart pressure,
          volume, and sounds.
        </Para>
        <Activity
          label="Interactive display"
          note="Run the full cycle in motion and watch pressure, volume, ECG, and sounds update together."
          file="interactive-display.html"
        />
      </Section>
      <Section title="Phase Procedures and Activities">
        <Para>
          Each phase below pairs its events with the matching Human Bio Media scan. Inside every activity: press
          the phase button to view that phase on its own along with the associated heart actions, watch the
          animated heart to compare the phase event graphs with those actions, and use the portion of the Wiggers
          diagram highlighted by the phase scan — with the hide/show buttons to select individual graphs — to
          assess the phase events.
        </Para>
      </Section>

      <Section id="isovolumetric-contraction" title="Phase 1 · Ventricular Isovolumetric Contraction">
        <Para>
          The blood-filled ventricles start contracting during this phase, increasing the pressure in the
          chambers. When the ventricular pressures rise above the atrial pressures, the atrioventricular valves
          close. Because all the heart valves are closed, blood cannot exit the ventricles; therefore, the blood
          volume in these chambers remains unchanged, or &ldquo;isovolumetric.&rdquo;
        </Para>
        <Callout title="Procedure">
          Click the ventricular isovolumetric contraction button to view a scan of this phase and the associated
          heart actions.
        </Callout>
        <Activity
          label="Isovolumetric contraction scan"
          note="Click the ventricular isovolumetric contraction button inside the activity to scan this phase."
          file="phase-analysis.html"
        />
        <Para>
          <strong>Assessment:</strong> the six practice questions for this phase are in the
          &ldquo;Isovolumetric Contraction Assessment&rdquo; entry of the quiz selector underneath this page.
        </Para>
      </Section>

      <Section id="ventricular-ejection" title="Phase 2 · Ventricular Ejection">
        <Para>
          The ventricular walls continue to contract, causing the blood pressure in these chambers to increase.
          When the ventricular blood pressures rise above those in the large arteries of the heart, it forces the
          semilunar valves to open, allowing blood to flow into the aorta and pulmonary trunk arteries. Initially,
          the blood flows rapidly out of the ventricles but slows as the phase continues.
        </Para>
        <Callout title="Procedure">
          Click the ventricular ejection button to view a scan of this phase and the associated heart actions.
        </Callout>
        <Activity
          label="Ventricular ejection scan"
          note="Click the ventricular ejection button inside the activity to scan this phase."
          file="phase-analysis.html"
        />
        <Para>
          <strong>Assessment:</strong> the six practice questions for this phase are in the
          &ldquo;Ventricular Ejection Assessment&rdquo; entry of the quiz selector underneath this page.
        </Para>
      </Section>
      <Section id="isovolumetric-relaxation" title="Phase 3 · Ventricular Isovolumetric Relaxation">
        <Para>
          The ventricles begin to relax, decreasing the blood pressure in the chambers. When the ventricular
          pressures fall below the pressures in the large arteries, the semilunar valves close. Because all the
          heart valves are closed, blood cannot enter the ventricles; therefore, the blood volume in these chambers
          remains unchanged, or &ldquo;isovolumetric.&rdquo;
        </Para>
        <Callout title="Procedure">
          Click the ventricular isovolumetric relaxation button to view a scan of this phase and the associated
          heart actions.
        </Callout>
        <Activity
          label="Isovolumetric relaxation scan"
          note="Click the ventricular isovolumetric relaxation button inside the activity to scan this phase."
          file="phase-analysis.html"
        />
        <Para>
          <strong>Assessment:</strong> the six practice questions for this phase are in the &ldquo;Isovolumetric
          Relaxation Assessment&rdquo; entry of the quiz selector underneath this page.
        </Para>
      </Section>

      <Section id="passive-filling" title="Phase 4 · Passive Ventricular Filling">
        <Para>
          The pressure on the blood in the ventricular chambers decreases as the ventricular walls continue to
          relax. When the ventricular pressures fall below the atrial pressures, it forces the atrioventricular
          valves to open. Initially, blood in the atria rapidly enters the ventricles. Filling slows as blood from
          the heart&rsquo;s large veins flows into the ventricles after passing through the atria.
        </Para>
        <Callout title="Procedure">
          Click the passive ventricular filling button to view a scan of this phase and the associated heart
          actions.
        </Callout>
        <Activity
          label="Passive ventricular filling scan"
          note="Click the passive ventricular filling button inside the activity to scan this phase."
          file="phase-analysis.html"
        />
        <Para>
          <strong>Assessment:</strong> the six practice questions for this phase are in the &ldquo;Passive
          Ventricular Filling Assessment&rdquo; entry of the quiz selector underneath this page.
        </Para>
      </Section>

      <Section id="atrial-systole" title="Phase 5 · Atrial Systole (Active Ventricular Filling)">
        <Para>
          The previous phase nearly fills the ventricles with blood. To complete the filling process, the atria
          contract to actively inject additional blood into the ventricles just before they contract.
        </Para>
        <Callout title="Procedure">
          Click the atrial systole button to view a scan of this phase and the associated heart actions.
        </Callout>
        <Activity
          label="Atrial systole scan"
          note="Click the atrial systole button inside the activity to scan this phase."
          file="phase-analysis.html"
        />
        <Para>
          <strong>Assessment:</strong> the five practice questions for this phase are folded into the general quiz
          underneath this page, together with the foundations and the Wiggers diagram questions.
        </Para>
      </Section>
      <Section id="assessments" title="Assessments">
        <Para>
          Two kinds of assessment are attached to this simulation, and only one quiz is ever on screen at a time:
        </Para>
        <BulletList
          items={[
            <>
              <strong>General quiz</strong> — 21 questions covering the foundations, the Wiggers diagram, and
              atrial systole. It loads directly underneath this page and you answer it one question at a time.
            </>,
            <>
              <strong>Phase assessments</strong> — four quizzes of six questions each (isovolumetric contraction,
              ventricular ejection, isovolumetric relaxation, and passive ventricular filling) listed in the
              &ldquo;Other quizzes&rdquo; selector underneath this page. Choose one and press Take Quiz to open it
              in monitored full screen; the others stay closed until you select them.
            </>,
          ]}
        />
        <Callout title="Suggested order">
          Read a phase, run its scan activity, then open that phase&apos;s assessment — the questions follow the
          same order as the events above.
        </Callout>
      </Section>
    </SimulationShell>
  );
}
