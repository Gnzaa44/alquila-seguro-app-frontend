import React from 'react';

const AboutUsPage = () => {
    return (
        <div className="py-4">
            {/* Header con gradiente y diseño moderno */}
            <div 
                className="text-center mb-5 py-5 px-4 rounded-3"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)'
                    }}
                ></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="mb-3">
                        <i className="bi bi-people-fill" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h1 className="mb-3" style={{ fontWeight: 700, fontSize: '2.5rem' }}>
                        Sobre Nosotros
                    </h1>
                    <p className="lead mb-0" style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
                        Transformando la experiencia inmobiliaria con confianza y tecnología
                    </p>
                </div>
            </div>

            {/* Introducción principal */}
            <div className="row justify-content-center mb-5">
                <div className="col-lg-10">
                    <div 
                        className="card shadow-lg border-0 text-center"
                        style={{
                            borderRadius: '20px',
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            color: 'white'
                        }}
                    >
                        <div className="card-body p-5">
                            <h3 className="mb-4" style={{ fontWeight: 600, fontSize: '1.8rem' }}>
                                Nuestra Historia
                            </h3>
                            <p className="lead mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                En AlquilaSeguro, nos dedicamos a transformar la experiencia de alquiler y gestión de propiedades,
                                haciéndola más transparente, segura y eficiente para todos. Conectamos inquilinos y propietarios
                                con la confianza que merecen.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de Misión y Visión */}
            <div className="row g-4 mb-5">
                <div className="col-lg-6">
                    <div 
                        className="card shadow-sm border-0 h-100"
                        style={{ borderRadius: '16px', overflow: 'hidden' }}
                    >
                        <div 
                            className="px-4 py-3 text-center"
                            style={{
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                color: 'white'
                            }}
                        >
                            <div className="mb-2">
                                <i className="bi bi-bullseye" style={{ fontSize: '2rem' }}></i>
                            </div>
                            <h4 className="mb-0" style={{ fontWeight: 600 }}>Nuestra Misión</h4>
                        </div>
                        <div className="card-body p-4">
                            <p className="mb-0" style={{ fontSize: '1rem', lineHeight: '1.6', color: '#2c3e50' }}>
                                Conectar de forma segura a inquilinos y propietarios, brindando una plataforma integral
                                que simplifica cada etapa del proceso inmobiliario, desde la búsqueda y reserva hasta la 
                                consultoría especializada.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div 
                        className="card shadow-sm border-0 h-100"
                        style={{ borderRadius: '16px', overflow: 'hidden' }}
                    >
                        <div 
                            className="px-4 py-3 text-center"
                            style={{
                                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                color: 'white'
                            }}
                        >
                            <div className="mb-2">
                                <i className="bi bi-eye-fill" style={{ fontSize: '2rem' }}></i>
                            </div>
                            <h4 className="mb-0" style={{ fontWeight: 600 }}>Nuestra Visión</h4>
                        </div>
                        <div className="card-body p-4">
                            <p className="mb-0" style={{ fontSize: '1rem', lineHeight: '1.6', color: '#2c3e50' }}>
                                Ser la plataforma de referencia en el mercado inmobiliario, reconocida por la confianza,
                                innovación y excelencia en el servicio, facilitando conexiones seguras y exitosas entre
                                todas las partes involucradas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de Valores */}
            <div className="row justify-content-center mb-5">
                <div className="col-lg-10">
                    <div 
                        className="card shadow-lg border-0"
                        style={{
                            borderRadius: '20px',
                            overflow: 'hidden'
                        }}
                    >
                        <div 
                            className="px-4 py-4 text-center"
                            style={{
                                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                color: '#2c3e50'
                            }}
                        >
                            <div className="mb-2">
                                <i className="bi bi-heart-fill" style={{ fontSize: '2.5rem' }}></i>
                            </div>
                            <h3 className="mb-0" style={{ fontWeight: 600 }}>Nuestros Valores</h3>
                        </div>

                        <div className="card-body p-4">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-start">
                                        <div 
                                            className="me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                borderRadius: '12px',
                                                color: 'white'
                                            }}
                                        >
                                            <i className="bi bi-shield-fill-check"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-2" style={{ fontWeight: 600, color: '#2c3e50' }}>
                                                Confianza y Seguridad
                                            </h6>
                                            <p className="mb-0 text-muted" style={{ fontSize: '0.95rem' }}>
                                                La protección de tus datos y transacciones es nuestra prioridad absoluta.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="d-flex align-items-start">
                                        <div 
                                            className="me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                                borderRadius: '12px',
                                                color: 'white'
                                            }}
                                        >
                                            <i className="bi bi-lightbulb-fill"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-2" style={{ fontWeight: 600, color: '#2c3e50' }}>
                                                Innovación Constante
                                            </h6>
                                            <p className="mb-0 text-muted" style={{ fontSize: '0.95rem' }}>
                                                Buscamos siempre las mejores herramientas para optimizar tu experiencia.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="d-flex align-items-start">
                                        <div 
                                            className="me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                                borderRadius: '12px',
                                                color: 'white'
                                            }}
                                        >
                                            <i className="bi bi-transparency"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-2" style={{ fontWeight: 600, color: '#2c3e50' }}>
                                                Transparencia Total
                                            </h6>
                                            <p className="mb-0 text-muted" style={{ fontSize: '0.95rem' }}>
                                                Información clara y precisa en cada paso del camino.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="d-flex align-items-start">
                                        <div 
                                            className="me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                                                borderRadius: '12px',
                                                color: '#2c3e50'
                                            }}
                                        >
                                            <i className="bi bi-person-hearts"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-2" style={{ fontWeight: 600, color: '#2c3e50' }}>
                                                Atención Personalizada
                                            </h6>
                                            <p className="mb-0 text-muted" style={{ fontSize: '0.95rem' }}>
                                                Estamos aquí para resolver tus dudas y ofrecerte el mejor asesoramiento.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;