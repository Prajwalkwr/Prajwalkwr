import { useState } from "react";

export default function SafeImage({ src, alt, className = "", label }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`grid min-h-48 place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.35),transparent_42%),linear-gradient(160deg,#16161c,#050505)] px-6 text-center ${className}`}
      >
        <span className="text-lg font-semibold tracking-tight text-white" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
          {label || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
