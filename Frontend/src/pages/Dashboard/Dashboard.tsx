import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import MobileNav from '../../components/MobileNav';
import { useApp } from '../../context/AppContext';
import './Dashboard.css';

const features = [
  {
    id: 'diet',
    path: '/diet',
    icon: '🥗',
    title: 'Diet Plan',
    desc: "Today's nutrient-rich meal schedule tailored to your trimester",
    badge: 'New today',
    badgeClass: 'badge-sage',
    bg: 'gradient-sage',
    stats: '6 meals planned',
  },
  {
    id: 'meditation',
    path: '/meditation',
    icon: '🧘',
    title: 'Guided Meditation',
    desc: '2-minute AI-guided breathing & visualization for you and baby',
    badge: '2 min',
    badgeClass: 'badge-rose',
    bg: 'gradient-rose',
    stats: 'Start session',
  },
  {
    id: 'vision-board',
    path: '/vision-board',
    icon: '🖼️',
    title: 'Vision Board',
    desc: 'Your dreamy board of hopes, images and affirmations for baby',
    badge: 'Creative',
    badgeClass: 'badge-peach',
    bg: 'gradient-warm',
    stats: 'Open board',
  },
  {
    id: 'affirmations',
    path: '/affirmations',
    icon: '✨',
    title: "Today's Affirmation",
    desc: 'A powerful affirmation seeded just for today to uplift your spirit',
    badge: 'Daily',
    badgeClass: 'badge-gold',
    bg: 'gradient-rose',
    stats: 'Read now',
  },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', emoji: '☀️' };
  if (h < 17) return { text: 'Good afternoon', emoji: '🌤️' };
  if (h < 21) return { text: 'Good evening', emoji: '🌅' };
  return { text: 'Good night', emoji: '🌙' };
}

function getTrimesterLabel(month: number) {
  if (month <= 3) return { label: 'First Trimester', color: 'badge-sage' };
  if (month <= 6) return { label: 'Second Trimester', color: 'badge-rose' };
  return { label: 'Third Trimester', color: 'badge-peach' };
}

export default function Dashboard() {
  const { userProfile } = useApp();
  const { text, emoji } = getGreeting();
  const tri = getTrimesterLabel(userProfile?.pregnancy_month ?? 5);

  const weekOfPregnancy = (userProfile?.pregnancy_month ?? 5) * 4;
  const tips = [
    '💧 Drink at least 8–10 glasses of water today',
    '🚶 A gentle 15-min walk boosts circulation',
    '🎵 Play soft music — baby can hear from month 4!',
    '🌿 Deep breaths reduce cortisol for both of you',
    '📖 Reading aloud to baby strengthens your bond',
  ];
  const dailyTip = tips[new Date().getDay() % tips.length];

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <MobileNav />
        <div className="dashboard-inner">
          {/* Hero Section */}
          <section className="dashboard-hero">
            <div className="dash-blobs">
              <div className="blob" style={{ width: 300, height: 300, background: 'var(--rose)', top: -80, right: -60 }} />
              <div className="blob" style={{ width: 200, height: 200, background: 'var(--peach)', bottom: -40, left: '40%' }} />
            </div>
            <div className="dashboard-hero-content animate-fade-up">
              <div className="dashboard-greeting">
                <span>{emoji}</span>
                <span className="greeting-text">{text}</span>
              </div>
              <h1 className="dashboard-title serif">
                {userProfile?.name ? `Hello, ${userProfile.name.split(' ')[0]}!` : 'Welcome back!'}
              </h1>
              <p className="dashboard-subtitle">
                Week {weekOfPregnancy} of your beautiful journey 🌸
              </p>
              <div className="dashboard-badges">
                <span className={`badge ${tri.color}`}>{tri.label}</span>
                <span className="badge badge-sage">Month {userProfile?.pregnancy_month}</span>
              </div>
            </div>

            {/* Daily tip card */}
            <div className="daily-tip glass animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <span className="daily-tip-label">💡 Daily Tip</span>
              <p className="daily-tip-text">{dailyTip}</p>
            </div>
          </section>

          {/* Stats bar */}
          <div className="dash-stats-bar animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: '🥗', val: '6', label: 'Meals Today' },
              { icon: '💧', val: '8', label: 'Water Glasses' },
              { icon: '🧘', val: '2', label: 'Min Meditation' },
              { icon: '❤️', val: `${weekOfPregnancy}`, label: 'Weeks Along' },
            ].map((s, i) => (
              <div key={i} className="dash-stat-item">
                <span className="dash-stat-icon">{s.icon}</span>
                <span className="dash-stat-val">{s.val}</span>
                <span className="dash-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Feature cards */}
          <section className="dashboard-features">
            <h2 className="section-title serif">Your Wellness Space</h2>
            <div className="features-grid">
              {features.map((f, i) => (
                <Link
                  key={f.id}
                  to={f.path}
                  id={`feature-${f.id}`}
                  className={`feature-card card animate-fade-up`}
                  style={{ animationDelay: `${0.1 * i + 0.4}s` }}
                >
                  <div className={`feature-card-header ${f.bg}`}>
                    <span className="feature-icon">{f.icon}</span>
                    <span className={`badge ${f.badgeClass}`}>{f.badge}</span>
                  </div>
                  <div className="feature-card-body">
                    <h3 className="feature-title">{f.title}</h3>
                    <p className="feature-desc">{f.desc}</p>
                    <div className="feature-footer">
                      <span className="feature-stats">{f.stats}</span>
                      <span className="feature-arrow">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Quote of the day */}
          <section className="quote-section animate-fade-up" style={{ animationDelay: '0.8s' }}>
            <div className="quote-card glass">
              <div className="quote-mark serif">"</div>
              <p className="quote-text serif">
                A mother's womb is the first classroom. Everything you feel, eat, think and love becomes your baby's first lesson.
              </p>
              <span className="quote-author">— Ancient Wisdom 🌸</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
