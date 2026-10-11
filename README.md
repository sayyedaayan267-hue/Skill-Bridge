# SkillBridge — Student Career & Skill Development Platform

SkillBridge is a comprehensive career intelligence and skill development platform designed specifically for college computer science students and fresh engineering graduates. It bridges the critical divide between university academic coursework and industry employment readiness through automated skill assessments, role-based gap analysis, portfolio showcase management, technical MCQs, and structured learning roadmaps.

Engineered as a showcase for a college Full Stack Java (FSJ) Capstone Project and software development portfolio.

---

## 1. Key Platform Features

- **Personalized Career Readiness Index (0 - 100)**: Transparent, deterministic multi-factor calculation assessing role match (40%), portfolio projects (25%), technical assessments (20%), and roadmap task completion (15%).
- **Interactive Career Skill Gap Analyzer**: Benchmark against 5 predefined industry roles (*Frontend Developer*, *Java Developer*, *Data Analyst*, *Full Stack Developer*, *Software Testing Engineer*) to instantly identify matching competencies, partial deficits, and missing requirements.
- **Direct 1-Click Roadmap Generation**: Push actionable skill deficit remediation tasks directly into the personalized learning planner.
- **Project Portfolio Manager & Recruiter Preview**: Catalog GitHub repositories, live deployments, and architecture overviews. Generate a clean public portfolio preview with shareable URL copying.
- **Technical Assessment Center**: 32+ original technical MCQs across HTML5, CSS3, JavaScript (ES6+), SQL transactions, and CS foundations with timed countdown, question palette, score histories, and in-depth rationales.
- **Curated Internship Explorer & Pipeline Tracker**: 10+ realistic sample opportunities categorized by work mode (Remote, Hybrid, On-site) with pipeline stage management (Saved, Applied, Interview, Offered, Rejected).
- **Personal Learning Roadmap Planner**: Milestone task tracking with priority badges, due date countdowns, overdue alerts, and an active learning streak tracker.
- **Admin Demonstration Console**: Administrative CRUD operations to curate internship listings and MCQ question banks.
- **Theme Engine & LocalStorage Portability**: High-contrast Deep Navy Dark Mode and crisp Light Mode with instant JSON backup export/import and reliable factory reset.

---

## 2. Technology Stack

- **HTML5**: Semantic document structure, accessible ARIA attributes, clean document object model.
- **CSS3**: Custom design system with CSS custom properties (`var(--...)`), Flexbox & CSS Grid layouts, glassmorphism surface backdrops, responsive viewports, and zero-pill typographic discipline.
- **Vanilla JavaScript (ES6+)**: Modular architecture (`import` / `export`), reactive in-memory Pub/Sub state dispatcher (`State`), and LocalStorage persistence.
- **Chart.js**: Dynamic data visualizations for skill distribution (doughnut) and weekly learning study activity (bar chart).
- **Lucide Icons**: Consistent, modern SVG icon library rendered via client helper.
- **Google Fonts**: Modern neo-grotesque display typography (`Plus Jakarta Sans`) paired with monospace tabular figures (`JetBrains Mono`).

> **Architectural Note**: This version is built strictly as a client-side static web application with LocalStorage persistence. No Node.js build process, bundler compilation, or Java backend is required to run the website.

---

## 3. Project Architecture

```
skillbridge/
├── index.html                  # Public SaaS landing page & product preview
├── pages/
│   ├── login.html              # Demo sign in with quick credentials autofill
│   ├── register.html           # Student demo profile registration
│   ├── dashboard.html          # Main student cockpit with KPI stats & Chart.js
│   ├── skills.html             # Skills inventory management (CRUD, filters, sort)
│   ├── career-analyzer.html    # Role-skill gap comparison for 5 industry paths
│   ├── projects.html           # Project portfolio manager & recruiter view
│   ├── assessments.html        # Technical MCQ quiz engine & rationales
│   ├── internships.html        # Opportunity explorer & pipeline kanban
│   ├── roadmap.html            # Learning planner & study streak counter
│   ├── profile.html            # Student profile & external social links
│   ├── settings.html           # Theme selector, JSON export/import, reset
│   └── admin.html              # Demo admin hub for listings & question banks
├── css/
│   ├── variables.css           # Design tokens, colors, radii, light/dark themes
│   ├── global.css              # Typography, layout containers, tabular nums
│   ├── components.css          # Buttons, forms, modals, toasts, tables, badges
│   ├── landing.css             # Landing hero, feature cards, FAQ accordion
│   └── dashboard.css           # Workspace layout, collapsible sidebar, stat cards
├── js/
│   ├── app.js                  # Global module entry & bootstrapper
│   ├── storage.js              # Centralized LocalStorage wrapper & schema init
│   ├── state.js                # Reactive Pub/Sub state store for all entities
│   ├── auth-demo.js            # Demo session management & route guard
│   ├── data.js                 # Default demo dataset (profile, skills, questions)
│   ├── analytics.js            # Career readiness formula & gap computation
│   ├── validation.js           # XSS sanitization & input format validators
│   ├── components.js           # Shared sidebar/header layout, modal dialogs, toasts
│   └── pages/                  # Page-specific controllers
│       ├── dashboard.js
│       ├── skills.js
│       ├── career-analyzer.js
│       ├── projects.js
│       ├── assessments.js
│       ├── internships.js
│       ├── roadmap.js
│       ├── profile.js
│       ├── settings.js
│       └── admin.js
└── README.md
```

