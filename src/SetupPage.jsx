import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Link2, CreditCard, Paintbrush, Code2,
  Check, ChevronRight, ChevronLeft, Copy, ExternalLink,
  Github, Twitter, Globe, Linkedin,
  AlertTriangle, Info, CheckCircle2, Zap, Shield, Image as ImageIcon
} from 'lucide-react';

const STEPS = [
  { id: 'identity',  label: 'Identity',    icon: User },
  { id: 'socials',   label: 'Socials',     icon: Link2 },
  { id: 'gateway',   label: 'Gateway',     icon: CreditCard },
  { id: 'customize', label: 'Customize',   icon: Paintbrush },
  { id: 'config',    label: 'Your Config', icon: Code2 },
];

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });
}

/* ---- Shared UI ---- */

function InfoBox({ icon: Icon = Info, color = 'blue', title, children }) {
  const colors = {
    blue:  'bg-blue-50  dark:bg-blue-950/30  border-blue-200  dark:border-blue-800  text-blue-700  dark:text-blue-300',
    amber: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
    green: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
    red:   'bg-red-50   dark:bg-red-950/30   border-red-200   dark:border-red-800   text-red-700   dark:text-red-300',
  };
  return (
    <div className={`border rounded-2xl p-4 ${colors[color]}`}>
      {title && <p className="font-bold flex items-center gap-2 mb-1"><Icon size={15}/>{title}</p>}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function Field({ label, hint, required, children }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold theme-text mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs theme-muted mb-2">{hint}</p>}
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', prefix }) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs theme-muted font-mono select-none">{prefix}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`theme-input w-full ${prefix ? 'pl-[7.5rem]' : 'pl-4'} pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-chai-500/30 focus:border-chai-500 transition-all text-sm font-medium placeholder:text-[var(--text-faint)]`}
      />
    </div>
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="theme-input w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-chai-500/30 focus:border-chai-500 transition-all text-sm font-medium placeholder:text-[var(--text-faint)] resize-none"
    />
  );
}

/* ---- Step 1: Identity ---- */

function IdentityStep({ data, set }) {
  return (
    <div className="space-y-4">
      <InfoBox icon={Info} color="blue" title="Your public profile">
        This shows up on your supporter page. Use your real name and a friendly bio.
      </InfoBox>

      <Field label="Your Name" required hint="First name or full name — whatever you go by publicly.">
        <Input value={data.name} onChange={v => set('name', v)} placeholder="Arjun Sharma"/>
      </Field>

      <Field label="One-line Bio" required hint="Tell supporters what you build. Keep it short.">
        <Textarea value={data.bio} onChange={v => set('bio', v)} rows={2}
          placeholder="I build open source tools and write about web dev. Every chai helps!"/>
      </Field>

      <Field label="Avatar Image URL" hint="Read the options below before pasting.">
        <Input value={data.avatar} onChange={v => set('avatar', v)}
          placeholder="https://github.com/yourusername.png"/>
      </Field>

      <InfoBox icon={ImageIcon} color="amber" title="Where should your avatar come from?">
        <p className="mb-2">Two options:</p>
        <p className="mb-1">
          <strong>Option A (easiest):</strong>{' '}
          <code className="bg-black/10 dark:bg-white/10 px-1 rounded">https://github.com/YOUR_USERNAME.png</code>
          {' '}— always up-to-date, no hosting needed.
        </p>
        <p>
          <strong>Option B (local file):</strong> Drop your image into the{' '}
          <code className="bg-black/10 dark:bg-white/10 px-1 rounded">public/</code> folder as{' '}
          <code className="bg-black/10 dark:bg-white/10 px-1 rounded">avatar.png</code>, then use{' '}
          <code className="bg-black/10 dark:bg-white/10 px-1 rounded">/avatar.png</code> as the URL.
          Files in <code className="bg-black/10 dark:bg-white/10 px-1 rounded">public/</code> are the
          only ones Vite serves at a bare path — your root-level files are NOT automatically hosted.
        </p>
      </InfoBox>

      {(data.name || data.avatar) && (
        <div className="p-4 rounded-2xl border border-[var(--card-border)] bg-[var(--bg-subtle)]">
          <p className="text-sm font-semibold theme-text mb-3 flex items-center gap-2">
            <ImageIcon size={15}/>Live Preview
          </p>
          <div className="flex items-center gap-4">
            {data.avatar
              ? <img src={data.avatar} alt="Preview"
                  className="w-14 h-14 rounded-full object-cover border-2 border-[var(--card-border)] bg-white"
                  onError={e => { e.target.style.display = 'none'; }}/>
              : <div className="w-14 h-14 rounded-full bg-[var(--card-border)] flex items-center justify-center text-2xl">?</div>
            }
            <div>
              <p className="font-bold theme-text">{data.name || 'Your Name'}</p>
              <p className="text-sm theme-muted">{data.bio || 'Your bio appears here'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Step 2: Socials ---- */

function SocialsStep({ data, set }) {
  const fields = [
    { key: 'github',   label: 'GitHub',   icon: <Github   size={15}/>, prefix: 'github.com/',      placeholder: 'yourusername' },
    { key: 'twitter',  label: 'Twitter',  icon: <Twitter  size={15}/>, prefix: 'twitter.com/',     placeholder: 'yourhandle' },
    { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={15}/>, prefix: 'linkedin.com/in/', placeholder: 'your-profile' },
    { key: 'website',  label: 'Website',  icon: <Globe    size={15}/>, prefix: null,               placeholder: 'https://yoursite.com' },
  ];
  return (
    <div className="space-y-4">
      <InfoBox icon={Info} color="blue">
        All fields are optional. Only filled-in links appear on your page.
      </InfoBox>
      <div className="space-y-4 pt-2">
        {fields.map(f => (
          <Field key={f.key} label={<span className="flex items-center gap-2">{f.icon}{f.label}</span>}>
            <Input value={data[f.key] || ''} onChange={v => set(f.key, v)}
              placeholder={f.placeholder} prefix={f.prefix}/>
          </Field>
        ))}
      </div>
    </div>
  );
}

/* ---- Step 3: Gateway ---- */

function GatewayStep({ data, set }) {
  const razorpaySteps = [
    { n:1, text: <span>Sign up at <a href="https://razorpay.com" target="_blank" rel="noopener noreferrer" className="text-chai-500 hover:underline font-medium inline-flex items-center gap-1">razorpay.com <ExternalLink size={11}/></a></span> },
    { n:2, text: 'Go to Settings > API Keys in your dashboard.' },
    { n:3, text: 'Click "Generate Test Key" (for testing) or "Generate Live Key" (for production).' },
    { n:4, text: <span>Copy the <strong className="theme-text">Key ID</strong> — starts with <code className="bg-black/10 dark:bg-white/10 px-1 rounded">rzp_test_</code> or <code className="bg-black/10 dark:bg-white/10 px-1 rounded">rzp_live_</code></span> },
  ];

  const dodoSteps = [
    { n:1, text: <span>Sign up at <a href="https://dodopayments.com" target="_blank" rel="noopener noreferrer" className="text-chai-500 hover:underline font-medium inline-flex items-center gap-1">dodopayments.com <ExternalLink size={11}/></a></span> },
    { n:2, text: 'Go to Products > Create a new product. Set it as a one-time payment.' },
    { n:3, text: 'Set the price in the Dodo dashboard. This price overrides chai.config.js for Dodo.' },
    { n:4, text: <span>Copy your <strong className="theme-text">Product ID</strong> — looks like <code className="bg-black/10 dark:bg-white/10 px-1 rounded">prod_XXXXXXXXXXXX</code></span> },
  ];

  const StepList = ({ steps, color }) => (
    <div className="p-4 space-y-3 text-sm theme-muted">
      {steps.map(s => (
        <div key={s.n} className="flex gap-3">
          <span className={`w-6 h-6 rounded-full ${color} text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>{s.n}</span>
          <p className="leading-relaxed">{s.text}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      <Field label="Which payment gateway?" required
        hint="Choose based on your audience. You can switch anytime by changing one config field.">
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'razorpay', name: 'Razorpay',      desc: 'Best for India',          badge: 'UPI + Cards',    badgeColor: 'text-blue-600' },
            { id: 'dodo',     name: 'Dodo Payments',  desc: 'Best for international',  badge: 'Visa / MC / Amex', badgeColor: 'text-purple-600' },
          ].map(gw => (
            <button key={gw.id} onClick={() => set('gateway', gw.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                data.gateway === gw.id
                  ? 'border-chai-500 bg-chai-50 dark:bg-chai-950/40 shadow-md'
                  : 'border-[var(--card-border)] bg-[var(--bg-subtle)] hover:border-chai-300'
              }`}>
              {data.gateway === gw.id && <Check size={13} className="text-chai-500 mb-2"/>}
              <p className="font-bold theme-text text-sm">{gw.name}</p>
              <p className="text-xs theme-muted">{gw.desc}</p>
              <span className={`text-[10px] font-bold mt-1 block ${gw.badgeColor}`}>{gw.badge}</span>
            </button>
          ))}
        </div>
      </Field>

      {data.gateway === 'razorpay' && (
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-4">
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--bg-subtle)] overflow-hidden">
            <div className="p-4 border-b border-[var(--card-border)]">
              <p className="font-bold theme-text flex items-center gap-2">
                <Zap size={14} className="text-blue-500"/>How to get your Razorpay Key ID
              </p>
            </div>
            <StepList steps={razorpaySteps} color="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"/>
          </div>
          <InfoBox icon={Shield} color="red" title="Key ID only — never the Key Secret">
            The Key Secret is for servers. Pasting it here exposes it to everyone who views your page source.
            You only need the <strong>Key ID</strong>.
          </InfoBox>
          <Field label="Razorpay Key ID" required hint="Starts with rzp_test_ or rzp_live_">
            <Input value={data.gatewayKey} onChange={v => set('gatewayKey', v)} placeholder="rzp_test_XXXXXXXXXXXX"/>
          </Field>
        </motion.div>
      )}

      {data.gateway === 'dodo' && (
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-4">
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--bg-subtle)] overflow-hidden">
            <div className="p-4 border-b border-[var(--card-border)]">
              <p className="font-bold theme-text flex items-center gap-2">
                <Zap size={14} className="text-purple-500"/>How to get your Dodo Product ID
              </p>
            </div>
            <StepList steps={dodoSteps} color="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"/>
          </div>
          <InfoBox icon={Info} color="amber" title="Dodo redirects — this is expected">
            Unlike Razorpay (popup on your page), Dodo sends the supporter to a hosted checkout page,
            then redirects them back. No code change needed.
          </InfoBox>
          <Field label="Dodo Product ID" required hint="Starts with prod_">
            <Input value={data.gatewayKey} onChange={v => set('gatewayKey', v)} placeholder="prod_XXXXXXXXXXXX"/>
          </Field>
        </motion.div>
      )}
    </div>
  );
}

/* ---- Step 4: Customize ---- */

function CustomizeStep({ data, set }) {
  return (
    <div className="space-y-4">
      <Field label="Default selected amount" hint="Which preset button is active when the page first loads.">
        <div className="grid grid-cols-4 gap-2">
          {[50, 100, 250, 500].map(amt => (
            <button key={amt} onClick={() => set('defaultAmount', amt)}
              className={`py-3 rounded-xl font-bold text-sm transition-all ${
                data.defaultAmount === amt
                  ? 'bg-chai-500 text-white shadow-md'
                  : 'bg-[var(--input-bg)] theme-text hover:bg-[var(--bg-subtle)]'
              }`}>
              Rs.{amt}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Currency" hint="Razorpay: INR. Dodo: USD or EUR.">
        <div className="grid grid-cols-3 gap-2">
          {['INR', 'USD', 'EUR'].map(c => (
            <button key={c} onClick={() => set('currency', c)}
              className={`py-3 rounded-xl font-bold text-sm transition-all ${
                data.currency === c
                  ? 'bg-chai-500 text-white'
                  : 'bg-[var(--input-bg)] theme-text hover:bg-[var(--bg-subtle)]'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Thank You Message" hint="Shown to the supporter after a successful payment.">
        <Textarea value={data.thankYouMessage} onChange={v => set('thankYouMessage', v)} rows={2}
          placeholder="You made my day! Your support keeps me going."/>
      </Field>
    </div>
  );
}

/* ---- Step 5: Generated Config ---- */

function ConfigStep({ data }) {
  const [copied, setCopied] = useState(false);

  const socialsLines = Object.entries(data.socials)
    .filter(([, v]) => v)
    .map(([k, v]) => `    ${k}: "${v}",`)
    .join('\n') || '    // github: "yourusername",';

  const output = [
    '// chai.config.js — edit this and deploy',
    'export default {',
    '  // Identity',
    `  name: "${data.name || 'Your Name'}",`,
    `  avatar: "${data.avatar || '/avatar.png'}",`,
    `  bio: "${data.bio || 'Tell supporters what you build.'}",`,
    '',
    '  // Social Links (remove any you do not want)',
    '  socials: {',
    socialsLines,
    '  },',
    '',
    '  // Payment Gateway',
    `  gateway: "${data.gateway}",`,
    `  gatewayKey: "${data.gatewayKey || 'YOUR_KEY_HERE'}",`,
    '',
    '  // Customization',
    `  currency: "${data.currency}",`,
    `  defaultAmount: ${data.defaultAmount},`,
    `  thankYouMessage: "${data.thankYouMessage || 'Thank you for your support!'}",`,
    '}',
  ].join('\n');

  const ready = data.name && data.gateway && data.gatewayKey;

  const handleCopy = () => {
    copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const nextSteps = [
    <>Fork this repo on GitHub</>,
    <>Replace <code className="bg-black/10 dark:bg-white/10 px-1 rounded">chai.config.js</code> with the config above</>,
    <>If using a local avatar, place your image at <code className="bg-black/10 dark:bg-white/10 px-1 rounded">public/avatar.png</code> — files at the project root are NOT served by Vite, only files inside <code className="bg-black/10 dark:bg-white/10 px-1 rounded">public/</code> are</>,
    <>Push to GitHub and import into Vercel (free tier, auto-detects Vite)</>,
    <>Copy your Vercel URL and paste it into the badge snippet in your README</>,
  ];

  return (
    <div className="space-y-5">
      {!ready && (
        <InfoBox icon={AlertTriangle} color="amber" title="A few fields are missing">
          Go back and fill in your Name, pick a Gateway, and paste your key.
          The config updates automatically as you fill things in.
        </InfoBox>
      )}
      {ready && (
        <InfoBox icon={CheckCircle2} color="green" title="You are ready to deploy!">
          Copy the config below, paste it into <code className="bg-black/10 dark:bg-white/10 px-1 rounded">chai.config.js</code> in your forked repo, and deploy.
        </InfoBox>
      )}

      <div className="relative">
        <pre className="theme-input border rounded-2xl p-5 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre">
{output}
        </pre>
        <button onClick={handleCopy}
          className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            copied
              ? 'bg-green-500 text-white'
              : 'theme-card border border-[var(--card-border)] theme-text hover:bg-[var(--bg-subtle)]'
          }`}>
          {copied ? <><Check size={12}/>Copied!</> : <><Copy size={12}/>Copy</>}
        </button>
      </div>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--bg-subtle)] p-5">
        <p className="font-bold theme-text flex items-center gap-2 mb-3"><Zap size={14}/>Next Steps</p>
        <ol className="space-y-2 text-sm theme-muted">
          {nextSteps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-chai-100 dark:bg-chai-900/50 text-chai-600 dark:text-chai-400 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ---- Root SetupPage ---- */

const STEP_COMPONENTS = [IdentityStep, SocialsStep, GatewayStep, CustomizeStep, ConfigStep];

export default function SetupPage({ dark, toggleDark }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '', bio: '', avatar: '',
    socials: { github: '', twitter: '', linkedin: '', website: '' },
    gateway: 'razorpay', gatewayKey: '',
    defaultAmount: 100, currency: 'INR',
    thankYouMessage: '',
  });

  const set       = (k, v) => setData(d => ({ ...d, [k]: v }));
  const setSocial = (k, v) => setData(d => ({ ...d, socials: { ...d.socials, [k]: v } }));

  const CurrentStep = STEP_COMPONENTS[step];
  const isLast  = step === STEPS.length - 1;
  const isFirst = step === 0;

  return (
    <div className="min-h-screen theme-bg transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-5 py-10">

        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Buy4Chai" className="w-9 h-9"/>
            <div>
              <p className="font-bold theme-text text-lg leading-tight">Setup Wizard</p>
              <p className="text-xs theme-muted">Buy4Chai</p>
            </div>
          </div>
          <button onClick={toggleDark} aria-label="Toggle dark mode"
            className="w-10 h-10 flex items-center justify-center rounded-full theme-card border shadow-sm hover:scale-105 transition-all text-base">
            {dark ? '☀️' : '🌙'}
          </button>
        </header>

        {/* Progress stepper */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const Icon    = s.icon;
            const done    = i < step;
            const current = i === step;
            return (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => i <= step && setStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    current ? 'bg-chai-500 text-white shadow-md'
                    : done   ? 'bg-chai-100 dark:bg-chai-900/50 text-chai-600 dark:text-chai-400 hover:bg-chai-200 cursor-pointer'
                             : 'bg-[var(--bg-subtle)] theme-muted cursor-not-allowed'
                  }`}>
                  {done ? <Check size={13}/> : <Icon size={13}/>}
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 min-w-[16px] h-0.5 rounded-full transition-colors ${
                    i < step ? 'bg-chai-400' : 'bg-[var(--card-border)]'
                  }`}/>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step card */}
        <motion.div key={step}
          initial={{opacity:0, x:24}} animate={{opacity:1, x:0}}
          transition={{duration:0.18}}
          className="theme-card border rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/10 mb-6">
          <h2 className="text-xl font-bold theme-text mb-0.5">{STEPS[step].label}</h2>
          <p className="text-sm theme-muted mb-6">Step {step + 1} of {STEPS.length}</p>

          <CurrentStep
            data={step === 1 ? data.socials : data}
            set={step === 1 ? setSocial : set}
          />
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button onClick={() => setStep(s => s - 1)} disabled={isFirst}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all ${
              isFirst
                ? 'invisible'
                : 'theme-card border theme-text hover:bg-[var(--bg-subtle)]'
            }`}>
            <ChevronLeft size={16}/>Back
          </button>

          {!isLast
            ? <button onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm bg-chai-500 text-white hover:bg-chai-600 shadow-lg shadow-chai-500/30 transition-all active:scale-95">
                Continue<ChevronRight size={16}/>
              </button>
            : <a href="/"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm bg-chai-500 text-white hover:bg-chai-600 shadow-lg shadow-chai-500/30 transition-all">
                View Your Page<ChevronRight size={16}/>
              </a>
          }
        </div>

      </div>
    </div>
  );
}
