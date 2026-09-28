import Link from "next/link";
import LoginForm from "./login-form";
import GoogleButton from "@/components/googleButton/googleButton.component";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0d302d] bg-cover bg-center px-4 py-10 text-white" style={{ backgroundImage: "url('/assets/images/graduates.jpg')" }}>
      <div className="absolute inset-0 bg-[#061b19]/75" />
      <Link href="/" className="absolute left-5 top-5 z-10 rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur-sm transition hover:bg-black/35 hover:text-white">
        ← Go to MedLab home
      </Link>
      <section className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-[#092521]/90 p-6 shadow-2xl backdrop-blur-md sm:p-8">
        <p className="text-2xl flex items-center justify-center font-semibold text-[#79c8bc]">
          Medlab Virtual
        </p>
        <h1 className="mt-3 text-2xl font-semibold">Student sign in</h1>
        <p className="mt-2 text-sm text-white/55">
          Sign in to access your questions and saved answers.
        </p>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-white/50">
          New student?{" "}
          <Link href="/auth/signup" className="text-[#8de0ce] underline underline-offset-4">
            Create an account
          </Link>
        </p>
        <div className="mt-7">
          <div className="my-5 flex items-center gap-3 text-[10px] tracking-[.14em] text-white/35">
            <span className="h-px flex-1 bg-white/10" />
            <span>Or use email</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <GoogleButton />
        </div>
      </section>

    </main>
  );
}
