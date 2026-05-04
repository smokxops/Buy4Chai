import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Link2, CreditCard, Paintbrush, Code2,
  Check, ChevronRight, ChevronLeft, Copy, ExternalLink,
  Github, Twitter, Globe, Linkedin,
  AlertTriangle, Info, CheckCircle2, Zap, Shield, Image as ImageIcon,
  MessageSquare, Coffee, Plus, Trash2, DollarSign
} from 'lucide-react';

const STEPS = [
  { id: 'identity',  label: 'Identity',    icon: User },
  { id: 'narrative', label: 'Narrative',   icon: MessageSquare },
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

function Field({ label, hint, required, error, children }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold theme-text mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs theme-muted mb-2">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-500 mt-1 font-bold">{error}</p>}
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

function IdentityStep({ data, set, errors }) {
  return (
    <div className="space-y-4">
      <InfoBox icon={Info} color="blue" title="Your public profile">
        This shows up on your supporter page. Use your real name and a friendly bio.
      </InfoBox>

      <Field label="Your Name" required error={errors.name} hint="First name or full name — whatever you go by publicly.">
        <Input value={data.name} onChange={v => set('name', v)} placeholder="Arjun Sharma"/>
      </Field>

      <Field label="One-line Bio" required error={errors.bio} hint="Tell supporters what you build. Keep it short.">
        <Textarea value={data.bio} onChange={v => set('bio', v)} rows={2}
          placeholder="I build open source tools and write about web dev. Every chai helps!"/>
      </Field>

      <Field label="Avatar Image URL" error={errors.avatar} hint="Read the options below before pasting.">
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
        </p>
      </InfoBox>
    </div>
  );
}

/* ---- Step 2: Narrative (Story & Projects) ---- */

function NarrativeStep({ data, set }) {
  const addImage = () => set('images', [...data.images, '']);
  const updateImage = (i, v) => {
    const next = [...data.images];
    next[i] = v;
    set('images', next);
  };
  const removeImage = (i) => set('images', data.images.filter((_, idx) => idx !== i));

  const addProject = () => set('projects', [...data.projects, { name: '', description: '', link: '', image: '' }]);
  const updateProject = (i, k, v) => {
    const next = [...data.projects];
    next[i] = { ...next[i], [k]: v };
    set('projects', next);
  };
  const removeProject = (i) => set('projects', data.projects.filter((_, idx) => idx !== i));
  const moveProject = (i, dir) => {
    const next = [...data.projects];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    set('projects', next);
  };

  return (
    <div className="space-y-6">
      <Field label="My Story" hint="Tell your story. Why do you build? What's your mission?">
        <Textarea value={data.story} onChange={v => set('story', v)} rows={5}
          placeholder="I'm a developer from India..."/>
      </Field>

      <div>
        <label className="block text-sm font-semibold theme-text mb-3 flex justify-between items-center">
          Gallery Images
          <button onClick={addImage} className="text-xs bg-chai-500 text-white px-2 py-1 rounded-lg flex items-center gap-1">
            <Plus size={12}/> Add Image
          </button>
        </label>
        <div className="space-y-2">
          {data.images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <Input value={img} onChange={v => updateImage(i, v)} placeholder="https://unsplash.com/..."/>
              <button onClick={() => removeImage(i)} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl">
                <Trash2 size={18}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold theme-text mb-3 flex justify-between items-center">
          Pinned Projects
          <button onClick={addProject} className="text-xs bg-chai-500 text-white px-2 py-1 rounded-lg flex items-center gap-1">
            <Plus size={12}/> Add Project
          </button>
        </label>
        <div className="space-y-4">
          {data.projects.map((p, i) => (
            <div key={i} className="p-4 rounded-2xl border border-[var(--card-border)] bg-[var(--bg-subtle)] space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold uppercase tracking-wider opacity-50">Project #{i+1}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveProject(i, -1)} disabled={i === 0} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30">
                    <ChevronLeft size={16} className="rotate-90"/>
                  </button>
                  <button onClick={() => moveProject(i, 1)} disabled={i === data.projects.length - 1} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30">
                    <ChevronLeft size={16} className="-rotate-90"/>
                  </button>
                  <button onClick={() => removeProject(i)} className="ml-2 text-red-400 hover:text-red-500">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
              <Input value={p.name} onChange={v => updateProject(i, 'name', v)} placeholder="Project Name"/>
              <Input value={p.description} onChange={v => updateProject(i, 'description', v)} placeholder="Short description"/>
              <Input value={p.link} onChange={v => updateProject(i, 'link', v)} placeholder="https://github.com/..."/>
              <Input value={p.image} onChange={v => updateProject(i, 'image', v)} placeholder="Preview Image URL"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Step 3: Socials ---- */

function SocialsStep({ data, set }) {
  const fields = [
    { key: 'github',   label: 'GitHub',   icon: <Github   size={15}/>, prefix: 'github.com/',      placeholder: 'yourusername' },
    { key: 'twitter',  label: 'Twitter',  icon: <Twitter  size={15}/>, prefix: 'twitter.com/',     placeholder: 'yourhandle' },
    { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={15}/>, prefix: 'linkedin.com/in/', placeholder: 'your-profile' },
    { key: 'website',  label: 'Website',  icon: <Globe    size={15}/>, prefix: null,               placeholder: 'https://yoursite.com' },
  ];
  return (
    <div className="space-y-4">
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

/* ---- Step 4: Gateway ---- */

function GatewayStep({ data, set, errors }) {
  const isRazorpay = data.gateway === 'razorpay';

  return (
    <div className="space-y-6">
      <Field label="Which payment gateway?" required>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'razorpay', name: 'Razorpay',      desc: 'Best for India' },
            { id: 'dodo',     name: 'Dodo Payments',  desc: 'Best for Global' },
          ].map(gw => (
            <button key={gw.id} onClick={() => set('gateway', gw.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                data.gateway === gw.id
                  ? 'border-chai-500 bg-chai-50 dark:bg-chai-950/40 shadow-md'
                  : 'border-[var(--card-border)] bg-[var(--bg-subtle)] hover:border-chai-300'
              }`}>
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold theme-text text-sm">{gw.name}</p>
                {data.gateway === gw.id && <CheckCircle2 size={16} className="text-chai-500"/>}
              </div>
              <p className="text-xs theme-muted">{gw.desc}</p>
            </button>
          ))}
        </div>
      </Field>

      <div className="space-y-4">
        <Field
          label={isRazorpay ? "Razorpay Key ID" : "Dodo Product ID"}
          required
          error={errors.gatewayKey}
          hint={isRazorpay ? "Starts with rzp_live_ or rzp_test_" : "Starts with prod_"}
        >
          <Input value={data.gatewayKey} onChange={v => set('gatewayKey', v)} placeholder={isRazorpay ? "rzp_live_..." : "prod_..."}/>
        </Field>

        {isRazorpay ? (
          <InfoBox icon={Shield} color="blue" title="How to get your Razorpay Key ID">
            <ol className="list-decimal ml-4 space-y-1 mt-2">
              <li>Log in to your <strong>Razorpay Dashboard</strong>.</li>
              <li>Go to <strong>Account & Settings</strong> → <strong>API Keys</strong>.</li>
              <li>Copy the <strong>Key ID</strong>.</li>
              <li className="text-red-500 font-bold italic">Never share or paste your Key Secret here!</li>
            </ol>
          </InfoBox>
        ) : (
          <InfoBox icon={Zap} color="blue" title="How to get your Dodo Product ID">
            <ol className="list-decimal ml-4 space-y-1 mt-2">
              <li>Log in to <strong>Dodo Payments</strong>.</li>
              <li>Create a <strong>Product</strong> (One-time payment).</li>
              <li>Copy the <strong>Product ID</strong> from the product list.</li>
              <li>Ensure <strong>Static Payment Links</strong> are enabled.</li>
            </ol>
          </InfoBox>
        )}

        <InfoBox icon={AlertTriangle} color="amber" title="Security Warning">
          Buy4Chai is a static site. This means your config file is public.
          <strong> Only ever use Public/Client keys.</strong> If a gateway asks for a "Secret" or "Private" key,
          do NOT put it in this project.
        </InfoBox>
      </div>
    </div>
  );
}

/* ---- Step 5: Customize ---- */

function CustomizeStep({ data, set }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primary Currency" hint="Your gateway's currency.">
          <Input value={data.currency} onChange={v => set('currency', v)} placeholder="INR"/>
        </Field>
        <Field label="Display Currency" hint="Secondary toggle.">
          <Input value={data.displayCurrency} onChange={v => set('displayCurrency', v)} placeholder="USD"/>
        </Field>
      </div>

      <Field label="Exchange Rate" hint={`1 ${data.displayCurrency} = X ${data.currency}`}>
        <Input type="number" value={data.exchangeRate} onChange={v => set('exchangeRate', parseFloat(v))} placeholder="83.5"/>
      </Field>

      <Field label="Suggested Amounts (USD)" hint="Comma-separated values in USD.">
        <Input value={data.suggestedAmounts.join(', ')}
          onChange={v => set('suggestedAmounts', v.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n)))}
          placeholder="2, 5, 10, 25"/>
      </Field>

      <Field label="Default Amount (USD)">
        <Input type="number" value={data.defaultAmount} onChange={v => set('defaultAmount', parseFloat(v))} placeholder="5"/>
      </Field>

      <Field label="Thank You Message">
        <Textarea value={data.thankYouMessage} onChange={v => set('thankYouMessage', v)} rows={2}
          placeholder="You made my day!"/>
      </Field>
    </div>
  );
}

/* ---- Step 6: Generated Config ---- */

function ConfigStep({ data }) {
  const [copied, setCopied] = useState(false);

  const output = [
    '// chai.config.js — edit this and deploy',
    'export default {',
    `  name: ${JSON.stringify(data.name)},`,
    `  avatar: ${JSON.stringify(data.avatar)},`,
    `  bio: ${JSON.stringify(data.bio)},`,
    `  story: ${JSON.stringify(data.story)},`,
    '  images: ' + JSON.stringify(data.images, null, 2) + ',',
    '  projects: ' + JSON.stringify(data.projects, null, 2) + ',',
    '  socials: ' + JSON.stringify(data.socials, null, 2) + ',',
    `  gateway: "${data.gateway}",`,
    `  gatewayKey: "${data.gatewayKey}",`,
    `  currency: "${data.currency}",`,
    `  displayCurrency: "${data.displayCurrency}",`,
    `  exchangeRate: ${data.exchangeRate},`,
    `  suggestedAmounts: ${JSON.stringify(data.suggestedAmounts)},`,
    `  defaultAmount: ${data.defaultAmount},`,
    `  thankYouMessage: "${data.thankYouMessage}",`,
    `  showSetup: false, // Set to true to re-enable the /#setup route`,
    `  setupKey: "${Math.random().toString(36).substring(2, 10)}", // Secret key for /#setup?key=...`,
    '}'
  ].join('\n');

  return (
    <div className="space-y-5">
      <InfoBox icon={Shield} color="green" title="Production & Security Tips">
        <ul className="list-disc ml-4 space-y-1">
          <li>Your config now includes <code className="bg-black/10 px-1 rounded">showSetup: false</code>. This hides this wizard from the public.</li>
          <li>A random <code className="bg-black/10 px-1 rounded">setupKey</code> has been generated. To access this wizard later, use <code className="bg-black/10 px-1 rounded">/#setup?key=YOUR_KEY</code>.</li>
        </ul>
      </InfoBox>
      <div className="relative">
        <pre className="theme-input border rounded-2xl p-5 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre">
{output}
        </pre>
        <button onClick={() => { copyToClipboard(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            copied ? 'bg-green-500 text-white' : 'theme-card border theme-text hover:bg-[var(--bg-subtle)]'
          }`}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

/* ---- Root SetupPage ---- */

const STEP_COMPONENTS = [IdentityStep, NarrativeStep, SocialsStep, GatewayStep, CustomizeStep, ConfigStep];

export default function SetupPage({ dark, toggleDark }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '', bio: '', avatar: '',
    story: '', images: [], projects: [],
    socials: { github: '', twitter: '', linkedin: '', website: '' },
    gateway: 'razorpay', gatewayKey: '',
    currency: 'INR', displayCurrency: 'USD', exchangeRate: 83.5,
    suggestedAmounts: [2, 5, 10, 25], defaultAmount: 5,
    thankYouMessage: '',
  });

  const [errors, setErrors] = useState({});

  const set       = (k, v) => {
    setData(d => ({ ...d, [k]: v }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: null }));
  };
  const setSocial = (k, v) => setData(d => ({ ...d, socials: { ...d.socials, [k]: v } }));

  const validate = () => {
    const newErrors = {};
    if (step === 0) {
      if (!data.name) newErrors.name = "Name is required";
      if (!data.bio) newErrors.bio = "Bio is required";
      if (data.avatar && !data.avatar.startsWith('http') && !data.avatar.startsWith('/')) {
        newErrors.avatar = "Avatar must be a valid URL or local path (starting with /)";
      }
    }
    if (step === 3) {
      if (!data.gatewayKey) newErrors.gatewayKey = "Gateway key is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validate()) setStep(s => s + 1);
  };

  const CurrentStep = (props) => {
    const Comp = STEP_COMPONENTS[step];
    return <Comp {...props} errors={errors} />;
  };

  return (
    <div className="min-h-screen theme-bg transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-5 py-10">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Buy4Chai" className="w-9 h-9"/>
            <p className="font-bold theme-text text-lg">Setup Wizard</p>
          </div>
          <button onClick={toggleDark} className="w-10 h-10 flex items-center justify-center rounded-full theme-card border shadow-sm">
            {dark ? '☀️' : '🌙'}
          </button>
        </header>

        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => i <= step && setStep(i)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                i === step ? 'bg-chai-500 text-white' : i < step ? 'bg-chai-100 dark:bg-chai-900/50 text-chai-600' : 'bg-[var(--bg-subtle)] theme-muted'
              }`}>
              <s.icon size={13}/> <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        <motion.div key={step} initial={{opacity:0, x:20}} animate={{opacity:1, x:0}}
          className="theme-card border rounded-3xl p-6 sm:p-8 shadow-xl mb-6">
          <CurrentStep
            data={step === 2 ? data.socials : data}
            set={step === 2 ? setSocial : set}
          />
        </motion.div>

        <div className="flex justify-between">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="px-5 py-3 rounded-2xl border theme-text disabled:opacity-0">Back</button>
          {step < STEPS.length - 1
            ? <button onClick={nextStep} className="px-6 py-3 rounded-2xl bg-chai-500 text-white font-bold">Continue</button>
            : <a href="/" className="px-6 py-3 rounded-2xl bg-chai-500 text-white font-bold">View Page</a>
          }
        </div>
      </div>
    </div>
  );
}
