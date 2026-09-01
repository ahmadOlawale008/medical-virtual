import DisciplineComingSoon from "../ui/discipline-coming-soon";

export default function AnatomyPage() {
  return (
    <DisciplineComingSoon
      discipline="Anatomy"
      description="Explore body structures through labeled, interactive anatomical models."
      plannedLabs={["Gross anatomy", "Neuroanatomy", "Histology"]}
    />
  );
}
