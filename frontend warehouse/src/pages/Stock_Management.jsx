import React, { useState } from "react";

import {
  FaBox,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

// =====================================================
// SESSION STORAGE KEY
// =====================================================

const STORAGE_KEY = "warehouse_stock";

// =====================================================
// GET STOCK FROM SESSION STORAGE
// =====================================================

const getStockFromStorage = () => {
  try {
    const storedStock = sessionStorage.getItem(STORAGE_KEY);

    if (storedStock) {
      return JSON.parse(storedStock);
    }

    return [];
  } catch (error) {
    console.error("SessionStorage error:", error);
    return [];
  }
};

// =====================================================
// STOCK MANAGEMENT COMPONENT
// =====================================================

const Stock_Management = () => {

  // =====================================================
  // STOCK DATA
  // =====================================================

  const [stock, setStock] = useState(
    getStockFromStorage
  );

  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] = useState("");

  // =====================================================
  // ADD STOCK MODAL
  // =====================================================

  const [showModal, setShowModal] = useState(false);

  // =====================================================
  // NEW STOCK
  // =====================================================

  const [newStock, setNewStock] = useState({
    product: "",
    category: "Electronics",
    warehouse: "",
    quantity: "",
    minimum: "",
  });

  // =====================================================
  // EDIT STOCK
  // =====================================================

  const [editStock, setEditStock] = useState(null);

  // =====================================================
  // SAVE STOCK
  // =====================================================

  const saveStock = (updatedStock) => {

    // Update React state
    setStock(updatedStock);

    // Save to sessionStorage
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedStock)
    );

    // Send event if other pages need stock update
    window.dispatchEvent(
      new Event("stockUpdated")
    );
  };

  // =====================================================
  // GENERATE STOCK ID
  // =====================================================

  const generateStockId = () => {

    if (stock.length === 0) {
      return "ST-001";
    }

    const numbers = stock.map((item) => {
      const number = parseInt(
        item.id.replace("ST-", ""),
        10
      );

      return isNaN(number) ? 0 : number;
    });

    const nextNumber = Math.max(...numbers) + 1;

    return `ST-${String(nextNumber).padStart(3, "0")}`;
  };

  // =====================================================
  // GET STATUS
  // =====================================================

  const getStatus = (quantity, minimum) => {

    const qty = Number(quantity);
    const min = Number(minimum);

    if (qty === 0) {
      return "Out of Stock";
    }

    if (qty <= min) {
      return "Low Stock";
    }

    return "In Stock";
  };

  // =====================================================
  // ADD STOCK
  // =====================================================

  const handleAddStock = (e) => {

    e.preventDefault();

    // Validation
    if (
      !newStock.product.trim() ||
      !newStock.warehouse.trim() ||
      newStock.quantity === "" ||
      newStock.minimum === ""
    ) {
      alert("Please fill all stock details");
      return;
    }

    const quantity = Number(
      newStock.quantity
    );

    const minimum = Number(
      newStock.minimum
    );

    // Negative validation
    if (quantity < 0 || minimum < 0) {
      alert(
        "Quantity and minimum stock cannot be negative"
      );
      return;
    }

    // Status
    const status = getStatus(
      quantity,
      minimum
    );

    // Create stock
    const stockItem = {
      id: generateStockId(),

      product: newStock.product.trim(),

      category: newStock.category,

      warehouse: newStock.warehouse.trim(),

      quantity: quantity,

      minimum: minimum,

      status: status,
    };

    // Add stock
    const updatedStock = [
      ...stock,
      stockItem,
    ];

    // Save
    saveStock(updatedStock);

    // Reset form
    setNewStock({
      product: "",
      category: "Electronics",
      warehouse: "",
      quantity: "",
      minimum: "",
    });

    // Close modal
    setShowModal(false);
  };

  // =====================================================
  // DELETE STOCK
  // =====================================================

  const deleteStock = (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this stock?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedStock = stock.filter(
      (item) => item.id !== id
    );

    saveStock(updatedStock);
  };

  // =====================================================
  // EDIT STOCK
  // =====================================================

  const handleEdit = (item) => {

    setEditStock({
      ...item,
    });
  };

  // =====================================================
  // UPDATE STOCK
  // =====================================================

  const handleUpdateStock = (e) => {

    e.preventDefault();

    if (
      !editStock.product.trim() ||
      !editStock.warehouse.trim() ||
      editStock.quantity === "" ||
      editStock.minimum === ""
    ) {
      alert("Please fill all stock details");
      return;
    }

    const quantity = Number(
      editStock.quantity
    );

    const minimum = Number(
      editStock.minimum
    );

    if (quantity < 0 || minimum < 0) {
      alert(
        "Quantity and minimum stock cannot be negative"
      );
      return;
    }

    // Calculate status again
    const status = getStatus(
      quantity,
      minimum
    );

    // Update stock
    const updatedStock = stock.map(
      (item) => {

        if (item.id === editStock.id) {

          return {
            ...item,

            product:
              editStock.product.trim(),

            category:
              editStock.category,

            warehouse:
              editStock.warehouse.trim(),

            quantity:
              quantity,

            minimum:
              minimum,

            status:
              status,
          };
        }

        return item;
      }
    );

    // Save
    saveStock(updatedStock);

    // Close modal
    setEditStock(null);
  };

  // =====================================================
  // SEARCH FILTER
  // =====================================================

  const filteredStock = stock.filter(
    (item) => {

      const searchText =
        search.toLowerCase();

      return (
        item.product
          .toLowerCase()
          .includes(searchText) ||

        item.id
          .toLowerCase()
          .includes(searchText) ||

        item.category
          .toLowerCase()
          .includes(searchText) ||

        item.warehouse
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  // =====================================================
  // SUMMARY DATA
  // =====================================================

  const totalStock = stock.reduce(
    (total, item) =>
      total + Number(item.quantity),
    0
  );

  const inStockCount = stock.filter(
    (item) =>
      item.status === "In Stock"
  ).length;

  const lowStockCount = stock.filter(
    (item) =>
      item.status === "Low Stock"
  ).length;

  const outOfStockCount = stock.filter(
    (item) =>
      item.status === "Out of Stock"
  ).length;

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
            Stock Management
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage and monitor all your warehouse stock
          </p>

        </div>

        {/* ADD STOCK BUTTON */}

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

          Add Stock

        </button>

      </div>

      {/* =====================================================
                         SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        {/* TOTAL STOCK */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500 text-sm">
                Total Stock
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {totalStock.toLocaleString()}
              </h2>

              <p className="text-gray-400 text-xs mt-1">
                Units
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

              <FaBox />

            </div>

          </div>

        </div>

        {/* IN STOCK */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            In Stock
          </p>

          <h2 className="text-2xl font-bold mt-2 text-green-600">
            {inStockCount}
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Products
          </p>

        </div>

        {/* LOW STOCK */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Low Stock
          </p>

          <h2 className="text-2xl font-bold mt-2 text-orange-500">
            {lowStockCount}
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Products
          </p>

        </div>

        {/* OUT OF STOCK */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Out of Stock
          </p>

          <h2 className="text-2xl font-bold mt-2 text-red-500">
            {outOfStockCount}
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Products
          </p>

        </div>

      </div>

      {/* =====================================================
                           STOCK LIST
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
              Stock List
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              All available warehouse stock
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
              placeholder="Search product..."
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
                  Stock ID
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Product
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Category
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Warehouse
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Quantity
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Minimum
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

              {filteredStock.map(
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

                    {/* PRODUCT */}

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

                          <FaBox />

                        </div>

                        <span className="font-medium text-gray-700">
                          {item.product}
                        </span>

                      </div>

                    </td>

                    {/* CATEGORY */}

                    <td className="px-4 py-4 text-gray-600">
                      {item.category}
                    </td>

                    {/* WAREHOUSE */}

                    <td className="px-4 py-4 text-gray-600">
                      {item.warehouse}
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

                    {/* MINIMUM */}

                    <td className="px-4 py-4 text-gray-600">
                      {item.minimum} units
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
                            item.status === "In Stock"
                              ? "bg-green-50 text-green-600"
                              : item.status === "Low Stock"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-red-50 text-red-600"
                          }
                        `}
                      >
                        {item.status}
                      </span>

                    </td>

                    {/* ACTION */}

                    <td className="px-4 py-4">

                      <div className="flex justify-center gap-4">

                        {/* EDIT */}

                        <button
                          onClick={() =>
                            handleEdit(item)
                          }
                          className="
                            text-blue-500
                            hover:text-blue-700
                          "
                          title="Edit Stock"
                        >

                          <FaEdit />

                        </button>

                        {/* DELETE */}

                        <button
                          onClick={() =>
                            deleteStock(item.id)
                          }
                          className="
                            text-red-500
                            hover:text-red-700
                          "
                          title="Delete Stock"
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

          {/* NO STOCK */}

          {filteredStock.length === 0 && (

            <div className="text-center py-10">

              <FaBox
                className="
                  mx-auto
                  text-gray-300
                  text-3xl
                "
              />

              <p className="text-gray-500 mt-2">
                No stock found
              </p>

            </div>

          )}

        </div>

      </div>

      {/* =====================================================
                         ADD STOCK MODAL
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
                  Add Stock
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add new warehouse stock
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
              onSubmit={handleAddStock}
              className="space-y-4"
            >

              {/* PRODUCT */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-600
                  mb-1
                ">
                  Product Name
                </label>

                <input
                  type="text"
                  placeholder="Enter product name"
                  value={newStock.product}
                  onChange={(e) =>
                    setNewStock({
                      ...newStock,
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

              {/* CATEGORY */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-600
                  mb-1
                ">
                  Category
                </label>

                <select
                  value={newStock.category}
                  onChange={(e) =>
                    setNewStock({
                      ...newStock,
                      category: e.target.value,
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

                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Accessories">
                    Accessories
                  </option>

                  <option value="Computer Parts">
                    Computer Parts
                  </option>

                </select>

              </div>

              {/* WAREHOUSE */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-600
                  mb-1
                ">
                  Warehouse
                </label>

                <input
                  type="text"
                  placeholder="Enter warehouse name"
                  value={newStock.warehouse}
                  onChange={(e) =>
                    setNewStock({
                      ...newStock,
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

              {/* QUANTITY */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-600
                  mb-1
                ">
                  Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="Enter quantity"
                  value={newStock.quantity}
                  onChange={(e) =>
                    setNewStock({
                      ...newStock,
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

              {/* MINIMUM */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-600
                  mb-1
                ">
                  Minimum Stock
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="Enter minimum stock"
                  value={newStock.minimum}
                  onChange={(e) =>
                    setNewStock({
                      ...newStock,
                      minimum: e.target.value,
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

              {/* BUTTONS */}

              <div className="
                flex
                justify-end
                gap-3
                pt-2
              ">

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
                  Add Stock
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =====================================================
                         EDIT STOCK MODAL
      ===================================================== */}

      {editStock && (

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

                <h2 className="
                  text-xl
                  font-semibold
                  text-gray-800
                ">
                  Edit Stock
                </h2>

                <p className="
                  text-sm
                  text-gray-500
                  mt-1
                ">
                  Update stock information
                </p>

              </div>

              <button
                onClick={() =>
                  setEditStock(null)
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
              onSubmit={handleUpdateStock}
              className="space-y-4"
            >

              {/* PRODUCT */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-600
                  mb-1
                ">
                  Product Name
                </label>

                <input
                  type="text"
                  value={editStock.product}
                  onChange={(e) =>
                    setEditStock({
                      ...editStock,
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

              {/* CATEGORY */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-600
                  mb-1
                ">
                  Category
                </label>

                <select
                  value={editStock.category}
                  onChange={(e) =>
                    setEditStock({
                      ...editStock,
                      category: e.target.value,
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

                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Accessories">
                    Accessories
                  </option>

                  <option value="Computer Parts">
                    Computer Parts
                  </option>

                </select>

              </div>

              {/* WAREHOUSE */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-600
                  mb-1
                ">
                  Warehouse
                </label>

                <input
                  type="text"
                  value={editStock.warehouse}
                  onChange={(e) =>
                    setEditStock({
                      ...editStock,
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

              {/* QUANTITY */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-600
                  mb-1
                ">
                  Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  value={editStock.quantity}
                  onChange={(e) =>
                    setEditStock({
                      ...editStock,
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

              {/* MINIMUM */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-600
                  mb-1
                ">
                  Minimum Stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={editStock.minimum}
                  onChange={(e) =>
                    setEditStock({
                      ...editStock,
                      minimum: e.target.value,
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

              {/* BUTTONS */}

              <div className="
                flex
                justify-end
                gap-3
                pt-2
              ">

                <button
                  type="button"
                  onClick={() =>
                    setEditStock(null)
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
                  Update Stock
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Stock_Management;