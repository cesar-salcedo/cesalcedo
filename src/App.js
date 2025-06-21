// src/App.js
import React from "react";
import Header from "./components/Header";
import Prueba from "./components/Prueba";
import Reel from "./components/Reel";
import Portfolio from "./components/Portfolio";
import About from "./components/About";
import Contact from "./components/Contact";

function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
      <Header />
      <Prueba />
      <Reel />
      <Portfolio />
      <About />
      <Contact />
    </div>
  );
}

export default App;
