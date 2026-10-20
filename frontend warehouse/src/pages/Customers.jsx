import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaUser,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

const STORAGE_KEY = "warehouse_customers";

const getCustomersFromStorage = () => {
  try {
    const storedCustomers = sessionStorage.getItem(STORAGE_KEY);
    return storedCustomers ? JSON.parse(storedCustomers) : [];
  } catch (error) {
    console.error("SessionStorage error:", error);
    return [];
  }
};

const Customers = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [customers, setCustomers] = useState(
    getCustomersFromStorage
  );

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    orders: "",
    status: "Active",
  });

  // Save Customers
  const saveCustomers = (data) => {
    setCustomers(data);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    window.dispatchEvent(new Event("customersUpdated"));
  };

  // Generate Next Customer ID
  const getNextCustomerId = () => {
    const maxId = customers.reduce((max, customer) => {
      const number = parseInt(
        String(customer.id).replace("CUS-", ""),
        10
      );

      return Number.isNaN(number)
        ? max
        : Math.max(max, number);
    }, 0);

    return `CUS-${String(maxId + 1).padStart(3, "0")}`;
  };

  // Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      city: "",
      orders: "",
      status: "Active",
    });
  };

  // Add Customer
  const addCustomer = (e) => {
    e.preventDefault();

    const newCustomer = {
      id: getNextCustomerId(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
      orders: Number(formData.orders) || 0,
      status: formData.status,
    };

    const updatedCustomers = [
      ...customers,
      newCustomer,
    ];

    saveCustomers(updatedCustomers);

    resetForm();
    setShowForm(false);
  };

  // Open Edit Modal
  const openEditModal = (customer) => {
    setEditingCustomer(customer);

    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      city: customer.city,
      orders: String(customer.orders),
      status: customer.status,
    });
  };

  // Update Customer
  const updateCustomer = (e) => {
    e.preventDefault();

    const updatedCustomers = customers.map((customer) =>
      customer.id === editingCustomer.id
        ? {
            ...customer,
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            city: formData.city.trim(),
            orders: Number(formData.orders) || 0,
            status: formData.status,
          }
        : customer
    );

    saveCustomers(updatedCustomers);

    setEditingCustomer(null);
    resetForm();
  };

  // Delete Customer
  const deleteCustomer = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    const updatedCustomers = customers.filter(
      (customer) => customer.id !== id
    );

    saveCustomers(updatedCustomers);
  };

  // Search
  const filteredCustomers = customers.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.id.toLowerCase().includes(searchText) ||
      item.name.toLowerCase().includes(searchText) ||
      item.phone.toLowerCase().includes(searchText) ||
      item.email.toLowerCase().includes(searchText) ||
      item.city.toLowerCase().includes(searchText) ||
      item.status.toLowerCase().includes(searchText)
    );
  });

  // Summary
  const activeCustomers = customers.filter(
    (item) => item.status === "Active"
  ).length;

  const inactiveCustomers = customers.filter(
    (item) => item.status === "Inactive"
  ).length;

  const totalOrders = customers.reduce(
    (total, item) => total + Number(item.orders || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-4">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Customer Management
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage and monitor all customers
          </p>
        </div>

        {/* Add Customer */}
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          <FaPlus className="text-sm" />
          Add Customer
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        {/* Total Customers */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Total Customers
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {customers.length}
              </h2>

              <p className="text-gray-400 text-xs mt-1">
                All customers
              </p>
            </div>

            <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FaUser />
            </div>

          </div>
        </div>

        {/* Active */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">
            Active
          </p>

          <h2 className="text-2xl font-bold mt-2 text-green-600">
            {activeCustomers}
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Active customers
          </p>
        </div>

        {/* Inactive */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">
            Inactive
          </p>

          <h2 className="text-2xl font-bold mt-2 text-red-500">
            {inactiveCustomers}
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Inactive customers
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">
            Total Orders
          </p>

          <h2 className="text-2xl font-bold mt-2 text-purple-600">
            {totalOrders}
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Customer orders
          </p>
        </div>

      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        {/* Table Header */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Customer List
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              All registered customers
            </p>
          </div>

          {/* Search */}
          <div className="relative">

            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-3 text-sm outline-none focus:border-blue-400"
            />

          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-5 py-3 font-medium text-gray-500">
                  Customer ID
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Customer
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Phone
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Email
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  City
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Orders
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

              {filteredCustomers.length > 0 ? (

                filteredCustomers.map((item) => (

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

                    {/* Customer */}
                    <td className="px-4 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <FaUser />
                        </div>

                        <span className="font-medium text-gray-700">
                          {item.name}
                        </span>

                      </div>

                    </td>

                    {/* Phone */}
                    <td className="px-4 py-4 text-gray-600">
                      {item.phone}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-4 text-gray-500">
                      {item.email}
                    </td>

                    {/* City */}
                    <td className="px-4 py-4 text-gray-600">
                      {item.city}
                    </td>

                    {/* Orders */}
                    <td className="px-4 py-4">

                      <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-md text-xs font-medium">
                        {item.orders}
                      </span>

                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">

                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          item.status === "Active"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">

                      <div className="flex justify-center gap-4">

                        {/* View */}
                        <button
                          onClick={() =>
                            setViewingCustomer(item)
                          }
                          className="text-gray-500 hover:text-blue-600"
                          title="View"
                        >
                          <FaEye />
                        </button>

                        {/* Edit */}
                        <button
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
                          onClick={() =>
                            deleteCustomer(item.id)
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
                    className="text-center py-12 text-gray-400"
                  >
                    {customers.length === 0
                      ? "No customers added yet."
                      : "No customers found."}
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Add Customer Modal */}
      {showForm && (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Customer
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Add a new customer
                </p>
              </div>

              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={addCustomer}
              className="p-5"
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Name */}
                <div>
                  <label className="text-sm text-gray-600">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Customer name"
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm text-gray-600">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    pattern="[0-9]{10}"
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
                    placeholder="customer@gmail.com"
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

                {/* Orders */}
                <div>
                  <label className="text-sm text-gray-600">
                    Orders
                  </label>

                  <input
                    type="number"
                    name="orders"
                    value={formData.orders}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
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
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none"
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
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Customer
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit Customer
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Update customer information
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCustomer(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={updateCustomer}
              className="p-5"
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Name */}
                <div>
                  <label className="text-sm text-gray-600">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm text-gray-600">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
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
                    required
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                  />
                </div>

                {/* Orders */}
                <div>
                  <label className="text-sm text-gray-600">
                    Orders
                  </label>

                  <input
                    type="number"
                    name="orders"
                    value={formData.orders}
                    onChange={handleChange}
                    min="0"
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
                    className="w-full mt-1 h-10 px-3 border border-gray-200 rounded-lg outline-none"
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
                  onClick={() => {
                    setEditingCustomer(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Customer
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* View Customer Modal */}
      {viewingCustomer && (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-md rounded-xl shadow-xl">

            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Customer Details
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  {viewingCustomer.id}
                </p>
              </div>

              <button
                onClick={() =>
                  setViewingCustomer(null)
                }
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>

            </div>

            {/* Details */}
            <div className="p-5 space-y-4">

              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">

                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FaUser className="text-lg" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {viewingCustomer.name}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {viewingCustomer.email}
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-xs text-gray-400">
                    Customer ID
                  </p>

                  <p className="text-sm font-medium text-blue-600 mt-1">
                    {viewingCustomer.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Phone
                  </p>

                  <p className="text-sm font-medium text-gray-700 mt-1">
                    {viewingCustomer.phone}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    City
                  </p>

                  <p className="text-sm font-medium text-gray-700 mt-1">
                    {viewingCustomer.city}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Orders
                  </p>

                  <p className="text-sm font-medium text-purple-600 mt-1">
                    {viewingCustomer.orders}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Status
                  </p>

                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded-md text-xs font-medium ${
                      viewingCustomer.status === "Active"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {viewingCustomer.status}
                  </span>
                </div>

              </div>

            </div>

            {/* Close */}
            <div className="flex justify-end px-5 pb-5">

              <button
                onClick={() =>
                  setViewingCustomer(null)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

export default Customers;