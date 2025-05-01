import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState("Delhi");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMenuOpen(false);
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  
  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="bg-white shadow-sm fixed top-0 w-full z-50">
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary font-poppins">Event<span className="text-secondary">Spot</span></span>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search for events, venues, cities..." 
                className="w-full py-2 px-4 rounded-full border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {/* Location Selector */}
            <div className="hidden md:flex items-center cursor-pointer">
              <i className="fas fa-map-marker-alt text-primary mr-1"></i>
              <span className="text-sm font-medium">{currentCity}</span>
              <i className="fas fa-chevron-down text-xs ml-1"></i>
            </div>

            {/* User Menu - Not Logged In */}
            {!isAuthenticated && (
              <div className="flex items-center">
                <button 
                  onClick={openModal}
                  className="text-sm font-medium py-1.5 px-4 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition"
                >
                  Login
                </button>
              </div>
            )}

            {/* User Menu - Logged In */}
            {isAuthenticated && user && (
              <div className="flex items-center space-x-3">
                <Link href="/notifications" className="text-sm hidden md:inline-block">
                  <i className="far fa-bell text-neutral-600 text-lg"></i>
                </Link>
                <div className="relative group cursor-pointer" onClick={toggleMenu}>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                      <span>{user.name.charAt(0)}</span>
                    </div>
                    <span className="ml-2 text-sm font-medium hidden md:inline">{user.name}</span>
                    <i className="fas fa-chevron-down text-xs ml-1 hidden md:inline"></i>
                  </div>
                  
                  {/* Dropdown menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Profile
                      </Link>
                      <Link href="/profile#bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Bookings
                      </Link>
                      <Link href="/profile#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </Link>
                      <div className="border-t border-gray-200"></div>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Search - Visible only on mobile */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search for events, venues..." 
              className="w-full py-2 px-4 rounded-full border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </header>
      
      <AuthModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Header;
