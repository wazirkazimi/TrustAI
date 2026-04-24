import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share2, Heart, ShieldCheck, AlertTriangle, ChevronRight, AlertCircle, Zap, Droplets, Dumbbell, Leaf } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import PageWrapper from '../components/layout/PageWrapper';

ChartJS.register(ArcElement, Tooltip);

const product = {
  name: 'Spicy Korean Soup Noodles',
  brand: 'Samyang Foods',
  fssai: '10012011000168',
  fssaiValid: true,
  isVeg: false,
  image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
  score: 2.5,
  rating: 'Poor',
  nutriScore: 'D',
  nutriGrade: 'C',
  japanese: 'Fair',
  concerns: [
    { icon: '⚠️', label: 'Processing Level', value: 'Ultra-Processed', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
    { icon: '🧪', label: 'Additives', value: '4 detected', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
    { icon: '⚡', label: 'Energy', value: '410 kcal / 100g', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    { icon: '🍭', label: 'Total Sugars', value: '3.1g (Low ✓)', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
  ],
  nutrition: [
    { name: 'Calories', value: 410, max: 500, unit: 'kcal', pct: 82, color: 'bg-red-500' },
    { name: 'Total Fat', value: 16, max: 30, unit: 'g', pct: 53, color: 'bg-orange-400' },
    { name: 'Saturated Fat', value: 7, max: 10, unit: 'g', pct: 70, color: 'bg-red-400' },
    { name: 'Sugars', value: 3.1, max: 25, unit: 'g', pct: 12, color: 'bg-green-500' },
    { name: 'Protein', value: 9, max: 20, unit: 'g', pct: 45, color: 'bg-blue-400' },
    { name: 'Sodium', value: 1780, max: 2300, unit: 'mg', pct: 77, color: 'bg-red-500' },
  ],
};

const scoreColor = (s) => {
  if (s >= 7) return { text: 'text-green-600', bg: 'bg-green-500', light: 'bg-green-50', badge: 'bg-green-500' };
  if (s >= 4) return { text: 'text-amber-600', bg: 'bg-amber-400', light: 'bg-amber-50', badge: 'bg-amber-400' };
  return { text: 'text-red-600', bg: 'bg-red-500', light: 'bg-red-50', badge: 'bg-red-500' };
};

const nutriScoreColor = (s) => ({
  A: 'bg-green-600', B: 'bg-lime-500', C: 'bg-amber-400', D: 'bg-orange-500', E: 'bg-red-600'
}[s] || 'bg-gray-400');

const Results = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [showModal, setShowModal] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const colors = scoreColor(product.score);

  const chartData = {
    datasets: [{
      data: [product.score, 10 - product.score],
      backgroundColor: [product.score >= 7 ? '#10B981' : product.score >= 4 ? '#F59E0B' : '#EF4444', '#F3F4F6'],
      borderWidth: 0,
      cutout: '78%',
    }],
  };

  return (
    <PageWrapper className="bg-gray-50 pb-32">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h2 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{product.name}</h2>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <Share2 size={18} className="text-gray-600" />
          </button>
          <button onClick={() => setBookmarked(b => !b)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <Heart size={18} className={bookmarked ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
          </button>
        </div>
      </div>

      {/* Product Hero */}
      <div className="bg-white pt-6 pb-4 px-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 shadow-sm">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {/* Veg/Non-veg indicator */}
              <div className={`w-5 h-5 border-2 ${product.isVeg ? 'border-green-500' : 'border-red-500'} rounded-sm flex items-center justify-center flex-shrink-0`}>
                <div className={`w-2.5 h-2.5 rounded-full ${product.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <h1 className="font-black text-gray-900 text-base leading-tight">{product.name}</h1>
            </div>
            <p className="text-xs text-gray-400 mb-3">{product.brand}</p>
            {/* FSSAI */}
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${product.fssaiValid ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <ShieldCheck size={13} />
              {product.fssaiValid ? 'FSSAI Verified' : 'FSSAI Unverified'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => setActiveTab('basic')}
            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'basic' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'bg-gray-100 text-gray-500'}`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab('foryou')}
            className={`flex-1 py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'foryou' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'bg-gray-100 text-gray-500'}`}
          >
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${activeTab === 'foryou' ? 'bg-white text-purple-600' : 'bg-purple-600 text-white'}`}>Plus</span>
            For You
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 pt-5 space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === 'basic' ? (
            <motion.div key="basic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">

              {/* FoodTrust Rating Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-600/30">
                  <span className="text-white font-black text-sm">FT</span>
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-900 text-sm">FoodTrust Rating</p>
                  <p className="text-xs text-gray-400 mt-0.5">Based on 4 global grading systems</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className={`${product.score >= 7 ? 'bg-green-500' : product.score >= 4 ? 'bg-amber-400' : 'bg-red-500'} px-3 py-1.5 rounded-xl shadow-sm`}>
                    <p className="text-white font-black text-base leading-none">{product.score}/10</p>
                  </div>
                  <p className={`text-xs font-bold mt-1 ${colors.text}`}>{product.rating}</p>
                </div>
              </div>

              {/* 4 Grade Badges */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Custom', val: `${product.score}`, sub: '/10', color: colors.badge },
                  { label: 'Nutri-Score', val: product.nutriScore, sub: '', color: nutriScoreColor(product.nutriScore) },
                  { label: 'Nutri-Grade', val: product.nutriGrade, sub: ' (SG)', color: 'bg-blue-500' },
                  { label: 'JP Balance', val: product.japanese, sub: '', color: 'bg-indigo-500' },
                ].map((g, i) => (
                  <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className={`${g.color} w-10 h-10 rounded-xl flex items-center justify-center mb-2 shadow-sm`}>
                      <span className="text-white font-black text-sm">{g.val.length > 2 ? g.val.slice(0,4) : g.val}</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-500 leading-tight">{g.label}</p>
                  </div>
                ))}
              </div>

              {/* Best Alternative Product (Added here as requested) */}
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-black text-purple-600 uppercase tracking-wider">Best Alternative</p>
                  <span className="bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">Highly Recommended</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1622484211148-71ee525d5022?auto=format&fit=crop&w=150&q=80" alt="Alternative" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-gray-900 text-sm">Oats & Honey Bar</p>
                    <p className="text-xs text-gray-500 mt-0.5">Energy Bar · 7.8/10 Score</p>
                  </div>
                  <button className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-600 border border-purple-100">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* What Should Concern You */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50">
                  <h3 className="font-black text-gray-900 text-sm">What Should Concern You 😮</h3>
                </div>
                {product.concerns.map((c, i) => (
                  <div key={i} className={`px-4 py-3 flex items-center justify-between ${i < product.concerns.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.icon}</span>
                      <span className="text-sm font-semibold text-gray-700">{c.label}</span>
                    </div>
                    <span className={`text-xs font-bold ${c.color}`}>{c.value}</span>
                  </div>
                ))}
              </div>

              {/* Nutrition Breakdown */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50">
                  <h3 className="font-black text-gray-900 text-sm">Nutrition per 100g</h3>
                </div>
                <div className="px-4 py-3 space-y-4">
                  {product.nutrition.map((n, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-semibold text-gray-700">{n.name}</span>
                        <span className="font-bold text-gray-900">{n.value}{n.unit}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className={`${n.color} h-2 rounded-full transition-all`} style={{ width: `${n.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          ) : (
            <motion.div key="foryou" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Health Match */}
              <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <AlertCircle size={22} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">This product <strong>may not match</strong> your health needs.</p>
                    <p className="text-xs text-gray-400 mt-1">Based on your Profile settings</p>
                  </div>
                </div>
              </div>

              {/* Condition cards */}
              {[
                { icon: Dumbbell, label: 'Health Goal', value: 'High sodium reduces score', color: 'text-red-500', good: false },
                { icon: Zap, label: 'Calorie Watch', value: 'High at 410 kcal / 100g', color: 'text-orange-500', good: false },
                { icon: Leaf, label: 'Dietary Preference', value: 'Non-vegetarian product', color: 'text-red-500', good: false },
                { icon: Droplets, label: 'Sugar Level', value: '3.1g — Low ✓', color: 'text-green-600', good: true },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.good ? 'bg-green-50' : 'bg-red-50'}`}>
                      <Icon size={18} className={item.color} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{item.label}</p>
                      <p className={`text-xs font-semibold mt-0.5 ${item.color}`}>{item.value}</p>
                    </div>
                    {item.good
                      ? <span className="text-green-500 text-sm">✓</span>
                      : <span className="text-red-400 text-sm">✗</span>}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Best Alternative Products - Show below tabs for both */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-gray-900 text-sm tracking-tight">Best Alternatives for You 💡</h3>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-wider">AI Suggested</span>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'Oats & Honey Bar', score: 7.8, img: 'https://images.unsplash.com/photo-1622484211148-71ee525d5022?auto=format&fit=crop&w=150&q=80', desc: 'High Protein · Low Sugar' },
              { name: 'Multigrain Roasted Snacks', score: 8.2, img: 'https://images.unsplash.com/photo-1599490659223-915224cc65b5?auto=format&fit=crop&w=150&q=80', desc: 'Zero Trans Fat · Baked' },
              { name: 'Sugar-Free Dark Chocolate', score: 7.1, img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=150&q=80', desc: '85% Cocoa · Stevia' }
            ].map((alt, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group cursor-pointer active:scale-[0.98]"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <img src={alt.img} alt={alt.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{alt.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{alt.desc}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="bg-green-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                      {alt.score}/10
                    </div>
                    <span className="text-[10px] font-bold text-green-600">Great Swap</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-purple-600 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 pb-10">
          <button className="flex-1 bg-purple-600 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-purple-600/20 text-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
            Save to Log
          </button>
          <a 
            href="https://foscos.fssai.gov.in/consumergrievance/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 bg-red-50 text-red-500 font-black py-4.5 rounded-2xl border border-red-100 text-sm flex items-center justify-center gap-2 hover:bg-red-100 active:scale-[0.98] transition-all"
          >
            Report to FSSAI
          </a>
        </div>
      </div>

      {/* Report Modal - Keeping it for internal reporting if needed, but primary is FSSAI link */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white w-full max-w-[430px] rounded-t-3xl p-6 pb-10"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
              <h3 className="text-xl font-black text-gray-900 mb-1">Internal Feedback</h3>
              <p className="text-sm text-gray-400 mb-5">Tell us what's wrong with this data.</p>
              <div className="space-y-3 mb-5">
                <textarea placeholder="Add details…" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-2xl">Cancel</button>
                <button onClick={() => setShowModal(false)} className="flex-1 py-3.5 bg-purple-600 text-white font-bold rounded-2xl shadow-lg">Submit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default Results;
