import { Eye } from "lucide-react";

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

      {/* Demo Img */}
    </div>
  );
}
