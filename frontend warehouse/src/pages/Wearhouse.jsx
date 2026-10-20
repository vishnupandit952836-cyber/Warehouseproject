import React, { useState } from "react";

import {
  FaWarehouse,
  FaMapMarkerAlt,
  FaBox,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

// =====================================================
// SESSION STORAGE KEY
// =====================================================

const STORAGE_KEY = "warehouse_data_v2";

// =====================================================
// GET WAREHOUSES FROM SESSION STORAGE
// =====================================================

const getWarehousesFromStorage = () => {
  try {
    const storedWarehouses =
      sessionStorage.getItem(STORAGE_KEY);

    if (storedWarehouses) {
      return JSON.parse(storedWarehouses);
    }

    // No default warehouse
    return [];
  } catch (error) {
    console.error(
      "SessionStorage error:",
      error
    );

    return [];
  }
};

// =====================================================
// WAREHOUSE COMPONENT
// =====================================================

const Wearhouse = () => {

  // =====================================================
  // WAREHOUSE DATA
  // =====================================================

  const [warehouses, setWarehouses] = useState(
    getWarehousesFromStorage
  );

  // =====================================================
  // ADD WAREHOUSE MODAL
  // =====================================================

  const [showModal, setShowModal] = useState(false);

  // =====================================================
  // EDIT WAREHOUSE
  // =====================================================

  const [editWarehouse, setEditWarehouse] =
    useState(null);

  // =====================================================
  // NEW WAREHOUSE
  // =====================================================

  const [newWarehouse, setNewWarehouse] =
    useState({
      name: "",
      location: "",
      manager: "",
      stock: "",
      capacity: "",
      status: "Active",
    });

  // =====================================================
  // SAVE WAREHOUSES
  // =====================================================

  const saveWarehouses = (updatedWarehouses) => {

    // Update React state
    setWarehouses(updatedWarehouses);

    // Save in session storage
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedWarehouses)
    );

    // Dashboard update event
    window.dispatchEvent(
      new Event("warehousesUpdated")
    );
  };

  // =====================================================
  // GENERATE WAREHOUSE ID
  // =====================================================

  const generateWarehouseId = () => {

    if (warehouses.length === 0) {
      return "WH-001";
    }

    const numbers = warehouses.map(
      (warehouse) => {

        const number = parseInt(
          warehouse.id.replace("WH-", ""),
          10
        );

        return isNaN(number) ? 0 : number;
      }
    );

    const maxNumber = Math.max(...numbers);

    return `WH-${String(
      maxNumber + 1
    ).padStart(3, "0")}`;
  };

  // =====================================================
  // ADD WAREHOUSE
  // =====================================================

  const handleAddWarehouse = (e) => {

    e.preventDefault();

    // Validation
    if (
      !newWarehouse.name.trim() ||
      !newWarehouse.location.trim() ||
      !newWarehouse.manager.trim() ||
      newWarehouse.stock === "" ||
      newWarehouse.capacity === ""
    ) {
      alert(
        "Please fill all warehouse details"
      );

      return;
    }

    const stockNumber = Number(
      newWarehouse.stock
    );

    const capacityNumber = Number(
      newWarehouse.capacity
    );

    // Number validation
    if (
      isNaN(stockNumber) ||
      isNaN(capacityNumber)
    ) {
      alert(
        "Please enter valid numbers"
      );

      return;
    }

    // Stock validation
    if (stockNumber < 0) {
      alert(
        "Stock cannot be negative"
      );

      return;
    }

    // Capacity validation
    if (
      capacityNumber < 0 ||
      capacityNumber > 100
    ) {
      alert(
        "Capacity must be between 0 and 100"
      );

      return;
    }

    // =================================================
    // CREATE WAREHOUSE
    // =================================================

    const warehouse = {
      id: generateWarehouseId(),

      name: newWarehouse.name.trim(),

      location:
        newWarehouse.location.trim(),

      manager:
        newWarehouse.manager.trim(),

      stock: stockNumber,

      capacity: `${capacityNumber}%`,

      status: newWarehouse.status,
    };

    // =================================================
    // ADD WAREHOUSE TO LIST
    // =================================================

    const updatedWarehouses = [
      ...warehouses,
      warehouse,
    ];

    saveWarehouses(
      updatedWarehouses
    );

    // =================================================
    // RESET FORM
    // =================================================

    setNewWarehouse({
      name: "",
      location: "",
      manager: "",
      stock: "",
      capacity: "",
      status: "Active",
    });

    // Close modal
    setShowModal(false);
  };

  // =====================================================
  // DELETE WAREHOUSE
  // =====================================================

  const deleteWarehouse = (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this warehouse?"
      );

    if (!confirmDelete) {
      return;
    }

    const updatedWarehouses =
      warehouses.filter(
        (warehouse) =>
          warehouse.id !== id
      );

    saveWarehouses(
      updatedWarehouses
    );
  };

  // =====================================================
  // EDIT WAREHOUSE
  // =====================================================

  const handleEdit = (warehouse) => {

    setEditWarehouse({
      ...warehouse,

      // 85% -> 85
      capacity:
        warehouse.capacity.replace(
          "%",
          ""
        ),
    });
  };

  // =====================================================
  // UPDATE WAREHOUSE
  // =====================================================

  const handleUpdateWarehouse = (e) => {

    e.preventDefault();

    if (
      !editWarehouse.name.trim() ||
      !editWarehouse.location.trim() ||
      !editWarehouse.manager.trim() ||
      editWarehouse.stock === "" ||
      editWarehouse.capacity === ""
    ) {
      alert(
        "Please fill all warehouse details"
      );

      return;
    }

    const stockNumber = Number(
      editWarehouse.stock
    );

    const capacityNumber = Number(
      editWarehouse.capacity
    );

    // Number validation
    if (
      isNaN(stockNumber) ||
      isNaN(capacityNumber)
    ) {
      alert(
        "Please enter valid numbers"
      );

      return;
    }

    // Stock validation
    if (stockNumber < 0) {
      alert(
        "Stock cannot be negative"
      );

      return;
    }

    // Capacity validation
    if (
      capacityNumber < 0 ||
      capacityNumber > 100
    ) {
      alert(
        "Capacity must be between 0 and 100"
      );

      return;
    }

    // =================================================
    // UPDATE WAREHOUSE
    // =================================================

    const updatedWarehouses =
      warehouses.map(
        (warehouse) => {

          if (
            warehouse.id ===
            editWarehouse.id
          ) {

            return {
              ...warehouse,

              name:
                editWarehouse.name.trim(),

              location:
                editWarehouse.location.trim(),

              manager:
                editWarehouse.manager.trim(),

              stock: stockNumber,

              capacity:
                `${capacityNumber}%`,

              status:
                editWarehouse.status,
            };
          }

          return warehouse;
        }
      );

    // Save updated data
    saveWarehouses(
      updatedWarehouses
    );

    // Close edit modal
    setEditWarehouse(null);
  };

  // =====================================================
  // SUMMARY CALCULATIONS
  // =====================================================

  const totalWarehouses =
    warehouses.length;

  const activeWarehouses =
    warehouses.filter(
      (item) =>
        item.status === "Active"
    ).length;

  const totalStock =
    warehouses.reduce(
      (total, item) =>
        total + Number(item.stock || 0),
      0
    );

  const averageCapacity =
    warehouses.length === 0
      ? 0
      : (
          warehouses.reduce(
            (total, item) =>
              total +
              parseInt(
                item.capacity || "0",
                10
              ),
            0
          ) / warehouses.length
        ).toFixed(1);

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-4">

      {/* =====================================================
                          PAGE HEADER
      ===================================================== */}

      <div className="flex justify-between items-start mb-6">

        <div>

          <h1 className="text-2xl font-semibold text-gray-800">
            Warehouses
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage and monitor all your warehouse locations
          </p>

        </div>

        {/* ADD WAREHOUSE BUTTON */}

        <button
          onClick={() =>
            setShowModal(true)
          }
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

          Add Warehouse

        </button>

      </div>


      {/* =====================================================
                         SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        {/* TOTAL WAREHOUSES */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500 text-sm">
                Total Warehouses
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {totalWarehouses}
              </h2>

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
              <FaWarehouse />
            </div>

          </div>

        </div>


        {/* ACTIVE WAREHOUSES */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Active Warehouses
          </p>

          <h2 className="text-2xl font-bold mt-2 text-green-600">
            {activeWarehouses}
          </h2>

        </div>


        {/* TOTAL STOCK */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Total Stock
          </p>

          <h2 className="text-2xl font-bold mt-2 text-purple-600">
            {totalStock.toLocaleString()}
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Units
          </p>

        </div>


        {/* AVERAGE CAPACITY */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Average Capacity
          </p>

          <h2 className="text-2xl font-bold mt-2 text-orange-500">
            {averageCapacity}%
          </h2>

        </div>

      </div>


      {/* =====================================================
                         WAREHOUSE LIST
      ===================================================== */}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        {/* HEADER */}

        <div
          className="
            p-5
            border-b
            border-gray-100
            flex
            justify-between
            items-center
          "
        >

          <div>

            <h2 className="text-lg font-semibold text-gray-800">
              Warehouse List
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              All registered warehouse locations
            </p>

          </div>

        </div>


        {/* =====================================================
                              TABLE
        ===================================================== */}

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* TABLE HEADER */}

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-5 py-3 font-medium text-gray-500">
                  Warehouse ID
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Warehouse
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Location
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Manager
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Stock
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Capacity
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

              {warehouses.map(
                (warehouse) => (

                  <tr
                    key={warehouse.id}
                    className="
                      border-b
                      border-gray-100
                      hover:bg-gray-50
                    "
                  >

                    {/* ID */}

                    <td className="px-5 py-4">

                      <span className="text-blue-600 font-medium">
                        {warehouse.id}
                      </span>

                    </td>


                    {/* WAREHOUSE */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            w-9
                            h-9
                            rounded-lg
                            bg-blue-50
                            text-blue-600
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <FaWarehouse />
                        </div>

                        <span className="font-medium text-gray-700">
                          {warehouse.name}
                        </span>

                      </div>

                    </td>


                    {/* LOCATION */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2 text-gray-600">

                        <FaMapMarkerAlt className="text-red-500" />

                        {warehouse.location}

                      </div>

                    </td>


                    {/* MANAGER */}

                    <td className="px-4 py-4 text-gray-600">
                      {warehouse.manager}
                    </td>


                    {/* STOCK */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2">

                        <FaBox className="text-purple-500" />

                        <span className="text-gray-600">
                          {Number(
                            warehouse.stock
                          ).toLocaleString()}{" "}
                          units
                        </span>

                      </div>

                    </td>


                    {/* CAPACITY */}

                    <td className="px-4 py-4">

                      <div className="w-28">

                        <div className="flex justify-between mb-1">

                          <span className="text-xs text-gray-500">
                            Capacity
                          </span>

                          <span className="text-xs font-medium">
                            {warehouse.capacity}
                          </span>

                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">

                          <div
                            className={`
                              h-2
                              rounded-full

                              ${
                                parseInt(
                                  warehouse.capacity
                                ) >= 80
                                  ? "bg-red-500"
                                  : parseInt(
                                      warehouse.capacity
                                    ) >= 60
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }
                            `}
                            style={{
                              width:
                                warehouse.capacity,
                            }}
                          ></div>

                        </div>

                      </div>

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
                            warehouse.status ===
                            "Active"
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-500"
                          }
                        `}
                      >
                        {warehouse.status}
                      </span>

                    </td>


                    {/* ACTION */}

                    <td className="px-4 py-4">

                      <div className="flex justify-center gap-4">

                        {/* EDIT */}

                        <button
                          onClick={() =>
                            handleEdit(
                              warehouse
                            )
                          }
                          className="
                            text-blue-500
                            hover:text-blue-700
                          "
                          title="Edit Warehouse"
                        >
                          <FaEdit />
                        </button>


                        {/* DELETE */}

                        <button
                          onClick={() =>
                            deleteWarehouse(
                              warehouse.id
                            )
                          }
                          className="
                            text-red-500
                            hover:text-red-700
                          "
                          title="Delete Warehouse"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>


          {/* =====================================================
                            NO WAREHOUSE
          ===================================================== */}

          {warehouses.length === 0 && (

            <div className="text-center py-12">

              <FaWarehouse
                className="
                  mx-auto
                  text-gray-300
                  text-4xl
                "
              />

              <p className="text-gray-500 mt-3">
                No warehouses found
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Click "Add Warehouse" to add a new warehouse.
              </p>

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
                       ADD WAREHOUSE MODAL
      ===================================================== */}

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

            <div className="flex justify-between items-center mb-5">

              <div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Add Warehouse
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add a new warehouse location
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
              onSubmit={
                handleAddWarehouse
              }
              className="space-y-4"
            >

              {/* NAME */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Warehouse Name
                </label>

                <input
                  type="text"
                  placeholder="Enter warehouse name"
                  value={newWarehouse.name}
                  onChange={(e) =>
                    setNewWarehouse({
                      ...newWarehouse,
                      name: e.target.value,
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


              {/* LOCATION */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Location
                </label>

                <input
                  type="text"
                  placeholder="Enter location"
                  value={
                    newWarehouse.location
                  }
                  onChange={(e) =>
                    setNewWarehouse({
                      ...newWarehouse,
                      location:
                        e.target.value,
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


              {/* MANAGER */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Manager
                </label>

                <input
                  type="text"
                  placeholder="Enter manager name"
                  value={
                    newWarehouse.manager
                  }
                  onChange={(e) =>
                    setNewWarehouse({
                      ...newWarehouse,
                      manager:
                        e.target.value,
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


              {/* STOCK */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="Enter stock"
                  value={
                    newWarehouse.stock
                  }
                  onChange={(e) =>
                    setNewWarehouse({
                      ...newWarehouse,
                      stock:
                        e.target.value,
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


              {/* CAPACITY */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Capacity (%)
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter capacity 0-100"
                  value={
                    newWarehouse.capacity
                  }
                  onChange={(e) =>
                    setNewWarehouse({
                      ...newWarehouse,
                      capacity:
                        e.target.value,
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
                  value={
                    newWarehouse.status
                  }
                  onChange={(e) =>
                    setNewWarehouse({
                      ...newWarehouse,
                      status:
                        e.target.value,
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

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
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
                  Add Warehouse
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =====================================================
                       EDIT WAREHOUSE MODAL
      ===================================================== */}

      {editWarehouse && (

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
                  Edit Warehouse
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update warehouse information
                </p>

              </div>

              <button
                onClick={() =>
                  setEditWarehouse(null)
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
              onSubmit={
                handleUpdateWarehouse
              }
              className="space-y-4"
            >

              {/* NAME */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Warehouse Name
                </label>

                <input
                  type="text"
                  value={
                    editWarehouse.name
                  }
                  onChange={(e) =>
                    setEditWarehouse({
                      ...editWarehouse,
                      name:
                        e.target.value,
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


              {/* LOCATION */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Location
                </label>

                <input
                  type="text"
                  value={
                    editWarehouse.location
                  }
                  onChange={(e) =>
                    setEditWarehouse({
                      ...editWarehouse,
                      location:
                        e.target.value,
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


              {/* MANAGER */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Manager
                </label>

                <input
                  type="text"
                  value={
                    editWarehouse.manager
                  }
                  onChange={(e) =>
                    setEditWarehouse({
                      ...editWarehouse,
                      manager:
                        e.target.value,
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


              {/* STOCK */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    editWarehouse.stock
                  }
                  onChange={(e) =>
                    setEditWarehouse({
                      ...editWarehouse,
                      stock:
                        e.target.value,
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


              {/* CAPACITY */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Capacity (%)
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={
                    editWarehouse.capacity
                  }
                  onChange={(e) =>
                    setEditWarehouse({
                      ...editWarehouse,
                      capacity:
                        e.target.value,
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
                  value={
                    editWarehouse.status
                  }
                  onChange={(e) =>
                    setEditWarehouse({
                      ...editWarehouse,
                      status:
                        e.target.value,
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

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setEditWarehouse(null)
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
                  Update Warehouse
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Wearhouse;