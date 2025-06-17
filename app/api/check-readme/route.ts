import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

    console.log("Check README request for folder:", folder);

    if (!folder) {
      return NextResponse.json(
        { error: "Missing folder name" },
        { status: 400 }
      );
    }

    // Sanitize folder name to prevent path traversal
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9-_]/g, "");
    const readmePath = path.join(
      process.cwd(),
      "temp",
      sanitizedFolder,
      "readme.md"
    );

    console.log("Checking path:", readmePath);

    const exists = fs.existsSync(readmePath);
    console.log("File exists:", exists);

    return NextResponse.json({ exists });
  } catch (error) {
    console.error("Error in check-readme:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        exists: false,
      },
      { status: 500 }
    );
  }
}
