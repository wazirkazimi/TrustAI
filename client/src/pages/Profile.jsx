import { useState } from 'react';
import { ChevronRight, ScanLine, BookmarkIcon, AlertTriangle, LogOut, Heart, Zap } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';

const healthModes = [
  { id: 'default', label: 'Default', icon: '⚖️', desc: 'Balanced general scoring' },
  { id: 'weightLoss', label: 'Weight Loss', icon: '🔥', desc: 'Penalises high calories & fat' },
  { id: 'diabetic', label: 'Diabetic', icon: '🩺', desc: 'Strongly flags sugar content' },
  { id: 'gym', label: 'Gym Mode', icon: '💪', desc: 'Rewards protein, flags sugar' },
];

const Profile = () => {
  const [activeMode, setActiveMode] = useState('gym');
  const [isVeg, setIsVeg] = useState(true);

  return (
    <PageWrapper className="bg-gray-50">
      {/* Header */}
      <div className="bg-white pt-14 pb-8 px-6 rounded-b-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-violet-400 flex items-center justify-center text-white text-2xl font-black ring-4 ring-purple-100 shadow-lg">
            A
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Alex Kumar</h1>
            <p className="text-gray-500 text-sm">alex.kumar@gmail.com</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { label: 'Total Scans', value: '24' },
            { label: 'Bookmarks', value: '8' },
            { label: 'Reports', value: '2' },
          ].map((s, i) => (
            <div key={i} className="bg-purple-50 rounded-2xl py-3 px-3 text-center border border-purple-100">
              <p className="text-2xl font-black text-purple-700">{s.value}</p>
              <p className="text-[11px] text-purple-500 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6 pb-6">
        {/* Vegan Toggle */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Vegan / Vegetarian Only</h3>
            <p className="text-xs text-gray-400 mt-0.5">Show only plant-based products</p>
          </div>
          <button
            onClick={() => setIsVeg(!isVeg)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isVeg ? 'bg-green-500' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${isVeg ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Health Mode */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Health Mode</h3>
          <div className="grid grid-cols-2 gap-3">
            {healthModes.map(mode => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`text-left p-4 rounded-2xl border-2 transition-all ${activeMode === mode.id ? 'border-purple-600 bg-purple-50 shadow-lg shadow-purple-600/10' : 'border-gray-100 bg-white'}`}
              >
                <span className="text-2xl mb-2 block">{mode.icon}</span>
                <p className={`font-bold text-sm ${activeMode === mode.id ? 'text-purple-700' : 'text-gray-900'}`}>{mode.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{mode.desc}</p>
                {activeMode === mode.id && (
                  <div className="mt-2 w-2 h-2 rounded-full bg-purple-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {[
            { icon: ScanLine, label: 'Add a Product', color: 'text-blue-500' },
            { icon: Zap, label: 'Change My Plan', color: 'text-amber-500' },
            { icon: Heart, label: 'Change Dietary Allowances', color: 'text-red-500' },
            { icon: BookmarkIcon, label: 'Bookmarked Products', color: 'text-purple-600' },
            { icon: AlertTriangle, label: 'My Reports', color: 'text-orange-500' },
          ].map(({ icon: Icon, label, color }, i) => (
            <button key={i} className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">
                  <Icon size={18} className={color} />
                </div>
                <span className="text-sm font-semibold text-gray-800">{label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* Talk with Professionals */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Talk with Professionals</h3>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {[
              { name: 'Dr. Sarah', role: 'Nutritionist', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=150&q=80' },
              { name: 'Dr. Raj', role: 'Dietician', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80' },
              { name: 'Dr. Emily', role: 'Fitness Coach', img: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&w=150&q=80' },
            ].map((p, i) => (
              <div key={i} className="flex-shrink-0 bg-white p-3 rounded-2xl border border-gray-100 flex flex-col items-center text-center w-28 shadow-sm">
                <div className="w-14 h-14 rounded-full overflow-hidden mb-2 ring-2 ring-purple-100">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-bold text-gray-900">{p.name}</p>
                <p className="text-[10px] text-gray-500">{p.role}</p>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-red-100 text-red-500 font-bold text-sm bg-red-50 hover:bg-red-100 transition-colors">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </PageWrapper>
  );
};

export default Profile;
