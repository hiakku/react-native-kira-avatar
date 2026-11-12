import { Platform, View } from "react-native";
import type { RefObject } from "react";
import { captureRef, releaseCapture } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
export async function exportAvatar(
  svg: string,
  ref: RefObject<React.ComponentRef<typeof View> | null>,
) {
  if (Platform.OS === "web") {
    const url = URL.createObjectURL(
      new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
    );
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () =>
          reject(new Error("The image could not be rendered."));
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Image export is unavailable in this browser.");
      ctx.drawImage(img, 0, 0, 1024, 1024);
      const png = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("PNG export failed."))),
          "image/png",
        ),
      );
      const pngUrl = URL.createObjectURL(png);
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "kira-avatar.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(pngUrl), 60000);
    } finally {
      URL.revokeObjectURL(url);
    }
  } else {
    if (!(await Sharing.isAvailableAsync()))
      throw new Error("Sharing is unavailable on this device.");
    const uri = await captureRef(ref, {
      format: "png",
      quality: 1,
      width: 1024,
      height: 1024,
      result: "tmpfile",
    });
    try {
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Save or share your Kira avatar",
        UTI: "public.png",
      });
    } finally {
      releaseCapture(uri);
    }
  }
}
