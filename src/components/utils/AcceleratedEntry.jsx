// AcceleratedEntry.jsx
import React, { useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Sticky entry that fades & translates from bottom of the viewport
 * until it reaches `offset` * 100% of the screen height.
 *
 * – No React state updates per frame (direct DOM writes).
 * – Resize/scroll listeners cleaned up correctly.
 * – Uses GPU-accelerated translate3d.
 */
const AcceleratedEntry = ({ children, offset = 0.4 }) => {
    const containerRef = useRef(null);
    const ticking = useRef(false);

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const vh = () => window.innerHeight;


        const updatePosition = () => {
            ticking.current = false;
            const rect = el.getBoundingClientRect();
            const height = vh();
            const start = height * offset;
            const end = height;
            const totalDist = end - start;
            let translateY = rect.top - start;
            let opacity;

            if (rect.top >= end) {
                // Below viewport
                translateY = totalDist;
                opacity = 0;
            } else if (rect.top <= start) {
                // Above threshold
                translateY = 0;
                opacity = 1;
            } else {
                // In between
                opacity = (height - rect.top) / totalDist;
            }

            el.style.transform = `translate3d(0, ${translateY}px, 0)`;
            el.style.opacity = opacity;
        };

        const onScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(updatePosition);
                ticking.current = true;
            }
        };

        const onResize = () => {
            window.requestAnimationFrame(updatePosition);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);

        // Initial positioning
        updatePosition();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }, [offset]);

    return (
        <div
            ref={containerRef}
            style={{ willChange: 'transform, opacity' }}
        >
            {children}
        </div>
    );
};

AcceleratedEntry.propTypes = {
    children: PropTypes.node.isRequired,
    offset: PropTypes.number,
};

export default AcceleratedEntry;
