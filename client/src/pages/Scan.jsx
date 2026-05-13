import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Zap, CheckCircle, ArrowLeft, ScanLine } from 'lucide-react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import PageWrapper from '../components/layout/PageWrapper';

const SAMPLE_BARCODES = [
  { name: 'Nutella 400g', barcode: '3017620422003' },
  { name: 'Coca-Cola 330ml', barcode: '5449000000996' },
  { name: 'Kit Kat', barcode: '5000159461122' },
  { name: 'Lay\'s Classic', barcode: '028400064057' },
  { name: 'Pringles Original', barcode: '038000845093' },
  { name: 'Oreo Cookies', barcode: '070221007432' },
];

const Scan = () => {
  const [barcode, setBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  useEffect(() => {
    // Initialize html5-qrcode scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 150 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        rememberLastUsedCamera: true
      },
      false
    );

    scanner.render(
      (decodedText) => {
        // Success callback
        scanner.pause();
        handleBarcodeAnalyze(decodedText);
      },
      (err) => {
        // Ignored errors for continuous scanning
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
      }
    };
  }, []);

  const handleBarcodeAnalyze = (code) => {
    const bc = (code || barcode).trim();
    if (!bc) return;
    setIsScanning(true);
    setError('');
    // Navigate directly — Results page fetches from Open Food Facts by barcode
    setScanDone(true);
    setTimeout(() => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
      }
      navigate(`/results/${bc}`);
    }, 900);
  };

  return (
    <PageWrapper className="bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white pt-14 pb-4 px-6 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1 leading-tight">Barcode Scanner</h1>
          <p className="text-gray-400 text-sm">Scan any packed product for a health grade</p>
        </div>
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="px-4 sm:px-6 mt-6 max-w-2xl mx-auto">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-xs font-bold flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {error}
          </motion.div>
        )}

        {/* Live Camera Scanner Box */}
        <div className="w-full bg-white rounded-[2.5rem] relative overflow-hidden shadow-sm border border-gray-100 p-2 sm:p-4 min-h-[350px] flex flex-col justify-center">
          
          <div id="reader" className="w-full rounded-2xl overflow-hidden [&_video]:rounded-2xl [&_#reader__dashboard_section_csr]:mt-4 [&_button]:bg-purple-600 [&_button]:text-white [&_button]:px-4 [&_button]:py-2 [&_button]:rounded-xl [&_button]:font-bold [&_button]:border-none"></div>

          <AnimatePresence>
            {isScanning && !scanDone && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-purple-900/60 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-[2.5rem]">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6 animate-bounce">
                    <Zap size={36} className="text-purple-600" />
                  </div>
                  <h3 className="text-white font-black text-xl mb-1">Analyzing...</h3>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Fetching Science Data</p>
                </div>
              </motion.div>
            )}
            {scanDone && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-green-500/95 backdrop-blur-md z-20 flex items-center justify-center rounded-[2.5rem]">
                <div className="text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}>
                    <CheckCircle size={100} className="text-white mx-auto mb-6" />
                  </motion.div>
                  <h3 className="text-white font-black text-2xl">Product Identified!</h3>
                  <p className="text-white/80 font-bold mt-2">Redirecting to Analysis...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Manual Input */}
        <div className="mt-6 bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-sm">
          <p className="text-xs font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">Manual Entry</p>
          <div className="flex gap-3">
            <input 
              type="text" 
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Enter 13-digit barcode..." 
              className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:bg-white transition-all shadow-inner" 
            />
            <button 
              onClick={() => handleBarcodeAnalyze()}
              disabled={!barcode || isScanning}
              className="bg-purple-600 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-black text-sm shadow-lg shadow-purple-600/30 active:scale-95 disabled:opacity-50 transition-all flex-shrink-0"
            >
              Lookup
            </button>
          </div>
          <p className="text-[10px] text-gray-400 font-bold mt-3 text-center">
            Covers 3M+ products via Open Food Facts.
          </p>
        </div>

        {/* Sample barcodes */}
        <div className="mt-6 bg-purple-50 border border-purple-100 rounded-3xl p-5">
          <p className="text-xs font-black text-purple-700 uppercase tracking-wider mb-3">Try These Barcodes</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SAMPLE_BARCODES.map(s => (
              <button key={s.barcode} onClick={() => { setBarcode(s.barcode); handleBarcodeAnalyze(s.barcode); }}
                className="bg-white border border-purple-100 rounded-2xl p-3 text-left hover:border-purple-400 hover:shadow-sm transition-all group">
                <p className="text-xs font-black text-gray-800 group-hover:text-purple-700 truncate">{s.name}</p>
                <p className="text-[10px] text-purple-500 font-mono mt-1">{s.barcode}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Scan;
