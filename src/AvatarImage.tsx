import React, { useId, useMemo } from "react";
import { SvgXml } from "react-native-svg";
import type { Avatar } from "./model";
import { avatarSvg } from "./art";
export function AvatarImage({
  avatar,
  size = 120,
  focus,
}: {
  avatar: Avatar;
  size?: number;
  focus?: "hair" | "eyes" | "outfit" | "accessory";
}) {
  const id = useId();
  const xml = useMemo(() => avatarSvg(avatar, id, focus), [avatar, id, focus]);
  return <SvgXml xml={xml} width={size} height={size} />;
}
