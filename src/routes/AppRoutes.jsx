import Cookbook from "../pages/Cookbook";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import PatientSelection from "../pages/PatientSelection";
import Home from "../pages/Home";
import RecipeDetails from "../pages/RecipeDetails";
import Settings from "../pages/Settings";

function isAuthenticated() {
  return Boolean(localStorage.getItem("userProfile"));
}

function PublicRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/patient" replace />;
  }

  return children;
}

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (
    (location.pathname === "/home" ||
      location.pathname.startsWith("/recipe") ||
      location.pathname === "/cookbook" ||
      location.pathname === "/settings") &&
    !localStorage.getItem("patientType")
  ) {
    return <Navigate to="/patient" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route path="/patient" element={<ProtectedRoute><PatientSelection /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetails /></ProtectedRoute>} />
        <Route path="/cookbook" element={<ProtectedRoute><Cookbook /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;