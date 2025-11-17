/**
 * Composant principal de l'application.
 */
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./services/store";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { NewTicket } from "./pages/NewTicket";
import { TicketDetail } from "./pages/TicketDetail";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./styles/global.css";

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/new"
          element={
            <ProtectedRoute>
              <NewTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:ticketId"
          element={
            <ProtectedRoute>
              <TicketDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
