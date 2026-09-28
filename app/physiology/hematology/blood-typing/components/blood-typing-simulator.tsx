"use client";

import Image from "next/image";
import { useState } from "react";

type Section = "background" | "subjects" | "procedure" | "results";

const activityRoot = "https://humanbiomedia.org/simulations/circulatory-system/blood-typing";
const artworkRoot = "/physiology/blood-typing";
const steps = [
  { title: "Prepare a slide", file: "label-slide-simulation.html", instruction: "Divide the slide into three sections and label them A, B, and D." },
  { title: "Lance a finger", file: "lance-finger.html", instruction: "Clean the fingertip, use the sterile lancet, and obtain a well-formed blood drop." },
  { title: "Transfer blood", file: "place-blood-simulation.html", instruction: "Place equal blood drops in the A, B, and D test areas." },
  { title: "Add antisera", file: "add-antisera-simulation.html", instruction: "Add anti-A, anti-B, and anti-D serum to their corresponding samples." },
  { title: "Mix samples", file: "mix-samples-simulation.html", instruction: "Use separate applicators to mix each blood and antiserum sample." },
  { title: "Use viewing box", file: "viewing-box.html", instruction: "Place the slide on the heated viewing box and gently rock it." },
] as const;

type Illustration = { src: string; alt: string; width: number; height: number; caption?: string };

type BackgroundSection = {
  kicker: string;
  title: string;
  paragraphs: string[];
  list?: string[];
  artwork?: Illustration[];
};

