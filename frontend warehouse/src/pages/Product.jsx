import React, { useState } from "react";

import {
  FaBox,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

// =====================================================
// SESSION STORAGE KEY
// =====================================================

const STORAGE_KEY = "warehouse_products_v2";

// =====================================================
// GET PRODUCTS FROM SESSION STORAGE
// =====================================================

const getProductsFromStorage = () => {
  try {
    const storedProducts = sessionStorage.getItem(STORAGE_KEY);

    if (storedProducts) {
      return JSON.parse(storedProducts);
    }

    // No default products
    return [];
  } catch (error) {
    console.error("SessionStorage error:", error);
    return [];
  }
};

// =====================================================
// PRODUCT COMPONENT
// =====================================================

const Product = () => {
  // =====================================================
  // PRODUCTS
  // =====================================================

  const [products, setProducts] = useState(
    getProductsFromStorage
  );

  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] = useState("");

  // =====================================================
  // CATEGORY
  // =====================================================

  const [category, setCategory] = useState("All");

  // =====================================================
  // ADD MODAL
  // =====================================================

  const [showModal, setShowModal] = useState(false);

  // =====================================================
  // NEW PRODUCT
  // =====================================================

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Electronics",
    stock: "",
    price: "",
  });

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const [editProduct, setEditProduct] = useState(null);

  // =====================================================
  // SAVE PRODUCTS
  // =====================================================

  const saveProducts = (updatedProducts) => {
    setProducts(updatedProducts);

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedProducts)
    );

    // Dashboard ko update karne ke liye event
    window.dispatchEvent(
      new Event("productsUpdated")
    );
  };

  // =====================================================
  // GENERATE PRODUCT ID
  // =====================================================

  const generateProductId = () => {
    if (products.length === 0) {
      return "PRD-001";
    }

    const numbers = products.map((product) => {
      const number = parseInt(
        product.id.replace("PRD-", ""),
        10
      );

      return isNaN(number) ? 0 : number;
    });

    const maxNumber = Math.max(...numbers);

    return `PRD-${String(maxNumber + 1).padStart(
      3,
      "0"
    )}`;
  };

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = products.filter(
    (product) => {
      const searchText = search.toLowerCase();

      const searchMatch =
        product.name
          .toLowerCase()
          .includes(searchText) ||
        product.id
          .toLowerCase()
          .includes(searchText);

      const categoryMatch =
        category === "All" ||
        product.category === category;

      return searchMatch && categoryMatch;
    }
  );

  // =====================================================
  // ADD PRODUCT
  // =====================================================

  const handleAddProduct = (e) => {
    e.preventDefault();

    // Validation
    if (
      !newProduct.name.trim() ||
      newProduct.stock === "" ||
      newProduct.price === ""
    ) {
      alert("Please fill all product details");
      return;
    }

    const stockNumber = Number(newProduct.stock);
    const priceNumber = Number(newProduct.price);

    if (
      isNaN(stockNumber) ||
      isNaN(priceNumber)
    ) {
      alert("Please enter valid numbers");
      return;
    }

    if (stockNumber < 0 || priceNumber < 0) {
      alert(
        "Stock and price cannot be negative"
      );
      return;
    }

    // =================================================
    // STATUS
    // =================================================

    let status = "In Stock";

    if (stockNumber === 0) {
      status = "Out of Stock";
    } else if (stockNumber <= 20) {
      status = "Low Stock";
    }

    // =================================================
    // CREATE PRODUCT
    // =================================================

    const product = {
      id: generateProductId(),
      name: newProduct.name.trim(),
      category: newProduct.category,
      stock: stockNumber,
      price: `₹${priceNumber.toLocaleString(
        "en-IN"
      )}`,
      status: status,
    };

    // =================================================
    // ADD TO PRODUCT LIST
    // =================================================

    const updatedProducts = [
      ...products,
      product,
    ];

    saveProducts(updatedProducts);

    // =================================================
    // RESET FORM
    // =================================================

    setNewProduct({
      name: "",
      category: "Electronics",
      stock: "",
      price: "",
    });

    // Close modal
    setShowModal(false);
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProduct = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedProducts = products.filter(
      (product) => product.id !== id
    );

    saveProducts(updatedProducts);
  };

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const handleEdit = (product) => {
    setEditProduct({
      ...product,

      price: product.price
        .replace("₹", "")
        .replace(/,/g, ""),
    });
  };

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const handleUpdateProduct = (e) => {
    e.preventDefault();

    if (
      !editProduct.name.trim() ||
      editProduct.stock === "" ||
      editProduct.price === ""
    ) {
      alert("Please fill all product details");
      return;
    }

    const stockNumber = Number(
      editProduct.stock
    );

    const priceNumber = Number(
      editProduct.price
    );

    if (
      isNaN(stockNumber) ||
      isNaN(priceNumber)
    ) {
      alert("Please enter valid numbers");
      return;
    }

    if (stockNumber < 0 || priceNumber < 0) {
      alert(
        "Stock and price cannot be negative"
      );
      return;
    }

    // =================================================
    // STATUS
    // =================================================

    let status = "In Stock";

    if (stockNumber === 0) {
      status = "Out of Stock";
    } else if (stockNumber <= 20) {
      status = "Low Stock";
    }

    // =================================================
    // UPDATE PRODUCT
    // =================================================

    const updatedProducts = products.map(
      (product) => {
        if (
          product.id === editProduct.id
        ) {
          return {
            ...product,

            name: editProduct.name.trim(),

            category:
              editProduct.category,

            stock: stockNumber,

            price: `₹${priceNumber.toLocaleString(
              "en-IN"
            )}`,

            status: status,
          };
        }

        return product;
      }
    );

    saveProducts(updatedProducts);

    // Close modal
    setEditProduct(null);
  };

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
            Products
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage your warehouse products and inventory
          </p>
        </div>

        {/* ADD PRODUCT BUTTON */}

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
          Add Product
        </button>

      </div>

      {/* =====================================================
                         SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        {/* TOTAL */}

        <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between">

          <div>
            <p className="text-gray-500 text-sm">
              Total Products
            </p>

            <h2 className="text-2xl font-bold mt-2">
              {products.length}
            </h2>
          </div>

          <div
            className="
              bg-blue-50
              text-blue-600
              w-11
              h-11
              rounded-lg
              flex
              items-center
              justify-center
            "
          >
            <FaBox />
          </div>

        </div>

        {/* IN STOCK */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            In Stock
          </p>

          <h2 className="text-2xl font-bold mt-2 text-green-600">
            {
              products.filter(
                (item) =>
                  item.status === "In Stock"
              ).length
            }
          </h2>

        </div>

        {/* LOW STOCK */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Low Stock
          </p>

          <h2 className="text-2xl font-bold mt-2 text-orange-500">
            {
              products.filter(
                (item) =>
                  item.status === "Low Stock"
              ).length
            }
          </h2>

        </div>

        {/* OUT OF STOCK */}

        <div className="bg-white rounded-xl shadow-sm p-4">

          <p className="text-gray-500 text-sm">
            Out of Stock
          </p>

          <h2 className="text-2xl font-bold mt-2 text-red-500">
            {
              products.filter(
                (item) =>
                  item.status ===
                  "Out of Stock"
              ).length
            }
          </h2>

        </div>

      </div>

      {/* =====================================================
                         PRODUCT TABLE
      ===================================================== */}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        {/* TABLE HEADER */}

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
            <h2 className="text-lg font-semibold">
              Product List
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              All warehouse products
            </p>
          </div>

          {/* FILTERS */}

          <div className="flex gap-3">

            {/* SEARCH */}

            <div
              className="
                flex
                items-center
                bg-gray-100
                rounded-lg
                px-3
                py-2
                w-64
              "
            >

              <FaSearch className="text-gray-400" />

              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                  bg-transparent
                  outline-none
                  ml-2
                  w-full
                  text-sm
                "
              />

            </div>

            {/* CATEGORY */}

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="
                border
                border-gray-300
                rounded-lg
                px-3
                py-2
                text-sm
                outline-none
                bg-white
              "
            >

              <option value="All">
                All Categories
              </option>

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

        </div>

        {/* =====================================================
                              TABLE
        ===================================================== */}

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-5 py-3 font-medium text-gray-500">
                  Product ID
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Product
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Category
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Stock
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Price
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

              {filteredProducts.map(
                (product) => (

                  <tr
                    key={product.id}
                    className="
                      border-b
                      border-gray-100
                      hover:bg-gray-50
                    "
                  >

                    {/* ID */}

                    <td
                      className="
                        px-5
                        py-4
                        text-blue-600
                        font-medium
                      "
                    >
                      {product.id}
                    </td>

                    {/* PRODUCT */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            w-9
                            h-9
                            bg-blue-50
                            text-blue-600
                            rounded-lg
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <FaBox />
                        </div>

                        <span className="font-medium text-gray-700">
                          {product.name}
                        </span>

                      </div>

                    </td>

                    {/* CATEGORY */}

                    <td className="px-4 py-4 text-gray-600">
                      {product.category}
                    </td>

                    {/* STOCK */}

                    <td className="px-4 py-4 text-gray-600">
                      {product.stock} units
                    </td>

                    {/* PRICE */}

                    <td className="px-4 py-4 font-medium text-gray-700">
                      {product.price}
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
                            product.status ===
                            "In Stock"
                              ? "bg-green-50 text-green-600"
                              : product.status ===
                                "Low Stock"
                              ? "bg-yellow-50 text-yellow-600"
                              : "bg-red-50 text-red-600"
                          }
                        `}
                      >
                        {product.status}
                      </span>

                    </td>

                    {/* ACTION */}

                    <td className="px-4 py-4">

                      <div className="flex justify-center gap-3">

                        {/* EDIT */}

                        <button
                          onClick={() =>
                            handleEdit(product)
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
                            deleteProduct(
                              product.id
                            )
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

          {/* EMPTY PRODUCT */}

          {filteredProducts.length === 0 && (

            <div className="text-center py-12">

              <FaBox
                className="
                  mx-auto
                  text-gray-300
                  text-4xl
                "
              />

              <p className="text-gray-500 mt-3">
                No products found
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Click "Add Product" to add a new product.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* =====================================================
                       ADD PRODUCT MODAL
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
                  Add Product
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add a new warehouse product
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
              onSubmit={handleAddProduct}
              className="space-y-4"
            >

              {/* NAME */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Product Name
                </label>

                <input
                  type="text"
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
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

              {/* CATEGORY */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Category
                </label>

                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
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

              {/* STOCK */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="Enter stock"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: e.target.value,
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

              {/* PRICE */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="Enter price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: e.target.value,
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
                  Add Product
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =====================================================
                       EDIT PRODUCT MODAL
      ===================================================== */}

      {editProduct && (

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
                  Edit Product
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update product information
                </p>

              </div>

              <button
                onClick={() =>
                  setEditProduct(null)
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
              onSubmit={handleUpdateProduct}
              className="space-y-4"
            >

              {/* NAME */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Product Name
                </label>

                <input
                  type="text"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
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

              {/* CATEGORY */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Category
                </label>

                <select
                  value={editProduct.category}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
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

              {/* STOCK */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  value={editProduct.stock}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      stock: e.target.value,
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

              {/* PRICE */}

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      price: e.target.value,
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

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setEditProduct(null)
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
                  Update Product
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Product;