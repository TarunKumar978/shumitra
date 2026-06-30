import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "products";

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);
    let finalExt = ext;

    // Compress images (not videos) — resize if oversized, re-encode at high quality
    if (IMAGE_EXTENSIONS.has(ext) && folder !== "hero") {
      try {
        const img = sharp(buffer);
        const meta = await img.metadata();
        let pipeline = img;
        if (meta.width && meta.width > 1600) {
          pipeline = pipeline.resize({ width: 1600, withoutEnlargement: true });
        }
        buffer = Buffer.from(await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer());
        finalExt = "jpg";
      } catch {
        // If compression fails for any reason, fall back to original file untouched
      }
    }

    const fileName = `${Date.now()}.${finalExt}`;

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
