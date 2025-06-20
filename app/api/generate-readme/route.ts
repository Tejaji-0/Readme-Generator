import { NextRequest, NextResponse } from "next/server";
import { prepareClonePath } from "../lib/make-dir";
import { cloneRepo } from "../lib/clone-repo";
import path from "path";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

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

    // 📌 Call the Python agent
    const pythonScriptPath = path.resolve("summariser-llm/agents_groq.py");
    const venvPython = path.resolve("summariser-llm/venv/bin/python");
    const { stdout } = await execPromise(
      `${venvPython} ${pythonScriptPath} ${finalDestination}`
    );

    const readmePath = path.join(finalDestination, "readme.md");

    // You can return the summary here or pass it to GPT for README gen
    return NextResponse.json({ readme: stdout.trim(), path: readmePath });
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
