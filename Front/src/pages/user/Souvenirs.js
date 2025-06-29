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

const sortOptions = [
  { label: "From high to low price", value: "price-desc" },
  { label: "From low to high price", value: "price-asc" },
  { label: "Newest first", value: "date-desc" },
  { label: "Oldest first", value: "date-asc" },
];

const ProductCard = React.memo(({ 
  souvenir, 
  isLiked, 
  toggleLike, 
  handleAddToCart, 
  handleDecreaseQuantity, 
  quantity = 0,
  layoutMode 
}) => {
  return (
    <div
      className={`bg-white p-4 relative rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-[#115d5a] flex flex-col ${
        layoutMode === "list" ? "sm:flex-row sm:items-center sm:gap-4" : ""
      }`}
    >
      <div className="absolute top-3 right-3 cursor-pointer z-10" onClick={() => toggleLike(String(souvenir._id))}>
        <FaHeart
          size={22}
          className={`transition-colors duration-300 ${isLiked ? "text-[#115d5a]" : "text-gray-400"} hover:text-[#0d4442]`}
        /> 
      </div>

      <img
        src={souvenir.image || "placeholder.jpg"}
        alt={souvenir.name}
        className={`object-cover rounded-lg ${layoutMode === "list" ? "w-full sm:w-40 sm:h-40 flex-shrink-0" : "w-full h-48"}`}
      />

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

        <div className="mt-auto pt-4">
          {quantity > 0 ? (
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => handleDecreaseQuantity(String(souvenir._id), quantity)}
                className="bg-[#115d5a]/10 text-[#115d5a] rounded-full w-8 h-8 flex justify-center items-center hover:bg-[#115d5a] hover:text-white transition-colors"
              >
                <FaMinus size={12} />
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                onClick={() => handleAddToCart(souvenir)}
                className="bg-[#115d5a]/10 text-[#115d5a] rounded-full w-8 h-8 flex justify-center items-center hover:bg-[#115d5a] hover:text-white transition-colors"
              >
                <FaPlus size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleAddToCart(souvenir)}
              className="w-full flex items-center justify-center space-x-2 rounded bg-[#115d5a] px-4 py-2 text-white transition-colors hover:bg-[#0d4442]"
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

const TrendingCard = React.memo(({ 
  souvenir, 
  isLiked, 
  toggleLike, 
  handleAddToCart, 
  handleDecreaseQuantity, 
  quantity = 0 
}) => {
  return (
    <div className="w-80 flex-shrink-0 rounded-lg bg-white p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-[#115d5a] relative flex flex-col">
      <div className="absolute top-4 right-4 cursor-pointer z-10" onClick={() => toggleLike(String(souvenir._id))}>
        <FaHeart
          size={24}
          className={`transition-colors duration-300 ${isLiked ? "text-[#115d5a]" : "text-gray-400"} hover:text-[#0d4442]`}
        /> 
      </div>

      <img src={souvenir.image || "placeholder.jpg"} alt={souvenir.name} className="mb-4 h-48 w-full rounded-t-lg object-cover" />

      <div className="flex-grow">
        <h3 className="mb-2 flex justify-between text-xl font-semibold text-[#115d5a]">
          <span>{souvenir.name}</span>
          <span>${Number(souvenir.price || 0).toFixed(2)}</span>
        </h3>
        <p className="mb-4 text-gray-600 text-sm h-10 overflow-hidden">{souvenir.description || "No details available."}</p>
      </div>

      <div className="mt-auto pt-4">
        {quantity > 0 ? (
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => handleDecreaseQuantity(String(souvenir._id), quantity)}
              className="bg-[#115d5a] text-white rounded-full w-8 h-8 flex justify-center items-center hover:bg-[#E7C873] transition-colors"
            >
              <FaMinus size={12} />
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button
              onClick={() => handleAddToCart(souvenir)}
              className="bg-[#115d5a] text-white rounded-full w-8 h-8 flex justify-center items-center hover:bg-[#E7C873] transition-colors"
            >
              <FaPlus size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleAddToCart(souvenir)}
            className="w-full flex items-center justify-center space-x-2 rounded bg-[#115d5a] px-4 py-2 text-white transition-colors hover:bg-[#0d4442]"
          >
            <FaShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
});

function Souvenirs() {
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

  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQty = useCartStore((state) => state.updateCartQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const cartItemMap = useMemo(() => {
    const map = {};
    cartItems.forEach(item => {
      map[String(item.product._id)] = item.quantity;
    });
    return map;
  }, [cartItems]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await getAllProducts();
      const fixedProducts = response.data?.products.map((product) => ({
        ...product,
        _id: product._id?.$oid || product._id
      }));
      setSouvenirs(fixedProducts || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setSouvenirs([]); // ⚠️ هذا قد يسبب تحديث متكرر في useMemo إن كان فيه شرط على `souvenirs`
    } finally {
      setIsLoading(false);
    }
  };
  fetchProducts();
}, []); // ✅ هذا جيد



  useEffect(() => {
    if (isLoading || souvenirs.length === 0) return;
    
    const startAutoScroll = () => {
      scrollIntervalRef.current = setInterval(() => {
        if (scrollRef.current && !isPaused) {
          const currentScroll = scrollRef.current.scrollLeft;
          const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
          
          if (currentScroll >= maxScroll - 1) {
            scrollRef.current.scrollLeft = 0;
          } else {
            scrollRef.current.scrollLeft += 1;
          }
        }
      }, 50);
    };
    
    startAutoScroll();
    
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isPaused, isLoading, souvenirs]);

  const toggleLike = useCallback((id) => {
    setLikedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleAddToCart = useCallback((souvenir) => {
    if (souvenir?._id) {
      addToCart(souvenir);
    }
  }, [addToCart]);

  const handleDecreaseQuantity = useCallback((productId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQty(productId, currentQuantity - 1);
    } else {
      removeFromCart(productId);
    }
  }, [updateQty, removeFromCart]);

  const filteredSouvenirs = useMemo(() => {
    return souvenirs.filter((s) => 
      s.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [souvenirs, searchText]);

  const sortedSouvenirs = useMemo(() => {
    return [...filteredSouvenirs].sort((a, b) => {
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
  }, [filteredSouvenirs, sortOption]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl text-[#115d5a]">Loading souvenirs...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
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
              key={String(s._id)}
              souvenir={s}
              isLiked={!!likedCards[String(s._id)]}
              toggleLike={toggleLike}
              handleAddToCart={handleAddToCart}
              handleDecreaseQuantity={handleDecreaseQuantity}
              quantity={cartItemMap[String(s._id)] || 0}
            />
          ))}
        </div>
      </section>

      <section className="mt-10 px-4">
        <h2 className="text-center text-3xl font-bold text-teal-800">New Arrivals</h2>
        <div className="flex justify-center mt-4">
          <img src={des} alt="Decoration" className="h-auto w-52" />
        </div>

        <div className="flex flex-wrap justify-between items-center w-full p-4 mt-10 gap-4 bg-white/80 rounded-lg">
          <div className="flex space-x-2 px-4">
            <button
              className={`p-2 rounded hover:bg-gray-100 ${layoutMode === "grid" ? "bg-gray-200" : ""}`}
              onClick={() => setLayoutMode("grid")}
            >
              <BsFillGrid3X3GapFill
                size={28}
                className={`${layoutMode === "grid" ? "text-[#E7C873]" : "text-[#115d5a]"} hover:text-[#17807c]`}
              />
            </button>
            <button
              className={`p-2 rounded hover:bg-gray-100 ${layoutMode === "list" ? "bg-gray-200" : ""}`}
              onClick={() => setLayoutMode("list")}
            >
              <FaThList
                size={26}
                className={`${layoutMode === "list" ? "text-[#E7C873]" : "text-[#115d5a]"} hover:text-[#17807c]`}
              />
            </button>
          </div>

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

        <div
          className={`py-8 px-4 grid gap-6 ${
            layoutMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {sortedSouvenirs.length > 0 ? (
            sortedSouvenirs.map((s) => (
              <ProductCard
                key={String(s._id)}
                souvenir={s}
                isLiked={!!likedCards[String(s._id)]}
                toggleLike={toggleLike}
                handleAddToCart={handleAddToCart}
                handleDecreaseQuantity={handleDecreaseQuantity}
                quantity={cartItemMap[String(s._id)] || 0}
                layoutMode={layoutMode}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              {souvenirs.length === 0 ? "No souvenirs available" : "No souvenirs found matching your search."}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Souvenirs;
