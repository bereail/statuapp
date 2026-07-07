import { ImageResponse } from "next/og";
import { BustMark } from "./_icons/BustMark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BustMark size={32} />, size);
}
