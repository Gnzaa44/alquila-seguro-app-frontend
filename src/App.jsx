import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'; 
import HomePage from './pages/HomePage';
import { Link } from 'react-router-dom';
import AboutUsPage from './pages/AboutUsPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ConsultancyPage from './pages/ConsultancyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminPropertyFormPage from './pages/AdminPropertyFormPage';
import AuthService from './services/AuthService'; // Para la autenticación

// Componente PrivateRoute para proteger rutas que requieren autenticación y/o roles específicos
// Este es un wrapper que decide si el usuario tiene permiso para acceder a la ruta.
const PrivateRoute = ({ children, roles }) => {
    const currentUser = AuthService.getCurrentUser(); // Obtiene el estado de autenticación (si hay token)

    if (!currentUser) {
        // Si no hay token, redirige a la página de login
        return <Navigate to="/login" replace />;
    }

    const userRole = currentUser.role; 
    if (roles && roles.length > 0 && !roles.includes(userRole)) {
        return <Navigate to="/" replace />; 
    }
    
    return children; 
};

function App() {
    return (
        <Router>
            <MainLayout> {/* Envuelve todas tus rutas con el MainLayout */}
                <Routes>
                    {/* Rutas Públicas */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/properties/:id" element={<PropertyDetailPage />} />
                    <Route path="/nosotros" element={<AboutUsPage />} />
                    <Route path="/propiedades" element={<PropertiesPage />} />
                    <Route path="/propiedades/:id" element={<PropertyDetailPage />} /> {/* Ruta con parámetro ID */}
                    <Route path="/consultorias" element={<ConsultancyPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Rutas Protegidas para el Panel de Administración */}
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute roles={["ADMIN", "ROLE_ADMIN"]}> 
                                <AdminDashboardPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/properties/new"
                        element={
                            <PrivateRoute roles={["ADMIN", "ROLE_ADMIN"]}>
                                <AdminPropertyFormPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/properties/edit/:id"
                        element={
                            <PrivateRoute roles={["ADMIN", "ROLE_ADMIN"]}>
                                <AdminPropertyFormPage />
                            </PrivateRoute>
                        }
                    />

                    {/* Ruta para manejar URLs no encontradas (404) */}
                    <Route path="*" element={
                        <div className="text-center py-5">
                            <h1 className="display-1 text-danger">404</h1>
                            <p className="lead">Página no encontrada.</p>
                            <Link to="/" className="btn btn-primary mt-3">Volver al Inicio</Link>
                        </div>
                    } />
                </Routes>
            </MainLayout>
        </Router>
    );
}

export default App;