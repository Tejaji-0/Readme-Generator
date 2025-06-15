import { NextRequest, NextResponse } from "next/server";
import { prepareClonePath } from "../lib/make-dir";
import { cloneRepo } from "../lib/clone-repo";

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
