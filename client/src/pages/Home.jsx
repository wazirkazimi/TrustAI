import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ScanLine, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';

const categories = [
  { name: 'Instant Food', emoji: '🍜', q: 'instant noodles' },
  { name: 'Munchies',     emoji: '🍿', q: 'chips snacks' },
  { name: 'Dairy',        emoji: '🥛', q: 'amul dairy' },
  { name: 'Chocolates',   emoji: '🍫', q: 'chocolate' },
  { name: 'Breakfast',    emoji: '🥣', q: 'breakfast cereals' },
  { name: 'Health',       emoji: '🌿', q: 'health food protein' },
  { name: 'Bakery',       emoji: '🍞', q: 'bread biscuits' },
  { name: 'Beverages',    emoji: '🥤', q: 'cold drinks juice' },
];

const trending = [
  { barcode: '3017620422003', name: 'Nutella Hazelnut Spread', brand: 'Ferrero', grade: 'E', gradeColor: 'bg-red-600', score: '1.8', scoreColor: 'text-red-600', img: 'https://images.unsplash.com/photo-1553456523-17211394c633?auto=format&fit=crop&w=200&q=80' },
  { barcode: '5449000000996', name: 'Coca-Cola', brand: 'The Coca-Cola Company', grade: 'E', gradeColor: 'bg-red-600', score: '1.2', scoreColor: 'text-red-600', img: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=200&q=80' },
  { barcode: '5000159461122', name: 'Kit Kat 4 Finger', brand: 'Nestle', grade: 'D', gradeColor: 'bg-orange-500', score: '2.8', scoreColor: 'text-orange-500', img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=200&q=80' },
  { barcode: '028400064057', name: "Lay's Classic Chips", brand: 'Frito-Lay', grade: 'D', gradeColor: 'bg-orange-500', score: '3.0', scoreColor: 'text-orange-500', img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=200&q=80' },
  { barcode: '038000845093', name: 'Pringles Original', brand: 'Kelloggs', grade: 'D', gradeColor: 'bg-orange-500', score: '2.5', scoreColor: 'text-orange-500', img: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=200&q=80' },
  { barcode: '070221007432', name: 'Oreo Chocolate Cookies', brand: 'Nabisco', grade: 'E', gradeColor: 'bg-red-600', score: '2.0', scoreColor: 'text-red-500', img: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=200&q=80' },
];

export default function Home() {
  const [searchQ, setSearchQ] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQ.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`);
    }
  };

  return (
    <PageWrapper className="bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white pt-12 pb-5 px-4 sm:px-6 rounded-b-3xl shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Hi there 👋</h1>
              <p className="text-gray-400 text-sm">Ready to make a smart food choice?</p>
            </div>
            <Link to="/scan"
              className="w-11 h-11 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/30">
              <ScanLine size={22} className="text-white"/>
            </Link>
          </div>

          {/* Live search bar */}
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-4 text-gray-400 z-10"/>
            <input
              type="text"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search products by name…"
              className="w-full bg-gray-100 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Scan CTA Banner */}
          <motion.div whileTap={{ scale: 0.98 }}>
            <Link to="/scan" className="block">
              <div className="bg-purple-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-purple-600/25 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full"/>
                <div className="absolute right-10 -bottom-8 w-24 h-24 bg-white/5 rounded-full"/>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black mb-1">Scan a Product</h2>
                    <p className="text-purple-200 text-sm">Verify FSSAI · Get Health Grade · See Additives</p>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <ScanLine size={32} className="text-purple-600"/>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Categories */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-black text-gray-900">Browse Categories</h2>
              <Link to="/search" className="text-purple-600 text-xs font-bold flex items-center gap-1">All <ArrowRight size={12}/></Link>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {categories.map((cat, i) => (
                <Link to={`/search?q=${encodeURIComponent(cat.q)}`} key={i}
                  className="flex flex-col items-center gap-2 group">
                  <div className="w-full aspect-square bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-2xl sm:text-3xl group-hover:border-purple-200 group-hover:shadow-md transition-all">
                    {cat.emoji}
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-500 text-center leading-tight">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Trending Products */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-black text-gray-900">Trending Products</h2>
              <Link to="/search" className="text-purple-600 text-xs font-bold flex items-center gap-1">Explore <ArrowRight size={12}/></Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {trending.map((p) => (
                <Link to={`/results/${p.barcode}`} key={p.barcode}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-100 transition-all group">
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2.5 relative">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <div className={`absolute top-2 right-2 ${p.gradeColor} w-7 h-7 rounded-lg flex items-center justify-center shadow-sm`}>
                      <span className="text-white font-black text-xs">{p.grade}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs leading-tight line-clamp-2 mb-0.5">{p.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">{p.brand}</p>
                  <p className={`text-xs font-black mt-1.5 ${p.scoreColor}`}>{p.score}/10 · {parseFloat(p.score) >= 7 ? 'Good' : parseFloat(p.score) >= 4 ? 'Okay' : 'Poor'}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick tip */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-5 text-white flex items-center gap-4">
            <div className="text-4xl flex-shrink-0">💡</div>
            <div>
              <p className="font-black text-base">Know Your Food</p>
              <p className="text-purple-200 text-xs mt-1 leading-relaxed">Tap any product to see its FSSAI status, additives, and health grade from 4 global systems.</p>
            </div>
            <Link to="/rating-system" className="bg-white text-purple-600 font-black text-xs px-4 py-2 rounded-xl flex-shrink-0 hover:bg-purple-50 transition-colors">
              Learn More
            </Link>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
