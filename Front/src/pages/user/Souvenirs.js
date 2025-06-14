import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaThList,
  FaSearch,
  FaSortAmountDownAlt,
} from "react-icons/fa";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { useCartStore } from "../../api/stores/cart.store";
import NavBar from "../../layout/Navbar";
import Footer from "../../layout/Footer";
import { getAllProducts } from "../../api/services/cartService";
import souvenirsBg from "../../assets/images/souvenirs.jpg";
import des from "../../assets/images/design.png";

// Configuration
const sortOptions = [
  { label: "From high to low price", value: "price-desc" },
  { label: "From low to high price", value: "price-asc" },
  { label: "Newest first", value: "date-desc" },
  { label: "Oldest first", value: "date-asc" },
];

// Optimized Product Card with React.memo
const ProductCard = React.memo(
  ({
    souvenir,
    isLiked,
    toggleLike,
    handleAddToCart,
    handleDecreaseQuantity,
    quantity = 0,
    layoutMode,
  }) => {
    return (
      <div
        className={`bg-white p-4 relative rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-[#115d5a] flex flex-col ${
          layoutMode === "list" ? "sm:flex-row sm:items-center sm:gap-4" : ""
        }`}
      >
        {/* Like Button */}
        <div
          className="absolute top-3 right-3 cursor-pointer z-10"
          onClick={() => toggleLike(souvenir._id)}
        >
          <FaHeart
            size={22}
            className={`transition-colors duration-300 ${
              isLiked ? "text-[#115d5a]" : "text-gray-400"
            } hover:text-[#0d4442]`}
          />
        </div>

        {/* Image */}
        <img
          src={souvenir.image || "placeholder.jpg"}
          alt={souvenir.name}
          className={`object-cover rounded-lg ${
            layoutMode === "list"
              ? "w-full sm:w-40 sm:h-40 flex-shrink-0"
              : "w-full h-48"
          }`}
        />

        {/* Content Area */}
        <div
          className={`flex flex-col flex-grow ${
            layoutMode === "list" ? "w-full sm:w-auto pt-4 sm:pt-0" : ""
          }`}
        >
          <div className="flex-grow">
            <h3 className="text-[#115d5a] text-lg font-semibold flex justify-between pr-8">
              <span>{souvenir.name}</span>
              <span>${Number(souvenir.price || 0).toFixed(2)}</span>
            </h3>
            <p className="text-gray-700 text-sm mt-2">
              {souvenir.description && souvenir.description.length > 60
                ? `${souvenir.description.slice(0, 60)}...`
                : souvenir.description || "No details available."}
            </p>
          </div>

          {/* Button Section */}
          <div className="mt-auto pt-4">
            {quantity > 0 ? (
              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() =>
                    handleDecreaseQuantity(souvenir._id, quantity)
                  }
                  className="bg-[#115d5a]/10 text-[#115d5a] rounded-full w-8 h-8 flex justify-center items-center hover:bg-[#115d5a] hover:text-white transition-colors"
                  aria-label={`Decrease quantity of ${souvenir.name}`}
                >
                  <FaMinus size={12} />
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => handleAddToCart(souvenir)}
                  className="bg-[#115d5a]/10 text-[#115d5a] rounded-full w-8 h-8 flex justify-center items-center hover:bg-[#115d5a] hover:text-white transition-colors"
                  aria-label={`Increase quantity of ${souvenir.name}`}
                >
                  <FaPlus size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAddToCart(souvenir)}
                className="w-full flex items-center justify-center space-x-2 rounded bg-[#115d5a] px-4 py-2 text-white transition-colors hover:bg-[#0d4442]"
                aria-label={`Add ${souvenir.name} to cart`}
              >
                <FaShoppingCart size={16} />
                <span className="text-sm">Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

// Optimized Trending Card
const TrendingCard = React.memo(
  ({
    souvenir,
    isLiked,
    toggleLike,
    handleAddToCart,
    handleDecreaseQuantity,
    quantity = 0,
  }) => {
    return (
      <div className="w-80 flex-shrink-0 rounded-lg bg-white p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-[#115d5a] relative flex flex-col">
        {/* Like Button */}
        <div
          className="absolute top-4 right-4 cursor-pointer z-10"
          onClick={() => toggleLike(souvenir._id)}
        >
          <FaHeart
            size={24}
            className={`transition-colors duration-300 ${
              isLiked ? "text-[#115d5a]" : "text-gray-400"
            } hover:text-[#0d4442]`}
          />
        </div>

        {/* Image */}
        <img
          src={souvenir.image || "placeholder.jpg"}
          alt={souvenir.name}
          className="mb-4 h-48 w-full rounded-t-lg object-cover"
        />

        {/* Details */}
        <div className="flex-grow">
          <h3 className="mb-2 flex justify-between text-xl font-semibold text-[#115d5a]">
            <span>{souvenir.name}</span>
            <span>${Number(souvenir.price || 0).toFixed(2)}</span>
          </h3>
          <p className="mb-4 text-gray-600 text-sm h-10 overflow-hidden">
            {souvenir.description || "No details available."}
          </p>
        </div>

        {/* Button Section */}
        <div className="mt-auto pt-4">
          {quantity > 0 ? (
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => handleDecreaseQuantity(souvenir._id, quantity)}
                className="bg-[#115d5a] text-white rounded-full w-8 h-8 flex justify-center items-center hover:bg-[#E7C873] transition-colors"
                aria-label={`Decrease quantity of ${souvenir.name}`}
              >
                <FaMinus size={12} />
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                onClick={() => handleAddToCart(souvenir)}
                className="bg-[#115d5a] text-white rounded-full w-8 h-8 flex justify-center items-center hover:bg-[#E7C873] transition-colors"
                aria-label={`Increase quantity of ${souvenir.name}`}
              >
                <FaPlus size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleAddToCart(souvenir)}
              className="w-full flex items-center justify-center space-x-2 rounded bg-[#115d5a] px-4 py-2 text-white transition-colors hover:bg-[#0d4442]"
              aria-label={`Add ${souvenir.name} to cart`}
            >
              <FaShoppingCart size={16} />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    );
  }
);

function Souvenirs() {
  // State
  const [souvenirs, setSouvenirs] = useState([]);
  const [likedCards, setLikedCards] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [layoutMode, setLayoutMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Zustand Cart Store
  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQty = useCartStore((state) => state.updateCartQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  // Optimized cart item lookup
  const cartItemMap = useMemo(() => {
    return cartItems.reduce((map, item) => {
      map[item._id] = item.quantity;
      return map;
    }, {});
  }, [cartItems]);

  // Fetch Souvenirs
  useEffect(() => {
    async function fetchSouvenirs() {
      try {
        const data = await getAllProducts();
        setSouvenirs(data || []);
      } catch (error) {
        console.error("Failed to fetch souvenirs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSouvenirs();
  }, []);

  // Handle Like Toggle
  const toggleLike = useCallback((id) => {
    setLikedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  // Add to Cart
  const handleAddToCart = useCallback(
    (souvenir) => {
      addToCart(souvenir);
    },
    [addToCart]
  );

  // Decrease quantity or remove
  const handleDecreaseQuantity = useCallback(
    (id, quantity) => {
      if (quantity <= 1) {
        removeFromCart(id);
      } else {
        updateQty(id, quantity - 1);
      }
    },
    [removeFromCart, updateQty]
  );

  // Search & filter souvenirs
  const filteredSouvenirs = useMemo(() => {
    if (!searchText.trim()) return souvenirs;
    const lower = searchText.toLowerCase();
    return souvenirs.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        (s.description && s.description.toLowerCase().includes(lower))
    );
  }, [souvenirs, searchText]);

  // Sort souvenirs based on sortOption
  const sortedSouvenirs = useMemo(() => {
    const items = [...filteredSouvenirs];
    switch (sortOption) {
      case "price-desc":
        return items.sort((a, b) => b.price - a.price);
      case "price-asc":
        return items.sort((a, b) => a.price - b.price);
      case "date-desc":
        return items.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "date-asc":
        return items.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      default:
        return items;
    }
  }, [filteredSouvenirs, sortOption]);

  // Auto scroll for trending section
  useEffect(() => {
    if (!scrollRef.current) return;

    const scrollElement = scrollRef.current;

    if (isPaused) {
      clearInterval(scrollIntervalRef.current);
      return;
    }

    scrollIntervalRef.current = setInterval(() => {
      if (!scrollElement) return;

      if (
        scrollElement.scrollLeft + scrollElement.clientWidth >=
        scrollElement.scrollWidth
      ) {
        scrollElement.scrollLeft = 0;
      } else {
        scrollElement.scrollLeft += 1;
      }
    }, 20);

    return () => clearInterval(scrollIntervalRef.current);
  }, [isPaused]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#115d5a] text-xl font-semibold">
        Loading souvenirs...
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-[#fefae0] via-[#e3e3c5] to-[#c5c9a6] min-h-screen">
      <NavBar />

      {/* Hero Section */}
      <section
        className="relative h-96 flex items-center justify-center text-center text-white font-bold text-4xl md:text-6xl select-none"
        style={{
          backgroundImage: `url(${souvenirsBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1 className="backdrop-brightness-50 p-6 rounded-lg max-w-4xl mx-auto shadow-lg">
          Discover Unique Syrian Souvenirs
        </h1>
      </section>

      {/* Trending Section */}
      <section className="mt-16 px-6 max-w-7xl mx-auto">
        <h2 className="mb-8 text-3xl font-extrabold text-[#115d5a] select-none">
          Trending Souvenirs
        </h2>
        <div
          className="flex overflow-x-auto space-x-6 scrollbar-hide py-2 cursor-pointer"
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {souvenirs.slice(0, 6).map((item) => (
            <TrendingCard
              key={item._id}
              souvenir={item}
              isLiked={!!likedCards[item._id]}
              toggleLike={toggleLike}
              handleAddToCart={handleAddToCart}
              handleDecreaseQuantity={handleDecreaseQuantity}
              quantity={cartItemMap[item._id] || 0}
            />
          ))}
        </div>
      </section>

      {/* Control Bar */}
      <section className="mt-16 max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Layout Switch */}
        <div className="flex items-center space-x-4">
          <button
            className={`p-2 rounded-lg ${
              layoutMode === "grid" ? "bg-gray-200" : ""
            }`}
            onClick={() => setLayoutMode("grid")}
            aria-label="Grid View"
          >
            <BsFillGrid3X3GapFill
              size={28}
              className={`${
                layoutMode === "grid" ? "text-[#E7C873]" : "text-[#115d5a]"
              } hover:text-[#17807c]`}
            />
          </button>
          <button
            className={`p-2 rounded-lg ${
              layoutMode === "list" ? "bg-gray-200" : ""
            }`}
            onClick={() => setLayoutMode("list")}
            aria-label="List View"
          >
            <FaThList
              size={28}
              className={`${
                layoutMode === "list" ? "text-[#E7C873]" : "text-[#115d5a]"
              } hover:text-[#17807c]`}
            />
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1 bg-white shadow-sm flex-grow max-w-md">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search souvenirs..."
            className="outline-none w-full bg-transparent"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            aria-label="Search souvenirs"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 px-4">
          <FaSortAmountDownAlt className="text-[#115d5a]" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white border border-gray-300 rounded px-2 py-1 shadow-sm focus:outline-none"
            aria-label="Sort souvenirs"
          >
            <option value="">Sort by</option>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Product Grid/List */}
      <section className="max-w-7xl mx-auto px-6 mt-10 mb-20">
        <div
          className={`grid gap-6 ${
            layoutMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col space-y-6"
          }`}
        >
          {sortedSouvenirs.length > 0 ? (
            sortedSouvenirs.map((souvenir) => (
              <ProductCard
                key={souvenir._id}
                souvenir={souvenir}
                isLiked={!!likedCards[souvenir._id]}
                toggleLike={toggleLike}
                handleAddToCart={handleAddToCart}
                handleDecreaseQuantity={handleDecreaseQuantity}
                quantity={cartItemMap[souvenir._id] || 0}
                layoutMode={layoutMode}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-xl">
              No souvenirs found.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Souvenirs;
