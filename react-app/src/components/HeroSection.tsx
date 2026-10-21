import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <div className="bg-emerald-800 text-white py-12 px-6 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            HEALTHY AND FRESH FRUITS
          </h1>
          <p className="text-emerald-100 text-sm md:text-base mb-8 leading-relaxed">
            WE PRIDE OURSELVES ON PROVIDING A CURATED SELECTION OF THE FINEST, NUTRIENT-RICH FRUITS THAT CATER TO YOUR HEALTH-CONSCIOUS LIFESTYLE.
          </p>
          <button className="bg-white text-emerald-900 font-bold px-8 py-3 rounded-lg shadow-md hover:bg-emerald-50 transition-colors">
            SHOP FRUITS
          </button>
        </div>

        {/* Right Fresh Fruit Visual Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=700&auto=format&fit=crop&q=80"
            alt="Fresh Assorted Fruits"
            className="max-h-80 object-cover drop-shadow-xl rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
};