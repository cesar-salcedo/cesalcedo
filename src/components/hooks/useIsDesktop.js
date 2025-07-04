// src/hooks/useIsDesktop.js
import { useState, useEffect } from 'react';

// El "breakpoint" se puede pasar como argumento para hacerlo aún más flexible.
const useIsDesktop = (breakpoint = 768) => {
    const [isDesktop, setIsDesktop] = useState(
        // typeof window !== "undefined" es una buena práctica para Server-Side Rendering (SSR)
        typeof window !== "undefined" ? window.innerWidth >= breakpoint : false
    );

    useEffect(() => {
        // Si la ventana no existe (en SSR), no hagas nada.
        if (typeof window === "undefined") return;

        const handleResize = () => setIsDesktop(window.innerWidth >= breakpoint);

        window.addEventListener("resize", handleResize);

        // La función de limpieza es crucial para evitar "memory leaks".
        return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]); // El efecto se volverá a ejecutar si el breakpoint cambia.

    return isDesktop;
};

export default useIsDesktop;