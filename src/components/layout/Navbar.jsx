import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, User, ShoppingCart } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <h1 className="text-3xl font-bold text-green-600">
          BiteDiet 🥗
        </h1>

        <div className="hidden md:flex gap-8 text-lg font-medium">
          <Link to="/home" className="hover:text-green-600">Home</Link>
          <Link to="/search" className="hover:text-green-600">Search</Link>
          <Link to="/cookbook" className="hover:text-green-600">Cookbook</Link>
          <Link to="/profile" className="hover:text-green-600">Profile</Link>
          <Link to="/meal-planner" className="hover:text-green-600">Planner</Link>
          <Link to="/nutrition-dashboard" className="hover:text-green-600">Dashboard</Link>
        </div>

        <div className="flex gap-4 items-center">
          <Link to="/search">
            <Search className="cursor-pointer text-gray-600 hover:text-green-600 w-6 h-6" />
          </Link>
          <Link to="/cart">
            <ShoppingCart className="cursor-pointer text-gray-600 hover:text-green-600 w-6 h-6" />
          </Link>
          <Link to="/profile">
            <User className="cursor-pointer text-gray-600 hover:text-green-600 w-6 h-6" />
          </Link>
          <Menu className="md:hidden cursor-pointer text-gray-600 hover:text-green-600 w-6 h-6" onClick={() => setIsOpen(!isOpen)} />
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4 text-lg font-medium shadow-inner animate-fadeIn">
          <Link to="/home" onClick={() => setIsOpen(false)} className="hover:text-green-600 py-1">Home</Link>
          <Link to="/search" onClick={() => setIsOpen(false)} className="hover:text-green-600 py-1">Search</Link>
          <Link to="/cookbook" onClick={() => setIsOpen(false)} className="hover:text-green-600 py-1">Cookbook</Link>
          <Link to="/profile" onClick={() => setIsOpen(false)} className="hover:text-green-600 py-1">Profile</Link>
          <Link to="/meal-planner" onClick={() => setIsOpen(false)} className="hover:text-green-600 py-1">Planner</Link>
          <Link to="/nutrition-dashboard" onClick={() => setIsOpen(false)} className="hover:text-green-600 py-1">Dashboard</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;