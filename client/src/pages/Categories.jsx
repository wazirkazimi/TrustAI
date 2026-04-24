import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Utensils, Zap, Coffee, Cookie, Wheat, Salad, Droplets } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';

const categories = [
  { name: 'Instant Food', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80', tag: 'instant-food', icon: Zap, color: 'bg-orange-50 text-orange-600' },
  { name: 'Munchies', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=200&q=80', tag: 'snacks', icon: Cookie, color: 'bg-yellow-50 text-yellow-600' },
  { name: 'Cakes & Bakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80', tag: 'bakery', icon: Utensils, color: 'bg-pink-50 text-pink-600' },
  { name: 'Dry Fruits, Oil & Masalas', image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=200&q=80', tag: 'pantry', icon: Droplets, color: 'bg-amber-50 text-amber-600' },
  { name: 'Rice, Atta & Dals', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80', tag: 'grains', icon: Wheat, color: 'bg-green-50 text-green-600' },
  { name: 'Tea & Coffee', image: 'https://images.unsplash.com/photo-1544787210-2213d4b2cc2c?auto=format&fit=crop&w=200&q=80', tag: 'beverages', icon: Coffee, color: 'bg-brown-50 text-amber-900' },
  { name: 'Supplements', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=200&q=80', tag: 'health', icon: Salad, color: 'bg-blue-50 text-blue-600' },
  { name: 'Biscuits', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=200&q=80', tag: 'biscuits', icon: Cookie, color: 'bg-red-50 text-red-600' },
];

const Categories = () => {
  return (
    <PageWrapper className="bg-gray-50 pb-24">
      <div className="bg-white pt-14 pb-8 px-6 rounded-b-3xl shadow-sm mb-6">
        <h1 className="text-2xl font-black text-gray-900">Food Categories</h1>
        <p className="text-gray-500 text-sm mt-1">Explore products by their health group</p>
      </div>

      <div className="px-6 grid grid-cols-1 gap-4">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link 
                to={`/search?q=${cat.tag}`}
                className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl overflow-hidden shadow-inner`}>
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{cat.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className={`p-1 rounded ${cat.color}`}>
                        <Icon size={12} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Browse All</span>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <ChevronRight size={20} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </PageWrapper>
  );
};

export default Categories;
