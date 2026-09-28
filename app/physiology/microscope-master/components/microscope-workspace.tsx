"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Microscope3D = dynamic(
  () => import("./microscope-3d").then((module) => module.Microscope3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-dvh items-center justify-center bg-[#0b1c27] text-sm text-white/55">
        Preparing microscope…
      </div>
    ),
  },
);

export default function MicroscopeWorkspace() {
  const router = useRouter();
  return <Microscope3D onBack={() => router.push("/physiology")} />;
}
