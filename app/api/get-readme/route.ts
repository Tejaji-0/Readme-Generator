// app/api/get-readme/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder");

  if (!folder) {
    return NextResponse.json({ error: "Missing folder name" }, { status: 400 });
  }

  const readmePath = path.join(process.cwd(), "temp", folder, "readme.md");

  try {
    const content = fs.readFileSync(readmePath, "utf-8");
    return NextResponse.json({ content });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 404 });
  }
}
