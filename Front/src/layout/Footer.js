import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiYoutube,
  FiArrowUp,
  FiHeart
} from 'react-icons/fi';

const Footer = () => {
  const [showScroll, setShowScroll] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#115d5a] border-t-4 border-[#E7C873] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-[#E7C873] rounded-lg flex items-center justify-center mr-2">
                <FiMapPin className="w-5 h-5 text-[#115d5a]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Syria Travel</h3>
                <p className="text-xs text-[#E7C873]">Discover Ancient Lands</p>
              </div>
            </div>
            <p className="text-[#E7C873] mb-2 text-sm leading-relaxed">
              Experience the rich history, culture, and breathtaking landscapes of Syria. 
              Your gateway to unforgettable adventures.
            </p>
            <div className="flex space-x-2">
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#E7C873] transition-colors">
                <FiFacebook className="w-4 h-4 text-white group-hover:text-[#115d5a]" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#E7C873] transition-colors">
                <FiTwitter className="w-4 h-4 text-white group-hover:text-[#115d5a]" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#E7C873] transition-colors">
                <FiInstagram className="w-4 h-4 text-white group-hover:text-[#115d5a]" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#E7C873] transition-colors">
                <FiYoutube className="w-4 h-4 text-white group-hover:text-[#115d5a]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-2 text-[#E7C873]">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to="/" className="text-white hover:text-[#E7C873] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/travel" className="text-white hover:text-[#E7C873] transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-[#E7C873] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white hover:text-[#E7C873] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-semibold mb-2 text-[#E7C873]">Contact</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <FiMapPin className="w-4 h-4 text-[#E7C873] mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-white">Damascus, Syria</p>
              </div>
              <div className="flex items-center">
                <FiPhone className="w-4 h-4 text-[#E7C873] mr-2 flex-shrink-0" />
                <p className="text-white">+963 11 123 4567</p>
              </div>
              <div className="flex items-center">
                <FiMail className="w-4 h-4 text-[#E7C873] mr-2 flex-shrink-0" />
                <p className="text-white">info@syriatravel.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#E7C873] mt-4 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2 text-xs text-[#E7C873]">
              <span>&copy; 2024 Syria Travel. All rights reserved.</span>
              <div className="flex items-center">
                <span>Made with</span>
                <FiHeart className="w-3 h-3 text-red-500 mx-1" />
                <span>in Syria</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <a href="#" className="text-[#E7C873] hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-[#E7C873] hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Scroll to Top Button */}
      {showScroll && (
      <button
        onClick={scrollToTop}
          className="fixed bottom-4 right-4 w-9 h-9 bg-[#E7C873] text-[#115d5a] rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:scale-110 z-50"
          aria-label="Scroll to top"
      >
          <FiArrowUp className="w-5 h-5" />
      </button>
      )}
    </footer>
  );
};

export default Footer;
