import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import MobileNav from '../../components/MobileNav';
import { useApp } from '../../context/AppContext';
import './VisionBoard.css';

interface BoardCard {
  id: string;
  type: 'affirmation' | 'dream' | 'goal';
  content: string;
  emoji: string;
  color: string;
}

const DEFAULT_CARDS: BoardCard[] = [
  { id: '1', type: 'dream', content: 'A peaceful home filled with laughter and love 🏡', emoji: '🏡', color: 'var(--soft-cream)' },
  { id: '2', type: 'affirmation', content: 'My baby is healthy, happy, and growing perfectly', emoji: '💕', color: 'var(--sand-beige)' },
  { id: '3', type: 'goal', content: 'I will walk 15 minutes in fresh air every day', emoji: '🌿', color: 'var(--olive-green)' },
  { id: '4', type: 'dream', content: 'First smile, first steps, first word — I will treasure every moment', emoji: '👶', color: 'var(--warm-clay)' },
  { id: '5', type: 'affirmation', content: 'I am calm, strong, and ready to welcome my baby', emoji: '🌸', color: 'var(--terracotta)' },
  { id: '6', type: 'goal', content: 'Nourish my body with wholesome food every meal', emoji: '🥗', color: 'var(--sand-beige)' },
];

const CARD_COLORS = [
  'var(--terracotta)', 'var(--sand-beige)', 'var(--warm-clay)',
  'var(--soft-cream)', 'var(--olive-green)', 'var(--cream-dark)',
];
const CARD_EMOJIS = ['🌸', '💕', '🌿', '👶', '✨', '🌺', '💫', '🤰', '🦋', '🌙'];

const BABY_PICTURES = [
  { id: 1, url: 'https://res.cloudinary.com/gtvnnl4d/image/upload/f_auto,q_auto/download_3_f0h7an' },
  { id: 2, url: 'https://res.cloudinary.com/gtvnnl4d/image/upload/f_auto,q_auto/download_1_yvzeaq' },
  { id: 3, url: 'https://res.cloudinary.com/gtvnnl4d/image/upload/f_auto,q_auto/download_1_hyiduf' },
  { id: 4, url: 'https://res.cloudinary.com/gtvnnl4d/image/upload/f_auto,q_auto/download_2_fam2uk' },
  { id: 5, url: 'https://res.cloudinary.com/gtvnnl4d/image/upload/f_auto,q_auto/download_4_nvgb3q' },
  { id: 6, url: 'https://res.cloudinary.com/gtvnnl4d/image/upload/f_auto,q_auto/download_5_d7dwpi' },
  { id: 7, url: 'https://res.cloudinary.com/gtvnnl4d/image/upload/f_auto,q_auto/download_k30zsm' },
  { id: 8, url: 'https://res.cloudinary.com/gtvnnl4d/image/upload/f_auto,q_auto/download_dlfzt1' },
  { id: 9, url: 'https://res.cloudinary.com/gtvnnl4d/image/upload/f_auto,q_auto/Easy_Less_than_One_Hour_Crochet_Baby_Hat_jfiamk' },
  { id: 10, url: 'https://res.cloudinary.com/gtvnnl4d/image/upload/f_auto,q_auto/هو_طفل_تربى_في_قصر_يغلب__عليه_القسوة_يحاسب_على__ذنب_لم_يرتكبه__تائها_عاطفية_عاطفية_amreading_books_wattpad_bifwxe' },
];

export default function VisionBoard() {
  const { userProfile } = useApp();
  const [cards, setCards] = useState<BoardCard[]>(DEFAULT_CARDS);
  const [newContent, setNewContent] = useState('');
  const [newEmoji, setNewEmoji] = useState('🌸');
  const [newColor, setNewColor] = useState(CARD_COLORS[0]);
  const [showAdd, setShowAdd] = useState(false);

  const addCard = () => {
    if (!newContent.trim()) return;
    const card: BoardCard = {
      id: Date.now().toString(),
      type: 'dream',
      content: newContent.trim(),
      emoji: newEmoji,
      color: newColor,
    };
    setCards(c => [card, ...c]);
    setNewContent('');
    setShowAdd(false);
  };

  const removeCard = (id: string) => setCards(c => c.filter(card => card.id !== id));

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <MobileNav />
        <div className="vb-inner">
          {/* Header */}
          <div className="vb-header animate-fade-up">
            <div>
              <h1 className="vb-title serif">🖼️ Vision Board</h1>
              <p className="vb-subtitle">
                {userProfile?.name ? `${userProfile.name}'s` : 'Your'} dreams, hopes, and intentions for baby 🌸
              </p>
            </div>
            <button id="vb-add-btn" className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
              {showAdd ? '✕ Cancel' : '+ Add Card'}
            </button>
          </div>

          {/* Add card form */}
          {showAdd && (
            <div className="vb-add-form glass animate-fade-up">
              <h3 className="serif vb-add-title">Create a new vision card</h3>
              <textarea
                id="vb-new-content"
                className="input vb-textarea"
                placeholder="Write your dream, goal or affirmation..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={3}
              />
              <div className="vb-add-options">
                <div>
                  <label className="label">Emoji</label>
                  <div className="vb-emoji-grid">
                    {CARD_EMOJIS.map(e => (
                      <button key={e} id={`emoji-${e}`} className={`vb-emoji-btn ${newEmoji === e ? 'active' : ''}`} onClick={() => setNewEmoji(e)}>{e}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Card Color</label>
                  <div className="vb-color-grid">
                    {CARD_COLORS.map(c => (
                      <button key={c} className={`vb-color-swatch ${newColor === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setNewColor(c)} />
                    ))}
                  </div>
                </div>
              </div>
              <button id="vb-save-card" className="btn btn-primary" onClick={addCard} disabled={!newContent.trim()}>
                ✨ Add to Board
              </button>
            </div>
          )}

          {/* Board cards */}
          <section className="vb-board animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="vb-cards-grid">
              {cards.map((card, i) => (
                <div
                  key={card.id}
                  className="vb-card animate-fade-up"
                  style={{ background: card.color, animationDelay: `${i * 0.07 + 0.1}s` }}
                >
                  <button
                    id={`vb-remove-${card.id}`}
                    className="vb-card-remove"
                    onClick={() => removeCard(card.id)}
                    title="Remove card"
                  >✕</button>
                  <span className="vb-card-emoji">{card.emoji}</span>
                  <p className="vb-card-text serif">{card.content}</p>
                  <span className="vb-card-type">{card.type}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Baby Pictures gallery */}
          <section className="vb-inspiration animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="section-title serif">👶 Beautiful Beginnings</h2>
            <div className="baby-pictures-grid">
              {BABY_PICTURES.map((pic) => (
                <div key={pic.id} className="baby-picture-card card">
                  <img src={pic.url} alt="Happy baby" loading="lazy" />
                </div>
              ))}
            </div>
          </section>

          {/* Quote */}
          <div className="vb-quote glass animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <span className="vb-quote-mark serif">"</span>
            <p className="serif">What you visualize with love becomes the reality your baby enters. Dream boldly, mama.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
