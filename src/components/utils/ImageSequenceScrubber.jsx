import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress'; // Asegúrate que la ruta sea correcta

const ImageSequenceScrubber = ({
    folderPath,
    fileName,
    startFrame = 1,
    frameCount,
    frameStep = 1,
    scrollFactor = 2, // Se usará como 'durationInVh'
    concurrency = 6,
}) => {
    // Refs para el DOM y datos internos
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const framesRef = useRef([]);
    const currentFrameIndexRef = useRef(-1);
    const rafIdRef = useRef(null);

    // Estado de carga (sin cambios)
    const [loadingProgress, setLoadingProgress] = useState(0);
    const isLoading = framesRef.current.length < frameCount;

    // --- CAMBIO 1: Usar el hook para el progreso y la altura ---
    // 'scrollFactor' se mapea directamente a 'durationInVh'
    const { scrollProgress, containerHeight } = useScrollProgress(containerRef, {
        durationInVh: scrollFactor,
    });

    // --- EFECTO 1: Precarga de imágenes (sin cambios) ---
    useEffect(() => {
        let isCancelled = false;
        const loadImage = src => new Promise(resolve => {
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
                    results.forEach(r => r.status === 'fulfilled' && loaded.push(r.value));
                    framesRef.current = [...loaded];
                    setLoadingProgress((loaded.length / frameCount) * 100);
                    queue.length = 0;
                }
            }
        };
        loadFrames();
        return () => { isCancelled = true; };
    }, [folderPath, fileName, startFrame, frameCount, frameStep, concurrency]);

    // --- Lógica de dibujado y resize (sin cambios, pero ahora más aislada) ---
    const drawFrame = useCallback(index => {
        const frames = framesRef.current;
        if (!canvasRef.current || index < 0 || index >= frames.length) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = frames[index];
        if (!img || !img.complete) return;

        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const offsetX = (canvas.width - img.width * ratio) / 2;
        const offsetY = (canvas.height - img.height * ratio) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height, offsetX, offsetY, img.width * ratio, img.height * ratio);
    }, []);

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawFrame(Math.max(0, currentFrameIndexRef.current));
    }, [drawFrame]);

    // --- CAMBIO 2: Un nuevo useEffect que reacciona a 'scrollProgress' ---
    useEffect(() => {
        if (isLoading) return;

        const frameIndex = Math.floor(scrollProgress * (framesRef.current.length - 1));

        if (frameIndex !== currentFrameIndexRef.current) {
            currentFrameIndexRef.current = frameIndex;
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
        }
    }, [scrollProgress, isLoading, drawFrame]);

    // --- CAMBIO 3: Un useEffect simplificado para el 'resize' del canvas ---
    useEffect(() => {
        // La lógica de scroll ya no vive aquí
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // Llamada inicial
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [resizeCanvas]);

    // --- JSX (sin cambios, solo se alimenta de 'containerHeight' del hook) ---
    return (
        <div ref={containerRef} style={{ height: `${containerHeight}px`, position: 'relative' }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%' }}>
                {isLoading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>
                        Loading: {Math.round(loadingProgress)}%
                    </div>
                )}
                <canvas ref={canvasRef} style={{ display: isLoading ? 'none' : 'block', width: '100%', height: '100%' }} />
            </div>
        </div>
    );
};

export default ImageSequenceScrubber;