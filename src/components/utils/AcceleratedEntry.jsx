// AcceleratedEntry.jsx
import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Sticky entry that fades & translates from bottom of the viewport until it reaches 40 % of the screen height.
 * Optimisations:
 * – no React state updates per frame (only direct DOM writes inside rAF)
 * – resize handler preserved and cleaned up correctly (no memory leaks)
 * – translate3d for GPU acceleration and corrected missing parenthesis
 */
export default function AcceleratedEntry({ children, intensity = 1, className = '' }) {
    const placeholderRef = useRef(null);
    const contentRef = useRef(null);

    // Height is kept in state because it changes rarely (only on resize)
    const [contentHeight, setContentHeight] = useState('auto');

    const isIntersecting = useRef(false);
    const rafId = useRef(null);

    // --- measure content height -------------------------------------------------
    useLayoutEffect(() => {
        const node = contentRef.current;
        if (!node) return;

        const ro = new ResizeObserver(([entry]) => {
            setContentHeight(entry.contentRect.height);
        });

        ro.observe(node);
        return () => ro.disconnect();
    }, []);

    // --- track visibility -------------------------------------------------------
    useEffect(() => {
        const node = placeholderRef.current;
        if (!node) return undefined;

        const io = new IntersectionObserver(
            ([entry]) => {
                isIntersecting.current = entry.isIntersecting;
            },
            { threshold: 0 },
        );

        io.observe(node);
        return () => io.disconnect();
    }, []);

    // --- scroll animation -------------------------------------------------------
    useEffect(() => {
        const node = contentRef.current;
        if (!node) return undefined;

        // metrics that change on resize
        let viewH = window.innerHeight;
        let startY = viewH;
        let endY = viewH * 0.4;
        let distance = startY - endY;
        const maxTranslate = distance * intensity;

        const updateMetrics = () => {
            viewH = window.innerHeight;
            startY = viewH;
            endY = viewH * 0.4;
            distance = startY - endY;
        };

        const renderFrame = () => {
            if (!isIntersecting.current) {
                rafId.current = null;
                return;
            }

            const rect = placeholderRef.current.getBoundingClientRect();
            const raw = 1 - (rect.top - endY) / distance;
            const progress = Math.max(0, Math.min(raw, 1));

            node.style.opacity = progress;
            node.style.transform = `translate3d(0, ${maxTranslate * (1 - progress)}px, 0)`;

            rafId.current = requestAnimationFrame(renderFrame);
        };

        const handleScroll = () => {
            if (rafId.current == null) {
                rafId.current = requestAnimationFrame(renderFrame);
            }
        };

        // kick‑off
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });

        const resizeHandler = () => {
            updateMetrics();
            handleScroll();
        };
        window.addEventListener('resize', resizeHandler, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', resizeHandler);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [intensity]);

    return (
        <div
            ref={placeholderRef}
            style={{ height: `${contentHeight}px`, position: 'relative' }}
            className={className}
        >
            <div ref={contentRef} style={{ position: 'sticky', top: 0, willChange: 'transform, opacity' }}>
                {children}
            </div>
        </div>
    );
}

AcceleratedEntry.propTypes = {
    children: PropTypes.node.isRequired,
    intensity: PropTypes.number,
    className: PropTypes.string,
};
