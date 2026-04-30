"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { basePath } from "@/lib/site-config";

const zoneByPathname = new Map<string, string>([
  ["/euphotic", "euphotic"],
  ["/dysphotic", "dysphotic"],
  ["/aphotic", "aphotic"],
  ["/abyssal", "abyssal"],
  ["/hadal", "hadal"],
]);

export function normalizePathname(pathname: string, currentBasePath = basePath) {
  if (!currentBasePath || currentBasePath === "/") {
    return pathname === "" ? "/" : pathname;
  }

  if (pathname === currentBasePath) {
    return "/";
  }

  if (pathname.startsWith(`${currentBasePath}/`)) {
    return pathname.slice(currentBasePath.length) || "/";
  }

  return pathname;
}

export function resolveZone(pathname: string, currentBasePath = basePath) {
  return zoneByPathname.get(normalizePathname(pathname, currentBasePath));
}

export function mergeDepth(baseDepth: number, scrollProgress: number) {
  const clampedBase = Math.min(Math.max(baseDepth, 0), 1);
  const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);
  return clampedBase + clampedProgress * (1 - clampedBase);
}

export function DepthThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const baseDepthRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    document.body.style.setProperty("--depth", mergeDepth(baseDepthRef.current, value).toFixed(4));
  });

  useEffect(() => {
    const zone = resolveZone(pathname);
    if (zone) {
      document.body.dataset.zone = zone;
    } else {
      delete document.body.dataset.zone;
    }

    const baseDepthValue = Number.parseFloat(getComputedStyle(document.body).getPropertyValue("--depth-base")) || 0;
    baseDepthRef.current = baseDepthValue;
    document.body.style.setProperty("--depth", mergeDepth(baseDepthValue, scrollYProgress.get()).toFixed(4));

    return () => {
      delete document.body.dataset.zone;
    };
  }, [pathname, scrollYProgress]);

  return children;
}