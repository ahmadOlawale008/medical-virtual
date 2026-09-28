import type { Metadata } from "next";
import LegalPage, { LegalSection } from "../legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | MedLab Virtual",
  description: "How MedLab Virtual handles student account and learning data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      label="MEDLAB VIRTUAL · LEGAL"
      title="Privacy Policy"
      intro="This policy explains what MedLab Virtual collects when students create an account, use laboratory simulations, and answer questions."
    >
      <LegalSection title="Information we collect">
        <p>When you register, we may collect your name, email address, authentication provider, and account identifiers. When you use learning activities, we may store answers, scores, progress, and timestamps associated with your account.</p>
      </LegalSection>
      <LegalSection title="How we use information">
        <p>We use this information to authenticate students, protect student and administrator areas, save learning progress, calculate results, and improve the educational experience. We do not sell student information.</p>
      </LegalSection>
      <LegalSection title="Google sign-in">
        <p>If you choose Google sign-in, Google provides us with the basic profile information permitted by your account settings, such as your name, email address, and unique account identifier. We do not request access to Google Drive, Gmail, Calendar, or other unrelated Google services.</p>
      </LegalSection>
      <LegalSection title="Storage and service providers">
        <p>Account and learning data is stored using Supabase, which provides authentication and database infrastructure. Embedded third-party learning activities may load content from their original providers. Those providers may process technical information according to their own policies.</p>
      </LegalSection>
      <LegalSection title="Your choices and requests">
        <p>You may stop using your account at any time. To request correction or deletion of your account and associated learning data, contact the person or institution administering your MedLab Virtual deployment.</p>
      </LegalSection>
      <LegalSection title="Children and students">
        <p>MedLab Virtual is an educational tool. Institutions or instructors should ensure that its use, including student accounts, follows applicable school and privacy requirements. Do not submit sensitive medical information about yourself or another person.</p>
      </LegalSection>
      <LegalSection title="Changes to this policy">
        <p>We may update this policy as the application develops. The latest version will remain available at this page and will show its update date.</p>
      </LegalSection>
    </LegalPage>
  );
}
