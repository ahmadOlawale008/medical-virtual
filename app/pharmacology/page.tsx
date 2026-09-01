import DisciplineComingSoon from "../ui/discipline-coming-soon";

export default function PharmacologyPage() {
  return (
    <DisciplineComingSoon
      discipline="Pharmacology"
      description="Explore drug action through dose-response and pharmacokinetic simulations."
      plannedLabs={["PK / PD", "Dose response", "Drug interactions"]}
    />
  );
}
