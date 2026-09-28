import type { Metadata } from "next";
import MicroscopeWorkspace from "./components/microscope-workspace";

export const metadata: Metadata = {
  title: "Classic Student Microscope | MedLab Virtual",
  description: "Interactive classic student microscope with synchronized stage, focus, optics, illumination, objectives, and eyepiece view.",
};

export default function MicroscopeMasterPage() {
  return <MicroscopeWorkspace />;
}
