import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck, Users, Star, Globe, MessageCircle, Award } from 'lucide-react';

const stats = [['1M+','Downloads'],['50K+','Followers'],['150K+','Monthly Users'],['8000+','Reviews']];

const values = [
  { icon: ShieldCheck, title: 'Independent', color: 'bg-purple-100 text-purple-600', desc: 'No brand influence, no paid promotions. Our ratings are never swayed by advertisers or product sponsors.' },
  { icon: Star, title: 'Unbiased', color: 'bg-amber-100 text-amber-600', desc: 'Every rating is based solely on product labels and ingredient lists — nothing more, nothing less.' },
  { icon: Globe, title: 'Science-backed', color: 'bg-green-100 text-green-600', desc: 'Our methodology is reviewed by nutritionists and medical experts to ensure accuracy and credibility.' },
  { icon: Users, title: 'Community-driven', color: 'bg-blue-100 text-blue-600', desc: 'Built for and with Indian consumers. Your reports and feedback help us improve every day.' },
];

const team = [
  { name: 'Wazir Kazimi', role: 'Co-Founder & CEO', avatar: 'WK', color: 'bg-purple-600', badge: '🚀' },
  { name: 'Jyotsna Bannur', role: 'Co-Founder & Head of Nutrition', avatar: 'JB', color: 'bg-pink-500', badge: '🥗' },
  { name: 'Dr. Priya Sharma', role: 'Chief Nutritionist', avatar: 'PS', color: 'bg-blue-600', badge: '🩺' },
  { name: 'Rahul Mehta', role: 'Food Scientist', avatar: 'RM', color: 'bg-green-600', badge: '🔬' },
  { name: 'Ananya Singh', role: 'Medical Advisor', avatar: 'AS', color: 'bg-amber-500', badge: '💊' },
  { name: 'Vikram Joshi', role: 'Data & AI Engineer', avatar: 'VJ', color: 'bg-indigo-600', badge: '⚙️' },
];

export default function About() {
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
            <Link to="/about" className="text-sm font-semibold text-purple-600 border-b-2 border-purple-600 pb-0.5">About</Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-gray-600 hover:text-purple-600">How It Works</Link>
            <Link to="/rating-system" className="text-sm font-semibold text-gray-600 hover:text-purple-600">Rating System</Link>
          </div>
          <Link to="/home" className="bg-purple-600 text-white font-bold px-5 py-2 rounded-xl text-sm shadow-md hover:bg-purple-700 transition-colors">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6 bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <div className="inline-flex items-center bg-purple-100 border border-purple-200 px-4 py-1.5 rounded-full mb-6 text-purple-700 text-sm font-bold">Our Mission</div>
            <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-6">
              Independent.<br/><span className="text-purple-600">Unbiased.</span><br/>Science-backed.
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              FoodTrust AI is transforming the way Indian consumers choose packaged foods by offering clear, trustworthy, and science-backed insights on every product label.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(([v,l],i)=>(
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}} className="text-center">
              <p className="text-4xl font-black text-purple-600 mb-1">{v}</p>
              <p className="text-gray-500 font-medium text-sm">{l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">What We Stand For</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Four core principles that guide every rating, every decision, and every line of code we write.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v,i)=>{
              const Icon = v.icon;
              return (
                <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                  className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-100 transition-all">
                  <div className={`w-12 h-12 rounded-2xl ${v.color} flex items-center justify-center mb-4`}><Icon size={24}/></div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{opacity:0,x:-40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.5}}>
            <h2 className="text-4xl font-black mb-5">Why We Built<br/><span className="text-purple-600">FoodTrust AI</span></h2>
            <p className="text-gray-600 leading-relaxed mb-4">Most Indians can't decode complex nutrition labels. Brands use misleading claims like "healthy", "natural", and "fortified" to confuse consumers.</p>
            <p className="text-gray-600 leading-relaxed mb-4">We built FoodTrust AI to cut through that noise — using OCR scanning, FSSAI compliance verification, and 4 international grading standards.</p>
            <p className="text-gray-600 leading-relaxed mb-8"><strong>No brand influence. No paid promotions. Just pure science.</strong></p>
            <Link to="/rating-system" className="inline-flex items-center gap-2 bg-purple-600 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-purple-600/25 hover:bg-purple-700 transition-all">
              See How We Rate <ArrowRight size={18}/>
            </Link>
          </motion.div>
          <motion.div initial={{opacity:0,x:40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.5}}
            className="bg-purple-600 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-black mb-6">Our Approach</h3>
            {[
              { check: 'Independent', desc: 'No brand influence or paid promotions' },
              { check: 'Unbiased', desc: 'Ratings based only on product labels & ingredients' },
              { check: 'Science-backed', desc: 'Reviewed by nutritionists & medical experts' },
              { check: 'Transparent', desc: 'We explain every score clearly' },
              { check: 'Accessible', desc: 'Free for every Indian consumer' },
            ].map((item,i)=>(
              <div key={i} className="flex items-start gap-3 mb-4 last:mb-0">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={13} className="text-white"/>
                </div>
                <div><span className="font-bold text-white">{item.check}</span><span className="text-purple-200"> — {item.desc}</span></div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">The Experts Behind It</h2>
            <p className="text-gray-500">Built by passionate founders, powered by leading nutritionists and food scientists.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {team.map((t,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 text-center hover:shadow-md hover:border-purple-100 transition-all relative">
                {i < 2 && (
                  <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">FOUNDER</div>
                )}
                <div className={`w-14 h-14 ${t.color} rounded-2xl flex items-center justify-center text-white font-black text-lg mx-auto mb-3 shadow-sm`}>
                  {t.avatar}
                </div>
                <p className="text-lg mb-1">{t.badge}</p>
                <h3 className="font-black text-gray-900 text-xs mb-1 leading-tight">{t.name}</h3>
                <p className="text-[10px] text-gray-400 leading-tight">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-purple-600 text-center text-white">
        <h2 className="text-3xl font-black mb-3">Ready to make smarter food choices?</h2>
        <p className="text-purple-200 mb-8 max-w-md mx-auto">Join 1M+ Indians who trust FoodTrust AI for honest, science-backed food ratings.</p>
        <Link to="/home" className="inline-flex items-center gap-2 bg-white text-purple-600 font-black px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105">
          Start Scanning Free <ArrowRight size={18}/>
        </Link>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 text-center">
        <p className="text-sm">Built with ❤️ for India 🇮🇳 · © 2026 FoodTrust AI — By Wazir Kazimi & Jyotsna Bannur</p>
      </footer>
    </div>
  );
}
