/**
 * Page de connexion.
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../services/store";
import "../styles/auth.css";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [email, setEmail] = useState("admin@helpdesk.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Help Desk</h1>
        <h2>Connexion</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <div className="demo-credentials">
          <p><strong>Identifiants de démonstration :</strong></p>
          <p>Email: admin@helpdesk.local</p>
          <p>Mot de passe: admin123</p>
        </div>
      </div>
    </div>
  );
};
