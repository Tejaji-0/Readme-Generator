"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface MyReadmeComponentProps {
  onBackToHome: () => void;
}

export default function MyReadmeComponent({
  onBackToHome,
}: MyReadmeComponentProps) {
  const [readmeContent, setReadmeContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [projectFolder, setProjectFolder] = useState<string | null>(null);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20; // 20x2s = 40s max

    const checkForReadme = async (folder: string) => {
      const res = await fetch(`/api/check-readme?folder=${folder}`);
      const { exists } = await res.json();

      if (exists) {
        const readmeRes = await fetch(`/api/get-readme?folder=${folder}`);
        const { content } = await readmeRes.json();
        setReadmeContent(content);
        setLoading(false);
        return true;
      }
      return false;
    };

    const interval = setInterval(async () => {
      // First check if we have a folder name
      const folder = localStorage.getItem("projectFolder");

      if (folder && folder !== projectFolder) {
        setProjectFolder(folder);
        console.log("Found folder name:", folder);
      }

      if (folder) {
        // If we have a folder, check for README
        const found = await checkForReadme(folder);
        if (found) {
          clearInterval(interval);
          return;
        }
      }

      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setLoading(false);
        setReadmeContent("❌ Timed out while waiting for README generation.");
      }
    }, 2000); // poll every 2s

    return () => clearInterval(interval);
  }, [projectFolder]);

  return (
    <main className="p-6">
      <div className="mb-6">
        <Button
          onClick={onBackToHome}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-4">📘 Your Generated README</h1>
      {loading ? (
        <div className="space-y-2">
          <p>⏳ Please wait while we generate your README...</p>
          {projectFolder && (
            <p className="text-gray-600">Processing: {projectFolder}</p>
          )}
        </div>
      ) : (
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
          {readmeContent}
        </pre>
      )}
    </main>
  );
}
