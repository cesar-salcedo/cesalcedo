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
import AcceleratedEntry from "./components/utils/AcceleratedEntry";

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
        <AcceleratedEntry intensity={1} delay={2}>
          <Portfolio />
        </AcceleratedEntry>
        <About />
        <Contact />
      </div>
    </Router>
  );
}

export default App;