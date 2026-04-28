import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ScanLine, Star, ChevronRight, Menu, X, Check, ArrowRight } from 'lucide-react';

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">FT</span>
            </div>
            <span className="font-black text-lg text-gray-900">FoodTrust <span className="text-purple-600">AI</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-purple-600">Home</Link>
            <Link to="/about" className="text-sm font-semibold text-gray-600 hover:text-purple-600">About</Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-gray-600 hover:text-purple-600">How It Works</Link>
            <Link to="/rating-system" className="text-sm font-semibold text-gray-600 hover:text-purple-600">Rating System</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => setAuthMode('login')}
              className="text-sm font-bold text-purple-600 px-4 py-2 rounded-xl hover:bg-purple-50 transition-colors">
              Sign In
            </button>
            <button onClick={() => setAuthMode('register')}
              className="text-sm font-bold bg-purple-600 text-white px-5 py-2 rounded-xl shadow-md hover:bg-purple-700 transition-colors">
              Get Started Free
            </button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {menuOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-base font-semibold text-gray-700">Home</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="text-base font-semibold text-gray-700">About</Link>
            <Link to="/how-it-works" onClick={() => setMenuOpen(false)} className="text-base font-semibold text-gray-700">How It Works</Link>
            <Link to="/rating-system" onClick={() => setMenuOpen(false)} className="text-base font-semibold text-gray-700">Rating System</Link>
            <button onClick={() => { setAuthMode('login'); setMenuOpen(false); }}
              className="text-left text-base font-bold text-purple-600">Sign In</button>
            <button onClick={() => { setAuthMode('register'); setMenuOpen(false); }}
              className="w-full bg-purple-600 text-white font-bold py-3 rounded-2xl">Get Started Free</button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="pt-28 pb-20 px-4 sm:px-6 bg-gradient-to-br from-white via-purple-50 to-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
            <div className="inline-flex items-center bg-purple-100 border border-purple-200 px-3 py-1 rounded-full mb-5 text-purple-700 text-xs font-bold">
              🇮🇳 Built for India
            </div>
            <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-4">
              <span className="text-purple-600">Unbiased</span><br/>
              Ratings You<br/>Can Trust.
            </h1>
            <p className="text-xl font-bold text-gray-700 mb-3">No Brand Influence.<br/>Pure Science.</p>
            <p className="text-gray-500 text-base mb-8 max-w-md leading-relaxed">
              Scan any packaged food, verify FSSAI compliance, and get 4 international health grades — instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setAuthMode('register')}
                className="flex items-center justify-center gap-2 bg-purple-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-purple-600/30 hover:bg-purple-700 transition-all hover:scale-105 active:scale-95">
                Start Scanning Free <ArrowRight size={18}/>
              </button>
              <button onClick={() => scrollTo('how-it-works')}
                className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-bold px-8 py-4 rounded-2xl hover:border-purple-300 transition-colors">
                How it Works
              </button>
            </div>
            <div className="flex items-center gap-6 mt-10">
              {[['1M+','Downloads'],['50K+','Followers'],['8K+','Reviews']].map(([v,l])=>(
                <div key={l} className="text-center">
                  <p className="text-2xl font-black text-purple-600">{v}</p>
                  <p className="text-xs text-gray-500 font-medium">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero mock card */}
          <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{duration:0.6,delay:0.2}}
            className="flex justify-center">
            <div className="w-72 bg-white rounded-3xl shadow-2xl shadow-purple-100 border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-4 py-2.5 flex justify-between items-center">
                <span className="text-xs text-gray-400 font-mono">12:49</span>
                <span className="text-xs text-gray-400">← Share ⋮</span>
              </div>
              <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-50">
                <img src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=100&q=80"
                  className="w-12 h-12 rounded-xl object-cover" alt="" />
                <div>
                  <p className="font-bold text-sm text-gray-900">Spicy Korean Noodles</p>
                  <p className="text-xs text-gray-400">Instant Food</p>
                </div>
              </div>
              <div className="px-4 py-2 flex gap-2">
                <div className="flex-1 bg-purple-600 text-white text-xs font-bold py-1.5 rounded-full text-center">Basic Info</div>
                <div className="flex-1 bg-gray-100 text-gray-500 text-xs font-bold py-1.5 rounded-full text-center">For You</div>
              </div>
              <div className="mx-4 mb-3 bg-white rounded-2xl shadow border border-gray-100 p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-xs">FT</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-xs">FoodTrust Rating</p>
                  <p className="text-[10px] text-gray-400">Click to know more</p>
                </div>
                <div className="bg-amber-400 px-2 py-1 rounded-lg text-center">
                  <p className="text-white font-black text-sm">2.5/5</p>
                  <p className="text-white text-[9px] font-bold">Okay</p>
                </div>
              </div>
              <div className="px-4 pb-4">
                <p className="text-xs font-black text-gray-900 mb-2">What Should Concern You 😮</p>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-gray-700 flex items-center gap-1">⚠️ Processing Level</span>
                  <span className="text-xs font-bold text-red-500">Ultra-Processed</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-xs text-gray-700 flex items-center gap-1">🧪 Additives</span>
                  <span className="text-xs font-bold text-orange-500">4 detected</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-3">
              How it works — <span className="text-purple-600">3 easy steps</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">Getting started with FoodTrust AI is simple and quick. Follow these three steps to make informed, healthier choices.</p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-purple-100 -translate-x-1/2 hidden md:block"/>

            {[
              { num:'01', title:'Scan or Search', desc:'Scan the barcode of the product or simply search its name. Works on any packaged food sold in India.', img:'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=300&q=80', align:'left' },
              { num:'02', title:'See the FoodTrust Rating', desc:'FoodTrust Rating is independent, unbiased, and expert-backed. Understand why the product is rated so with concerns mentioned clearly.', img:'https://images.unsplash.com/photo-1622484211148-71ee525d5022?auto=format&fit=crop&w=300&q=80', align:'right' },
              { num:'03', title:'Discover Better Rated Products', desc:'Scroll further to find the better-rated products from the same category — healthier alternatives suggested instantly.', img:'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80', align:'left' },
            ].map((step, i) => (
              <motion.div key={i} initial={{opacity:0, x: step.align==='left'?-40:40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.5, delay:0.1}}
                className={`relative flex flex-col md:flex-row items-center gap-8 mb-16 ${step.align==='right' ? 'md:flex-row-reverse' : ''}`}>
                {/* Content */}
                <div className="flex-1 md:text-right">
                  {step.align === 'right' && <div className="md:text-left">
                    <h3 className="text-xl font-black text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed max-w-sm">{step.desc}</p>
                  </div>}
                  {step.align === 'left' && <>
                    <h3 className="text-xl font-black text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed max-w-sm ml-auto">{step.desc}</p>
                  </>}
                </div>
                {/* Number circle */}
                <div className="flex-shrink-0 z-10 w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-400/30">
                  <span className="font-black text-xl text-white">{step.num}</span>
                </div>
                {/* Image */}
                <div className="flex-1 flex justify-center">
                  <div className="w-48 h-32 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                    <img src={step.img} alt={step.title} className="w-full h-full object-cover"/>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-20 px-4 sm:px-6 bg-purple-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Left phone mock */}
          <motion.div initial={{opacity:0,x:-40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.5}}
            className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} className="text-white"/>
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm">Independent. Unbiased.</p>
                <p className="text-purple-600 font-bold text-xs">Science-backed</p>
              </div>
            </div>
            {[
              {label:'Independent', desc:'No brand influence or paid promotions'},
              {label:'Unbiased', desc:'Ratings based only on product labels & ingredients'},
              {label:'Science-backed', desc:'Verified by nutritionists & medical experts'},
            ].map((item,i)=>(
              <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={12} className="text-green-600"/>
                </div>
                <div>
                  <span className="font-bold text-gray-900 text-sm">{item.label}</span>
                  <span className="text-gray-500 text-sm"> — {item.desc}</span>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3 mt-5">
              {[['1M+','Downloads'],['50K+','Followers'],['150K+','MAU'],['8000+','Reviews']].map(([v,l])=>(
                <div key={l} className="bg-purple-50 rounded-2xl p-3 text-center border border-purple-100">
                  <p className="text-xl font-black text-purple-600">{v}</p>
                  <p className="text-xs text-gray-500 font-medium">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{opacity:0,x:40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.5}}>
            <h2 className="text-4xl font-black mb-4 leading-tight">
              Independent.<br/>Unbiased.<br/><span className="text-purple-600">Science-backed.</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">FoodTrust AI is transforming the way people choose packaged foods by offering clear, trustworthy, and science-backed insights on every product label.</p>
            <p className="text-gray-600 leading-relaxed mb-8">That's why a growing community trusts FoodTrust AI to navigate the complexities of labels and make better choices, every day.</p>
            <button onClick={() => setAuthMode('register')}
              className="flex items-center gap-2 bg-purple-600 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-purple-600/25 hover:bg-purple-700 transition-all">
              Join the Community <ArrowRight size={18}/>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── RATING GRADES ── */}
      <section id="rating-grades" className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">Four <span className="text-purple-600">Grading Systems</span></h2>
            <p className="text-gray-500 max-w-lg mx-auto">We combine 4 international standards to give you the most comprehensive food health rating available.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {[
              { emoji:'🏆', label:'Custom Score', scale:'0 – 10', color:'bg-purple-600', desc:'Our own algorithm combining sugar, fat, trans fat, calories & health-mode modifiers.' },
              { emoji:'🇪🇺', label:'Nutri-Score', scale:'A – E', color:'bg-green-600', desc:'European system. Grades A (best) to E (worst) using negative & positive nutrients.' },
              { emoji:'🇸🇬', label:'Nutri-Grade', scale:'A – D', color:'bg-blue-600', desc:'Singapore\'s sugar & saturated fat based grading system for packaged foods.' },
              { emoji:'🇯🇵', label:'JP Balance', scale:'Excellent–Poor', color:'bg-indigo-600', desc:'Japan-inspired macronutrient balance score measuring overall diet quality.' },
            ].map((g,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-100 transition-all">
                <div className={`${g.color} w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm`}>{g.emoji}</div>
                <h3 className="font-black text-gray-900 text-base mb-1">{g.label}</h3>
                <p className="text-xs font-bold text-purple-600 mb-2">Scale: {g.scale}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{g.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Nutri-Score visual */}
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">Nutri-Score Color Scale</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {[['A','bg-green-600'],['B','bg-lime-500'],['C','bg-amber-400'],['D','bg-orange-500'],['E','bg-red-600']].map(([g,c])=>(
                <div key={g} className={`${c} w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-sm`}>{g}</div>
              ))}
            </div>
          </div>

          {/* Personalized insights */}
          <div className="mt-12 bg-purple-600 rounded-3xl p-8 text-white grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-black mb-3">Personalized Insights For Your Health Needs</h3>
              <p className="text-purple-200 mb-5 leading-relaxed">FoodTrust AI factors in your diet, health conditions like diabetes, weight goals, and gym needs.</p>
              {['Personalized Flags — instantly know if a product suits you','Tailored Recommendations — find healthier alternatives','Health Modes — Diabetic, Gym, Weight Loss, Default'].map((f,i)=>(
                <div key={i} className="flex items-start gap-2 mb-2">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={11} className="text-white"/>
                  </div>
                  <p className="text-purple-100 text-sm">{f}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { mode:'🩺 Diabetic', desc:'Heavily flags sugar content' },
                { mode:'🔥 Weight Loss', desc:'Penalizes calories & fat' },
                { mode:'💪 Gym Mode', desc:'Rewards protein, flags sugar' },
                { mode:'⚖️ Default', desc:'Balanced general scoring' },
              ].map((m,i)=>(
                <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
                  <p className="font-bold text-white text-sm">{m.mode}</p>
                  <p className="text-purple-200 text-xs mt-1">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">FT</span>
            </div>
            <span className="font-black text-white">FoodTrust AI</span>
          </div>
          <p className="text-sm text-center">Built with ❤️ for India 🇮🇳 · MERN Stack · © 2026 FoodTrust AI</p>
          <button onClick={() => setAuthMode('register')}
            className="bg-purple-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-purple-700 transition-colors">
            Get Started Free
          </button>
        </div>
      </footer>

      {/* ── AUTH MODAL ── */}
      {authMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setAuthMode(null)}>
          <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:0.2}}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}>
            {/* Split header */}
            <div className="bg-purple-600 px-8 py-8 text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-xs">FT</span>
                </div>
                <span className="font-black text-lg">FoodTrust AI</span>
              </div>
              <h2 className="text-2xl font-black">{authMode === 'login' ? 'Welcome back 👋' : 'Create account 🎉'}</h2>
              <p className="text-purple-200 text-sm mt-1">{authMode === 'login' ? 'Sign in to your account' : 'Start scanning for free'}</p>
            </div>

            <div className="px-8 py-6">
              {authMode === 'register' && (
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Full Name</label>
                  <input type="text" placeholder="Alex Kumar"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"/>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Email</label>
                <input type="email" placeholder="alex@email.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"/>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Password</label>
                <input type="password" placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"/>
              </div>

              <Link to="/home" className="block w-full text-center bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-600/25 hover:bg-purple-700 transition-colors">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </Link>

              <p className="text-center text-sm text-gray-500 mt-5">
                {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-purple-600 font-bold hover:underline">
                  {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
