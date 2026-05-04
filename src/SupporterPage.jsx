import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Twitter, Globe, Linkedin,
  ShieldCheck, Heart, Loader2, AlertCircle, Sun, Moon, Check
} from 'lucide-react';
import config from '../chai.config.js';
import { initPayment as initRazorpay } from './gateways/razorpay.js';
import { initPayment as initDodo, checkDodoReturn } from './gateways/dodo.js';

/* ─── helpers ─────────────────────────────────────────────────── */
const SOCIAL_URLS = {
  github:   (v) => `https://github.com/${v}`,
  twitter:  (v) => `https://twitter.com/${v}`,
  linkedin: (v) => `https://linkedin.com/in/${v}`,
  website:  (v) => v,
};
const SOCIAL_ICON  = { github: <Github size={16}/>, twitter: <Twitter size={16}/>, linkedin: <Linkedin size={16}/>, website: <Globe size={16}/> };
const SOCIAL_LABEL = { github: 'GitHub', twitter: 'Twitter', linkedin: 'LinkedIn', website: 'Website' };

/* ─── SupporterPage ───────────────────────────────────────────── */
export default function SupporterPage({ dark, toggleDark }) {
  const [selected,     setSelected]     = useState(config.defaultAmount || 100);
  const [custom,       setCustom]       = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [error,        setError]        = useState('');

  const PRESETS = [50, 100, 250, 500];
  const displayAmount = isCustomMode ? custom : selected;

  useEffect(() => {
    if (config.gateway === 'dodo') {
      const status = checkDodoReturn();
      if (status === 'success') setSuccess(true);
      if (status === 'failed')  setError('Payment did not go through. Please try again.');
    }
  }, []);

  const selectPreset = (amt) => { setSelected(amt); setCustom(''); setError(''); setIsCustomMode(false); };
  const enableCustom = () => { setIsCustomMode(true); setSelected(null); setError(''); };
  const onCustom     = (e)   => { setCustom(e.target.value); setError(''); };

  const handlePay = async () => {
    const amt = parseInt(displayAmount);
    if (!amt || amt < 1) { setError('Please enter a valid amount.'); return; }
    setIsProcessing(true); setError(''); setSuccess(false);
    try {
      if (config.gateway === 'razorpay') {
        await initRazorpay(amt * 100, config);
        setSuccess(true);
      } else if (config.gateway === 'dodo') {
        await initDodo(amt, config);
      } else {
        throw new Error(`Unknown gateway: "${config.gateway}"`);
      }
    } catch (err) {
      if (err.message !== 'Payment cancelled by user')
        setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen theme-bg transition-colors duration-300 font-sans selection:bg-chai-200 dark:selection:bg-chai-900 selection:text-chai-900 dark:selection:text-chai-100">
      
      {/* Refined Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg)]/90 border-b border-[var(--card-border)]/50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Buy4Chai" className="w-6 h-6"/>
            <span className="font-bold text-[var(--text-primary)] text-lg tracking-tight">Buy4Chai</span>
          </motion.div>
          <motion.div initial={{opacity:0, x:10}} animate={{opacity:1, x:0}} className="flex items-center gap-4">
            <button onClick={toggleDark} aria-label="Toggle dark mode"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--input-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              {dark ? <Sun size={16} className="text-amber-500"/> : <Moon size={16}/>}
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="max-w-5xl mx-auto px-6 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        {/* Left Column: Creator Narrative */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <motion.div initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} transition={{duration:0.4, ease:[0.16,1,0.3,1]}}>
            <div className="relative inline-block mb-6">
              <img src={config.avatar || '/avatar.png'} alt={config.name}
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl border border-[var(--card-border)] object-cover bg-white"/>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--card)] rounded-lg border border-[var(--card-border)] shadow-sm flex items-center justify-center text-lg rotate-6">☕</div>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-4 leading-tight">
              Hey, I'm {config.name}!
            </h1>
            
            <p className="text-base lg:text-lg text-[var(--text-muted)] leading-relaxed max-w-2xl mb-8">
              {config.bio}
            </p>

            {config.socials && Object.keys(config.socials).some(k => config.socials[k]) && (
              <div className="flex flex-wrap gap-3 items-center">
                {Object.entries(config.socials)
                  .filter(([,v]) => v)
                  .map(([platform, value]) => (
                  <a key={platform} href={SOCIAL_URLS[platform]?.(value) ?? value} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--input-bg)] border border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--card-border)] transition-colors text-sm font-medium">
                    {SOCIAL_ICON[platform]}
                    <span>{SOCIAL_LABEL[platform] ?? platform}</span>
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Checkout Experience */}
        <div className="lg:col-span-5 relative">
          <div className="lg:sticky lg:top-24">
            <motion.div initial={{opacity:0, scale:0.98, y:15}} animate={{opacity:1, scale:1, y:0}} transition={{duration:0.4, delay:0.1, ease:[0.16,1,0.3,1]}}
              className="theme-card border rounded-2xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
              
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Support my work</h2>
                <p className="text-[var(--text-muted)] text-sm">Choose an amount to buy me a chai. Every cup helps!</p>
              </div>

              {/* Segmented Controls for Presets */}
              <div className="flex flex-wrap gap-2 mb-6">
                {PRESETS.map(amt => {
                  const isSelected = !isCustomMode && selected === amt;
                  return (
                    <button key={amt} onClick={() => selectPreset(amt)}
                      className={`relative flex-1 min-w-[60px] py-3 rounded-lg font-semibold text-base transition-colors
                        ${isSelected 
                          ? 'bg-[var(--text-primary)] text-[var(--bg)]' 
                          : 'bg-[var(--input-bg)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] border border-[var(--card-border)]'}`}>
                      ₹{amt}
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Entry */}
              <div className="mb-6 group">
                <button onClick={enableCustom} className={`w-full flex items-center justify-between p-3.5 rounded-lg border transition-colors ${isCustomMode ? 'border-[var(--text-primary)] bg-[var(--bg)]' : 'border-[var(--card-border)] bg-[var(--input-bg)] hover:bg-[var(--bg-subtle)]'}`}>
                  <span className={`font-semibold text-sm ${isCustomMode ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>Custom Amount</span>
                  {isCustomMode && <Check size={16} className="text-[var(--text-primary)]" />}
                </button>
                <AnimatePresence>
                  {isCustomMode && (
                    <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="overflow-hidden">
                      <div className="pt-3 relative">
                        <span className="absolute left-4 top-[60%] -translate-y-1/2 text-[var(--text-muted)] font-semibold text-lg select-none">₹</span>
                        <input type="number" min="1" autoFocus placeholder="0" value={custom} onChange={onCustom}
                          className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] text-xl font-bold pl-9 pr-4 py-3 rounded-lg border border-[var(--card-border)] focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-faint)]"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}}
                    className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0"/>
                    <span className="font-medium">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pay Button */}
              <button onClick={handlePay} disabled={isProcessing}
                className={`relative w-full rounded-lg font-semibold py-3 transition-colors flex flex-col items-center justify-center gap-0.5
                  ${isProcessing 
                    ? 'bg-[var(--text-muted)] text-[var(--bg)] cursor-wait' 
                    : 'bg-[var(--text-primary)] text-[var(--bg)] hover:opacity-90 active:scale-[0.98]'}`}>
                {isProcessing ? (
                  <div className="flex items-center gap-2 py-1"><Loader2 size={18} className="animate-spin"/>Processing Securely...</div>
                ) : (
                  <>
                    <span className="flex items-center text-base">
                      Support with {config.gateway === 'razorpay' ? 'Razorpay' : 'Dodo'}
                      {displayAmount > 0 && <span className="opacity-90 font-bold ml-1">· ${(displayAmount / (config.exchangeRate || 90)).toFixed(2)}</span>}
                    </span>
                    {displayAmount > 0 && <span className="text-xs opacity-70 font-medium">₹{displayAmount}</span>}
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[var(--text-faint)]">
                <ShieldCheck size={14}/>
                <span>100% secure payments</span>
              </div>
            </motion.div>

            {/* Thank You Message Overlap */}
            <AnimatePresence>
              {success && (
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}
                  className="absolute inset-0 z-20 theme-card border rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="w-16 h-16 bg-chai-100 dark:bg-chai-900/50 rounded-full flex items-center justify-center mb-6">
                    <Heart size={28} className="text-chai-600 fill-chai-600"/>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Thank You!</h3>
                  <p className="text-[var(--text-muted)] text-base leading-relaxed mb-8">
                    {config.thankYouMessage || "Your support means the world and keeps me motivated to create."}
                  </p>
                  <button onClick={() => setSuccess(false)} className="px-6 py-2.5 rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-subtle)] transition-colors text-sm">
                    Send another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-[var(--card-border)]/50 mt-10 lg:mt-0">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p className="flex items-center gap-1.5">Made with <Heart size={12} className="text-red-400 fill-red-400"/> in India</p>
          <p>Powered by <a href="#" className="font-semibold hover:text-[var(--text-primary)] transition-colors">Buy4Chai</a></p>
        </div>
      </footer>

    </div>
  );
}
