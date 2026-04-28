import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ArrowLeft, Share2, Heart, ShieldCheck, AlertTriangle, ChevronRight, AlertCircle, Loader2, Zap, Droplets, Dumbbell, Leaf } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { computeAllGrades, scoreColors, nutriScoreBg } from '../utils/gradingAlgorithms';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const DEMO = {
  name: 'Spicy Korean Soup Noodles', brand: 'Samyang Foods',
  fssaiValid: true, isVeg: false,
  image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
  nutritionData: { calories: 410, fat: 16, saturatedFat: 7, transFat: 0.1, sugar: 3.1, protein: 9, fiber: 0.5, sodium: 1780 },
  processingLevel: 'Ultra-Processed', additives: ['E621', 'E635', 'E631', 'E330'],
};

function buildFromOFF(p) {
  const n = p.nutriments || {};
  return {
    name: p.product_name || p.product_name_en || 'Unknown Product',
    brand: p.brands || '',
    fssaiValid: false,
    isVeg: (p.labels || '').toLowerCase().includes('vegetarian'),
    image: p.image_url || p.image_front_url || '',
    nutritionData: {
      calories: n['energy-kcal_100g'] || 0,
      fat: n['fat_100g'] || 0,
      saturatedFat: n['saturated-fat_100g'] || 0,
      transFat: n['trans-fat_100g'] || 0,
      sugar: n['sugars_100g'] || 0,
      protein: n['proteins_100g'] || 0,
      fiber: n['fiber_100g'] || 0,
      sodium: n['sodium_100g'] ? n['sodium_100g'] * 1000 : 0,
    },
    processingLevel: detectProcessing(p),
    additives: (p.additives_tags || []).map(a => a.replace('en:', '').toUpperCase()),
    nutriscore: (p.nutriscore_grade || '').toUpperCase(),
  };
}

function detectProcessing(p) {
  const cats = (p.categories || '').toLowerCase();
  const ultra = ['instant', 'chips', 'candy', 'soda', 'carbonated', 'chocolate-bar'];
  const processed = ['bread', 'cheese', 'canned', 'preserved'];
  if (ultra.some(w => cats.includes(w))) return 'Ultra-Processed';
  if (processed.some(w => cats.includes(w))) return 'Processed';
  return 'Minimally Processed';
}

