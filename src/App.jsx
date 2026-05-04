import React, { useState, useEffect } from 'react';
import SupporterPage from './SupporterPage.jsx';
import SetupPage from './SetupPage.jsx';
import config from '../chai.config.js';

/**
 * Simple hash router — no react-router needed.
 *   /         →  SupporterPage  (what supporters see)
 *   /#setup   →  SetupPage      (developer onboarding wizard)
 */
export default function App() {
  const [hash, setHash]   = useState(window.location.hash);
  const [dark, setDark]   = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Keep hash state in sync with browser navigation
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Apply dark class to <html> whenever dark state changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const toggleDark = () => setDark(d => !d);
  const isSetup = hash === '#setup';

  const themeStyles = config.theme ? `
    :root {
      ${config.theme.light?.bg ? `--bg: ${config.theme.light.bg};` : ''}
      ${config.theme.light?.bgSubtle ? `--bg-subtle: ${config.theme.light.bgSubtle};` : ''}
      ${config.theme.light?.card ? `--card: ${config.theme.light.card};` : ''}
      ${config.theme.light?.cardBorder ? `--card-border: ${config.theme.light.cardBorder};` : ''}
      ${config.theme.light?.inputBg ? `--input-bg: ${config.theme.light.inputBg};` : ''}
      ${config.theme.light?.textPrimary ? `--text-primary: ${config.theme.light.textPrimary};` : ''}
      ${config.theme.light?.textMuted ? `--text-muted: ${config.theme.light.textMuted};` : ''}
      ${config.theme.light?.textFaint ? `--text-faint: ${config.theme.light.textFaint};` : ''}
    }
    .dark {
      ${config.theme.dark?.bg ? `--bg: ${config.theme.dark.bg};` : ''}
      ${config.theme.dark?.bgSubtle ? `--bg-subtle: ${config.theme.dark.bgSubtle};` : ''}
      ${config.theme.dark?.card ? `--card: ${config.theme.dark.card};` : ''}
      ${config.theme.dark?.cardBorder ? `--card-border: ${config.theme.dark.cardBorder};` : ''}
      ${config.theme.dark?.inputBg ? `--input-bg: ${config.theme.dark.inputBg};` : ''}
      ${config.theme.dark?.textPrimary ? `--text-primary: ${config.theme.dark.textPrimary};` : ''}
      ${config.theme.dark?.textMuted ? `--text-muted: ${config.theme.dark.textMuted};` : ''}
      ${config.theme.dark?.textFaint ? `--text-faint: ${config.theme.dark.textFaint};` : ''}
    }
  ` : '';

  return (
    <>
      {config.theme && <style>{themeStyles}</style>}
      {isSetup
        ? <SetupPage dark={dark} toggleDark={toggleDark}/>
        : <SupporterPage dark={dark} toggleDark={toggleDark}/>}
    </>
  );
}
