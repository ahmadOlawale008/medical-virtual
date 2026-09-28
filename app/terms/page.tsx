import type { Metadata } from "next";
import LegalPage, { LegalSection } from "../legal-page";

export const metadata: Metadata = {
  title: "Terms of Service | MedLab Virtual",
  description: "Terms for using MedLab Virtual educational simulations.",
};

export default function TermsPage() {
  return (
    <LegalPage
      label="MEDLAB VIRTUAL · LEGAL"
      title="Terms of Service"
      intro="These terms describe the basic conditions for using MedLab Virtual’s educational simulations, student accounts, and question activities."
    >
      <LegalSection title="Educational purpose">
        <p>MedLab Virtual provides educational simulations and study tools. It is not medical advice, a diagnostic service, or a replacement for qualified teaching or clinical care.</p>
      </LegalSection>
      <LegalSection title="Accounts">
        <p>You are responsible for providing accurate account information, keeping your password private, and notifying the administrator if you believe your account has been accessed without permission. One person should use each student account.</p>
      </LegalSection>
      <LegalSection title="Acceptable use">
        <p>You agree not to misuse the service, attempt to bypass access controls, impersonate another user, interfere with the application, scrape private student data, or upload harmful code or content.</p>
      </LegalSection>
      <LegalSection title="Learning content and results">
        <p>Simulation results are intended for learning and may be simplified models. Question answers, scores, and progress should be used as study feedback and not as formal academic results unless an instructor adopts them for that purpose.</p>
      </LegalSection>
      <LegalSection title="Third-party services">
        <p>The application may use services such as Supabase for authentication and storage, Google for optional sign-in, and embedded educational activities hosted by other providers. Their availability and terms may change independently of MedLab Virtual.</p>
      </LegalSection>
      <LegalSection title="Availability and changes">
        <p>We may update, suspend, or remove features as the application develops. We do not guarantee that every simulation will always be available or error-free.</p>
      </LegalSection>
      <LegalSection title="Contact and questions">
        <p>For account, privacy, or content questions, contact the person or institution administering your MedLab Virtual deployment.</p>
      </LegalSection>
    </LegalPage>
  );
}
