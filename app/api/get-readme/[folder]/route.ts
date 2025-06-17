import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { folder: string } }
) {
  try {
    const folder = params.folder;
    const readmePath = path.join(process.cwd(), "temp", folder, "README.md");

    const content = await readFile(readmePath, "utf-8");

    return NextResponse.json({ readme: content });
  } catch (error) {
    console.error("README not found:", error);
    return NextResponse.json({ error: "README not found" }, { status: 404 });
  }
}
