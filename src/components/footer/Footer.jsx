import React from "react";

const Footer = () => (
  <footer
    className="pt-4 pb-2 mt-auto text-white"
    style={{ backgroundColor: "#6196f2" }}
  >
    <div className="container">
      <div className="row align-items-center gy-3">
        <div className="col-md-4 text-center text-md-start mb-2 mb-md-0">
          <span className="fw-bold">AlquilaSeguro</span> &copy; {new Date().getFullYear()}<br />
          Todos los derechos reservados.
        </div>
        <div className="col-md-4 text-center mb-2 mb-md-0">
          <a
            href="https://www.instagram.com/cuentafinalig"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white mx-2 fs-4"
            aria-label="Instagram"
            style={{ opacity: 0.5, cursor: "not-allowed" }}
            tabIndex={-1}
            onClick={e => e.preventDefault()}
          >
            <i className="bi bi-instagram"></i>
          </a>
          {/* Facebook deshabilitado hasta tener propio */}
          <span className="text-white mx-2 fs-4" aria-label="Facebook" style={{ opacity: 0.5, cursor: "not-allowed" }}>
            <i className="bi bi-facebook"></i>
          </span>
          <a
            href="https://wa.me/5492235551101"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white mx-2 fs-4"
            aria-label="WhatsApp"
          >
            <i className="bi bi-whatsapp"></i>
          </a>
        </div>
        <div className="col-md-4 text-center text-md-end">
          <span className="d-block mb-1">
            <i className="bi bi-telephone-fill me-2"></i>
            <a href="tel:+5491223551101" className="text-white text-decoration-none">
              +54 9 2235 55-1101
            </a>
          </span>
          <span>
            <i className="bi bi-envelope-fill me-2"></i>
            <a href="mailto:contacto.alquilaseguro@gmail.com" className="text-white text-decoration-none">
              contacto.alquilaseguro@gmail.com
            </a>
          </span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;