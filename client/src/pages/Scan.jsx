import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Barcode, UploadCloud, X, Camera, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import PageWrapper from '../components/layout/PageWrapper';

const tips = [
  '📸 Ensure the label is fully visible',
  '💡 Use good lighting for best results',
  '📐 Keep the camera straight on the label',
  '🔍 Capture both FSSAI mark & nutrition table',
];

const Scan = () => {
  const [activeTab, setActiveTab] = useState('image');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [barcode, setBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1,
  });

  const handleImageAnalyze = async () => {
    if (!file) return;
    setIsScanning(true);
    setError('');
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://localhost:5000/api/scan/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setScanDone(true);
      setTimeout(() => navigate(`/results/${res.data.scan._id}`), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze image. Please try again.');
      setIsScanning(false);
    }
  };

  const handleBarcodeAnalyze = async () => {
    if (!barcode) return;
    setIsScanning(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/scan/barcode', { barcode });
      setScanDone(true);
      setTimeout(() => navigate(`/results/${res.data.scan._id}`), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Product not found. Try another barcode.');
      setIsScanning(false);
    }
  };

  return (
    <PageWrapper className="bg-white pb-24">
      {/* Header */}
      <div className="bg-white pt-14 pb-4 px-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Verify Product</h1>
        <p className="text-gray-400 text-sm">Scan or upload to get health analysis</p>
      </div>

      {/* Tab Toggle */}
      <div className="px-6 mb-6">
        <div className="flex p-1 bg-gray-100 rounded-2xl relative">
          <div
            className="absolute top-1 bottom-1 bg-gray-900 rounded-xl shadow-sm transition-all duration-300 ease-out"
            style={{ width: 'calc(50% - 4px)', transform: activeTab === 'image' ? 'translateX(0)' : 'translateX(calc(100% + 4px))' }}
          />
          {[
            { id: 'image', icon: ImageIcon, label: 'Label Upload' },
            { id: 'barcode', icon: Barcode, label: 'Barcode Scan' },
          ].map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl z-10 relative transition-colors ${activeTab === id ? 'text-white' : 'text-gray-500'}`}>
              <Icon size={17} /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs font-bold flex items-center gap-2">
            <X size={14} /> {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'image' ? (
            <motion.div key="img" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }}>
              {!preview ? (
                <>
                  <div
                    {...getRootProps()}
                    className={`relative border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center min-h-[320px] cursor-pointer transition-all overflow-hidden
                      ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-gray-50 hover:border-purple-400 hover:bg-purple-50/50'}`}
                  >
                    <input {...getInputProps()} />
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragActive ? 'bg-purple-100' : 'bg-white shadow-md border border-gray-100'}`}>
                      <UploadCloud size={36} className={`transition-colors ${isDragActive ? 'text-purple-600' : 'text-gray-400'}`} />
                    </div>
                    <h3 className="text-base font-black text-gray-800 mb-1">
                      {isDragActive ? 'Drop it here!' : 'Upload product label'}
                    </h3>
                    <p className="text-xs text-gray-400 mb-6 text-center px-8 leading-relaxed">
                      Make sure nutrition facts & FSSAI logo are clearly visible in the photo.
                    </p>
                    <div className="bg-purple-600 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-lg shadow-purple-600/30">
                      Select Photo
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="mt-6 bg-purple-50 rounded-3xl p-5 border border-purple-100">
                    <p className="text-[10px] font-black text-purple-700 mb-3 uppercase tracking-widest">Expert Advice 💡</p>
                    <div className="space-y-2.5">
                      {tips.map((tip, i) => <p key={i} className="text-xs text-purple-600/80 font-bold flex gap-2"><span>•</span> {tip}</p>)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-5">
                  <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 bg-gray-900 min-h-[320px] flex items-center justify-center">
                    <img src={preview} alt="Preview" className="w-full object-contain max-h-[400px] opacity-80" />

                    <AnimatePresence>
                      {isScanning && !scanDone && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-gray-900/60 backdrop-blur-md z-10 flex flex-col items-center justify-center">
                          <motion.div
                            initial={{ top: '0%' }}
                            animate={{ top: '100%' }}
                            transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
                            className="absolute left-0 w-full h-1 bg-purple-400 shadow-[0_0_30px_10px_rgba(139,92,246,0.8)] z-20"
                          />
                          <div className="relative z-30 text-center">
                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-4 animate-bounce">
                              <Zap size={32} className="text-purple-600" />
                            </div>
                            <h3 className="text-white font-black text-lg">AI Analysis in Progress...</h3>
                            <p className="text-white/60 text-xs mt-1">Cross-referencing FSSAI & Nutrition</p>
                          </div>
                        </motion.div>
                      )}
                      {scanDone && (
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 bg-green-500/90 backdrop-blur-md z-10 flex items-center justify-center">
                          <div className="text-center">
                            <CheckCircle size={80} className="text-white mx-auto mb-4" />
                            <h3 className="text-white font-black text-xl">Scan Success!</h3>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!isScanning && !scanDone && (
                      <button onClick={() => { setFile(null); setPreview(null); }}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur rounded-full flex items-center justify-center text-white z-20 shadow-lg">
                        <X size={20} />
                      </button>
                    )}
                  </div>

                  {!isScanning && !scanDone && (
                    <button
                      onClick={handleImageAnalyze}
                      className="w-full bg-purple-600 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-purple-600/30 active:scale-95 transition-all text-base flex items-center justify-center gap-3"
                    >
                      Analyze Product <ImageIcon size={20} />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="bar" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
              <div className="w-full h-[360px] bg-gray-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl flex items-center justify-center group">
                <div className="absolute inset-0 opacity-40">
                  <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" alt="" className="w-full h-full object-cover blur-sm group-hover:scale-110 transition-transform duration-1000" />
                </div>

                <div className="relative z-10 w-4/5 h-40">
                  {[['top-0 left-0 border-t-4 border-l-4 rounded-tl-3xl', ''], ['top-0 right-0 border-t-4 border-r-4 rounded-tr-3xl', ''],
                    ['bottom-0 left-0 border-b-4 border-l-4 rounded-bl-3xl', ''], ['bottom-0 right-0 border-b-4 border-r-4 rounded-br-3xl', '']
                  ].map(([cls], i) => (
                    <div key={i} className={`absolute w-10 h-10 border-purple-400 ${cls}`} />
                  ))}
                  <motion.div
                    animate={{ y: [0, 160, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-0 w-full h-1 bg-red-400 shadow-[0_0_20px_6px_rgba(248,113,113,0.8)]"
                  />
                </div>

                <div className="absolute bottom-8 flex justify-center w-full">
                  <div className="bg-black/60 backdrop-blur-xl text-white/90 px-6 py-2.5 rounded-full text-xs font-black flex items-center gap-2 border border-white/10">
                    <Camera size={14} className="text-purple-400" /> Point at Barcode
                  </div>
                </div>

                <AnimatePresence>
                  {isScanning && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-purple-600/40 backdrop-blur-sm z-20 flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 size={48} className="text-white animate-spin mx-auto mb-3" />
                        <p className="text-white font-black">Fetching Details...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Manual Input */}
              <div className="mt-8 bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Manual Lookup</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Enter 13-digit barcode..." 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:bg-white transition-all" 
                  />
                  <button 
                    onClick={handleBarcodeAnalyze}
                    disabled={!barcode || isScanning}
                    className="bg-purple-600 text-white px-6 py-4 rounded-2xl font-black text-sm shadow-xl shadow-purple-600/20 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    Find
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default Scan;
