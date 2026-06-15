import { motion } from 'framer-motion';
import { PhoneCall, Star, Award, ShieldCheck, ChevronRight } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';

const experts = [
  {
    name: 'Wazir Kazimi',
    role: 'Co-Founder & CEO',
    exp: '10+ years',
    rating: '5.0',
    reviews: '1.2k',
    image: 'https://ui-avatars.com/api/?name=Wazir+Kazimi&background=9333ea&color=fff&size=200',
  },
  {
    name: 'Jyotsna Bannur',
    role: 'Co-Founder & Head of Nutrition',
    exp: '14 years',
    rating: '5.0',
    reviews: '520',
    specialties: ['Clinical Dietetics', 'Metabolic Syndrome', 'Wellness'],
    image: 'https://ui-avatars.com/api/?name=Jyotsna+Bannur&background=f59e0b&color=fff&size=200',
    price: '₹899/session',
  },
];

const Experts = () => {
  return (
    <PageWrapper className="bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-purple-600 pt-16 pb-12 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-black mb-2 leading-tight">Talk to an<br/>Expert</h1>
          <p className="text-purple-100 text-sm max-w-sm">
            Get personalized dietary advice and meal plans from certified nutritionists and dietitians.
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 -mt-6 relative z-20 space-y-4">
        {experts.map((expert, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-all group"
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-inner">
                <img src={expert.image} alt={expert.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-gray-900 text-base">{expert.name}</h3>
                    <p className="text-xs font-bold text-purple-600">{expert.role}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-xs font-black text-amber-700">{expert.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Award size={12} /> {expert.exp}</span>
                  <span className="flex items-center gap-1"><ShieldCheck size={12} /> Verified</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 mt-2 sm:mt-0 sm:border-l sm:border-gray-100 sm:pl-4 flex flex-col justify-between">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {expert.specialties.map((spec, j) => (
                  <span key={j} className="bg-gray-50 text-gray-600 border border-gray-100 text-[10px] font-bold px-2 py-1 rounded-lg">
                    {spec}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-xs font-black text-gray-900">{expert.price}</p>
                  <p className="text-[10px] text-gray-400">Audio/Video Call</p>
                </div>
                <button className="flex-shrink-0 bg-gray-900 text-white rounded-xl px-5 py-2.5 text-xs font-black flex items-center gap-2 hover:bg-purple-600 transition-colors shadow-lg active:scale-95">
                  <PhoneCall size={14} /> Connect
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
};

export default Experts;
