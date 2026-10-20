import React, { useState } from "react";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Invetory = () => {
  const [timePeriod, setTimePeriod] = useState("This Month");

  // Inventory Cards
  const inventoryData = [
    {
      title: "Total Stock",
      value: "18,420",
      status: "Units",
      statusColor: "text-gray-500",
      bgcolor: "bg-yellow-50",
    },
    {
      title: "Available",
      value: "14,860",
      status: "80.7%",
      statusColor: "text-green-600",
      bgcolor: "bg-green-50",
    },
    {
      title: "Low Stock",
      value: "28",
      status: "Need attention",
      statusColor: "text-orange-500",
      bgcolor: "bg-red-50",
    },
  ];

  // Stock Chart Data
  const stockData = [
    {
      name: "Electronics",
      percentage: 85,
      color: "#2563eb",
    },
    {
      name: "Accessories",
      percentage: 72,
      color: "#22c55e",
    },
    {
      name: "Computer Parts",
      percentage: 58,
      color: "#eab308",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-5 lg:px-6 pt-4 pb-6">

      {/* ================= PAGE HEADER ================= */}

      <div className="mb-5 ml-1">

        <h1 className="text-2xl font-semibold text-gray-800">
          Inventory
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Manage and monitor your warehouse inventory
        </p>

      </div>


      {/* ================= INVENTORY CONTAINER ================= */}

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 w-full">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

          <div>

            <h3 className="text-lg font-semibold text-gray-800">
              Inventory Status
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              Current Stock distribution
            </p>

          </div>


          {/* Time Period */}

          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="
              border
              border-gray-300
              bg-white
              px-3
              py-2
              rounded-md
              text-sm
              text-gray-600
              outline-none
              focus:border-blue-400
              focus:ring-2
              focus:ring-blue-100
              cursor-pointer
            "
          >
            <option>This Month</option>
            <option>This Year</option>
            <option>This Week</option>
          </select>

        </div>


        {/* ================= INVENTORY CARDS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">

          {inventoryData.map((item, index) => (

            <div
              key={index}
              className={`
                ${item.bgcolor}
                border
                border-gray-100
                rounded-xl
                shadow-sm
                p-4
                min-h-[100px]
                hover:shadow-md
                transition
                duration-200
              `}
            >

              <p className="text-gray-500 text-sm">
                {item.title}
              </p>

              <h2 className="text-xl font-bold text-gray-800 mt-1">
                {item.value}
              </h2>

              <p
                className={`
                  ${item.statusColor}
                  text-sm
                  mt-1
                `}
              >
                {item.status}
              </p>

            </div>

          ))}

        </div>


        {/* ================= STOCK DISTRIBUTION ================= */}

        <div className="mt-6">

          <h3 className="text-lg font-semibold text-gray-800">
            Stock Distribution
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            Current stock distribution by category
          </p>


          {/* ================= CHART ================= */}

          <div className="w-full h-[280px] sm:h-[320px] mt-4">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={stockData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) => [`${value}%`, "Stock"]}
                  cursor={{
                    fill: "rgba(0, 0, 0, 0.03)",
                  }}
                />

                <Bar
                  dataKey="percentage"
                  barSize={55}
                  radius={[6, 6, 0, 0]}
                >

                  {stockData.map((item, index) => (

                    <Cell
                      key={`cell-${index}`}
                      fill={item.color}
                    />

                  ))}

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Invetory;