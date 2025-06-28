import React, { useRef, useEffect, useState, useCallback } from 'react';

const ImageSequenceScrubber = ({ folderPath, fileName, frameCount, scrollFactor = 2 }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [frames, setFrames] = useState([]);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const isLoading = frames.length < frameCount;

    useEffect(() => {
        const loadFrames = async () => {
            const loadedFrames = [];
            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                const paddedIndex = String(i).padStart(4, '0');
                img.src = `${folderPath}/${fileName}${paddedIndex}.webp`;

                await new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
                loadedFrames.push(img);
                setLoadingProgress(((i / frameCount) * 100));
            }
            setFrames(loadedFrames);
        };
        loadFrames();
    }, [folderPath, fileName, frameCount]);

    const updateHeight = useCallback(() => {
        const scrollDistance = window.innerHeight * scrollFactor;
        setContainerHeight(scrollDistance + window.innerHeight);
    }, [scrollFactor]);

    useEffect(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, [updateHeight]);

    useEffect(() => {
        if (isLoading || frames.length === 0) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        let currentFrameIndex = -1;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawFrame(currentFrameIndex > -1 ? currentFrameIndex : 0);
        };

        const drawFrame = (frameIndex) => {
            if (frameIndex < 0 || frameIndex >= frames.length) return;
            const frame = frames[frameIndex];
            if (frame && frame.complete && frame.naturalHeight !== 0) {
                const hRatio = canvas.width / frame.width;
                const vRatio = canvas.height / frame.height;
                const ratio = Math.max(hRatio, vRatio);
                const centerShift_x = (canvas.width - frame.width * ratio) / 2;
                const centerShift_y = (canvas.height - frame.height * ratio) / 2;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(frame, 0, 0, frame.width, frame.height,
                    centerShift_x, centerShift_y, frame.width * ratio, frame.height * ratio);
            }
        };

        const onScroll = () => {
            if (!containerRef.current) return;
            const containerTop = containerRef.current.offsetTop;
            const scrollTop = window.scrollY - containerTop;
            const scrollDistance = containerHeight - window.innerHeight;
            let progress = Math.max(0, Math.min(1, scrollTop / scrollDistance));
            const frameIndex = Math.floor(progress * (frames.length - 1));

            if (frameIndex !== currentFrameIndex) {
                currentFrameIndex = frameIndex;
                requestAnimationFrame(() => drawFrame(frameIndex));
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [isLoading, frames, containerHeight, frameCount]);

    return (
        <div ref={containerRef} style={{ height: `${containerHeight}px`, position: 'relative' }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%' }}>
                {isLoading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>
                        Cargando animación: {Math.round(loadingProgress)}%
                    </div>
                )}
                <canvas ref={canvasRef} style={{ display: isLoading ? 'none' : 'block', width: '100%', height: '100%' }} />
            </div>
        </div>
    );
};

export default ImageSequenceScrubber;