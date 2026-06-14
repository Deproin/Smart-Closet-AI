# Smart Closet AI – الخزانة الذكية 🧠👗

Smart Closet AI is a premium, full-stack AI-powered wardrobe system. Organize your clothes, get weather-aware outfit suggestions, and discover the perfect color harmonies for your style.

## 🚀 Key Features
- **Smart Closet:** Add items via AI image recognition (Auto-tagging category/color).
- **Hybrid AI Engine:** Recommendation system combining ML-based user preferences with rule-based styling logic.
- **Weather-Aware:** suggestions adapted to your local temperature and conditions.
- **Cross-Platform:** Available as a Responsive Web App (Next.js) and Mobile App (Flutter).
- **Continuous Learning:** The system learns from your liked and rejected outfits to improve over time.

## 🛠️ Technical Stack
- **Backend:** FastAPI (Python), PostgreSQL, SQLAlchemy, JWT Auth.
- **Frontend (Web):** Next.js 14, Tailwind CSS, Framer Motion.
- **Mobile:** Flutter (Dart) with BLoC Architecture.
- **AI Layers:** YOLOv8 (Recognition), CLIP (Similarity), Custom Hybrid Engine.

## 📂 Project Structure
```text
Smart Closet AI/
├── backend/            # FastAPI REST API
│   ├── app/            # Core logic, models, routes
│   └── requirements.txt
├── frontend/           # React/Next.js Web Application
│   ├── src/            # Components, pages, styles
│   └── package.json
├── mobile/             # Flutter Mobile Application
└── docs/               # API & Architectural Documentation
```

## ⚙️ Installation & Setup

### 1. Backend Setup
1. Navigate to `backend/`
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `source venv/bin/activate` (Mac/Linux) or `.\venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `uvicorn app.main:app --reload`

### 2. Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

---

Built with ❤️ by Antigravity AI
