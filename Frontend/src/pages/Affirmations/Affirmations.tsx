import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import MobileNav from '../../components/MobileNav';
import { useApp } from '../../context/AppContext';
import './Affirmations.css';

const ALL_AFFIRMATIONS = [
  { text: "I am strong, capable, and designed for this beautiful journey.", category: "Strength", emoji: "💪", color: "var(--terracotta)" },
  { text: "My body knows exactly how to grow and nurture my perfect baby.", category: "Trust", emoji: "🌸", color: "var(--sand-beige)" },
  { text: "Every breath I take fills my baby with love and oxygen.", category: "Connection", emoji: "💕", color: "var(--olive-green)" },
  { text: "I release all worry and embrace the peace that lives within me.", category: "Peace", emoji: "🕊️", color: "var(--warm-clay)" },
  { text: "My baby is healthy, safe, and growing beautifully each day.", category: "Faith", emoji: "✨", color: "var(--terracotta)" },
  { text: "I am exactly the mother my baby needs and wants.", category: "Love", emoji: "🌺", color: "var(--sand-beige)" },
  { text: "I choose joy, and my joy becomes my baby's first gift.", category: "Joy", emoji: "🌈", color: "var(--olive-green)" },
  { text: "I am not alone. I am held by love, by life, and by grace.", category: "Support", emoji: "🤗", color: "var(--warm-clay)" },
  { text: "My intuition guides me perfectly as a mother.", category: "Wisdom", emoji: "🦋", color: "var(--terracotta)" },
  { text: "I welcome this new chapter with an open, grateful heart.", category: "Gratitude", emoji: "🙏", color: "var(--sand-beige)" },
  { text: "My love for my baby grows deeper with every heartbeat.", category: "Love", emoji: "❤️", color: "var(--olive-green)" },
  { text: "I nourish my body and my baby nourishes my soul.", category: "Nourishment", emoji: "🥗", color: "var(--warm-clay)" },
  { text: "This moment, right now, is where miracles are being made.", category: "Presence", emoji: "🌙", color: "var(--terracotta)" },
  { text: "I am patient, gentle, and endlessly loving with myself.", category: "Self-love", emoji: "🌿", color: "var(--sand-beige)" },
  { text: "My baby feels my calm and grows in perfect harmony.", category: "Harmony", emoji: "🎵", color: "var(--olive-green)" },
];

function getTodaysAffirmation() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return ALL_AFFIRMATIONS[dayOfYear % ALL_AFFIRMATIONS.length];
}

