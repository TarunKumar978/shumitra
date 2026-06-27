import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "products";

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Special case: hero video → save as /public/hero.mp4
    if (folder === "hero") {
      const heroPath = path.join(process.cwd(), "public", "hero.mp4");
      await writeFile(heroPath, buffer);
      return NextResponse.json({ success: true, url: "/hero.mp4" });
    }

    // All other uploads → save to /public/uploads/<folder>/
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${folder}/${fileName}`;
    return NextResponse.json({ success: true, url });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
