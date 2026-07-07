// Glifo de marca: un busto clásico sobre pedestal, en homenaje a las
// estatuas que catalogamos. Se usa para generar el favicon, el ícono de
// iOS/Android y el ícono del manifest — todos comparten este mismo dibujo
// para que la marca sea consistente en cualquier tamaño.
export const BRAND_BG = "#1E1F26";
export const BRAND_FG = "#E7D3A1";

export function BustMark({
  size,
  bg = BRAND_BG,
  fg = BRAND_FG,
  radius,
}: {
  size: number;
  bg?: string;
  fg?: string;
  radius?: number;
}) {
  const cornerRadius = radius ?? size * 0.22;
  const headSize = size * 0.34;
  const bodyWidth = size * 0.56;
  const bodyHeight = size * 0.32;
  const bodyRadius = size * 0.22;
  const plinthHeight = Math.max(size * 0.045, 1);
  const plinthWidth = size * 0.7;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: cornerRadius,
        background: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: size * 0.14,
      }}
    >
      <div
        style={{
          display: "flex",
          width: headSize,
          height: headSize,
          borderRadius: "50%",
          background: fg,
          marginBottom: size * -0.02,
        }}
      />
      <div
        style={{
          display: "flex",
          width: bodyWidth,
          height: bodyHeight,
          background: fg,
          borderTopLeftRadius: bodyRadius,
          borderTopRightRadius: bodyRadius,
        }}
      />
      <div
        style={{
          display: "flex",
          width: plinthWidth,
          height: plinthHeight,
          background: fg,
          borderRadius: plinthHeight,
          marginTop: size * 0.06,
        }}
      />
    </div>
  );
}
