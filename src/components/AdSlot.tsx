import { SITE } from "@/config/site";

interface AdSlotProps {
  type: "leaderboard" | "sidebar" | "in-article" | "footer";
  className?: string;
}

/**
 * Reserved ad space. Renders nothing until NEXT_PUBLIC_ADS_ENABLED is "true",
 * so visitors never see empty placeholder boxes. When AdSense approves the site,
 * put the ad unit code inside the <aside> below and set the variable in Vercel.
 */
export default function AdSlot({ type, className = "" }: AdSlotProps) {
  if (!SITE.adsEnabled) return null;
  const heights = {
    leaderboard: "min-h-[90px] sm:min-h-[100px]",
    sidebar: "min-h-[250px] sm:min-h-[300px]",
    "in-article": "min-h-[120px] sm:min-h-[140px]",
    footer: "min-h-[100px] sm:min-h-[120px]",
  };
  return <aside aria-label="Advertisement" className={`w-full ${heights[type]} ${className}`} />;
}
