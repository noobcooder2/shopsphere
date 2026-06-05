import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { emoji:'📱', label:'Electronics', desc:'Phones, Laptops, Gadgets & more', color:'from-blue-500/20 to-indigo-500/20', border:'border-blue-500/20' },
  { emoji:'👗', label:'Fashion',     desc:'Clothes, Shoes, Accessories',      color:'from-pink-500/20 to-rose-500/20',  border:'border-pink-500/20' },
  { emoji:'🏠', label:'Home',        desc:'Furniture, Kitchen, Décor',         color:'from-orange-500/20 to-amber-500/20', border:'border-orange-500/20' },
  { emoji:'⚽', label:'Sports',      desc:'Cricket, Fitness, Outdoor',         color:'from-green-500/20 to-emerald-500/20', border:'border-green-500/20' },
  { emoji:'📚', label:'Books',       desc:'Bestsellers, Self-help, Fiction',   color:'from-yellow-500/20 to-amber-500/20', border:'border-yellow-500/20' },
  { emoji:'💄', label:'Beauty',      desc:'Skincare, Makeup, Hair care',       color:'from-purple-500/20 to-pink-500/20',  border:'border-purple-500/20' },
];

export default function CategoriesPage() {
  const navigate = useNavigate();

  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">

        <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-2">
          All Categories
        </h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-10">
          Browse products by category
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map(({ emoji, label, desc, color, border }) => (
            <div key={label}
              onClick={() => navigate(`/products?category=${label}`)}
              className={`bg-gradient-to-br ${color} rounded-3xl p-8 cursor-pointer
                          border ${border} hover:scale-[1.02] transition-all duration-300
                          hover:shadow-xl group`}>
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {emoji}
              </div>
              <h3 className="text-[18px] font-medium text-gray-900 dark:text-white mb-1">
                {label}
              </h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-4">{desc}</p>
              <span className="text-[12px] text-primary font-medium flex items-center gap-1">
                Shop now →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}