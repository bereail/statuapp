import { ImageResponse } from "next/og";
import { BustMark } from "./_icons/BustMark";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon192() {
  return new ImageResponse(<BustMark size={192} />, size);
}
