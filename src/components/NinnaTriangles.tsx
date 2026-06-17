import React from 'react';

interface NinnaTrianglesProps {
  position?: 'top-right' | 'bottom-left' | 'inline' | 'floating';
  opacity?: number;
  className?: string;
  size?: string;
}

export default function NinnaTriangles({
  position = 'top-right',
  opacity = 1,
  className = '',
  size = 'w-[320px] h-[320px] sm:w-[450px] sm:h-[450px]'
}: NinnaTrianglesProps) {
  // Adjusted 11-color brand polygon palette requested by user
  const colors = {
    azul: '#0B66C3',
    azulClaro: '#18A0D8',
    verdeAgua: '#39D0B3',
    verde: '#18C847',
    roxo: '#5A2EA6',
    roxoMagenta: '#9229A4',
    vermelho: '#FF3151',
    coral: '#FF6A4A',
    laranja: '#FF9500',
    amareloOuro: '#FFB400',
    amarelo: '#F5EA22',
  };

  if (position === 'inline') {
    return (
      <svg
        viewBox="0 0 500 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-auto ${className}`}
        style={{ opacity }}
      >
        <path d="M0 200 L120 120 L240 200 Z" fill={colors.verde} />
        <path d="M120 120 L200 40 L280 120 Z" fill={colors.verdeAgua} />
        <path d="M200 40 L300 0 L400 60 L280 120 Z" fill={colors.azulClaro} />
        <path d="M280 120 L400 60 L500 150 L420 200 Z" fill={colors.roxo} />
        <path d="M420 200 L500 150 L500 200 Z" fill={colors.roxoMagenta} />
        <path d="M240 200 L280 120 L420 200 Z" fill={colors.azul} />
        <path d="M0 200 L240 200 Z" fill={colors.amarelo} />
      </svg>
    );
  }

  const positionClasses = {
    'top-right': 'absolute top-0 right-0 pointer-events-none origin-top-right z-0',
    'bottom-left': 'absolute bottom-0 left-0 pointer-events-none origin-bottom-left z-0',
    'floating': 'pointer-events-none'
  };

  return (
    <div 
      className={`${positionClasses[position] || ''} ${size} ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {position === 'top-right' ? (
          <>
            {/* Triangular cluster branching from top right */}
            <polygon points="500,0 350,0 410,120" fill={colors.azul} />
            <polygon points="500,0 410,120 500,160" fill={colors.roxo} />
            <polygon points="500,160 410,120 460,250" fill={colors.roxoMagenta} />
            <polygon points="500,160 460,250 500,320" fill={colors.amarelo} />
            <polygon points="500,320 460,250 490,400" fill={colors.amareloOuro} />
            <polygon points="500,320 490,400 500,500" fill={colors.laranja} />
            
            <polygon points="350,0 260,30 320,150" fill={colors.verde} />
            <polygon points="350,0 320,150 410,120" fill={colors.verdeAgua} />
            <polygon points="410,120 320,150 380,240" fill={colors.azulClaro} />
            {/* Small stray triangle shards for organic, exploding effect */}
            <polygon points="210,180 230,160 220,195" fill={colors.coral} />
            <polygon points="170,290 195,280 185,310" fill={colors.vermelho} />
            <polygon points="260,380 290,360 280,395" fill={colors.azulClaro} />
          </>
        ) : (
          <>
            {/* Triangular cluster branching from bottom left */}
            <polygon points="0,500 150,500 90,380" fill={colors.amareloOuro} />
            <polygon points="0,500 90,380 0,340" fill={colors.roxo} />
            <polygon points="0,340 90,380 40,250" fill={colors.azulClaro} />
            <polygon points="0,340 40,250 0,180" fill={colors.verdeAgua} />
            <polygon points="0,180 40,250 10,100" fill={colors.verde} />
            
            <polygon points="150,500 240,470 180,350" fill={colors.amarelo} />
            <polygon points="150,500 180,350 90,380" fill={colors.roxoMagenta} />
            <polygon points="90,380 180,350 120,260" fill={colors.azul} />
            {/* Stray shards */}
            <polygon points="290,320 310,340 320,305" fill={colors.laranja} />
            <polygon points="330,210 305,220 315,190" fill={colors.coral} />
          </>
        )}
      </svg>
    </div>
  );
}
