import React, { useState } from "react";

import {
  FaSearch,
  FaPlus,
  FaShoppingCart,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

// =====================================================
// SESSION STORAGE KEY
// =====================================================

const STORAGE_KEY = "warehouse_orders";

// =====================================================
// GET ORDERS FROM SESSION STORAGE
// =====================================================

const getOrdersFromStorage = () => {
  try {
    const storedOrders = sessionStorage.getItem(STORAGE_KEY);

    if (storedOrders) {
      return JSON.parse(storedOrders);
    }

    return [];
  } catch (error) {
    console.error("SessionStorage error:", error);
    return [];
  }
};

// =====================================================
// ORDERS COMPONENT
// =====================================================

const Orders = () => {

  // =====================================================
  // ORDERS
  // =====================================================

  const [orders, setOrders] = useState(
    getOrdersFromStorage
  );

  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] = useState("");

  // =====================================================
  // ADD ORDER MODAL
  // =====================================================

  const [showModal, setShowModal] = useState(false);

  // =====================================================
  // VIEW ORDER MODAL
  // =====================================================

  const [viewOrder, setViewOrder] = useState(null);

  // =====================================================
  // EDIT ORDER
  // =====================================================

  const [editOrder, setEditOrder] = useState(null);

  // =====================================================
  // NEW ORDER
  // =====================================================

  const [newOrder, setNewOrder] = useState({
    customer: "",
    product: "",
    quantity: "",
    amount: "",
    status: "Pending",
  });

  // =====================================================
  // SAVE ORDERS
  // =====================================================

  const saveOrders = (updatedOrders) => {

    setOrders(updatedOrders);

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedOrders)
    );

    // Optional dashboard update event
    window.dispatchEvent(
      new Event("ordersUpdated")
    );
  };

  // =====================================================
  // ADD ORDER
  // =====================================================

  const handleAddOrder = (e) => {

    e.preventDefault();

    // Validation
    if (
      !newOrder.customer.trim() ||
      !newOrder.product.trim() ||
      newOrder.quantity === "" ||
      newOrder.amount === ""
    ) {
      alert("Please fill all order details");
      return;
    }

    const quantityNumber = Number(newOrder.quantity);
    const amountNumber = Number(newOrder.amount);

    if (
      quantityNumber <= 0 ||
      amountNumber < 0
    ) {
      alert("Please enter valid quantity and amount");
      return;
    }

    // =================================================
    // CREATE ORDER ID
    // =================================================

    const newId = `ORD-${String(
      orders.length + 1
    ).padStart(3, "0")}`;

    // =================================================
    // CURRENT DATE
    // =================================================

    const today = new Date();

    const formattedDate =
      today.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    // =================================================
    // CREATE ORDER
    // =================================================

    const order = {
      id: newId,

      customer: newOrder.customer.trim(),

      product: newOrder.product.trim(),

      quantity: quantityNumber,

      amount: `₹${amountNumber.toLocaleString(
        "en-IN"
      )}`,

      date: formattedDate,

      status: newOrder.status,
    };

    // =================================================
    // ADD ORDER
    // =================================================

    const updatedOrders = [
      ...orders,
      order,
    ];

    saveOrders(updatedOrders);

    // =================================================
    // RESET FORM
    // =================================================

    setNewOrder({
      customer: "",
      product: "",
      quantity: "",
      amount: "",
      status: "Pending",
    });

    setShowModal(false);
  };

  // =====================================================
  // DELETE ORDER
  // =====================================================

  const deleteOrder = (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedOrders = orders.filter(
      (order) => order.id !== id
    );

    saveOrders(updatedOrders);
  };

  // =====================================================
  // EDIT ORDER
  // =====================================================

  const handleEdit = (order) => {

    setEditOrder({
      ...order,

      amount: order.amount
        .replace("₹", "")
        .replace(/,/g, ""),
    });
  };

  // =====================================================
  // UPDATE ORDER
  // =====================================================

  const handleUpdateOrder = (e) => {

    e.preventDefault();

    if (
      !editOrder.customer.trim() ||
      !editOrder.product.trim() ||
      editOrder.quantity === "" ||
      editOrder.amount === ""
    ) {
      alert("Please fill all order details");
      return;
    }

    const quantityNumber = Number(
      editOrder.quantity
    );

    const amountNumber = Number(
      editOrder.amount
    );

    if (
      quantityNumber <= 0 ||
      amountNumber < 0
    ) {
      alert("Please enter valid quantity and amount");
      return;
    }

    // =================================================
    // UPDATE ORDER
    // =================================================

    const updatedOrders = orders.map((order) => {

      if (order.id === editOrder.id) {

        return {
          ...order,

          customer:
            editOrder.customer.trim(),

          product:
            editOrder.product.trim(),

          quantity:
            quantityNumber,

          amount:
            `₹${amountNumber.toLocaleString(
              "en-IN"
            )}`,

          status:
            editOrder.status,
        };
      }

      return order;
    });

    saveOrders(updatedOrders);

    setEditOrder(null);
  };

  // =====================================================
  // SEARCH FILTER
  // =====================================================

  const filteredOrders = orders.filter(
    (order) => {

      const searchText =
        search.toLowerCase();

      return (
        order.id
          .toLowerCase()
          .includes(searchText) ||

        order.customer
          .toLowerCase()
          .includes(searchText) ||

        order.product
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-4">

      {/* =================================================
                          PAGE HEADER
      ================================================= */}

      <div className="flex justify-between items-start mb-6">

        <div>

          <h1 className="text-2xl font-semibold text-gray-800">
            Order Management
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage and monitor all your customer orders
          </p>

        </div>

        {/* ADD ORDER */}

        <button
          onClick={() => setShowModal(true)}
          className="
            flex
            items-center
            gap-2
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-4
            py-2
            rounded-lg
            shadow-sm
            transition
          "
        >

          <FaPlus className="text-sm" />

          Add Order

        </button>

      </div>


      {/* =================================================
                       SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        {/* TOTAL */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500 text-sm">
                Total Orders
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {orders.length}
              </h2>

              <p className="text-gray-400 text-xs mt-1">
                All Orders
              </p>

            </div>

            <div
              className="
                w-11
                h-11
                rounded-lg
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              "
            >

              <FaShoppingCart />

            </div>

          </div>

        </div>


        {/* PENDING */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Pending Orders
          </p>

          <h2 className="text-2xl font-bold mt-2 text-orange-500">

            {
              orders.filter(
                (order) =>
                  order.status === "Pending"
              ).length
            }

          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Waiting for processing
          </p>

        </div>


        {/* PROCESSING */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Processing
          </p>

          <h2 className="text-2xl font-bold mt-2 text-purple-600">

            {
              orders.filter(
                (order) =>
                  order.status === "Processing"
              ).length
            }

          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Orders in process
          </p>

        </div>


        {/* DELIVERED */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Delivered
          </p>

          <h2 className="text-2xl font-bold mt-2 text-green-600">

            {
              orders.filter(
                (order) =>
                  order.status === "Delivered"
              ).length
            }

          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Completed orders
          </p>

        </div>

      </div>


      {/* =================================================
                         ORDER LIST
      ================================================= */}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        {/* HEADER */}

        <div
          className="
            p-5
            border-b
            border-gray-100
            flex
            flex-col
            md:flex-row
            justify-between
            gap-4
          "
        >

          <div>

            <h2 className="text-lg font-semibold text-gray-800">
              Order List
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              All customer orders
            </p>

          </div>


          {/* SEARCH */}

          <div className="relative">

            <FaSearch
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Search order..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                h-10
                w-64
                bg-gray-100
                border
                border-gray-200
                rounded-lg
                pl-10
                pr-3
                text-sm
                outline-none
                focus:border-blue-500
              "
            />

          </div>

        </div>


        {/* =================================================
                            TABLE
        ================================================= */}

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* TABLE HEAD */}

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
                  Quantity
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Amount
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Date
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Status
                </th>

                <th className="text-center px-4 py-3 font-medium text-gray-500">
                  Action
                </th>

              </tr>

            </thead>


            {/* TABLE BODY */}

            <tbody>

              {filteredOrders.map((order) => (

                <tr
                  key={order.id}
                  className="
                    border-b
                    border-gray-100
                    hover:bg-gray-50
                  "
                >

                  {/* ID */}

                  <td className="px-5 py-4">

                    <span className="text-blue-600 font-medium">
                      {order.id}
                    </span>

                  </td>


                  {/* CUSTOMER */}

                  <td className="px-4 py-4 font-medium text-gray-700">
                    {order.customer}
                  </td>


                  {/* PRODUCT */}

                  <td className="px-4 py-4">

                    <div className="flex items-center gap-2">

                      <div
                        className="
                          w-8
                          h-8
                          rounded-lg
                          bg-blue-50
                          text-blue-600
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <FaShoppingCart />

                      </div>

                      <span className="text-gray-600">
                        {order.product}
                      </span>

                    </div>

                  </td>


                  {/* QUANTITY */}

                  <td className="px-4 py-4 text-gray-600">
                    {order.quantity}
                  </td>


                  {/* AMOUNT */}

                  <td className="px-4 py-4 font-medium text-gray-700">
                    {order.amount}
                  </td>


                  {/* DATE */}

                  <td className="px-4 py-4 text-gray-500">
                    {order.date}
                  </td>


                  {/* STATUS */}

                  <td className="px-4 py-4">

                    <span
                      className={`
                        px-2
                        py-1
                        rounded-md
                        text-xs
                        font-medium

                        ${
                          order.status === "Pending"
                            ? "bg-orange-50 text-orange-600"
                            : order.status === "Processing"
                            ? "bg-purple-50 text-purple-600"
                            : order.status === "Shipped"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-green-50 text-green-600"
                        }
                      `}
                    >

                      {order.status}

                    </span>

                  </td>


                  {/* ACTION */}

                  <td className="px-4 py-4">

                    <div className="flex justify-center gap-4">

                      {/* VIEW */}

                      <button
                        onClick={() =>
                          setViewOrder(order)
                        }
                        className="
                          text-gray-500
                          hover:text-blue-600
                        "
                        title="View Order"
                      >

                        <FaEye />

                      </button>


                      {/* EDIT */}

                      <button
                        onClick={() =>
                          handleEdit(order)
                        }
                        className="
                          text-blue-500
                          hover:text-blue-700
                        "
                        title="Edit Order"
                      >

                        <FaEdit />

                      </button>


                      {/* DELETE */}

                      <button
                        onClick={() =>
                          deleteOrder(order.id)
                        }
                        className="
                          text-red-500
                          hover:text-red-700
                        "
                        title="Delete Order"
                      >

                        <FaTrash />

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          {/* NO ORDERS */}

          {filteredOrders.length === 0 && (

            <div className="text-center py-10">

              <FaShoppingCart
                className="
                  mx-auto
                  text-gray-300
                  text-3xl
                "
              />

              <p className="text-gray-500 mt-2">
                No orders found
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Click "Add Order" to create a new order
              </p>

            </div>

          )}

        </div>

      </div>


      {/* =================================================
                       ADD ORDER MODAL
      ================================================= */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-[100]
            p-4
          "
        >

          <div
            className="
              bg-white
              rounded-xl
              shadow-xl
              w-full
              max-w-md
              p-6
            "
          >

            {/* HEADER */}

            <div
              className="
                flex
                justify-between
                items-center
                mb-5
              "
            >

              <div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Add Order
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Create a new customer order
                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  text-gray-400
                  hover:text-gray-700
                  text-xl
                "
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleAddOrder}
              className="space-y-4"
            >

              {/* CUSTOMER */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Customer Name
                </label>

                <input
                  type="text"
                  placeholder="Enter customer name"
                  value={newOrder.customer}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      customer: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    outline-none
                    focus:border-blue-500
                  "
                />

              </div>


              {/* PRODUCT */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Product
                </label>

                <input
                  type="text"
                  placeholder="Enter product name"
                  value={newOrder.product}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      product: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    outline-none
                    focus:border-blue-500
                  "
                />

              </div>


              {/* QUANTITY */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  value={newOrder.quantity}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      quantity: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    outline-none
                    focus:border-blue-500
                  "
                />

              </div>


              {/* AMOUNT */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Amount
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="Enter amount"
                  value={newOrder.amount}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      amount: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    outline-none
                    focus:border-blue-500
                  "
                />

              </div>


              {/* STATUS */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>

                <select
                  value={newOrder.status}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      status: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    outline-none
                    bg-white
                  "
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                </select>

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="
                    px-4
                    py-2
                    rounded-lg
                    border
                    border-gray-300
                    text-gray-600
                    hover:bg-gray-100
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    px-4
                    py-2
                    rounded-lg
                    bg-blue-600
                    text-white
                    hover:bg-blue-700
                  "
                >
                  Add Order
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =================================================
                       EDIT ORDER MODAL
      ================================================= */}

      {editOrder && (

        <div
          className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-[100]
            p-4
          "
        >

          <div
            className="
              bg-white
              rounded-xl
              shadow-xl
              w-full
              max-w-md
              p-6
            "
          >

            {/* HEADER */}

            <div
              className="
                flex
                justify-between
                items-center
                mb-5
              "
            >

              <div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Edit Order
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update order information
                </p>

              </div>

              <button
                onClick={() =>
                  setEditOrder(null)
                }
                className="
                  text-gray-400
                  hover:text-gray-700
                  text-xl
                "
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleUpdateOrder}
              className="space-y-4"
            >

              {/* CUSTOMER */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Customer Name
                </label>

                <input
                  type="text"
                  value={editOrder.customer}
                  onChange={(e) =>
                    setEditOrder({
                      ...editOrder,
                      customer: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    outline-none
                    focus:border-blue-500
                  "
                />

              </div>


              {/* PRODUCT */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Product
                </label>

                <input
                  type="text"
                  value={editOrder.product}
                  onChange={(e) =>
                    setEditOrder({
                      ...editOrder,
                      product: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    outline-none
                    focus:border-blue-500
                  "
                />

              </div>


              {/* QUANTITY */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  value={editOrder.quantity}
                  onChange={(e) =>
                    setEditOrder({
                      ...editOrder,
                      quantity: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    outline-none
                    focus:border-blue-500
                  "
                />

              </div>


              {/* AMOUNT */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Amount
                </label>

                <input
                  type="number"
                  min="0"
                  value={editOrder.amount}
                  onChange={(e) =>
                    setEditOrder({
                      ...editOrder,
                      amount: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    outline-none
                    focus:border-blue-500
                  "
                />

              </div>


              {/* STATUS */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>

                <select
                  value={editOrder.status}
                  onChange={(e) =>
                    setEditOrder({
                      ...editOrder,
                      status: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    outline-none
                    bg-white
                  "
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                </select>

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setEditOrder(null)
                  }
                  className="
                    px-4
                    py-2
                    rounded-lg
                    border
                    border-gray-300
                    text-gray-600
                    hover:bg-gray-100
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    px-4
                    py-2
                    rounded-lg
                    bg-blue-600
                    text-white
                    hover:bg-blue-700
                  "
                >
                  Update Order
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =================================================
                       VIEW ORDER MODAL
      ================================================= */}

      {viewOrder && (

        <div
          className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-[100]
            p-4
          "
        >

          <div
            className="
              bg-white
              rounded-xl
              shadow-xl
              w-full
              max-w-md
              p-6
            "
          >

            {/* HEADER */}

            <div className="flex justify-between items-center mb-5">

              <div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Order Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Complete order information
                </p>

              </div>

              <button
                onClick={() =>
                  setViewOrder(null)
                }
                className="
                  text-gray-400
                  hover:text-gray-700
                  text-xl
                "
              >
                ×
              </button>

            </div>


            {/* DETAILS */}

            <div className="space-y-4">

              <div className="flex justify-between border-b pb-3">

                <span className="text-gray-500">
                  Order ID
                </span>

                <span className="font-medium text-blue-600">
                  {viewOrder.id}
                </span>

              </div>


              <div className="flex justify-between border-b pb-3">

                <span className="text-gray-500">
                  Customer
                </span>

                <span className="font-medium">
                  {viewOrder.customer}
                </span>

              </div>


              <div className="flex justify-between border-b pb-3">

                <span className="text-gray-500">
                  Product
                </span>

                <span className="font-medium">
                  {viewOrder.product}
                </span>

              </div>


              <div className="flex justify-between border-b pb-3">

                <span className="text-gray-500">
                  Quantity
                </span>

                <span className="font-medium">
                  {viewOrder.quantity}
                </span>

              </div>


              <div className="flex justify-between border-b pb-3">

                <span className="text-gray-500">
                  Amount
                </span>

                <span className="font-medium">
                  {viewOrder.amount}
                </span>

              </div>


              <div className="flex justify-between border-b pb-3">

                <span className="text-gray-500">
                  Date
                </span>

                <span className="font-medium">
                  {viewOrder.date}
                </span>

              </div>


              <div className="flex justify-between items-center">

                <span className="text-gray-500">
                  Status
                </span>

                <span
                  className={`
                    px-2
                    py-1
                    rounded-md
                    text-xs
                    font-medium

                    ${
                      viewOrder.status === "Pending"
                        ? "bg-orange-50 text-orange-600"
                        : viewOrder.status === "Processing"
                        ? "bg-purple-50 text-purple-600"
                        : viewOrder.status === "Shipped"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-green-50 text-green-600"
                    }
                  `}
                >
                  {viewOrder.status}
                </span>

              </div>

            </div>


            {/* CLOSE */}

            <div className="flex justify-end mt-6">

              <button
                onClick={() =>
                  setViewOrder(null)
                }
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-blue-600
                  text-white
                  hover:bg-blue-700
                "
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Orders;