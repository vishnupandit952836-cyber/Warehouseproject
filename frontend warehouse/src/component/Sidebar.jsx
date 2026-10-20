import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  MdDashboard,
  MdInventory,
  MdWarehouse,
  MdShoppingCart,
  MdLocalShipping,
  MdPeople,
  MdAssessment,
  MdInput,
  MdOutput,
  MdCategory,
  MdMenu,
  MdClose,
  MdChat,
} from "react-icons/md";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const Data = [
    {
      name: "Dashboard",
      path: "/",
      icon: <MdDashboard />,
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: <MdInventory />,
    },
    {
      name: "Products",
      path: "/products",
      icon: <MdCategory />,
    },
    {
      name: "Warehouses",
      path: "/warehouses",
      icon: <MdWarehouse />,
    },
    {
      name: "Stock Management",
      path: "/stock-management",
      icon: <MdInventory />,
    },
    {
      name: "Orders",
      path: "/orders",
      icon: <MdShoppingCart />,
    },
    {
      name: "Inbound",
      path: "/inbound",
      icon: <MdInput />,
    },
    {
      name: "Outbound",
      path: "/outbound",
      icon: <MdOutput />,
    },
    {
      name: "Suppliers",
      path: "/suppliers",
      icon: <MdLocalShipping />,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: <MdPeople />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <MdAssessment />,
    },
    {
      name: "AI Helper",
      path: "/AI_Helper",
      icon: <MdChat />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <MdPeople />,
    },
  ];

  return (
    <>
      {/* ================= MOBILE MENU BUTTON ================= */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          fixed
          top-4
          left-4
          z-[60]
          lg:hidden
          bg-blue-600
          text-white
          p-2
          rounded-lg
          shadow-md
          hover:bg-blue-700
          hover:scale-105
          transition-all
          duration-200
        "
      >
        <MdMenu className="text-xl" />
      </button>

      {/* ================= MOBILE OVERLAY ================= */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            lg:hidden
            transition-opacity
            duration-300
          "
        ></div>
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-64
          bg-blue-950
          text-white
          shadow-xl

          transform
          transition-all
          duration-300
          ease-in-out

          ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}

          lg:translate-x-0
          lg:opacity-100
          lg:shadow-none
        `}
      >
        {/* ================= LOGO ================= */}
        <div
          className="
            px-3
            py-3
            border-b
            border-blue-900
            h-20
          "
        >
          <div className="flex items-center gap-2">

            {/* Logo Icon */}
            <div
              className="
                bg-blue-600
                p-2
                rounded-lg
                flex
                items-center
                justify-center
                flex-shrink-0
                transition-all
                duration-300
                hover:scale-105
              "
            >
              <MdWarehouse className="text-lg" />
            </div>

            {/* Logo Text */}
            <div>
              <h1 className="text-base font-bold">
                AI Powered WMS
              </h1>

              <p className="text-[9px] text-blue-300">
                Warehouse Management System
              </p>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="
                ml-auto
                lg:hidden
                text-blue-200
                hover:text-white
                hover:rotate-90
                transition-all
                duration-300
              "
            >
              <MdClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* ================= MENU ================= */}
        <div className="p-2 overflow-hidden">

          {Data.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `
                  group

                  flex
                  items-center
                  gap-2

                  px-2
                  py-1.5

                  mb-0.5

                  rounded-md

                  transition-all
                  duration-200
                  ease-in-out

                  hover:translate-x-1

                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "hover:bg-blue-800 text-blue-100"
                  }
                `
              }
            >
              {/* Icon */}
              <span
                className="
                  text-base
                  flex-shrink-0
                  transition-transform
                  duration-200
                  group-hover:scale-110
                "
              >
                {item.icon}
              </span>

              {/* Menu Name */}
              <span className="text-[18px] font-normal  [font-family:'Times_New_Roman']">
                {item.name}
              </span>
            </NavLink>
          ))}

        </div>
      </aside>
    </>
  );
};

export default Sidebar;