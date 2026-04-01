import React, { useState, useRef } from 'react';
import { processComplaint } from '../engine/AI_Orchestrator';
import { Send, MapPin, Camera, Mic, MicOff, CheckCircle, X } from 'lucide-react';

const ReportForm = ({ onSubmitted }) => {
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [language, setLanguage] = useState('Detect');
  const [isListening, setIsListening] = useState(false);
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Speech Recognition Setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  }

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
      setIsListening(true);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toFixed(4),
            lng: position.coords.longitude.toFixed(4)
          });
        },
        (err) => console.error("Location error:", err)
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;
    setSubmitting(true);
    
    const result = await processComplaint(input, location || { lat: 10.8505, lng: 76.2711 });
    
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(result);
      onSubmitted(result);
      setInput('');
      setLocation(null);
      setImage(null);
      setImagePreview(null);
      setTimeout(() => setSuccess(null), 5000);
    }, 1500);
  };

  return (
    <div className="glass p-8 max-w-2xl mx-auto mb-10 shadow-2xl border-t-4 border-primary">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Send className="text-primary" /> New Report
        </h2>
        <div className="flex gap-2">
          {['Detect', 'മലയാളം', 'हिंदी', 'தமிழ்'].map(l => (
            <button 
              key={l}
              onClick={() => setLanguage(l)}
              type="button"
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${language === l ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-white/50 border-slate-300 dark:bg-slate-800/50'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">
            What is the issue? (Speak or write in any language)
          </label>
          <div className="relative group">
            <textarea
              className="w-full glass bg-white/40 dark:bg-slate-900/40 p-5 min-h-[160px] text-xl focus:outline-none focus:ring-4 focus:ring-primary/20 rounded-2xl transition-all border-2 border-transparent focus:border-primary"
              placeholder="e.g. Broken water pipe near the city hospital..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={submitting}
            />
            <button 
              type="button"
              onClick={toggleListening}
              className={`absolute bottom-4 right-4 p-4 rounded-full shadow-xl transition-all duration-300 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-primary text-white hover:scale-110'}`}
              title={isListening ? "Stop Listening" : "Start Voice Input"}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
          </div>
        </div>

        {/* Media & Metadata Preview */}
        {(location || imagePreview) && (
            <div className="flex gap-4 mb-6 animate-in slide-in-from-bottom-2 duration-300">
                {location && (
                    <div className="glass px-4 py-2 flex items-center gap-2 bg-secondary/10 border-secondary/30">
                        <MapPin size={16} className="text-secondary" />
                        <span className="text-sm font-mono">{location.lat}, {location.lng}</span>
                        <X size={14} className="cursor-pointer opacity-50 hover:opacity-100" onClick={() => setLocation(null)} />
                    </div>
                )}
                {imagePreview && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-primary shadow-md">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            type="button"
                            onClick={() => {setImage(null); setImagePreview(null);}}
                            className="absolute top-0 right-0 bg-red-500 text-white p-0.5"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}
            </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            type="button" 
            onClick={handleGetLocation}
            className={`flex items-center justify-center gap-3 border-2 p-4 rounded-2xl transition-all font-bold ${location ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-300 hover:border-secondary hover:bg-secondary/5'}`}
          >
            <MapPin size={24} className={location ? 'animate-bounce' : ''} />
            <span>{location ? 'Location Added' : 'Tag Location'}</span>
          </button>
          
          <button 
            type="button" 
            onClick={() => fileInputRef.current.click()}
            className={`flex items-center justify-center gap-3 border-2 p-4 rounded-2xl transition-all font-bold ${image ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50'}`}
          >
            <Camera size={24} />
            <span>{image ? 'Photo Updated' : 'Add Photo'}</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        <button 
          type="submit" 
          disabled={submitting || !input}
          className="btn-primary w-full flex items-center justify-center gap-3 py-5 text-2xl font-bold shadow-lg disabled:opacity-50"
        >
          {submitting ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing Report...
            </div>
          ) : (
            <>
              <Send size={28} />
              Submit Complaint
            </>
          )}
        </button>
      </form>

      {success && (
        <div className="mt-8 p-6 rounded-2xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 flex items-start gap-4 animate-in fade-in slide-in-from-top-6 duration-500">
          <div className="bg-emerald-500 text-white p-2 rounded-full">
            <CheckCircle size={28} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 mb-1">Report Routed Successfully</h4>
            <p className="text-lg opacity-90 leading-relaxed font-medium">{success.response}</p>
            <div className="mt-2 text-xs uppercase font-bold tracking-widest opacity-50">
                Routed to: {success.department} | Priority: {success.priority}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportForm;
