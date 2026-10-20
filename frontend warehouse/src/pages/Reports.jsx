import React, { useEffect, useMemo, useState } from "react";
import {
  FaChartBar,
  FaBox,
  FaShoppingCart,
  FaRupeeSign,
  FaDownload,
  FaUsers,
  FaTruck,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


// =====================================================
// STORAGE KEYS
// =====================================================

const STORAGE_KEYS = {
  products: "warehouse_products",
  orders: "warehouse_orders",
  customers: "warehouse_customers",
  suppliers: "warehouse_suppliers",
  inbound: "warehouse_inbound",
  outbound: "warehouse_outbound",
};


// =====================================================
// READ SESSION STORAGE
// =====================================================

const readStorage = (key) => {
  try {
    const data = sessionStorage.getItem(key);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return [];
  }
};


// =====================================================
// NUMBER HELPER
// =====================================================

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/[₹,\s]/g, "");
    const number = Number(cleaned);

    return Number.isNaN(number) ? 0 : number;
  }

  const number = Number(value);

  return Number.isNaN(number) ? 0 : number;
};


// =====================================================
// DATE HELPER
// =====================================================

const getDateFromItem = (item) => {
  if (!item) return null;

  const possibleDates = [
    item.date,
    item.orderDate,
    item.createdAt,
    item.created_at,
    item.updatedAt,
    item.inboundDate,
    item.outboundDate,
    item.deliveryDate,
  ];

  for (const value of possibleDates) {
    if (!value) continue;

    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
};


// =====================================================
// MONTH HELPER
// =====================================================

const getMonthName = (item) => {
  const date = getDateFromItem(item);

  if (!date) return null;

  return date.toLocaleString("en-US", {
    month: "short",
  });
};


// =====================================================
// CURRENCY FORMAT
// =====================================================

const formatCurrency = (value) => {
  return `₹${toNumber(value).toLocaleString("en-IN")}`;
};


// =====================================================
// REPORTS COMPONENT
// =====================================================

const Reports = () => {

  // ===================================================
  // STATE
  // ===================================================

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [inbound, setInbound] = useState([]);
  const [outbound, setOutbound] = useState([]);


  // ===================================================
  // LOAD ALL DATA
  // ===================================================

  const loadAllData = () => {

    setProducts(
      readStorage(STORAGE_KEYS.products)
    );

    setOrders(
      readStorage(STORAGE_KEYS.orders)
    );

    setCustomers(
      readStorage(STORAGE_KEYS.customers)
    );

    setSuppliers(
      readStorage(STORAGE_KEYS.suppliers)
    );

    setInbound(
      readStorage(STORAGE_KEYS.inbound)
    );

    setOutbound(
      readStorage(STORAGE_KEYS.outbound)
    );
  };


  // ===================================================
  // INITIAL LOAD + UPDATE LISTENERS
  // ===================================================

  useEffect(() => {

    loadAllData();


    // Custom events
    const events = [
      "productsUpdated",
      "ordersUpdated",
      "customersUpdated",
      "suppliersUpdated",
      "inboundUpdated",
      "outboundUpdated",
    ];


    events.forEach((event) => {
      window.addEventListener(
        event,
        loadAllData
      );
    });


    // Storage event
    window.addEventListener(
      "storage",
      loadAllData
    );


    // When page gets focus
    window.addEventListener(
      "focus",
      loadAllData
    );


    // When tab becomes visible
    document.addEventListener(
      "visibilitychange",
      loadAllData
    );


    return () => {

      events.forEach((event) => {
        window.removeEventListener(
          event,
          loadAllData
        );
      });


      window.removeEventListener(
        "storage",
        loadAllData
      );


      window.removeEventListener(
        "focus",
        loadAllData
      );


      document.removeEventListener(
        "visibilitychange",
        loadAllData
      );
    };

  }, []);


  // ===================================================
  // TOTAL STOCK
  // ===================================================

  const totalStock = useMemo(() => {

    return products.reduce((total, product) => {

      const quantity =
        product.stock ??
        product.quantity ??
        product.qty ??
        product.stockQuantity ??
        0;

      return total + toNumber(quantity);

    }, 0);

  }, [products]);


  // ===================================================
  // TOTAL PRODUCTS
  // ===================================================

  const totalProducts = products.length;


  // ===================================================
  // TOTAL ORDERS
  // ===================================================

  const totalOrders = orders.length;


  // ===================================================
  // TOTAL CUSTOMERS
  // ===================================================

  const totalCustomers = customers.length;


  // ===================================================
  // TOTAL SUPPLIERS
  // ===================================================

  const totalSuppliers = suppliers.length;


  // ===================================================
  // TOTAL INBOUND
  // ===================================================

  const totalInbound = inbound.reduce(
    (total, item) => {

      const quantity =
        item.quantity ??
        item.qty ??
        item.stock ??
        0;

      return total + toNumber(quantity);

    },
    0
  );


  // ===================================================
  // TOTAL OUTBOUND
  // ===================================================

  const totalOutbound = outbound.reduce(
    (total, item) => {

      const quantity =
        item.quantity ??
        item.qty ??
        item.stock ??
        0;

      return total + toNumber(quantity);

    },
    0
  );


  // ===================================================
  // TOTAL REVENUE
  // ===================================================

  const totalRevenue = useMemo(() => {

    return orders.reduce(
      (total, order) => {

        const amount =
          order.total ??
          order.totalAmount ??
          order.grandTotal ??
          order.amount ??
          order.revenue ??
          order.price ??
          order.orderTotal ??
          0;

        return total + toNumber(amount);

      },
      0
    );

  }, [orders]);


  // ===================================================
  // ACTIVE CUSTOMERS
  // ===================================================

  const activeCustomers = customers.filter(
    (customer) =>
      String(customer.status || "")
        .toLowerCase() === "active"
  ).length;


  // ===================================================
  // ACTIVE SUPPLIERS
  // ===================================================

  const activeSuppliers = suppliers.filter(
    (supplier) =>
      String(supplier.status || "")
        .toLowerCase() === "active"
  ).length;


  // ===================================================
  // LOW STOCK PRODUCTS
  // ===================================================

  const lowStockProducts = products.filter(
    (product) => {

      const stock =
        product.stock ??
        product.quantity ??
        product.qty ??
        product.stockQuantity ??
        0;

      return toNumber(stock) <= 10;
    }
  ).length;


  // ===================================================
  // MONTH DATA
  // ===================================================

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];


  // ===================================================
  // MONTHLY REVENUE
  // ===================================================

  const revenueData = useMemo(() => {

    const data = {};

    months.forEach((month) => {
      data[month] = 0;
    });


    orders.forEach((order) => {

      const month = getMonthName(order);

      if (!month) return;


      const amount =
        order.total ??
        order.totalAmount ??
        order.grandTotal ??
        order.amount ??
        order.revenue ??
        order.price ??
        order.orderTotal ??
        0;


      data[month] += toNumber(amount);
    });


    return months
      .map((month) => ({
        month,
        revenue: data[month],
      }))
      .filter(
        (item) => item.revenue > 0
      );

  }, [orders]);


  // ===================================================
  // MONTHLY ORDERS
  // ===================================================

  const orderData = useMemo(() => {

    const data = {};

    months.forEach((month) => {
      data[month] = 0;
    });


    orders.forEach((order) => {

      const month = getMonthName(order);

      if (!month) return;

      data[month]++;
    });


    return months
      .map((month) => ({
        month,
        orders: data[month],
      }))
      .filter(
        (item) => item.orders > 0
      );

  }, [orders]);


  // ===================================================
  // INVENTORY CATEGORY DATA
  // ===================================================

  const inventoryData = useMemo(() => {

    const categoryMap = {};


    products.forEach((product) => {

      const category =
        product.category ||
        product.type ||
        product.productCategory ||
        "Other";


      const quantity =
        product.stock ??
        product.quantity ??
        product.qty ??
        product.stockQuantity ??
        0;


      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }


      categoryMap[category] +=
        toNumber(quantity);
    });


    return Object.entries(
      categoryMap
    ).map(([name, value]) => ({
      name,
      value,
    }));

  }, [products]);


  // ===================================================
  // COLORS
  // ===================================================

  const COLORS = [
    "#2563eb",
    "#9333ea",
    "#f97316",
    "#22c55e",
    "#ef4444",
    "#14b8a6",
    "#eab308",
    "#6366f1",
  ];


  // ===================================================
  // AVERAGE MONTHLY REVENUE
  // ===================================================

  const averageMonthlyRevenue =
    revenueData.length > 0
      ? totalRevenue / revenueData.length
      : 0;


  // ===================================================
  // AVERAGE MONTHLY ORDERS
  // ===================================================

  const averageMonthlyOrders =
    orderData.length > 0
      ? totalOrders / orderData.length
      : 0;


  // ===================================================
  // STOCK AVAILABILITY
  // ===================================================

  const stockAvailability =
    totalProducts > 0
      ? Math.max(
          0,
          Math.round(
            ((totalProducts -
              lowStockProducts) /
              totalProducts) *
              100
          )
        )
      : 0;


  // ===================================================
  // DOWNLOAD REPORT
  // ===================================================

  const downloadReport = () => {

    const report = {

      generatedAt:
        new Date().toLocaleString(),

      summary: {

        totalRevenue,

        totalProducts,

        totalOrders,

        totalCustomers,

        totalSuppliers,

        totalStock,

        lowStockProducts,

        totalInbound,

        totalOutbound,
      },


      products,

      orders,

      customers,

      suppliers,

      inbound,

      outbound,


      charts: {

        revenueData,

        orderData,

        inventoryData,
      },


      performance: {

        averageMonthlyRevenue,

        averageMonthlyOrders,

        stockAvailability,
      },
    };


    const blob = new Blob(
      [
        JSON.stringify(
          report,
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href = url;

    link.download =
      "warehouse-report.json";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);
  };


  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="min-h-screen bg-gray-50 p-6 pt-4">


      {/* =========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

        <div>

          <h1 className="text-2xl font-semibold text-gray-800">
            Reports
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            View and analyze your warehouse performance
          </p>

        </div>


        <button
          onClick={downloadReport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >

          <FaDownload />

          Download Report

        </button>

      </div>


      {/* =========================================
          SUMMARY CARDS
      ========================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">


        {/* TOTAL SALES */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500 text-sm">
                Total Sales
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {formatCurrency(totalRevenue)}
              </h2>

              <p className="text-green-500 text-xs mt-1">
                From all added orders
              </p>

            </div>


            <div className="w-11 h-11 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">

              <FaRupeeSign />

            </div>

          </div>

        </div>


        {/* TOTAL PRODUCTS */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500 text-sm">
                Total Products
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {totalProducts.toLocaleString("en-IN")}
              </h2>

              <p className="text-blue-500 text-xs mt-1">
                Products added
              </p>

            </div>


            <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">

              <FaBox />

            </div>

          </div>

        </div>


        {/* TOTAL ORDERS */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500 text-sm">
                Total Orders
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {totalOrders.toLocaleString("en-IN")}
              </h2>

              <p className="text-purple-500 text-xs mt-1">
                Orders added
              </p>

            </div>


            <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">

              <FaShoppingCart />

            </div>

          </div>

        </div>


        {/* CUSTOMERS */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500 text-sm">
                Total Customers
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {totalCustomers}
              </h2>

              <p className="text-orange-500 text-xs mt-1">
                {activeCustomers} active customers
              </p>

            </div>


            <div className="w-11 h-11 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">

              <FaUsers />

            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          SECOND SUMMARY
      ========================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">


        {/* SUPPLIERS */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500 text-sm">
                Total Suppliers
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {totalSuppliers}
              </h2>

              <p className="text-blue-500 text-xs mt-1">
                {activeSuppliers} active suppliers
              </p>

            </div>


            <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">

              <FaTruck />

            </div>

          </div>

        </div>


        {/* TOTAL STOCK */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Total Stock
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {totalStock.toLocaleString("en-IN")}
          </h2>

          <p className="text-green-500 text-xs mt-1">
            Current inventory quantity
          </p>

        </div>


        {/* INBOUND */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500 text-sm">
                Inbound Quantity
              </p>

              <h2 className="text-2xl font-bold mt-2 text-green-600">
                {totalInbound.toLocaleString("en-IN")}
              </h2>

              <p className="text-gray-400 text-xs mt-1">
                Received stock
              </p>

            </div>


            <div className="w-11 h-11 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">

              <FaArrowDown />

            </div>

          </div>

        </div>


        {/* OUTBOUND */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500 text-sm">
                Outbound Quantity
              </p>

              <h2 className="text-2xl font-bold mt-2 text-red-500">
                {totalOutbound.toLocaleString("en-IN")}
              </h2>

              <p className="text-gray-400 text-xs mt-1">
                Dispatched stock
              </p>

            </div>


            <div className="w-11 h-11 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">

              <FaArrowUp />

            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          REVENUE CHART
      ========================================== */}

      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

        <div className="mb-4">

          <h2 className="text-lg font-semibold text-gray-800">
            Revenue Overview
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Monthly revenue from added orders
          </p>

        </div>


        <div className="w-full h-72">

          {revenueData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={revenueData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="month"
                />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    formatCurrency(value)
                  }
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

              </LineChart>

            </ResponsiveContainer>

          ) : (

            <div className="h-full flex items-center justify-center">

              <p className="text-gray-400">
                No revenue data available yet.
              </p>

            </div>

          )}

        </div>

      </div>


      {/* =========================================
          TWO CHARTS
      ========================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">


        {/* ORDERS */}

        <div className="bg-white rounded-xl shadow-sm p-5">

          <div className="mb-4">

            <h2 className="text-lg font-semibold text-gray-800">
              Orders Overview
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Monthly order performance
            </p>

          </div>


          <div className="w-full h-64">

            {orderData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={orderData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    dataKey="month"
                  />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="orders"
                    name="Orders"
                    fill="#9333ea"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <div className="h-full flex items-center justify-center">

                <p className="text-gray-400">
                  No order data available yet.
                </p>

              </div>

            )}

          </div>

        </div>


        {/* INVENTORY */}

        <div className="bg-white rounded-xl shadow-sm p-5">

          <div className="mb-4">

            <h2 className="text-lg font-semibold text-gray-800">
              Inventory Distribution
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Current stock by product category
            </p>

          </div>


          <div className="w-full h-64">

            {inventoryData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={inventoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >

                    {inventoryData.map(
                      (entry, index) => (

                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>


                  <Tooltip />


                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            ) : (

              <div className="h-full flex items-center justify-center">

                <p className="text-gray-400">
                  No inventory data available yet.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>


      {/* =========================================
          DATA SUMMARY
      ========================================== */}

      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

        <h2 className="text-lg font-semibold text-gray-800">
          Warehouse Data Summary
        </h2>

        <p className="text-sm text-gray-400 mt-1 mb-5">
          Complete data available in the warehouse system
        </p>


        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">


          {/* Products */}

          <div className="bg-blue-50 rounded-lg p-4">

            <p className="text-xs text-gray-500">
              Products
            </p>

            <h3 className="text-xl font-bold text-blue-600 mt-1">
              {products.length}
            </h3>

          </div>


          {/* Orders */}

          <div className="bg-purple-50 rounded-lg p-4">

            <p className="text-xs text-gray-500">
              Orders
            </p>

            <h3 className="text-xl font-bold text-purple-600 mt-1">
              {orders.length}
            </h3>

          </div>


          {/* Customers */}

          <div className="bg-orange-50 rounded-lg p-4">

            <p className="text-xs text-gray-500">
              Customers
            </p>

            <h3 className="text-xl font-bold text-orange-600 mt-1">
              {customers.length}
            </h3>

          </div>


          {/* Suppliers */}

          <div className="bg-indigo-50 rounded-lg p-4">

            <p className="text-xs text-gray-500">
              Suppliers
            </p>

            <h3 className="text-xl font-bold text-indigo-600 mt-1">
              {suppliers.length}
            </h3>

          </div>


          {/* Inbound */}

          <div className="bg-green-50 rounded-lg p-4">

            <p className="text-xs text-gray-500">
              Inbound
            </p>

            <h3 className="text-xl font-bold text-green-600 mt-1">
              {inbound.length}
            </h3>

          </div>


          {/* Outbound */}

          <div className="bg-red-50 rounded-lg p-4">

            <p className="text-xs text-gray-500">
              Outbound
            </p>

            <h3 className="text-xl font-bold text-red-600 mt-1">
              {outbound.length}
            </h3>

          </div>

        </div>

      </div>


      {/* =========================================
          REPORT SUMMARY
      ========================================== */}

      <div className="bg-white rounded-xl shadow-sm p-5">

        <h2 className="text-lg font-semibold text-gray-800">
          Report Summary
        </h2>

        <p className="text-sm text-gray-400 mt-1 mb-5">
          Overall warehouse performance
        </p>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


          {/* Average Revenue */}

          <div className="bg-blue-50 rounded-lg p-4">

            <p className="text-sm text-gray-500">
              Average Monthly Revenue
            </p>

            <h3 className="text-xl font-bold text-blue-600 mt-2">
              {formatCurrency(
                averageMonthlyRevenue
              )}
            </h3>

          </div>


          {/* Average Orders */}

          <div className="bg-purple-50 rounded-lg p-4">

            <p className="text-sm text-gray-500">
              Average Monthly Orders
            </p>

            <h3 className="text-xl font-bold text-purple-600 mt-2">
              {averageMonthlyOrders.toFixed(0)}
            </h3>

          </div>


          {/* Stock Availability */}

          <div className="bg-green-50 rounded-lg p-4">

            <p className="text-sm text-gray-500">
              Stock Availability
            </p>

            <h3 className="text-xl font-bold text-green-600 mt-2">
              {stockAvailability}%
            </h3>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Reports;