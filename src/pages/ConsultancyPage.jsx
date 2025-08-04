import React, { useState, useEffect } from "react";
import ConsultancyService from "../services/ConsultancyService";
import PaymentsService from "../services/PaymentsService";
import { Wallet, initMercadoPago } from "@mercadopago/sdk-react";

const ConsultancyPage = () => {
  const [formData, setFormData] = useState({
    clientFirstName: "",
    clientLastName: "",
    clientEmail: "",
    clientPhone: "",
    details: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [formBlocked, setFormBlocked] = useState(false);

  useEffect(() => {
    initMercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY);
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitConsultancy = async (e) => {
    e.preventDefault();
    if (loading || formBlocked) return;
    setFormBlocked(true);
    setMessage("");
    setIsError(false);
    
    // Validación: todos los campos obligatorios
    if (
      !formData.clientFirstName.trim() ||
      !formData.clientLastName.trim() ||
      !formData.clientEmail.trim() ||
      !formData.clientPhone.trim() ||
      !formData.details.trim()
    ) {
      setIsError(true);
      setMessage("Por favor, completa todos los campos.");
      setFormBlocked(false);
      return;
    }
    setLoading(true);

    try {
      // 1. Crear la solicitud de consultoría en tu backend
      const consultancyResponse = await ConsultancyService.createConsultancy(
        formData
      );

      if (consultancyResponse.success) {
        // 2. Si la solicitud es exitosa, solicitar la preferencia de pago a Mercado Pago
        const preferenceResponse =
          await PaymentsService.createConsultancyPreference(
            consultancyResponse.data.id
          );

        if (preferenceResponse.success && preferenceResponse.data) {
          // 3. Redirigir al usuario al flujo de pago de Mercado Pago
          setPreferenceId(preferenceResponse.data);
        } else {
          setIsError(true);
          setMessage(
            preferenceResponse.message ||
              "Error al iniciar el proceso de pago para la consultoría."
          );
          setFormBlocked(false);
        }
      } else {
        setIsError(true);
        setMessage(
          consultancyResponse.message ||
            "Hubo un error al enviar tu consulta. Por favor, inténtalo de nuevo."
        );
        setFormBlocked(false);
      }
    } catch (err) {
      setIsError(true);
      setMessage(
        "Error de conexión o datos inválidos. Por favor, inténtalo de nuevo más tarde."
      );
      setFormBlocked(false);
      console.error(
        "Error during consultancy process:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

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
            <i className="bi bi-shield-check" style={{ fontSize: '3rem' }}></i>
          </div>
          <h1 className="mb-3" style={{ fontWeight: 700, fontSize: '2.5rem' }}>
            AlquilaSeguro
          </h1>
          <p className="lead mb-0" style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
            Tu aliado de confianza para alquilar a distancia, sin riesgos
          </p>
        </div>
      </div>

      {/* Sección de beneficios */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <div className="card-body p-4">
              <h3 className="mb-4 text-center" style={{ fontWeight: 600, color: '#2c3e50' }}>
                ¿Vas a alquilar una propiedad desde lejos?
              </h3>
              <p className="text-center text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                Estamos para ayudarte. Verificamos por vos todo lo que necesitás saber
              </p>
              
              <div className="row g-4">
                <div className="col-md-3">
                  <div className="text-center p-3">
                    <div 
                      className="mb-3 mx-auto d-flex align-items-center justify-content-center"
                      style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        borderRadius: '50%',
                        color: 'white'
                      }}
                    >
                      <i className="bi bi-person-check" style={{ fontSize: '1.5rem' }}></i>
                    </div>
                    <h6 style={{ fontWeight: 600, color: '#2c3e50' }}>Identidad Verificada</h6>
                    <p className="small text-muted mb-0">Propietario o inmobiliaria</p>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="text-center p-3">
                    <div 
                      className="mb-3 mx-auto d-flex align-items-center justify-content-center"
                      style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        borderRadius: '50%',
                        color: 'white'
                      }}
                    >
                      <i className="bi bi-file-earmark-check" style={{ fontSize: '1.5rem' }}></i>
                    </div>
                    <h6 style={{ fontWeight: 600, color: '#2c3e50' }}>Documentación</h6>
                    <p className="small text-muted mb-0">Del inmueble completa</p>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="text-center p-3">
                    <div 
                      className="mb-3 mx-auto d-flex align-items-center justify-content-center"
                      style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                        borderRadius: '50%',
                        color: '#2c3e50'
                      }}
                    >
                      <i className="bi bi-house-check" style={{ fontSize: '1.5rem' }}></i>
                    </div>
                    <h6 style={{ fontWeight: 600, color: '#2c3e50' }}>Propiedad Real</h6>
                    <p className="small text-muted mb-0">Existencia y estado</p>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="text-center p-3">
                    <div 
                      className="mb-3 mx-auto d-flex align-items-center justify-content-center"
                      style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                        borderRadius: '50%',
                        color: '#2c3e50'
                      }}
                    >
                      <i className="bi bi-clipboard-check" style={{ fontSize: '1.5rem' }}></i>
                    </div>
                    <h6 style={{ fontWeight: 600, color: '#2c3e50' }}>Contratos Legales</h6>
                    <p className="small text-muted mb-0">Claros y seguros</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Precio de la consultoría */}
      <div className="d-flex justify-content-center mb-4">
        <div
          className="shadow-lg px-4 py-3 rounded-4 text-center"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.5rem',
            letterSpacing: '1px',
            boxShadow: '0 4px 20px rgba(102,126,234,0.15)',
            minWidth: '220px'
          }}
        >
          <i className="bi bi-cash-coin me-2" style={{fontSize: '2rem', verticalAlign: 'middle'}}></i>
          Consultoría: <span style={{fontWeight:900}}>AR$ 50.000</span>
        </div>
      </div>

      {/* Formulario principal */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div 
            className="card shadow-lg border-0"
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'white'
            }}
          >
            {/* Header del formulario */}
            <div 
              className="px-4 py-4 text-center"
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white'
              }}
            >
              <h3 className="mb-2" style={{ fontWeight: 600 }}>
                Solicitar Consultoría
              </h3>
              <p className="mb-0 opacity-90">
                Completa el formulario y te contactaremos por email. No olvides revisar tu bandeja de entrada y spam.
              </p>
            </div>

            <div className="p-4">
              {message && (
                <div
                  className={`alert ${
                    isError ? "alert-danger" : "alert-success"
                  } border-0 rounded-3 mb-4`}
                  role="alert"
                  style={{
                    background: isError 
                      ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' 
                      : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    border: 'none'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <i className={`bi ${isError ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
                    {message}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitConsultancy}>
                {/* Datos personales en grid */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label htmlFor="clientFirstName" className="form-label fw-semibold text-dark">
                      Nombre
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control form-control-lg border-0 shadow-sm"
                        id="clientFirstName"
                        name="clientFirstName"
                        value={formData.clientFirstName}
                        onChange={handleFormChange}
                        required
                        style={{
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          border: '2px solid transparent',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.borderColor = '#667eea';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = '#f8f9fa';
                          e.target.style.borderColor = 'transparent';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="clientLastName" className="form-label fw-semibold text-dark">
                      Apellido
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control form-control-lg border-0 shadow-sm"
                        id="clientLastName"
                        name="clientLastName"
                        value={formData.clientLastName}
                        onChange={handleFormChange}
                        required
                        style={{
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          border: '2px solid transparent',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.borderColor = '#667eea';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = '#f8f9fa';
                          e.target.style.borderColor = 'transparent';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Email y teléfono */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label htmlFor="clientEmail" className="form-label fw-semibold text-dark">
                      Email
                    </label>
                    <div className="position-relative">
                      <input
                        type="email"
                        className="form-control form-control-lg border-0 shadow-sm"
                        id="clientEmail"
                        name="clientEmail"
                        value={formData.clientEmail}
                        onChange={handleFormChange}
                        required
                        style={{
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          border: '2px solid transparent',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.borderColor = '#667eea';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = '#f8f9fa';
                          e.target.style.borderColor = 'transparent';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="clientPhone" className="form-label fw-semibold text-dark">
                      Teléfono
                    </label>
                    <div className="position-relative">
                      <input
                        type="tel"
                        className="form-control form-control-lg border-0 shadow-sm"
                        id="clientPhone"
                        name="clientPhone"
                        value={formData.clientPhone}
                        onChange={handleFormChange}
                        required
                        style={{
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          border: '2px solid transparent',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.borderColor = '#667eea';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = '#f8f9fa';
                          e.target.style.borderColor = 'transparent';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Área de texto para detalles */}
                <div className="mb-4">
                  <label htmlFor="details" className="form-label fw-semibold text-dark">
                    Detalles de tu Consulta
                  </label>
                  <textarea
                    className="form-control form-control-lg border-0 shadow-sm"
                    id="details"
                    name="details"
                    rows="6"
                    value={formData.details}
                    onChange={handleFormChange}
                    placeholder="Contanos sobre la propiedad que querés alquilar, tu situación particular, o cualquier duda específica que tengas..."
                    required
                    style={{
                      borderRadius: '12px',
                      backgroundColor: '#f8f9fa',
                      border: '2px solid transparent',
                      transition: 'all 0.3s ease',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.borderColor = 'transparent';
                      e.target.style.boxShadow = 'none';
                    }}
                  ></textarea>
                </div>

                {/* Botón de pago o wallet */}
                {preferenceId ? (
                  <div className="text-center">
                    <div className="mb-3">
                      <div 
                        className="p-3 rounded-3 d-inline-block"
                        style={{
                          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                          color: '#2c3e50'
                        }}
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        ¡Solicitud creada! Procede con el pago para completar tu consultoría
                      </div>
                    </div>
                    <Wallet initialization={{ preferenceId }} />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-lg w-100 fw-semibold border-0"
                    disabled={loading || formBlocked}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '16px',
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading && !formBlocked) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-credit-card me-2"></i>
                        Pagar y Enviar Consulta
                      </>
                    )}
                  </button>
                )}

                {/* Información adicional */}
                <div className="text-center mt-4">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="d-flex align-items-center justify-content-center text-muted">
                        <i className="bi bi-laptop me-2"></i>
                        <small>100% Online</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex align-items-center justify-content-center text-muted">
                        <i className="bi bi-headset me-2"></i>
                        <small>Atención Personalizada</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex align-items-center justify-content-center text-muted">
                        <i className="bi bi-shield-lock me-2"></i>
                        <small>Confidencialidad</small>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultancyPage;