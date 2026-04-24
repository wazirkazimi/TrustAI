import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ScanLine, ArrowRight, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';

const categories = [
  { name: 'Instant Food', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80', tag: 'instant-food' },
  { name: 'Munchies', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=200&q=80', tag: 'snacks' },
  { name: 'Cakes & Bakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80', tag: 'bakery' },
  { name: 'Dry Fruits, Oil & Masalas', image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=200&q=80', tag: 'pantry' },
  { name: 'Rice, Atta & Dals', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80', tag: 'grains' },
  { name: 'Tea & Coffee', image: 'https://images.unsplash.com/photo-1544787210-2213d4b2cc2c?auto=format&fit=crop&w=200&q=80', tag: 'beverages' },
  { name: 'Supplements', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=200&q=80', tag: 'health' },
  { name: 'Biscuits', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=200&q=80', tag: 'biscuits' },
];

const recentScans = [
  { id: '1', name: 'Maggi Masala Noodles', score: 2.5, rating: 'Poor', grade: 'D', gradeColor: 'bg-red-500', bgLight: 'bg-red-50', textColor: 'text-red-600', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80' },
  { id: '2', name: 'Oats & Honey Bar', score: 7.8, rating: 'Good', grade: 'B', gradeColor: 'bg-green-500', bgLight: 'bg-green-50', textColor: 'text-green-600', image: 'https://images.unsplash.com/photo-1622484211148-71ee525d5022?auto=format&fit=crop&w=200&q=80' },
  { id: '3', name: 'Lays Classic Salted', score: 3.1, rating: 'Okay', grade: 'C', gradeColor: 'bg-amber-400', bgLight: 'bg-amber-50', textColor: 'text-amber-600', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=200&q=80' },
];

const Home = () => {
  const [isVeg, setIsVeg] = useState(false);

  return (
    <PageWrapper className="bg-gray-50">
      {/* Header */}
      <div className="bg-white pt-12 pb-6 px-6 rounded-b-3xl shadow-sm">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Hi, Alex 👋</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVeg(!isVeg)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${isVeg ? 'bg-green-50 border-green-400 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
            >
              <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              VEGAN
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <Link to="/search" className="flex items-center bg-gray-100 rounded-2xl py-3.5 px-4 gap-3 hover:bg-gray-200 transition-colors">
          <Search size={18} className="text-gray-400" />
          <span className="text-sm text-gray-400">Search products by name…</span>
        </Link>
      </div>

      <div className="px-6 py-6 space-y-8">

        {/* Big Scan CTA */}
        <motion.div whileTap={{ scale: 0.97 }}>
          <Link to="/scan" className="block">
            <div className="bg-purple-600 rounded-3xl p-5 text-white shadow-xl shadow-purple-600/25 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full" />
              <div className="absolute -right-2 -bottom-6 w-20 h-20 bg-white/5 rounded-full" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black mb-1">Scan a Product</h2>
                  <p className="text-purple-200 text-xs">Verify FSSAI · Get Health Grade</p>
                </div>
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <ScanLine size={28} className="text-purple-600" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Categories */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-black text-gray-900">Browse Categories</h2>
            <button className="text-purple-600 text-xs font-bold flex items-center gap-1">All <ArrowRight size={12} /></button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-6 px-6">
            {categories.map((cat, i) => (
              <Link to={`/search?q=${cat.tag}`} key={i} className="flex flex-col items-center flex-shrink-0 gap-2">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] font-semibold text-gray-500">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Scans */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-black text-gray-900">Recent Scans</h2>
            <Link to="/log" className="text-purple-600 text-xs font-bold flex items-center gap-1">See All <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            {recentScans.map(p => (
              <Link to={`/results/${p.id}`} key={p.id}>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md transition-all">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{p.name}</h3>
                    <div className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-lg ${p.bgLight}`}>
                      <span className={`text-xs font-bold ${p.textColor}`}>{p.score}/10 · {p.rating}</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${p.gradeColor} flex items-center justify-center text-white font-black text-base shadow-sm flex-shrink-0`}>
                    {p.grade}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default Home;
