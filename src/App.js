// src/App.js
import React from "react";
import Header from "./components/Header";
import Reel from "./components/Reel";
import Portfolio from "./components/Portfolio";
import About from "./components/About";
import Contact from "./components/Contact";

function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
      <Header />
      <Reel />
      <Portfolio />
      <About />
      <Contact />
    </div>
  );
}

export default App;
