import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaBuilding,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

const STORAGE_KEY = "warehouse_suppliers";

// Get suppliers from sessionStorage
const getSuppliersFromStorage = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("SessionStorage error:", error);
    return [];
  }
};

const Suppliers = () => {
  const [search, setSearch] = useState("");

  // Add modal
  const [showForm, setShowForm] = useState(false);

  // Edit modal
  const [editSupplier, setEditSupplier] = useState(null);

  // View modal
  const [viewSupplier, setViewSupplier] = useState(null);

  // Suppliers data
  const [suppliers, setSuppliers] = useState(
    getSuppliersFromStorage
  );

  // Empty form
  const emptyForm = {
    name: "",
    contact: "",
    email: "",
    city: "",
    products: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(emptyForm);

  // --------------------------------------------------
  // Save suppliers
  // --------------------------------------------------

  const saveSuppliers = (data) => {
    setSuppliers(data);

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );

    window.dispatchEvent(
      new Event("suppliersUpdated")
    );
  };

  // --------------------------------------------------
  // Generate Supplier ID
  // --------------------------------------------------

  const getNextId = () => {
    const maxId = suppliers.reduce((max, item) => {
      const number = parseInt(
        String(item.id).replace("SUP-", ""),
        10
      );

      if (Number.isNaN(number)) {
        return max;
      }

      return Math.max(max, number);
    }, 0);

    return `SUP-${String(maxId + 1).padStart(3, "0")}`;
  };

  // --------------------------------------------------
  // Input Change
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
    });

    setShowForm(true);
  };

  // --------------------------------------------------
  // Add Supplier
  // --------------------------------------------------

  const addSupplier = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter supplier name.");
      return;
    }

    if (!formData.contact.trim()) {
      alert("Please enter contact number.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.contact.trim())) {
      alert("Contact number must contain exactly 10 digits.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter email.");
      return;
    }

    if (!formData.city.trim()) {
      alert("Please enter city.");
      return;
    }

    if (!formData.products.trim()) {
      alert("Please enter products.");
      return;
    }

    const newSupplier = {
      id: getNextId(),
      name: formData.name.trim(),
      contact: formData.contact.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
      products: formData.products.trim(),
      status: formData.status,
    };

    const updatedSuppliers = [
      ...suppliers,
      newSupplier,
    ];

    saveSuppliers(updatedSuppliers);

    setFormData({
      ...emptyForm,
    });

    setShowForm(false);
  };

  // --------------------------------------------------
  // Open Edit Modal
  // --------------------------------------------------

  const openEditModal = (supplier) => {
    setEditSupplier({
      ...supplier,
    });
  };

  // --------------------------------------------------
  // Edit Input
  // --------------------------------------------------

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditSupplier((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Update Supplier
  // --------------------------------------------------

  const updateSupplier = (e) => {
    e.preventDefault();

    if (!editSupplier) return;

    if (!editSupplier.name?.trim()) {
      alert("Please enter supplier name.");
      return;
    }

    if (!editSupplier.contact?.trim()) {
      alert("Please enter contact number.");
      return;
    }

    if (
      !/^[0-9]{10}$/.test(
        editSupplier.contact.trim()
      )
    ) {
      alert("Contact number must contain exactly 10 digits.");
      return;
    }

    if (!editSupplier.email?.trim()) {
      alert("Please enter email.");
      return;
    }

    if (!editSupplier.city?.trim()) {
      alert("Please enter city.");
      return;
    }

    if (!editSupplier.products?.trim()) {
      alert("Please enter products.");
      return;
    }

    const updatedSuppliers = suppliers.map(
      (supplier) =>
        supplier.id === editSupplier.id
          ? {
              ...editSupplier,
              name: editSupplier.name.trim(),
              contact: editSupplier.contact.trim(),
              email: editSupplier.email.trim(),
              city: editSupplier.city.trim(),
              products: editSupplier.products.trim(),
            }
          : supplier
    );

    saveSuppliers(updatedSuppliers);

    setEditSupplier(null);
  };

  // --------------------------------------------------
  // Delete Supplier
  // --------------------------------------------------

  const deleteSupplier = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmDelete) return;

    const updatedSuppliers = suppliers.filter(
      (supplier) => supplier.id !== id
    );

    saveSuppliers(updatedSuppliers);
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const searchText = search.toLowerCase().trim();

  const filteredSuppliers = suppliers.filter(
    (item) =>
      String(item.id)
        .toLowerCase()
        .includes(searchText) ||
      String(item.name)
        .toLowerCase()
        .includes(searchText) ||
      String(item.contact)
        .toLowerCase()
        .includes(searchText) ||
      String(item.email)
        .toLowerCase()
        .includes(searchText) ||
      String(item.city)
        .toLowerCase()
        .includes(searchText) ||
      String(item.products)
        .toLowerCase()
        .includes(searchText) ||
      String(item.status)
        .toLowerCase()
        .includes(searchText)
  );

  // --------------------------------------------------
  // Status Class
  // --------------------------------------------------

  const getStatusClass = (status) => {
    if (status === "Active") {
      return "bg-green-50 text-green-600";
    }

    return "bg-red-50 text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-4">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Supplier Management
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage and monitor all suppliers
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          <FaPlus className="text-sm" />
          Add Supplier
        </button>

      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        {/* Total Suppliers */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Total Suppliers
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {suppliers.length}
              </h2>

              <p className="text-gray-400 text-xs mt-1">
                All suppliers
              </p>
            </div>

            <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FaBuilding />
            </div>

          </div>

        </div>

        {/* Active */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Active
          </p>

          <h2 className="text-2xl font-bold mt-2 text-green-600">
            {
              suppliers.filter(
                (item) =>
                  item.status === "Active"
              ).length
            }
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Active suppliers
          </p>

        </div>

        {/* Inactive */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Inactive
          </p>

          <h2 className="text-2xl font-bold mt-2 text-red-500">
            {
              suppliers.filter(
                (item) =>
                  item.status === "Inactive"
              ).length
            }
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Inactive suppliers
          </p>

        </div>

        {/* Cities */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Cities
          </p>

          <h2 className="text-2xl font-bold mt-2 text-purple-600">
            {
              new Set(
                suppliers
                  .map((item) => item.city)
                  .filter(Boolean)
              ).size
            }
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Supplier locations
          </p>

        </div>

      </div>

      {/* =================================================
          SUPPLIER TABLE
      ================================================= */}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        {/* Table Header */}

        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4">

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Supplier List
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              All registered suppliers
            </p>
          </div>

          {/* Search */}

          <div className="relative">

            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search supplier..."
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
                  Supplier ID
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Supplier
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Contact
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Email
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  City
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Products
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

              {filteredSuppliers.length > 0 ? (

                filteredSuppliers.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >

                    {/* ID */}

                    <td className="px-5 py-4">

                      <span className="text-blue-600 font-medium">
                        {item.id}
                      </span>

                    </td>

                    {/* Supplier */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <FaBuilding />
                        </div>

                        <span className="font-medium text-gray-700">
                          {item.name}
                        </span>

                      </div>

                    </td>

                    {/* Contact */}

                    <td className="px-4 py-4 text-gray-600">
                      {item.contact}
                    </td>

                    {/* Email */}

                    <td className="px-4 py-4 text-gray-500">
                      {item.email}
                    </td>

                    {/* City */}

                    <td className="px-4 py-4 text-gray-600">
                      {item.city}
                    </td>

                    {/* Products */}

                    <td className="px-4 py-4">

                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">
                        {item.products}
                      </span>

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
                            setViewSupplier(item)
                          }
                          className="text-gray-500 hover:text-blue-600"
                          title="View"
                        >
                          <FaEye />
                        </button>

                        {/* Edit */}

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(item)
                          }
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        {/* Delete */}

                        <button
                          type="button"
                          onClick={() =>
                            deleteSupplier(item.id)
                          }
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
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
                    colSpan="8"
                    className="text-center py-12"
                  >

                    <FaBuilding className="mx-auto text-3xl text-gray-300 mb-3" />

                    <p className="text-gray-500 font-medium">
                      No suppliers found
                    </p>

                    <p className="text-gray-400 text-sm mt-1">
                      Click "Add Supplier" to create a supplier.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================================
          ADD SUPPLIER MODAL
      ================================================= */}

      {showForm && (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* Header */}

            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Supplier
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Add a new supplier
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
              onSubmit={addSupplier}
              className="p-5"
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Name */}

                <div>
                  <label className="text-sm text-gray-600">
                    Supplier Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Supplier name"
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Contact */}

                <div>
                  <label className="text-sm text-gray-600">
                    Contact Number
                  </label>

                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength="10"
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Email */}

                <div>
                  <label className="text-sm text-gray-600">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="supplier@gmail.com"
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* City */}

                <div>
                  <label className="text-sm text-gray-600">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Products */}

                <div>
                  <label className="text-sm text-gray-600">
                    Products
                  </label>

                  <input
                    type="text"
                    name="products"
                    value={formData.products}
                    onChange={handleChange}
                    placeholder="Electronics"
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
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
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
                  Add Supplier
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          EDIT SUPPLIER MODAL
      ================================================= */}

      {editSupplier && (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* Header */}

            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit Supplier
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Update supplier information
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditSupplier(null)
                }
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={updateSupplier}
              className="p-5"
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* ID */}

                <div>
                  <label className="text-sm text-gray-600">
                    Supplier ID
                  </label>

                  <input
                    type="text"
                    value={editSupplier.id}
                    disabled
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                {/* Name */}

                <div>
                  <label className="text-sm text-gray-600">
                    Supplier Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={editSupplier.name}
                    onChange={handleEditChange}
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Contact */}

                <div>
                  <label className="text-sm text-gray-600">
                    Contact Number
                  </label>

                  <input
                    type="tel"
                    name="contact"
                    value={editSupplier.contact}
                    onChange={handleEditChange}
                    maxLength="10"
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Email */}

                <div>
                  <label className="text-sm text-gray-600">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={editSupplier.email}
                    onChange={handleEditChange}
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* City */}

                <div>
                  <label className="text-sm text-gray-600">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={editSupplier.city}
                    onChange={handleEditChange}
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Products */}

                <div>
                  <label className="text-sm text-gray-600">
                    Products
                  </label>

                  <input
                    type="text"
                    name="products"
                    value={editSupplier.products}
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
                    value={editSupplier.status}
                    onChange={handleEditChange}
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>

              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={() =>
                    setEditSupplier(null)
                  }
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Supplier
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          VIEW SUPPLIER MODAL
      ================================================= */}

      {viewSupplier && (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-md rounded-xl shadow-xl">

            {/* Header */}

            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Supplier Details
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Supplier information
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setViewSupplier(null)
                }
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>

            </div>

            {/* Details */}

            <div className="p-5 space-y-4">

              {/* ID */}

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  Supplier ID
                </span>

                <span className="font-medium text-blue-600">
                  {viewSupplier.id}
                </span>
              </div>

              {/* Name */}

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  Supplier
                </span>

                <span className="font-medium text-gray-700">
                  {viewSupplier.name}
                </span>
              </div>

              {/* Contact */}

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  Contact
                </span>

                <span className="font-medium text-gray-700">
                  {viewSupplier.contact}
                </span>
              </div>

              {/* Email */}

              <div className="flex justify-between border-b pb-3 gap-4">
                <span className="text-gray-500">
                  Email
                </span>

                <span className="font-medium text-gray-700 break-all text-right">
                  {viewSupplier.email}
                </span>
              </div>

              {/* City */}

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  City
                </span>

                <span className="font-medium text-gray-700">
                  {viewSupplier.city}
                </span>
              </div>

              {/* Products */}

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  Products
                </span>

                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">
                  {viewSupplier.products}
                </span>
              </div>

              {/* Status */}

              <div className="flex justify-between items-center">
                <span className="text-gray-500">
                  Status
                </span>

                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(
                    viewSupplier.status
                  )}`}
                >
                  {viewSupplier.status}
                </span>
              </div>

            </div>

            {/* Close */}

            <div className="flex justify-end px-5 pb-5">

              <button
                type="button"
                onClick={() =>
                  setViewSupplier(null)
                }
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

export default Suppliers;