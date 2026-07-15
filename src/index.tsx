import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import reportWebVitals from './reportWebVitals';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
