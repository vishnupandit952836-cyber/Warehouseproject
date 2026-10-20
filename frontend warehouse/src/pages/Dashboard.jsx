import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from "recharts";

import {
  FaBox,
  FaShoppingCart,
  FaWarehouse,
  FaChartLine,
  FaCheckCircle,
  FaTruck,
  FaBoxOpen,
  FaExclamationTriangle,
} from "react-icons/fa";

import { MdWarning } from "react-icons/md";

// ============================================================
// STORAGE KEY
// ============================================================

const STORAGE_KEY = "warehouse_products";

// ============================================================
// DEFAULT PRODUCTS
// ============================================================

const defaultProducts = [
  {
    id: "PRD-001",
    name: "Wireless Mouse",
    category: "Electronics",
    stock: 120,
    price: "₹799",
    status: "In Stock",
  },
  {
    id: "PRD-002",
    name: "Mechanical Keyboard",
    category: "Electronics",
    stock: 45,
    price: "₹2,499",
    status: "In Stock",
  },
  {
    id: "PRD-003",
    name: "USB-C Hub",
    category: "Accessories",
    stock: 18,
    price: "₹1,299",
    status: "Low Stock",
  },
  {
    id: "PRD-004",
    name: "LED Monitor",
    category: "Computer Parts",
    stock: 8,
    price: "₹12,999",
    status: "Low Stock",
  },
  {
    id: "PRD-005",
    name: "HDMI Cable",
    category: "Accessories",
    stock: 0,
    price: "₹499",
    status: "Out of Stock",
  },
];

// ============================================================
// GET PRODUCTS FROM SESSION STORAGE
// ============================================================

const getProductsFromStorage = () => {
  const savedProducts = sessionStorage.getItem(STORAGE_KEY);

  if (savedProducts) {
    try {
      return JSON.parse(savedProducts);
    } catch (error) {
      console.error("Invalid session storage data");
    }
  }

  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(defaultProducts)
  );

  return defaultProducts;
};

// ============================================================
// DASHBOARD
// ============================================================

