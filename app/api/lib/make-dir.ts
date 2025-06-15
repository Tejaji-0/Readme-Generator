import path from "path";
import fs from "fs";



// STEP: 1 -> get the location of this proj folder (README_GENERATOR)
const tempDir = path.join(process.cwd(), "temp");
/**
 * process.cwd() returns the root of your project.
Example: /Users/lakshit/my-readme-generator

path.join(process.cwd(), 'temp') becomes:
➜ /Users/lakshit/my-readme-generator/temp

So, tempDir = path to the folder where you will store all cloned repos.
 */



// STEP: 2 -> Extract repo name from the link
const extractRepoName = (url: string): string => {
  const parts = url.split("/");
  return parts[parts.length - 1].replace(".git", "");
};



// STEP: 3 -> join both above results to form the fina; location to store cloned repo
export const prepareClonePath = (repoUrl: string): string => {
  const repoName = extractRepoName(repoUrl);
  const repoPath = path.join(tempDir, repoName);

  // Make sure /temp exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  // Clear old clone if it exists
  if (fs.existsSync(repoPath)) {
    fs.rmSync(repoPath, { recursive: true, force: true });
  }

  return repoPath;
};
