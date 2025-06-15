import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaThList,
  FaSearch,
} from "react-icons/fa";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
// Note: Assuming these imports are correctly configured in your project
// import { useCartStore } from "../../api/stores/cart.store";
// import { getAllProducts } from "../../api/services/cartService";
// import NavBar from "../../layout/Navbar";
// import Footer from "../../layout/Footer";
// import souvenirsBg from "../../assets/images/souvenirs.jpg";

// --- MOCK DATA & SERVICES (for demonstration) ---
// Replace these with your actual imports and services
const souvenirsBg = "https://placehold.co/1920x400/115d5a/white?text=Souvenirs";
const useCartStore = (selector) => {
  const state = {
    items: [],
    addToCart: (item) => console.log("Add to cart:", item),
    updateCartQuantity: (id, qty) => console.log(`Update ${id} to ${qty}`),
    removeFromCart: (id) => console.log("Remove from cart:", id),
  };
  return selector(state);
};

const mockSouvenirs = [
    { _id: '1', name: 'Handmade Vase', price: 25.00, description: 'A beautifully crafted vase, perfect for any home.', image: 'https://placehold.co/400x400/e2e8f0/334155?text=Vase', createdAt: new Date().toISOString() },
    { _id: '2', name: 'Woven Scarf', price: 35.50, description: 'A warm and stylish scarf made from local wool.', image: 'https://placehold.co/400x400/e2e8f0/334155?text=Scarf', createdAt: new Date().toISOString() },
    { _id: '3', name: 'Clay Magnet Set', price: 12.00, description: 'A set of 3 magnets depicting famous landmarks.', image: 'https://placehold.co/400x400/e2e8f0/334155?text=Magnets', createdAt: new Date().toISOString() },
    { _id: '4', name: 'Artisanal Coffee', price: 18.75, description: 'Locally sourced and roasted coffee beans.', image: 'https://placehold.co/400x400/e2e8f0/334155?text=Coffee', createdAt: new Date().toISOString() },
    { _id: '5', name: 'Engraved Keychain', price: 9.99, description: 'A stainless steel keychain with custom engraving.', image: 'https://placehold.co/400x400/e2e8f0/334155?text=Keychain', createdAt: new Date().toISOString() },
    { _id: '6', name: 'Cityscape Print', price: 45.00, description: 'A high-quality print of the city skyline.', image: 'https://placehold.co/400x400/e2e8f0/334155?text=Print', createdAt: new Date().toISOString() },
    { _id: '7', name: 'Local Honey', price: 15.00, description: 'Pure, unfiltered honey from local apiaries.', image: 'https://placehold.co/400x400/e2e8f0/334155?text=Honey', createdAt: new Date().toISOString() },
    { _id: '8', name: 'Leather Journal', price: 30.00, description: 'A handcrafted leather journal for your thoughts.', image: 'https://placehold.co/400x400/e2e8f0/334155?text=Journal', createdAt: new Date().toISOString() },
];

const getAllProducts = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockSouvenirs);
        }, 1000); // Simulate network delay
    });
};
const NavBar = () => <nav className="bg-gray-800 text-white p-4 text-center">Navbar Placeholder</nav>;
const Footer = () => <footer className="bg-gray-800 text-white p-4 text-center mt-12">Footer Placeholder</footer>;
// --- END MOCK DATA ---


