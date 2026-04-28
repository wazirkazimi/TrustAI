import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, AlertTriangle, Zap } from 'lucide-react';

const scale = [
  { range:'4.1 – 5', label:'Excellent', bg:'bg-green-600',   bar:'w-full' },
  { range:'3.1 – 4', label:'Good',      bg:'bg-lime-500',    bar:'w-4/5' },
  { range:'2.1 – 3', label:'Okay',      bg:'bg-amber-400',   bar:'w-3/5' },
  { range:'1.1 – 2', label:'Poor',      bg:'bg-orange-500',  bar:'w-2/5' },
  { range:'0.1 – 1', label:'Very Poor', bg:'bg-red-600',     bar:'w-1/5' },
];
const components = [
  {
    num:'01', title:'Nutrition Profile',
    desc:'The foundation of our rating. We assess key nutrients relevant to the food category — both good and bad.',
    good:['Protein','Dietary Fiber','Essential Minerals'],
    bad:['Added Sugars','Sodium','Saturated Fat','Trans Fat'],
    note:'All assessments happen within the product\'s category. A biscuit is judged against other biscuits, not a bowl of curd.',
    color:'from-purple-500 to-purple-700',
  },
  {
    num:'02', title:'Ingredient Health Impact',
    desc:'Beyond nutrition facts, we analyze the ingredient list for harmful additives, artificial colors, and preservatives.',
    good:['Natural Ingredients','Whole Grains','Legumes'],
    bad:['Artificial Colors (e.g. Tartrazine)','Synthetic Preservatives','High-Fructose Corn Syrup'],
    note:'We flag each additive individually so you know exactly what to be concerned about.',
    color:'from-amber-400 to-orange-500',
  },
  {
    num:'03', title:'Processing Level',
    desc:'How much has this food been processed from its natural state? Heavily processed foods score lower regardless of nutrition.',
    good:['Minimally Processed','Whole Foods','Fermented'],
    bad:['Ultra-Processed','Reconstituted','Artificially Flavored'],
    note:'Ultra-processed foods are heavily penalized even if they appear nutritionally balanced on the label.',
    color:'from-blue-500 to-indigo-600',
  },
  {
    num:'04', title:'FSSAI Compliance',
    desc:'Is the product legally authorized for sale in India? We verify the 14-digit FSSAI license number against the FOSCOS database.',
    good:['Valid FSSAI License','Active registration','Complete label info'],
    bad:['Missing FSSAI number','Expired license','Unverified claims'],
    note:'Products with invalid or missing FSSAI numbers get flagged regardless of their nutrition score.',
    color:'from-green-500 to-emerald-600',
  },
];

const intl = [
  { flag:'🇪🇺', name:'Nutri-Score', desc:'European system grading A–E based on positive vs negative nutrients per 100g.', grades:['A','B','C','D','E'], colors:['bg-green-600','bg-lime-500','bg-amber-400','bg-orange-500','bg-red-600'] },
  { flag:'🇸🇬', name:'Nutri-Grade', desc:'Singapore\'s system grading A–D based on sugar & saturated fat content.', grades:['A','B','C','D'], colors:['bg-green-600','bg-lime-500','bg-amber-400','bg-red-600'] },
  { flag:'🇯🇵', name:'JP Balance Score', desc:'Japan-inspired macronutrient balance rating: Excellent / Good / Fair / Poor.', grades:['Excellent','Good','Fair','Poor'], colors:['bg-green-600','bg-lime-500','bg-amber-400','bg-red-600'] },
];

