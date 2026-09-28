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
  title: "Hb-O₂ Saturation Part 1: Oxygen & Hemoglobin | MedLab Virtual",
  description:
    "Learn how oxygen enters the circulatory system, the structure of hemoglobin, and how partial pressure drives oxygen binding.",
};

export default function HemoglobinSaturationPart1Page() {
  return (
    <PartShell
      number="1"
      title="Structure and Functions of Oxygen and Hemoglobin"
      subtitle="O₂ transport · hemoglobin structure · partial pressure"
      blurb="Explore the fundamental relationship between oxygen molecules and hemoglobin. Learn how oxygen enters the circulatory system, the structure of hemoglobin molecules, and why oxygen is essential for cellular energy production."
    >
      <Figure
        file="rbc-hb-o2.png"
        alt="Oxygen molecules bound to hemoglobin inside a red blood cell"
        caption="Oxygen bound to hemoglobin inside a red blood cell"
        maxWidth={640}
      />

      <Section title="Structure and Function of Oxygen Molecules">
        <Para>
          Oxygen molecules (O<sub>2</sub>) inhaled from the atmosphere are transported to tissue cells by
          the bloodstream, where they are used to convert the energy in food into a more readily accessible
          form of energy.
        </Para>
        <Figure
          file="heart-and-circulation.gif"
          alt="Animation of the heart and circulation"
          caption="The heart and circulatory system deliver oxygen to every tissue"
          maxWidth={480}
        />
        <Para>
          A diffusion gradient between the lung alveoli and nearby capillaries enables the first step in
          transporting O<sub>2</sub> to the tissues. The partial pressure of O<sub>2</sub> in the alveoli
          (pO<sub>2</sub>) at sea level is approximately 100 mmHg, while it is about 40 mmHg in the blood
          entering the lung capillaries from the tissues. The O<sub>2</sub> molecules move along the
          gradient, from the lungs to the capillaries.
        </Para>

        <SubSection title="Gas Exchange Between the Lung Alveoli and Capillaries">
          <Activity
            label="Alveolar gas exchange"
            file="respiratory-membrane-gas-exchange.html"
            note="Observe oxygen moving down its pressure gradient from the alveoli into pulmonary capillary blood."
          />
          <Para>
            After diffusing from the lungs into the surrounding capillaries, oxygen molecules (O
            <sub>2</sub>) are transported to the heart through the pulmonary veins. The heart&apos;s left
            ventricle pumps this oxygen-rich blood into a network of arteries, arterioles, and capillaries,
            which carry it to the tissues.
          </Para>
          <Para>
            The pO<sub>2</sub> of blood entering the tissue capillaries from the lungs is approximately
            100 mmHg, and in the surrounding tissue cells, it is approximately 40 mmHg. The pressure
            difference causes O<sub>2</sub> molecules to enter the cells, where they enter organelles known
            as mitochondria.
          </Para>
        </SubSection>

        <SubSection title="Gas Exchange Between the Capillaries and Tissue Cells">
          <Activity
            label="Tissue gas exchange"
            file="tissue-gas-exchange.html"
            note="Follow oxygen from systemic capillaries into cells for mitochondrial ATP production."
          />
        </SubSection>

        <SubSection title="The Role of Oxygen in the Production of Cellular Energy">
          <Para>
            The mitochondria of cells utilize oxygen to transfer energy from nutrient molecules to ATP
            (adenosine triphosphate) through a series of reactions known as aerobic respiration. Water and
            carbon dioxide (CO<sub>2</sub>) are produced as by-products of the reaction. The energy stored
            in ATP powers various chemical reactions necessary for normal cell function.
          </Para>
          <Figure
            file="role-of-oxygen.png"
            alt="Diagram of aerobic respiration producing ATP in the mitochondrion"
            caption="Aerobic respiration: mitochondria use oxygen to produce ATP"
            maxWidth={460}
          />
          <Para>
            Without oxygen, cells can resort to anaerobic respiration. However, this chemical process is
            less efficient and generates significantly less ATP. Therefore, a lack of oxygen can lead to
            cellular dysfunction and cell death.
          </Para>
        </SubSection>
      </Section>

      <Section title="Structure and Function of Hemoglobin Molecules">
        <Para>
          Only a small percentage (1% to 2%) of O<sub>2</sub> molecules are carried in the blood plasma as
          they are nonpolar and do not dissolve easily in water, the primary component of plasma. Instead,
          most O<sub>2</sub> molecules (98% to 99%) travel through the bloodstream reversibly bound to the
          270 to 300 million hemoglobin molecules found in each red blood cell (erythrocyte).
        </Para>
        <Figure
          file="hemoglobin.png"
          alt="Structure of a hemoglobin molecule with four subunits"
          caption="A hemoglobin molecule: two alpha and two beta subunits, each with an iron-containing heme group"
          maxWidth={480}
        />
        <Para>
          A hemoglobin (Hb) molecule is a highly folded protein consisting of two alpha and two beta
          subunits. Within each subunit is a central heme group containing iron, which can bind one oxygen
          molecule. Therefore, each hemoglobin molecule can bind up to four oxygen molecules.
        </Para>
      </Section>

      <Section title="Primary Factor Affecting Oxygen Binding to Hemoglobin">
        <Para>
          The primary factor affecting hemoglobin&apos;s ability to bind with oxygen (O₂) molecules is the
          partial pressure of oxygen in the blood plasma (pO₂). In turn, the plasma pO₂ is influenced by
          the amount of O₂ present in the inhaled air and the rate of oxygen consumption by tissues.
        </Para>

        <SubSection title="Atmospheric pO₂">
          <Para>
            The atmospheric air is a mixture of gases, primarily consisting of nitrogen (~78%) and oxygen
            (~21%). At sea level, the total atmospheric pressure is about 760 mmHg, and the partial
            pressure of oxygen (pO₂) is roughly 160 mmHg.
          </Para>
          <Callout title="Key equation">
            <p className="font-semibold text-slate-800">
              Atmospheric pO₂ = 760 mmHg × 0.21 ≈ 160 mmHg
            </p>
          </Callout>
        </SubSection>

        <SubSection title="Lung (Alveolar) pO₂">
          <Para>
            While the atmospheric pO₂ is approximately 160 mmHg, the pO₂ in the alveoli is typically around
            100 mmHg. This difference results from several factors:
          </Para>
          <BulletList
            items={[
              <>Inhaled air is humidified in the respiratory tract, reducing its oxygen concentration.</>,
              <>It then mixes with residual air remaining in the lungs from the previous exhalation, which has a lower pO₂.</>,
              <>Finally, oxygen diffuses into the surrounding capillary blood, further reducing alveolar pO₂.</>,
            ]}
          />
        </SubSection>

        <SubSection title="Arterial pO₂">
          <Para>
            The gases dissolved in arterial blood plasma (O<sub>2</sub>, CO<sub>2</sub>, and N
            <sub>2</sub>) each exert a partial pressure. The arterial partial pressure of oxygen (PaO₂)
            represents the pressure exerted by dissolved oxygen molecules in the blood plasma, and it is
            the primary factor determining how effectively O<sub>2</sub> binds to hemoglobin.
          </Para>
          <Para>
            A higher PaO₂ drives more O<sub>2</sub> to bind with hemoglobin, increasing hemoglobin&apos;s
            O<sub>2</sub> saturation. In contrast, lower PaO₂ drives less O<sub>2</sub> to bind with
            hemoglobin, lowering hemoglobin&apos;s O<sub>2</sub> saturation.
          </Para>
        </SubSection>
      </Section>

      <Section title="Assessment">
        <Para>
          Use the activities above to explore each concept, then answer the 14-question assessment that
          follows below. Questions are graded automatically and the Human Bio Media model answer is shown
          after you submit.
        </Para>
      </Section>
    </PartShell>
  );
}


