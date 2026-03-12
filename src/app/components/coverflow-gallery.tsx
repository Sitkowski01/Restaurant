import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const C = {
  gold: "#B68A3A",
  cream: "#F3EFEA",
};

interface CoverflowGalleryProps {
  images: { id: number; src: string; alt: string }[];
  onImageClick?: (index: number) => void;
  interval?: number;
}

export function CoverflowGallery({ images, onImageClick, interval = 6000 }: CoverflowGalleryProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = images.length;

  const wrap = useCallback((i: number) => ((i % count) + count) % count, [count]);
  const next = useCallback(() => setActive((i) => wrap(i + 1)), [wrap]);
  const prev = useCallback(() => setActive((i) => wrap(i - 1)), [wrap]);

  // preload all images
  useEffect(() => {
    images.forEach((img) => {
      const i = new Image();
      i.src = img.src;
    });
  }, [images]);

  // autoplay
  useEffect(() => {
    if (paused || count <= 1) return;
    timerRef.current = setInterval(next, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, next, interval, count]);

  const getOffset = useCallback((idx: number) => {
    let diff = idx - active;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  }, [active, count]);

  return (
    <div
      className="relative w-full select-none overflow-hidden"
      style={{ aspectRatio: "16 / 7" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((img, idx) => {
        const offset = getOffset(idx);
        const abs = Math.abs(offset);
        const visible = abs <= 2;

        const tx = offset * 50;
        const sc = offset === 0 ? 1 : abs === 1 ? 0.78 : 0.6;
        const bright = offset === 0 ? 0.95 : abs === 1 ? 0.48 : 0.3;
        const z = offset === 0 ? 4 : abs === 1 ? 2 : 1;
        const op = abs <= 1 ? 1 : 0;

        const shouldAnimate = abs <= 2;

        return (
          <div
            key={img.id}
            className="absolute"
            style={{
              width: "52%",
              left: "50%",
              top: "50%",
              transform: `translateX(calc(-50% + ${tx}%)) translateY(-50%) scale(${sc})`,
              zIndex: z,
              opacity: op,
              filter: `brightness(${bright})`,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: offset === 0 ? "0 16px 60px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.25)",
              transition: shouldAnimate
                ? "transform 1s ease-in-out, opacity 1s ease-in-out, filter 1s ease-in-out, box-shadow 1s ease-in-out"
                : "none",
              cursor: abs <= 1 ? "pointer" : "default",
              pointerEvents: abs <= 1 ? "auto" : "none",
              visibility: visible ? "visible" : "hidden",
            }}
            onClick={() => {
              if (offset === 0 && onImageClick) {
                onImageClick(idx);
              } else if (offset === -1) {
                prev();
              } else if (offset === 1) {
                next();
              }
            }}
          >
            <div className="relative w-full" style={{ paddingBottom: "66%" }}>
              <img
                src={img.src}
                alt={img.alt}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                draggable={false}
              />
            </div>
          </div>
        );
      })}

      {/* strzałki */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-100 opacity-70"
        style={{ backgroundColor: "rgba(0,0,0,0.4)", color: C.cream }}
        aria-label="Poprzednie zdjęcie"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-100 opacity-70"
        style={{ backgroundColor: "rgba(0,0,0,0.4)", color: C.cream }}
        aria-label="Następne zdjęcie"
      >
        <ChevronRight size={22} />
      </button>

      {/* kropki */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="w-2 h-2 rounded-full transition-all duration-500"
            style={{
              backgroundColor: i === active ? C.gold : "rgba(243,239,234,0.3)",
              transform: i === active ? "scale(1.4)" : "scale(1)",
            }}
            aria-label={`Zdjęcie ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
