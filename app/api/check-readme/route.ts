// app/api/check-readme/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder");

  if (!folder) {
    return NextResponse.json({ error: "Missing folder name" }, { status: 400 });
  }

  const readmePath = path.join(process.cwd(), "temp", folder, "readme.md");
  const exists = fs.existsSync(readmePath);

  return NextResponse.json({ exists });
}
