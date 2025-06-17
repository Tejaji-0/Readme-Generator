"use client";

import { useState } from "react";
import DemoSection from "@/components/Landing-page-components/DemoSection";
import HeroSection from "@/components/Landing-page-components/HeroSection";
import HowItWorks from "@/components/Landing-page-components/HowItWorks";
import CTA from "@/components/Landing-page-components/CTA";
import MyReadmeComponent from "@/components/my-readme-page/MyReadmeComponent";

export default function Home() {
  const [showReadme, setShowReadme] = useState(false);

  const handleGenerateClick = () => {
    setShowReadme(true);
  };

  const handleBackToHome = () => {
    setShowReadme(false);
  };

  return (
    <div>
      {!showReadme ? (
        <div>
          <HeroSection onGenerateClick={handleGenerateClick} />
          <DemoSection />
          <HowItWorks />
          <CTA onGenerateClick={handleGenerateClick} />
        </div>
      ) : (
        <MyReadmeComponent onBackToHome={handleBackToHome} />
      )}
    </div>
  );
}
