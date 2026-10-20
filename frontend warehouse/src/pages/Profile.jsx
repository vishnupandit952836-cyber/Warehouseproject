import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaBell,
  FaUserShield,
  FaSave,
  FaRedo,
  FaCamera,
  FaSignOutAlt,
  FaPlus,
  FaTrash,
  FaBox,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaClock,
  FaShieldAlt,
  FaCheck,
} from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();

  // =====================================================
  // PROFILE DATA
  // =====================================================

  const [name, setName] = useState("Ronu");
  const [email, setEmail] = useState("admin@warehouse.com");
  const [phone, setPhone] = useState("9876543210");
  const [role, setRole] = useState("Administrator");
  const [profilePhoto, setProfilePhoto] = useState("");

  // =====================================================
  // PASSWORD
  // =====================================================

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // =====================================================
  // NOTIFICATION SETTINGS
  // =====================================================

  const [orderNotification, setOrderNotification] =
    useState(true);

  const [stockNotification, setStockNotification] =
    useState(true);

  const [emailNotification, setEmailNotification] =
    useState(true);

  // =====================================================
  // SECURITY
  // =====================================================

  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] =
    useState("30 Minutes");

  // =====================================================
  // CUSTOM NOTIFICATION
  // =====================================================

  const [notificationTitle, setNotificationTitle] =
    useState("");

  const [notificationMessage, setNotificationMessage] =
    useState("");

  const [notificationType, setNotificationType] =
    useState("info");

  const [notifications, setNotifications] = useState([]);

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    try {
      const loggedUser =
        sessionStorage.getItem("loggedInUser");

      const savedProfile =
        sessionStorage.getItem("warehouse_profile");

      if (loggedUser) {
        const user = JSON.parse(loggedUser);

        setName(user.name || "Ronu");
        setEmail(user.email || "admin@warehouse.com");
        setPhone(user.phone || "9876543210");
        setRole(user.role || "Administrator");
        setProfilePhoto(user.profilePhoto || "");
      }

      if (savedProfile) {
        const profile = JSON.parse(savedProfile);

        setName(profile.name || "Ronu");
        setEmail(profile.email || "admin@warehouse.com");
        setPhone(profile.phone || "9876543210");
        setRole(profile.role || "Administrator");
        setProfilePhoto(profile.profilePhoto || "");

        setOrderNotification(
          profile.orderNotification ?? true
        );

        setStockNotification(
          profile.stockNotification ?? true
        );

        setEmailNotification(
          profile.emailNotification ?? true
        );

        setTwoFactor(profile.twoFactor ?? false);

        setSessionTimeout(
          profile.sessionTimeout || "30 Minutes"
        );
      }

      const savedNotifications =
        sessionStorage.getItem(
          "warehouse_notifications"
        );

      if (savedNotifications) {
        setNotifications(
          JSON.parse(savedNotifications)
        );
      }
    } catch (error) {
      console.error(
        "Profile loading error:",
        error
      );
    }
  }, []);

  // =====================================================
  // SYNC NOTIFICATIONS WITH NAVBAR
  // =====================================================

  useEffect(() => {
    const syncNotifications = () => {
      try {
        const saved =
          sessionStorage.getItem(
            "warehouse_notifications"
          );

        setNotifications(
          saved ? JSON.parse(saved) : []
        );
      } catch (error) {
        console.error(
          "Notification sync error:",
          error
        );
      }
    };

    window.addEventListener(
      "notificationsUpdated",
      syncNotifications
    );

    return () => {
      window.removeEventListener(
        "notificationsUpdated",
        syncNotifications
      );
    };
  }, []);

  // =====================================================
  // SAVE NOTIFICATIONS
  // =====================================================

  const saveNotifications = (data) => {
    setNotifications(data);

    sessionStorage.setItem(
      "warehouse_notifications",
      JSON.stringify(data)
    );

    window.dispatchEvent(
      new Event("notificationsUpdated")
    );
  };

  // =====================================================
  // ADD NOTIFICATION
  // =====================================================

  const addNotification = () => {
    if (!notificationTitle.trim()) {
      alert("Please enter notification title.");
      return;
    }

    if (!notificationMessage.trim()) {
      alert("Please enter notification message.");
      return;
    }

    const newNotification = {
      id: Date.now(),
      type: notificationType,
      title: notificationTitle.trim(),
      message: notificationMessage.trim(),
      time: "Just now",
      createdAt: new Date().toISOString(),
      read: false,
    };

    const updatedNotifications = [
      newNotification,
      ...notifications,
    ];

    saveNotifications(updatedNotifications);

    setNotificationTitle("");
    setNotificationMessage("");
    setNotificationType("info");

    alert("Notification added successfully!");
  };

  // =====================================================
  // DELETE NOTIFICATION
  // =====================================================

  const deleteNotification = (id) => {
    const updatedNotifications =
      notifications.filter(
        (item) => item.id !== id
      );

    saveNotifications(updatedNotifications);
  };

  // =====================================================
  // MARK ALL READ
  // =====================================================

  const markAllAsRead = () => {
    const updatedNotifications =
      notifications.map((item) => ({
        ...item,
        read: true,
      }));

    saveNotifications(updatedNotifications);
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const saveProfile = () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (
      newPassword &&
      newPassword !== confirmPassword
    ) {
      alert(
        "New password and confirm password do not match."
      );
      return;
    }

    const profileData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: role.trim(),
      profilePhoto,

      orderNotification,
      stockNotification,
      emailNotification,

      twoFactor,
      sessionTimeout,
    };

    sessionStorage.setItem(
      "warehouse_profile",
      JSON.stringify(profileData)
    );

    const oldUser =
      sessionStorage.getItem("loggedInUser");

    let userData = {};

    try {
      if (oldUser) {
        userData = JSON.parse(oldUser);
      }
    } catch {
      userData = {};
    }

    const updatedUser = {
      ...userData,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: role.trim(),
      profilePhoto,
    };

    sessionStorage.setItem(
      "loggedInUser",
      JSON.stringify(updatedUser)
    );

    window.dispatchEvent(
      new Event("userUpdated")
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    alert("Profile updated successfully!");
  };

  // =====================================================
  // RESET PROFILE
  // =====================================================

  const resetProfile = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the profile form?"
    );

    if (!confirmReset) return;

    setName("Ronu");
    setEmail("admin@warehouse.com");
    setPhone("9876543210");
    setRole("Administrator");
    setProfilePhoto("");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setOrderNotification(true);
    setStockNotification(true);
    setEmailNotification(true);

    setTwoFactor(false);
    setSessionTimeout("30 Minutes");
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("loggedInUser");

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // NOTIFICATION ICON
  // =====================================================

  const getNotificationIcon = (type) => {
    if (type === "order") {
      return (
        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <FaBox className="text-sm" />
        </div>
      );
    }

    if (type === "stock") {
      return (
        <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
          <FaExclamationTriangle className="text-sm" />
        </div>
      );
    }

    if (type === "success") {
      return (
        <div className="w-9 h-9 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
          <FaCheckCircle className="text-sm" />
        </div>
      );
    }

    return (
      <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
        <FaInfoCircle className="text-sm" />
      </div>
    );
  };

  // =====================================================
  // TOGGLE COMPONENT
  // =====================================================

  const Toggle = ({ checked, onChange }) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition ${
          checked
            ? "bg-blue-600"
            : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition ${
            checked
              ? "left-5"
              : "left-0.5"
          }`}
        />
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-5">

      {/* =====================================================
                         PAGE HEADER
      ===================================================== */}

      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Profile
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your personal information and account settings
          </p>
        </div>

        {/* ONLY LOGOUT BUTTON */}

        <button
          onClick={handleLogout}
          className="
            self-start
            sm:self-auto
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded-lg
            bg-red-50
            text-red-600
            border
            border-red-100
            hover:bg-red-100
            transition
            text-sm
            font-medium
          "
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

      <div className="space-y-5">

        {/* =====================================================
                         QUICK ACCOUNT SUMMARY
        ===================================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FaUser />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Account Overview
              </h2>

              <p className="text-xs text-gray-500">
                Quick summary of your account
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
              <p className="text-xs text-gray-500">
                Account Name
              </p>

              <p className="text-sm font-semibold text-gray-800 mt-1">
                {name || "User"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
              <p className="text-xs text-gray-500">
                Account Role
              </p>

              <p className="text-sm font-semibold text-gray-800 mt-1">
                {role || "Administrator"}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 border border-green-100 p-3">
              <p className="text-xs text-gray-500">
                Account Status
              </p>

              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />

                <p className="text-sm font-semibold text-green-700">
                  Active
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* =====================================================
                         PROFILE INFORMATION
        ===================================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FaUser />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Profile Information
              </h2>

              <p className="text-xs text-gray-500">
                Manage your personal profile information
              </p>
            </div>

          </div>

          {/* Profile Header */}

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-5">

            <div className="relative">

              <div className="
                w-20
                h-20
                rounded-full
                bg-blue-600
                text-white
                flex
                items-center
                justify-center
                text-2xl
                font-bold
                shadow-sm
                overflow-hidden
              ">

                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  name
                    ? name.charAt(0).toUpperCase()
                    : "U"
                )}

              </div>

              <label
                className="
                  absolute
                  bottom-0
                  right-0
                  w-7
                  h-7
                  rounded-full
                  bg-white
                  border
                  border-gray-200
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  hover:bg-blue-50
                  cursor-pointer
                "
              >
                <FaCamera className="text-xs" />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file =
                      e.target.files?.[0];

                    if (!file) return;

                    const reader =
                      new FileReader();

                    reader.onload = () => {
                      setProfilePhoto(
                        reader.result
                      );
                    };

                    reader.readAsDataURL(file);
                  }}
                />
              </label>

            </div>

            <div className="text-center sm:text-left">

              <h3 className="text-lg font-semibold text-gray-800">
                {name || "User"}
              </h3>

              <p className="text-sm text-gray-500">
                {email}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">

                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  Active
                </span>

                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                  {role}
                </span>

              </div>

            </div>

          </div>

          {/* Profile Fields */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Name */}

            <div>
              <label className="text-xs font-medium text-gray-600">
                Full Name
              </label>

              <div className="relative">

                <FaUser className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  text-xs
                " />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="
                    w-full
                    h-10
                    mt-1
                    pl-9
                    pr-3
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-50
                    text-sm
                    outline-none
                    focus:border-blue-400
                    focus:ring-2
                    focus:ring-blue-50
                  "
                />

              </div>
            </div>

            {/* Email */}

            <div>
              <label className="text-xs font-medium text-gray-600">
                Email Address
              </label>

              <div className="relative">

                <FaEnvelope className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  text-xs
                " />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="
                    w-full
                    h-10
                    mt-1
                    pl-9
                    pr-3
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-50
                    text-sm
                    outline-none
                    focus:border-blue-400
                    focus:ring-2
                    focus:ring-blue-50
                  "
                />

              </div>
            </div>

            {/* Phone */}

            <div>
              <label className="text-xs font-medium text-gray-600">
                Phone Number
              </label>

              <div className="relative">

                <FaPhone className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  text-xs
                " />

                <input
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className="
                    w-full
                    h-10
                    mt-1
                    pl-9
                    pr-3
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-50
                    text-sm
                    outline-none
                    focus:border-blue-400
                    focus:ring-2
                    focus:ring-blue-50
                  "
                />

              </div>
            </div>

            {/* Role */}

            <div>
              <label className="text-xs font-medium text-gray-600">
                Role
              </label>

              <input
                type="text"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                className="
                  w-full
                  h-10
                  mt-1
                  px-3
                  rounded-lg
                  border
                  border-gray-200
                  bg-gray-50
                  text-sm
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-50
                "
              />

            </div>

          </div>

        </div>

        {/* =====================================================
                           CHANGE PASSWORD
        ===================================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <FaLock />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Change Password
              </h2>

              <p className="text-xs text-gray-500">
                Update your account password
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <label className="text-xs font-medium text-gray-600">
                Current Password
              </label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                placeholder="Current password"
                className="
                  w-full
                  h-10
                  mt-1
                  px-3
                  rounded-lg
                  border
                  border-gray-200
                  bg-gray-50
                  text-sm
                  outline-none
                  focus:border-blue-400
                "
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="New password"
                className="
                  w-full
                  h-10
                  mt-1
                  px-3
                  rounded-lg
                  border
                  border-gray-200
                  bg-gray-50
                  text-sm
                  outline-none
                  focus:border-blue-400
                "
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm password"
                className="
                  w-full
                  h-10
                  mt-1
                  px-3
                  rounded-lg
                  border
                  border-gray-200
                  bg-gray-50
                  text-sm
                  outline-none
                  focus:border-blue-400
                "
              />
            </div>

          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <FaShieldAlt className="text-green-500" />
            Use a strong password with letters, numbers and symbols.
          </div>

        </div>

        {/* =====================================================
                     NOTIFICATION SETTINGS
        ===================================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <FaBell />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Notification Settings
              </h2>

              <p className="text-xs text-gray-500">
                Control alerts and add custom notifications
              </p>
            </div>

          </div>

          {/* Order */}

          <div className="flex items-center justify-between py-3">

            <div>
              <p className="text-sm font-medium text-gray-800">
                Order Notifications
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Get notified when a new order is received
              </p>
            </div>

            <Toggle
              checked={orderNotification}
              onChange={setOrderNotification}
            />

          </div>

          {/* Stock */}

          <div className="flex items-center justify-between py-3 border-t border-gray-100">

            <div>
              <p className="text-sm font-medium text-gray-800">
                Stock Notifications
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Get notified when stock is running low
              </p>
            </div>

            <Toggle
              checked={stockNotification}
              onChange={setStockNotification}
            />

          </div>

          {/* Email */}

          <div className="flex items-center justify-between py-3 border-t border-gray-100">

            <div>
              <p className="text-sm font-medium text-gray-800">
                Email Notifications
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Receive important alerts through email
              </p>
            </div>

            <Toggle
              checked={emailNotification}
              onChange={setEmailNotification}
            />

          </div>

          {/* =================================================
                     ADD NOTIFICATION
          ================================================= */}

          <div className="mt-4 pt-4 border-t border-gray-200">

            <div className="flex items-center justify-between mb-3">

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Add Custom Notification
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  This notification will also appear in the Navbar.
                </p>
              </div>

              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FaPlus className="text-xs" />
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

              {/* Title */}

              <div>
                <label className="text-xs font-medium text-gray-600">
                  Title
                </label>

                <input
                  type="text"
                  value={notificationTitle}
                  onChange={(e) =>
                    setNotificationTitle(
                      e.target.value
                    )
                  }
                  placeholder="New order received"
                  className="
                    w-full
                    h-10
                    mt-1
                    px-3
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-50
                    text-sm
                    outline-none
                    focus:border-blue-400
                  "
                />
              </div>

              {/* Type */}

              <div>
                <label className="text-xs font-medium text-gray-600">
                  Type
                </label>

                <select
                  value={notificationType}
                  onChange={(e) =>
                    setNotificationType(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    h-10
                    mt-1
                    px-3
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-50
                    text-sm
                    outline-none
                    focus:border-blue-400
                  "
                >
                  <option value="info">
                    Information
                  </option>

                  <option value="order">
                    Order
                  </option>

                  <option value="stock">
                    Low Stock
                  </option>

                  <option value="success">
                    Success
                  </option>
                </select>
              </div>

              {/* Message */}

              <div>
                <label className="text-xs font-medium text-gray-600">
                  Message
                </label>

                <input
                  type="text"
                  value={notificationMessage}
                  onChange={(e) =>
                    setNotificationMessage(
                      e.target.value
                    )
                  }
                  placeholder="Enter message"
                  className="
                    w-full
                    h-10
                    mt-1
                    px-3
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-50
                    text-sm
                    outline-none
                    focus:border-blue-400
                  "
                />
              </div>

            </div>

            <div className="flex justify-end mt-3">

              <button
                onClick={addNotification}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-lg
                  bg-blue-600
                  text-white
                  text-sm
                  font-medium
                  hover:bg-blue-700
                  transition
                "
              >
                <FaPlus className="text-xs" />
                Add Notification
              </button>

            </div>

          </div>

        </div>

        {/* =====================================================
                     CURRENT NOTIFICATIONS
        ===================================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">

            <div>

              <h2 className="text-base font-semibold text-gray-800">
                Current Notifications
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Notifications currently visible in Navbar
              </p>

            </div>

            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="
                  flex
                  items-center
                  gap-1.5
                  text-xs
                  text-blue-600
                  hover:text-blue-700
                  font-medium
                "
              >
                <FaCheck />
                Mark all as read
              </button>
            )}

          </div>

          {notifications.length === 0 ? (

            <div className="text-center py-7">

              <div className="w-11 h-11 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                <FaBell />
              </div>

              <p className="text-sm text-gray-600 mt-3">
                No notifications
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Add a notification from the section above.
              </p>

            </div>

          ) : (

            <div className="space-y-2">

              {notifications.map(
                (notification) => (

                  <div
                    key={notification.id}
                    className={`
                      flex
                      items-center
                      gap-3
                      p-3
                      rounded-lg
                      border
                      ${
                        notification.read
                          ? "border-gray-100 bg-white"
                          : "border-blue-100 bg-blue-50/40"
                      }
                    `}
                  >

                    {getNotificationIcon(
                      notification.type
                    )}

                    <div className="flex-1 min-w-0">

                      <div className="flex items-center gap-2">

                        <p className="text-sm font-medium text-gray-700 truncate">
                          {notification.title}
                        </p>

                        {!notification.read && (
                          <span className="px-1.5 py-0.5 text-[9px] rounded bg-blue-100 text-blue-600">
                            NEW
                          </span>
                        )}

                      </div>

                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-1 mt-1">

                        <FaClock className="text-[9px] text-gray-400" />

                        <p className="text-[10px] text-gray-400">
                          {notification.time || "Just now"}
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        deleteNotification(
                          notification.id
                        )
                      }
                      className="
                        w-8
                        h-8
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        text-gray-400
                        hover:text-red-500
                        hover:bg-red-50
                        transition
                        shrink-0
                      "
                      title="Delete notification"
                    >
                      <FaTrash className="text-xs" />
                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* =====================================================
                           ACCOUNT SECURITY
        ===================================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <FaUserShield />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Account Security
              </h2>

              <p className="text-xs text-gray-500">
                Manage your account security
              </p>
            </div>

          </div>

          {/* Two Factor */}

          <div className="flex items-center justify-between py-3">

            <div className="flex items-center gap-3">

              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <FaShieldAlt className="text-sm" />
              </div>

              <div>

                <p className="text-sm font-medium text-gray-800">
                  Two-Factor Authentication
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Add an extra layer of security
                </p>

              </div>

            </div>

            <Toggle
              checked={twoFactor}
              onChange={setTwoFactor}
            />

          </div>

          {/* Session Timeout */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-t border-gray-100">

            <div>

              <p className="text-sm font-medium text-gray-800">
                Session Timeout
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Automatically logout after inactivity
              </p>

            </div>

            <select
              value={sessionTimeout}
              onChange={(e) =>
                setSessionTimeout(
                  e.target.value
                )
              }
              className="
                h-9
                px-3
                border
                border-gray-200
                rounded-lg
                outline-none
                bg-white
                text-sm
                text-gray-700
              "
            >
              <option>15 Minutes</option>
              <option>30 Minutes</option>
              <option>1 Hour</option>
              <option>2 Hours</option>
            </select>

          </div>

          {/* Security Status */}

          <div className="mt-3 rounded-lg bg-green-50 border border-green-100 p-3">

            <div className="flex items-center gap-2">

              <FaCheckCircle className="text-green-500" />

              <div>

                <p className="text-sm font-medium text-green-700">
                  Account Security Status
                </p>

                <p className="text-xs text-green-600 mt-1">
                  Your account is currently active and protected.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
                         SAVE / RESET
        ===================================================== */}

        <div className="
          bg-white
          rounded-xl
          shadow-sm
          border
          border-gray-100
          p-4
          flex
          flex-col
          sm:flex-row
          justify-end
          gap-3
        ">

          <button
            onClick={resetProfile}
            className="
              flex
              items-center
              justify-center
              gap-2
              px-4
              py-2
              rounded-lg
              border
              border-gray-300
              text-gray-600
              text-sm
              font-medium
              hover:bg-gray-100
              transition
            "
          >
            <FaRedo className="text-xs" />
            Reset
          </button>

          <button
            onClick={saveProfile}
            className="
              flex
              items-center
              justify-center
              gap-2
              px-4
              py-2
              rounded-lg
              bg-blue-600
              text-white
              text-sm
              font-medium
              hover:bg-blue-700
              transition
            "
          >
            <FaSave className="text-xs" />
            Save Changes
          </button>

        </div>

      </div>
    </div>
  );
};

export default Profile;