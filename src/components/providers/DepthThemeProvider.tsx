"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMotionValueEvent, useScroll } from "framer-motion";

const zoneByPathname = new Map<string, string>([
  ["/euphotic", "euphotic"],
  ["/dysphotic", "dysphotic"],
  ["/aphotic", "aphotic"],
  ["/abyssal", "abyssal"],
  ["/hadal", "hadal"],
]);

export function DepthThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    document.body.style.setProperty("--depth", value.toFixed(4));
  });

  useEffect(() => {
    const zone = zoneByPathname.get(pathname);
    if (zone) {
      document.body.dataset.zone = zone;
      return () => {
        delete document.body.dataset.zone;
      };
    }

    delete document.body.dataset.zone;
  }, [pathname]);

  return children;
}