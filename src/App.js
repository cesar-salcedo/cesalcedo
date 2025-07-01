// src/App.js
import React from "react";
// 1. Importa el Router y Analytics
import { BrowserRouter as Router } from 'react-router-dom';
import Analytics from './components/Analytics';

import Header from "./components/Header";
import Cover from "./components/Cover";
import Portfolio from "./components/Portfolio";
import About from "./components/About";
import Contact from "./components/Contact";
import ScrollReveal from "./components/utils/ScrollReveal";

function App() {
  return (
    // 2. Envuelve TODO tu contenido con el Router
    <Router>
      {/* 3. Coloca Analytics aquí para que tenga acceso al contexto del Router */}
      <Analytics />

      {/* 4. Mantén tu div con los estilos EXACTAMENTE como lo tenías. */}
      {/* Este div sigue siendo el contenedor principal de tu layout. */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        color: "#355",
        boxSizing: "border-box",
      }}>

        <Header />
        <Cover />
        <ScrollReveal>
          <Portfolio />
        </ScrollReveal>

        <ScrollReveal>
          <About />
        </ScrollReveal>

        <ScrollReveal>
          <Contact />
        </ScrollReveal>

      </div>
    </Router>
  );
}

export default App;