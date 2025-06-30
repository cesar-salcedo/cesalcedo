import React, { useRef, useEffect, useState, useCallback } from 'react';

const ImageSequenceScrubber = ({
    folderPath,
    fileName,
    startFrame = 1,
    frameCount,
    frameStep = 1,
    scrollFactor = 2,
    concurrency = 6, // número de cargas paralelas
}) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    // ref para almacenar las imágenes sin disparar renders
    const framesRef = useRef([]);
    const currentFrameIndexRef = useRef(-1);
    const rafIdRef = useRef(null);

    const [loadingProgress, setLoadingProgress] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    const isLoading = framesRef.current.length < frameCount;

    // --- EFECTO 1: Precarga con concurrencia ---
    useEffect(() => {
        let isCancelled = false;

        const loadImage = src =>
            new Promise(resolve => {
                const img = new Image();
                img.onload = img.onerror = () => resolve(img);
                img.src = src;
            });

        const loadFrames = async () => {
            const loaded = [];
            const queue = [];
            for (let i = 0; i < frameCount; i++) {
                const frameNumber = startFrame + i * frameStep;
                const padded = String(frameNumber).padStart(4, '0');
                const src = `${folderPath}/${fileName}${padded}.webp`;

                queue.push(loadImage(src));

                if (queue.length === concurrency || i === frameCount - 1) {
                    const results = await Promise.allSettled(queue);
                    if (isCancelled) return;
                    results.forEach(r => {
                        if (r.status === 'fulfilled') loaded.push(r.value);
                    });
                    framesRef.current = loaded;
                    setLoadingProgress((loaded.length / frameCount) * 100);
                    queue.length = 0;
                }
            }
        };

        loadFrames();

        return () => {
            isCancelled = true;
        };
    }, [folderPath, fileName, startFrame, frameCount, frameStep, concurrency]);

    // --- EFECTO 2: Cálculo de altura responsive ---
    const updateHeight = useCallback(() => {
        const scrollDist = window.innerHeight * scrollFactor;
        setContainerHeight(scrollDist + window.innerHeight);
    }, [scrollFactor]);

    useEffect(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, [updateHeight]);

    // --- EFECTO 3: Scroll, resize y dibujado optimizados ---
    const drawFrame = useCallback(
        index => {
            const frames = framesRef.current;
            if (!canvasRef.current || index < 0 || index >= frames.length) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = frames[index];
            if (!img || !img.complete) return;

            // calcular ratio una sola vez por resize
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);
            const offsetX = (canvas.width - img.width * ratio) / 2;
            const offsetY = (canvas.height - img.height * ratio) / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                img,
                0, 0, img.width, img.height,
                offsetX, offsetY,
                img.width * ratio,
                img.height * ratio
            );
        },
        []
    );

    const onScroll = useCallback(() => {
        const frames = framesRef.current;
        if (isLoading || frames.length === 0) return;
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const scrollDist = containerHeight - window.innerHeight;
        const progress = Math.max(0, Math.min(1, -rect.top / scrollDist));
        const frameIndex = Math.floor(progress * (frames.length - 1));

        if (frameIndex !== currentFrameIndexRef.current) {
            currentFrameIndexRef.current = frameIndex;
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = requestAnimationFrame(() =>
                drawFrame(frameIndex)
            );
        }
    }, [containerHeight, drawFrame, isLoading]);

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // redibuja el frame actual o el primero
        drawFrame(Math.max(0, currentFrameIndexRef.current));
    }, [drawFrame]);

    useEffect(() => {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', resizeCanvas);

        // llamada inicial
        resizeCanvas();
        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', resizeCanvas);
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [onScroll, resizeCanvas]);

    return (
        <div
            ref={containerRef}
            style={{ height: `${containerHeight}px`, position: 'relative' }}
        >
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    width: '100%',
                }}
            >
                {isLoading && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            padding: '10px',
                            borderRadius: '8px',
                            fontSize: '18px',
                        }}
                    >
                        Loading: {Math.round(loadingProgress)}%
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    style={{
                        display: isLoading ? 'none' : 'block',
                        width: '100%',
                        height: '100%',
                    }}
                />
            </div>
        </div>
    );
};

export default ImageSequenceScrubber;
