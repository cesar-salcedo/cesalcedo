import React, { useEffect, useRef, useState } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress'; // 1. Importamos el hook

const ImageSequenceScrubber = ({ folderPath, fileName, startFrame = 1, frameCount, frameStep = 1, scrollFactor = 2 }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [frames, setFrames] = useState([]);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const isLoading = frames.length < frameCount;

    // --- LÓGICA DE HOOKS ---
    // 2. Usamos el hook, que reemplaza la lógica de altura y cálculo de progreso.
    // 'scrollFactor' se mapea directamente a 'durationInVh'.
    const { scrollProgress, containerHeight } = useScrollProgress(containerRef, {
        durationInVh: scrollFactor,
    });

    // Mantenemos un ref para evitar redibujar el mismo frame
    const lastDrawnFrameIndex = useRef(-1);

    // --- EFECTO 1: Precarga de imágenes (SIN CAMBIOS) ---
    // Esta lógica es específica del componente y se mantiene igual.
    useEffect(() => {
        const loadFrames = async () => {
            const loadedFrames = [];
            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                const frameNumber = startFrame + (i * frameStep);
                const paddedIndex = String(frameNumber).padStart(4, '0');
                img.src = `${folderPath}/${fileName}${paddedIndex}.webp`;
                await new Promise(r => { img.onload = img.onerror = r; });
                loadedFrames.push(img);
                setLoadingProgress(((i + 1) / frameCount) * 100);
            }
            setFrames(loadedFrames);
        };
        loadFrames();
    }, [folderPath, fileName, startFrame, frameCount, frameStep]);

    // --- EFECTO 2: Lógica de dibujado y resize (SIMPLIFICADO) ---
    // Este efecto ahora se centra en dibujar y responder al resize.
    useEffect(() => {
        if (isLoading || frames.length === 0) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

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

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Al cambiar el tamaño, redibujamos el frame actual que corresponda
            const currentFrameIndex = Math.floor(scrollProgress * (frameCount - 1));
            drawFrame(currentFrameIndex);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Llamada inicial para establecer tamaño

        // --- Lógica de scroll ahora es mucho más simple ---
        const frameIndexToShow = Math.floor(scrollProgress * (frameCount - 1));
        if (frameIndexToShow !== lastDrawnFrameIndex.current) {
            lastDrawnFrameIndex.current = frameIndexToShow;
            drawFrame(frameIndexToShow);
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [isLoading, frames, frameCount, scrollProgress]); // El hook nos da el 'scrollProgress' reactivo


    // --- JSX (sin cambios) ---
    return (
        // 3. El hook nos proporciona la altura correcta para el contenedor
        <div ref={containerRef} style={{ height: `${containerHeight}px`, position: 'relative' }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%' }}>
                {isLoading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>
                        Cargando secuencia: {Math.round(loadingProgress)}%
                    </div>
                )}
                <canvas ref={canvasRef} style={{ display: isLoading ? 'none' : 'block', width: '100%', height: '100%' }} />
            </div>
        </div>
    );
};

export default ImageSequenceScrubber;