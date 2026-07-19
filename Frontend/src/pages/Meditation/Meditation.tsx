import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import MobileNav from '../../components/MobileNav';
import { useApp } from '../../context/AppContext';
import { generateMeditation } from '../../lib/api';
import meditationImg from '../../assets/meditation.png';
import './Meditation.css';

const TOTAL_SECONDS = 120;



const AFFIRMATIONS = [
  "I am a powerful, loving mother.",
  "My body is perfectly nourishing my baby.",
  "I choose peace and calm in every moment.",
  "My baby and I are connected in love.",
  "I trust my journey and my body's wisdom.",
];

export default function Meditation() {
  const { signOut, userProfile } = useApp();
  
  // Onboarding States
  const [step, setStep] = useState<'onboarding' | 'loading' | 'player'>('onboarding');
  const [feeling, setFeeling] = useState<string>('');
  const [bothers, setBothers] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');

  // Player States
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [currentScript, setCurrentScript] = useState(0);
  const [affIdx, setAffIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Dynamic Content States
  const [script, setScript] = useState<{time: number, text: string, audio_base64: string}[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const elapsed = TOTAL_SECONDS - timeLeft;

  useEffect(() => {
    if (phase === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          const newTimeLeft = t - 1;
          if (newTimeLeft <= 0) { 
            clearInterval(intervalRef.current!); 
            setPhase('done'); 
            return 0; 
          }
          
          const currentElapsed = TOTAL_SECONDS - newTimeLeft;
          
          setCurrentScript(prev => {
            const next = script.findLastIndex(s => s.time <= currentElapsed);
            if (next > prev && next >= 0 && script[next]?.audio_base64) {
              // Stop previous audio
              if (currentAudioRef.current) {
                currentAudioRef.current.pause();
              }
              // Play new line's audio
              const audio = new Audio(`data:audio/mp3;base64,${script[next].audio_base64}`);
              currentAudioRef.current = audio;
              audio.play().catch(e => console.error("Audio play failed", e));
            }
            return next >= 0 ? next : prev;
          });
          
          return newTimeLeft;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase]);

  const start = () => { 
    setTimeLeft(TOTAL_SECONDS); 
    setPhase('running'); 
    setCurrentScript(0); 
    if (script.length > 0 && script[0].audio_base64) {
      const audio = new Audio(`data:audio/mp3;base64,${script[0].audio_base64}`);
      currentAudioRef.current = audio;
      audio.play().catch(e => console.error("Audio play failed", e));
    }
  };
  const reset = () => { 
    setPhase('idle'); 
    setTimeLeft(TOTAL_SECONDS); 
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((TOTAL_SECONDS - timeLeft) / TOTAL_SECONDS) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const BOTHER_OPTIONS = ["Anxiety", "Can't sleep", "Back pain", "Fear of labour", "Just want to be relax", "Others"];
  const FEELING_OPTIONS = ["Happy 🌸", "Tired 😴", "Anxious 😥", "Calm 🌿", "Overwhelmed 🌪️", "Okay 🙂"];

  const toggleBother = (opt: string) => {
    setBothers(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
  };

  const submitOnboarding = async () => {
    if (!feeling || bothers.length === 0 || (bothers.includes('Others') && !otherText.trim())) return;
    setStep('loading');
    
    try {
      const finalBothers = bothers.map(b => b === 'Others' ? otherText : b);
      const res: any = await generateMeditation(feeling, finalBothers, userProfile?.pregnancy_month || 5);
      
      setScript(res.script);
      setStep('player');
    } catch (e) {
      console.error(e);
      alert("Failed to generate meditation. Please try again.");
      setStep('onboarding');
    }
  };


  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <MobileNav />
        <div className="med-inner">
          {/* Header */}
          <div className="med-header animate-fade-up">
            <h1 className="med-title serif">🧘 Guided Meditation</h1>
            <p className="med-subtitle">2 minutes of deep connection with your baby</p>
          </div>

          {step === 'onboarding' && (
            <div className="med-onboarding animate-fade-up">
              <div className="card med-onboarding-card">
                <h2 className="serif">How are you feeling today?</h2>
                <div className="med-chips">
                  {FEELING_OPTIONS.map(opt => (
                    <button 
                      key={opt}
                      className={`med-chip ${feeling === opt ? 'active' : ''}`}
                      onClick={() => setFeeling(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <h2 className="serif" style={{ marginTop: '2rem' }}>What's bothering you most?</h2>
                <div className="med-chips">
                  {BOTHER_OPTIONS.map(opt => (
                    <button 
                      key={opt}
                      className={`med-chip ${bothers.includes(opt) ? 'active' : ''}`}
                      onClick={() => toggleBother(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {bothers.includes('Others') && (
                  <div className="med-other-input animate-fade-in">
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Please tell us what's bothering you..." 
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                    />
                  </div>
                )}

                <button 
                  className="btn btn-primary w-full" 
                  style={{ marginTop: '2rem' }}
                  onClick={submitOnboarding}
                  disabled={!feeling || bothers.length === 0 || (bothers.includes('Others') && !otherText.trim())}
                >
                  Generate My Meditation ✨
                </button>
              </div>
            </div>
          )}

          {step === 'loading' && (
            <div className="med-loading-screen animate-fade-in">
              <div className="aura-loader">
                <div className="aura-ring"></div>
                <div className="aura-core"></div>
              </div>
              <div className="med-premium-text serif">
                Based on this, AI creates a personalized guided meditation...
              </div>
            </div>
          )}

          {step === 'player' && (
            <div className="med-layout animate-fade-in">
              {/* Main meditation player */}
              <div className="med-player-section">
                {/* Background image */}
                <div className="med-bg-wrapper animate-fade-in">
                  <img src={meditationImg} alt="Meditation" className="med-bg-img" />
                  <div className="med-bg-overlay" />
                </div>

                {/* Timer circle */}
                <div className="med-timer-container animate-fade-up" style={{ animationDelay: '0.2s' }}>
                  <svg className="med-timer-svg" viewBox="0 0 200 200">
                    {/* Decorative rings */}
                    <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    {/* Background track */}
                    <circle
                      cx="100" cy="100" r="90"
                      fill="none"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="8"
                    />
                    {/* Progress arc */}
                    <circle
                      cx="100" cy="100" r="90"
                      fill="none"
                      stroke="url(#medGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 100 100)"
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                    <defs>
                      <linearGradient id="medGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--terracotta)" />
                        <stop offset="100%" stopColor="var(--sand-beige)" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Center content */}
                  <div className="med-timer-center">
                    {phase === 'idle' && <div className="med-idle-icon animate-breathe">🌸</div>}
                    {phase === 'running' && (
                      <>
                        <div className="med-time">{String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}</div>
                        <div className="med-breathe-label animate-breathe">breathe…</div>
                      </>
                    )}
                    {phase === 'done' && <div className="med-done-icon">✨</div>}
                  </div>
                </div>

                {/* Controls */}
                <div className="med-controls animate-fade-up" style={{ animationDelay: '0.3s' }}>
                  {phase === 'idle' && (
                    <button id="med-start" className="btn btn-primary med-start-btn" onClick={start}>
                      🌸 Begin Meditation
                    </button>
                  )}
                  {phase === 'running' && (
                    <button id="med-stop" className="btn btn-ghost med-stop-btn" onClick={reset}>
                      ⏹ Stop
                    </button>
                  )}
                  {phase === 'done' && (
                    <div className="med-done-section animate-fade-up">
                      <h3 className="serif">Session Complete 🌺</h3>
                      <p>Beautiful work, mama. You and your baby just shared a peaceful moment together.</p>
                      <button id="med-again" className="btn btn-primary" onClick={start}>Meditate Again</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Script & info panel */}
              <div className="med-panel">
                {/* AI guidance script */}
                <div className="med-script-card card animate-fade-up" style={{ animationDelay: '0.4s' }}>
                  <div className="med-script-header">
                    <span>🤖</span>
                    <h3 className="serif">AI Guide</h3>
                    {phase === 'running' && <span className="med-live-badge">LIVE</span>}
                  </div>
                  <div className="med-script-text">
                    {phase === 'idle' && (
                      <p className="med-script-placeholder">
                        Your personalized AI meditation guide will speak to you gently once you begin the session. Find a comfortable position, close your eyes, and press Begin. 🌸
                      </p>
                    )}
                    {(phase === 'running' || phase === 'done') && script.length > 0 && (
                      <p className="med-script-active animate-fade-in" key={currentScript}>
                        {script[Math.min(currentScript, script.length - 1)]?.text}
                      </p>
                    )}
                  </div>
                  <div className="med-script-timeline">
                    {script.map((s, i) => (
                      <div key={i} className={`med-timeline-dot ${i <= currentScript && phase !== 'idle' ? 'passed' : ''}`} title={`${s.time}s: ${s.text.slice(0, 30)}...`} />
                    ))}
                  </div>
                </div>

                {/* Affirmations rotator */}
                <div className="med-aff-card card animate-fade-up" style={{ animationDelay: '0.5s' }}>
                  <h3 className="med-aff-title serif">💕 Affirmation</h3>
                  <p className="med-aff-text serif">"{AFFIRMATIONS[affIdx]}"</p>
                  <button
                    id="med-next-aff"
                    className="btn btn-ghost med-aff-btn"
                    onClick={() => setAffIdx(i => (i + 1) % AFFIRMATIONS.length)}
                  >Next affirmation →</button>
                </div>

                {/* Tips */}
                <div className="med-tips-card card animate-fade-up" style={{ animationDelay: '0.6s' }}>
                  <h3 className="med-tips-title">🌿 Before You Begin</h3>
                  <ul className="med-tips-list">
                    {[
                      'Find a quiet, comfortable spot',
                      'Sit or lie down gently',
                      'Put your phone on silent',
                      'Place hands on your belly',
                      'Allow your breath to slow naturally',
                    ].map((t, i) => <li key={i}>✓ {t}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
