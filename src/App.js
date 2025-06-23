// src/App.js
import React from "react";
import Header from "./components/Header";
import Cover from "./components/Cover";
import Portfolio from "./components/Portfolio";
import About from "./components/About";
import Contact from "./components/Contact";

function App() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      fontFamily: "Arial, sans-serif",
      color: "#355",
      boxSizing: "border-box",
    }}>
      <Header />
      <Cover />
      <Portfolio />
      <About />
      <Contact />
    </div>
  );
}

export default App;
