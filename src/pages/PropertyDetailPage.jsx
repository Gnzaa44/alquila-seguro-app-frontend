import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PropertiesService from "../services/PropertiesService";
import ReservationsService from "../services/ReservationsService";
import PaymentsService from "../services/PaymentsService";
import AuthService from "../services/AuthService";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import Carousel from "react-bootstrap/Carousel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
}

// Componente Modal personalizado para las imágenes
const ImageModal = ({ isOpen, onClose, images, currentIndex, setCurrentIndex }) => {
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "rgba(255, 255, 255, 0.2)",
          border: "none",
          color: "white",
          fontSize: "24px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ×
      </button>
      
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            style={{
              position: "absolute",
              left: "20px",
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "white",
              fontSize: "24px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ‹
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            style={{
              position: "absolute",
              right: "20px",
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "white",
              fontSize: "24px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ›
          </button>
        </>
      )}
      
      <img
        src={images[currentIndex]}
        alt={`Imagen ${currentIndex + 1}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          objectFit: "contain",
        }}
      />
      
      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            background: "rgba(0, 0, 0, 0.5)",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "14px",
          }}
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingMessage, setBookingMessage] = useState("");
  const [isBookingError, setIsBookingError] = useState(false);
  const [formBlocked, setFormBlocked] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);

  // Estados para mostrar más detalles
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);

  // Estados para el modal de imágenes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Estado para el calendario de reservas
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reservedDates, setReservedDates] = useState([]);

  // Estado para mostrar formulario de datos del cliente
  const [showGuestForm, setShowGuestForm] = useState(false);

  // Estado para el formulario de reserva
  const [formData, setFormData] = useState({
    clientFirstName: "",
    clientLastName: "",
    clientEmail: "",
    clientPhone: "",
  });

  useEffect(() => {
    initMercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY);
  }, []);

  const [preferenceId, setPreferenceId] = useState(null);
  const currentUser = AuthService.getCurrentUser();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propResponse = await PropertiesService.getPropertyById(id);
        if (propResponse.success) setProperty(propResponse.data);
        else setError(propResponse.message || "Propiedad no encontrada.");

        const resResponse = await ReservationsService.getReservationsByPropertyId(id);
        if (resResponse.success) {
          const allDates = [];
          resResponse.data
            .filter((reserva) => reserva.status === "CONFIRMED")
            .forEach((reserva) => {
              let current = new Date(reserva.startDate);
              const end = new Date(reserva.endDate);
              current.setHours(0, 0, 0, 0);
              end.setHours(0, 0, 0, 0);
              while (current <= end) {
                allDates.push(new Date(current));
                current.setDate(current.getDate() + 1);
              }
            });
          setReservedDates(allDates);
        }
      } catch (err) {
        setError("No se pudo cargar la propiedad o reservas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const isDateAvailable = (date) => {
    return !reservedDates.some(
      (reserved) =>
        date.getFullYear() === reserved.getFullYear() &&
        date.getMonth() === reserved.getMonth() &&
        date.getDate() === reserved.getDate()
    );
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  // Calcular noches y precio total
  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * (property?.pricePerNight || 0);
  };

  const handleDateSelection = () => {
    if (startDate && endDate) {
      setShowGuestForm(true);
    }
  };

  useEffect(() => {
    handleDateSelection();
  }, [startDate, endDate]);

  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    if (formBlocked) return;
    setFormBlocked(true);
    setReservationLoading(true);
    setBookingMessage("");
    setIsBookingError(false);

    if (!startDate || !endDate) {
      setBookingMessage("Por favor, selecciona las fechas de entrada y salida.");
      setIsBookingError(true);
      setFormBlocked(false);
      setReservationLoading(false);
      return;
    }

    if (startDate >= endDate) {
      setBookingMessage("La fecha de salida debe ser posterior a la fecha de entrada.");
      setIsBookingError(true);
      setFormBlocked(false);
      setReservationLoading(false);
      return;
    }

    try {
      const reservationData = {
        propertyId: property.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        clientFirstName: formData.clientFirstName,
        clientLastName: formData.clientLastName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
      };
      const reservationResponse = await ReservationsService.createReservation(reservationData);

      if (reservationResponse.success) {
        const preferenceResponse = await PaymentsService.createReservationPreference(
          reservationResponse.data.id
        );

        if (preferenceResponse.success && preferenceResponse.data) {
          setPreferenceId(preferenceResponse.data);
        } else {
          setIsBookingError(true);
          setBookingMessage(
            preferenceResponse.message || "Error al iniciar el proceso de pago con Mercado Pago."
          );
          setFormBlocked(false);
          setReservationLoading(false);
        }
      } else {
        setIsBookingError(true);
        setBookingMessage(
          reservationResponse.message || "Hubo un problema al crear tu reserva. Verifica las fechas."
        );
        setFormBlocked(false);
        setReservationLoading(false);
      }
    } catch (err) {
      setIsBookingError(true);
      setBookingMessage("Error al procesar tu solicitud. Intenta de nuevo más tarde.");
      setFormBlocked(false);
      setReservationLoading(false);
      console.error("Error during reservation process:", err.response?.data || err.message);
    }
  };

  const renderDesktopGallery = () => {
    if (!property.imageUrls || property.imageUrls.length === 0) return null;

    const images = property.imageUrls;
    const imageStyle = {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(44,62,80,0.08)",
      border: "1px solid #e3e6ee",
      background: "#f7f8fa",
      cursor: "pointer",
      display: "block",
    };

    const gridStyle = {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr",
      gridTemplateRows: "160px 160px",
      gap: "8px",
      width: "100%",
      maxWidth: "1200px",
      margin: "32px auto 40px auto",
      borderRadius: "16px",
      background: "#f7f8fa",
      padding: "8px",
      boxSizing: "border-box",
      overflow: "hidden",
      position: "relative",
    };

    if (images.length === 1) {
      return (
        <div style={gridStyle}>
          <div style={{ gridColumn: "1 / 4", gridRow: "1 / 3", position: "relative" }}>
            <img
              src={images[0]}
              alt="Imagen principal"
              style={imageStyle}
              onClick={() => handleImageClick(0)}
            />
          </div>
        </div>
      );
    }

    if (images.length === 2) {
      return (
        <div style={gridStyle}>
          <div style={{ gridColumn: "1 / 3", gridRow: "1 / 3", position: "relative" }}>
            <img
              src={images[0]}
              alt="Imagen 1"
              style={imageStyle}
              onClick={() => handleImageClick(0)}
            />
          </div>
          <div style={{ gridColumn: "3 / 4", gridRow: "1 / 3", position: "relative" }}>
            <img
              src={images[1]}
              alt="Imagen 2"
              style={imageStyle}
              onClick={() => handleImageClick(1)}
            />
          </div>
        </div>
      );
    }

    // Para 3 o más imágenes
    return (
      <div style={gridStyle}>
        <div style={{ gridColumn: "1 / 2", gridRow: "1 / 3", position: "relative" }}>
          <img
            src={images[0]}
            alt="Imagen 1"
            style={imageStyle}
            onClick={() => handleImageClick(0)}
          />
        </div>
        <div style={{ gridColumn: "2 / 3", gridRow: "1 / 2", position: "relative" }}>
          <img
            src={images[1]}
            alt="Imagen 2"
            style={imageStyle}
            onClick={() => handleImageClick(1)}
          />
        </div>
        <div style={{ gridColumn: "3 / 4", gridRow: "1 / 2", position: "relative" }}>
          <img
            src={images[2]}
            alt="Imagen 3"
            style={imageStyle}
            onClick={() => handleImageClick(2)}
          />
        </div>
        <div style={{ gridColumn: "2 / 3", gridRow: "2 / 3", position: "relative" }}>
          {images.length > 3 ? (
            <img
              src={images[3]}
              alt="Imagen 4"
              style={imageStyle}
              onClick={() => handleImageClick(3)}
            />
          ) : (
            <div style={{ gridColumn: "2 / 4", gridRow: "2 / 3" }}>
              <img
                src={images[2]}
                alt="Imagen 3"
                style={imageStyle}
                onClick={() => handleImageClick(2)}
              />
            </div>
          )}
        </div>
        <div style={{ gridColumn: "3 / 4", gridRow: "2 / 3", position: "relative" }}>
          {images.length > 4 ? (
            <>
              <img
                src={images[4]}
                alt={`Imagen 5`}
                style={{
                  ...imageStyle,
                  filter: images.length > 5 ? "brightness(0.7)" : "none",
                }}
                onClick={() => handleImageClick(4)}
              />
              {images.length > 5 && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.45)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => handleImageClick(4)}
                >
                  Ver +{images.length - 5} fotos
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando detalles de la propiedad...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center py-3" role="alert">
        {error}
      </div>
    );
  }

  if (!property) {
    return (
      <div className="alert alert-info text-center py-3" role="alert">
        Propiedad no encontrada.
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Galería para desktop */}
      {!isMobile && renderDesktopGallery()}

      {/* Carrusel para móvil */}
      {isMobile && property.imageUrls && property.imageUrls.length > 0 && (
        <Carousel className="mb-4">
          {property.imageUrls.map((url, idx) => (
            <Carousel.Item key={idx}>
              <img
                src={url}
                alt={`Imagen ${idx + 1}`}
                className="d-block w-100"
                style={{
                  height: "220px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  background: "#f7f8fa",
                }}
                onClick={() => handleImageClick(idx)}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      {/* Modal de imágenes */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={property.imageUrls || []}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />

      <div className="row">
        <div className="col-md-8">
          {/* Título y ubicación */}
          <div className="mb-4">
            <h1 className="h2 mb-2" style={{ fontWeight: 600 }}>
              {property.title}
            </h1>
            <div className="d-flex align-items-center text-muted mb-2">
              <i className="bi bi-geo-alt-fill me-2"></i>
              <span>{property.location}</span>
            </div>
            <div className="d-flex align-items-center gap-3 text-sm">
              <span><i className="bi bi-door-open-fill me-1"></i>{property.numberOfRooms} dormitorios</span>
              <span><i className="bi bi-droplet-fill me-1"></i>{property.numberOfBathrooms} baños</span>
              <span><i className="bi bi-rulers me-1"></i>{property.size} m²</span>
            </div>
          </div>

          {/* Descripción con Ver más */}
          <div className="card shadow-sm p-4 mb-4">
            <h4 className="mb-3">Descripción</h4>
            <p className="mb-3">
              {showFullDescription 
                ? property.description 
                : `${property.description?.substring(0, 200)}${property.description?.length > 200 ? '...' : ''}`
              }
            </p>
            {property.description?.length > 200 && (
              <button 
                className="btn btn-link p-0 text-primary fw-bold"
                onClick={() => setShowFullDescription(!showFullDescription)}
                style={{ textDecoration: 'underline' }}
              >
                {showFullDescription ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </div>

          {/* Comodidades */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="card shadow-sm p-4 mb-4">
              <h4 className="mb-3">Lo que incluye este lugar</h4>
              <div className="row">
                {property.amenities.slice(0, showAmenities ? property.amenities.length : 8).map((amenity, index) => (
                  <div key={index} className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <span>{amenity}</span>
                    </div>
                  </div>
                ))}
              </div>
              {property.amenities.length > 8 && (
                <button 
                  className="btn btn-outline-primary mt-3"
                  onClick={() => setShowAmenities(!showAmenities)}
                >
                  {showAmenities ? 'Ver menos comodidades' : `Ver las ${property.amenities.length} comodidades`}
                </button>
              )}
            </div>
          )}

          {/* Características adicionales */}
          {property.features && property.features.length > 0 && (
            <div className="card shadow-sm p-4 mb-4">
              <h4 className="mb-3">Características</h4>
              <div className="d-flex flex-wrap gap-2">
                {property.features.map((feature, index) => (
                  <span key={index} className="badge bg-light text-dark border px-3 py-2">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-md-4">
          <div
            className="card shadow-lg sticky-top"
            style={{
              top: "80px",
              borderRadius: "12px",
              border: "1px solid #e0e0e0",
            }}
          >
            {/* Precio destacado */}
            <div className="p-4 border-bottom">
              <div className="d-flex align-items-baseline">
                <span className="h3 mb-0 fw-bold">${property.pricePerNight}</span>
                <span className="text-muted ms-1"> por noche</span>
              </div>
            </div>

            <div className="p-4">
              {/* Selector de fechas */}
              <div className="border rounded mb-3">
                <div className="row g-0">
                  <div className="col-6 border-end">
                    <div className="p-3">
                      <label className="form-label small text-uppercase fw-bold">Check-in</label>
                      <DatePicker
                        selected={startDate}
                        onChange={setStartDate}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="dd/MM/yyyy"
                        className="form-control border-0 p-0"
                        placeholderText="Fecha"
                        minDate={new Date()}
                        filterDate={isDateAvailable}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3">
                      <label className="form-label small text-uppercase fw-bold">Check-out</label>
                      <DatePicker
                        selected={endDate}
                        onChange={setEndDate}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate || new Date()}
                        dateFormat="dd/MM/yyyy"
                        className="form-control border-0 p-0"
                        placeholderText="Fecha"
                        filterDate={isDateAvailable}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen de precio */}
              {startDate && endDate && (
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>${property.pricePerNight} × {calculateNights()} noches</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              )}

              {/* Formulario de datos del huésped */}
              {showGuestForm && (
                <form onSubmit={handleSubmitReservation}>
                  <div className="border-top pt-3 mb-3">
                    <h6 className="mb-3">Datos del huésped</h6>
                    <div className="row g-2">
                      <div className="col-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nombre"
                          name="clientFirstName"
                          value={formData.clientFirstName}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Apellido"
                          name="clientLastName"
                          value={formData.clientLastName}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="col-12">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          name="clientEmail"
                          value={formData.clientEmail}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="col-12">
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="Teléfono"
                          name="clientPhone"
                          value={formData.clientPhone}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {bookingMessage && (
                    <div
                      className={`alert ${
                        isBookingError ? "alert-danger" : "alert-success"
                      } py-2 mb-3`}
                      role="alert"
                    >
                      <small>{bookingMessage}</small>
                    </div>
                  )}

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
                          ¡Reserva creada! Procede con el pago para completar tu reserva
                        </div>
                      </div>
                      <Wallet initialization={{ preferenceId }} />
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3 fw-bold"
                      style={{
                        background: "#0066cc",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                      }}
                      disabled={formBlocked}
                    >
                      {reservationLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Procesando...
                        </>
                      ) : (
                        "Reservar"
                      )}
                    </button>
                  )}
                </form>
              )}

              {/* Botón inicial si no hay fechas */}
              {!showGuestForm && (
                <button
                  className="btn btn-primary w-100 py-3 fw-bold"
                  style={{
                    background: "#0066cc",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                  }}
                  disabled={!startDate || !endDate}
                >
                  {!startDate || !endDate ? 'Selecciona las fechas' : 'Continuar'}
                </button>
              )}

              <div className="text-center mt-3">
                <small className="text-muted">No se realizará ningún cargo por ahora</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;