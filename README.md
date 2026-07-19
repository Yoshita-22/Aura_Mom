# 🌸 AuraMom

AuraMom is an AI-powered pregnancy wellness companion that provides personalized nutrition, emotional support, positive affirmations, and guided meditation to help expecting mothers experience a healthier and happier pregnancy.

---

# 🚨 Problem Statement

Many pregnant women experience stress, anxiety, loneliness, and confusion due to the lack of personalized guidance on nutrition, mental wellness, and healthy daily habits. Most rely on random internet advice, which is often confusing and unreliable.

According to the **World Health Organization (WHO)**, **1 in 5 women experience mental health conditions during pregnancy or after childbirth**, yet many receive little or no timely support.

AuraMom bridges this gap by providing personalized, AI-powered wellness support throughout pregnancy.

---

# 💡 Solution

AuraMom understands every mother's pregnancy stage, profession, and emotional well-being to provide personalized care instead of generic advice.

It helps mothers maintain both physical and mental wellness through AI-powered nutrition guidance, emotional support, and guided meditation.

---

# ✨ Features

## 🥗 Personalized Daily Diet
- AI-generated daily diet plans
- Personalized based on pregnancy month, profession, and nutritional requirements
- Provides estimated daily nutrient intake
- Avoids repeating previous day's meals

## 🧘 Personalized Guided Meditation
- Understands the mother's current mood and concerns
- Generates personalized meditation scripts
- Supports:
  - Sleep Meditation
  - Relaxation Meditation
  - Body Scan Meditation
  - Stress Relief Meditation
- Uses a **cloned Hume AI Voice Agent** to convert the meditation script into a natural, soothing voice
- Plays calming background music for a relaxing experience

## ✨ Daily Affirmations
- Personalized positive affirmations
- Encourages confidence and emotional well-being

## 🌅 Vision Board
- Inspiring visuals that encourage positive thinking and healthy habits

---

# 🤖 AI Used

## Gemini API
Used for:
- Personalized diet generation
- Meditation script generation
- Daily affirmations

## Hume AI
Used for:
- Cloned Voice Agent
- Natural Text-to-Speech
- Calm guided meditation voice generation

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| React.js | Frontend |
| FastAPI | Backend APIs |
| Gemini API | Personalized AI content generation |
| Hume AI | Cloned Voice Agent & Text-to-Speech |
| Supabase | Authentication & Database |

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone <repository-url>
cd AuraMom
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Runs on:

```
http://localhost:5173
```

---

## Backend Setup

Create a virtual environment:

```bash
python -m venv venv
```

Activate it:

### Windows

```bash
venv\Scripts\activate
```

### Linux/macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## Environment Variables

Create a `.env` file inside the backend folder.

```env
SUPABASE_URL=

SUPABASE_KEY=

GEMINI_API_KEY=

HUME_API_KEY=

HUME_VOICE_ID=
```

---

## Hume AI Setup

1. Create a Hume AI account.
2. Clone your preferred meditation guide voice.
3. Copy the following credentials:
   - API Key
   - Secret Key
   - Voice ID
4. Add them to the `.env` file.
5. AuraMom automatically converts AI-generated meditation scripts into natural voice using the cloned voice agent.

---

## Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

---

# 📌 API Endpoints

## Profile

```
POST   /profile
GET    /profile
PUT    /profile
```

## Diet Plan

```
GET    /diet-plan/today
```

## Guided Meditation

```
POST   /meditation
```

Example Request

```json
{
  "mood": "Anxious",
  "concern": "Fear of labour"
}
```

Example Response

```json
{
  "script": "...",
  "audio_url": "..."
}
```

---

# 🌱 Future Enhancements

- AI Pregnancy Assistant
- Doctor Consultation
- Weekly Pregnancy Insights
- Smart Daily Reminders
- Wearable Device Integration
- Multi-language Support

---

# ❤️ Vision

To empower every expecting mother with personalized AI-driven wellness support, helping them enjoy a healthier pregnancy and giving every child the best possible start in life.
