# LifeBuddy

**An adaptive learning platform for neurodiverse individuals.**

LifeBuddy is a Progressive Web App (PWA) that teaches functional life skills to neurodiverse individuals — from young children through to adults. It personalises the learning experience for each individual using an AI-powered adaptive engine that adjusts difficulty, pacing, and support in real time based on how the learner is performing and feeling.

---

## What It Does

- Delivers functional life skills training across 8 core skill areas
- Adapts to each learner in real time using Bayesian Knowledge Tracing (BKT)
- Monitors learner frustration and adjusts the experience before distress escalates
- Keeps caregivers informed through smart notifications and session reports
- Scales from young children to adults — the preliminary assessment places each learner at the right starting point
- Built for the Kenyan context — local currency, local scenarios, M-Pesa integration

---

## The 8 Functional Skills

| # | Skill | Description |
|---|---|---|
| 1 | Money & Transactions | Identifying KES, paying, receiving change, budgeting, shopping |
| 2 | Time & Planning | Reading a clock, following a schedule, managing time |
| 3 | Digital Safety & Communication | Phone use, messaging, staying safe online |
| 4 | Mobile Money & M-Pesa | Sending money, Lipa na M-Pesa, PIN safety, scam awareness |
| 5 | Communication & Self-Advocacy | Expressing needs, asking for help, knowing your rights |
| 6 | Financial Planning | Budgeting over time, saving, understanding income and expenses |
| 7 | Community & Personal Safety | Healthcare navigation, emergency contacts, community services |
| 8 | Workplace Readiness | Work schedules, following instructions, payslip, workplace rights |

---

## Project Structure

```
LifeBuddy/
├── adaptive-engine/          # Python FastAPI backend — AI adaptive engine
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py             # All API endpoints
│   │   ├── core/
│   │   │   ├── bkt_model.py          # Bayesian Knowledge Tracing engine
│   │   │   ├── adaptation.py         # Adaptation logic and session management
│   │   │   ├── learner_profile.py    # Learner data access layer
│   │   │   ├── rule_engine.py        # Rule-based fallback engine
│   │   │   └── test_bkt_model.py     # 34 unit tests
│   │   ├── db/
│   │   │   └── database.py           # PostgreSQL connection
│   │   ├── models/
│   │   └── rules/
│   │       └── adaptation_rules.json # Rule engine conditions
│   ├── migration_add_bkt_columns.sql # Database migration
│   ├── requirements.txt
│   └── main.py
│
├── client/                   # Frontend PWA (React + TypeScript)
│
└── server/                   # Additional server services
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.13, FastAPI, Uvicorn |
| AI Engine | Bayesian Knowledge Tracing (custom implementation) |
| Database | PostgreSQL 18 |
| ORM | SQLAlchemy 2.0 |
| Frontend | React, TypeScript, Vite |
| Mobile | Progressive Web App (PWA) |

---

## Getting Started

### Prerequisites
- Python 3.13
- PostgreSQL 18
- Node.js (for the frontend client)

---

### 1. Clone the repository

```bash
git clone https://github.com/Mbuvi-c/LifeBuddy.git
cd LifeBuddy
```

---

### 2. Set up the adaptive engine

```bash
cd adaptive-engine
python -m venv venv

# Windows
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate

pip install -r requirements.txt
```

---

### 3. Configure environment variables

Create a `.env` file inside `adaptive-engine/`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lifebuddy
DB_USER=postgres
DB_PASSWORD=your_password_here
ENGINE_PORT=8000
```

> ⚠️ Never commit the `.env` file. It is excluded by `.gitignore`.

---

### 4. Set up the database

Create the database in PostgreSQL:

```sql
CREATE DATABASE lifebuddy;
```

Run the BKT migration to add the adaptive engine columns:

```bash
psql -U postgres -d lifebuddy -f migration_add_bkt_columns.sql
```

---

### 5. Start the adaptive engine

```bash
uvicorn app.main:app --reload
```

The engine runs at `http://127.0.0.1:8000`

API documentation is available at `http://127.0.0.1:8000/docs`

