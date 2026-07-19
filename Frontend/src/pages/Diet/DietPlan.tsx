import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import MobileNav from '../../components/MobileNav';
import { useApp } from '../../context/AppContext';
import { fetchDietPlan } from '../../lib/api';
import './DietPlan.css';

interface BackendMeal {
  meal: string;
  serving_size: string;
  reason: string;
}

interface NutritionSummary {
  protein_g: number;
  iron_mg: number;
  calcium_mg: number;
  folate_mcg: number;
  fiber_g: number;
  vitamin_c_mg: number;
}

interface DietResponse {
  breakfast: BackendMeal;
  morning_snack: BackendMeal;
  lunch: BackendMeal;
  evening_snack: BackendMeal;
  dinner: BackendMeal;
  nutrition_summary: NutritionSummary;
}

export default function DietPlan() {
  const { userProfile } = useApp();
  const month = userProfile?.pregnancy_month ?? 5;
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const [plan, setPlan] = useState<DietResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDietPlan()
      .then(data => {
        setPlan(data as DietResponse);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Unable to load today's diet plan.");
        setLoading(false);
      });
  }, []);

  const renderMeal = (title: string, icon: string, time: string, mealData?: BackendMeal) => {
    if (!mealData) return null;
    return (
      <div className="meal-card card">
        <div className="meal-card-top">
          <div className="meal-time-badge">{time}</div>
          <span className="meal-icon">{icon}</span>
        </div>
        <h3 className="meal-name">{title}</h3>
        <ul className="meal-items">
          <li><span className="meal-dot" /> <strong>{mealData.meal}</strong></li>
          <li><span className="meal-dot" /> Portion: {mealData.serving_size}</li>
        </ul>
        <div className="meal-nutrients">
          <span className="meal-nutrient-tag" style={{ background: '#A8D5BA22', color: '#A8D5BA', border: `1px solid #A8D5BA44` }}>
            Why? {mealData.reason}
          </span>
        </div>
      </div>
    );
  };

  const getNutrientProgress = (label: string, val: number, goal: number, unit: string, color: string, icon: string) => {
    const pct = Math.min(100, Math.round((val / goal) * 100));
    return (
      <div key={label} className="nutrient-card card">
        <div className="nutrient-top">
          <span className="nutrient-icon">{icon}</span>
          <div className="nutrient-info">
            <div className="nutrient-name">{label}</div>
            <div className="nutrient-amount">
              <strong style={{ color }}>{val}{unit}</strong>
              <span> / {goal}{unit}</span>
            </div>
          </div>
          <div className="nutrient-pct" style={{ color }}>{pct}%</div>
        </div>
        <div className="nutrient-bar-bg">
          <div
            className="nutrient-bar-fill"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <MobileNav />
        <div className="diet-inner">
          <div className="diet-header animate-fade-up">
            <div>
              <h1 className="diet-title serif">🥗 Daily Diet Plan</h1>
              <p className="diet-date">{dateStr}</p>
            </div>
            <div className="diet-month-badge">
              <span className="badge badge-sage">Month {month}</span>
              <span className="badge badge-rose">
                {month <= 3 ? '1st Trimester' : month <= 6 ? '2nd Trimester' : '3rd Trimester'}
              </span>
            </div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <span className="spinner" style={{ borderColor: 'var(--terracotta)', borderRightColor: 'transparent', width: 30, height: 30, marginBottom: 10 }} />
              <p>Preparing your personalized diet plan...</p>
            </div>
          )}

          {error && (
            <div style={{ padding: '2rem', background: '#ffebee', color: '#c62828', borderRadius: 12, marginTop: 20 }}>
              {error}
            </div>
          )}

          {plan && (
            <>
              {plan.nutrition_summary && (
                <section className="nutrient-section animate-fade-up" style={{ animationDelay: '0.1s' }}>
                  <h2 className="section-title serif">Daily Nutrient Profile</h2>
                  <div className="nutrient-grid">
                    {getNutrientProgress('Protein', plan.nutrition_summary.protein_g, 75, 'g', 'var(--warm-clay)', '🥚')}
                    {getNutrientProgress('Iron', plan.nutrition_summary.iron_mg, 27, 'mg', 'var(--terracotta)', '💪')}
                    {getNutrientProgress('Calcium', plan.nutrition_summary.calcium_mg, 1000, 'mg', 'var(--sand-beige)', '🦷')}
                    {getNutrientProgress('Folate', plan.nutrition_summary.folate_mcg, 600, 'mcg', 'var(--olive-green)', '🍃')}
                    {getNutrientProgress('Vitamin C', plan.nutrition_summary.vitamin_c_mg, 85, 'mg', '#F4D35E', '🍊')}
                    {getNutrientProgress('Fiber', plan.nutrition_summary.fiber_g, 28, 'g', '#80DEEA', '🌾')}
                  </div>
                </section>
              )}

              <section className="meal-section animate-fade-up" style={{ animationDelay: `0.35s` }}>
                <div className="meal-section-header">
                  <span className="meal-period-icon">🌅</span>
                  <h2 className="meal-period-title serif">Morning</h2>
                </div>
                <div className="meals-grid">
                  {renderMeal('Breakfast', '🌞', '8:00 AM', plan.breakfast)}
                  {renderMeal('Mid-Morning Snack', '🍎', '11:00 AM', plan.morning_snack)}
                </div>
              </section>

              <section className="meal-section animate-fade-up" style={{ animationDelay: `0.5s` }}>
                <div className="meal-section-header">
                  <span className="meal-period-icon">☀️</span>
                  <h2 className="meal-period-title serif">Afternoon</h2>
                </div>
                <div className="meals-grid">
                  {renderMeal('Lunch', '🍱', '1:30 PM', plan.lunch)}
                  {renderMeal('Evening Snack', '🍵', '5:00 PM', plan.evening_snack)}
                </div>
              </section>

              <section className="meal-section animate-fade-up" style={{ animationDelay: `0.65s` }}>
                <div className="meal-section-header">
                  <span className="meal-period-icon">🌙</span>
                  <h2 className="meal-period-title serif">Night</h2>
                </div>
                <div className="meals-grid">
                  {renderMeal('Dinner', '🍽️', '8:00 PM', plan.dinner)}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
