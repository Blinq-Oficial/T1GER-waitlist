"use client";

import { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import { MarkerHighlight } from "@/components/ui/marker-highlight";

function usePrefersDark() {
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setPrefersDark(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersDark;
}

function MarkerHighlightScene({ prefersDark }: { prefersDark: boolean }) {
  return (
    <MarkerHighlight
      before="Made for "
      highlight="builders"
      after="."
      markerColor="#facc15"
      baseColor={prefersDark ? "#fafafa" : "#171717"}
      highlightedTextColor="#171717"
      backgroundColor={prefersDark ? "#09090b" : "#ffffff"}
      fontSize={72}
      fontWeight={600}
      speed={1}
    />
  );
}

export default function MarkerHighlightDemo() {
  const prefersDark = usePrefersDark();

  return (
    <div className="w-full min-h-screen overflow-hidden bg-zinc-950">
      <Player
        component={MarkerHighlightScene}
        inputProps={{ prefersDark }}
        durationInFrames={90}
        fps={30}
        compositionWidth={1200}
        compositionHeight={900}
        controls={false}
        autoPlay
        loop
        style={{ width: "100vw", height: "100vh" }}
      />
    </div>
  );
}
