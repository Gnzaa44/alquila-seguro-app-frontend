import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService"; // Importa el servicio de autenticación
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = AuthService.getCurrentUser(); 
  const handleLogout = () => {
    AuthService.logout(); 
    navigate("/login"); 
    window.location.reload(); 
  };

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#6196f2" }}
    data-bs-theme="light">
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">
          AlquilaSeguro
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/propiedades">
                Propiedades
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-warning fw-bold"
                to="/consultorias"
              >
                Consultorías{" "}
                <span className="badge bg-danger ms-1">¡Nuevo!</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/nosotros">
                Sobre Nosotros
              </Link>
            </li>
           {currentUser && (currentUser.role === "ADMIN" || currentUser.role === "ROLE_ADMIN") && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/admin">
                  Panel Admin
                </Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {currentUser && isAdminRoute && (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
