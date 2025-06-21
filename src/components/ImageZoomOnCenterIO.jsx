import React, { useEffect, useRef, useState } from 'react';

export default function ImageZoomOnCenterIO({ title, src, alt = '' }) {
  const containerRef = useRef(null);
  const [isCentered, setIsCentered] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsCentered(entry.isIntersecting),
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ textAlign: 'center', margin: '60px 0' }}
    >
      <h2>{title}</h2>

      {/* Contenedor fijo con overflow hidden */}
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          overflow: 'hidden',
          margin: '0 auto'
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            display: 'block',
            width: '100%',
            transition: 'transform 0.4s ease',
            transform: isCentered ? 'scale(1.5)' : 'scale(1)',
            transformOrigin: 'center center'
          }}
        />
      </div>
    </div>
  );
}
