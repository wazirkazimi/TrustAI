import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Zap, CheckCircle, ArrowLeft, ScanLine, Upload, Loader2 } from 'lucide-react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import PageWrapper from '../components/layout/PageWrapper';
import { scanAPI } from '../utils/api';

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
  const [isUploading, setIsUploading] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let scanner = null;

    // Check if media devices and cameras are supported/available
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          if (!isMounted) return;
          const cameras = devices.filter(d => d.kind === 'videoinput');
          if (cameras.length === 0) {
            setHasCamera(false);
            setError("Webcam not detected. Please upload a photo of the label/barcode or enter the barcode manually.");
          }
        })
        .catch(err => {
          console.warn("Device enumeration error:", err);
        });
    } else {
      setHasCamera(false);
      setError("Webcam access not supported in this browser. Please use photo uploads.");
    }

    // Only attempt scanner mount if a camera is present
    const timer = setTimeout(() => {
      if (!isMounted) return;

      const container = document.getElementById("reader");
      if (!container) return;

      // Ensure clean DOM container
      container.innerHTML = "";

      scanner = new Html5QrcodeScanner(
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
          scanner.pause();
          handleBarcodeAnalyze(decodedText);
        },
        (err) => {
          if (err && typeof err === 'string' && err.includes("Requested device not found")) {
            if (isMounted) {
              setHasCamera(false);
              setError("Camera not found or access denied.");
            }
          }
        }
      );

      scannerRef.current = scanner;
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (scanner) {
        scanner.clear().catch(e => console.error("Error clearing scanner on unmount:", e));
      }
    };
  }, []);

  const handleBarcodeAnalyze = (code) => {
    const bc = (code || barcode).trim();
    if (!bc) return;
    setIsScanning(true);
    setError('');
    setScanDone(true);
    setTimeout(() => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
      }
      navigate(`/results/${bc}`);
    }, 900);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    if (scannerRef.current) {
      try {
        scannerRef.current.clear().catch(() => {});
      } catch (_) {}
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await scanAPI.scanImage(formData);
      if (data && data.scan && data.scan.id) {
        setScanDone(true);
        setTimeout(() => {
          navigate(`/results/${data.scan.id}`);
        }, 900);
      } else {
        throw new Error('Scan failed to return valid data');
      }
    } catch (err) {
      console.error('OCR label scan error:', err);
      setError(err.response?.data?.message || 'Failed to analyze label image. Please check your internet or billing and try again.');
      setIsUploading(false);
    }
  };

  return (
    <PageWrapper className="bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white pt-14 pb-4 px-6 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1 leading-tight">Product Scanner</h1>
          <p className="text-gray-400 text-sm">Scan barcode or upload nutritional label</p>
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
          
          {hasCamera ? (
            <div id="reader" className="w-full rounded-2xl overflow-hidden [&_video]:rounded-2xl [&_#reader__dashboard_section_csr]:mt-4 [&_button]:bg-purple-600 [&_button]:text-white [&_button]:px-4 [&_button]:py-2 [&_button]:rounded-xl [&_button]:font-bold [&_button]:border-none"></div>
          ) : (
            <div className="text-center py-12 px-6">
              <div className="w-20 h-20 bg-purple-50 rounded-[2rem] flex items-center justify-center mx-auto mb-5 text-4xl shadow-inner shadow-purple-600/5">📷</div>
              <h3 className="font-black text-gray-800 text-base mb-1">Webcam Not Detected</h3>
              <p className="text-gray-400 text-xs font-bold max-w-xs mx-auto leading-relaxed">
                No active webcam was found. Take or upload a photo of the product label/barcode, or use manual entry below!
              </p>
            </div>
          )}

          <AnimatePresence>
            {isScanning && !scanDone && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-purple-900/60 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-[2.5rem]">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6 animate-bounce">
                    <Zap size={36} className="text-purple-600" />
                  </div>
                  <h3 className="text-white font-black text-xl mb-1">Analyzing Barcode...</h3>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Fetching Science Data</p>
                </div>
              </motion.div>
            )}
            {isUploading && !scanDone && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-purple-900/60 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-[2.5rem]">
                <div className="text-center">
                  <Loader2 size={40} className="animate-spin text-white mx-auto mb-4"/>
                  <h3 className="text-white font-black text-xl mb-1">Analyzing Label...</h3>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Extracting Nutrition Details</p>
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
                  <h3 className="text-white font-black text-2xl">Analysis Complete!</h3>
                  <p className="text-white/80 font-bold mt-2">Redirecting to Results...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Photo Upload & Capture Trigger */}
        <div className="mt-4 flex gap-3">
          <label className="flex-1 bg-white border border-gray-100 rounded-2xl py-4 px-6 flex items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-md hover:border-purple-200 transition-all font-bold text-gray-700 text-sm">
            <Upload size={18} className="text-purple-600" />
            <span>Upload Label</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
              className="hidden" 
            />
          </label>
          
          <label className="flex-1 bg-white border border-gray-100 rounded-2xl py-4 px-6 flex items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-md hover:border-purple-200 transition-all font-bold text-gray-700 text-sm">
            <Camera size={18} className="text-purple-600" />
            <span>Take Photo (OCR)</span>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              onChange={handlePhotoUpload} 
              className="hidden" 
            />
          </label>
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
