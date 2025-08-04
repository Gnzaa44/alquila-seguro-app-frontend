import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div 
            className="text-center py-5"
            style={{
                minHeight: '100vh', 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}
        >
            <div className="container-fluid px-3">
                <h1 className="display-4 text-primary fw-bold">AlquilaSeguro</h1>
                <p className="lead mt-3 mb-4">
                    Tu plataforma confiable para encontrar el alquiler perfecto o resolver tus dudas con una consultoría.
                </p>
                <div className="d-grid gap-3 col-md-8 mx-auto mb-5">
                    <Link to="/propiedades" className="btn btn-primary btn-lg shadow-sm">
                        Explorar Propiedades
                    </Link>
                    <Link to="/consultorias" className="btn btn-outline-success btn-lg shadow-sm">
                        Solicitar una Consultoría
                    </Link>
                </div>

                <hr className="my-5" />

                <div className="row text-center justify-content-center">
                    <div className="col-md-4 col-lg-3 mb-4">
                        <i className="bi bi-house-door-fill text-info fs-1 mb-3"></i>
                        <h3 className="h4">Amplia Selección</h3>
                        <p className="px-2">Encuentra la propiedad ideal entre una gran variedad de opciones en diferentes ubicaciones.</p>
                    </div>
                    <div className="col-md-4 col-lg-3 mb-4">
                        <i className="bi bi-calendar-check-fill text-success fs-1 mb-3"></i>
                        <h3 className="h4">Reservas Simplificadas</h3>
                        <p className="px-2">Proceso de reserva rápido y seguro con integración de pagos.</p>
                    </div>
                    <div className="col-md-4 col-lg-3 mb-4">
                        <i className="bi bi-chat-dots-fill text-warning fs-1 mb-3"></i>
                        <h3 className="h4">Asesoramiento Profesional</h3>
                        <p className="px-2">Obtén consultorías expertas para todas tus necesidades inmobiliarias.</p>
                    </div>
                </div>

                <div className="mt-5 pt-3"></div>
            </div>

             </div>
    );
};

export default HomePage;