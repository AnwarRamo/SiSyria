// Souvenirs.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaMinus, FaPlus, FaThList, FaSearch } from "react-icons/fa";
import { BsFillGrid3X3GapFill } from "react-icons/bs";

import { useCartStore } from "../../api/stores/cart.store";
import NavBar from "../../layout/Navbar";
import Footer from "../../layout/Footer";
import { getAllProducts } from "../../api/services/cartService";
import souvenirsBg from "../../assets/images/souvenirs.jpg";

// Sort options
const sortOptions = [
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Newest First", value: "date-desc" },
  { label: "Oldest First", value: "date-asc" },
];

// ProductCard
const ProductCard = React.memo(({ souvenir, isLiked, toggleLike, handleAddToCart, handleDecreaseQuantity, quantity = 0, layoutMode }) => (
  <div className={`bg-white p-5 rounded-xl shadow-md hover:shadow-xl border-2 border-transparent hover:border-[#115d5a] flex flex-col ${layoutMode === "list" ? "sm:flex-row sm:items-center sm:gap-5" : ""}`}>
    <div className="absolute top-3 right-3 cursor-pointer" onClick={() => toggleLike(souvenir._id)}>
      <FaHeart size={22} className={isLiked ? "text-[#115d5a]" : "text-gray-400"} />
    </div>
    <img src={souvenir.image || "https://via.placeholder.com/150"} alt={souvenir.name} className={`rounded-lg object-cover ${layoutMode === "list" ? "sm:w-40 sm:h-40 w-full h-48" : "w-full h-48"}`} />
    <div className={`mt-4 flex flex-col flex-grow ${layoutMode === "list" ? "sm:mt-0" : ""}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-[#115d5a] text-lg font-semibold">{souvenir.name}</h3>
        <span className="text-[#115d5a] font-semibold">${Number(souvenir.price || 0).toFixed(2)}</span>
      </div>
      <p className="text-gray-600 mt-2 text-sm line-clamp-3">
        {souvenir.description || "No description available."}
      </p>
      <div className="mt-auto pt-4">
        {quantity > 0 ? (
          <div className="flex items-center space-x-2 justify-end">
            <button onClick={() => handleDecreaseQuantity(souvenir._id, quantity)} className="bg-[#115d5a]/10 text-[#115d5a] rounded-full p-2 hover:bg-[#115d5a]/20">
              <FaMinus size={12} />
            </button>
            <span className="text-lg">{quantity}</span>
            <button onClick={() => handleAddToCart(souvenir)} className="bg-[#115d5a]/10 text-[#115d5a] rounded-full p-2 hover:bg-[#115d5a]/20">
              <FaPlus size={12} />
            </button>
          </div>
        ) : (
          <button onClick={() => handleAddToCart(souvenir)} className="w-full bg-[#115d5a] hover:bg-[#0d4442] text-white flex items-center justify-center space-x-2 py-2 rounded-lg">
            <FaShoppingCart size={16} />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  </div>
));

// TrendingCard (simplified)
const TrendingCard = ({ souvenir, isLiked, toggleLike }) => (
  <div className="w-48 bg-white rounded-lg shadow-md p-3 flex flex-col">
    <img src={souvenir.image || "https://via.placeholder.com/150"} alt={souvenir.name} className="h-28 w-full object-cover rounded-md" />
    <div className="mt-2 flex justify-between items-center">
      <span className="text-sm font-medium">{souvenir.name}</span>
      <FaHeart size={16} className={isLiked ? "text-[#115d5a] cursor-pointer" : "text-gray-400 cursor-pointer"} onClick={() => toggleLike(souvenir._id)} />
    </div>
  </div>
);

function Souvenirs() {
  const [souvenirs, setSouvenirs] = useState([]);
  const [likedCards, setLikedCards] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [layoutMode, setLayoutMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);

  const cartItems = useCartStore((s) => s.items);
  const addToCart = useCartStore((s) => s.addToCart);
  const updateQty = useCartStore((s) => s.updateCartQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);

  const cartItemMap = useMemo(() => {
    return cartItems?.reduce((m, i) => ({ ...m, [i.product._id]: i.quantity }), {}) || {};
  }, [cartItems]);

  useEffect(() => {
    const fetchSouvenirs = async () => {
      setIsLoading(true);
      try {
        const res = await getAllProducts(); // expecting { products: [...] }
        const list = Array.isArray(res.products) ? res.products : [];
        setSouvenirs(list);
      } catch (e) {
        console.error("Fetch error:", e);
        setSouvenirs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSouvenirs();
  }, []);

  const toggleLike = useCallback((id) => {
    setLikedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);
  const handleAddToCart = useCallback((s) => addToCart(s), [addToCart]);
  const handleDecreaseQuantity = useCallback((id, qty) => qty <= 1 ? removeFromCart(id) : updateQty(id, qty - 1), [removeFromCart, updateQty]);

  const filtered = useMemo(() => {
    const txt = searchText.toLowerCase();
    return souvenirs.filter(s => s.name.toLowerCase().includes(txt) || s.description?.toLowerCase().includes(txt));
  }, [souvenirs, searchText]);
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortOption === "price-desc") return arr.sort((a, b) => b.price - a.price);
    if (sortOption === "price-asc") return arr.sort((a, b) => a.price - b.price);
    if (sortOption === "date-desc") return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortOption === "date-asc") return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return arr;
  }, [filtered, sortOption]);

  // Auto carousel
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isPaused) return;
    intervalRef.current = setInterval(() => {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth) el.scrollLeft = 0;
      else el.scrollLeft += 1;
    }, 50);
    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  return (
    <>
      <NavBar />
      <section
        className="relative h-80 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${souvenirsBg})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <h1 className="relative text-5xl font-bold text-white">Souvenirs</h1>
        <div
          ref={scrollRef}
          className="absolute bottom-4 w-full max-w-7xl overflow-x-auto px-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex space-x-4">
            {souvenirs.slice(0, 6).map(s => (
              <TrendingCard key={s._id} souvenir={s} isLiked={likedCards[s._id]} toggleLike={toggleLike} />
            ))}
          </div>
        </div>
      </section>
      <main className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="Search souvenirs..."
              className="border rounded-lg px-3 py-2 w-full sm:w-64 focus:ring-2 focus:ring-[#115d5a]"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#115d5a]"
            >
              <option value="">Sort By</option>
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button onClick={() => setLayoutMode("grid")} className={`p-2 rounded ${layoutMode==="grid"?"bg-[#115d5a]/20":""}`}><BsFillGrid3X3GapFill /></button>
            <button onClick={() => setLayoutMode("list")} className={`p-2 rounded ${layoutMode==="list"?"bg-[#115d5a]/20":""}`}><FaThList /></button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-lg text-gray-700">Loading souvenirs...</p>
        ) : (
          <div className={`grid gap-6 ${layoutMode==="grid"?"grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4":"grid-cols-1"}`}>
            {sorted.map(s => (
              <ProductCard
                key={s._id}
                souvenir={s}
                isLiked={likedCards[s._id]}
                toggleLike={toggleLike}
                handleAddToCart={handleAddToCart}
                handleDecreaseQuantity={handleDecreaseQuantity}
                quantity={cartItemMap[s._id] || 0}
                layoutMode={layoutMode}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Souvenirs;
