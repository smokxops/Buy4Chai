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
  const [isUSD, setIsUSD] = useState(false);
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
    const amtUSD = parseFloat(displayAmount);
    if (!amtUSD || amtUSD < 0.5) { setError('Please enter a valid amount (min $0.50).'); return; }

    // Convert to primary currency (INR usually) for the gateway
    const amtPrimary = Math.round(amtUSD * exchangeRate);

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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen theme-bg transition-colors duration-300 font-sans selection:bg-chai-200 dark:selection:bg-chai-900 selection:text-chai-900 dark:selection:text-chai-100">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--card-border)]/50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Buy4Chai" className="w-6 h-6"/>
            <span className="font-bold text-[var(--text-primary)] text-lg tracking-tight">Buy4Chai</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleDark} className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--input-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">
              {dark ? <Sun size={18} className="text-amber-500"/> : <Moon size={18}/>}
            </button>
            <button
              onClick={() => setShowPayment(true)}
              className="bg-[var(--text-primary)] text-[var(--bg)] px-5 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-black/10"
            >
              Support
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        
        {/* Hero Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-chai-500 blur-3xl opacity-20 rounded-full"></div>
              <img
                src={config.avatar || '/avatar.png'}
                alt={config.name}
                className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-3xl border-2 border-[var(--card-border)] object-cover bg-white shadow-2xl"
              />
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-[var(--card)] rounded-2xl border border-[var(--card-border)] shadow-xl flex items-center justify-center text-2xl rotate-12">
                ☕
              </div>
            </div>

            <h1 className="text-4xl lg:text-6xl font-black text-[var(--text-primary)] tracking-tight mb-4 leading-tight">
              Hey, I'm {config.name}!
            </h1>
            
            <p className="text-xl text-[var(--text-muted)] leading-relaxed max-w-xl mb-8 font-medium">
              {config.bio}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {config.socials && Object.entries(config.socials)
                .filter(([,v]) => v)
                .map(([platform, value]) => (
                <a key={platform} href={SOCIAL_URLS[platform]?.(value) ?? value} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--input-bg)] border border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all text-sm font-bold shadow-sm">
                  {SOCIAL_ICON[platform]}
                  <span>{SOCIAL_LABEL[platform] ?? platform}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Story Section */}
        {config.story && (
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                <MessageSquare size={24} className="text-chai-500" />
                My Story
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed text-lg whitespace-pre-wrap">
                {config.story}
              </p>
            </motion.div>
          </section>
        )}

        {/* Image Gallery */}
        {config.images && config.images.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-2">
              <ImageIcon size={24} className="text-chai-500" />
              Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.images.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group aspect-video overflow-hidden rounded-2xl border border-[var(--card-border)]"
                >
                  <img
                    src={img}
                    alt={`Gallery ${i}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Pinned Projects */}
        {config.projects && config.projects.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-2">
              <Coffee size={24} className="text-chai-500" />
              Pinned Projects
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {config.projects.map((project, i) => (
                <motion.a
                  key={i}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col md:flex-row gap-6 p-6 rounded-3xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--text-primary)] transition-all group"
                >
                  {project.image && (
                    <div className="w-full md:w-48 h-32 shrink-0 overflow-hidden rounded-2xl border border-[var(--card-border)]">
                      <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                      {project.name}
                      <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>
                    <div className="flex items-center text-xs font-bold text-chai-500">
                      Learn more <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="text-center py-20 px-8 rounded-[3rem] bg-[var(--text-primary)] text-[var(--bg)] relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-chai-500 blur-[100px] opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">Enjoying my work?</h2>
            <p className="text-[var(--bg)]/70 mb-10 text-lg font-medium max-w-md mx-auto">
              Your support directly fuels these projects and keeps me creating.
            </p>
            <button
              onClick={() => setShowPayment(true)}
              className="bg-[var(--bg)] text-[var(--text-primary)] px-10 py-4 rounded-full text-lg font-black hover:scale-105 transition-transform active:scale-95 shadow-2xl"
            >
              Buy me a chai
            </button>
          </div>
        </section>

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
              <div className="flex items-center justify-between mb-6 p-2 rounded-2xl bg-[var(--input-bg)] border border-[var(--card-border)]">
                <span className="text-sm font-bold text-[var(--text-muted)] ml-2">Show in {!isUSD ? secondaryCurrency : primaryCurrency}</span>
                <button
                  onClick={() => setIsUSD(!isUSD)}
                  className="flex items-center gap-2 bg-[var(--text-primary)] text-[var(--bg)] px-4 py-2 rounded-xl text-xs font-black hover:opacity-90 transition-opacity"
                >
                  <Repeat size={14} />
                  Swap
                </button>
              </div>

              {/* Amount Selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {suggestedAmounts.map(amt => {
                  const isSelected = !isCustomMode && selected === amt;
                  return (
                    <button
                      key={amt}
                      onClick={() => selectPreset(amt)}
                      className={`group relative py-4 rounded-2xl font-black text-lg transition-all flex flex-col items-center
                        ${isSelected 
                          ? 'bg-[var(--text-primary)] text-[var(--bg)] scale-[1.02] shadow-lg'
                          : 'bg-[var(--input-bg)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] border border-[var(--card-border)]'}`}
                    >
                      <span>{formatCurrency(isUSD ? amt : Math.round(amt * exchangeRate), isUSD ? secondaryCurrency : primaryCurrency)}</span>
                      <span className={`text-[10px] uppercase tracking-widest mt-1 opacity-60 ${isSelected ? 'text-[var(--bg)]' : 'text-[var(--text-muted)]'}`}>
                        {formatCurrency(!isUSD ? amt : Math.round(amt * exchangeRate), !isUSD ? secondaryCurrency : primaryCurrency)}
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
                      Total: {formatCurrency(displayAmount, 'USD')} ({formatCurrency(Math.round(displayAmount * exchangeRate), primaryCurrency)})
                    </span>
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]">
                <ShieldCheck size={14}/>
                <span>Secure Checkout</span>
              </div>
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
        <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2 font-black text-[var(--text-primary)]">
            <img src="/logo.svg" alt="Logo" className="w-5 h-5" />
            Buy4Chai
          </div>
          <p className="text-sm font-medium text-[var(--text-muted)] max-w-sm">
            A self-hostable, gateway-agnostic supporter page for independent creators.
          </p>
          <div className="flex items-center gap-6 text-xs font-bold text-[var(--text-faint)] uppercase tracking-widest">
            <span className="flex items-center gap-1.5">Made with <Heart size={12} className="text-red-500 fill-red-500"/> in India</span>
            <span>•</span>
            <a href="https://github.com/shoryasethia/BuyMeAChai" className="hover:text-[var(--text-primary)] transition-colors">Open Source</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