---

### 6. Run the tests

```bash
python -m pytest app/core/ -v
```

All 34 tests should pass.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/adapt/session/start/{learner_id}` | Start a session — resets frustration, applies mastery decay |
| POST | `/adapt/session/log` | Log a task attempt — updates BKT and returns adaptation config |
| POST | `/adapt/session/end/{learner_id}` | End session — returns full summary |
| GET | `/adapt/adapt/{learner_id}` | Get current adaptation config for a learner |
| GET | `/adapt/skill/next/{learner_id}` | Get recommended next skill |
| GET | `/adapt/notifications/{caregiver_id}` | Get unread caregiver notifications |
| POST | `/adapt/notifications/{notification_id}/read` | Mark notification as read |
| GET | `/adapt/health` | Health check |

---

## How the Adaptive Engine Works

### Bayesian Knowledge Tracing (BKT)
After every task attempt, the engine estimates the probability that the learner has truly mastered the skill — not just whether they got the answer right. It uses four parameters per skill:

- **P(L0)** — Prior mastery: how likely the learner already knows this skill
- **P(T)** — Learning rate: how likely they learn it from one attempt
- **P(S)** — Slip: how likely they get it wrong even when they know it
- **P(G)** — Guess: how likely they get it right without knowing it

### Frustration Index
Tracks the learner's emotional state (0.0 – 1.0) in real time:

| Level | Range | Action |
|---|---|---|
| Normal | 0.0 – 0.29 | BKT drives adaptation |
| Caution | 0.30 – 0.59 | Hold difficulty, show check-in message |
| High | 0.60 – 0.79 | Force easy tier regardless of mastery |
| Critical | 0.80 – 1.00 | End session, alert caregiver |

### Difficulty Tiers
Three tiers per skill — easy, medium, hard. Requires **3 consecutive signals** before changing tier, preventing jarring difficulty jumps for neurodiverse learners.

### Mastery Decay
Skills fade without practice. Mastery decreases by 2% per day of inactivity, applied automatically when a new session starts. Never drops below the prior mastery value.

### Caregiver Notifications
Every critical frustration peak is logged silently. A notification is sent to the caregiver after every **3rd consecutive peak** — avoiding alert fatigue while ensuring caregivers are informed of sustained distress.

---

## Session Log Request — Example

```json
{
  "learner_id": "uuid-here",
  "simulation_type": "daily_living",
  "task_type": "money_transaction",
  "success": true,
  "skill": "money_transactions",
  "response_type": "correct",
  "hints_used": 0,
  "quit_signal": false,
  "response_time": 4500,
  "attempt_number": 1
}
```

---

## Session Log Response — Example

```json
{
  "learner_id": "uuid-here",
  "learner_name": "Test Learner",
  "difficulty_tier": 2,
  "mastery": 0.43,
  "hci_config": {
    "hint_frequency": "medium",
    "pacing": "normal",
    "feedback_type": "audio_visual",
    "prompt_modality": "visual",
    "scaffolding_level": "partial"
  },
  "frustration_index": 0.0,
  "frustration_status": {
    "level": "normal",
    "action": "bkt_drives",
    "notify_caregiver": false,
    "checkin_message": null,
    "message": "Normal. BKT driving adaptation."
  },
  "next_skill": "time_planning",
  "source": "bkt",
  "explanation": "Mastery money_transactions: 0.150 → 0.433 after 'correct'. Tier: 2. Frustration: 0.000 → 0.000 (normal)."
}
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Description of what you did"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request into `dev`

Please do not push directly to `main`.

---

## Roadmap

- [x] Adaptive engine — BKT model
- [x] Frustration index and caregiver notifications
- [x] Session management and mastery decay
- [x] 8 consolidated functional skills
- [ ] Preliminary assessment — caregiver and learner onboarding
- [ ] Learning modules — animated scenes with voice narration
- [ ] Simulation and assessment — interactive skill scenarios
- [ ] Caregiver dashboard UI
- [ ] Full PWA frontend

---

## License

Private — all rights reserved. LifeBuddy, 2026.
