import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ScanLine, Star, Sparkles, Camera, Search, ShieldCheck, ChevronRight } from 'lucide-react';

const steps = [
  {
    num: '01', icon: Search, title: 'Scan or Search',
    desc: 'Scan the barcode of the product you\'re looking for, or simply search its name. Works on any packaged food sold in India.',
    details: ['Point your camera at any barcode','Or upload a photo of the label','Or just type the product name','We search 1M+ products instantly'],
    color: 'from-purple-500 to-purple-700', light: 'bg-purple-50 border-purple-100 text-purple-600',
  },
  {
    num: '02', icon: Star, title: 'See the FoodTrust Rating',
    desc: 'FoodTrust Rating is independent, unbiased, and expert-backed. Understand exactly why the product is rated so with concerns mentioned clearly.',
    details: ['Get a score from 0–10 instantly','See FSSAI compliance status','View processing level & additives','Understand what\'s good and bad'],
    color: 'from-amber-400 to-orange-500', light: 'bg-amber-50 border-amber-100 text-amber-600',
  },
  {
    num: '03', icon: Sparkles, title: 'Discover Better Options',
    desc: 'Scroll further to find the better-rated products from the same category — healthier alternatives suggested instantly, tailored to your health mode.',
    details: ['See healthier alternatives','Filtered to your dietary needs','Compare products side by side','Save favorites to your log'],
    color: 'from-green-500 to-emerald-600', light: 'bg-green-50 border-green-100 text-green-600',
  },
];

const features = [
  { icon: Camera, title: 'OCR Label Scanning', desc: 'Upload a photo of any nutrition label — our AI reads it and extracts all nutritional data automatically.' },
  { icon: ShieldCheck, title: 'FSSAI Verification', desc: 'Every product is cross-checked against the FSSAI FOSCOS database for compliance status.' },
  { icon: ScanLine, title: 'Barcode Lookup', desc: 'Scan or enter any barcode to instantly fetch product data from our 1M+ product database.' },
  { icon: Sparkles, title: 'Health Mode Scoring', desc: 'Switch between Diabetic, Gym, Weight Loss, or Default mode to get personalized ratings.' },
];

