import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Sparkles, ShieldCheck, Heart, Zap, Info, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    goal: 'Balanced',
    dietaryAllowances: [],
    gradingSystem: 'FoodTrust (AI)',
    isVegan: 'No'
  });

  const goals = ['Weight Loss', 'Muscle Gain', 'Diabetic Friendly', 'Heart Healthy', 'Balanced'];
  const [expandedSystem, setExpandedSystem] = useState(null);

  const systems = [
    {
      id: 'FoodTrust (AI)',
      name: 'FoodTrust (AI)',
      desc: 'Our proprietary Indian-focused system.',
      details: 'Evaluates products based on 4 global standards, penalizing high sugar/fat and rewarding fiber/protein. Personalized to your metabolic profile (Diabetic, Gym, etc.).',
      icon: '🛡️'
    },
    {
      id: 'Nutri-Score',
      name: 'Nutri-Score',
      desc: 'European standard (A-E) grading.',
      details: 'Calculates a score based on calories, saturated fat, sugar, and sodium (negative) vs. fiber, protein, and fruit/veg content (positive).',
      icon: '📊'
    },
    {
      id: 'NOVA (Processing)',
      name: 'NOVA (Processing)',
      desc: 'Focuses on processing levels (1-4).',
      details: 'Grades foods from Minimally Processed (1) to Ultra-Processed (4). Essential for avoiding hidden industrial additives and chemicals.',
      icon: '🧪'
    },
    {
      id: 'Eco-Score',
      name: 'Eco-Score',
      desc: 'Environmental impact analysis.',
      details: 'Evaluates the carbon footprint, packaging recyclability, and sourcing ethics of the product to help you shop sustainably.',
      icon: '🌍'
    }
  ];

  const allergies = ['Peanuts', 'Dairy', 'Gluten', 'Soy', 'Shellfish', 'Sugar-Free'];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      await authRegister(formData);
      // After registration, we could also update health preferences
      // but authAPI.register already returns the user and sets state.
      // We can proceed to the welcome step.
      setStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleAllergy = (a) => {
    setFormData(prev => ({
      ...prev,
      dietaryAllowances: prev.dietaryAllowances.includes(a)
        ? prev.dietaryAllowances.filter(item => item !== a)
        : [...prev.dietaryAllowances, a]
    }));
  };

  const handleSystemClick = (id) => {
    setFormData({ ...formData, gradingSystem: id });
    setExpandedSystem(expandedSystem === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 selection:bg-purple-100 selection:text-purple-900">
      <div className="w-full max-w-md">

        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.3)]' : 'bg-gray-100'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">Create Account</h1>
                <p className="text-gray-500 font-medium">Let's get started with your basic details</p>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-purple-600/10 focus:bg-white outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-purple-600/10 focus:bg-white outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Create Password"
                  className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-purple-600/10 focus:bg-white outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <button
                onClick={handleNext}
                disabled={!formData.name || !formData.email || !formData.password}
                className="w-full bg-purple-600 text-white font-black py-5 rounded-3xl shadow-2xl shadow-purple-600/30 flex items-center justify-center gap-2 mt-8 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                Continue <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">Your Profile</h1>
                <p className="text-gray-500 font-medium">Personalize your health analysis</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black text-gray-400 ml-1 uppercase tracking-widest">Age</label>
                  <input
                    type="number"
                    placeholder="Enter your age"
                    className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-purple-600/10 focus:bg-white outline-none mt-2 font-bold text-gray-800"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-gray-400 ml-1 uppercase tracking-widest">Your Primary Goal</label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {goals.map(g => (
                      <button
                        key={g}
                        onClick={() => setFormData({ ...formData, goal: g })}
                        className={`py-4 rounded-2xl border-2 text-sm font-black transition-all ${formData.goal === g ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-lg shadow-purple-600/5' : 'border-gray-100 text-gray-400 bg-white hover:border-gray-200'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-green-50 rounded-[2.5rem] border border-green-100 shadow-sm shadow-green-100/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-green-100">🌱</div>
                    <div>
                      <p className="font-black text-gray-800 text-sm">Vegan Mode</p>
                      <p className="text-[10px] text-green-700 font-black uppercase opacity-60">Filters animal products</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, isVegan: formData.isVegan === 'Yes' ? 'No' : 'Yes' })}
                    className={`relative w-14 h-8 rounded-full transition-all duration-500 ${formData.isVegan === 'Yes' ? 'bg-green-600' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-500 ${formData.isVegan === 'Yes' ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={handleBack} className="flex-1 py-5 rounded-3xl font-black text-gray-400 bg-gray-50 border border-gray-100">Back</button>
                <button onClick={handleNext} className="flex-[2] bg-purple-600 text-white font-black py-5 rounded-3xl shadow-2xl shadow-purple-600/30 flex items-center justify-center gap-2">
                  Next Step <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">Grading System</h1>
                <p className="text-gray-500 font-medium">Click a card to see how it works</p>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="space-y-3 mt-2">
                    {systems.map(s => (
                      <motion.button
                        key={s.id}
                        layout
                        onClick={() => handleSystemClick(s.id)}
                        className={`w-full text-left overflow-hidden rounded-[2rem] border-2 transition-all duration-500 ${formData.gradingSystem === s.id ? 'border-purple-600 bg-purple-50 shadow-xl shadow-purple-600/10' : 'border-gray-50 bg-white hover:border-purple-200'}`}
                      >
                        <div className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${formData.gradingSystem === s.id ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                              {s.icon}
                            </div>
                            <div>
                              <p className={`font-black text-sm ${formData.gradingSystem === s.id ? 'text-purple-700' : 'text-gray-900'}`}>{s.name}</p>
                              <p className="text-[11px] text-gray-400 font-bold">{s.desc}</p>
                            </div>
                          </div>
                          {formData.gradingSystem === s.id && (
                            <div className="bg-purple-600 text-white p-1 rounded-full">
                              <Check size={14} strokeWidth={4} />
                            </div>
                          )}
                        </div>

                        <AnimatePresence>
                          {expandedSystem === s.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-5 pb-5 border-t border-purple-100 pt-4"
                            >
                              <p className="text-xs text-purple-600 font-bold leading-relaxed">
                                {s.details}
                              </p>
                              <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-purple-400 uppercase tracking-widest">
                                <Info size={12} /> Science-Backed Methodology
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-gray-400 ml-1 uppercase tracking-widest">Restrictions & Allergies</label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {allergies.map(a => (
                      <button
                        key={a}
                        onClick={() => toggleAllergy(a)}
                        className={`px-5 py-2.5 rounded-full border-2 text-[11px] font-black transition-all ${formData.dietaryAllowances.includes(a) ? 'border-red-500 bg-red-50 text-red-600 shadow-md shadow-red-500/10' : 'border-gray-50 text-gray-300 bg-white hover:border-gray-200'}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={handleBack} className="flex-1 py-5 rounded-3xl font-black text-gray-400 bg-gray-50 border border-gray-100">Back</button>
                <button 
                  onClick={handleFinalSubmit} 
                  disabled={loading}
                  className="flex-[2] bg-purple-600 text-white font-black py-5 rounded-3xl shadow-2xl shadow-purple-600/30 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>Complete Setup <Sparkles size={20} /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="text-center"
            >
              <div className="relative inline-block mb-10">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-28 h-28 bg-purple-100 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-inner"
                >
                  🚀
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-2 -right-2 bg-purple-600 text-white p-2 rounded-full shadow-lg"
                >
                  <Check size={20} strokeWidth={4} />
                </motion.div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter leading-tight">Welcome to the<br /><span className="text-purple-600">TrustAI Elite.</span></h1>
              <p className="text-gray-500 font-bold mb-12 max-w-sm mx-auto leading-relaxed">
                Your personalized transparency engine is primed and ready. Science is now on your side.
              </p>

              <div className="grid grid-cols-1 gap-4 text-left mb-12">
                {[
                  { icon: ShieldCheck, title: 'Verify FSSAI', desc: 'Scan any Indian product to check official compliance instantly.', color: 'bg-purple-600', light: 'bg-purple-50', border: 'border-purple-100' },
                  { icon: Heart, title: 'Health Scoring', desc: 'Ratings tailored to your diabetic or weight-loss goals.', color: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-100' },
                  { icon: Zap, title: 'Smart Swaps', desc: 'Get healthier local alternatives with one tap.', color: 'bg-amber-600', light: 'bg-amber-50', border: 'border-amber-100' }
                ].map((feat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className={`flex gap-4 p-5 ${feat.light} rounded-3xl border ${feat.border} hover:scale-[1.02] transition-transform`}
                  >
                    <div className={`w-12 h-12 ${feat.color} rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-lg`}>
                      <feat.icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-sm">{feat.title}</h3>
                      <p className="text-[11px] text-gray-500 mt-1 font-bold leading-relaxed">{feat.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/home')}
                className="w-full bg-gray-900 text-white font-black py-6 rounded-3xl shadow-2xl shadow-gray-900/20 flex items-center justify-center gap-3 text-lg"
              >
                Go to Dashboard <ArrowRight size={22} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Register;