export default function Affirmations() {
  const { signOut } = useApp();
  const todayAff = getTodaysAffirmation();
  const [currentIdx, setCurrentIdx] = useState(ALL_AFFIRMATIONS.findIndex(a => a.text === todayAff.text));
  const [flipped, setFlipped] = useState(false);
  const [bookmarked, setBookmarked] = useState<string[]>([todayAff.text]);
  const [view, setView] = useState<'card' | 'all'>('card');

  const current = ALL_AFFIRMATIONS[currentIdx];

  const goNext = () => {
    setFlipped(false);
    setTimeout(() => setCurrentIdx(i => (i + 1) % ALL_AFFIRMATIONS.length), 100);
  };
  const goPrev = () => {
    setFlipped(false);
    setTimeout(() => setCurrentIdx(i => (i - 1 + ALL_AFFIRMATIONS.length) % ALL_AFFIRMATIONS.length), 100);
  };
  const toggleBookmark = (text: string) => {
    setBookmarked(b => b.includes(text) ? b.filter(t => t !== text) : [...b, text]);
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <MobileNav />
        <div className="aff-inner">
          {/* Header */}
          <div className="aff-header animate-fade-up">
            <div>
              <h1 className="aff-title serif">✨ Daily Affirmations</h1>
              <p className="aff-date">{dateStr}</p>
            </div>
            <div className="aff-view-toggle">
              <button id="aff-view-card" className={`aff-toggle-btn ${view === 'card' ? 'active' : ''}`} onClick={() => setView('card')}>Card View</button>
              <button id="aff-view-all" className={`aff-toggle-btn ${view === 'all' ? 'active' : ''}`} onClick={() => setView('all')}>All Affirmations</button>
            </div>
          </div>

          {view === 'card' && (
            <>
              {/* Today's affirmation highlight */}
              <div className="today-aff-banner glass animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <span className="today-badge">Today's Affirmation ✨</span>
                <p className="today-aff-text serif">"{todayAff.text}"</p>
                <div className="today-aff-meta">
                  <span>{todayAff.emoji} {todayAff.category}</span>
                  <span style={{ color: 'var(--mauve-soft)' }}>Seeded for {dateStr}</span>
                </div>
              </div>

              {/* Flip card carousel */}
              <div className="aff-carousel-section animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="section-title serif">Explore More</h2>
                <div className="aff-carousel">
                  <button id="aff-prev" className="aff-nav-btn" onClick={goPrev}>‹</button>

                  <div
                    id="aff-card"
                    className={`aff-flip-card ${flipped ? 'flipped' : ''}`}
                    onClick={() => setFlipped(f => !f)}
                  >
                    <div className="aff-flip-inner">
                      {/* Front */}
                      <div className="aff-flip-front" style={{ background: `linear-gradient(135deg, ${current.color}22, ${current.color}44)`, borderColor: `${current.color}55` }}>
                        <span className="aff-card-emoji animate-breathe">{current.emoji}</span>
                        <p className="aff-card-text serif">"{current.text}"</p>
                        <span className="aff-card-hint">tap to flip ✦</span>
                      </div>
                      {/* Back */}
                      <div className="aff-flip-back" style={{ background: `linear-gradient(135deg, ${current.color}55, ${current.color}88)` }}>
                        <span className="aff-back-category">{current.category}</span>
                        <p className="aff-back-instruction serif">
                          Close your eyes. Breathe in deeply. Repeat this affirmation 3 times, feeling its truth in your heart. 🌸
                        </p>
                        <div className="aff-back-repeat">
                          {[1, 2, 3].map(n => (
                            <span key={n} className="aff-repeat-num">{n}×</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button id="aff-next" className="aff-nav-btn" onClick={goNext}>›</button>
                </div>

                <div className="aff-card-actions">
                  <button
                    id="aff-bookmark"
                    className={`btn ${bookmarked.includes(current.text) ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => toggleBookmark(current.text)}
                  >
                    {bookmarked.includes(current.text) ? '💕 Saved' : '🤍 Save'}
                  </button>
                  <div className="aff-dots">
                    {ALL_AFFIRMATIONS.slice(0, 8).map((_, i) => (
                      <button key={i} id={`aff-dot-${i}`} className={`aff-dot ${currentIdx === i ? 'active' : ''}`} onClick={() => setCurrentIdx(i)} />
                    ))}
                    {ALL_AFFIRMATIONS.length > 8 && <span className="aff-dot-more">+{ALL_AFFIRMATIONS.length - 8}</span>}
                  </div>
                  <button id="aff-share" className="btn btn-outline">📤 Share</button>
                </div>
              </div>

              {/* Bookmarked */}
              {bookmarked.length > 0 && (
                <section className="aff-saved-section animate-fade-up" style={{ animationDelay: '0.4s' }}>
                  <h2 className="section-title serif">💕 Your Saved Affirmations</h2>
                  <div className="aff-saved-grid">
                    {bookmarked.map(text => {
                      const aff = ALL_AFFIRMATIONS.find(a => a.text === text);
                      if (!aff) return null;
                      return (
                        <div key={text} className="aff-saved-card" style={{ borderLeft: `4px solid ${aff.color}` }}>
                          <span className="aff-saved-emoji">{aff.emoji}</span>
                          <p className="aff-saved-text">"{text}"</p>
                          <button className="aff-saved-remove" onClick={() => toggleBookmark(text)}>✕</button>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          )}

          {view === 'all' && (
            <div className="aff-all-grid animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {ALL_AFFIRMATIONS.map((aff, i) => (
                <div key={i} id={`aff-all-${i}`} className="aff-all-card card">
                  <div className="aff-all-top">
                    <span style={{ fontSize: '1.5rem' }}>{aff.emoji}</span>
                    <span className="badge" style={{ background: aff.color + '22', color: aff.color }}>{aff.category}</span>
                    {aff.text === todayAff.text && <span className="badge badge-rose">Today</span>}
                  </div>
                  <p className="aff-all-text serif">"{aff.text}"</p>
                  <button
                    className={`aff-bookmark-small ${bookmarked.includes(aff.text) ? 'saved' : ''}`}
                    onClick={() => toggleBookmark(aff.text)}
                  >
                    {bookmarked.includes(aff.text) ? '💕' : '🤍'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
