import React, { useRef, useEffect, useState, useCallback } from 'react';

const ImageSequenceScrubber = ({ folderPath, fileName, startFrame = 1, frameCount, frameStep = 1, scrollFactor = 2 }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [frames, setFrames] = useState([]);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const isLoading = frames.length < frameCount;

    // --- EFECTO 1: Precarga de imágenes (sin cambios) ---
    useEffect(() => {
        const loadFrames = async () => {
            const loadedFrames = [];
            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                const frameNumber = startFrame + (i * frameStep);
                const paddedIndex = String(frameNumber).padStart(4, '0');
                img.src = `${folderPath}/${fileName}${paddedIndex}.webp`;

                await new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
                loadedFrames.push(img);
                setLoadingProgress(((i + 1) / frameCount) * 100);
            }
            setFrames(loadedFrames);
        };
        loadFrames();
    }, [folderPath, fileName, startFrame, frameCount, frameStep]);

    // --- EFECTO 2: Cálculo de altura del contenedor (sin cambios) ---
    const updateHeight = useCallback(() => {
        const scrollDistance = window.innerHeight * scrollFactor;
        setContainerHeight(scrollDistance + window.innerHeight);
    }, [scrollFactor]);

    useEffect(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, [updateHeight]);

    // --- EFECTO 3: Lógica de scroll, resize y dibujado (CON CAMBIOS) ---
    useEffect(() => {
        if (isLoading || frames.length === 0) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        let currentFrameIndex = -1;
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Redibujar el frame actual tras el resize
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

        // --- LÓGICA DE SCROLL MEJORADA ---
        const onScroll = () => {
            if (!containerRef.current) return;

            // Obtenemos la posición del contenedor relativa al viewport.
            const rect = containerRef.current.getBoundingClientRect();

            // La distancia total que se puede scrollear "dentro" del componente.
            const scrollDistance = containerHeight - window.innerHeight;

            // Cuando el componente entra por abajo, rect.top es positivo.
            // Cuando está pegado arriba, rect.top es 0.
            // A medida que scrolleamos, rect.top se vuelve negativo.
            // Usamos -rect.top para tener un valor positivo que crece con el scroll.
            // Clamp (Math.max/min) asegura que el progreso se mantenga entre 0 y 1.
            const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));

            const frameIndex = Math.floor(progress * (frames.length - 1));

            if (frameIndex !== currentFrameIndex) {
                currentFrameIndex = frameIndex;
                // Usamos requestAnimationFrame para el dibujado, optimizando el rendimiento.
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
                animationFrameId = requestAnimationFrame(() => drawFrame(frameIndex));
            }
        };
        // --- FIN DE LA LÓGICA MEJORADA ---

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', resizeCanvas);

        // Llamada inicial para dibujar el primer frame
        resizeCanvas();
        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isLoading, frames, containerHeight]); // frameCount eliminado de las dependencias, ya está implícito en 'frames'

    // --- JSX (sin cambios) ---
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