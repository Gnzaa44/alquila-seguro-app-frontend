import React, { useEffect, useState } from "react";

import PropertiesService from "../services/PropertiesService";

import { Link } from "react-router-dom";



const PropertiesPage = () => {

  const [properties, setProperties] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);



  useEffect(() => {

    const fetchProperties = async () => {

      try {

        const response = await PropertiesService.getAllProperties();

        if (response.success) {

          // Asumiendo tu ApiResponse del backend

          setProperties(response.data);

        } else {

          setError(response.message || "Error al cargar propiedades.");

        }

      } catch (err) {

        setError(

          "No se pudieron cargar las propiedades. Verifica que el backend esté funcionando o inténtalo más tarde."

        );

        console.error("Error fetching properties:", err);

      } finally {

        setLoading(false);

      }

    };



    fetchProperties();

  }, []);



  if (loading) {

    return (

      <div className="text-center py-5">

        <div className="spinner-border text-primary" role="status">

          <span className="visually-hidden">Cargando propiedades...</span>

        </div>

        <p className="mt-2">Cargando propiedades...</p>

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

      <div className="text-center mb-4">

        <h2 className="mb-2">Nuestras Propiedades Destacadas</h2>

        <p className="lead text-muted d-inline-flex align-items-center">

          <i className="bi bi-patch-check-fill text-success fs-4 me-2"></i>

          Todas nuestras propiedades están verificadas para tu tranquilidad.

        </p>

      </div>

      {properties.length === 0 ? (

        <div className="text-center lead">

          No hay propiedades disponibles en este momento.

          <div className="my-5">

            <i

              className="bi bi-house-slash text-secondary"

              style={{ fontSize: "6rem", opacity: 0.25 }}

              aria-label="Sin propiedades"

            ></i>

          </div>

        </div>

      ) : (

        <div className="d-flex flex-column gap-3">

          {properties.map((property) => (

            <div className="card shadow-sm" key={property.id}>

              <div className="row g-0">

                {/* Imagen */}

                <div className="col-md-4">

                  <img

                    src={

                      property.imageUrls && property.imageUrls.length > 0

                        ? property.imageUrls[0]

                        : "https://via.placeholder.com/300x200?text=Propiedad"

                    }

                    alt={property.title}

                    className="img-fluid rounded-start h-100 w-100"

                    style={{ 

                      objectFit: "cover", 

                      minHeight: "200px",

                      maxHeight: "250px"

                    }}

                    loading="lazy"

                  />

                </div>

                

                {/* Contenido */}

                <div className="col-md-8">

                  <div className="card-body h-100 d-flex flex-column">

                    <div className="flex-grow-1">

                      <h5 className="card-title mb-2">{property.title}</h5>

                      

                      <div className="text-muted mb-2">

                        <i className="bi bi-geo-alt-fill me-1 text-primary"></i>

                        {property.location}

                      </div>

                      

                      {/* Características */}

                      <div className="d-flex flex-wrap gap-3 mb-3 text-sm">

                        <span className="d-flex align-items-center">

                          <i className="bi bi-door-open-fill me-1 text-secondary"></i>

                          {property.numberOfRooms} Dormitorios

                        </span>

                        <span className="d-flex align-items-center">

                          <i className="bi bi-droplet-fill me-1 text-secondary"></i>

                          {property.numberOfBathrooms} Baños

                        </span>

                        <span className="d-flex align-items-center">

                          <i className="bi bi-rulers me-1 text-secondary"></i>

                          {property.size} m²

                        </span>

                      </div>

                    </div>

                    

                    {/* Precio y botón */}

                    <div className="d-flex justify-content-between align-items-center">

                      <div>

                        <span className="h5 text-primary fw-bold mb-0">

                          ${property.pricePerNight}

                        </span>

                        <small className="text-muted"> / noche</small>

                      </div>

                      

                      <Link

                        to={`/propiedades/${property.id}`}

                        className="btn btn-warning fw-bold px-4"

                      >

                        Ver más

                      </Link>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};



export default PropertiesPage;