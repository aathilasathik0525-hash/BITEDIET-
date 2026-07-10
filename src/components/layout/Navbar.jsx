import { Menu, Search, User } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <h1 className="text-3xl font-bold text-green-600">
          BiteDiet 🥗
        </h1>

        <div className="hidden md:flex gap-8 text-lg font-medium">
          <a href="/home" className="hover:text-green-600">Home</a>
          <a href="/search" className="hover:text-green-600">Search</a>
          <a href="/cookbook" className="hover:text-green-600">Cookbook</a>
          <a href="/profile" className="hover:text-green-600">Profile</a>
        </div>

        <div className="flex gap-4">
          <Search className="cursor-pointer" />
          <User className="cursor-pointer" />
          <Menu className="md:hidden cursor-pointer" />
        </div>

      </div>
    </nav>
  );
}

export default Navbar;