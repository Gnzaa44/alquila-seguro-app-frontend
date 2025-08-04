import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropertiesService from "../services/PropertiesService";

const initialState = {
  title: "",
  description: "",
  location: "",
  pricePerNight: "",
  category: "",
  latitude: "",
  longitude: "",
  numberOfRooms: "",
  numberOfBathrooms: "",
  size: "",
  features: "",
  amenities: "",
  imageUrls: "",
  propertyStatus: "AVAILABLE",
};

const propertyStatusOptions = ["AVAILABLE", "RESERVED", "UNAVAILABLE"];

const AdminPropertyFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchProperty = async () => {
        setLoading(true);
        try {
          const response = await PropertiesService.getPropertyById(id);
          if (response.success && response.data) {
            setFormData({
              ...initialState,
              ...response.data,
              features: Array.isArray(response.data.features)
                ? response.data.features.join(", ")
                : "",
              amenities: Array.isArray(response.data.amenities)
                ? response.data.amenities.join(", ")
                : "",
              imageUrls: Array.isArray(response.data.imageUrls)
                ? response.data.imageUrls.join(", ")
                : typeof response.data.imageUrls === "string"
                ? response.data.imageUrls.replace(/[\[\]]/g, "")
                : "",
              latitude: response.data.latitude ?? "",
              longitude: response.data.longitude ?? "",
              size: response.data.size ?? "",
              pricePerNight: response.data.pricePerNight ?? "",
              numberOfRooms: response.data.numberOfRooms ?? "",
              numberOfBathrooms: response.data.numberOfBathrooms ?? "",
              propertyStatus: response.data.propertyStatus ?? "AVAILABLE",
            });
          } else {
            setError(
              response.message || "Error al cargar datos de la propiedad."
            );
          }
        } catch (err) {
          setError("No se pudo cargar la propiedad para edición.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    } else {
      setIsEditMode(false);
      setFormData(initialState);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...formData,
        pricePerNight: formData.pricePerNight
          ? Number(formData.pricePerNight)
          : null,
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
        size: formData.size ? Number(formData.size) : null,
        numberOfRooms: formData.numberOfRooms
          ? Number(formData.numberOfRooms)
          : null,
        numberOfBathrooms: formData.numberOfBathrooms
          ? Number(formData.numberOfBathrooms)
          : null,
        features: formData.features
          ? formData.features
              .split(",")
              .map((f) => f.trim())
              .filter(Boolean)
          : [],
        amenities: formData.amenities
          ? formData.amenities
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : [],
        imageUrls: formData.imageUrls
          ? formData.imageUrls
              .replace(/[\[\]]/g, "") // Elimina corchetes si el usuario los pone
              .split(",")
              .map((url) => {
                const trimmed = url.trim();
                if (
                  trimmed &&
                  !trimmed.startsWith("http") &&
                  !trimmed.startsWith("/")
                ) {
                  return "/" + trimmed;
                }
                return trimmed;
              })
              .filter(Boolean)
          : [],
      };

      let response;
      if (isEditMode) {
        response = await PropertiesService.updateProperty(id, payload);
      } else {
        response = await PropertiesService.createProperty(payload);
      }

      if (response.success) {
        navigate("/admin");
      } else {
        setError(response.message || "Error al guardar la propiedad.");
      }
    } catch (err) {
      setError("Error inesperado al guardar la propiedad.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">
        {isEditMode ? "Editar Propiedad" : "Nueva Propiedad"}
      </h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <form onSubmit={handleSubmit} className="card shadow-sm p-4">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Título
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Descripción
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={formData.description || ""}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Ubicación
            </label>
            <input
              type="text"
              className="form-control"
              id="location"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="pricePerNight" className="form-label">
              Precio por noche
            </label>
            <input
              type="number"
              className="form-control"
              id="pricePerNight"
              name="pricePerNight"
              value={formData.pricePerNight || ""}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Categoría
            </label>
            <input
              type="text"
              className="form-control"
              id="category"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="latitude" className="form-label">
              Latitud
            </label>
            <input
              type="number"
              className="form-control"
              id="latitude"
              name="latitude"
              value={formData.latitude || ""}
              onChange={handleChange}
              step="any"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="longitude" className="form-label">
              Longitud
            </label>
            <input
              type="number"
              className="form-control"
              id="longitude"
              name="longitude"
              value={formData.longitude || ""}
              onChange={handleChange}
              step="any"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="numberOfRooms" className="form-label">
              Cantidad de Dormitorios
            </label>
            <input
              type="number"
              className="form-control"
              id="numberOfRooms"
              name="numberOfRooms"
              value={formData.numberOfRooms || ""}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="numberOfBathrooms" className="form-label">
              Cantidad de Baños
            </label>
            <input
              type="number"
              className="form-control"
              id="numberOfBathrooms"
              name="numberOfBathrooms"
              value={formData.numberOfBathrooms || ""}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="size" className="form-label">
              Superficie (m²)
            </label>
            <input
              type="number"
              className="form-control"
              id="size"
              name="size"
              value={formData.size || ""}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="features" className="form-label">
              Características (separadas por coma)
            </label>
            <textarea
              className="form-control"
              id="features"
              name="features"
              rows="2"
              value={formData.features || ""}
              onChange={handleChange}
              placeholder="Balcón, Vista al mar, Cochera"
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="amenities" className="form-label">
              Amenidades (separadas por coma)
            </label>
            <textarea
              className="form-control"
              id="amenities"
              name="amenities"
              rows="2"
              value={formData.amenities || ""}
              onChange={handleChange}
              placeholder="Piscina, Gimnasio, Parrilla"
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="imageUrls" className="form-label">
              URL de Imagen
            </label>
            <textarea
              className="form-control"
              id="imageUrls"
              name="imageUrls"
              rows="2"
              value={formData.imageUrls || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  imageUrls: e.target.value,
                })
              }
              placeholder="/url1.jpg, /url2.jpg, /url3.jpg"
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="propertyStatus" className="form-label">
              Estado de la Propiedad
            </label>
            <select
              className="form-select"
              id="propertyStatus"
              name="propertyStatus"
              value={formData.propertyStatus || "AVAILABLE"}
              onChange={handleChange}
            >
              {propertyStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {isEditMode ? "Actualizar" : "Crear"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminPropertyFormPage;
