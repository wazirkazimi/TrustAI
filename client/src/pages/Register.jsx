import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Sparkles, ShieldCheck, Heart, Zap, Info } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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
  const systems = ['FoodTrust (AI)', 'Nutri-Score', 'NOVA (Processing)', 'Eco-Score'];
  const allergies = ['Peanuts', 'Dairy', 'Gluten', 'Soy', 'Shellfish', 'Sugar-Free'];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const toggleAllergy = (a) => {
    setFormData(prev => ({
      ...prev,
      dietaryAllowances: prev.dietaryAllowances.includes(a)
        ? prev.dietaryAllowances.filter(item => item !== a)
        : [...prev.dietaryAllowances, a]
    }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${step >= i ? 'bg-purple-600' : 'bg-gray-100'}`} />
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
                <h1 className="text-3xl font-black text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-500">Let's get started with your basic details</p>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
                <input 
                  type="password" 
                  placeholder="Create Password" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <button 
                onClick={handleNext}
                className="w-full bg-purple-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-purple-200 flex items-center justify-center gap-2 mt-8"
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
                <h1 className="text-3xl font-black text-gray-900 mb-2">Your Profile</h1>
                <p className="text-gray-500">Personalize your health analysis</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-gray-700 ml-1">Age</label>
                  <input 
                    type="number" 
                    placeholder="Enter your age" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none mt-2"
                    value={formData.age}
                    onChange={e => setFormData({...formData, age: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 ml-1">Your Primary Goal</label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {goals.map(g => (
                      <button 
                        key={g}
                        onClick={() => setFormData({...formData, goal: g})}
                        className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${formData.goal === g ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-500'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 bg-green-50 rounded-[2rem] border border-green-100 shadow-sm shadow-green-100/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-green-100">🌱</div>
                    <div>
                      <p className="font-black text-gray-800 text-sm">Vegan Only?</p>
                      <p className="text-[11px] text-green-700 font-bold opacity-70">Filters animal-based products</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFormData({...formData, isVegan: formData.isVegan === 'Yes' ? 'No' : 'Yes'})}
                    className={`relative w-14 h-8 rounded-full transition-all duration-500 ${formData.isVegan === 'Yes' ? 'bg-green-600' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-500 ${formData.isVegan === 'Yes' ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={handleBack} className="flex-1 py-5 rounded-2xl font-bold text-gray-500 bg-gray-100">Back</button>
                <button onClick={handleNext} className="flex-[2] bg-purple-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-purple-200 flex items-center justify-center gap-2">
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
                <h1 className="text-3xl font-black text-gray-900 mb-2">Preferences</h1>
                <p className="text-gray-500">Fine-tune the algorithm</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-gray-700 ml-1">Preferred Grading System</label>
                  <div className="space-y-2 mt-2">
                    {systems.map(s => (
                      <button 
                        key={s}
                        onClick={() => setFormData({...formData, gradingSystem: s})}
                        className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${formData.gradingSystem === s ? 'border-purple-600 bg-purple-50 shadow-sm' : 'border-gray-100 bg-white'}`}
                      >
                        <span className={`font-bold ${formData.gradingSystem === s ? 'text-purple-700' : 'text-gray-700'}`}>{s}</span>
                        {formData.gradingSystem === s && <Check className="text-purple-600" size={20} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 ml-1">Dietary Restrictions / Allergies</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {allergies.map(a => (
                      <button 
                        key={a}
                        onClick={() => toggleAllergy(a)}
                        className={`px-4 py-2 rounded-full border-2 text-xs font-bold transition-all ${formData.dietaryAllowances.includes(a) ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={handleBack} className="flex-1 py-5 rounded-2xl font-bold text-gray-500 bg-gray-100">Back</button>
                <button onClick={handleNext} className="flex-[2] bg-purple-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-purple-200 flex items-center justify-center gap-2">
                  Complete Setup <Sparkles size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                🚀
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-4">Welcome to TrustAI!</h1>
              <p className="text-gray-500 mb-10 leading-relaxed">
                Your profile is ready. Here's how to use the app:
              </p>

              <div className="grid grid-cols-1 gap-4 text-left mb-10">
                <div className="flex gap-4 p-5 bg-purple-50 rounded-2xl border border-purple-100">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Scan & Verify</h3>
                    <p className="text-xs text-gray-500 mt-1">Scan barcodes to instantly verify FSSAI compliance and see hidden ingredients.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                    <Heart size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Personalized Scores</h3>
                    <p className="text-xs text-gray-500 mt-1">Products are rated based on YOUR specific health goals and metabolic profile.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Smart Swaps</h3>
                    <p className="text-xs text-gray-500 mt-1">If a product isn't healthy for you, we'll suggest the best local alternatives.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/home')}
                className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Register;
