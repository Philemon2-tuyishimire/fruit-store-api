import React from 'react';
import { Bell, User, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navLinks = ['Home', 'About', 'Service', 'Product', 'Contact'];

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-xs">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('Home')}>
        <div className="bg-emerald-50 p-2 rounded-xl text-emerald-700">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <span className="font-bold text-xl text-gray-800 tracking-tight">FruitStore</span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <button
            key={link}
            onClick={() => setActiveTab(link)}
            className={`font-medium transition-colors ${
              activeTab === link
                ? 'text-emerald-700 font-semibold'
                : 'text-gray-600 hover:text-emerald-700'
            }`}
          >
            {link}
          </button>
        ))}
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};
