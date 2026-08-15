import Cookbook from "../pages/Cookbook";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

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
import MyOrders from "../pages/MyOrders";
import OrderTracking from "../pages/OrderTracking";


/*
  Initialize app only once per browser session.

  IMPORTANT:
  We should NOT remove userProfile or patientType
  every time the app loads.
*/
if (!sessionStorage.getItem("app_initialized")) {
  sessionStorage.setItem("app_initialized", "true");
}


function isAuthenticated() {
  return Boolean(localStorage.getItem("userProfile"));
}


function PublicRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  return children;
}


function ProtectedRoute({ children }) {
  const location = useLocation();

  // User is not logged in
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  /*
    These pages require patient type.
  */
  const requiresPatientType =
    location.pathname === "/home" ||
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
    location.pathname === "/my-orders" ||
    location.pathname.startsWith("/track-order") ||
    location.pathname === "/settings";

  /*
    If patient type is not available,
    send user to patient selection.
  */
  if (
    requiresPatientType &&
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

        {/* Public pages */}

        <Route
          path="/"
          element={<Splash />}
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />


        {/* Patient Selection */}

        <Route
          path="/patient"
          element={
            <ProtectedRoute>
              <PatientSelection />
            </ProtectedRoute>
          }
        />


        {/* Main pages */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recipe/:id"
          element={
            <ProtectedRoute>
              <RecipeDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cookbook"
          element={
            <ProtectedRoute>
              <Cookbook />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meal-planner"
          element={
            <ProtectedRoute>
              <MealPlanner />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nutrition-dashboard"
          element={
            <ProtectedRoute>
              <NutritionDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/select-hotel/:recipeId"
          element={
            <ProtectedRoute>
              <SelectHotel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-confirmation"
          element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/track-order/:orderId"
          element={
            <ProtectedRoute>
              <OrderTracking />
            </ProtectedRoute>
          }
        />


        {/* Unknown route */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default AppRoutes;