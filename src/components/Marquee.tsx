import React from 'react';

const words = [
  "SHOW UP",
  "PROVE IT",
  "EARN IT",
  "NO EXCUSES",
  "DISCIPLINE DAILY",
  "SNAP PROOF",
  "LEVEL UP"
];

export default function Marquee() {
  return (
    <div className="relative w-full overflow-hidden py-3 z-20">
      <div className="flex w-[200%] animate-marquee">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center shrink-0">
            {words.map((word, j) => (
              <React.Fragment key={`${i}-${j}`}>
                <span className="text-[20px] font-['Bebas_Neue'] tracking-[4px] text-white/15 uppercase px-4 whitespace-nowrap">
                  {word}
                </span>
                <span className="text-[#E8952A] text-xl px-4">·</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
