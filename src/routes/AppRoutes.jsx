import Cookbook from "../pages/Cookbook";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import PatientSelection from "../pages/PatientSelection";
import Home from "../pages/Home";
import RecipeDetails from "../pages/RecipeDetails";
import Settings from "../pages/Settings";
import Search from "../pages/Search";
import Profile from "../pages/Profile";
import MealPlanner from "../pages/MealPlanner";
import NutritionDashboard from "../pages/NutritionDashboard";
import Splash from "../pages/Splash";
import SelectHotel from "../pages/SelectHotel";
import Cart from "../pages/Cart";
import Payment from "../pages/Payment";
import OrderConfirmation from "../pages/OrderConfirmation";

if (!sessionStorage.getItem("app_initialized")) {
  localStorage.removeItem("userProfile");
  localStorage.removeItem("patientType");
  sessionStorage.setItem("app_initialized", "true");
}

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
    return <Navigate to="/login" replace />;
  }

  if (
    (location.pathname === "/home" ||
      location.pathname.startsWith("/recipe") ||
      location.pathname === "/cookbook" ||
      location.pathname === "/search" ||
      location.pathname === "/profile" ||
      location.pathname === "/meal-planner" ||
      location.pathname === "/nutrition-dashboard" ||
      location.pathname.startsWith("/select-hotel") ||
      location.pathname === "/cart" ||
      location.pathname === "/payment" ||
      location.pathname === "/order-confirmation" ||
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
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route path="/patient" element={<ProtectedRoute><PatientSelection /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetails /></ProtectedRoute>} />
        <Route path="/cookbook" element={<ProtectedRoute><Cookbook /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/meal-planner" element={<ProtectedRoute><MealPlanner /></ProtectedRoute>} />
        <Route path="/nutrition-dashboard" element={<ProtectedRoute><NutritionDashboard /></ProtectedRoute>} />
        <Route path="/select-hotel/:recipeId" element={<ProtectedRoute><SelectHotel /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;