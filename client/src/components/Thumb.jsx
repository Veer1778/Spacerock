import { useState } from "react";

/**
 * Renders an article image; if the file isn't in /public/images yet,
 * falls back to a branded gradient placeholder so the layout never breaks.
 */
export default function Thumb({ src, alt = "", variant = "wide", label }) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div className={`thumb thumb--${variant}`}>
      {showImage && (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      )}
      {!showImage && label && <span className="thumb__label">&gt;_ {label}</span>}
    </div>
  );
}
