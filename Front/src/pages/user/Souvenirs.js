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

// Configuration
const sortOptions = [
  { label: "From high to low price", value: "price-desc" },
  { label: "From low to high price", value: "price-asc" },
  { label: "Newest first", value: "date-desc" },
  { label: "Oldest first", value: "date-asc" },
];

// ProductCard component (same as yours, omitted here for brevity, use your existing one)
const ProductCard = React.memo(({ souvenir, isLiked, toggleLike, handleAddToCart, handleDecreaseQuantity, quantity = 0, layoutMode }) => {
  return (
    <div
      className={`bg-white p-4 relative rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-[#115d5a] flex flex-col ${
        layoutMode === "list" ? "sm:flex-row sm:items-center sm:gap-4" : ""
      }`}
    >
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
      <img
        src={souvenir.image || "https://via.placeholder.com/150"}
        alt={souvenir.name}
        className={`object-cover rounded-lg ${
          layoutMode === "list"
            ? "w-full sm:w-40 sm:h-40 flex-shrink-0"
            : "w-full h-48"
        }`}
      />
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
});

// TrendingCard component (also same as yours, omitted here for brevity)

function Souvenirs() {
  const [souvenirs, setSouvenirs] = useState([]);
  const [likedCards, setLikedCards] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [layoutMode, setLayoutMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQty = useCartStore((state) => state.updateCartQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const cartItemMap = useMemo(() => {
    return cartItems.reduce((map, item) => {
      map[item._id] = item.quantity;
      return map;
    }, {});
  }, [cartItems]);

  useEffect(() => {
    async function fetchSouvenirs() {
      try {
        const data = await getAllProducts();
        setSouvenirs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch souvenirs:", error);
        setSouvenirs([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSouvenirs();
  }, []);

  const toggleLike = useCallback((id) => {
    setLikedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const handleAddToCart = useCallback(
    (souvenir) => {
      addToCart(souvenir);
    },
    [addToCart]
  );

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

  const filteredSouvenirs = useMemo(() => {
    if (!searchText.trim()) return souvenirs;
    const lower = searchText.toLowerCase();
    return souvenirs.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        (s.description && s.description.toLowerCase().includes(lower))
    );
  }, [souvenirs, searchText]);

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

  useEffect(() => {
    if (!scrollRef.current) return;

    const scrollElement = scrollRef.current;

    if (isPaused) {
      clearInterval(scrollIntervalRef.current);
      return;
    }

    scrollIntervalRef.current = setInterval(() => {
      if (scrollElement.scrollLeft + scrollElement.clientWidth >= scrollElement.scrollWidth) {
        scrollElement.scrollLeft = 0;
      } else {
        scrollElement.scrollLeft += 1;
      }
    }, 50);

    return () => clearInterval(scrollIntervalRef.current);
  }, [isPaused]);

  return (
    <>
      <NavBar />
      <section
        className="bg-cover bg-center py-10 relative flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${souvenirsBg})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <h1 className="relative text-5xl text-white font-bold mb-6">
          Souvenirs
        </h1>
        <div
          ref={scrollRef}
          className="relative w-full max-w-7xl overflow-x-auto whitespace-nowrap"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-label="Trending souvenirs carousel"
        >
          {souvenirs.length === 0 && !isLoading && (
            <p className="text-white p-4">No souvenirs found.</p>
          )}
          <div className="flex space-x-6 py-4 px-2">
            {souvenirs.slice(0, 6).map((souvenir) => (
              <TrendingCard
                key={souvenir._id}
                souvenir={souvenir}
                isLiked={likedCards[souvenir._id]}
                toggleLike={toggleLike}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search souvenirs..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#115d5a]"
              aria-label="Search souvenirs"
            />
            <FaSearch className="text-gray-400" />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#115d5a]"
              aria-label="Sort souvenirs"
            >
              <option value="">Sort By</option>
              {sortOptions.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button
              aria-label="Switch to grid view"
              className={`p-2 rounded hover:bg-[#115d5a]/20 transition-colors ${
                layoutMode === "grid" ? "bg-[#115d5a]/30" : ""
              }`}
              onClick={() => setLayoutMode("grid")}
            >
              <BsFillGrid3X3GapFill />
            </button>
            <button
              aria-label="Switch to list view"
              className={`p-2 rounded hover:bg-[#115d5a]/20 transition-colors ${
                layoutMode === "list" ? "bg-[#115d5a]/30" : ""
              }`}
              onClick={() => setLayoutMode("list")}
            >
              <FaThList />
            </button>
          </div>
        </div>
        {isLoading ? (
          <p className="text-center text-gray-700">Loading souvenirs...</p>
        ) : sortedSouvenirs.length === 0 ? (
          <p className="text-center text-gray-700">No souvenirs found.</p>
        ) : (
          <div
            className={`grid gap-6 ${
              layoutMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {sortedSouvenirs.map((souvenir) => (
              <ProductCard
                key={souvenir._id}
                souvenir={souvenir}
                isLiked={likedCards[souvenir._id]}
                toggleLike={toggleLike}
                handleAddToCart={handleAddToCart}
                handleDecreaseQuantity={handleDecreaseQuantity}
                quantity={cartItemMap[souvenir._id] || 0}
                layoutMode={layoutMode}
              />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

export default Souvenirs;
