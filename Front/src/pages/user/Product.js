import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Expand, ShoppingCart, Check } from "lucide-react";
import { FaHeart, FaCaretUp, FaCaretDown } from "react-icons/fa";

import { getAllProducts } from "../../api/services/cartService"

import Features from "../../components/user/Features";
import NavBar from "../../layout/Navbar";
import Footer from "../../layout/Footer";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await getAllProducts(); // I use getAllProducts because you don't have getProductById yet
      const allProducts = response.data.products || [];
      const foundProduct = allProducts.find((item) => item._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setMainImage(foundProduct.image);
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };

  const images = product?.images || [product?.image]; // Use images array if exists

  if (!product) {
    return <div className="flex justify-center items-center h-screen text-2xl font-semibold text-[#115d5a]">Loading...</div>;
  }

  const currentIndex = images.indexOf(mainImage);

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setMainImage(images[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setMainImage(images[prevIndex]);
  };

  return (
    <>
      <NavBar />

      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsExpanded(false)}
        >
          <div className="relative">
            <img
              src={mainImage}
              className="w-[80vw] max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-[-50px] top-1/2 -translate-y-1/2 text-white text-4xl font-bold"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-[-50px] top-1/2 -translate-y-1/2 text-white text-4xl font-bold"
            >
              ›
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-12 p-10 max-w-7xl mx-auto">
        {/* Thumbnails */}
        <div className="relative flex flex-col items-center gap-2">
          {images.length > 4 && (
            <button
              onClick={() => document.getElementById("thumbsContainer").scrollBy({ top: -100, behavior: "smooth" })}
              className="text-[#115d5a] hover:text-[#E7C873] transition-colors"
            >
              <FaCaretUp size={24} />
            </button>
          )}

          <div
            id="thumbsContainer"
            className="flex flex-col gap-2 overflow-y-auto max-h-[360px] pr-2"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#115d5a transparent" }}
          >
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onMouseEnter={() => setMainImage(img)}
                className={`w-20 h-20 cursor-pointer border-2 rounded-md
                  ${mainImage === img ? "border-[#E7C873]" : "border-transparent"}
                  hover:border-[#115d5a]`}
              />
            ))}
          </div>

          {images.length > 4 && (
            <button
              onClick={() => document.getElementById("thumbsContainer").scrollBy({ top: 100, behavior: "smooth" })}
              className="text-[#115d5a] hover:text-[#E7C873] transition-colors"
            >
              <FaCaretDown size={24} />
            </button>
          )}
        </div>

        {/* Main Image with Zoom */}
        <div
          className="relative w-[28rem] h-[22rem] border rounded-md overflow-hidden"
          onMouseEnter={() => { setShowZoom(true); setIsHovered(true); }}
          onMouseLeave={() => { setShowZoom(false); setIsHovered(false); }}
          onMouseMove={handleMouseMove}
        >
          <img
            src={mainImage}
            className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? "scale-110" : "scale-100"}`}
          />
          {showZoom && (
            <div
              className="absolute w-32 h-32 border-2 border-[#115d5a] rounded-md pointer-events-none"
              style={{
                top: `${zoomPosition.y}%`,
                left: `${zoomPosition.x}%`,
                transform: "translate(-50%, -50%)",
                backgroundImage: `url(${mainImage})`,
                backgroundSize: "300%",
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          )}
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <Expand className="text-[#115d5a] hover:text-[#E7C873] cursor-pointer" onClick={() => setIsExpanded(true)} />
            <FaHeart size={23} className="text-[#115d5a] hover:text-[#E7C873] cursor-pointer" />
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h2 className="text-[#115d5a] text-3xl font-semibold">{product.name}</h2>
          <p className="text-gray-600 text-sm">{product.details}</p>
          <p className="text-sm text-gray-500">Free delivery within Damascus, shipping to the governorates</p>
          <p className="text-lg font-bold text-[#115d5a] mt-2">
            {product.price} $ <span className="text-sm text-gray-500">per one</span>
          </p>

          <div className="flex items-center gap-2 mt-4">
            <button
              className="flex items-center gap-2 bg-[#E7C873] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#d4b060] transition-all"
              onClick={() => setCartAdded(true)}
            >
              {cartAdded ? (
                <>
                  <Check className="text-[#115d5a]" size={20} />
                  <span className="text-[#115d5a]">Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="text-[#115d5a]" size={20} />
                  <span className="text-[#115d5a]">Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <Features />
      <Footer />
    </>
  );
};

export default Product;
