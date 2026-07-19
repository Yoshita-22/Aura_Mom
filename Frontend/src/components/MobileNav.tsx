import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { path: '/',             icon: '🏠', label: 'Home'        },
  { path: '/diet',         icon: '🥗', label: 'Diet'        },
  { path: '/meditation',   icon: '🧘', label: 'Meditate'    },
  { path: '/vision-board', icon: '🖼️', label: 'Vision'     },
  { path: '/affirmations', icon: '✨', label: 'Affirm'      },
];

export default function MobileNav() {
  const { pathname } = useLocation();
  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-items">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            id={`mobile-nav-${item.label.toLowerCase()}`}
            className={`mobile-nav-item ${pathname === item.path ? 'active' : ''}`}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
