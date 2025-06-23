import { Eye } from "lucide-react";
import Image from "next/image";
import { MovingBorder } from "@/components/ui/moving-border";

export default function DemoSection() {
  return (
    <div className="py-16 mt-16">
      <section className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center text-rose-500 h-12 w-12 rounded-xl m-auto bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200/50 shadow-sm">
          <Eye className="h-6 w-6" />
        </div>
        <div className="text-center mt-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            <span className="relative inline-block">
              From <span className="text-rose-400/50"> messy codebases </span>to{" "}
              <span className="text-rose-500"> crisp docs</span>
            </span>
            <span className="block mt-2">watch Readme.ai do its magic.</span>
          </h1>
        </div>
      </section>

      {/* Demo Img with Moving Border */}
      <div className="flex items-center justify-center mt-16">
        <div
          className="relative w-[80%] shadow-2xl shadow-rose-900/70 overflow-hidden p-[2px]"
          style={{ borderRadius: "1rem" }}
        >
          {/* Moving Border Effect */}
          <div className="absolute inset-0" style={{ borderRadius: "1rem" }}>
            <MovingBorder duration={8000} rx="1rem" ry="1rem">
              <div className="h-36 w-36 bg-[radial-gradient(#e11d48_30%,#f43f5e_50%,#fda4af_70%,transparent_95%)] opacity-90 blur-md" />
            </MovingBorder>
          </div>

          {/* Image with Glass Effect */}
          <div
            className="relative flex items-center justify-center bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20"
            style={{ borderRadius: "calc(1rem * 0.96)" }}
          >
            <Image
              src="/demo-2.png"
              alt="Demo"
              width={1000}
              height={1000}
              className="h-full w-full rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
