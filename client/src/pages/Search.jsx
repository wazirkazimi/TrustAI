import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import { Search as SearchIcon, ChevronRight, Loader2, X, TrendingUp } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const CATEGORIES = ['All', 'Instant Food', 'Snacks', 'Dairy', 'Biscuits', 'Chocolate', 'Beverages', 'Health Food'];
const POPULAR = [
  { label: 'Maggi Noodles', q: 'maggi noodles' },
  { label: 'Amul Milk', q: 'amul milk' },
  { label: 'Haldirams Chips', q: 'haldirams chips' },
  { label: 'Britannia Biscuits', q: 'britannia biscuits' },
  { label: 'Parle G', q: 'parle g' },
  { label: 'Lay\'s Classic', q: 'lays classic' },
];

const vegStatus = (product) => {
  const labels = (product.labels || '').toLowerCase();
  const ingredients = (product.ingredients_text || '').toLowerCase();
  const nonVeg = ['meat', 'chicken', 'beef', 'pork', 'fish', 'egg', 'gelatin', 'mutton'];
  if (labels.includes('vegetarian') || labels.includes('vegan')) return 'veg';
  if (nonVeg.some(k => ingredients.includes(k))) return 'nonveg';
  return 'unknown';
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchResults = useCallback(async (q, pg = 1, append = false) => {
    if (!q || q.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await axios.get(`${API}/search`, {
        params: { q: q.trim(), page: pg },
        timeout: 12000,
      });
      const prods = res.data.products || [];
      const mapped = prods
        .filter(p => p.productName)
        .map(p => ({
          barcode: p.barcode,
          name: p.productName,
          brand: p.brand || '',
          image: p.imageUrl || '',
          veg: p.vegStatus || 'unknown',
          nutriScore: '?',
          categories: p.categories || '',
        }));
      setResults(prev => append ? [...prev, ...mapped] : mapped);
      const count = res.data.count || 0;
      setTotal(count);
      setHasMore(pg * 20 < count);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    if (q.length >= 2) {
      setPage(1);
      fetchResults(q, 1, false);
    } else {
      setResults([]);
    }
  }, [searchParams, fetchResults]);

  const handleInput = (val) => {
    setQuery(val);
    const timer = setTimeout(() => {
      if (val.length >= 2) setSearchParams({ q: val });
      else setResults([]);
    }, 500);
    return () => clearTimeout(timer);
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    const q = cat === 'All' ? query : cat;
    setSearchParams({ q });
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchResults(query, next, true);
  };

  const nutriColor = (g) => ({
    A: 'bg-green-600 text-white', B: 'bg-lime-500 text-white',
    C: 'bg-amber-400 text-white', D: 'bg-orange-500 text-white',
    E: 'bg-red-600 text-white',
  }[g] || 'bg-gray-200 text-gray-600');

  return (
    <PageWrapper className="bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white pt-14 pb-4 px-4 sm:px-6 shadow-sm border-b border-gray-100">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Search Products</h1>
        <p className="text-gray-400 text-sm mb-4">Real nutrition data from Open Food Facts</p>

        {/* Search Input */}
        <div className="relative flex items-center mb-4">
          <SearchIcon className="absolute left-4 text-gray-400 z-10" size={18} />
          <input
            type="text"
            value={query}
            onChange={e => handleInput(e.target.value)}
            placeholder="Search e.g. Maggi, Amul, Haldirams…"
            className="w-full bg-gray-100 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:bg-white transition-all"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]); setSearchParams({}); }}
              className="absolute right-3 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          )}
          {loading && <Loader2 className="absolute right-3 text-purple-600 animate-spin" size={18} />}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => handleCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold border transition-all
                ${activeCategory === cat ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-5">
        <AnimatePresence mode="wait">
          {/* Results */}
          {results.length > 0 ? (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-400">{total.toLocaleString()} products found</p>
                <p className="text-xs text-gray-400">Showing {results.length}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {results.map((p, i) => (
                  <motion.div key={`${p.barcode}-${i}`}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <Link to={`/results/${p.barcode}`}
                      className="bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-100 transition-all group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.image
                          ? <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                          : <div className="w-full h-full flex items-center justify-center text-2xl bg-purple-50">🍱</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          {p.veg !== 'unknown' && (
                            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${p.veg === 'veg' ? 'bg-green-500' : 'bg-red-500'}`}/>
                          )}
                          <h3 className="font-black text-gray-900 text-xs truncate">{p.name}</h3>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5 truncate">{p.brand || 'Unbranded'}</p>
                        <div className="flex items-center gap-1.5">
                          {p.nutriScore !== '?' && (
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${nutriColor(p.nutriScore)}`}>
                              Nutri-{p.nutriScore}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-600 flex-shrink-0 transition-colors"/>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-6">
                  <button onClick={loadMore} disabled={loading}
                    className="bg-white border border-purple-200 text-purple-600 font-bold px-8 py-3 rounded-2xl text-sm shadow-sm hover:bg-purple-50 transition-colors disabled:opacity-50">
                    {loading ? <Loader2 size={16} className="animate-spin inline mr-2"/> : null}
                    Load More Products
                  </button>
                </div>
              )}
            </motion.div>
          ) : loading ? (
            <motion.div key="loading" className="py-20 text-center">
              <Loader2 size={40} className="animate-spin text-purple-600 mx-auto mb-4"/>
              <p className="text-gray-500 font-medium">Searching Open Food Facts…</p>
            </motion.div>
          ) : query.length >= 2 ? (
            <motion.div key="empty" className="py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🔍</div>
              <h3 className="font-black text-gray-900 text-lg mb-2">No products found</h3>
              <p className="text-gray-400 text-sm px-10">Try common Indian brands like Maggi, Amul, Haldirams or Parle.</p>
            </motion.div>
          ) : (
            // Default state — popular searches
            <motion.div key="default">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-purple-600"/>
                <h3 className="font-black text-gray-900 text-sm">Popular Searches</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {POPULAR.map((s, i) => (
                  <button key={i}
                    onClick={() => { setSearchParams({ q: s.q }); setQuery(s.q); }}
                    className="bg-white p-4 rounded-2xl border border-gray-100 text-left hover:border-purple-200 hover:shadow-sm transition-all shadow-sm group">
                    <p className="text-sm font-black text-gray-800 group-hover:text-purple-700 transition-colors">{s.label}</p>
                    <p className="text-[10px] text-purple-500 font-bold mt-1">Search →</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
