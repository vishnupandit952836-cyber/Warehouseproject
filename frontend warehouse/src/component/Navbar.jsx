import React, { useEffect, useRef, useState } from "react";

import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaExpand,
  FaSignOutAlt,
  FaTrash,
  FaWarehouse,
  FaCheck,
  FaBox,
  FaShoppingCart,
  FaExclamationTriangle,
  FaInfoCircle,
  FaArrowRight,
  FaRobot,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // ================= STATES =================

  const [search, setSearch] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [userName, setUserName] = useState("Ronny");
  const [userRole, setUserRole] = useState("User");

  // ================= REFS =================

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // =========================================================
  // SEARCH MENU ITEMS
  // =========================================================

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      keywords: ["dashboard", "home"],
    },
    {
      name: "Inventory",
      path: "/inventory",
      keywords: ["inventory", "stock"],
    },
    {
      name: "Products",
      path: "/products",
      keywords: ["product", "products", "items"],
    },
    {
      name: "Warehouse",
      path: "/warehouses",
      keywords: ["warehouse", "warehouses", "storage"],
    },
    {
      name: "Stock Management",
      path: "/stock-management",
      keywords: [
        "stock management",
        "stock",
        "stock control",
      ],
    },
    {
      name: "Orders",
      path: "/orders",
      keywords: ["order", "orders", "purchase"],
    },
    {
      name: "Inbound",
      path: "/inbound",
      keywords: ["inbound", "incoming", "receive"],
    },
    {
      name: "Outbound",
      path: "/outbound",
      keywords: ["outbound", "outgoing", "dispatch"],
    },
    {
      name: "Suppliers",
      path: "/suppliers",
      keywords: ["supplier", "suppliers", "vendor"],
    },
    {
      name: "Customers",
      path: "/customers",
      keywords: ["customer", "customers", "client"],
    },
    {
      name: "Reports",
      path: "/reports",
      keywords: ["report", "reports", "analytics"],
    },

    // ================= AI HELPER =================

    {
      name: "AI Helper",
      path: "/AI_Helper",
      keywords: [
        "ai",
        "ai helper",
        "assistant",
        "chatbot",
        "chat",
        "ai assistant",
      ],
    },

    {
      name: "Profile",
      path: "/profile",
      keywords: [
        "profile",
        "user",
        "account",
        "my profile",
      ],
    },

    {
      name: "Notifications",
      path: "/profile?tab=notifications",
      keywords: [
        "notification",
        "notifications",
        "alert",
        "alerts",
      ],
    },
  ];

  // =========================================================
  // NORMALIZE SEARCH TEXT
  // =========================================================

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  };

  // =========================================================
  // GET SEARCH RESULTS
  // =========================================================

  const getSearchResults = (value) => {
    const query = normalizeText(value);

    if (!query) {
      return [];
    }

    return menuItems.filter((item) => {
      const terms = [
        item.name,
        ...(item.keywords || []),
      ].map(normalizeText);

      return terms.some(
        (term) =>
          term === query ||
          term.includes(query) ||
          query.includes(term)
      );
    });
  };

  const searchResults = getSearchResults(search);

  // =========================================================
  // OPEN PAGE
  // =========================================================

  const openPage = (path) => {
    navigate(path);

    setSearch("");
    setShowNotification(false);
    setShowProfile(false);
  };

  // =========================================================
  // SEARCH KEYBOARD
  // =========================================================

  const handleSearch = (e) => {
    // Escape
    if (e.key === "Escape") {
      setSearch("");
      return;
    }

    // Enter
    if (e.key === "Enter") {
      const results = getSearchResults(search);

      if (results.length > 0) {
        openPage(results[0].path);
      }
    }
  };

  // =========================================================
  // LOAD NOTIFICATIONS
  // =========================================================

  useEffect(() => {
    const loadNotifications = () => {
      const saved = sessionStorage.getItem(
        "warehouse_notifications"
      );

      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch {
          setNotifications([]);
        }
      } else {
        const defaultNotifications = [
          {
            id: 1,
            title: "Low Stock Alert",
            message:
              "Some products are running low.",
            time: "Just now",
            read: false,
          },
          {
            id: 2,
            title: "New Order",
            message:
              "A new order has been received.",
            time: "5 min ago",
            read: false,
          },
          {
            id: 3,
            title: "Product Added",
            message:
              "A new product was added successfully.",
            time: "20 min ago",
            read: true,
          },
          {
            id: 4,
            title: "Inventory Updated",
            message:
              "Inventory information was updated.",
            time: "1 hour ago",
            read: true,
          },
        ];

        sessionStorage.setItem(
          "warehouse_notifications",
          JSON.stringify(defaultNotifications)
        );

        setNotifications(defaultNotifications);
      }
    };

    loadNotifications();

    window.addEventListener(
      "notificationsUpdated",
      loadNotifications
    );

    return () => {
      window.removeEventListener(
        "notificationsUpdated",
        loadNotifications
      );
    };
  }, []);

  // =========================================================
  // LOAD LOGGED IN USER
  // =========================================================

  useEffect(() => {
    const savedUser =
      sessionStorage.getItem("loggedInUser");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        setUserName(user.name || "Ronny");
        setUserRole(user.role || "User");
      } catch {
        setUserName("Ronny");
        setUserRole("User");
      }
    }
  }, []);

  // =========================================================
  // CLOSE DROPDOWNS WHEN CLICK OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearch("");
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =========================================================
  // MARK SINGLE NOTIFICATION AS READ
  // =========================================================

  const markAsRead = (id) => {
    const updated = notifications.map((item) =>
      item.id === id
        ? {
            ...item,
            read: true,
          }
        : item
    );

    setNotifications(updated);

    sessionStorage.setItem(
      "warehouse_notifications",
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event("notificationsUpdated")
    );
  };

  // =========================================================
  // MARK ALL NOTIFICATIONS AS READ
  // =========================================================

  const markAllAsRead = () => {
    const updated = notifications.map((item) => ({
      ...item,
      read: true,
    }));

    setNotifications(updated);

    sessionStorage.setItem(
      "warehouse_notifications",
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event("notificationsUpdated")
    );
  };

  // =========================================================
  // CLEAR NOTIFICATIONS
  // =========================================================

  const clearNotifications = () => {
    setNotifications([]);

    sessionStorage.setItem(
      "warehouse_notifications",
      JSON.stringify([])
    );

    window.dispatchEvent(
      new Event("notificationsUpdated")
    );
  };

  // =========================================================
  // VIEW ALL NOTIFICATIONS
  // =========================================================

  const viewAllNotifications = () => {
    setShowNotification(false);
    setShowProfile(false);

    navigate("/profile?tab=notifications");
  };

  // =========================================================
  // NOTIFICATION ICON
  // =========================================================

  const getNotificationIcon = (title) => {
    const text = title.toLowerCase();

    if (text.includes("stock")) {
      return (
        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
          <FaExclamationTriangle size={12} />
        </div>
      );
    }

    if (text.includes("order")) {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
          <FaShoppingCart size={12} />
        </div>
      );
    }

    if (
      text.includes("product") ||
      text.includes("inventory")
    ) {
      return (
        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
          <FaBox size={12} />
        </div>
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
        <FaInfoCircle size={12} />
      </div>
    );
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("loggedInUser");

    navigate("/login");
  };

  // =========================================================
  // FULLSCREEN
  // =========================================================

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // =========================================================
  // UNREAD COUNT
  // =========================================================

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  // =========================================================
  // UI
  // =========================================================

  return (
    <nav
      className="
        fixed
        top-0
        left-64
        right-0
        h-14
        bg-white
        border-b
        border-gray-200
        z-50
        flex
        items-center
        justify-between
        px-5
      "
    >

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div
        ref={searchRef}
        className="relative w-[385px]"
      >

        <div className="relative">

          <FaSearch
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
            size={13}
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={handleSearch}
            placeholder="Search pages..."
            className="
              w-full
              h-9
              pl-9
              pr-10
              border
              border-gray-300
              rounded-lg
              outline-none
              text-sm
              text-gray-700
              focus:border-gray-400
              focus:ring-1
              focus:ring-gray-200
            "
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                hover:text-gray-700
                text-lg
              "
            >
              ×
            </button>
          )}

        </div>

        {/* =================================================
            SEARCH RESULTS
        ================================================= */}

        {search.trim() && (
          <div
            className="
              absolute
              top-10
              left-0
              w-full
              bg-white
              rounded-xl
              shadow-xl
              border
              border-gray-100
              overflow-hidden
            "
          >

            <div
              className="
                px-3
                py-2
                text-[10px]
                font-semibold
                text-gray-400
                uppercase
              "
            >
              Search Results
            </div>

            {searchResults.length > 0 ? (
              <div className="pb-2">

                {searchResults
                  .slice(0, 6)
                  .map((item) => (

                    <button
                      key={item.name}
                      onClick={() =>
                        openPage(item.path)
                      }
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-3
                        py-2
                        hover:bg-gray-50
                        text-left
                      "
                    >

                      {/* ICON */}

                      <div
                        className="
                          w-8
                          h-8
                          rounded-lg
                          bg-blue-50
                          flex
                          items-center
                          justify-center
                          text-blue-600
                        "
                      >

                        {item.name ===
                        "Warehouse" ? (
                          <FaWarehouse size={13} />
                        ) : item.name ===
                          "AI Helper" ? (
                          <FaRobot size={13} />
                        ) : item.name ===
                          "Notifications" ? (
                          <FaBell size={13} />
                        ) : (
                          <FaSearch size={11} />
                        )}

                      </div>

                      {/* TEXT */}

                      <div>

                        <p className="text-sm font-medium text-gray-700">
                          {item.name}
                        </p>

                        <p className="text-[11px] text-gray-400">
                          Open {item.name}
                        </p>

                      </div>

                    </button>

                  ))}

              </div>
            ) : (

              <div className="px-4 py-5 text-center">

                <p className="text-sm font-medium text-gray-600">
                  No page found
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  No result for "{search}"
                </p>

              </div>

            )}

          </div>
        )}

      </div>


      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="flex items-center gap-4">

        {/* ===================================================
            FULLSCREEN
        =================================================== */}

        <button
          onClick={handleFullscreen}
          className="
            text-gray-500
            hover:text-blue-600
            transition
          "
          title="Fullscreen"
        >
          <FaExpand size={14} />
        </button>


        {/* ===================================================
            NOTIFICATIONS
        =================================================== */}

        <div
          ref={notificationRef}
          className="relative"
        >

          <button
            onClick={() => {
              setShowNotification(
                !showNotification
              );

              setShowProfile(false);
            }}
            className="
              relative
              w-8
              h-8
              rounded-lg
              flex
              items-center
              justify-center
              text-gray-500
              hover:bg-gray-50
              hover:text-blue-600
              transition
            "
            title="Notifications"
          >

            <FaBell size={15} />

            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  bg-red-500
                  text-white
                  text-[8px]
                  font-semibold
                  min-w-[16px]
                  h-[16px]
                  px-1
                  rounded-full
                  flex
                  items-center
                  justify-center
                  border-2
                  border-white
                "
              >
                {unreadCount > 9
                  ? "9+"
                  : unreadCount}
              </span>
            )}

          </button>


          {/* NOTIFICATION DROPDOWN */}

          {showNotification && (
            <div
              className="
                absolute
                right-0
                top-10
                w-[330px]
                bg-white
                rounded-xl
                shadow-2xl
                border
                border-gray-100
                overflow-hidden
              "
            >

              {/* HEADER */}

              <div className="px-3 py-3 border-b border-gray-100">

                <div className="flex items-center justify-between">

                  <div>

                    <div className="flex items-center gap-2">

                      <h3 className="text-sm font-semibold text-gray-800">
                        Notifications
                      </h3>

                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[9px] font-semibold">
                          {unreadCount} New
                        </span>
                      )}

                    </div>

                    <p className="text-[10px] text-gray-400 mt-1">
                      Stay updated with your warehouse
                    </p>

                  </div>

                  <button
                    onClick={markAllAsRead}
                    disabled={
                      unreadCount === 0
                    }
                    className={`flex items-center gap-1 text-[10px] font-medium ${
                      unreadCount > 0
                        ? "text-blue-600 hover:text-blue-800"
                        : "text-gray-300 cursor-not-allowed"
                    }`}
                  >

                    <FaCheck size={9} />

                    Mark all read

                  </button>

                </div>

              </div>


              {/* NOTIFICATION LIST */}

              <div className="max-h-[250px] overflow-y-auto">

                {notifications.length > 0 ? (
                  notifications.map(
                    (notification) => (

                      <div
                        key={notification.id}
                        onClick={() =>
                          markAsRead(
                            notification.id
                          )
                        }
                        className={`px-3 py-2.5 border-b border-gray-100 cursor-pointer transition ${
                          !notification.read
                            ? "bg-blue-50/60 hover:bg-blue-50"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >

                        <div className="flex gap-2.5">

                          {getNotificationIcon(
                            notification.title
                          )}

                          <div className="flex-1 min-w-0">

                            <div className="flex items-start justify-between gap-2">

                              <p
                                className={`text-xs ${
                                  !notification.read
                                    ? "font-semibold text-gray-800"
                                    : "font-medium text-gray-700"
                                }`}
                              >
                                {notification.title}
                              </p>

                              {!notification.read && (
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1 shrink-0"></span>
                              )}

                            </div>

                            <p className="text-[10px] text-gray-500 mt-0.5 leading-4">
                              {notification.message}
                            </p>

                            <p className="text-[9px] text-gray-400 mt-1">
                              {notification.time}
                            </p>

                          </div>

                        </div>

                      </div>

                    )
                  )
                ) : (

                  <div className="py-8 px-5 text-center">

                    <div className="w-10 h-10 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2">

                      <FaBell size={16} />

                    </div>

                    <p className="text-xs font-medium text-gray-600">
                      No notifications
                    </p>

                    <p className="text-[10px] text-gray-400 mt-1">
                      You're all caught up!
                    </p>

                  </div>

                )}

              </div>


              {/* FOOTER */}

              <div
                className="
                  px-3
                  py-2.5
                  bg-gray-50
                  border-t
                  border-gray-100
                  flex
                  items-center
                  justify-between
                "
              >

                <button
                  onClick={viewAllNotifications}
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-blue-600
                    hover:text-blue-800
                    text-[11px]
                    font-medium
                    transition
                  "
                >

                  <FaBell size={9} />

                  View All

                  <FaArrowRight size={8} />

                </button>


                <button
                  onClick={clearNotifications}
                  disabled={
                    notifications.length === 0
                  }
                  className={`flex items-center gap-1.5 text-[11px] font-medium transition ${
                    notifications.length > 0
                      ? "text-red-500 hover:text-red-700"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >

                  <FaTrash size={9} />

                  Clear All

                </button>

              </div>

            </div>
          )}

        </div>


        {/* DIVIDER */}

        <div className="h-7 w-px bg-gray-200"></div>


        {/* ===================================================
            PROFILE
        =================================================== */}

        <div
          ref={profileRef}
          className="relative"
        >

          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotification(false);
            }}
            className="flex items-center gap-2"
          >

            <div
              className="
                w-7
                h-7
                rounded-full
                bg-blue-50
                flex
                items-center
                justify-center
                text-blue-600
              "
            >
              <FaUserCircle size={17} />
            </div>

            <div className="text-left hidden md:block">

              <p className="text-xs font-medium text-gray-700">
                {userName}
              </p>

              <p className="text-[9px] text-gray-400">
                {userRole}
              </p>

            </div>

            <span className="text-xs text-gray-400">
              ⌄
            </span>

          </button>


          {/* PROFILE DROPDOWN */}

          {showProfile && (
            <div
              className="
                absolute
                right-0
                top-10
                w-48
                bg-white
                rounded-xl
                shadow-xl
                border
                border-gray-100
                overflow-hidden
              "
            >

              <button
                onClick={() =>
                  openPage("/profile")
                }
                className="
                  w-full
                  px-4
                  py-3
                  text-left
                  text-sm
                  text-gray-600
                  hover:bg-gray-50
                "
              >
                My Profile
              </button>


              <button
                onClick={handleLogout}
                className="
                  w-full
                  px-4
                  py-3
                  text-left
                  text-sm
                  text-red-500
                  hover:bg-red-50
                  flex
                  items-center
                  gap-2
                "
              >

                <FaSignOutAlt size={13} />

                Logout

              </button>

            </div>
          )}

        </div>

      </div>

    </nav>
  );
};

export default Navbar;