"use client";

import { useEffect, useState } from "react";

export default function MyReadmePage() {
  const [readmeContent, setReadmeContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const folder = localStorage.getItem("projectFolder");
    console.log("Retrieved folder from localStorage:", folder);
    
    if (!folder) {
      setError("No project folder found. Please go back and submit a GitHub link first.");
      setLoading(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 20;

    const checkReadme = async () => {
      try {
        console.log(`Attempt ${attempts + 1}: Checking for README in folder: ${folder}`);
        
        const res = await fetch(`/api/check-readme?folder=${encodeURIComponent(folder)}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const { exists, error: apiError } = await res.json();
        console.log("Check README response:", { exists, apiError });

        if (apiError) {
          throw new Error(apiError);
        }

        if (exists) {
          console.log("README exists, fetching content...");
          const readmeRes = await fetch(`/api/get-readme?folder=${encodeURIComponent(folder)}`);
          
          if (!readmeRes.ok) {
            throw new Error(`Failed to fetch README: ${readmeRes.status}`);
          }
          
          const { content, error: contentError } = await readmeRes.json();
          
          if (contentError) {
            throw new Error(contentError);
          }
          
          console.log("README content fetched successfully");
          setReadmeContent(content);
          setLoading(false);
          return true; // Stop polling
        } else {
          attempts++;
          console.log(`README not ready yet. Attempt ${attempts}/${maxAttempts}`);
          
          if (attempts >= maxAttempts) {
            setError("❌ Timed out while waiting for README generation. Please try again.");
            setLoading(false);
            return true; // Stop polling
          }
          return false; // Continue polling
        }
      } catch (err) {
        console.error("Error checking README:", err);
        setError(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
        setLoading(false);
        return true; // Stop polling on error
      }
    };

    // Initial check
    checkReadme().then(shouldStop => {
      if (shouldStop) return;
      
      // Start polling if initial check didn't find the file
      const interval = setInterval(async () => {
        const shouldStop = await checkReadme();
        if (shouldStop) {
          clearInterval(interval);
        }
      }, 2000);

      // Cleanup function
      return () => {
        console.log("Cleaning up interval");
        clearInterval(interval);
      };
    });

  }, []);

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">📘 Your Generated README</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go Back
        </button>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">📘 Your Generated README</h1>
      {loading ? (
        <div>
          <p>⏳ Please wait while we generate your README...</p>
          <div className="mt-2 text-sm text-gray-600">
            This may take a few moments. The page will automatically update when ready.
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(readmeContent);
                alert('README copied to clipboard!');
              }}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              📋 Copy to Clipboard
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Generate Another
            </button>
          </div>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap border">
            {readmeContent}
          </pre>
        </div>
      )}
    </main>
  );
}