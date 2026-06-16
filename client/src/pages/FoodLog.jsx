import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { scanAPI, userAPI } from '../utils/api';
import { scoreColors, nutriScoreBg, calcCustomScore, calcNutriScore } from '../utils/gradingAlgorithms';
import { Calendar, ChevronRight, ScanLine, Loader2 } from 'lucide-react';

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const now = new Date();
  
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `Today, ${timeStr}`;
  if (isYesterday) return `Yesterday, ${timeStr}`;
  
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
}

const FoodLog = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [historyList, setHistoryList] = useState([]);
  const [bookmarksList, setBookmarksList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Today', 'This Week', 'Bookmarked'

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [historyRes, bookmarksRes] = await Promise.all([
          scanAPI.getHistory(),
          userAPI.getBookmarks()
        ]);
        setHistoryList(historyRes.data || []);
        setBookmarksList(bookmarksRes.data || []);
      } catch (err) {
        console.error('Error fetching food logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const filteredLogs = (() => {
    if (activeFilter === 'Bookmarked') {
      return bookmarksList;
    }
    
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return historyList.filter(item => {
      if (!item.created_at) return activeFilter === 'All';
      const createdDate = new Date(item.created_at);
      if (activeFilter === 'Today') {
        return createdDate >= startOfToday;
      }
      if (activeFilter === 'This Week') {
        return createdDate >= oneWeekAgo;
      }
      return true; // 'All'
    });
  })();

  return (
    <PageWrapper className="bg-gray-50">
      <div className="bg-white pt-14 pb-5 px-6 shadow-sm rounded-b-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Food Log</h1>
        <p className="text-gray-500 text-sm">Your scan history & bookmarks</p>

        <div className="flex gap-2 mt-4 overflow-x-auto hide-scrollbar">
          {['All', 'Today', 'This Week', 'Bookmarked'].map((f) => (
            <button 
              key={f} 
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all 
                ${activeFilter === f 
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/15' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pt-6 space-y-4 pb-24">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {activeFilter === 'Bookmarked' ? 'Bookmarks' : 'Recent Scans'}
        </p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 size={40} className="animate-spin text-purple-600 mb-4" />
            <p className="text-gray-400 font-medium text-xs">Loading logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <ScanLine size={28} className="text-purple-600" />
            </div>
            <p className="text-sm text-gray-900 font-black mb-1">No products found</p>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed mb-5 px-4">
              {activeFilter === 'Bookmarked' 
                ? "You haven't bookmarked any products yet."
                : `No products scanned ${activeFilter === 'All' ? 'yet' : activeFilter.toLowerCase()}.`}
            </p>
            <a href="/scan" className="inline-block bg-purple-600 text-white text-xs font-black px-6 py-3 rounded-2xl shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-colors">
              Start Scanning
            </a>
          </div>
        ) : (
          filteredLogs.map(item => {
            const score = item.scores?.customScore || calcCustomScore(item.nutrition_data || {});
            const sc = scoreColors(score);
            const grade = item.scores?.nutriScore || calcNutriScore(item.nutrition_data || {});
            const gradeColor = nutriScoreBg(grade);

            return (
              <a 
                href={`/results/${item.id}`} 
                key={item.id} 
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-100 transition-all flex items-center gap-4 block group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-50 flex items-center justify-center">
                  {item.image_url 
                    ? (
                      <img 
                        src={item.image_url} 
                        alt={item.product_name || 'Product'} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'; }}
                      />
                    ) : (
                      <div className="text-2xl">🍱</div>
                    )
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-purple-600 transition-colors">
                    {item.product_name || 'Unknown Product'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={12} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-medium">{formatDate(item.created_at)}</span>
                  </div>
                  <div className={`inline-flex items-center mt-2 px-2 py-0.5 rounded-lg ${sc.light}`}>
                    <span className={`text-[10px] font-black ${sc.text}`}>{score !== 'N/A' ? `${score}/10` : 'N/A'} · {sc.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${gradeColor} flex items-center justify-center text-white font-black text-lg shadow-sm flex-shrink-0`}>
                    {grade}
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                </div>
              </a>
            );
          })
        )}
      </div>
    </PageWrapper>
  );
};

export default FoodLog;
