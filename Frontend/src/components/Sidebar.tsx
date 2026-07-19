import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Sidebar.css';

const navItems = [
  { path: '/',             icon: '🏠', label: 'Dashboard'  },
  { path: '/diet',         icon: '🥗', label: 'Diet Plan'  },
  { path: '/meditation',   icon: '🧘', label: 'Meditation' },
  { path: '/vision-board', icon: '🖼️', label: 'Vision Board' },
  { path: '/affirmations', icon: '✨', label: 'Affirmations' },
  { path: '/profile',      icon: '👤', label: 'Profile'      },
];

export default function Sidebar() {
  const { userProfile, signOut } = useApp();
  const { pathname } = useLocation();

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo-icon">🌸</span>
        <span className="sidebar-logo-text serif">Aura Mom</span>
      </div>

      {userProfile && (
        <div className="sidebar-profile">
          <div className="sidebar-avatar">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="sidebar-name">{userProfile.name}</div>
            <div className="sidebar-month">Month {userProfile.pregnancy_month} 🌙</div>
          </div>
        </div>
      )}

      <ul className="sidebar-nav">
        {navItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              id={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              className={`sidebar-nav-item ${pathname === item.path ? 'active' : ''}`}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label">{item.label}</span>
              {pathname === item.path && <span className="sidebar-active-dot" />}
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <button id="logout-btn" className="sidebar-logout" onClick={signOut}>
          <span>🚪</span> Sign Out
        </button>
        <p className="sidebar-tagline serif">Nurture from within 🌸</p>
      </div>
    </nav>
  );
}
