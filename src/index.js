// src/index.js
import React from "react";
import ReactDOM from 'react-dom/client';
import "./index.css";
import App from "./App";
import ReactGA from 'react-ga4';

const MEASUREMENT_ID = "G-GMSYT716J2"; // Reemplaza con tu ID de medición
ReactGA.initialize(MEASUREMENT_ID);


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
