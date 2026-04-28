import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, ShieldCheck, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');

    setLoading(true);
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 selection:bg-purple-100 selection:text-purple-900">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-[2rem] text-white mb-6 shadow-xl shadow-purple-600/20"
          >
            <ShieldCheck size={40} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">Welcome Back</h1>
          <p className="text-gray-500 font-medium">Continue your health journey with TrustAI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-purple-600/10 focus:bg-white outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-purple-600/10 focus:bg-white outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end px-2">
            <button type="button" className="text-xs font-black text-purple-600 uppercase tracking-widest hover:opacity-70 transition-opacity">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-black py-5 rounded-3xl shadow-2xl shadow-purple-600/30 flex items-center justify-center gap-2 mt-4 active:scale-95 transition-all disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>Sign In <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <p className="text-center mt-12 text-gray-500 font-bold">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-600 hover:underline">
            Register Now
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
