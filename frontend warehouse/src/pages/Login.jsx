import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLogIn,
  FiPackage,
  FiBox,
  FiShoppingCart,
  FiCheckCircle,
} from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || "Login failed");
            return;
        }

        // Save JWT token
        sessionStorage.setItem("token", data.token);

        // Save logged-in user
        sessionStorage.setItem(
            "loggedInUser",
            JSON.stringify(data.user)
        );

        // Login status
        sessionStorage.setItem("isLoggedIn", "true");

        // Go to dashboard/home
        navigate("/");
    } catch (error) {
        console.error(error);

        setError(
            "Unable to connect to server. Please make sure backend is running."
        );
    }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-10">

      {/* Main Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* ================================================= */}
        {/* LEFT SIDE */}
        {/* ================================================= */}

        <div className="hidden md:flex relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white p-10 lg:p-12 flex-col justify-between overflow-hidden">

          {/* Background Decorations */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full"></div>

          <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-white/5 rounded-full"></div>

          <div className="relative z-10">

            {/* Logo */}
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mb-7 shadow-lg">
              <FiPackage size={32} />
            </div>

            {/* Heading */}
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-5">
              Warehouse
              <br />
              Management
            </h1>

            <p className="text-blue-100 leading-7 max-w-md">
              Manage your products, inventory, orders and warehouse
              operations efficiently from one powerful platform.
            </p>

          </div>

          {/* Features */}
          <div className="relative z-10 space-y-4 mt-10">

            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <FiBox size={18} />
              </div>

              <div>
                <p className="font-semibold">
                  Product Management
                </p>

                <p className="text-xs text-blue-200">
                  Manage your warehouse products
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <FiCheckCircle size={18} />
              </div>

              <div>
                <p className="font-semibold">
                  Inventory Tracking
                </p>

                <p className="text-xs text-blue-200">
                  Track stock levels easily
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <FiShoppingCart size={18} />
              </div>

              <div>
                <p className="font-semibold">
                  Order Management
                </p>

                <p className="text-xs text-blue-200">
                  Manage orders in one place
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Text */}
          <p className="relative z-10 text-xs text-blue-200 mt-10">
            © 2026 Warehouse Management System
          </p>

        </div>

        {/* ================================================= */}
        {/* RIGHT SIDE */}
        {/* ================================================= */}

        <div className="p-7 sm:p-10 lg:p-12 flex items-center">

          <div className="w-full max-w-md mx-auto">

            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-6">

              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <FiPackage size={28} />
              </div>

            </div>

            {/* Heading */}
            <div className="mb-8">

              <h2 className="text-3xl font-bold text-gray-800">
                Welcome Back 👋
              </h2>

              <p className="text-gray-500 mt-2">
                Login to your warehouse account
              </p>

            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">

                <span className="font-medium">
                  ⚠
                </span>

                <span>
                  {error}
                </span>

              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin}>

              {/* ================= EMAIL ================= */}

              <div className="mb-5">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>

                <div className="relative">

                  <FiMail
                    className="absolute left-3.5 top-3 text-gray-400"
                    size={18}
                  />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    required
                  />

                </div>

              </div>

              {/* ================= PASSWORD ================= */}

              <div className="mb-6">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">

                  <FiLock
                    className="absolute left-3.5 top-3 text-gray-400"
                    size={18}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-11 text-sm text-gray-700 outline-none bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    required
                  />

                  {/* Show / Hide Password */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3.5 top-2.5 text-gray-400 hover:text-blue-600 transition"
                  >
                    {showPassword ? (
                      <FiEyeOff size={19} />
                    ) : (
                      <FiEye size={19} />
                    )}
                  </button>

                </div>

              </div>

              {/* ================= LOGIN BUTTON ================= */}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-200 transition-all duration-200 active:scale-[0.98]"
              >
                <FiLogIn size={19} />
                Login
              </button>

            </form>

            {/* ================= DIVIDER ================= */}

            <div className="flex items-center gap-3 my-7">

              <div className="h-px bg-gray-200 flex-1"></div>

              <span className="text-xs text-gray-400">
                OR
              </span>

              <div className="h-px bg-gray-200 flex-1"></div>

            </div>

            {/* ================= SIGNUP ================= */}

            <div className="text-center">

              <p className="text-gray-500 text-sm">
                Don't have an account?
              </p>

              <Link
                to="/signup"
                className="inline-block mt-2 text-blue-600 font-semibold hover:text-indigo-600 transition"
              >
                Create a new account →
              </Link>

            </div>

            {/* Security Text */}
            <p className="text-center text-xs text-gray-400 mt-8">
              Secure access to your warehouse dashboard
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;