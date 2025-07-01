// ScrollReveal.jsx
import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * ScrollReveal
 * Un wrapper de alto rendimiento para animación reveal por scroll.
 * - Soporta anidamiento sin glitches.
 * - NO altera el scroll ni el offset de las anclas.
 * - La animación se dispara solo al entrar en viewport, nunca antes.
 * - Permite transición personalizada vía className.
 */
export default function ScrollReveal({
    children,
    as = "div",
    threshold = 0.15,
    transitionClass = "reveal-visible",
    baseClass = "reveal",
    delay = 4.4,
    style = {},
    ...props
}) {
    const Comp = as;
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    // Reveal solo cuando entra en viewport (no al montar)
    useEffect(() => {
        if (!ref.current) return;
        let observer;
        let cancelled = false;

        function reveal() {
            if (!cancelled) setVisible(true);
        }

        observer = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (delay) {
                        setTimeout(reveal, delay);
                    } else {
                        reveal();
                    }
                    observer.disconnect(); // Animar solo una vez
                }
            },
            { threshold }
        );
        observer.observe(ref.current);

        return () => {
            cancelled = true;
            observer && observer.disconnect();
        };
    }, [threshold, delay]);

    // Para anidamiento: nunca usar translate ni cambiar offsetTop en el DOM
    // Solo añade clase para animar opacidad/transform local
    return (
        <Comp
            ref={ref}
            className={
                baseClass +
                (visible ? ` ${transitionClass}` : "") +
                (props.className ? ` ${props.className}` : "")
            }
            style={style}
            {...props}
        >
            {children}
        </Comp>
    );
}

ScrollReveal.propTypes = {
    children: PropTypes.node.isRequired,
    as: PropTypes.elementType,
    threshold: PropTypes.number,
    transitionClass: PropTypes.string,
    baseClass: PropTypes.string,
    delay: PropTypes.number,
    style: PropTypes.object,
};

// Ejemplo de estilos CSS (añádelo a tu CSS global o módulo):
/*
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.65s cubic-bezier(.37,.64,.43,.99), transform 0.65s cubic-bezier(.37,.64,.43,.99);
  will-change: opacity, transform;
}
.reveal-visible {
  opacity: 1;
  transform: none;
}
*/

