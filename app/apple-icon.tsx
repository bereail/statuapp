import { ImageResponse } from "next/og";
import { BustMark } from "./_icons/BustMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  // iOS aplica su propio recorte redondeado, así que el ícono va sin
  // esquinas propias para que no se vean franjas transparentes.
  return new ImageResponse(<BustMark size={180} radius={0} />, size);
}
