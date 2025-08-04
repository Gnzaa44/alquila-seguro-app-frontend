import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/AuthService";
import PropertiesService from "../services/PropertiesService";
import ReservationsService from "../services/ReservationsService";
import ConsultancyService from "../services/ConsultancyService";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [consultancies, setConsultancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Propiedades
        const propResponse = await PropertiesService.getAllProperties();
        if (propResponse.success) {
          setProperties(propResponse.data);
        } else {
          console.error(
            "Error al cargar propiedades para admin:",
            propResponse.message
          );
        }

        // Reservas
        const resResponse = await ReservationsService.getAllReservations();
        if (resResponse.success) {
          setReservations(resResponse.data);
        } else {
          console.error(
            "Error al cargar reservas para admin:",
            resResponse.message
          );
        }

        // Consultorías
        const consResponse = await ConsultancyService.getAllConsultancies();
        if (consResponse.success) {
          setConsultancies(consResponse.data);
        } else {
          console.error(
            "Error al cargar consultorías para admin:",
            consResponse.message
          );
        }
      } catch (err) {
        setError(
          "Error de conexión al cargar datos del panel: " +
            (err.response?.data?.message || err.message)
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleDeleteProperty = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta propiedad?")
    ) {
      try {
        await PropertiesService.deleteProperty(id);
        setProperties(properties.filter((prop) => prop.id !== id));
        alert("Propiedad eliminada exitosamente.");
      } catch (err) {
        alert(
          "Error al eliminar propiedad: " +
            (err.response?.data?.message || err.message)
        );
        console.error(err);
      }
    }
  };
  const consultanciesToShow = consultancies.filter(
    (cons) => cons.status === "CONFIRMED" || cons.status === "RESPONDED"
  );
  const reservationsToShow = reservations.filter(
    (res) => res.status === "CONFIRMED" || res.status === "COMPLETED"
  );

  const handleConfirmReservation = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres CONFIRMAR esta reserva?")
    ) {
      try {
        await ReservationsService.confirmReservation(id);
        setReservations(
          reservations.map((res) =>
            res.id === id ? { ...res, status: "CONFIRMED" } : res
          )
        );
        alert("Reserva confirmada exitosamente.");
      } catch (err) {
        alert(
          "Error al confirmar reserva: " +
            (err.response?.data?.message || err.message)
        );
        console.error(err);
      }
    }
  };

  const handleCompleteReservation = async (id) => {
    const reserva = reservations.find((r) => r.id === id);
    if (reserva && reserva.status !== "CONFIRMED") {
      alert("Solo puedes completar reservas confirmadas.");
      return;
    }
    if (window.confirm("¿Marcar esta reserva como COMPLETADA?")) {
      try {
        await ReservationsService.completeReservation(id);
        setReservations(
          reservations.map((res) =>
            res.id === id ? { ...res, status: "COMPLETED" } : res
          )
        );
        alert("Reserva marcada como completada.");
      } catch (err) {
        alert(
          "Error al completar reserva: " +
            (err.response?.data?.message || err.message)
        );
        console.error(err);
      }
    }
  };
  const handleCancelReservation = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres CANCELAR esta reserva?")) {
      try {
        await ReservationsService.cancelReservation(id);
        setReservations(
          reservations.map((res) =>
            res.id === id ? { ...res, status: "CANCELLED" } : res
          )
        );
        alert("Reserva cancelada exitosamente.");
      } catch (err) {
        alert(
          "Error al cancelar reserva: " +
            (err.response?.data?.message || err.message)
        );
        console.error(err);
      }
    }
  };

  const handleMarkConsultancyReviewed = async (id) => {
    if (window.confirm("¿Marcar esta consultoría como revisada?")) {
      try {
        await ConsultancyService.markConsultancyAsReviewed(id);
        setConsultancies(
          consultancies.map((cons) =>
            cons.id === id ? { ...cons, status: "REVIEWED" } : cons
          )
        );
        alert("Consultoría marcada como revisada.");
      } catch (err) {
        alert(
          "Error al marcar consultoría: " +
            (err.response?.data?.message || err.message)
        );
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando panel...</span>
        </div>
        <p className="mt-2">Cargando datos del panel de administración...</p>
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

  return (
    <div className="py-4">
      <h2 className="mb-4 text-center text-primary">Panel de Administración</h2>
      <p className="lead text-center mb-5">
        Gestión completa de propiedades, reservas y consultas.
      </p>

      {/* Gestión de Propiedades */}
      <div className="card shadow-sm p-4 mb-5">
        <h3 className="mb-3 text-info">Gestión de Propiedades</h3>
        <Link to="/admin/properties/new" className="btn btn-success mb-3">
          <i className="bi bi-plus-circle me-2"></i> Añadir Nueva Propiedad
        </Link>
        {properties.length === 0 ? (
          <p className="text-center">No hay propiedades para gestionar.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Dirección</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td>{property.id}</td>
                    <td>{property.title}</td>
                    <td>{property.location}</td>
                    <td>${property.pricePerNight}</td>
                    <td>
                      <Link
                        to={`/admin/properties/edit/${property.id}`}
                        className="btn btn-sm btn-warning me-2"
                      >
                        <i className="bi bi-pencil-square"></i> Editar
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteProperty(property.id)}
                      >
                        <i className="bi bi-trash-fill"></i> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Gestión de Reservas */}
      <div className="card shadow-sm p-4 mb-5">
        <h3 className="mb-3 text-info">Gestión de Reservas</h3>
        {reservations.length === 0 ? (
          <p className="text-center">No hay reservas para gestionar.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Propiedad</th>
                  <th>Cliente</th>
                  <th>Fechas</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservationsToShow.map((res) => (
                  <tr key={res.id}>
                    <td>{res.id}</td>
                    <td>
                      <Link to={`/properties/${res.property.id}`}>
                        {res.property.title}
                      </Link>
                    </td>
                    <td>
                      {res.client.firstName} {res.client.lastName} (
                      {res.client.email})
                    </td>
                    <td>
                      {res.startDate} a {res.endDate}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          res.status === "CONFIRMED"
                            ? "bg-success"
                            : res.status === "COMPLETED"
                            ? "bg-primary"
                            : res.status === "CANCELLED"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td>
                      {res.status === "CONFIRMED" && (
                        <>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleCompleteReservation(res.id)}
                          >
                            <i className="bi bi-check2-circle"></i> Completar
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleCancelReservation(res.id)}
                          >
                            <i className="bi bi-x-circle-fill"></i> Cancelar
                          </button>
                        </>
                      )}
                      {res.status === "COMPLETED" && (
                        <span className="text-success">Completada</span>
                      )}
                      {res.status === "CANCELLED" && (
                        <span className="text-danger">Cancelada</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Gestión de Consultorías */}
      <div className="card shadow-sm p-4">
        <h3 className="mb-3 text-info">Gestión de Consultorías</h3>
        {consultancies.length === 0 ? (
          <p className="text-center">No hay consultorías para gestionar.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Consulta</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {consultanciesToShow.map((cons) => (
                  <tr key={cons.id}>
                    <td>{cons.id}</td>
                    <td>
                      {cons.client.firstName} {cons.client.lastName} (
                      {cons.client.email})
                    </td>
                    <td>{cons.details?.substring(0, 100) || ""}...</td>
                    <td>
                      <span
                        className={`badge ${
                          cons.status === "CONFIRMED"
                            ? "bg-success"
                            : cons.status === "RESPONDED"
                            ? "bg-info"
                            : "bg-secondary"
                        }`}
                      >
                        {cons.status}
                      </span>
                    </td>
                    <td>
                      {cons.status === "CONFIRMED" && (
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => handleMarkConsultancyReviewed(cons.id)}
                        >
                          <i className="bi bi-check-lg"></i> Marcar como
                          Respondida
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
