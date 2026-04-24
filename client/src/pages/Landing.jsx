import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ScanLine, HeartPulse, Star, ArrowRight } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-white overflow-y-auto overflow-x-hidden selection:bg-purple-100 selection:text-purple-900">

      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background blobs for desktop */}
        <div className="hidden md:block absolute -top-24 -left-24 w-[30rem] h-[30rem] bg-purple-100 rounded-full blur-[100px] opacity-40 animate-pulse" />
        <div className="absolute -bottom-20 right-0 w-64 md:w-[40rem] md:h-[40rem] h-64 bg-purple-600 rounded-full blur-[120px] z-0 opacity-10 md:opacity-10 transition-all duration-1000" />

        <div className="max-w-7xl mx-auto px-6 pt-20 md:pt-0 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 text-center md:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center bg-purple-50 border border-purple-100 px-4 py-1.5 rounded-full mb-8">
              <span className="text-purple-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">🇮🇳 Made with Science for India</span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black text-purple-600 leading-[0.9] mb-6 tracking-tighter">
              Unbiased Ratings<br />
              <span className="text-gray-900">You Can Trust.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl md:text-2xl font-bold text-gray-500 mt-3 mb-10 max-w-lg leading-relaxed">
              No Brand Influence. No Marketing Jargon. Just Pure Nutritional Science for your family.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-purple-600 text-white font-black py-5 px-10 rounded-2xl shadow-[0_20px_50px_rgba(124,58,237,0.3)] hover:shadow-[0_20px_60px_rgba(124,58,237,0.4)] transition-all hover:scale-105 active:scale-95 text-lg">
                Get Started Free <ArrowRight size={20} />
              </Link>
              <button className="w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-gray-100 font-black text-gray-900 hover:bg-gray-50 transition-all">
                How it Works
              </button>
            </motion.div>
          </motion.div>

          {/* Phone Mockup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="w-full max-w-[380px] md:max-w-[420px] relative group"
          >
            {/* Glow effect behind phone */}
            <div className="absolute inset-0 bg-purple-500 rounded-[3rem] blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity" />
            
            <div className="bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-gray-900 overflow-hidden relative aspect-[9/19.5]">
              {/* Phone header / Dynamic Island */}
              <div className="bg-gray-900 h-10 flex items-center justify-center relative">
                <div className="w-24 h-6 bg-black rounded-3xl absolute top-2" />
              </div>

              <div className="p-1 h-full overflow-y-auto hide-scrollbar bg-white">
                <div className="px-6 py-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-10 h-10 bg-gray-100 rounded-full" />
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full" />
                      <div className="w-8 h-8 bg-gray-100 rounded-full" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-purple-600 rounded-[2rem] p-6 text-white shadow-xl">
                      <p className="text-[10px] font-black uppercase opacity-60 mb-1">Live Scan</p>
                      <h3 className="text-xl font-black mb-4 leading-tight">Analyzing Maggi Noodles...</h3>
                      <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-white" />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🍜</div>
                        <div>
                          <p className="font-black text-gray-900">Result Found</p>
                          <p className="text-xs text-gray-400">Scan ID: #8829</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100">
                        <span className="text-sm font-bold text-gray-600">Health Score</span>
                        <span className="text-xl font-black text-red-500">2.5/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature Section: Swaps */}
      <div className="bg-gray-50 py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-5xl md:text-7xl font-black text-purple-600 leading-[0.9] mb-4 tracking-tighter">
                Healthier Swaps.<br />
                <span className="text-gray-900">Better You.</span>
              </h2>
              <p className="text-xl font-bold text-gray-500 mt-6 mb-10 max-w-md leading-relaxed">
                Our AI-driven recommendation engine suggests locally available alternatives that match your taste and health goals.
              </p>
            </motion.div>
          </div>

          <div className="flex-1 w-full flex flex-col gap-6 relative">
            {/* Connection line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-red-200 via-purple-200 to-green-200 hidden md:block" />

            {/* Bad product */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-red-100 flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner">🚫</div>
              <div className="flex-1">
                <h4 className="font-black text-gray-900 text-xl mb-1">Deep Fried Chips</h4>
                <p className="text-sm text-red-500 font-bold">High Saturated Fat · Additives</p>
              </div>
            </motion.div>

            {/* Good product */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-green-100 flex items-center gap-6 relative z-10 transform md:translate-x-12">
              <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner">✅</div>
              <div className="flex-1">
                <h4 className="font-black text-gray-900 text-xl mb-1">Vacuum Fried Veggies</h4>
                <p className="text-sm text-green-600 font-bold">Low Oil · Natural Fibers</p>
              </div>
              <div className="bg-green-500 text-white px-4 py-2 rounded-2xl font-black text-xs">8.9/10</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Personalization Section */}
      <div className="bg-white py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 order-2 md:order-1 relative">
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: '🩺', label: 'Diabetic', color: 'bg-blue-50 border-blue-100', text: 'text-blue-600' },
                { icon: '🔥', label: 'Weight Loss', color: 'bg-orange-50 border-orange-100', text: 'text-orange-600' },
                { icon: '💪', label: 'Gym Mode', color: 'bg-purple-50 border-purple-100', text: 'text-purple-600' },
                { icon: '🥗', label: 'Balanced', color: 'bg-green-50 border-green-100', text: 'text-green-600' },
              ].map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-[2.5rem] p-10 border-2 ${m.color} flex flex-col items-center text-center hover:shadow-2xl transition-all cursor-pointer group`}
                >
                  <span className="text-6xl mb-6 group-hover:scale-125 transition-transform">{m.icon}</span>
                  <span className={`text-xl font-black ${m.text}`}>{m.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex-1 order-1 md:order-2">
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.9] mb-6 tracking-tighter">
                Made For<br />
                <span className="text-purple-600">Your Body.</span>
              </h2>
              <p className="text-xl font-bold text-gray-500 mt-6 mb-12 max-w-md leading-relaxed">
                TrustAI personalizes nutrition scores based on your metabolic conditions, allergies, and lifestyle. One size does not fit all.
              </p>
              <Link to="/register" className="inline-flex items-center gap-3 text-purple-600 font-black text-lg group">
                Configure your profile <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-40 bg-gray-900 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-purple-600 opacity-10 blur-[150px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.85]">Join the Food<br />Revolution Today.</h2>
          <p className="text-gray-400 text-xl md:text-2xl font-bold mb-16 max-w-2xl mx-auto leading-relaxed">
            Stop guessing. Start knowing. Get unbiased science-backed food ratings instantly.
          </p>
          <Link to="/register" className="inline-flex items-center gap-4 bg-white text-gray-900 font-black py-6 px-14 rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all text-xl">
            Start Scanning Now <ArrowRight size={28} />
          </Link>
          <div className="mt-16 flex items-center justify-center gap-8">
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-gray-900 bg-gray-800" />)}
            </div>
            <p className="text-gray-500 font-bold">Joined by 10k+ health-conscious Indians</p>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Landing;
