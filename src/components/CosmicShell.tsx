import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

function seededRandom(seed: number) {
  let t = seed;
  return () => {
    t = (t * 16807) % 2147483647;
    return (t - 1) / 2147483646;
  };
}

const rng = seededRandom(42);
const stars = Array.from({ length: 110 }, () => ({
  x: rng() * 100,
  y: rng() * 100,
  size: rng() < 0.88 ? 1 + rng() * 1.2 : 2 + rng() * 1.5,
  dur: 3 + rng() * 5,
  delay: rng() * 5,
}));

export function CosmicShell({
  children,
  widthClassName = "max-w-[768px]",
}: {
  children: ReactNode;
  widthClassName?: string;
}) {
  const [showCookies, setShowCookies] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cosmos">
      <div aria-hidden={true} className="pointer-events-none fixed inset-0">
        {stars.map((s, idx) => (
          <span
            key={idx}
            className="star-dot absolute rounded-full bg-star"
            style={
              {
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                "--tw-dur": `${s.dur}s`,
                "--tw-delay": `${s.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <main className={`relative z-10 mx-auto flex w-full flex-col items-center px-5 pb-16 ${widthClassName}`}>
        <img
          src="/assets/moon-logo.jpg"
          alt="Moon"
          width={52}
          height={62}
          className="mt-5 h-[62px] w-[52px] mix-blend-screen [mask-image:radial-gradient(circle,black_40%,transparent_70%)]"
        />
        {children}
        <footer className="mt-16 flex gap-5 text-xs text-foreground/40">
          <Link to="/privacy" className="hover:text-gold">
            Privacy policy
          </Link>
          <button
            type="button"
            onClick={() => setShowCookies(true)}
            className="hover:text-gold cursor-pointer"
          >
            Cookie settings
          </button>
        </footer>
      </main>

      {showCookies && (
        <div
          role="dialog"
          aria-label="Cookie settings"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-[640px] border border-gold/60 bg-panel px-5 py-5 text-foreground shadow-gold-soft backdrop-blur sm:px-7"
        >
          <p className="font-display text-xl text-gold">Cookie Preferences</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
            We use cookies to enhance your experience and analyze our traffic. You can choose your preferences below.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowCookies(false)}
              className="border border-gold bg-gold px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-gold-soft cursor-pointer"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() => setShowCookies(false)}
              className="border border-gold/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-gold/10 cursor-pointer"
            >
              Essential only
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function GoldButton({
  children,
  onClick,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-16 w-full max-w-[448px] text-[15px] font-medium uppercase tracking-[0.04em] text-primary-foreground shadow-cta transition-transform hover:scale-[1.015] cursor-pointer ${
        reverse ? "bg-gold-gradient-reverse" : "bg-gold-gradient"
      } ${className}`}
    >
      {children}
    </button>
  );
}
