import express, { Request, Response, NextFunction } from "express";
import { prepareClonePath } from "../utils/make-dir";
import { cloneRepo } from "../utils/clone-repo";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import util from "util";
import { readFile } from "fs/promises";

const router = express.Router();
const execPromise = util.promisify(exec);

// POST /api/generate-readme
router.post(
  "/generate-readme",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { githubLink } = req.body;
      if (!githubLink) {
        res.status(400).json({ error: "Github link is required" });
        return;
      }

      // this will make the directory. function is called.
      const finalDestination = prepareClonePath(githubLink);

      //cloning the repo
      await cloneRepo(githubLink, finalDestination);

      // 📌 Call the Python agent - updated path to ../python
      const pythonScriptPath = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "python",
        "agents_groq.py"
      );
      const venvPython = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "python",
        "venv",
        "bin",
        "python"
      );
      const { stdout } = await execPromise(
        `${venvPython} ${pythonScriptPath} ${finalDestination}`
      );

      const readmePath = path.join(finalDestination, "readme.md");

      // You can return the summary here or pass it to GPT for README gen
      res.json({ readme: stdout.trim(), path: readmePath });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Cloning failed" });
    }
  }
);

// GET /api/check-readme
router.get("/check-readme", (req: Request, res: Response): void => {
  const folder = req.query.folder as string;

  if (!folder) {
    res.status(400).json({ error: "Missing folder name" });
    return;
  }

  const readmePath = path.join(
    __dirname,
    "..",
    "..",
    "temp",
    folder,
    "readme.md"
  );
  const exists = fs.existsSync(readmePath);

  res.json({ exists });
});

// GET /api/get-readme
router.get("/get-readme", (req: Request, res: Response): void => {
  const folder = req.query.folder as string;

  if (!folder) {
    res.status(400).json({ error: "Missing folder name" });
    return;
  }

  const readmePath = path.join(
    __dirname,
    "..",
    "..",
    "temp",
    folder,
    "readme.md"
  );

  try {
    const content = fs.readFileSync(readmePath, "utf-8");
    res.json({ content });
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

// GET /api/get-readme/:folder
router.get(
  "/get-readme/:folder",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const folder = req.params.folder;
      const readmePath = path.join(
        __dirname,
        "..",
        "..",
        "temp",
        folder,
        "README.md"
      );

      const content = await readFile(readmePath, "utf-8");

      res.json({ readme: content });
    } catch (error) {
      console.error("README not found:", error);
      res.status(404).json({ error: "README not found" });
    }
  }
);

export default router;
