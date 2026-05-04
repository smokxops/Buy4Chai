import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Twitter, Globe, Linkedin,
  ShieldCheck, Heart, Loader2, AlertCircle, Sun, Moon, Check,
  ExternalLink, ArrowRight, MessageSquare, Image as ImageIcon,
  Coffee, X, Repeat
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
  const [showPayment, setShowPayment] = useState(false);
  const [isUSD, setIsUSD] = useState(true);
  const [selected, setSelected] = useState(config.defaultAmount || 5);
  const [custom, setCustom] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const exchangeRate = config.exchangeRate || 80;
  const primaryCurrency = config.currency || 'INR';
  const secondaryCurrency = config.displayCurrency || 'USD';

  const suggestedAmounts = config.suggestedAmounts || [2, 5, 10, 25];

  const displayAmountUSD = parseFloat(isCustomMode ? custom : selected) || 0;

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
    if (!displayAmountUSD || displayAmountUSD < 0.5) {
      setError('Please enter a valid amount (min $0.50).');
      return;
    }

    // Convert to primary currency (e.g. INR) for the gateway
    const amtPrimary = Math.round(displayAmountUSD * exchangeRate);

    setIsProcessing(true); setError(''); setSuccess(false);
    try {
      if (config.gateway === 'razorpay') {
        await initRazorpay(amtPrimary * 100, config);
        setSuccess(true);
        setShowPayment(false);
      } else if (config.gateway === 'dodo') {
        await initDodo(amtPrimary, config);
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

  const formatCurrency = (amount, currency) => {
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen theme-bg transition-colors duration-300 font-sans selection:bg-chai-200 dark:selection:bg-chai-900 selection:text-chai-900 dark:selection:text-chai-100">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--card-border)]/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Buy4Chai" className="w-6 h-6"/>
            <span className="font-bold text-[var(--text-primary)] text-lg tracking-tight">Buy4Chai</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleDark} className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--input-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">
              {dark ? <Sun size={18} className="text-amber-500"/> : <Moon size={18}/>}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Creator Narrative (Scrollable) */}
        <div className="lg:col-span-7 space-y-16">

          {/* Hero Section */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="relative inline-block">
                <img
                  src={config.avatar || '/avatar.png'}
                  alt={config.name}
                  className="w-28 h-28 lg:w-36 lg:h-36 rounded-3xl border-2 border-[var(--card-border)] object-cover bg-white shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--card)] rounded-xl border border-[var(--card-border)] shadow-lg flex items-center justify-center text-xl rotate-12">☕</div>
              </div>

              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight mb-4">
                  Hey, I'm {config.name}!
                </h1>
                <p className="text-xl text-[var(--text-muted)] leading-relaxed font-medium max-w-xl">
                  {config.bio}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {config.socials && Object.entries(config.socials)
                  .filter(([,v]) => v)
                  .map(([platform, value]) => (
                  <a key={platform} href={SOCIAL_URLS[platform]?.(value) ?? value} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--input-bg)] border border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all text-sm font-bold shadow-sm">
                    {SOCIAL_ICON[platform]}
                    <span>{SOCIAL_LABEL[platform] ?? platform}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Story Section */}
          {config.story && (
            <section>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2 uppercase tracking-widest text-xs opacity-50">
                <MessageSquare size={16} />
                My Story
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed text-lg whitespace-pre-wrap font-medium">
                {config.story}
              </p>
            </section>
          )}

          {/* Image Gallery */}
          {config.images && config.images.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-2 uppercase tracking-widest text-xs opacity-50">
                <ImageIcon size={16} />
                Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.images.map((img, i) => (
                  <div key={i} className="aspect-video overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--input-bg)]">
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pinned Projects */}
          {config.projects && config.projects.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-2 uppercase tracking-widest text-xs opacity-50">
                <Coffee size={16} />
                Pinned Projects
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {config.projects.map((project, i) => (
                  <a key={i} href={project.link} target="_blank" rel="noopener noreferrer"
                    className="flex flex-col sm:flex-row gap-6 p-6 rounded-3xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--text-primary)] transition-all group">
                    {project.image && (
                      <div className="w-full sm:w-32 h-24 shrink-0 overflow-hidden rounded-xl border border-[var(--card-border)]">
                        <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                        {project.name}
                        <ArrowRight size={14} className="-rotate-45 opacity-0 group-hover:opacity-100 group-hover:rotate-0 transition-all" />
                      </h3>
                      <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-3">{project.description}</p>
                      <span className="text-xs font-black uppercase tracking-tighter text-chai-500">View Project</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Right Column: Support Card (Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="theme-card border rounded-[2.5rem] p-8 lg:p-10 shadow-2xl shadow-black/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-40 h-40 bg-chai-500 blur-[80px] opacity-10"></div>

            <div className="relative z-10 space-y-8">
              <div>
                <h2 className="text-3xl font-black text-[var(--text-primary)] mb-3">Support {config.name}</h2>
                <p className="text-[var(--text-muted)] text-base font-medium leading-relaxed">
                  Your support directly fuels my work and helps me stay independent.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full bg-[var(--text-primary)] text-[var(--bg)] py-5 rounded-2xl text-xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
                >
                  <Coffee size={24} />
                  Buy me a chai
                </button>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[var(--text-faint)] uppercase tracking-widest">
                  <ShieldCheck size={14}/>
                  <span>Secure Checkout</span>
                </div>
              </div>

              <div className="pt-8 border-t border-[var(--card-border)]/50">
                <p className="text-sm font-bold text-[var(--text-primary)] mb-4">Why support?</p>
                <ul className="space-y-3">
                  {[
                    "Keep projects open source",
                    "Fuel new experiments",
                    "Say thanks for the value"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-[var(--text-muted)] font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-chai-500"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

      </main>

      {/* Payment Overlay */}
      <AnimatePresence>
        {showPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPayment(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md theme-card border rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setShowPayment(false)}
                className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">Support my work</h2>
                <p className="text-[var(--text-muted)] text-sm font-medium">Choose an amount to buy me a chai.</p>
              </div>

              {/* Currency Toggle */}
              <div className="flex items-center justify-between mb-6 p-3 rounded-2xl bg-[var(--input-bg)] border border-[var(--card-border)]">
                <div className="flex flex-col ml-1">
                  <span className="text-xs font-bold text-[var(--text-muted)] leading-tight">Showing {isUSD ? secondaryCurrency : primaryCurrency}</span>
                  <span className="text-[9px] text-[var(--text-faint)] font-bold uppercase tracking-tighter">1 {secondaryCurrency} = {exchangeRate} {primaryCurrency}</span>
                </div>
                <button
                  onClick={() => setIsUSD(!isUSD)}
                  className="flex items-center gap-1.5 bg-[var(--text-primary)] text-[var(--bg)] px-3 py-1.5 rounded-lg text-[10px] font-black hover:opacity-90 transition-opacity"
                >
                  <Repeat size={12} />
                  {isUSD ? primaryCurrency : secondaryCurrency}
                </button>
              </div>

              {/* Amount Selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {suggestedAmounts.map(amt => {
                  const isSelected = !isCustomMode && selected === amt;
                  const mainAmount = isUSD ? amt : Math.round(amt * exchangeRate);
                  const subAmount = !isUSD ? amt : Math.round(amt * exchangeRate);
                  const mainCurrency = isUSD ? secondaryCurrency : primaryCurrency;
                  const subCurrency = !isUSD ? secondaryCurrency : primaryCurrency;

                  return (
                    <button
                      key={amt}
                      onClick={() => selectPreset(amt)}
                      className={`group relative py-4 rounded-2xl font-black text-lg transition-all flex flex-col items-center
                        ${isSelected 
                          ? 'bg-[var(--text-primary)] text-[var(--bg)] scale-[1.02] shadow-lg'
                          : 'bg-[var(--input-bg)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] border border-[var(--card-border)]'}`}
                    >
                      <span>{formatCurrency(mainAmount, mainCurrency)}</span>
                      <span className={`text-[10px] uppercase tracking-widest mt-1 opacity-60 ${isSelected ? 'text-[var(--bg)]' : 'text-[var(--text-muted)]'}`}>
                        {formatCurrency(subAmount, subCurrency)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount */}
              <div className="mb-8">
                <button
                  onClick={enableCustom}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isCustomMode ? 'border-[var(--text-primary)] bg-[var(--bg)] ring-2 ring-[var(--text-primary)]/10' : 'border-[var(--card-border)] bg-[var(--input-bg)] hover:bg-[var(--bg-subtle)]'}`}
                >
                  <span className={`font-bold text-sm ${isCustomMode ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>Custom Amount (USD)</span>
                  {isCustomMode && <Check size={18} className="text-[var(--text-primary)]" />}
                </button>
                <AnimatePresence>
                  {isCustomMode && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-4 relative">
                        <span className="absolute left-5 top-[62%] -translate-y-1/2 text-[var(--text-muted)] font-black text-xl select-none">$</span>
                        <input
                          type="number"
                          min="0.5"
                          autoFocus
                          placeholder="0.00"
                          value={custom}
                          onChange={onCustom}
                          className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] text-2xl font-black pl-10 pr-6 py-4 rounded-2xl border border-[var(--card-border)] focus:outline-none focus:border-[var(--text-primary)] transition-all placeholder:text-[var(--text-faint)]"
                        />
                        <div className="mt-2 text-right text-xs font-bold text-[var(--text-muted)]">
                          ≈ {formatCurrency(Math.round((parseFloat(custom) || 0) * exchangeRate), primaryCurrency)}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                    className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                    <AlertCircle size={20} className="shrink-0" />
                    <span className="font-bold">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pay Button */}
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className={`relative w-full rounded-[1.5rem] font-black py-5 transition-all flex flex-col items-center justify-center
                  ${isProcessing 
                    ? 'bg-[var(--text-muted)] text-[var(--bg)] cursor-wait' 
                    : 'bg-[var(--text-primary)] text-[var(--bg)] hover:opacity-90 active:scale-[0.98] shadow-xl shadow-[var(--text-primary)]/20'}`}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-3"><Loader2 size={20} className="animate-spin"/>Processing Securely...</div>
                ) : (
                  <>
                    <span className="text-lg">Support with {config.gateway === 'razorpay' ? 'Razorpay' : 'Dodo'}</span>
                    <span className="text-xs opacity-70 mt-1 uppercase tracking-tighter">
                      Total: {formatCurrency(displayAmountUSD, secondaryCurrency)} ({formatCurrency(Math.round(displayAmountUSD * exchangeRate), primaryCurrency)})
                    </span>
                  </>
                )}
              </button>

              <p className="mt-4 text-[10px] text-center text-[var(--text-faint)] font-medium italic">
                * Exchange rate set by creator. Final amount may vary slightly based on your bank's rate.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full theme-card border rounded-[3rem] p-10 flex flex-col items-center text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-chai-100 dark:bg-chai-900/50 rounded-full flex items-center justify-center mb-8">
                <Heart size={40} className="text-chai-600 fill-chai-600 animate-pulse" />
              </div>
              <h3 className="text-3xl font-black text-[var(--text-primary)] mb-4">Thank You!</h3>
              <p className="text-[var(--text-muted)] text-lg font-medium leading-relaxed mb-10">
                {config.thankYouMessage || "Your support means the world and keeps me motivated to create."}
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="w-full bg-[var(--text-primary)] text-[var(--bg)] py-4 rounded-2xl font-black hover:opacity-90 transition-opacity"
              >
                Back to Story
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)]/50 bg-[var(--bg-subtle)]/50">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 font-black text-[var(--text-primary)]">
              <img src="/logo.svg" alt="Logo" className="w-5 h-5" />
              Buy4Chai
            </div>
            <p className="text-xs font-medium text-[var(--text-muted)] max-w-sm">
              A self-hostable, gateway-agnostic supporter page for independent creators.
            </p>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-widest">
            <span className="flex items-center gap-1.5">Made with <Heart size={10} className="text-red-500 fill-red-500"/> in India</span>
            <span>•</span>
            <a href="https://github.com/shoryasethia/BuyMeAChai" className="hover:text-[var(--text-primary)] transition-colors">Open Source</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
