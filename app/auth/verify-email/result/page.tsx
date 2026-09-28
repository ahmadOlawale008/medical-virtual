import Link from "next/link";

type VerifyResultPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function VerifyResultPage({
  searchParams,
}: VerifyResultPageProps) {
  const { status } = await searchParams;
  const verified = status === "success";
  const missingCode = status === "missing-code";

  const title = verified
    ? "Email verified"
    : missingCode
      ? "Verification link is incomplete"
      : "Verification link expired";

  const message = verified
    ? "Your email has been confirmed. You can now sign in to MedLab Virtual."
    : missingCode
      ? "The confirmation link does not contain a verification code. Please request a new email."
      : "This confirmation link may have already been used or expired. Please request a new email.";

  return (
    <main
      className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0d302d] bg-cover bg-center px-4 py-10 text-white"
      style={{ backgroundImage: "url('/assets/images/graduates.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#061b19]/75" />
      <section className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-[#092521]/90 p-8 text-center shadow-2xl backdrop-blur-md sm:p-10">
        <p className="text-2xl font-semibold text-[#79c8bc]">MedLab Virtual</p>
        <div
          className={`mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${verified ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300"}`}
          aria-hidden="true"
        >
          {verified ? "✓" : "!"}
        </div>
        <h1 className="mt-6 text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-white/65">{message}</p>
        <Link
          href="/auth/login"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#19a878] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#159468]"
        >
          {verified ? "Continue to sign in" : "Back to sign in"}
        </Link>
        <Link
          href="/"
          className="mt-4 inline-block text-xs text-white/55 underline underline-offset-4 transition hover:text-white"
        >
          Go to MedLab home
        </Link>
      </section>
    </main>
  );
}
