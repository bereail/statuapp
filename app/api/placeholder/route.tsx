import { ImageResponse } from "next/og";
import { BRAND_BG, BustMark } from "@/app/_icons/BustMark";

export const runtime = "nodejs";
export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND_BG,
        }}
      >
        <BustMark size={160} />
      </div>
    ),
    { width: 640, height: 480 }
  );
}
