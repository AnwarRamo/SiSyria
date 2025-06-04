import React, { useState, useEffect, useRef } from "react";
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

// Product Card Component (Reusable for Trending and Main Display)
const ProductCard = ({ souvenir, likedCards, toggleLike, handleAddToCart, handleDecreaseQuantity, updateQty, cartItems, layoutMode }) => {
  const inCart = cartItems.find((i) => i.product._id === souvenir._id);
  const qty = inCart?.quantity || 0;

  return (
    <div
      className={`bg-white p-4 relative rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-[#115d5a] flex flex-col ${
        layoutMode === "list" ? "sm:flex-row sm:items-center sm:gap-4" : ""
      }`}
    >
      {/* Like Button */}
      <div className="absolute top-3 right-3 cursor-pointer z-10" onClick={() => toggleLike(souvenir._id)}>
        <FaHeart
          size={22}
          className={`transition-colors duration-300 ${likedCards[souvenir._id] ? "text-[#115d5a]" : "text-gray-400"} hover:text-[#0d4442]`}
        />
      </div>

      {/* Image */}
      <img
        src={souvenir.image || "placeholder.jpg"}
        alt={souvenir.name}
        className={`object-cover rounded-lg ${layoutMode === "list" ? "w-full sm:w-40 sm:h-40 flex-shrink-0" : "w-full h-48"}`}
      />

      {/* Content Area */}
      <div className={`flex flex-col flex-grow ${layoutMode === "list" ? "w-full sm:w-auto pt-4 sm:pt-0" : ""}`}>
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
          {inCart ? (
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => handleDecreaseQuantity(souvenir._id, qty)}
                className="bg-[#115d5a]/10 text-[#115d5a] rounded-full w-8 h-8 flex justify-center items-center hover:bg-[#115d5a] hover:text-white transition-colors"
                aria-label={`Decrease quantity of ${souvenir.name}`}
              >
                <FaMinus size={12} />
              </button>
              <span className="text-lg font-medium">{qty}</span>
              <button
                onClick={() => updateQty(souvenir._id, qty + 1)}
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
};

// Trending Card Component (Slightly different styling for trending section)
const TrendingCard = ({ souvenir, likedCards, toggleLike, handleAddToCart, handleDecreaseQuantity, updateQty, cartItems }) => {
  const inCart = cartItems.find((i) => i.product._id === souvenir._id);
  const qty = inCart?.quantity || 0;

  return (
    <div className="w-80 flex-shrink-0 rounded-lg bg-white p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-[#115d5a] relative flex flex-col">
      {/* Like Button */}
      <div className="absolute top-4 right-4 cursor-pointer z-10" onClick={() => toggleLike(souvenir._id)}>
        <FaHeart
          size={24}
          className={`transition-colors duration-300 ${likedCards[souvenir._id] ? "text-[#115d5a]" : "text-gray-400"} hover:text-[#0d4442]`}
        />
      </div>

      {/* Image */}
      <img src={souvenir.image || "placeholder.jpg"} alt={souvenir.name} className="mb-4 h-48 w-full rounded-t-lg object-cover" />

      {/* Details */}
      <div className="flex-grow">
        <h3 className="mb-2 flex justify-between text-xl font-semibold text-[#115d5a]">
          <span>{souvenir.name}</span>
          <span>${Number(souvenir.price || 0).toFixed(2)}</span>
        </h3>
        <p className="mb-4 text-gray-600 text-sm h-10 overflow-hidden">{souvenir.description || "No details available."}</p>
      </div>

      {/* Button Section */}
      <div className="mt-auto pt-4">
        {inCart ? (
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => handleDecreaseQuantity(souvenir._id, qty)}
              className="bg-[#115d5a] text-white rounded-full w-8 h-8 flex justify-center items-center hover:bg-[#E7C873] transition-colors"
              aria-label={`Decrease quantity of ${souvenir.name}`}
            >
              <FaMinus size={12} />
            </button>
            <span className="text-lg font-medium">{qty}</span>
            <button
              onClick={() => updateQty(souvenir._id, qty + 1)}
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
};

function Souvenirs() {
  // State
  const [souvenirs, setSouvenirs] = useState([]);
  const [likedCards, setLikedCards] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [layoutMode, setLayoutMode] = useState("grid");
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // Zustand Cart Store
  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQty = useCartStore((state) => state.updateCartQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  // Fetch Data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setSouvenirs(response.data?.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setSouvenirs([]);
      }
    };
    fetchProducts();
  }, []);

  // Auto Scroll Logic
  useEffect(() => {
    let intervalId;
    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        if (scrollRef.current && !isPaused) {
          const currentScroll = scrollRef.current.scrollLeft;
          const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
          if (currentScroll >= maxScroll - 1) {
            scrollRef.current.scrollLeft = 0;
          } else {
            scrollRef.current.scrollLeft += 1;
          }
        }
      }, 20);
    };
    startAutoScroll();
    return () => clearInterval(intervalId);
  }, [isPaused]);

  // Event Handlers
  const toggleLike = (id) => {
    setLikedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (souvenir) => {
    if (souvenir?._id) {
      addToCart(souvenir);
    } else {
      console.error("Attempted to add invalid souvenir to cart:", souvenir);
    }
  };

  const handleDecreaseQuantity = (productId, currentQuantity) => {
    if (!removeFromCart) {
      console.error("removeFromCart action is not available in the store!");
      if (currentQuantity > 1) {
        updateQty(productId, currentQuantity - 1);
      }
      return;
    }
    if (currentQuantity > 1) {
      updateQty(productId, currentQuantity - 1);
    } else {
      removeFromCart(productId);
    }
  };

  // Filter and Sort Logic
  const filteredSouvenirs = souvenirs.filter((s) => s.name.toLowerCase().includes(searchText.toLowerCase()));
  const sortedSouvenirs = [...filteredSouvenirs].sort((a, b) => {
    switch (sortOption) {
      case "price-desc":
        return (b.price || 0) - (a.price || 0);
      case "price-asc":
        return (a.price || 0) - (b.price || 0);
      case "date-desc":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "date-asc":
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="bg-gray-100">
      {/* Header Section */}
      <div className="relative h-[500px]">
        <NavBar />
        <div
          className="absolute inset-0 bg-cover bg-center transform transition-transform duration-500 hover:scale-105"
          style={{ backgroundImage: `url(${souvenirsBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />
          <div className="relative z-10 flex h-full items-center justify-center">
            <h1 className="text-5xl font-bold text-white">Souvenirs</h1>
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <section className="mt-20 px-4">
        <h2 className="text-center text-4xl font-bold text-[#115d5a]">Trending Souvenirs</h2>
        <div className="flex justify-center mt-4">
          <img src={des} alt="Decoration" className="h-auto w-52" />
        </div>
        <div
          ref={scrollRef}
          className="mt-8 flex space-x-6 overflow-x-auto px-4 pb-8 scrollbar-hide"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {souvenirs.slice(0, 8).map((s) => (
            <TrendingCard
              key={s._id}
              souvenir={s}
              likedCards={likedCards}
              toggleLike={toggleLike}
              handleAddToCart={handleAddToCart}
              handleDecreaseQuantity={handleDecreaseQuantity}
              updateQty={updateQty}
              cartItems={cartItems}
            />
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="mt-10 px-4">
        <h2 className="text-center text-3xl font-bold text-teal-800">New Arrivals</h2>
        <div className="flex justify-center mt-4">
          <img src={des} alt="Decoration" className="h-auto w-52" />
        </div>

        {/* Controls: View, Search, Sort */}
        <div className="flex flex-wrap justify-between items-center w-full p-4 mt-10 gap-4 bg-white/80 rounded-lg">
          {/* View Options */}
          <div className="flex space-x-2 px-4">
            <button
              className={`p-2 rounded hover:bg-gray-100 ${layoutMode === "grid" ? "bg-gray-200" : ""}`}
              onClick={() => setLayoutMode("grid")}
              aria-label="Grid View"
            >
              <BsFillGrid3X3GapFill
                size={28}
                className={`${layoutMode === "grid" ? "text-[#E7C873]" : "text-[#115d5a]"} hover:text-[#17807c]`}
              />
            </button>
            <button
              className={`p-2 rounded hover:bg-gray-100 ${layoutMode === "list" ? "bg-gray-200" : ""}`}
              onClick={() => setLayoutMode("list")}
              aria-label="List View"
            >
              <FaThList
                size={26}
                className={`${layoutMode === "list" ? "text-[#E7C873]" : "text-[#115d5a]"} hover:text-[#17807c]`}
              />
            </button>
          </div>

          {/* Search and Sort */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div
                className={`flex items-center bg-[#115d5a] text-[#E7C873] rounded-lg overflow-hidden transition-all duration-300 ${
                  isSearching ? "w-60 px-3 py-2" : "w-12 h-10 justify-center px-0 py-0"
                }`}
              >
                <FaSearch
                  size={18}
                  className={`text-[#E7C873] ${isSearching ? "mr-2 cursor-default" : "cursor-pointer"}`}
                  onClick={() => !isSearching && setIsSearching(true)}
                />
                {isSearching && (
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent text-[#E7C873] placeholder-[#E7C873] outline-none w-full text-sm"
                    autoFocus
                    onBlur={() => !searchText && setIsSearching(false)}
                    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                  />
                )}
              </div>
            </div>
            <div className="relative inline-block text-left group">
              <button className="flex items-center space-x-2 bg-[#115d5a] text-white px-4 py-2 rounded-lg hover:bg-[#0d4442] h-10">
                <span className="text-[#E7C873] font-medium text-sm">Sort</span>
                <FaSortAmountDownAlt size={16} className="text-[#E7C873]" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-20">
                <ul className="py-1 text-[#115d5a]">
                  {sortOptions.map((option) => (
                    <li
                      key={option.value}
                      className="px-4 py-2 text-sm hover:bg-[#115d5a] hover:text-[#E7C873] cursor-pointer transition-colors"
                      onClick={() => setSortOption(option.value)}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Product Display */}
        <div
          className={`py-8 px-4 grid gap-6 ${
            layoutMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {sortedSouvenirs.length > 0 ? (
            sortedSouvenirs.map((s) => (
              <ProductCard
                key={s._id}
                souvenir={s}
                likedCards={likedCards}
                toggleLike={toggleLike}
                handleAddToCart={handleAddToCart}
                handleDecreaseQuantity={handleDecreaseQuantity}
                updateQty={updateQty}
                cartItems={cartItems}
                layoutMode={layoutMode}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              {souvenirs.length === 0 ? "Loading souvenirs..." : "No souvenirs found matching your search."}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Souvenirs;