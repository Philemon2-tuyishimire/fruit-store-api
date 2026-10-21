import React from 'react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const fruitCategories = [
    { name: 'All', image: 'https://images.unsplash.com/photo-1519996521430-025c776c4a6b?w=200&auto=format&fit=crop&q=60' },
    { name: 'Tree Fruits', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=60' },
    { name: 'Tropical', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&auto=format&fit=crop&q=60' },
    { name: 'Citrus', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=200&auto=format&fit=crop&q=60' },
    { name: 'Berries', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&auto=format&fit=crop&q=60' },
  ];

  return (
    <div className="bg-white py-8 px-6 md:px-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6 tracking-wide">FRUIT CATEGORIES</h2>

        {/* Horizontal Category Scroll */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none items-center justify-start md:justify-between">
          {fruitCategories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <div
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className="flex flex-col items-center cursor-pointer group min-w-[110px]"
              >
                <div
                  className={`w-20 h-20 rounded-2xl overflow-hidden mb-3 p-1.5 border transition-all ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-md'
                      : 'border-gray-200 group-hover:border-emerald-400'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                  />
                </div>
                <span
                  className={`text-sm font-semibold tracking-wide text-center ${
                    isSelected ? 'text-emerald-700' : 'text-gray-700 group-hover:text-emerald-600'
                  }`}
                >
                  {cat.name}
                </span>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1"></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};