const Dashboard = () => {
  const [products, setProducts] = useState(
    getProductsFromStorage
  );

  // ============================================================
  // LOAD PRODUCTS
  // ============================================================

  useEffect(() => {
    const loadProducts = () => {
      setProducts(getProductsFromStorage());
    };

    window.addEventListener(
      "productsUpdated",
      loadProducts
    );

    return () => {
      window.removeEventListener(
        "productsUpdated",
        loadProducts
      );
    };
  }, []);

  // ============================================================
  // DASHBOARD CARDS
  // ============================================================

  const dashboardData = [
    {
      title: "Total Products",
      value: products.length,
      status: "+12% this month",
      icon: FaBox,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Orders",
      value: 856,
      status: "+8% this month",
      icon: FaShoppingCart,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Low Stock",
      value: products.filter(
        (item) => item.status === "Low Stock"
      ).length,
      status: "Need attention",
      icon: FaWarehouse,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Revenue",
      value: "₹1,28,000",
      status: "+15% this month",
      icon: FaChartLine,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-3 pt-4 pb-8">

      {/* =====================================================
                            HEADER
      ===================================================== */}

      <div className="mb-6 ml-1">

        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Monitor Your Warehouse Performance and Operation
        </p>

      </div>

      {/* =====================================================
                       DASHBOARD CARDS
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-5
          px-2
        "
      >

        {dashboardData.map((item, index) => {

          const Icon = item.icon;

          return (
            <div
              key={index}
              className="
                bg-white
                rounded-xl
                border
                border-gray-100
                shadow-sm
                p-5
                flex
                items-center
                justify-between
                hover:shadow-md
                transition
                duration-200
              "
            >

              <div>

                <p className="text-gray-500 text-sm">
                  {item.title}
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-2">
                  {item.value}
                </h2>

                <p className="text-green-600 text-xs mt-2 font-medium">
                  {item.status}
                </p>

              </div>

              <div
                className={`
                  ${item.bgColor}
                  w-12
                  h-12
                  rounded-xl
                  flex
                  items-center
                  justify-center
                `}
              >

                <Icon
                  className={`${item.iconColor} text-xl`}
                />

              </div>

            </div>
          );

        })}

      </div>

      {/* =====================================================
                 INVENTORY + ORDER STATUS
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5">

        <Inventory products={products} />

        <OrderStatus />

      </div>

      {/* =====================================================
                 RECENT ORDERS + LOW STOCK
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5">

        <RecentOrders />

        <LowStock products={products} />

      </div>

    </div>
  );
};

// ============================================================
// INVENTORY
// ============================================================

function Inventory({ products }) {

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock),
    0
  );

  const availableStock = products
    .filter(
      (product) =>
        product.status !== "Out of Stock"
    )
    .reduce(
      (total, product) =>
        total + Number(product.stock),
      0
    );

  const lowStock = products.filter(
    (product) =>
      product.status === "Low Stock"
  ).length;

  // ============================================================
  // INVENTORY CARDS
  // ============================================================

  const inventoryData = [
    {
      title: "Total Stock",
      value: totalStock.toLocaleString("en-IN"),
      status: "Units",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Available",
      value: availableStock.toLocaleString("en-IN"),
      status:
        totalStock > 0
          ? `${(
              (availableStock / totalStock) *
              100
            ).toFixed(1)}% available`
          : "0%",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Low Stock",
      value: lowStock,
      status: "Need attention",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  // ============================================================
  // INVENTORY DISTRIBUTION DATA
  // ============================================================

  const categories = [
    "Electronics",
    "Accessories",
    "Computer Parts",
  ];

  const categoryColors = {
    Electronics: "#2563eb",
    Accessories: "#22c55e",
    "Computer Parts": "#eab308",
  };

  const stockData = categories.map(
    (category) => {

      const categoryProducts =
        products.filter(
          (product) =>
            product.category === category
        );

      const stock =
        categoryProducts.reduce(
          (total, product) =>
            total + Number(product.stock),
          0
        );

      return {
        name: category,
        stock: stock,
        color: categoryColors[category],
      };
    }
  );

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div
      className="
        bg-white
        border
        border-gray-100
        shadow-sm
        rounded-2xl
        p-5
        mt-5
        min-h-[520px]
      "
    >

      {/* HEADER */}

      <div className="flex justify-between items-start">

        <div>

          <h3 className="text-lg font-semibold text-gray-800">
            Inventory Status
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            Current stock distribution
          </p>

        </div>

        <select
          className="
            border
            border-gray-200
            bg-white
            px-3
            py-2
            rounded-lg
            text-sm
            text-gray-600
            outline-none
            focus:ring-2
            focus:ring-blue-400
          "
        >
          <option>This Month</option>
          <option>This Week</option>
          <option>This Year</option>
        </select>

      </div>

      {/* INVENTORY SUMMARY */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">

        {inventoryData.map(
          (item, index) => (

            <div
              key={index}
              className={`
                ${item.bg}
                rounded-xl
                border
                border-gray-100
                p-4
              `}
            >

              <p className="text-gray-500 text-xs">
                {item.title}
              </p>

              <h2 className="text-xl font-bold text-gray-800 mt-2">
                {item.value}
              </h2>

              <p
                className={`
                  ${item.color}
                  text-xs
                  font-medium
                  mt-1
                `}
              >
                {item.status}
              </p>

            </div>

          )
        )}

      </div>

      {/* =====================================================
                    INVENTORY DISTRIBUTION
      ===================================================== */}

      <div className="mt-6">

        <div className="flex justify-between items-center">

          <div>

            <h3 className="text-md font-semibold text-gray-800">
              Inventory Distribution
            </h3>

            <p className="text-gray-400 text-xs mt-1">
              Stock available by category
            </p>

          </div>

          <span className="text-xs text-gray-400">
            Units
          </span>

        </div>

        <div className="w-full h-[250px] mt-3">

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
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{
                  fill: "#f3f4f6",
                }}
              />

              <Bar
                dataKey="stock"
                barSize={55}
                radius={[
                  7,
                  7,
                  0,
                  0,
                ]}
              >

                {stockData.map(
                  (item, index) => (

                    <Cell
                      key={`cell-${index}`}
                      fill={item.color}
                    />

                  )
                )}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

// ============================================================
// ORDER STATUS
// ============================================================

function OrderStatus() {

  const orderData = [
    {
      name: "Delivered",
      value: 684,
      percentage: 85,
      icon: FaCheckCircle,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      barColor: "bg-green-500",
    },
    {
      name: "Shipped",
      value: 312,
      percentage: 65,
      icon: FaTruck,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      barColor: "bg-blue-500",
    },
    {
      name: "Processing",
      value: 186,
      percentage: 45,
      icon: FaBoxOpen,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
      barColor: "bg-yellow-500",
    },
    {
      name: "Cancelled",
      value: 102,
      percentage: 25,
      icon: FaExclamationTriangle,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      barColor: "bg-red-500",
    },
  ];

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div
      className="
        bg-white
        border
        border-gray-100
        shadow-sm
        rounded-2xl
        p-5
        mt-5
        min-h-[520px]
      "
    >

      {/* HEADER */}

      <div className="flex justify-between items-start">

        <div>

          <h3 className="text-lg font-semibold text-gray-800">
            Order Status
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            Current order summary
          </p>

        </div>

        <div
          className="
            bg-purple-50
            text-purple-600
            px-3
            py-1
            rounded-full
            text-xs
            font-medium
          "
        >
          1,284 Orders
        </div>

      </div>

      {/* =====================================================
                         DONUT CHART
      ===================================================== */}

      <div className="relative w-full h-[230px] mt-2">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={orderData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={3}
              stroke="none"
            >

              {orderData.map(
                (item, index) => (

                  <Cell
                    key={`pie-${index}`}
                    fill={
                      [
                        "#22c55e",
                        "#3b82f6",
                        "#eab308",
                        "#ef4444",
                      ][index]
                    }
                  />

                )
              )}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

        {/* CENTER TEXT */}

        <div
          className="
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
            pointer-events-none
          "
        >

          <span className="text-2xl font-bold text-gray-800">
            1,284
          </span>

          <span className="text-xs text-gray-400">
            Total Orders
          </span>

        </div>

      </div>

      {/* =====================================================
                       ORDER STATUS LIST
      ===================================================== */}

      <div className="mt-2 space-y-4">

        {orderData.map(
          (item, index) => {

            const Icon = item.icon;

            return (
              <div key={index}>

                <div className="flex justify-between items-center">

                  <div className="flex items-center gap-3">

                    <div
                      className={`
                        ${item.bgColor}
                        w-9
                        h-9
                        rounded-lg
                        flex
                        items-center
                        justify-center
                      `}
                    >

                      <Icon
                        className={`
                          ${item.iconColor}
                          text-sm
                        `}
                      />

                    </div>

                    <div>

                      <p className="text-sm font-medium text-gray-700">
                        {item.name}
                      </p>

                      <p className="text-[11px] text-gray-400">
                        {item.percentage}% completed
                      </p>

                    </div>

                  </div>

                  <span className="text-sm font-semibold text-gray-700">
                    {item.value}
                  </span>

                </div>

                {/* PROGRESS BAR */}

                <div
                  className="
                    w-full
                    h-1.5
                    bg-gray-100
                    rounded-full
                    mt-2
                  "
                >

                  <div
                    className={`
                      ${item.barColor}
                      h-1.5
                      rounded-full
                    `}
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />

                </div>

              </div>
            );

          }
        )}

      </div>

    </div>
  );
}

// ============================================================
// RECENT ORDERS
// ============================================================

function RecentOrders() {
  const navigate = useNavigate();

  const orders = [
    {
      id: "#ORD-1024",
      customer: "ABC Electronics",
      product: "Wireless Keyboard",
      qty: 25,
      status: "Delivered",
      statusColor:
        "bg-green-50 text-green-600",
    },
    {
      id: "#ORD-1025",
      customer: "Tech World",
      product: "USB-C Hub",
      qty: 40,
      status: "Processing",
      statusColor:
        "bg-yellow-50 text-yellow-600",
    },
    {
      id: "#ORD-1026",
      customer: "Digital Store",
      product: "Wireless Mouse",
      qty: 15,
      status: "Pending",
      statusColor:
        "bg-red-50 text-red-600",
    },
    {
      id: "#ORD-1027",
      customer: "Smart Solutions",
      product: "LED Monitor",
      qty: 10,
      status: "Shipped",
      statusColor:
        "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <div
      className="
        bg-white
        border
        border-gray-100
        shadow-sm
        rounded-2xl
        mt-5
        w-full
        min-h-[430px]
        overflow-hidden
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          justify-between
          items-start
          p-5
          border-b
          border-gray-100
        "
      >

        <div>

          <h3 className="text-lg font-semibold text-gray-800">
            Recent Orders
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            Latest warehouse orders
          </p>

        </div>

        <button
          onClick={() => navigate("/orders")}
          className="
            text-blue-600
            text-sm
            font-medium
            hover:text-blue-800
          "
        >
          View All
        </button>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left px-5 py-3 font-medium text-gray-500">
                Order ID
              </th>

              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Customer
              </th>

              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Product
              </th>

              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Qty
              </th>

              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.map(
              (order, index) => (

                <tr
                  key={index}
                  className="
                    border-b
                    border-gray-100
                    hover:bg-gray-50
                    transition
                  "
                >

                  <td className="px-5 py-4 text-blue-600 font-medium">
                    {order.id}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {order.customer}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {order.product}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {order.qty}
                  </td>

                  <td className="px-4 py-4">

                    <span
                      className={`
                        ${order.statusColor}
                        px-2.5
                        py-1
                        rounded-md
                        text-xs
                        font-medium
                      `}
                    >
                      {order.status}
                    </span>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

// ============================================================
// LOW STOCK
// ============================================================

function LowStock({ products }) {

  const lowStockProducts =
    products
      .filter(
        (product) =>
          product.status === "Low Stock"
      )
      .slice(0, 4);

  return (
    <div
      className="
        bg-white
        border
        border-gray-100
        shadow-sm
        rounded-2xl
        mt-5
        p-5
        w-full
        min-h-[430px]
      "
    >

      {/* HEADER */}

      <div className="flex justify-between items-start">

        <div>

          <h3 className="text-lg font-semibold text-gray-800">
            Low Stock
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            Products requiring attention
          </p>

        </div>

        <div
          className="
            bg-red-50
            w-10
            h-10
            rounded-lg
            flex
            items-center
            justify-center
          "
        >

          <MdWarning className="text-red-500 text-xl" />

        </div>

      </div>

      {/* PRODUCTS */}

      <div className="mt-5 space-y-3">

        {lowStockProducts.length > 0 ? (

          lowStockProducts.map(
            (item) => (

              <div
                key={item.id}
                className="
                  bg-gray-50
                  border
                  border-gray-100
                  rounded-xl
                  p-3
                  flex
                  justify-between
                  items-center
                  hover:bg-gray-100
                  transition
                "
              >

                <div>

                  <p className="text-sm font-medium text-gray-700">
                    {item.name}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {item.category}
                  </p>

                </div>

                <span
                  className="
                    text-red-500
                    bg-red-50
                    px-2.5
                    py-1
                    rounded-md
                    text-xs
                    font-semibold
                  "
                >
                  {item.stock} units
                </span>

              </div>

            )
          )

        ) : (

          <div className="text-center py-10">

            <FaCheckCircle className="text-green-500 text-3xl mx-auto" />

            <p className="text-gray-500 text-sm mt-3">
              No low stock products
            </p>

          </div>

        )}

      </div>

      {/* BUTTON */}

      <button
        className="
          w-full
          border
          border-gray-200
          rounded-xl
          py-2.5
          mt-5
          text-sm
          text-gray-600
          hover:bg-gray-50
          hover:text-blue-600
          transition
        "
      >
        Manage Inventory
      </button>

    </div>
  );
}

// ============================================================
// EXPORT
// ============================================================

export default Dashboard;