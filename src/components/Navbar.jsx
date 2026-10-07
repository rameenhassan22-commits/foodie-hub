import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartCount } from "../features/cart/cartSlice";

const Navbar = () => {
  const cartCount = useSelector(selectCartCount);
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-orange-500 text-white shadow-sm"
        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg text-base font-medium transition ${
      isActive
        ? "bg-orange-500 text-white"
        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link
          to="/"
          onClick={close}
          className="flex items-center gap-2 text-lg font-bold"
        >
          <span className="text-xl">🍔</span>
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            FoodieHub
          </span>
        </Link>

        {/* ===== DESKTOP LINKS (hidden on mobile) ===== */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/menu" className={linkClass}>Menu</NavLink>
          <NavLink to="/cart" className={linkClass}>
            <span className="flex items-center gap-1.5">
              🛒 Cart
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </span>
          </NavLink>
        </div>

        {/* ===== MOBILE: CART + HAMBURGER ===== */}
        <div className="flex md:hidden items-center gap-2">
          {/* Cart shortcut (always visible) */}
          <Link
            to="/cart"
            onClick={close}
            className="relative w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 hover:bg-orange-50"
          >
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 hover:bg-orange-50 transition"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              // X icon when open
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger (3 lines) when closed
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ===== MOBILE DROPDOWN MENU ===== */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          <NavLink to="/" className={mobileLinkClass} end onClick={close}>
            🏠 Home
          </NavLink>
          <NavLink to="/menu" className={mobileLinkClass} onClick={close}>
            📋 Menu
          </NavLink>
          <NavLink to="/cart" className={mobileLinkClass} onClick={close}>
            <span className="flex items-center justify-between">
              <span>🛒 Cart</span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {cartCount} items
                </span>
              )}
            </span>
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;