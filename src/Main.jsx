import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Estilos CSS globales por defecto de Vite
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa el CSS de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa el JS de Bootstrap (para componentes como Navbar responsive, Carrusel, etc.)
import 'react-datepicker/dist/react-datepicker.css'; // Estilos para el calendario

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);