export default function RatingSystem() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center"><span className="text-white font-black text-xs">FT</span></div>
            <span className="font-black text-lg">FoodTrust <span className="text-purple-600">AI</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-purple-600">Home</Link>
            <Link to="/about" className="text-sm font-semibold text-gray-600 hover:text-purple-600">About</Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-gray-600 hover:text-purple-600">How It Works</Link>
            <Link to="/rating-system" className="text-sm font-semibold text-purple-600 border-b-2 border-purple-600 pb-0.5">Rating System</Link>
          </div>
          <Link to="/home" className="bg-purple-600 text-white font-bold px-5 py-2 rounded-xl text-sm shadow-md hover:bg-purple-700 transition-colors">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <div className="inline-flex items-center bg-purple-100 border border-purple-200 px-4 py-1.5 rounded-full mb-6 text-purple-700 text-sm font-bold">
              <Zap size={14} className="mr-1.5"/>FTRS — FoodTrust Rating System
            </div>
            <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-5">
              What is <span className="text-purple-600">FTRS?</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
              FoodTrust gives every packaged food a simple, science-backed rating from 0 to 5, so you can quickly understand how healthy it really is.
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Unlike front-of-pack marketing claims, the FoodTrust Rating System (FTRS) looks deeper — evaluating a product's nutrition profile, ingredient health impact, processing level, and presence of potentially harmful additives. It cuts through misleading claims and shows you the <strong>real health impact</strong> of what you're eating.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Rating Scale */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <motion.div initial={{opacity:0,x:-40}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
            <h2 className="text-3xl font-black mb-3">The Rating Scale</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">Our scale runs from 0 to 5. Every product gets a score based on 4 core components, giving you a fast, reliable signal on product healthiness.</p>
            <div className="space-y-3">
              {scale.map((s,i)=>(
                <div key={i} className="flex items-center gap-4">
                  <div className={`${s.bg} text-white font-black text-sm px-3 py-1.5 rounded-lg w-28 text-center flex-shrink-0`}>{s.label}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className={`${s.bg} h-full ${s.bar} rounded-full`}/>
                  </div>
                  <span className="text-xs text-gray-500 w-14 text-right font-mono">{s.range}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mock product card */}
          <motion.div initial={{opacity:0,x:40}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-xs mx-auto w-full">
            <div className="bg-purple-600 px-5 py-4">
              <p className="text-white/70 text-xs font-bold uppercase tracking-wider">FoodTrust Rating System</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-white font-black text-2xl">The Whole Truth<br/>Hazelnut Cocoa</p>
                <div className="bg-lime-400 px-3 py-2 rounded-xl text-center ml-3 flex-shrink-0">
                  <p className="text-white font-black text-xl">3.6</p>
                  <p className="text-white text-[10px] font-bold">/5 · Good</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">What Should Concern You 😮</p>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-700 flex items-center gap-1.5"><AlertTriangle size={14} className="text-orange-400"/>Processing Level</span>
                <span className="text-sm font-bold text-orange-500">Ultra-Processed</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-700">🧪 Total Fat</span>
                <span className="text-sm font-bold text-amber-500">14.78g</span>
              </div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3 mt-3">What You'll Like 😊</p>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-700 flex items-center gap-1.5"><Check size={14} className="text-green-500"/>Protein</span>
                <span className="text-sm font-bold text-green-500">15.67g</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-700 flex items-center gap-1.5"><Check size={14} className="text-green-500"/>Dietary Fiber</span>
                <span className="text-sm font-bold text-green-500">5.38g</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How do we rate — 4 components */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">How do we <span className="text-purple-600">rate?</span></h2>
            <p className="text-gray-500 max-w-xl mx-auto">The FoodTrust Rating System is based on four core components, each designed to reflect a different aspect of a packaged food's overall health impact.</p>
          </div>

          <div className="space-y-8">
            {components.map((c,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.1}}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className={`bg-gradient-to-r ${c.color} px-7 py-5 flex items-center gap-4`}>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white font-black text-xl">{c.num}</div>
                  <h3 className="text-xl font-black text-white">{c.title}</h3>
                </div>
                <div className="px-7 py-6 grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <p className="text-gray-600 leading-relaxed mb-3">{c.desc}</p>
                    <p className="text-xs text-gray-400 italic border-l-2 border-gray-200 pl-3">{c.note}</p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                    <p className="text-xs font-black text-green-700 uppercase tracking-wider mb-3">✅ Nutrients to Encourage</p>
                    {c.good.map((g,j)=><p key={j} className="text-sm text-green-700 font-medium py-1 flex items-center gap-2"><Check size={13}/>  {g}</p>)}
                  </div>
                  <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                    <p className="text-xs font-black text-red-700 uppercase tracking-wider mb-3">⚠️ Nutrients to Limit</p>
                    {c.bad.map((b,j)=><p key={j} className="text-sm text-red-700 font-medium py-1 flex items-center gap-2"><AlertTriangle size={13}/>  {b}</p>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* International grading systems */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">+ 3 International <span className="text-purple-600">Standards</span></h2>
            <p className="text-gray-500 max-w-lg mx-auto">In addition to our own FTRS, we overlay three globally recognized grading systems for a complete picture.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {intl.map((sys,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:shadow-md hover:border-purple-100 transition-all">
                <div className="text-3xl mb-3">{sys.flag}</div>
                <h3 className="font-black text-gray-900 text-lg mb-2">{sys.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{sys.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  {sys.grades.map((g,j)=>(
                    <div key={j} className={`${sys.colors[j]} text-white font-black px-3 py-1.5 rounded-lg text-sm shadow-sm`}>{g}</div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Combined summary */}
          <div className="mt-10 bg-purple-600 rounded-3xl p-8 text-white text-center">
            <h3 className="text-2xl font-black mb-3">All 4 Grades. One Scan.</h3>
            <p className="text-purple-200 max-w-lg mx-auto mb-6">FoodTrust AI is the only platform that combines FTRS + Nutri-Score + Nutri-Grade + JP Balance Score in a single scan — giving you the most comprehensive food health rating available anywhere.</p>
            <Link to="/scan" className="inline-flex items-center gap-2 bg-white text-purple-600 font-black px-8 py-3.5 rounded-2xl shadow-xl hover:scale-105 transition-transform">
              Scan Your First Product <ArrowRight size={18}/>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 text-center">
        <p className="text-sm">Built with ❤️ for India 🇮🇳 · © 2026 FoodTrust AI</p>
      </footer>
    </div>
  );
}
