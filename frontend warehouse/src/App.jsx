import {React} from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./component/Sidebar";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

import Dashboard from "./pages/Dashboard";
import Invetory from "./pages/Invetory";
import Product from "./pages/Product";
import Warehouse from "./pages/Wearhouse";
import Stock_Management from "./pages/Stock_Management";
import Orders from "./pages/Orders";
import Inbound from "./pages/Inbound";
import Outbound from "./pages/Outbound";
import Suppliers from "./pages/Suppliers";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";

// AI Helper
import AI_Helper from "./pages/AI_Helper";

import Login from "./pages/Login";
import Signup from "./pages/Signup";


// ================= PROTECTED ROUTE =================
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


// ================= APP LAYOUT =================
const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= SIDEBAR ================= */}
      <div className="fixed left-0 top-0 w-64 h-screen z-50">
        <Sidebar />
      </div>


      {/* ================= NAVBAR ================= */}
      <div className="fixed top-0 left-64 right-0 h-14 z-40">
        <Navbar />
      </div>


      {/* ================= MAIN CONTENT ================= */}
      <div
        className="
          fixed
          left-64
          right-0
          top-15
          bottom-0
          overflow-y-auto
          overflow-x-hidden
          bg-gray-100
        "
      >

        <div className="min-h-full">

          <Routes>

            {/* ================= DASHBOARD ================= */}

            <Route
              path="/"
              element={<Dashboard />}
            />


            {/* ================= INVENTORY ================= */}

            <Route
              path="/inventory"
              element={<Invetory />}
            />


            {/* ================= PRODUCTS ================= */}

            <Route
              path="/products"
              element={<Product />}
            />


            {/* ================= WAREHOUSES ================= */}

            <Route
              path="/warehouses"
              element={<Warehouse />}
            />


            {/* ================= STOCK MANAGEMENT ================= */}

            <Route
              path="/stock-management"
              element={<Stock_Management />}
            />


            {/* ================= ORDERS ================= */}

            <Route
              path="/orders"
              element={<Orders />}
            />


            {/* ================= INBOUND ================= */}

            <Route
              path="/inbound"
              element={<Inbound />}
            />


            {/* ================= OUTBOUND ================= */}

            <Route
              path="/outbound"
              element={<Outbound />}
            />


            {/* ================= SUPPLIERS ================= */}

            <Route
              path="/suppliers"
              element={<Suppliers />}
            />


            {/* ================= CUSTOMERS ================= */}

            <Route
              path="/customers"
              element={<Customers />}
            />


            {/* ================= REPORTS ================= */}

            <Route
              path="/reports"
              element={<Reports />}
            />


            {/* ================= PROFILE ================= */}

            <Route
              path="/profile"
              element={<Profile />}
            />


            {/* ================= AI HELPER ================= */}

            <Route
              path="/AI_Helper"
              element={<AI_Helper />}
            />

          </Routes>


          {/* ================= FOOTER ================= */}

          <Footer />

        </div>
      </div>

    </div>
  );
};


// ================= MAIN APP =================

const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= LOGIN ================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ================= SIGNUP ================= */}

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* ================= PROTECTED APP ================= */}

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />


        {/* ================= INVALID ROUTE ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
};

export default App;