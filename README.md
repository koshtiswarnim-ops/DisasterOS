# 🚀 CareerNexus | Job Portal & Technical Interview Preparation Hub

An all-in-one, developer-focused platform designed to streamline tech job discovery, master Data Structures & Algorithms, practice aptitude and core CS subjects with timed quizzes, simulate HR interviews with real-time feedback, and research recruitment patterns of top-tier tech companies.

![Platform](https://img.shields.io/badge/Platform-Web%20SPA-00f2fe?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-8a2be2?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-f59e0b?style=for-the-badge)

---

## 🌟 Key Features

### 💼 1. Job Board & Placement Portal
- **Advanced Filtering**: Filter roles by employment type (Full-time, Remote, Internship) and experience level (Fresher, 0-2 yrs, 2-5 yrs).
- **Interactive Job Drawer**: Slide-in panel displaying full job descriptions, qualification requirements, compensation ranges, and company perks.
- **Application Tracker**: Submit resumes (simulated PDF/DOCX uploads) and track submitted applications with persistent status tags.
- **Recruiter Posting Portal**: Post new career openings on the fly with immediate listing propagation.

### 📚 2. Preparation Hub (Notes & Timed Quizzes)
- **Quantitative & Logical Aptitude**: Formulas and practice questions for Time & Work, Percentages, Profit & Loss, and Syllogisms.
- **Core Computer Science Subjects**: Comprehensive revision notes on DBMS (ACID, Normalization, Joins) and Operating Systems (Process States, CPU Scheduling, Deadlocks).
- **Interactive Timer Quizzes**: 60-second countdown tests per question, real-time score calculation, and detailed answer explanations.
- **LaTeX Math Support**: Integrated MathJax for mathematical and algorithmic equations.

### 💻 3. Dedicated DSA Preparation Sheet
- **Curated Topic Sheets**: Structured problems covering Arrays & Hashing, Two Pointers, Sliding Window, Linked Lists, Trees, and Dynamic Programming.
- **Progress Telemetry**: Circular radial SVG progress tracker, difficulty breakdowns (Easy, Medium, Hard), and problem check-offs saved in `localStorage`.
- **Revision Flags & Custom Notes**: Pin problems for rapid revision and write personal solution notes and Big-O complexities.
- **In-Browser Code Sandbox**: Split-pane code editor with starter code templates, test cases, and a real-time JavaScript test execution terminal.

### 🤖 4. HR AI Interview Simulator
- **Interactive Chat Interface**: Practice with AI Interviewer *Elena* on standard behavioral frameworks (Present-Past-Future, STAR method).
- **Live Textual Analytics**: Real-time evaluation of response word count, readability score, and keyword density matching (e.g., *passion, adaptability, problem solving, leadership*).

### 🏢 5. Company Hiring Blueprints
- Detailed breakdown of hiring stages, online assessment (OA) patterns, exam syllabi, eligibility criteria (GPA, backlog policies), and verified candidate interview logs for:
  - **Google**
  - **Amazon**
  - **Microsoft**
  - **TCS**

### ⚖️ 6. Trust, Privacy & Legal Governance
- **Privacy Policy**: 10-section GDPR/CCPA-aligned policy explaining our local-first client architecture, data security, and resume handling.
- **Interactive Data Controls**: Live diagnostic card displaying current stored records with one-click **"Export Data (JSON)"** and **"Purge Local Data"** (Right to Erasure).
- **Terms of Service**: Comprehensive rules establishing fair hiring practices, candidate integrity, and code ownership guarantees (candidates retain 100% intellectual property of their sandbox solutions).

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: Vanilla HTML5, Modern ES6+ JavaScript.
- **Styling**: Vanilla CSS3 using custom properties (`:root`), glassmorphic cards (`backdrop-filter`), cyber neon accents, and smooth micro-animations.
- **Data Persistence**: HTML5 `localStorage` for offline persistence across page reloads.
- **Formula Rendering**: MathJax v3 for KaTeX-compatible mathematical formulas.
- **Zero Build Dependencies**: Runs instantly out of the box without requiring Node.js, Webpack, or npm configurations.

---

## 📂 Project Directory Structure

```text
├── index.html       # Semantic HTML5 layout, modals, header nav, and footer
├── styles.css       # Design system, glassmorphism tokens, and responsive styles
├── data.js          # Central data store (jobs, prep notes, DSA problems, blueprints)
├── app.js           # Client-side router, quiz timers, code sandbox, and HR simulator
└── README.md        # Comprehensive documentation
```

---

## 🚀 Getting Started

No installation or build setup is required.

1. Clone or download this repository:
   ```bash
   git clone https://github.com/koshtiswarnim-ops/DisasterOS.git
   ```
2. Navigate to the project directory:
   ```bash
   cd DisasterOS
   ```
3. Open `index.html` directly in any web browser (Chrome, Edge, Firefox, Brave):
   - **Windows**: Double-click `index.html` or run `start index.html` in PowerShell.
   - **Mac/Linux**: Run `open index.html` or `xdg-open index.html`.

Alternatively, enable **GitHub Pages** in your repository settings under **Settings > Pages > Deploy from branch (main / root)** for an instant free live web deployment!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
