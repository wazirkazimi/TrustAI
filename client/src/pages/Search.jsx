import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import PageWrapper from '../components/layout/PageWrapper';
import { Search as SearchIcon, Filter, Leaf, ScanLine, Star, ChevronRight, Loader2 } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Instant Food', 'Snacks', 'Dairy', 'Drinks', 'Biscuits', 'Bakery'];

  const fetchResults = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/search?q=${searchQuery}`);
      setResults(res.data.products || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      fetchResults(q);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 2) {
      const timer = setTimeout(() => {
        setSearchParams({ q: val });
        fetchResults(val);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  };

  return (
    <PageWrapper className="bg-gray-50 pb-24">
      <div className="bg-white pt-14 pb-5 px-6 shadow-sm border-b border-gray-100">
        <h1 className="text-2xl font-black text-gray-900 mb-1 leading-tight">Search Products</h1>
        <p className="text-gray-400 text-sm mb-5">Find nutrition science for any food</p>
        
        <div className="relative mb-5 group">
          <div className="absolute inset-0 bg-purple-600/5 rounded-2xl blur-lg group-focus-within:bg-purple-600/10 transition-all" />
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-4 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
            <input 
              type="text" 
              value={query}
              onChange={handleSearch}
              placeholder="Search e.g. Maggi, Oats, Lays..." 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:bg-white transition-all shadow-sm" 
            />
            {loading && <Loader2 className="absolute right-4 text-purple-600 animate-spin" size={20} />}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {categories.map((c) => (
            <button 
              key={c} 
              onClick={() => {
                setActiveCategory(c);
                if (c !== 'All') {
                  setSearchParams({ q: c });
                }
              }}
              className={`flex-shrink-0 px-5 py-2 rounded-xl text-xs font-bold border-2 transition-all ${activeCategory === c ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20' : 'bg-white text-gray-500 border-gray-100 hover:border-purple-200'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pt-6 space-y-4">
        {results.length > 0 ? (
          results.map((p, i) => (
            <Link 
              to={`/results/${p.barcode}`} 
              key={p.barcode || i} 
              className="bg-white rounded-[2rem] p-4 flex items-center shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-100 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-gray-50 flex-shrink-0 mr-4 shadow-inner">
                <img src={p.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'} alt={p.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 border-2 ${p.vegStatus === 'veg' ? 'bg-green-500 border-green-100' : 'bg-red-500 border-red-100'}`} />
                  <h3 className="font-black text-gray-900 text-sm truncate">{p.productName}</h3>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{p.brand || 'Unbranded'}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">FSSAI VERIFIED</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-purple-600 group-hover:text-white transition-all ml-2">
                <ChevronRight size={20} />
              </div>
            </Link>
          ))
        ) : query.length > 2 && !loading ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon size={32} className="text-gray-300" />
            </div>
            <h3 className="font-black text-gray-900 text-lg">No products found</h3>
            <p className="text-gray-400 text-sm px-10">Try searching for common Indian brands like Maggi, Amul or Haldirams.</p>
          </div>
        ) : !loading && (
          <div className="py-10">
            <h3 className="font-black text-gray-900 text-sm mb-4 px-1">Popular Searches</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Maggi Noodles', 'Amul Milk', 'Haldirams Chips', 'Britannia Biscuits'].map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => { setSearchParams({ q: s }); setQuery(s); fetchResults(s); }}
                  className="bg-white p-4 rounded-3xl border border-gray-100 text-left hover:border-purple-200 transition-all shadow-sm"
                >
                  <p className="text-xs font-bold text-gray-800">{s}</p>
                  <p className="text-[10px] text-purple-500 font-bold mt-1 uppercase">Scan Now →</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Search;
