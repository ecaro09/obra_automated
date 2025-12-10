import React from 'react';
import { ShoppingCart, Armchair, Plus } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onAddProductClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick, onAddProductClick }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Armchair className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 hidden sm:block">
              OBRA <span className="text-teal-600">Furniture</span>
            </span>
            <span className="font-bold text-xl tracking-tight text-slate-800 sm:hidden">
              OBRA
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAddProductClick}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-teal-600 transition-all duration-200 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Product</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            <button
              onClick={onCartClick}
              className="relative p-2 rounded-full hover:bg-slate-100 transition duration-200 group"
              aria-label="View Quotation"
            >
              <ShoppingCart className="h-6 w-6 text-slate-600 group-hover:text-teal-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full min-w-[1.25rem]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};