import React from 'react';

interface LogoProps {
  className?: string;
  light?: boolean; // If true, NINNA is white/silver, else blue/dark
  scale?: number;
}

export default function NinnaHubLogo({ className = '', light = true, scale = 1 }: LogoProps) {
  // Color configuration
  const ninnaColor = light ? 'text-white' : 'text-[#1A237E]';
  const hubColor = '#31c891'; // Updated to new brand color

  return (
    <div className={`inline-flex flex-col select-none ${className}`} style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}>
      <div className="relative flex items-end">
        {/* The wordmark "NINNA" in Barlow Condensed Black, uppercase */}
        <span className={`font-barlow-cond font-black tracking-wide text-3xl leading-none uppercase ${ninnaColor} relative`}>
          N
          {/* Letter I with the green square differentiator */}
          <span className="relative inline-block px-[0.05em]">
            {/* The green square on top of the "I" representing innovation & technology */}
            <span 
              className="absolute left-1/2 -translate-x-1/2 w-[0.25em] h-[0.25em] rounded-[0.05em]" 
              style={{ top: '-0.32em', backgroundColor: '#31c891' }}
            />
            I
          </span>
          NNA
        </span>
      </div>
      
      {/* "HUB" label always below and to the right, uppercase Barlow Condensed Semibold */}
      <div className="flex justify-end -mt-0.5 pr-0.5">
        <span 
          className="font-barlow-cond font-bold tracking-[0.1em] text-xs uppercase" 
          style={{ color: hubColor }}
        >
          HUB
        </span>
      </div>
    </div>
  );
}
