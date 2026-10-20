import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUserPlus,
} from "react-icons/fi";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    // Password check
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      // Registration successful
      navigate("/login");

    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to server. Please make sure backend is running."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-5">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}

        <div className="hidden md:flex bg-gradient-to-br from-indigo-700 to-blue-900 text-white p-10 flex-col justify-center">

          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">

            <span className="text-3xl font-bold">
              W
            </span>

          </div>

          <h1 className="text-4xl font-bold mb-5">
            Create Your
            <br />
            Account
          </h1>

          <p className="text-blue-100 leading-7">
            Create your warehouse management account
            and start managing your inventory,
            products and orders easily.
          </p>

        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="p-8 md:p-12">

          <div className="mb-7">

            <h2 className="text-3xl font-bold text-gray-800">
              Create Account
            </h2>

            <p className="text-gray-500 mt-2">
              Sign up to get started
            </p>

          </div>

          {/* Error */}

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>

            {/* Name */}

            <div className="mb-4">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>

              <div className="relative">

                <FiUser
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={19}
                />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />

              </div>

            </div>

            {/* Email */}

            <div className="mb-4">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">

                <FiMail
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={19}
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />

              </div>

            </div>

            {/* Password */}

            <div className="mb-4">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <FiLock
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={19}
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl py-3.5 pl-11 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-3.5 text-gray-400"
                >
                  {showPassword ? (
                    <FiEyeOff size={19} />
                  ) : (
                    <FiEye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* Confirm Password */}

            <div className="mb-6">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <FiLock
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={19}
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl py-3.5 pl-11 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-3.5 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={19} />
                  ) : (
                    <FiEye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* Signup Button */}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              <FiUserPlus size={19} />
              Create Account
            </button>

          </form>

          {/* Login */}

          <div className="text-center mt-6">

            <p className="text-gray-500 text-sm">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="inline-block mt-2 text-blue-600 font-semibold hover:text-blue-700"
            >
              Login here
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Signup;