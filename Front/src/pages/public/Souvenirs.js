import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// --- Original Imports Restored ---
import { useCartStore } from "../../api/stores/cart.store";
import NavBar from "../../layout/Navbar";
import Footer from "../../layout/Footer";
import { getAllProducts } from "../../api/services/cartService";


// --- SVG Icon Components (Replaces react-icons) ---
const IconHeart = ({ size = 22, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const IconShoppingCart = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const IconMinus = ({ size = 12, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const IconPlus = ({ size = 12, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const IconThList = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const IconSearch = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const IconSort = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
     <path d="M3 4h18M3 8h12M3 12h9M3 16h6M3 20h3"></path><path d="m16 16-2 2 2 2"></path><path d="m16 8 2-2-2-2"></path>
  </svg>
);

const IconGrid = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const ProductCard = React.memo(({
  souvenir,
  isLiked,
  toggleLike,
  handleAddToCart,
  handleDecreaseQuantity,
  quantity = 0,
  layoutMode = "grid",
  variant = "default"
}) => {
  const cardRef = useRef(null);

  // 3D tilt effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    cardRef.current.style.transform = `perspective(1200px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) scale3d(1.04,1.04,1.04)`;
  };
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1200px) rotateY(0) rotateX(0) scale3d(1,1,1)';
    }
  };

  const isTrending = variant === 'trending';
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-300 ease-out flex flex-col group ${isTrending ? 'w-80 flex-shrink-0' : ''}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className={`relative bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl hover:shadow-amber-200 border-2 border-[#E7C873] flex flex-col h-full transition-all duration-300 ${layoutMode === "list" && !isTrending ? "sm:flex-row sm:items-center sm:gap-4" : ""}`}
      >
        {/* Like button */}
        <div className="absolute top-3 right-3 cursor-pointer z-10" onClick={() => toggleLike(String(souvenir._id))}>
          <IconHeart
            size={22}
            className={`transition-colors duration-300 ${isLiked ? "text-[#115d5a] fill-[#115d5a]" : "text-gray-300 fill-transparent"} hover:text-[#0d4442]`}
          />
        </div>
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-[#E7C873] text-[#115d5a] px-3 py-1 rounded-full text-xs font-bold shadow">
          {souvenir.category || 'Souvenir'}
        </div>
        {/* Product image */}
        <div className="relative w-full h-48 overflow-hidden flex items-center justify-center">
          <img
            src={souvenir.image}
            alt={souvenir.title || souvenir.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-3 right-3 bg-[#E7C873] text-[#115d5a] px-5 py-2 rounded-full text-lg font-bold shadow-lg border-2 border-white">
            ${Number(souvenir.price || 0).toFixed(2)}
          </span>
        </div>
        {/* Card content */}
        <div className="flex flex-col flex-grow px-5 pt-4 pb-6">
          <h3 className="text-[#115d5a] text-xl font-extrabold mb-1 truncate">{souvenir.title || souvenir.name}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2 min-h-[36px]">{souvenir.description}</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#115d5a]/10 text-[#115d5a] px-2 py-0.5 rounded-full text-xs font-semibold border border-[#E7C873]">Stock: {souvenir.stock ?? 'N/A'}</span>
            <span className="bg-[#E7C873]/20 text-[#E7C873] px-2 py-0.5 rounded-full text-xs font-semibold border border-[#E7C873]">Sold: {souvenir.soldCount ?? 0}</span>
          </div>
          {/* Floating Add to Cart Button */}
          <div className="flex justify-end mt-auto">
            {quantity > 0 ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDecreaseQuantity(String(souvenir._id), quantity)}
                  className="rounded-full w-9 h-9 flex justify-center items-center bg-[#E7C873]/80 text-[#115d5a] hover:bg-[#E7C873] hover:text-[#0a192f] shadow-md border border-[#E7C873] transition-all duration-200"
                >
                  <IconMinus size={14} className="stroke-current" />
                </button>
                <span className="text-lg font-bold text-[#115d5a]">{quantity}</span>
                <button
                  onClick={() => handleAddToCart(souvenir)}
                  className="rounded-full w-9 h-9 flex justify-center items-center bg-[#115d5a] text-white hover:bg-[#0d4442] shadow-md border border-[#115d5a] transition-all duration-200"
                >
                  <IconPlus size={16} className="stroke-current" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAddToCart(souvenir)}
                className="rounded-full bg-gradient-to-r from-[#115d5a] to-[#E7C873] w-12 h-12 flex items-center justify-center shadow-lg hover:from-[#0d4442] hover:to-[#E7C873] border-2 border-white transition-all duration-300"
                aria-label="Add to Cart"
              >
                <IconShoppingCart size={20} className="stroke-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

const heroData = [
    { 
        src: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Coastal Treasures"
    },
    { 
        src: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Mountain Mementos"
    },
    { 
        src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Adventure Awaits"
    },
];

function Souvenirs() {
  const [souvenirs, setSouvenirs] = useState([]);
  const [likedCards, setLikedCards] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [sortOption, setSortOption] = useState("date-desc");
  const [layoutMode, setLayoutMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

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
        setSouvenirs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Effect for Hero Slider
  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentHeroIndex(prevIndex => (prevIndex + 1) % heroData.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  // Effect for Auto-Scrolling Trending Section
  useEffect(() => {
    // If paused by user, or the ref is not yet available, clear any running interval and do nothing.
    if (isPaused || !scrollRef.current) {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
      return;
    }

    const scroller = scrollRef.current;

    // Only start scrolling if the content is wider than the container.
    const canScroll = scroller.scrollWidth > scroller.clientWidth;
    if (!canScroll) {
        return;
    }

    const startAutoScroll = () => {
      scrollIntervalRef.current = setInterval(() => {
        // Double-check the ref inside the interval, just in case.
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            // Check if we've reached the end.
            if (scrollLeft >= scrollWidth - clientWidth - 1) { 
              scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
              // Otherwise, scroll by a small amount.
              scrollRef.current.scrollBy({ left: 1, behavior: 'auto' });
            }
        }
      }, 50); // scroll speed
    };
    
    startAutoScroll();
    
    // Cleanup function to clear the interval when the component unmounts or dependencies change.
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
    // Rerun this effect if the user pauses/unpauses, or if the underlying data changes.
  }, [isPaused, souvenirs, isLoading]);


  const toggleLike = useCallback((id) => {
    setLikedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleAddToCart = useCallback((souvenir) => {
    addToCart(souvenir);
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
        case "price-desc": return (b.price || 0) - (a.price || 0);
        case "price-asc": return (a.price || 0) - (b.price || 0);
        case "date-desc": return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "date-asc": return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        default: return 0;
      }
    });
  }, [filteredSouvenirs, sortOption]);
  
  const trendingSouvenirs = useMemo(() => souvenirs.slice(0, 8), [souvenirs]);
  
  const sortOptions = [
    { label: "Newest first", value: "date-desc" },
    { label: "Oldest first", value: "date-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Price: Low to High", value: "price-asc" },
  ];

  if (isLoading && souvenirs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-2xl text-white animate-pulse">Loading Treasures...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-[#f8fafc] text-black dark:bg-[#0a192f] dark:text-white">
      <div className="fixed top-0 left-0 w-full h-screen z-0">
          {heroData.map((hero, index) => (
              <div
                  key={hero.src}
                  className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
                  style={{ 
                      backgroundImage: `url(${hero.src})`,
                      opacity: index === currentHeroIndex ? 1 : 0,
                      transform: `scale(${index === currentHeroIndex ? 1 : 1.1})`
                  }}
              />
          ))}
          <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-30">
        <NavBar />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Spacer Section with Title */}
        <div className="h-screen flex items-center justify-center text-center text-white">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-wider drop-shadow-2xl animate-fade-in-down">
                {heroData[currentHeroIndex].title}
            </h1>
        </div>

        {/* The actual content that scrolls over the background */}
        <div className="relative bg-gray-100">
          <section className="py-20 px-4 container mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#115d5a]">Trending Souvenirs</h2>
                <p className="text-gray-500 mt-2">Handpicked items loved by our customers</p>
            </div>
            <div 
                ref={scrollRef}
                className="flex space-x-6 overflow-x-auto px-4 pb-8 scrollbar-hide"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
              {trendingSouvenirs.map((s) => (
                <ProductCard
                  key={`trending-${String(s._id)}`}
                  souvenir={s}
                  isLiked={!!likedCards[String(s._id)]}
                  toggleLike={toggleLike}
                  handleAddToCart={handleAddToCart}
                  handleDecreaseQuantity={handleDecreaseQuantity}
                  quantity={cartItemMap[String(s._id)] || 0}
                  variant="trending"
                />
              ))}
            </div>
          </section>

          <section className="py-10 px-4 container mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#115d5a]">New Arrivals</h2>
                <p className="text-gray-500 mt-2">Explore our latest collection</p>
            </div>

            <div className="sticky top-4 z-20 flex flex-wrap justify-between items-center w-full p-4 mb-10 gap-4 bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button className={`p-2 rounded-md ${layoutMode === "grid" ? "bg-white shadow" : ""}`} onClick={() => setLayoutMode("grid")}>
                  <IconGrid size={20} className="text-[#115d5a]"/>
                </button>
                <button className={`p-2 rounded-md ${layoutMode === "list" ? "bg-white shadow" : ""}`} onClick={() => setLayoutMode("list")}>
                  <IconThList size={20} className="text-[#115d5a]"/>
                </button>
              </div>

              <div className="flex items-center space-x-3 flex-grow sm:flex-grow-0 justify-end">
                <div className={`flex items-center bg-[#115d5a] text-white rounded-lg overflow-hidden transition-all duration-300 ${isSearching ? "w-60 px-3 py-2" : "w-10 h-10 justify-center"}`}>
                  <IconSearch size={16} className={`${isSearching ? "mr-2 cursor-default" : "cursor-pointer"} stroke-[#E7C873]`} onClick={() => !isSearching && setIsSearching(true)} />
                  {isSearching && (
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search..."
                      className="bg-transparent text-[#E7C873] placeholder-[#E7C873]/70 outline-none w-full text-sm"
                      autoFocus
                      onBlur={() => !searchText && setIsSearching(false)}
                    />
                  )}
                </div>
                <div className="relative inline-block text-left group">
                  <button className="flex items-center space-x-2 bg-[#115d5a] text-white px-4 py-2 rounded-lg h-10">
                    <IconSort size={16} className="text-[#E7C873]" />
                    <span className="font-medium text-sm text-[#E7C873] hidden sm:inline">Sort</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-20">
                    <ul className="py-1 text-[#115d5a]">
                      {sortOptions.map((option) => (
                        <li key={option.value} className={`px-4 py-2 text-sm hover:bg-[#115d5a] hover:text-[#E7C873] cursor-pointer transition-colors ${sortOption === option.value ? 'bg-gray-100' : ''}`} onClick={() => setSortOption(option.value)}>
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className={`grid gap-8 ${layoutMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 lg:grid-cols-2"}`}>
              {sortedSouvenirs.length > 0 ? (
                sortedSouvenirs.map((s) => (
                  <ProductCard
                    key={`product-${String(s._id)}`}
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
                <div className="col-span-full text-center text-gray-500 py-20">
                  <h3 className="text-2xl font-bold">No Souvenirs Found</h3>
                  <p>Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </section>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Souvenirs;
