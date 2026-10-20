import React, { useState } from "react";

import {
  FaSearch,
  FaPlus,
  FaTruckLoading,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

// =====================================================
// SESSION STORAGE KEY
// =====================================================

const STORAGE_KEY = "warehouse_inbound";

// =====================================================
// GET INBOUND DATA FROM SESSION STORAGE
// =====================================================

const getInboundFromStorage = () => {
  try {
    const storedInbound = sessionStorage.getItem(STORAGE_KEY);

    if (storedInbound) {
      return JSON.parse(storedInbound);
    }

    return [];
  } catch (error) {
    console.error("SessionStorage error:", error);

    return [];
  }
};

// =====================================================
// INBOUND COMPONENT
// =====================================================

const Inbound = () => {

  // =====================================================
  // INBOUND DATA
  // =====================================================

  const [inbound, setInbound] = useState(
    getInboundFromStorage
  );

  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] = useState("");

  // =====================================================
  // ADD MODAL
  // =====================================================

  const [showModal, setShowModal] = useState(false);

  // =====================================================
  // EDIT DATA
  // =====================================================

  const [editInbound, setEditInbound] = useState(null);

  // =====================================================
  // VIEW DATA
  // =====================================================

  const [viewInbound, setViewInbound] = useState(null);

  // =====================================================
  // NEW INBOUND FORM
  // =====================================================

  const [newInbound, setNewInbound] = useState({
    supplier: "",
    product: "",
    quantity: "",
    warehouse: "",
    date: "",
    status: "Pending",
  });

  // =====================================================
  // SAVE DATA
  // =====================================================

  const saveInbound = (updatedInbound) => {

    setInbound(updatedInbound);

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedInbound)
    );
  };

  // =====================================================
  // ADD INBOUND
  // =====================================================

  const handleAddInbound = (e) => {

    e.preventDefault();

    if (
      !newInbound.supplier.trim() ||
      !newInbound.product.trim() ||
      newInbound.quantity === "" ||
      !newInbound.warehouse.trim() ||
      !newInbound.date
    ) {
      alert("Please fill all inbound details");
      return;
    }

    const quantityNumber = Number(newInbound.quantity);

    if (quantityNumber <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    // =================================================
    // CREATE ID
    // =================================================

    const newId = `INB-${String(
      inbound.length + 1
    ).padStart(3, "0")}`;

    // =================================================
    // CREATE INBOUND
    // =================================================

    const newEntry = {
      id: newId,
      supplier: newInbound.supplier.trim(),
      product: newInbound.product.trim(),
      quantity: quantityNumber,
      warehouse: newInbound.warehouse.trim(),
      date: newInbound.date,
      status: newInbound.status,
    };

    // =================================================
    // ADD
    // =================================================

    const updatedInbound = [
      ...inbound,
      newEntry,
    ];

    saveInbound(updatedInbound);

    // =================================================
    // RESET FORM
    // =================================================

    setNewInbound({
      supplier: "",
      product: "",
      quantity: "",
      warehouse: "",
      date: "",
      status: "Pending",
    });

    setShowModal(false);
  };

  // =====================================================
  // DELETE INBOUND
  // =====================================================

  const deleteInbound = (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inbound entry?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedInbound = inbound.filter(
      (item) => item.id !== id
    );

    saveInbound(updatedInbound);
  };

  // =====================================================
  // EDIT INBOUND
  // =====================================================

  const handleEdit = (item) => {

    setEditInbound({
      ...item,
    });
  };

  // =====================================================
  // UPDATE INBOUND
  // =====================================================

  const handleUpdateInbound = (e) => {

    e.preventDefault();

    if (
      !editInbound.supplier.trim() ||
      !editInbound.product.trim() ||
      editInbound.quantity === "" ||
      !editInbound.warehouse.trim() ||
      !editInbound.date
    ) {
      alert("Please fill all inbound details");
      return;
    }

    const quantityNumber = Number(
      editInbound.quantity
    );

    if (quantityNumber <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    const updatedInbound = inbound.map(
      (item) => {

        if (item.id === editInbound.id) {

          return {
            ...item,

            supplier:
              editInbound.supplier.trim(),

            product:
              editInbound.product.trim(),

            quantity:
              quantityNumber,

            warehouse:
              editInbound.warehouse.trim(),

            date:
              editInbound.date,

            status:
              editInbound.status,
          };
        }

        return item;
      }
    );

    saveInbound(updatedInbound);

    setEditInbound(null);
  };

  // =====================================================
  // SEARCH FILTER
  // =====================================================

  const filteredInbound = inbound.filter(
    (item) => {

      const searchText =
        search.toLowerCase();

      return (
        item.id
          .toLowerCase()
          .includes(searchText) ||

        item.supplier
          .toLowerCase()
          .includes(searchText) ||

        item.product
          .toLowerCase()
          .includes(searchText) ||

        item.warehouse
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

      {/* =====================================================
                         PAGE HEADER
      ===================================================== */}

      <div className="flex justify-between items-start mb-6">

        <div>

          <h1 className="text-2xl font-semibold text-gray-800">
            Inbound Management
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage and monitor all incoming stock
          </p>

        </div>

        {/* ADD BUTTON */}

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

          Add Inbound

        </button>

      </div>


      {/* =====================================================
                         SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        {/* TOTAL */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500 text-sm">
                Total Inbound
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {inbound.length}
              </h2>

              <p className="text-gray-400 text-xs mt-1">
                All shipments
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

              <FaTruckLoading />

            </div>

          </div>

        </div>


        {/* PENDING */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Pending
          </p>

          <h2 className="text-2xl font-bold mt-2 text-orange-500">

            {
              inbound.filter(
                (item) =>
                  item.status === "Pending"
              ).length
            }

          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Waiting for arrival
          </p>

        </div>


        {/* PROCESSING */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Processing
          </p>

          <h2 className="text-2xl font-bold mt-2 text-purple-600">

            {
              inbound.filter(
                (item) =>
                  item.status === "Processing"
              ).length
            }

          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Being received
          </p>

        </div>


        {/* RECEIVED */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Received
          </p>

          <h2 className="text-2xl font-bold mt-2 text-green-600">

            {
              inbound.filter(
                (item) =>
                  item.status === "Received"
              ).length
            }

          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Completed shipments
          </p>

        </div>

      </div>


      {/* =====================================================
                           INBOUND LIST
      ===================================================== */}

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
              Inbound List
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              All incoming stock shipments
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
              placeholder="Search inbound..."
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


        {/* =====================================================
                              TABLE
        ===================================================== */}

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* TABLE HEADER */}

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-5 py-3 font-medium text-gray-500">
                  Inbound ID
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Supplier
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


            {/* TABLE BODY */}

            <tbody>

              {filteredInbound.map(
                (item) => (

                  <tr
                    key={item.id}
                    className="
                      border-b
                      border-gray-100
                      hover:bg-gray-50
                    "
                  >

                    {/* ID */}

                    <td className="px-5 py-4">

                      <span className="text-blue-600 font-medium">
                        {item.id}
                      </span>

                    </td>


                    {/* SUPPLIER */}

                    <td className="px-4 py-4 font-medium text-gray-700">
                      {item.supplier}
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

                          <FaTruckLoading />

                        </div>

                        <span className="text-gray-600">
                          {item.product}
                        </span>

                      </div>

                    </td>


                    {/* QUANTITY */}

                    <td className="px-4 py-4">

                      <span className="font-medium text-gray-700">
                        {item.quantity}
                      </span>

                      <span className="text-gray-400 ml-1">
                        units
                      </span>

                    </td>


                    {/* WAREHOUSE */}

                    <td className="px-4 py-4 text-gray-600">
                      {item.warehouse}
                    </td>


                    {/* DATE */}

                    <td className="px-4 py-4 text-gray-500">
                      {item.date}
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
                            item.status === "Pending"
                              ? "bg-orange-50 text-orange-600"
                              : item.status === "Processing"
                              ? "bg-purple-50 text-purple-600"
                              : "bg-green-50 text-green-600"
                          }
                        `}
                      >

                        {item.status}

                      </span>

                    </td>


                    {/* ACTION */}

                    <td className="px-4 py-4">

                      <div className="flex justify-center gap-4">

                        {/* VIEW */}

                        <button
                          onClick={() =>
                            setViewInbound(item)
                          }
                          className="
                            text-gray-500
                            hover:text-blue-600
                          "
                          title="View"
                        >

                          <FaEye />

                        </button>


                        {/* EDIT */}

                        <button
                          onClick={() =>
                            handleEdit(item)
                          }
                          className="
                            text-blue-500
                            hover:text-blue-700
                          "
                          title="Edit"
                        >

                          <FaEdit />

                        </button>


                        {/* DELETE */}

                        <button
                          onClick={() =>
                            deleteInbound(item.id)
                          }
                          className="
                            text-red-500
                            hover:text-red-700
                          "
                          title="Delete"
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


          {/* NO DATA */}

          {filteredInbound.length === 0 && (

            <div className="text-center py-10">

              <FaTruckLoading
                className="
                  mx-auto
                  text-gray-300
                  text-3xl
                "
              />

              <p className="text-gray-500 mt-2">
                No inbound entries found
              </p>

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
                         ADD INBOUND MODAL
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
                  Add Inbound
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add incoming stock shipment
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
              onSubmit={handleAddInbound}
              className="space-y-4"
            >

              {/* SUPPLIER */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Supplier
                </label>

                <input
                  type="text"
                  placeholder="Enter supplier name"
                  value={newInbound.supplier}
                  onChange={(e) =>
                    setNewInbound({
                      ...newInbound,
                      supplier: e.target.value,
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
                  value={newInbound.product}
                  onChange={(e) =>
                    setNewInbound({
                      ...newInbound,
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
                  value={newInbound.quantity}
                  onChange={(e) =>
                    setNewInbound({
                      ...newInbound,
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


              {/* WAREHOUSE */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Warehouse
                </label>

                <input
                  type="text"
                  placeholder="Enter warehouse name"
                  value={newInbound.warehouse}
                  onChange={(e) =>
                    setNewInbound({
                      ...newInbound,
                      warehouse: e.target.value,
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


              {/* DATE */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Date
                </label>

                <input
                  type="date"
                  value={newInbound.date}
                  onChange={(e) =>
                    setNewInbound({
                      ...newInbound,
                      date: e.target.value,
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
                  value={newInbound.status}
                  onChange={(e) =>
                    setNewInbound({
                      ...newInbound,
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

                  <option value="Received">
                    Received
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
                  Add Inbound
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =====================================================
                         EDIT MODAL
      ===================================================== */}

      {editInbound && (

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
                  Edit Inbound
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update inbound information
                </p>

              </div>

              <button
                onClick={() =>
                  setEditInbound(null)
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
              onSubmit={handleUpdateInbound}
              className="space-y-4"
            >

              {/* SUPPLIER */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Supplier
                </label>

                <input
                  type="text"
                  value={editInbound.supplier}
                  onChange={(e) =>
                    setEditInbound({
                      ...editInbound,
                      supplier: e.target.value,
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
                  value={editInbound.product}
                  onChange={(e) =>
                    setEditInbound({
                      ...editInbound,
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
                  value={editInbound.quantity}
                  onChange={(e) =>
                    setEditInbound({
                      ...editInbound,
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


              {/* WAREHOUSE */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Warehouse
                </label>

                <input
                  type="text"
                  value={editInbound.warehouse}
                  onChange={(e) =>
                    setEditInbound({
                      ...editInbound,
                      warehouse: e.target.value,
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


              {/* DATE */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Date
                </label>

                <input
                  type="date"
                  value={editInbound.date}
                  onChange={(e) =>
                    setEditInbound({
                      ...editInbound,
                      date: e.target.value,
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
                  value={editInbound.status}
                  onChange={(e) =>
                    setEditInbound({
                      ...editInbound,
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

                  <option value="Received">
                    Received
                  </option>

                </select>

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setEditInbound(null)
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
                  Update Inbound
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =====================================================
                           VIEW MODAL
      ===================================================== */}

      {viewInbound && (

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

            <div className="flex justify-between items-center mb-5">

              <div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Inbound Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {viewInbound.id}
                </p>

              </div>

              <button
                onClick={() =>
                  setViewInbound(null)
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


            <div className="space-y-3">

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">
                  Supplier
                </span>

                <span className="font-medium">
                  {viewInbound.supplier}
                </span>
              </div>


              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">
                  Product
                </span>

                <span className="font-medium">
                  {viewInbound.product}
                </span>
              </div>


              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">
                  Quantity
                </span>

                <span className="font-medium">
                  {viewInbound.quantity} units
                </span>
              </div>


              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">
                  Warehouse
                </span>

                <span className="font-medium">
                  {viewInbound.warehouse}
                </span>
              </div>


              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">
                  Date
                </span>

                <span className="font-medium">
                  {viewInbound.date}
                </span>
              </div>


              <div className="flex justify-between">

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
                      viewInbound.status === "Pending"
                        ? "bg-orange-50 text-orange-600"
                        : viewInbound.status === "Processing"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-green-50 text-green-600"
                    }
                  `}
                >
                  {viewInbound.status}
                </span>

              </div>

            </div>


            <div className="flex justify-end mt-6">

              <button
                onClick={() =>
                  setViewInbound(null)
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

export default Inbound;