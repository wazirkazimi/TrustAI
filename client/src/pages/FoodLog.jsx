import PageWrapper from '../components/layout/PageWrapper';
import { Calendar, Trash2, ChevronRight, ScanLine } from 'lucide-react';

const logs = [
  { id: '1', name: 'Maggi Masala Noodles', date: 'Today, 10:32 AM', score: 2.5, grade: 'D', rating: 'Poor', isVeg: true, mode: 'Default', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80', gradeColor: 'bg-red-500', textColor: 'text-red-600', bgLight: 'bg-red-50' },
  { id: '2', name: 'Oats & Honey Bar', date: 'Today, 8:10 AM', score: 7.8, grade: 'B', rating: 'Good', isVeg: true, mode: 'Gym Mode', image: 'https://images.unsplash.com/photo-1622484211148-71ee525d5022?auto=format&fit=crop&w=200&q=80', gradeColor: 'bg-green-500', textColor: 'text-green-600', bgLight: 'bg-green-50' },
  { id: '3', name: 'Lays Classic Salted', date: 'Yesterday, 4:00 PM', score: 3.1, grade: 'C', rating: 'Okay', isVeg: true, mode: 'Weight Loss', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=200&q=80', gradeColor: 'bg-amber-500', textColor: 'text-amber-600', bgLight: 'bg-amber-50' },
  { id: '4', name: 'Amul Gold Full Cream', date: 'Yesterday, 9:00 AM', score: 8.2, grade: 'A', rating: 'Excellent', isVeg: true, mode: 'Default', image: 'https://images.unsplash.com/photo-1563636619276-2f8e4c1f0bf0?auto=format&fit=crop&w=200&q=80', gradeColor: 'bg-green-600', textColor: 'text-green-700', bgLight: 'bg-green-50' },
];

const FoodLog = () => {
  return (
    <PageWrapper className="bg-gray-50">
      <div className="bg-white pt-14 pb-5 px-6 shadow-sm rounded-b-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Food Log</h1>
        <p className="text-gray-500 text-sm">Your scan history & bookmarks</p>

        <div className="flex gap-2 mt-4 overflow-x-auto hide-scrollbar">
          {['All', 'Today', 'This Week', 'Bookmarked'].map((f, i) => (
            <button key={i} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${i === 0 ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="px-6 pt-6 space-y-4 pb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent</p>

        {logs.map(item => (
          <a href={`/results/${item.id}`} key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-4 block">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={12} className="text-gray-400" />
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
              <div className={`inline-flex items-center mt-2 px-2 py-0.5 rounded-lg ${item.bgLight}`}>
                <span className={`text-xs font-bold ${item.textColor}`}>{item.score}/10 · {item.rating}</span>
              </div>
            </div>
            <div className={`w-10 h-10 rounded-xl ${item.gradeColor} flex items-center justify-center text-white font-black text-lg shadow-sm flex-shrink-0`}>
              {item.grade}
            </div>
          </a>
        ))}

        {/* Empty state hint */}
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <ScanLine size={28} className="text-purple-600" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Scan more products to grow your log</p>
          <a href="/scan" className="inline-block mt-3 bg-purple-600 text-white text-sm font-bold px-6 py-2.5 rounded-2xl shadow-lg shadow-purple-600/20">
            Start Scanning
          </a>
        </div>
      </div>
    </PageWrapper>
  );
};

export default FoodLog;