/** Human Bio Media background information (CC BY 4.0), condensed for the reference tab. */
const backgroundSections: BackgroundSection[] = [
  {
    kicker: "OVERVIEW",
    title: "Blood typing identifies surface antigens",
    paragraphs: [
      "The blood typing test determines which surface antigens are present on an individual’s erythrocytes (RBCs). Researchers have identified more than 50 RBC surface antigens — carbohydrates or proteins known by names such as ABO, Rh, Kell, Duffy, Kidd, and Lewis.",
      "The ABO and Rh blood groups are the clinically significant ones, because they may cause the most harm if incompatible blood is transfused into a recipient.",
    ],
  },
  {
    kicker: "ABO BLOOD GROUP",
    title: "ABO blood group antigens",
    paragraphs: [
      "Although the ABO blood group name consists of three letters, only two antigens are involved, called A and B. The antigen(s) that appear on the surface of an individual’s RBCs determine their ABO blood type.",
    ],
    list: [
      "Type A: A antigen only.",
      "Type B: B antigen only.",
      "Type AB: both A and B antigens.",
      "Type O: neither A nor B antigens.",
    ],
  },
  {
    kicker: "STRUCTURE",
    title: "ABO antigens structure",
    paragraphs: [
      "Both A and B surface antigens are oligosaccharides (short sugar chains) that differ in structure only at their terminal sugars. They are also classed as glycoproteins or glycolipids because they link to proteins or lipids in the RBC plasma membrane. A third ABO oligosaccharide, designated H, appears on all RBCs but has no terminal sugar and is not antigenic.",
    ],
    artwork: [
      { src: "abo-antigens-structure.png", alt: "Structures of A, B, and H oligosaccharides on the red blood cell surface", width: 1125, height: 1200, caption: "A, B, and H oligosaccharides anchored in the RBC membrane" },
    ],
  },
  {
    kicker: "INHERITANCE",
    title: "ABO blood group inheritance",
    paragraphs: [
      "A single gene (the ABO gene) controls an individual’s ABO blood type, and there are three alleles (or versions) of the gene: A, B, and O. An individual inherits an ABO allele from each parent, and the pair of alleles determines the blood type.",
      "The A and B alleles are codominant, so if both are present the RBCs express both antigens. The O allele is recessive — either the A or the B allele will dominate it.",
    ],
    artwork: [
      { src: "abo-inheritance-chart.png", alt: "Chart of possible ABO blood types from each parental pairing", width: 1125, height: 750, caption: "Possible offspring from each parental pairing" },
      { src: "groups-ethnicity.png", alt: "Table of ABO and Rh blood type frequencies in the United States", width: 1125, height: 963, caption: "ABO and Rh blood types in the United States" },
    ],
  },
  {
    kicker: "ANTIBODIES",
    title: "Anti-A and anti-B antibodies",
    paragraphs: [
      "The body makes antibodies to RBC surface antigens it considers foreign. For ABO blood group antigens, prior exposure to incompatible blood is not required — antibody generation occurs naturally.",
      "Blood type A individuals make anti-B antibodies, and blood type B individuals make anti-A antibodies. Type AB individuals make neither, while type O individuals — who lack A and B antigens — make both anti-A and anti-B.",
      "Production begins a few months after birth and peaks around 5 to 10 years of age. Anti-A and anti-B antibodies are of the IgM class with ten binding sites, so they cause rapid agglutination (clumping) when they encounter the opposing surface antigens.",
    ],
    artwork: [
      { src: "abo-antibodies-chart.png", alt: "Chart showing which ABO antibodies each blood type produces", width: 1125, height: 1350, caption: "Antibodies produced by each ABO blood type" },
      { src: "abo-agglutination.png", alt: "Anti-A antibodies cross-linking red blood cells in an agglutination reaction", width: 1125, height: 1100, caption: "Agglutination: antibodies cross-link red cells into clumps" },
    ],
  },
  {
    kicker: "RH BLOOD GROUP",
    title: "Rh antigen structure",
    paragraphs: [
      "Unlike the ABO antigens, Rh antigens are transmembrane proteins that coil and loop along the RBC plasma membrane. The arrangement of amino acids on the extracellular loops determines the Rh type. Fifty Rh antigens are now recognized, but the D antigen is the most clinically significant.",
    ],
    artwork: [
      { src: "structure-rh-antigen.png", alt: "Diagram of an Rh antigen protein spanning the red blood cell membrane", width: 1125, height: 1300, caption: "The Rh antigen is a transmembrane protein, not a sugar chain" },
    ],
  },
  {
    kicker: "INHERITANCE",
    title: "Rh antigen inheritance",
    paragraphs: [
      "The Rh+ allele is dominant over the Rh− allele, and about 85 percent of Americans are Rh-positive; the rest of the American population is Rh-negative.",
      "The Rh group is distinct from the ABO group, so any individual may have or lack the Rh antigen regardless of ABO type. A plus or minus is appended to the ABO type to denote the Rh group: A+ means group A with the Rh antigen present, while AB− means group AB without it.",
    ],
  },
  {
    kicker: "ANTIBODIES",
    title: "Anti-Rh antibodies",
    paragraphs: [
      "Antibodies to the Rh antigen are produced only in Rh-negative individuals after exposure to incompatible Rh+ blood. The antibodies produced are mostly of the IgG class, each having only two antigen-binding sites.",
      "Because anti-Rh (IgG) antibodies are much smaller than the ten-site anti-A and anti-B (IgM) antibodies, a positive Rh reaction takes longer and is less pronounced than ABO reactions on the slide.",
    ],
    artwork: [
      { src: "rh-agglutination.png", alt: "Anti-Rh antibodies binding red blood cells in an agglutination reaction", width: 1125, height: 1000, caption: "IgG anti-Rh antibodies cross-link Rh+ red cells" },
    ],
  },
  {
    kicker: "SENSITIZATION",
    title: "Rh sensitization and RhoGAM",
    paragraphs: [
      "Sensitization is exposure-activated antibody production. It most frequently happens with the birth of an Rh+ baby to an Rh− mother. Problems are rare in a first pregnancy because the baby’s Rh+ cells rarely cross the placenta, but the mother may become exposed during or immediately after birth — research shows this occurs in 13–14 percent of such pregnancies.",
      "After exposure, the mother’s immune system generates anti-Rh antibodies. If she conceives another Rh+ baby, the small IgG antibodies can cross the placenta and destroy fetal RBCs — hemolytic disease of the newborn (HDN), also called erythroblastosis fetalis, which may range from mild anemia to severe, life-threatening hemolysis.",
      "RhoGAM (Rh immune globulin) contains anti-Rh antibodies that destroy any fetal Rh+ erythrocytes crossing the placenta, temporarily preventing the mother from making her own Rh antibodies. It is given during weeks 26–28 of pregnancy and within 72 hours following birth. Since its introduction in 1968, HDN incidence in the United States has dropped from about 13–14 percent to about 0.1 percent.",
    ],
    artwork: [
      { src: "rh-sensitization.png", alt: "Illustration of Rh sensitization of an Rh-negative mother and how RhoGAM prevents hemolytic disease of the newborn", width: 1125, height: 1000, caption: "RhoGAM clears fetal Rh+ cells before sensitization occurs" },
    ],
  },
  {
    kicker: "TRANSFUSION",
    title: "Transfusion compatibility",
    paragraphs: [
      "It is best to transfuse only matching blood types. Type O red cells carry neither A nor B antigens, so the natural anti-A and anti-B antibodies in a recipient’s blood will not encounter any matching antigens on the donated cells, and agglutination will not occur — for this reason, individuals with type O blood are often called universal donors.",
      "There is a potential problem with the universal donor designation: if an Rh− recipient had prior exposure to the Rh antigen, antibodies for that antigen would likely be present and trigger some agglutination. Recipients with blood type AB+ are known as universal recipients — they can theoretically receive red cells of any blood type because they produce no anti-A, anti-B, or anti-Rh antibodies.",
    ],
  },
];