const processingColor = (level) => {
  if (level === 'Ultra-Processed') return { text: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' };
  if (level === 'Processed') return { text: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' };
  return { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' };
};

export default function Results() {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (scanId === 'demo-123') {
          setProduct(DEMO);
          return;
        }
        // Use backend proxy to avoid CORS
        const res = await axios.get(`${API}/search/product/${scanId}`, { timeout: 12000 });
        setProduct({
          name: res.data.productName || 'Unknown Product',
          brand: res.data.brand || '',
          fssaiValid: res.data.fssaiValid || false,
          isVeg: res.data.vegStatus === 'veg',
          image: res.data.imageUrl || '',
          nutritionData: res.data.nutritionData || DEMO.nutritionData,
          processingLevel: res.data.processingLevel || 'Unknown',
          additives: (res.data.additives || []).map(a => a.replace('en:', '').toUpperCase()),
        });
      } catch (err) {
        setProduct(DEMO);
        setError(err.response?.status === 404
          ? 'Product not found in database — showing demo data'
          : 'Could not reach server — showing demo data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [scanId]);

  if (loading) return (
    <PageWrapper className="bg-gray-50 flex items-center justify-center">
      <div className="text-center py-40">
        <Loader2 size={48} className="animate-spin text-purple-600 mx-auto mb-4"/>
        <p className="text-gray-500 font-medium">Fetching product data…</p>
      </div>
    </PageWrapper>
  );

  const nd = product.nutritionData;
  const grades = computeAllGrades(nd);
  const sc = scoreColors(grades.customScore);
  const pColor = processingColor(product.processingLevel);

  const nutritionRows = [
    { name: 'Calories', value: nd.calories, unit: 'kcal', max: 500, color: nd.calories > 300 ? 'bg-red-400' : 'bg-green-400' },
    { name: 'Total Fat', value: nd.fat, unit: 'g', max: 30, color: nd.fat > 15 ? 'bg-orange-400' : 'bg-green-400' },
    { name: 'Saturated Fat', value: nd.saturatedFat, unit: 'g', max: 10, color: nd.saturatedFat > 5 ? 'bg-red-400' : 'bg-amber-400' },
    { name: 'Sugars', value: nd.sugar, unit: 'g', max: 25, color: nd.sugar > 10 ? 'bg-red-400' : 'bg-green-400' },
    { name: 'Protein', value: nd.protein, unit: 'g', max: 20, color: 'bg-blue-400' },
    { name: 'Fiber', value: nd.fiber, unit: 'g', max: 5, color: 'bg-green-400' },
    { name: 'Sodium', value: Math.round(nd.sodium), unit: 'mg', max: 2300, color: nd.sodium > 600 ? 'bg-red-500' : 'bg-amber-400' },
  ];

  return (
    <PageWrapper className="bg-gray-50 pb-28">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={20} className="text-gray-700"/>
        </button>
        <h2 className="text-sm font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs">{product.name}</h2>
        <div className="flex gap-2">
          <button onClick={() => navigator.share?.({ title: product.name, url: window.location.href }).catch(() => {})}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <Share2 size={18} className="text-gray-600"/>
          </button>
          <button onClick={() => setBookmarked(b => !b)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <Heart size={18} className={bookmarked ? 'fill-red-500 text-red-500' : 'text-gray-600'}/>
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2 text-xs text-amber-700 font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Product hero */}
      <div className="bg-white pt-5 pb-4 px-4 sm:px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 shadow-sm">
              {product.image
                ? <img src={product.image} alt={product.name} className="w-full h-full object-cover"/>
                : <div className="w-full h-full flex items-center justify-center text-4xl">🍱</div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-5 h-5 border-2 ${product.isVeg ? 'border-green-500' : 'border-red-500'} rounded-sm flex items-center justify-center flex-shrink-0`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${product.isVeg ? 'bg-green-500' : 'bg-red-500'}`}/>
                </div>
                <h1 className="font-black text-gray-900 text-base leading-tight">{product.name}</h1>
              </div>
              {product.brand && <p className="text-xs text-gray-400 mb-2">{product.brand}</p>}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${product.fssaiValid ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                <ShieldCheck size={13}/>
                {product.fssaiValid ? 'FSSAI Verified' : 'FSSAI Unverified'}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mt-5">
            {['basic', 'foryou'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === tab ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25' : 'bg-gray-100 text-gray-500'}`}>
                {tab === 'basic' ? 'Basic Info' : <span className="flex items-center justify-center gap-2"><span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${activeTab === 'foryou' ? 'bg-white text-purple-600' : 'bg-purple-600 text-white'}`}>Plus</span>For You</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 sm:px-6 pt-5">
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'basic' ? (
              <motion.div key="basic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">

                {/* FoodTrust Rating */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-600/30">
                    <span className="text-white font-black text-sm">FT</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-gray-900 text-sm">FoodTrust Rating</p>
                    <p className="text-xs text-gray-400 mt-0.5">Based on 4 global grading systems</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`${sc.bg} px-3 py-1.5 rounded-xl shadow-sm`}>
                      <p className="text-white font-black text-base leading-none">{grades.customScore}/10</p>
                    </div>
                    <p className={`text-xs font-bold mt-1 ${sc.text}`}>{sc.label}</p>
                  </div>
                </div>

                {/* 4 Grade Badges */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Custom', val: `${grades.customScore}`, color: sc.bg },
                    { label: 'Nutri-Score', val: grades.nutriScore, color: nutriScoreBg(grades.nutriScore) },
                    { label: 'Nutri-Grade', val: grades.nutriGrade, color: 'bg-blue-500' },
                    { label: 'JP Balance', val: grades.japaneseGrade.slice(0, 4), color: 'bg-indigo-500' },
                  ].map((g, i) => (
                    <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                      <div className={`${g.color} w-10 h-10 rounded-xl flex items-center justify-center mb-2 shadow-sm`}>
                        <span className="text-white font-black text-sm">{g.val}</span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-500 leading-tight">{g.label}</p>
                    </div>
                  ))}
                </div>

                {/* Concerns */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <h3 className="font-black text-gray-900 text-sm">What Should Concern You 😮</h3>
                  </div>
                  <div className={`px-4 py-3 flex justify-between border-b border-gray-50 ${pColor.bg} ${pColor.border}`}>
                    <span className="text-sm font-semibold text-gray-700">⚠️ Processing Level</span>
                    <span className={`text-xs font-bold ${pColor.text}`}>{product.processingLevel}</span>
                  </div>
                  {product.additives.length > 0 && (
                    <div className="px-4 py-3 flex justify-between border-b border-gray-50">
                      <span className="text-sm font-semibold text-gray-700">🧪 Additives</span>
                      <span className="text-xs font-bold text-orange-500">{product.additives.length} detected</span>
                    </div>
                  )}
                  {nd.sodium > 600 && (
                    <div className="px-4 py-3 flex justify-between border-b border-gray-50">
                      <span className="text-sm font-semibold text-gray-700">🧂 Sodium</span>
                      <span className="text-xs font-bold text-red-500">{Math.round(nd.sodium)}mg — High</span>
                    </div>
                  )}
                  {nd.sugar > 10 && (
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm font-semibold text-gray-700">🍭 Total Sugars</span>
                      <span className="text-xs font-bold text-orange-500">{nd.sugar}g — High</span>
                    </div>
                  )}
                </div>

                {/* Additives list */}
                {product.additives.length > 0 && (
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
                    <p className="text-xs font-black text-orange-700 uppercase tracking-wider mb-2">Detected Additives</p>
                    <div className="flex flex-wrap gap-2">
                      {product.additives.slice(0, 8).map((a, i) => (
                        <span key={i} className="bg-white border border-orange-200 text-orange-600 text-xs font-bold px-2 py-1 rounded-lg">{a}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nutrition Breakdown */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <h3 className="font-black text-gray-900 text-sm">Nutrition per 100g</h3>
                  </div>
                  <div className="px-4 py-3 space-y-3">
                    {nutritionRows.map((n, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-gray-700">{n.name}</span>
                          <span className="font-bold text-gray-900">{n.value}{n.unit}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className={`${n.color} h-2 rounded-full`} style={{ width: `${Math.min((n.value / n.max) * 100, 100)}%` }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.div key="foryou" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className={`bg-white rounded-2xl shadow-sm border p-5 ${grades.customScore >= 7 ? 'border-green-100' : 'border-red-100'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${grades.customScore >= 7 ? 'bg-green-50' : 'bg-red-50'}`}>
                      <AlertCircle size={22} className={grades.customScore >= 7 ? 'text-green-500' : 'text-red-500'}/>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {grades.customScore >= 7 ? '✅ Good match for your health profile' : grades.customScore >= 4 ? '⚠️ Okay — consume in moderation' : '❌ Not recommended for regular consumption'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Based on your Default health mode</p>
                    </div>
                  </div>
                </div>

                {[
                  { icon: Zap, label: 'Calorie Level', value: `${nd.calories} kcal / 100g`, good: nd.calories < 300, color: nd.calories < 300 ? 'text-green-600' : 'text-red-500' },
                  { icon: Dumbbell, label: 'Protein Content', value: `${nd.protein}g`, good: nd.protein > 5, color: nd.protein > 5 ? 'text-green-600' : 'text-orange-500' },
                  { icon: Droplets, label: 'Sugar Level', value: `${nd.sugar}g`, good: nd.sugar < 5, color: nd.sugar < 5 ? 'text-green-600' : 'text-red-500' },
                  { icon: Leaf, label: 'Fiber Content', value: `${nd.fiber}g`, good: nd.fiber > 2, color: nd.fiber > 2 ? 'text-green-600' : 'text-orange-500' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.good ? 'bg-green-50' : 'bg-red-50'}`}>
                        <Icon size={18} className={item.color}/>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{item.label}</p>
                        <p className={`text-xs font-semibold mt-0.5 ${item.color}`}>{item.value}</p>
                      </div>
                      <span>{item.good ? '✅' : '❌'}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Alternatives */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-gray-900 text-sm">Better Alternatives 💡</h3>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase">AI Suggested</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Oats & Honey Bar', score: 7.8, img: 'https://images.unsplash.com/photo-1622484211148-71ee525d5022?auto=format&fit=crop&w=150&q=80', desc: 'High Protein · Low Sugar' },
                { name: 'Multigrain Snacks', score: 8.2, img: 'https://images.unsplash.com/photo-1599490659223-915224cc65b5?auto=format&fit=crop&w=150&q=80', desc: 'Zero Trans Fat · Baked' },
                { name: 'Dark Chocolate', score: 7.1, img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=150&q=80', desc: '85% Cocoa · Stevia' },
              ].map((alt, i) => (
                <div key={i} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md hover:border-purple-100 transition-all group">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img src={alt.img} alt={alt.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-xs truncate">{alt.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{alt.desc}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="bg-green-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">{alt.score}/10</span>
                      <span className="text-[10px] font-bold text-green-600">Great Swap</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-600 transition-colors flex-shrink-0"/>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 pb-8">
            <button className="flex-1 bg-purple-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-600/20 text-sm hover:bg-purple-700 transition-colors">
              Save to Log
            </button>
            <a href="https://foscos.fssai.gov.in/consumergrievance/" target="_blank" rel="noopener noreferrer"
              className="flex-1 bg-red-50 text-red-500 font-black py-4 rounded-2xl border border-red-100 text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
              Report to FSSAI
            </a>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
