import { toPng } from "html-to-image";

export async function downloadShareCard(node, city) {
  if (!node) throw new Error("Share card ref missing");

  // Wait for fonts to be ready
  if (document.fonts?.ready) await document.fonts.ready;

  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#0b1020",
  });

  const link = document.createElement("a");
  link.download = `velora-${city.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}
