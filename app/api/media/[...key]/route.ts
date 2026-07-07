import { NextResponse } from "next/server";
import { getImage } from "@/lib/storage/mediaStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const image = await getImage(key.join("/"));
  if (!image) return new NextResponse(null, { status: 404 });

  return new NextResponse(image.data, {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
