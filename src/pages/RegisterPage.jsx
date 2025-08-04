import React, { useState } from 'react';
import AuthService from '../services/AuthService';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await AuthService.register(username, password);
            setMessage(response.message || 'Registro exitoso. Ahora puedes iniciar sesión.');
            setLoading(false);
        } catch (error) {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            setLoading(false);
            setMessage(resMessage);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg p-4" style={{ maxWidth: '450px', width: '100%' }}>
                <h2 className="card-title text-center mb-4 text-success">Registrarse</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Nombre de Usuario</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="d-grid gap-2 mt-4">
                        <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
                            {loading && (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            )}
                            Registrarse
                        </button>
                    </div>
                    {message && (
                        <div className={`alert ${message.includes('éxito') ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
                            {message}
                        </div>
                    )}
                </form>
                <p className="text-center mt-4 mb-0">
                    ¿Ya tienes cuenta? <Link to="/login" className="text-decoration-none text-primary fw-bold">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;