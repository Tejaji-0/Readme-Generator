import { NextRequest, NextResponse } from "next/server";
import { prepareClonePath } from "../lib/make-dir";
import { cloneRepo } from "../lib/clone-repo";
import path from "path";
import { spawn } from "child_process";

export async function POST(req: NextRequest) {
  try {
    const { githubLink } = await req.json();
    if (!githubLink) {
      return NextResponse.json(
        { error: "Github link is required" },
        { status: 400 }
      );
    }

    // this will make the directory. function is called.
    const finalDestination = prepareClonePath(githubLink);

    //clonnig the repo
    await cloneRepo(githubLink, finalDestination);

    // Step 3: Call Python summarizer
    const summary = await runPythonSummarizer(finalDestination);

    console.log(summary);
    // You can return the summary here or pass it to GPT for README gen
    return NextResponse.json({ success: true, summary });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Cloning failed" },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({ success: true });
}

async function runPythonSummarizer(clonedPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(
      process.cwd(),
      "llm-summarizer",
      "summariser.py"
    );

    const pythonExecutable = path.join(
      process.cwd(),
      "llm-summarizer",
      "venv",
      "bin",
      "python"
    );

    const python = spawn(pythonExecutable, [pythonPath, clonedPath]);

    let result = "";
    let error = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", (code) => {
      if (code === 0) {
        resolve(result);
      } else {
        reject(new Error(`Python script failed: ${error}`));
      }
    });
  });
}
