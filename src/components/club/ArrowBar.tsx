// components/ArrowBar.tsx
import React from 'react';

type Orientation = 'horizontal' | 'vertical';
type WidthPattern = 'up' | 'down' | 'updown';

interface ArrowBarProps {
  title?: string;
  showTitle?: boolean;
  orientation?: Orientation;
  rotateOnMobile?: boolean;
  className?: string;

  // NEW: control mobile size
  mobileHeightClass?: string; // e.g. "h-32" | "h-24" | "h-48"

  // segments (gauche)
  segments?: number;
  segMinW?: number;
  segMaxW?: number;
  segGap?: number;
  widthPattern?: WidthPattern;

  // flèche
  height?: number;
  bodyLength?: number;
  bodyRadius?: number;
  tipLength?: number;
  tipOvershoot?: number;
  tipInset?: number;
}

export default function ArrowBar({
  title = 'NOTRE VISION',
  showTitle = true,
  orientation = 'horizontal',
  rotateOnMobile = true,
  className = 'text-slate-900',
  mobileHeightClass = 'h-40', // 👈 default smaller height on mobile

  segments = 8,
  segMinW = 8,
  segMaxW = 60,
  segGap = 8,
  widthPattern = 'up',

  height = 64,
  // bodyLength = 650,
  bodyRadius = 0,
  tipLength = 50,
  tipOvershoot = 20,
  tipInset = 12,
}: ArrowBarProps) {
  const H = height;
  const topY = 24;

  const VIEW_W = 1200;
  const VIEW_H = 120;

  const leftMargin = 12;
  const rightMargin = 12;
  const segPostGap = 12;
  const minBodyLen = 120;

  const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
  const easeInQuad = (t: number) => t * t;
  const smoothstep = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;

  const widths = Array.from({ length: Math.max(1, segments) }, (_, i) => {
    if (segments === 1) return segMaxW;
    const t = i / (segments - 1);
    if (widthPattern === 'up') return segMinW + (segMaxW - segMinW) * easeOutQuad(t);
    if (widthPattern === 'down') return segMinW + (segMaxW - segMinW) * easeInQuad(1 - t);
    const mid = (segments - 1) / 2;
    const d = Math.abs(i - mid) / (mid || 1);
    const e = smoothstep(1 - d);
    return segMinW + (segMaxW - segMinW) * e;
  });

  const tipX = VIEW_W - rightMargin;
  const baseX = tipX - tipLength;
  const bodyEndX = baseX + tipInset;

  const maxLeftSpace = bodyEndX - minBodyLen - segPostGap - leftMargin;

  const segTotalWidth = widths.reduce((s, w) => s + w, 0);
  const segTotalGaps = (segments - 1) * segGap;
  const segFullSpan = segTotalWidth + segTotalGaps;

  const scale = segFullSpan > maxLeftSpace ? Math.max(0.3, maxLeftSpace / segFullSpan) : 1;
  const scaledGap = segGap * scale;
  const scaledWidths = widths.map((w) => w * scale);

  let xCursor = leftMargin;
  const segRects = scaledWidths.map((w, i) => {
    const r = { x: xCursor, w };
    xCursor += w + (i < scaledWidths.length - 1 ? scaledGap : 0);
    return r;
  });

  const segEndX = segRects.length
    ? segRects[segRects.length - 1].x + segRects[segRects.length - 1].w
    : leftMargin;
  const bodyStartX = segEndX + segPostGap;
  const finalBodyLen = Math.max(minBodyLen, bodyEndX - bodyStartX);

  const DrawShapes = () => (
    <>
      {segRects.map(({ x, w }, i) => (
        <rect key={i} x={x} y={topY} width={w} height={H} rx={0} fill="currentColor" />
      ))}
      <rect
        x={bodyStartX}
        y={topY}
        width={finalBodyLen}
        height={H}
        rx={bodyRadius}
        fill="currentColor"
      />
      <polygon
        points={`${baseX},${topY - tipOvershoot} ${baseX},${topY + H + tipOvershoot} ${tipX},${topY + H / 2}`}
        fill="currentColor"
      />
      {showTitle && (
        <text
          x={bodyStartX + finalBodyLen / 2}
          y={topY + H / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white font-semibold text-2xl"
          style={{ letterSpacing: '0.18em' }}
        >
          {title}
        </text>
      )}
    </>
  );

  const HorizontalSVG = (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-28" preserveAspectRatio="none">
      <DrawShapes />
    </svg>
  );

  // Smaller & uniform on mobile:
  const VerticalSVG = (
    <svg
      viewBox={`0 0 ${VIEW_H} ${VIEW_W}`}
      className={`w-20 ${mobileHeightClass}`} // 👈 increased width from w-full to w-20
      preserveAspectRatio="xMidYMid meet" // 👈 keep proportions, no stretching
    >
      <g transform={`translate(${VIEW_H}, 0) rotate(90)`}>
        <DrawShapes />
      </g>
    </svg>
  );

  if (rotateOnMobile) {
    return (
      <div className={`relative w-full md:w-full ${className} overflow-hidden`} aria-hidden>
        <div className="hidden md:block">{HorizontalSVG}</div>
        <div className="block md:hidden w-20">{VerticalSVG}</div>
      </div>
    );
  }

  if (orientation === 'vertical') {
    return (
      <div className={`relative w-20 ${className} overflow-hidden`} aria-hidden>
        {VerticalSVG}
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`} aria-hidden>
      {HorizontalSVG}
    </div>
  );
}
