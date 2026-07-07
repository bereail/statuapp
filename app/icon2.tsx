import { ImageResponse } from "next/og";
import { BustMark } from "./_icons/BustMark";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon512() {
  return new ImageResponse(<BustMark size={512} />, size);
}
