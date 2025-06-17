import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

    console.log("Get README request for folder:", folder);

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

    console.log("Reading file from path:", readmePath);

    if (!fs.existsSync(readmePath)) {
      return NextResponse.json(
        { error: "README file not found" },
        { status: 404 }
      );
    }

    const content = fs.readFileSync(readmePath, "utf-8");
    console.log("Successfully read README content, length:", content.length);

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error in get-readme:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to read README file",
      },
      { status: 500 }
    );
  }
}
