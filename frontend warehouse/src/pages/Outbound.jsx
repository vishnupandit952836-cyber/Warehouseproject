import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaTruck,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

const STORAGE_KEY = "warehouse_outbound";

// Get data from sessionStorage
const getOutboundFromStorage = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("SessionStorage error:", error);
    return [];
  }
};

// Today's date
const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

// Format date
const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Outbound = () => {
  const [search, setSearch] = useState("");

  // Add modal
  const [showForm, setShowForm] = useState(false);

  // Edit modal
  const [editItem, setEditItem] = useState(null);

  // View modal
  const [viewItem, setViewItem] = useState(null);

  // Outbound data
  const [outbound, setOutbound] = useState(getOutboundFromStorage);

  // Empty form
  const emptyForm = {
    order: "",
    customer: "",
    product: "",
    quantity: "",
    warehouse: "",
    date: getToday(),
    status: "Pending",
  };

  const [formData, setFormData] = useState(emptyForm);

  // --------------------------------------------------
  // Save data to sessionStorage
  // --------------------------------------------------

  const saveOutbound = (data) => {
    setOutbound(data);

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );

    // Optional event for other components
    window.dispatchEvent(
      new Event("outboundUpdated")
    );
  };

  // --------------------------------------------------
  // Generate next Outbound ID
  // --------------------------------------------------

  const getNextId = () => {
    const maxId = outbound.reduce((max, item) => {
      const number = parseInt(
        String(item.id).replace("OUT-", ""),
        10
      );

      if (Number.isNaN(number)) {
        return max;
      }

      return Math.max(max, number);
    }, 0);

    return `OUT-${String(maxId + 1).padStart(3, "0")}`;
  };

  // --------------------------------------------------
  // Form input
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Open Add Modal
  // --------------------------------------------------

  const openAddModal = () => {
    setFormData({
      ...emptyForm,
      date: getToday(),
    });

    setShowForm(true);
  };

  // --------------------------------------------------
  // Add Outbound
  // --------------------------------------------------

  const addOutbound = (e) => {
    e.preventDefault();

    const quantity = Number(formData.quantity);

    if (!formData.order.trim()) {
      alert("Please enter Order ID.");
      return;
    }

    if (!formData.customer.trim()) {
      alert("Please enter Customer name.");
      return;
    }

    if (!formData.product.trim()) {
      alert("Please enter Product name.");
      return;
    }

    if (!formData.warehouse) {
      alert("Please select Warehouse.");
      return;
    }

    if (!formData.date) {
      alert("Please select Date.");
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    const newOutbound = {
      id: getNextId(),
      order: formData.order.trim(),
      customer: formData.customer.trim(),
      product: formData.product.trim(),
      quantity,
      warehouse: formData.warehouse,
      date: formData.date,
      status: formData.status,
    };

    const updatedData = [
      ...outbound,
      newOutbound,
    ];

    saveOutbound(updatedData);

    setFormData({
      ...emptyForm,
      date: getToday(),
    });

    setShowForm(false);
  };

  // --------------------------------------------------
  // Open Edit Modal
  // --------------------------------------------------

  const openEditModal = (item) => {
    setEditItem({
      ...item,
    });
  };

  // --------------------------------------------------
  // Edit Input
  // --------------------------------------------------

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Update Outbound
  // --------------------------------------------------

  const updateOutbound = (e) => {
    e.preventDefault();

    if (!editItem) return;

    const quantity = Number(editItem.quantity);

    if (!editItem.order?.trim()) {
      alert("Please enter Order ID.");
      return;
    }

    if (!editItem.customer?.trim()) {
      alert("Please enter Customer name.");
      return;
    }

    if (!editItem.product?.trim()) {
      alert("Please enter Product name.");
      return;
    }

    if (!editItem.warehouse) {
      alert("Please select Warehouse.");
      return;
    }

    if (!editItem.date) {
      alert("Please select Date.");
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    const updatedData = outbound.map((item) =>
      item.id === editItem.id
        ? {
            ...editItem,
            order: editItem.order.trim(),
            customer: editItem.customer.trim(),
            product: editItem.product.trim(),
            quantity,
          }
        : item
    );

    saveOutbound(updatedData);

    setEditItem(null);
  };

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const deleteOutbound = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this outbound entry?"
    );

    if (!confirmDelete) return;

    const updatedData = outbound.filter(
      (item) => item.id !== id
    );

    saveOutbound(updatedData);
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const searchText = search.toLowerCase().trim();

  const filteredOutbound = outbound.filter((item) => {
    return (
      String(item.id)
        .toLowerCase()
        .includes(searchText) ||
      String(item.order)
        .toLowerCase()
        .includes(searchText) ||
      String(item.customer)
        .toLowerCase()
        .includes(searchText) ||
      String(item.product)
        .toLowerCase()
        .includes(searchText) ||
      String(item.warehouse)
        .toLowerCase()
        .includes(searchText) ||
      String(item.status)
        .toLowerCase()
        .includes(searchText)
    );
  });

  // --------------------------------------------------
  // Status class
  // --------------------------------------------------

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-orange-50 text-orange-600";

      case "Processing":
        return "bg-purple-50 text-purple-600";

      case "Shipped":
        return "bg-blue-50 text-blue-600";

      case "Delivered":
        return "bg-green-50 text-green-600";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-4">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Outbound Management
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage and monitor all outgoing stock
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          <FaPlus className="text-sm" />
          Add Outbound
        </button>

      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        {/* Total */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Total Outbound
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {outbound.length}
              </h2>

              <p className="text-gray-400 text-xs mt-1">
                All shipments
              </p>
            </div>

            <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FaTruck />
            </div>

          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">
            Pending
          </p>

          <h2 className="text-2xl font-bold mt-2 text-orange-500">
            {
              outbound.filter(
                (item) =>
                  item.status === "Pending"
              ).length
            }
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Waiting for dispatch
          </p>
        </div>

        {/* Processing */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">
            Processing
          </p>

          <h2 className="text-2xl font-bold mt-2 text-purple-600">
            {
              outbound.filter(
                (item) =>
                  item.status === "Processing"
              ).length
            }
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Being prepared
          </p>
        </div>

        {/* Shipped */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">
            Shipped
          </p>

          <h2 className="text-2xl font-bold mt-2 text-green-600">
            {
              outbound.filter(
                (item) =>
                  item.status === "Shipped"
              ).length
            }
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Successfully dispatched
          </p>
        </div>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        {/* Table Header */}

        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4">

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Outbound List
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              All outgoing stock shipments
            </p>
          </div>

          {/* Search */}

          <div className="relative">

            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search outbound..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="h-10 w-full md:w-64 bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-3 text-sm outline-none focus:border-blue-400"
            />

          </div>

        </div>

        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-5 py-3 font-medium text-gray-500">
                  Outbound ID
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
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
                  Warehouse
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

            <tbody>

              {filteredOutbound.length > 0 ? (

                filteredOutbound.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >

                    {/* Outbound ID */}

                    <td className="px-5 py-4">
                      <span className="text-blue-600 font-medium">
                        {item.id}
                      </span>
                    </td>

                    {/* Order */}

                    <td className="px-4 py-4">
                      <span className="text-blue-600 font-medium">
                        {item.order}
                      </span>
                    </td>

                    {/* Customer */}

                    <td className="px-4 py-4 font-medium text-gray-700">
                      {item.customer}
                    </td>

                    {/* Product */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2">

                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <FaTruck />
                        </div>

                        <span className="text-gray-600">
                          {item.product}
                        </span>

                      </div>

                    </td>

                    {/* Quantity */}

                    <td className="px-4 py-4">

                      <span className="font-medium text-gray-700">
                        {item.quantity}
                      </span>

                      <span className="text-gray-400 ml-1">
                        units
                      </span>

                    </td>

                    {/* Warehouse */}

                    <td className="px-4 py-4 text-gray-600">
                      {item.warehouse}
                    </td>

                    {/* Date */}

                    <td className="px-4 py-4 text-gray-500">
                      {formatDate(item.date)}
                    </td>

                    {/* Status */}

                    <td className="px-4 py-4">

                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>

                    </td>

                    {/* Actions */}

                    <td className="px-4 py-4">

                      <div className="flex justify-center gap-4">

                        {/* View */}

                        <button
                          type="button"
                          onClick={() =>
                            setViewItem(item)
                          }
                          title="View"
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <FaEye />
                        </button>

                        {/* Edit */}

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(item)
                          }
                          title="Edit"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>

                        {/* Delete */}

                        <button
                          type="button"
                          onClick={() =>
                            deleteOutbound(item.id)
                          }
                          title="Delete"
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    className="text-center py-12"
                  >

                    <FaTruck className="mx-auto text-3xl text-gray-300 mb-3" />

                    <p className="text-gray-500 font-medium">
                      No outbound entries found
                    </p>

                    <p className="text-gray-400 text-sm mt-1">
                      Click "Add Outbound" to create a new shipment.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================================
          ADD OUTBOUND MODAL
      ================================================= */}

      {showForm && (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* Header */}

            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Outbound
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Add a new outgoing stock shipment
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={addOutbound}
              className="p-5"
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Order ID */}

                <div>
                  <label className="text-sm text-gray-600">
                    Order ID
                  </label>

                  <input
                    type="text"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    placeholder="ORD-001"
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Customer */}

                <div>
                  <label className="text-sm text-gray-600">
                    Customer
                  </label>

                  <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    placeholder="Customer name"
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Product */}

                <div>
                  <label className="text-sm text-gray-600">
                    Product
                  </label>

                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    placeholder="Product name"
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Quantity */}

                <div>
                  <label className="text-sm text-gray-600">
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Quantity"
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Warehouse */}

                <div>
                  <label className="text-sm text-gray-600">
                    Warehouse
                  </label>

                  <select
                    name="warehouse"
                    value={formData.warehouse}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  >
                    <option value="">
                      Select Warehouse
                    </option>

                    <option value="Main Warehouse">
                      Main Warehouse
                    </option>

                    <option value="North Warehouse">
                      North Warehouse
                    </option>

                    <option value="South Warehouse">
                      South Warehouse
                    </option>

                    <option value="Backup Warehouse">
                      Backup Warehouse
                    </option>
                  </select>
                </div>

                {/* Date */}

                <div>
                  <label className="text-sm text-gray-600">
                    Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Status */}

                <div className="sm:col-span-2">

                  <label className="text-sm text-gray-600">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
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

              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Outbound
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          EDIT OUTBOUND MODAL
      ================================================= */}

      {editItem && (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* Header */}

            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit Outbound
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Update outbound shipment details
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={updateOutbound}
              className="p-5"
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Outbound ID */}

                <div>
                  <label className="text-sm text-gray-600">
                    Outbound ID
                  </label>

                  <input
                    type="text"
                    value={editItem.id}
                    disabled
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                {/* Order ID */}

                <div>
                  <label className="text-sm text-gray-600">
                    Order ID
                  </label>

                  <input
                    type="text"
                    name="order"
                    value={editItem.order}
                    onChange={handleEditChange}
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Customer */}

                <div>
                  <label className="text-sm text-gray-600">
                    Customer
                  </label>

                  <input
                    type="text"
                    name="customer"
                    value={editItem.customer}
                    onChange={handleEditChange}
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Product */}

                <div>
                  <label className="text-sm text-gray-600">
                    Product
                  </label>

                  <input
                    type="text"
                    name="product"
                    value={editItem.product}
                    onChange={handleEditChange}
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Quantity */}

                <div>
                  <label className="text-sm text-gray-600">
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={editItem.quantity}
                    onChange={handleEditChange}
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Warehouse */}

                <div>
                  <label className="text-sm text-gray-600">
                    Warehouse
                  </label>

                  <select
                    name="warehouse"
                    value={editItem.warehouse}
                    onChange={handleEditChange}
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  >
                    <option value="">
                      Select Warehouse
                    </option>

                    <option value="Main Warehouse">
                      Main Warehouse
                    </option>

                    <option value="North Warehouse">
                      North Warehouse
                    </option>

                    <option value="South Warehouse">
                      South Warehouse
                    </option>

                    <option value="Backup Warehouse">
                      Backup Warehouse
                    </option>
                  </select>
                </div>

                {/* Date */}

                <div>
                  <label className="text-sm text-gray-600">
                    Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={editItem.date}
                    onChange={handleEditChange}
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Status */}

                <div>
                  <label className="text-sm text-gray-600">
                    Status
                  </label>

                  <select
                    name="status"
                    value={editItem.status}
                    onChange={handleEditChange}
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
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

              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Outbound
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          VIEW OUTBOUND MODAL
      ================================================= */}

      {viewItem && (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-md rounded-xl shadow-xl">

            {/* Header */}

            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Outbound Details
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Shipment information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>

            </div>

            {/* Details */}

            <div className="p-5 space-y-4">

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  Outbound ID
                </span>

                <span className="font-medium text-blue-600">
                  {viewItem.id}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  Order ID
                </span>

                <span className="font-medium text-blue-600">
                  {viewItem.order}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  Customer
                </span>

                <span className="font-medium text-gray-700">
                  {viewItem.customer}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  Product
                </span>

                <span className="font-medium text-gray-700">
                  {viewItem.product}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  Quantity
                </span>

                <span className="font-medium text-gray-700">
                  {viewItem.quantity} units
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  Warehouse
                </span>

                <span className="font-medium text-gray-700">
                  {viewItem.warehouse}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  Date
                </span>

                <span className="font-medium text-gray-700">
                  {formatDate(viewItem.date)}
                </span>
              </div>

              <div className="flex justify-between items-center">

                <span className="text-gray-500">
                  Status
                </span>

                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(
                    viewItem.status
                  )}`}
                >
                  {viewItem.status}
                </span>

              </div>

            </div>

            {/* Close */}

            <div className="flex justify-end px-5 pb-5">

              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
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

export default Outbound;