export default function HowItWorks() {
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
            <Link to="/how-it-works" className="text-sm font-semibold text-purple-600 border-b-2 border-purple-600 pb-0.5">How It Works</Link>
            <Link to="/rating-system" className="text-sm font-semibold text-gray-600 hover:text-purple-600">Rating System</Link>
          </div>
          <Link to="/home" className="bg-purple-600 text-white font-bold px-5 py-2 rounded-xl text-sm shadow-md hover:bg-purple-700 transition-colors">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 bg-gradient-to-br from-white via-purple-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <div className="inline-flex items-center bg-amber-100 border border-amber-200 px-4 py-1.5 rounded-full mb-6 text-amber-700 text-sm font-bold">3 Easy Steps</div>
            <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-5">
              How it works —<br/><span className="text-purple-600">3 easy steps</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Getting started with FoodTrust AI is simple and quick. Follow these three steps to make informed, healthier choices for you and your family.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps — Timeline */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Vertical line desktop */}
            <div className="absolute left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-200 via-amber-200 to-green-200 -translate-x-1/2 hidden md:block"/>

            {steps.map((step, i) => {
              const Icon = step.icon;
              const isRight = i % 2 !== 0;
              return (
                <motion.div key={i}
                  initial={{opacity:0, x: isRight ? 60 : -60}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.5, delay:0.1}}
                  className={`relative flex flex-col md:flex-row items-center gap-6 mb-20 ${isRight ? 'md:flex-row-reverse' : ''}`}>

                  {/* Content card */}
                  <div className="flex-1 w-full">
                    <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-100 transition-all">
                      <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${step.color} text-white px-4 py-1.5 rounded-full text-sm font-bold mb-4`}>
                        <Icon size={15}/> Step {step.num}
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-500 leading-relaxed mb-5">{step.desc}</p>
                      <div className="space-y-2">
                        {step.details.map((d,j)=>(
                          <div key={j} className={`flex items-center gap-2 text-sm font-medium ${step.light.split(' ')[2]} bg-transparent`}>
                            <ChevronRight size={14}/> {d}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Number bubble */}
                  <div className={`flex-shrink-0 z-10 w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-xl`}>
                    <span className="font-black text-2xl text-white">{step.num}</span>
                  </div>

                  {/* Visual side */}
                  <div className="flex-1 w-full flex justify-center">
                    <div className={`w-full max-w-xs rounded-3xl p-6 ${step.light} border`}>
                      <div className="flex items-center justify-center h-32">
                        <Icon size={64} className="opacity-20"/>
                      </div>
                      <p className="text-center font-bold text-sm mt-2">{step.title}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">Powerful <span className="text-purple-600">Features</span></h2>
            <p className="text-gray-500 max-w-lg mx-auto">Everything you need to make informed food choices, in one place.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f,i)=>{
              const Icon = f.icon;
              return (
                <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-100 transition-all text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600">
                    <Icon size={24}/>
                  </div>
                  <h3 className="font-black text-gray-900 text-sm mb-2">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Personalized Insights */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <motion.div initial={{opacity:0,x:-40}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
            <h2 className="text-4xl font-black mb-4 leading-tight">
              Personalized Insights<br/><span className="text-purple-600">For Your Health Needs</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              FoodTrust AI goes beyond general ratings, factoring in your diet, health conditions like diabetes, obesity, and more.
            </p>
            {[
              { t: 'Personalized Flags', d: 'Know instantly if a product suits your profile with clear flags on whether a product matches your health needs.' },
              { t: 'Tailored Recommendations', d: 'Find healthier alternatives personalized to your dietary goals and health conditions.' },
              { t: 'Advanced Health Modes', d: 'Switch between Diabetic, Gym, Weight Loss, and Default modes for tailored scoring.' },
            ].map((item,i)=>(
              <div key={i} className="flex items-start gap-3 mb-5">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-black">✓</span>
                </div>
                <div>
                  <p className="font-black text-gray-900">{item.t}</p>
                  <p className="text-gray-500 text-sm">{item.d}</p>
                </div>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{opacity:0,x:40}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
            className="grid grid-cols-2 gap-4">
            {[
              { mode:'🩺 Diabetic Mode', desc:'Aggressively flags high sugar content', color:'bg-red-50 border-red-100' },
              { mode:'💪 Gym Mode', desc:'Rewards protein, flags added sugar', color:'bg-blue-50 border-blue-100' },
              { mode:'🔥 Weight Loss', desc:'Penalizes excess calories and fat', color:'bg-amber-50 border-amber-100' },
              { mode:'⚖️ Default', desc:'Balanced general health scoring', color:'bg-purple-50 border-purple-100' },
            ].map((m,i)=>(
              <div key={i} className={`rounded-2xl p-5 border ${m.color}`}>
                <p className="font-black text-gray-900 text-sm mb-1.5">{m.mode}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
            <div className="col-span-2 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">✓</span>
              </div>
              <p className="font-bold text-green-800 text-sm">Good to go! This <strong>matches</strong> your health needs.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-purple-600 text-center text-white">
        <h2 className="text-3xl font-black mb-3">Try it now — it's free</h2>
        <p className="text-purple-200 mb-8 max-w-md mx-auto">Scan your first product in under 10 seconds.</p>
        <Link to="/scan" className="inline-flex items-center gap-2 bg-white text-purple-600 font-black px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105">
          Start Scanning <ArrowRight size={18}/>
        </Link>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 text-center">
        <p className="text-sm">Built with ❤️ for India 🇮🇳 · © 2026 FoodTrust AI</p>
      </footer>
    </div>
  );
}