/** Interpretation of the agglutination patterns shown by the interactive activities. */
const reactionResults = [
  {
    name: "Husband",
    type: "O+",
    file: "husbands-results.html",
    frameTitle: "Husband's results",
    summary: "Clumping only with anti-D serum → ABO type O, Rh positive.",
    rows: [
      { serum: "Anti-A", agglutinated: false },
      { serum: "Anti-B", agglutinated: false },
      { serum: "Anti-D", agglutinated: true },
    ],
  },
  {
    name: "Wife",
    type: "A−",
    file: "wifes-results.html",
    frameTitle: "Wife's results",
    summary: "Clumping only with anti-A serum → ABO type A, Rh negative.",
    rows: [
      { serum: "Anti-A", agglutinated: true },
      { serum: "Anti-B", agglutinated: false },
      { serum: "Anti-D", agglutinated: false },
    ],
  },
];

function Frame({ file, title }: { file: string; title: string }) {
  return <div className="overflow-hidden rounded-2xl border border-white/10 bg-white"><div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-600"><span className="text-xs font-semibold">Interactive activity</span><span className="text-[10px] uppercase tracking-[.14em] text-slate-400">{title}</span></div><div className="overflow-auto"><iframe key={file} src={`${activityRoot}/${file}`} title={title} className="block h-[700px] min-w-[800px] w-full border-0" allow="autoplay" /></div></div>;
}

function Figure({ art }: { art: Illustration }) {
  return (
    <figure className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4" style={{width: "fit-content"}}>
      <Image src={`${artworkRoot}/${art.src}`} alt={art.alt} width={200} height={200} className="h-auto w-[200px]rounded-xl" />
      {art.caption && <figcaption className="mt-2 text-center text-xs leading-5 text-slate-500">{art.caption}</figcaption>}
    </figure>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`rounded-full px-4 py-2 text-xs font-semibold transition ${active ? "bg-[#48d2b2] text-[#092c29]" : "bg-white/7 text-white/55 hover:bg-white/12 hover:text-white"}`}>{children}</button>;
}

