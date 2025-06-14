import DemoSection from "@/components/Landing-page-components/DemoSection";
import HeroSection from "@/components/Landing-page-components/HeroSection";
import HowItWorks from "@/components/Landing-page-components/HowItWorks";
import CTA from "@/components/Landing-page-components/CTA";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <DemoSection />
      <HowItWorks />
      <CTA />
    </div>
  );
}
