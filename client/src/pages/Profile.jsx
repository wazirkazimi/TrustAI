import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, ScanLine, BookmarkIcon, AlertTriangle, LogOut, Heart, Zap, Loader2 } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';

const healthModes = [
  { id: 'default', label: 'Default', icon: '⚖️', desc: 'Balanced general scoring' },
  { id: 'weightLoss', label: 'Weight Loss', icon: '🔥', desc: 'Penalises high calories & fat' },
  { id: 'diabetic', label: 'Diabetic', icon: '🩺', desc: 'Strongly flags sugar content' },
  { id: 'gym', label: 'Gym Mode', icon: '💪', desc: 'Rewards protein, flags sugar' },
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeMode, setActiveMode] = useState('default');
  const [isVeg, setIsVeg] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setActiveMode(res.data.healthMode || 'default');
        setIsVeg(res.data.vegFilter || false);
      } catch (err) {
        console.error('Profile fetch error:', err);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const updateMode = async (modeId) => {
    setActiveMode(modeId);
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/user/mode', { healthMode: modeId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Update mode error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const toggleVeg = async () => {
    const newVal = !isVeg;
    setIsVeg(newVal);
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/user/veg', { vegFilter: newVal }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Update veg error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="text-purple-600 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <PageWrapper className="bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white pt-14 pb-8 px-6 rounded-b-[2.5rem] shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-black ring-4 ring-purple-50 shadow-xl shadow-purple-600/20">
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight">{user?.name}</h1>
            <p className="text-gray-400 text-sm font-medium">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-8">
          {[
            { label: 'Total Scans', value: '24' },
            { label: 'Saved', value: user?.bookmarks?.length || 0 },
            { label: 'Reports', value: '2' },
          ].map((s, i) => (
            <div key={i} className="bg-purple-50/50 rounded-[1.5rem] py-4 px-3 text-center border border-purple-100/50">
              <p className="text-2xl font-black text-purple-700">{s.value}</p>
              <p className="text-[10px] text-purple-400 font-black uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6">
        {/* Vegan Toggle */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center justify-between group">
          <div>
            <h3 className="font-black text-gray-900 text-sm">Vegan / Vegetarian Mode</h3>
            <p className="text-xs text-gray-400 mt-1 font-medium">Auto-filter non-veg products</p>
          </div>
          <button
            onClick={toggleVeg}
            disabled={updating}
            className={`relative w-14 h-8 rounded-full transition-all duration-500 ${isVeg ? 'bg-green-600' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-500 ${isVeg ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Health Mode */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-black text-gray-900 text-sm tracking-tight">Personalized Health Mode</h3>
            {updating && <Loader2 size={14} className="text-purple-600 animate-spin" />}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {healthModes.map(mode => (
              <button
                key={mode.id}
                onClick={() => updateMode(mode.id)}
                disabled={updating}
                className={`text-left p-5 rounded-[2rem] border-2 transition-all duration-300 ${activeMode === mode.id ? 'border-purple-600 bg-purple-50 shadow-xl shadow-purple-600/10 scale-[1.02]' : 'border-gray-50 bg-white hover:border-purple-100'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm border transition-colors ${activeMode === mode.id ? 'bg-white border-purple-100' : 'bg-gray-50 border-gray-100'}`}>
                  {mode.icon}
                </div>
                <p className={`font-black text-sm mb-1 ${activeMode === mode.id ? 'text-purple-700' : 'text-gray-900'}`}>{mode.label}</p>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{mode.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          {[
            { icon: ScanLine, label: 'Full Scan History', color: 'text-blue-500' },
            { icon: Zap, label: 'Subscription Plan', color: 'text-amber-500' },
            { icon: Heart, label: 'Manage Allergies', color: 'text-red-500' },
            { icon: BookmarkIcon, label: 'Bookmarked Products', color: 'text-purple-600' },
            { icon: AlertTriangle, label: 'My Reports & Disputes', color: 'text-orange-500' },
          ].map(({ icon: Icon, label, color }, i) => (
            <button key={i} className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon size={20} className={color} />
                </div>
                <span className="text-sm font-black text-gray-800">{label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>

        {/* Support Section */}
        <div className="bg-gray-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
          <h3 className="text-lg font-black mb-1 relative z-10">Premium Support</h3>
          <p className="text-white/50 text-xs mb-5 font-medium relative z-10">Get 1-on-1 nutritional advice from professionals.</p>
          <div className="flex gap-3 relative z-10">
            {[
              { img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=150&q=80' },
              { img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80' },
              { img: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&w=150&q=80' },
            ].map((p, i) => (
              <div key={i} className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-800 ring-2 ring-purple-600/30">
                <img src={p.img} alt="Pro" className="w-full h-full object-cover" />
              </div>
            ))}
            <button className="flex-1 bg-white text-gray-900 rounded-full text-[11px] font-black uppercase tracking-wider py-3 hover:bg-purple-50 transition-colors">
              Chat Now
            </button>
          </div>
        </div>

        <button 
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] border-2 border-red-50 text-red-500 font-black text-sm bg-red-50/30 hover:bg-red-50 hover:border-red-100 transition-all active:scale-[0.98]"
        >
          <LogOut size={20} /> Sign Out of TrustAI
        </button>
      </div>
    </PageWrapper>
  );
};

export default Profile;