---

## 4. Career Readiness Score Formula

SkillBridge calculates the overall Career Readiness Score (0 to 100) using a transparent weighted multi-factor formula documented in `js/analytics.js`:

$$\text{Overall Score} = \text{round}(0.40 \times S_{\text{match}} + 0.25 \times P_{\text{portfolio}} + 0.20 \times A_{\text{quiz}} + 0.15 \times R_{\text{roadmap}})$$

1. **Role Skill Alignment ($S_{\text{match}}$ — 40% weight)**:
   - Compares the student's recorded proficiencies against the target role's weighted requirements.
   - Proficiencies are normalized: Beginner = 40%, Intermediate = 75%, Advanced = 100%.
   - Missing skills contribute 0 points; partial matches earn proportional weight.
2. **Project Portfolio Quality ($P_{\text{portfolio}}$ — 25% weight)**:
   - 25 points per completed project (up to 75 points max).
   - 15 points per project in progress (up to 15 points max).
   - 5 points per verified repository/live deployment link (up to 10 points bonus).
3. **Technical Assessments ($A_{\text{quiz}}$ — 20% weight)**:
   - Unweighted average percentage across all completed diagnostic MCQ quizzes.
   - If no quizzes have been completed, evaluates to 0% and clearly notes that an assessment is required to earn this component.
4. **Learning Roadmap Milestones ($R_{\text{roadmap}}$ — 15% weight)**:
   - Percentage of completed tasks: $(\text{completed} / \text{total}) \times 100$.

---

## 5. Demonstration Setup & Credentials

### Local Quickstart

Since the application is 100% static standard HTML5/CSS3/ES6+, you can run it using any static server:

```bash
# Option A: Python Built-in Server
python3 -m http.server 3000

# Option B: Node http-server or Vite
npx serve .
# Or via Vite
npm run dev
```

Open `http://localhost:3000` in any modern web browser (Chrome, Firefox, Safari, Edge).

### Pre-Configured Demo Credentials

On the sign-in page (`pages/login.html`), click the **Quick Fill** button or enter:
- **Email**: `alex.rivera@university.edu`
- **Password**: `Password123!`

---

## 6. Verification & Quality Test Checklist

The following tests were executed across all views:

- [x] **Page Navigation**: Seamless navigation across landing page and all 11 subpages via top bar and collapsible sidebar.
- [x] **Theme Persistence**: Dark mode and light mode toggle updates CSS variables instantly and persists in LocalStorage.
- [x] **Session Authentication**: Unauthenticated navigation to `/pages/dashboard.html` redirects to login; signing in creates an active session.
- [x] **Skills Inventory CRUD**: Added skills appear immediately, update category filters, and recalibrate dashboard analytics.
- [x] **Role Gap Analysis**: Switching between the 5 roles recalculates match percentages and generates high-priority recommendations.
- [x] **Roadmap Dispatch**: Clicking "Add to Roadmap" from the gap analyzer schedules a task due in 14 days and reflects on the roadmap dashboard.
- [x] **Project Portfolio**: Creation and editing of projects works; verified links open in new tabs; recruiter preview displays correctly.
- [x] **Quiz Engine**: Timed countdown works, option selection is stored, question palette highlights answered questions, auto-evaluates upon submission, and presents full explanations.
- [x] **Application Pipeline**: Stage updates (e.g. from Saved to Applied or Interview) dynamically update the pipeline count.
- [x] **JSON Export & Import**: Data exports as a valid JSON file and restores correctly upon upload.
- [x] **Factory Reset**: Restores all data stores back to initial defaults with a confirmation modal.

---

## 7. Known Architectural Limitations & Future Roadmap

- **Storage Limitation**: All data resides in the client's browser `LocalStorage`. Clearing browser cache will reset data unless an exported backup is imported.
- **Demonstration Security**: Passwords and mock sessions are stored locally for educational demonstration and are not intended for production multi-tenant environments.
- **Future Enhancements**:
  - Connect to a Spring Boot / Java RESTful microservice backend with PostgreSQL persistence.
  - Implement real OAuth 2.0 / JWT token authentication.
  - Integrate live GitHub GraphQL APIs to verify commit activity and repository stars.
  - Integrate real-time interview scheduling with WebRTC video mock screens.