// Configuration for sorting options
const sortOptions = [
  { label: "Sort By", value: "" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Newest First", value: "date-desc" },
  { label: "Oldest First", value: "date-asc" },
];

// ProductCard Component
const ProductCard = React.memo(({ souvenir, isLiked, toggleLike, handleAddToCart, handleDecreaseQuantity, quantity = 0, layoutMode }) => {
  return (
    <div
      className={`bg-white p-4 relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#115d5a] flex flex-col ${
        layoutMode === "list" ? "sm:flex-row sm:items-center sm:gap-6" : ""
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
                onClick={() => handleDecreaseQuantity(souvenir._id, quantity)}
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
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-[#115d5a] px-4 py-2 text-white transition-colors hover:bg-[#0d4442]"
              aria-label={`Add ${souvenir.name} to cart`}
            >
              <FaShoppingCart size={16} />
              <span className="text-sm font-semibold">Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

// TrendingCard component implementation
const TrendingCard = React.memo(({ souvenir, isLiked, toggleLike }) => (
    <div className="inline-block w-64 md:w-72 flex-shrink-0 bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 relative">
        <img src={souvenir.image} alt={souvenir.name} className="w-full h-40 object-cover rounded-lg mb-3" />
        <h4 className="font-bold text-lg text-gray-800 truncate">{souvenir.name}</h4>
        <p className="text-md text-[#115d5a] font-semibold">${Number(souvenir.price || 0).toFixed(2)}</p>
        <div
            className="absolute top-3 right-3 cursor-pointer z-10 p-2 bg-white/50 rounded-full"
            onClick={() => toggleLike(souvenir._id)}
        >
            <FaHeart
                size={20}
                className={`transition-colors duration-300 ${isLiked ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
            />
        </div>
    </div>
));


function Souvenirs() {
  const [souvenirs, setSouvenirs] = useState([]);
  const [likedCards, setLikedCards] = useState({});
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [layoutMode, setLayoutMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);

  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQty = useCartStore((state) => state.updateCartQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  // Memoize the cart item map for performance
  const cartItemMap = useMemo(() => {
    return (cartItems || []).reduce((map, item) => {
      map[item._id] = item.quantity;
      return map;
    }, {});
  }, [cartItems]);

  // Fetch souvenirs on component mount
  useEffect(() => {
    const fetchSouvenirs = async () => {
      setIsLoading(true);
      try {
        const data = await getAllProducts();
        // Ensure data is an array before setting state
        setSouvenirs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch souvenirs:", error);
        setSouvenirs([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchSouvenirs();
  }, []);

  // Callbacks are memoized to prevent unnecessary re-renders of child components
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

  // Memoize the filtered and sorted souvenirs to avoid re-computation on every render
  const filteredAndSortedSouvenirs = useMemo(() => {
    let items = [...souvenirs];

    // Apply search filter
    if (searchText.trim()) {
      const lowercasedFilter = searchText.toLowerCase();
      items = items.filter(
        (s) =>
          s.name.toLowerCase().includes(lowercasedFilter) ||
          (s.description && s.description.toLowerCase().includes(lowercasedFilter))
      );
    }

    // Apply sorting
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
  }, [souvenirs, searchText, sortOption]);

  return (
    <>
      <NavBar />
      <section
        className="bg-cover bg-center py-16 relative flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${souvenirsBg})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <h1 className="relative text-5xl text-white font-bold mb-6 text-center">
          Our Souvenir Collection
        </h1>
         <div
            className="relative w-full max-w-7xl overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 scrollbar-track-transparent py-4"
            aria-label="Trending souvenirs carousel"
        >
          <div className="flex space-x-6 px-4">
            {(souvenirs.length > 0 ? souvenirs.slice(0, 6) : Array(5).fill(null)).map((souvenir, index) => (
               souvenir ?
                <TrendingCard
                    key={souvenir._id}
                    souvenir={souvenir}
                    isLiked={likedCards[souvenir._id]}
                    toggleLike={toggleLike}
                /> :
                // Skeleton loader for trending cards
                <div key={index} className="inline-block w-64 md:w-72 flex-shrink-0 bg-white/90 rounded-2xl p-4 animate-pulse">
                    <div className="w-full h-40 bg-gray-300 rounded-lg mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                </div>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Search souvenirs..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#115d5a]"
              aria-label="Search souvenirs"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center space-x-3 justify-end">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#115d5a] bg-white"
              aria-label="Sort souvenirs"
            >
              {sortOptions.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button
              aria-label="Switch to grid view"
              className={`p-2 rounded-lg hover:bg-[#115d5a]/20 transition-colors ${
                layoutMode === "grid" ? "bg-[#115d5a]/20 text-[#115d5a]" : "text-gray-600"
              }`}
              onClick={() => setLayoutMode("grid")}
            >
              <BsFillGrid3X3GapFill size={20}/>
            </button>
            <button
              aria-label="Switch to list view"
              className={`p-2 rounded-lg hover:bg-[#115d5a]/20 transition-colors ${
                layoutMode === "list" ? "bg-[#115d5a]/20 text-[#115d5a]" : "text-gray-600"
              }`}
              onClick={() => setLayoutMode("list")}
            >
              <FaThList size={20} />
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className={`grid gap-6 ${layoutMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
            {Array(8).fill(null).map((_, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl shadow-lg animate-pulse">
                    <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded-lg w-full"></div>
                </div>
            ))}
          </div>
        ) : filteredAndSortedSouvenirs.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">No Souvenirs Found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              layoutMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredAndSortedSouvenirs.map((souvenir) => (
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
