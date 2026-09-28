import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import AppToastContainer from "./toast-container";
import SimulationQuizPrompt from "./quiz/simulation-quiz-prompt";

export const metadata: Metadata = {
  title: "MedLab Virtual | Advanced Medical Sciences Laboratory",
  description:
    "A free interdisciplinary virtual laboratory for advanced anatomy, physiology, pharmacology, and pathophysiology learning.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {children}
        <SimulationQuizPrompt />
        <AppToastContainer />
      </body>
    </html>
  );
}