export default function BloodTypingSimulator() {
  const [section, setSection] = useState<Section>("background");
  const [step, setStep] = useState(0);

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#092521] shadow-2xl shadow-black/20">
      <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-4 sm:px-6">
        <Tab active={section === "background"} onClick={() => setSection("background")}>Background</Tab>
        <Tab active={section === "subjects"} onClick={() => setSection("subjects")}>Subjects</Tab>
        <Tab active={section === "procedure"} onClick={() => setSection("procedure")}>Procedure</Tab>
        <Tab active={section === "results"} onClick={() => setSection("results")}>Test results</Tab>
      </div>

      {section === "procedure" && (
        <div className="grid xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border-b border-white/10 p-4 xl:border-r xl:border-b-0 xl:p-5">
            <p className="text-[10px] font-semibold tracking-[.16em] text-[#79c8bc]">TEST PROCEDURE</p>
            <div className="mt-4 grid gap-1.5 sm:grid-cols-3 xl:grid-cols-1">
              {steps.map((item, index) => (
                <button key={item.file} type="button" onClick={() => setStep(index)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${step === index ? "bg-[#48d2b2] text-[#092c29]" : "text-white/58 hover:bg-white/7 hover:text-white"}`}>
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-black/10 text-[10px] font-bold">{index + 1}</span>
                  <span className="text-xs font-medium">{item.title}</span>
                </button>
              ))}
            </div>
          </aside>
          <div className="min-w-0 p-3 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[.14em] text-[#79c8bc]">STEP {step + 1} OF {steps.length}</p>
                <h2 className="mt-1 text-lg font-semibold">{steps[step].title}</h2>
              </div>
            </div>
            <p className="mb-3 text-sm leading-6 text-white/55">{steps[step].instruction}</p>
            <Frame file={steps[step].file} title={steps[step].title} />
          </div>
        </div>
      )}
      {section === "background" && (
        <div className="grid gap-5 p-5 lg:grid-cols-2 lg:p-7">
          {backgroundSections.map((item, index) => {
            const dark = index % 2 === 1;
            return (
              <article key={item.title} className={`rounded-2xl p-6 sm:p-8 ${dark ? "border border-white/10 bg-white/5 text-white/55" : "bg-[#f5f1e8] text-slate-700"}`}>
                <p className={`text-[10px] font-bold tracking-[.16em] ${dark ? "text-[#79c8bc]" : "text-emerald-700"}`}>{item.kicker}</p>
                <h2 className={`mt-3 text-2xl font-semibold ${dark ? "text-white" : "text-slate-900"}`}>{item.title}</h2>
                {item.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-sm leading-7">{paragraph}</p>)}
                {item.list && (
                  <ul className="mt-4 grid gap-2">
                    {item.list.map((entry) => (
                      <li key={entry} className="flex items-start gap-2 text-sm leading-6">
                        <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${dark ? "bg-[#48d2b2]" : "bg-emerald-600"}`} />
                        {entry}
                      </li>
                    ))}
                  </ul>
                )}
                {item.artwork && (
                  <div className={`mt-5 grid gap-4 ${item.artwork.length > 1 ? "sm:grid-cols-2" : ""}`}>
                    {item.artwork.map((art) => <Figure key={art.src} art={art} />)}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {section === "subjects" && (
        <div className="p-5 lg:p-7">
          <article className="mx-auto max-w-4xl rounded-2xl bg-[#f5f1e8] p-6 text-slate-700 sm:p-8">
            <p className="text-[10px] font-bold tracking-[.16em] text-emerald-700">SUBJECT INFORMATION</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Soon-to-be parents</h2>
            <p className="mt-4 text-sm leading-7">The subjects for this exercise are a husband and wife who are soon-to-be parents. The birth of the child will be the first for both parents.</p>
            <p className="mt-3 text-sm leading-7">The couple wants to determine whether their different blood types could cause any potential harm to the fetus or to future offspring.</p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <Image src={`${artworkRoot}/test_subjects_4.png`} alt="Blood typing lab test case subjects" width={1022} height={1022} className="h-auto w-full" />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold text-slate-400">SUBJECT 01</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Husband</p>
                <p className="mt-1 text-sm text-slate-500">Blood sample for ABO and Rh typing</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold text-slate-400">SUBJECT 02</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Wife</p>
                <p className="mt-1 text-sm text-slate-500">Pregnant · blood sample for ABO and Rh typing</p>
              </div>
            </div>
          </article>
        </div>
      )}
      {section === "results" && (
        <div className="grid gap-5 p-4 xl:grid-cols-2 xl:p-6">
          {reactionResults.map((subject) => (
            <div key={subject.name}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] tracking-[.14em] text-[#79c8bc]">{subject.name.toUpperCase()}</p>
                  <h2 className="mt-1 text-lg font-semibold">Agglutination result</h2>
                </div>
                <span className="rounded-full bg-[#48d2b2]/12 px-3 py-1 text-sm font-bold text-[#79e1ca]">{subject.type}</span>
              </div>
              <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="grid gap-2">
                  {subject.rows.map((row) => (
                    <div key={row.serum} className="flex items-center justify-between gap-3 rounded-xl bg-black/20 px-3 py-2">
                      <span className="text-xs font-semibold text-white/75">{row.serum} serum</span>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${row.agglutinated ? "bg-[#48d2b2]/15 text-[#79e1ca]" : "bg-white/10 text-white/50"}`}>
                        {row.agglutinated ? "Agglutination" : "No agglutination"}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-5 text-white/55">{subject.summary}</p>
              </div>
              <Frame file={subject.file} title={subject.frameTitle} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}



