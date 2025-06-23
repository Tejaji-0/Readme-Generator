"use client";

import { Sparkles, Link as LinkIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "@/lib/config";

interface HeroSectionProps {
  onGenerateClick: () => void;
}

export default function HeroSection({ onGenerateClick }: HeroSectionProps) {
  const [githubLink, setGithubLink] = useState("");

  function checkGithubLink(link: string) {
    const pattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+(?:\/)?$/;
    return pattern.test(link);
  }

  const handleSubmit = () => {
    if (!checkGithubLink(githubLink)) {
      toast.error("Enter a valid Github Repo link");
      return;
    }

    // Switch to README view immediately
    onGenerateClick();

    localStorage.removeItem("projectFolder");

    // Show loading toast
    const loadingToast = toast.loading(
      "Generating README... This may take a few minutes for larger repositories."
    );

    axios
      .post(
        `${API_BASE_URL}/api/generate-readme`,
        { githubLink },
        {
          timeout: 300000, // 5 minutes timeout for larger repositories
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.dismiss(loadingToast);
        toast.success("README generated successfully!");
        const fullPath = res.data.path;
        const folderName = fullPath.split("/temp/")[1].split("/readme.md")[0];
        localStorage.setItem("githubLink", githubLink);
        localStorage.setItem("projectFolder", folderName);
        console.log("Stored folder name:", folderName);
      })
      .catch((error) => {
        toast.dismiss(loadingToast);
        console.error("Error generating README:", error);
        if (
          error.code === "ECONNABORTED" ||
          error.message.includes("timeout")
        ) {
          toast.error(
            "Request timed out. Large repositories may take longer to process. Please try again."
          );
        } else if (error.code === "ERR_NETWORK") {
          toast.error(
            "Network error. Please ensure the backend server is running and try again."
          );
        } else {
          toast.error(
            "Failed to generate README. Please check your repository link and try again."
          );
        }
      });
  };

  return (
    <div className="text-center">
      {/* Badge */}
      <div
        className="relative inline-flex items-center px-6 py-2.5 rounded-full 
        bg-gradient-to-r from-rose-100 via-pink-100 to-indigo-100 
        bg-[length:200%_200%] animate-[gradientMove_8s_ease_infinite] 
        text-rose-600 shadow-md overflow-hidden border border-white/30 
        backdrop-blur-sm"
      >
        <Sparkles className="h-5 w-5 text-rose-500 animate-[pingSlow_2s_infinite]" />
        <span className="ml-2 text-base font-medium bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          Powered by AI
        </span>

        {/* Shine effect */}
        <div
          className="absolute top-0 left-0 w-1/2 h-full 
          bg-gradient-to-r from-transparent via-white/40 to-transparent 
          skew-x-[-20deg] animate-[shine_2s_infinite] pointer-events-none"
        ></div>
      </div>

      {/* Heading */}
      <div className="mt-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-center">
          <span className="relative inline-block">
            The Fastest Way to{" "}
            <span className="relative inline-block">
              <span className="relative z-10 px-2">Professional</span>
              <span
                className="absolute inset-0 bg-rose-100/50 -rotate-2 rounded-lg transform -skew-y-1"
                aria-hidden="true"
              ></span>
            </span>
          </span>
          <span className="block mt-2 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            README
          </span>
        </h1>

        <h2 className="text-xl font-medium sm:text-[21px] mt-4 text-gray-500 max-w-2xl mx-auto">
          Automatically generate professional READMEs from your codebase.
        </h2>
      </div>

      {/* Link Input */}
      <div className="mt-10 flex items-center justify-center max-w-xl mx-auto px-4">
        <div className="relative w-full group ">
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rose-400" />
            <Input
              value={githubLink}
              onChange={(e) => {
                setGithubLink(e.target.value);
              }}
              type="link"
              placeholder="https://github.com/username/repo"
              className="w-full h-14 pl-12 pr-40 text-base rounded-xl border-2 border-rose-200/50 
              focus:border-rose-300 transition-all duration-200
              placeholder:text-gray-400 hover:border-rose-200
              focus:bg-rose-50/50 focus:ring-2 focus:ring-rose-100 focus:shadow-lg focus:shadow-rose-100"
            />

            <Button
              onClick={handleSubmit}
              type="submit"
              variant="outline"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-6 py-2.5 rounded-lg text-base
              bg-gradient-to-r from-rose-100 to-pink-100 
              text-rose-600 hover:text-rose-600 font-medium transition-all duration-200
              border border-rose-200/50 
              hover:bg-rose-50 hover:border-rose-500
              active:bg-rose-100
              cursor-pointer

              "
            >
              Generate →
            </Button>
            <Toaster position="top-center" />
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-sm text-gray-500 mt-4">
        <h3>⚠️ AI can make mistakes. Verify before using.</h3>
      </div>
    </div>
  );
}
