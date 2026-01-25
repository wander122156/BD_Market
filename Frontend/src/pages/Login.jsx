import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useUser(); // Добавляем isLoading и error из контекста
  const [formData, setFormData] = useState({
    username: '', // меняем email на username
    password: ''
  });
  const [formError, setFormError] = useState(''); // локальная ошибка формы

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.username.trim()) {
      setFormError('Username is required');
      return;
    }

    if (!formData.password.trim()) {
      setFormError('Password is required');
      return;
    }

    try {
      await login(formData.username, formData.password);
      navigate('/');
    } catch (err) {
      // Ошибка уже установлена в контексте, можно отобразить ее
      setFormError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Показываем ошибки из контекста или локальные */}
          {(error || formError) && (
            <div className="error-banner">{error || formError}</div>
          )}

          <div className="form-group">
            <label>Username *</label> {/* Меняем label на Username */}
            <input
              type="text" // меняем на text вместо email
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="admin-hint">
            <small>Admin login: admin / admin123</small> {/* Обновляем подсказку */}
          </div>

          <button 
            type="submit" 
            className="auth-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}