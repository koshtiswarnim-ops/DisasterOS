// app.js - CareerNexus Application Logic

// ==========================================================================
// 1. Initial State & Global Configurations
// ==========================================================================
let state = {
  currentTab: 'home',
  solvedProblems: [],
  revisionProblems: [],
  problemNotes: {},
  appliedJobs: [],
  recruiterJobs: [],
  quizHighscores: {},
  streakCount: 1,
  lastActiveDate: '',
  
  // Quiz specific state
  activeQuizTopic: null,
  activeQuizType: null, // 'aptitude' or 'technical'
  currentQuestionIndex: 0,
  quizAnswers: [],
  quizTimeRemaining: 0,
  quizTimerInterval: null,
  
  // HR Mock State
  hrCurrentQuestionIdx: 0,
  hrHistory: [],
  
  // Job filters
  jobFilterQuery: '',
  jobFilterTypes: [],
  jobFilterExperiences: []
};

// Initialize app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  loadLocalStorageState();
  updateStreak();
  setupEventListeners();
  navigateTo('home');
});

// Load persistent data from localStorage
function loadLocalStorageState() {
  state.solvedProblems = JSON.parse(localStorage.getItem('cn_solved_problems')) || [];
  state.revisionProblems = JSON.parse(localStorage.getItem('cn_revision_problems')) || [];
  state.problemNotes = JSON.parse(localStorage.getItem('cn_problem_notes')) || {};
  state.appliedJobs = JSON.parse(localStorage.getItem('cn_applied_jobs')) || [];
  state.recruiterJobs = JSON.parse(localStorage.getItem('cn_recruiter_jobs')) || [];
  state.quizHighscores = JSON.parse(localStorage.getItem('cn_quiz_highscores')) || {};
  state.streakCount = parseInt(localStorage.getItem('cn_streak_count')) || 1;
  state.lastActiveDate = localStorage.getItem('cn_last_active_date') || '';
}

// Save specific state to localStorage
function saveState(key, data) {
  localStorage.setItem('cn_' + key, JSON.stringify(data));
}

// Update Study Streak based on daily access
function updateStreak() {
  const today = new Date().toISOString().split('T')[0];
  if (state.lastActiveDate) {
    const lastDate = new Date(state.lastActiveDate);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      state.streakCount += 1;
      showToast("Streak updated! Let's keep learning! 🔥", "success");
    } else if (diffDays > 1) {
      state.streakCount = 1;
    }
  } else {
    state.streakCount = 1;
  }
  state.lastActiveDate = today;
  localStorage.setItem('cn_streak_count', state.streakCount);
  localStorage.setItem('cn_last_active_date', today);
  
  // Update UI badge
  document.getElementById('nav-streak-count').innerText = state.streakCount;
}

// Setup global DOM event listeners
function setupEventListeners() {
  // Mobile Nav Toggle
  const toggleBtn = document.getElementById('btn-mobile-toggle');
  const navMenu = document.getElementById('app-nav');
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      toggleBtn.classList.toggle('active');
    });
  }
}

// Navigation router
function navigateTo(tabName) {
  state.currentTab = tabName;
  
  // Close mobile nav on click
  document.getElementById('app-nav').classList.remove('active');
  document.getElementById('btn-mobile-toggle').classList.remove('active');

  // Update navbar links active states
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.id === 'link-' + tabName) {
      link.classList.add('active');
    }
  });

  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = '';
  
  // Stop any active timers
  clearInterval(state.quizTimerInterval);

  switch (tabName) {
    case 'home':
      renderHome();
      break;
    case 'jobs':
      renderJobPortal();
      break;
    case 'prep':
      renderPrepPortal();
      break;
    case 'dsa':
      renderDsaSheet();
      break;
    case 'companies':
      renderCompanyGuides();
      break;
    case 'privacy':
      renderPrivacyPolicy();
      break;
    case 'terms':
      renderTermsOfService();
      break;
    default:
      renderHome();
  }

  // Scroll to top
  window.scrollTo(0, 0);
  
  // Run MathJax for formulas
  if (window.MathJax) {
    setTimeout(() => {
      window.MathJax.typesetPromise().catch(err => console.log('MathJax formatting error:', err));
    }, 100);
  }
}

// Show standard toast notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Basic markdown compiler to render styled text safely
function parseMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^\s*-\s(.*$)/gim, '<li>$1</li>');

  // Wrap list items
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1<\/ul>');
  // Deduplicate nesting ul tags
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  
  return html;
}

// ==========================================================================
// 2. Home Dashboard Page
// ==========================================================================
function renderHome() {
  const container = document.getElementById('main-content');
  
  // Calculate stats
  const totalJobs = window.JOBS_DATA.length + state.recruiterJobs.length;
  
  let totalDsa = 0;
  window.DSA_SHEET_DATA.forEach(t => totalDsa += t.problems.length);
  const solvedCount = state.solvedProblems.length;
  
  const dsaPercentage = totalDsa > 0 ? Math.round((solvedCount / totalDsa) * 100) : 0;
  
  const html = `
    <div class="container fade-in">
      
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-text">
          <h1>Accelerate Your Tech Placement Readiness</h1>
          <p>CareerNexus is an all-in-one workspace designed to help you practice DSA sheet challenges, run timer-based technical tests, write mock interviews, and land jobs.</p>
          <div class="hero-actions">
            <button class="btn btn-primary" onclick="navigateTo('dsa')">Explore DSA Sheet</button>
            <button class="btn btn-secondary" onclick="navigateTo('prep')">Practice Quizzes</button>
          </div>
        </div>
        <div class="hero-image-wrapper">
          <div class="hero-graphic float-animation"></div>
        </div>
      </section>

      <!-- Global Placement Stats -->
      <section class="stats-banner glass-card">
        <div class="stat-card">
          <div class="stat-val">${totalJobs}</div>
          <div class="stat-label">Active Openings</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${solvedCount}/${totalDsa}</div>
          <div class="stat-label">DSA Solved</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${dsaPercentage}%</div>
          <div class="stat-label">Placement Readiness</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${state.streakCount} 🔥</div>
          <div class="stat-label">Active Streak</div>
        </div>
      </section>

      <!-- Navigation tiles -->
      <h2 class="section-headline">Study Pathways</h2>
      <div class="nav-tiles-grid">
        
        <div class="glass-card tile-card" onclick="navigateTo('jobs')">
          <div class="tile-icon">💼</div>
          <h3>Job Portal</h3>
          <p>Explore full-time placement listings, remote positions, and track submitted resumes.</p>
          <span class="tile-link">View listings</span>
        </div>

        <div class="glass-card tile-card" onclick="navigateTo('prep')">
          <div class="tile-icon">✏️</div>
          <h3>Interview Quizzes</h3>
          <p>Test your knowledge on Quantitative Aptitude, DBMS, Operating Systems, and HR behavioral response mocks.</p>
          <span class="tile-link">Take a test</span>
        </div>

        <div class="glass-card tile-card" onclick="navigateTo('dsa')">
          <div class="tile-icon">💻</div>
          <h3>DSA Topic Sheet</h3>
          <p>Over 100 interview problems categorized by topics with built-in code editor compilation tools.</p>
          <span class="tile-link">Open workspace</span>
        </div>

        <div class="glass-card tile-card" onclick="navigateTo('companies')">
          <div class="tile-icon">🏢</div>
          <h3>Company Blueprints</h3>
          <p>Analyze test patterns, eligibility criteria, and past interview transcripts of recruiters.</p>
          <span class="tile-link">Read blueprints</span>
        </div>

      </div>

      <!-- Featured job entries -->
      <div class="featured-jobs-section">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <h2 class="section-headline" style="margin-bottom:0;">Featured Job Opportunities</h2>
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('jobs')">Explore All</button>
        </div>
        <div class="featured-jobs-list" id="home-jobs-container">
          <!-- Rendered below -->
        </div>
      </div>

    </div>
  `;
  
  container.innerHTML = html;
  renderFeaturedJobs();
}

function renderFeaturedJobs() {
  const container = document.getElementById('home-jobs-container');
  if (!container) return;

  const allJobs = [...window.JOBS_DATA, ...state.recruiterJobs];
  const list = allJobs.slice(0, 2);

  if (list.length === 0) {
    container.innerHTML = "<div class='no-results-placeholder'>No jobs listed yet.</div>";
    return;
  }

  let html = '';
  list.forEach(job => {
    html += `
      <div class="glass-card job-card" style="grid-template-columns: auto 1fr; margin-bottom: 0;">
        <div class="company-logo-badge" style="background-color: ${job.logoColor || '#8a2be2'};">
          ${job.company.substring(0, 2).toUpperCase()}
        </div>
        <div class="job-info-block">
          <div class="job-title-row">
            <h3>${job.title}</h3>
            <span class="badge badge-info">${job.type}</span>
          </div>
          <p style="font-weight: 600; color: var(--primary-cyan); font-size: 0.9rem;">${job.company}</p>
          <div class="job-meta-row" style="margin-top:0.25rem;">
            <div class="job-meta-item">📍 ${job.location}</div>
            <div class="job-meta-item">💰 ${job.salary}</div>
          </div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

// ==========================================================================
// 3. Job Portal Section
// ==========================================================================
function renderJobPortal() {
  const container = document.getElementById('main-content');
  
  // Set default tabs if not set
  let activeSubTab = 'all-jobs';

  const renderContent = () => {
    let mainAreaHtml = '';
    
    if (activeSubTab === 'all-jobs') {
      mainAreaHtml = `
        <div class="search-bar-wrapper">
          <input type="text" id="job-search-input" class="search-input" placeholder="Search job roles, companies, or tech skills..." value="${state.jobFilterQuery}" oninput="handleJobSearchChange(this.value)">
          <button class="btn btn-primary" onclick="togglePostJobModal(true)">Post a Job</button>
        </div>
        <div class="jobs-list-container" id="portal-jobs-list-target">
          <!-- Jobs list rendered dynamically -->
        </div>
      `;
    } else {
      // Applications tracker list
      mainAreaHtml = `
        <div class="glass-card app-tracker-card fade-in">
          <h3 style="margin-bottom: 1.5rem;">Resumes & Submissions</h3>
          ${state.appliedJobs.length === 0 ? `
            <div class="no-results-placeholder">
              <span class="placeholder-icon">📄</span>
              <p>You have not applied to any careers yet.</p>
              <button class="btn btn-primary btn-sm" style="margin-top: 1rem;" onclick="document.getElementById('tab-all-jobs').click()">Apply for Jobs</button>
            </div>
          ` : `
            <table class="app-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Tracking Status</th>
                </tr>
              </thead>
              <tbody>
                ${state.appliedJobs.map(app => {
                  const allJobs = [...window.JOBS_DATA, ...state.recruiterJobs];
                  const jobDetails = allJobs.find(j => j.id === app.jobId) || { title: 'Unknown Role', company: 'Unknown Company' };
                  
                  // Calculate mock status label class
                  let statusClass = 'applied';
                  if (app.status === 'Interviewing') statusClass = 'interviewing';
                  if (app.status === 'Offered') statusClass = 'offered';

                  return `
                    <tr>
                      <td style="font-weight: 600; color: var(--text-white);">${jobDetails.title}</td>
                      <td>${jobDetails.company}</td>
                      <td style="color: var(--text-muted);">${app.date}</td>
                      <td><span class="app-status ${statusClass}">${app.status}</span></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          `}
        </div>
      `;
    }

    const html = `
      <div class="container fade-in">
        <div class="jobs-header">
          <div>
            <h1>Placement Board</h1>
            <p style="color: var(--text-muted);">Explore open requirements across international tech companies.</p>
          </div>
        </div>

        <div class="portal-tabs">
          <div class="portal-tab ${activeSubTab === 'all-jobs' ? 'active' : ''}" id="tab-all-jobs">Available Jobs</div>
          <div class="portal-tab ${activeSubTab === 'applications' ? 'active' : ''}" id="tab-applications">Submitted Applications (${state.appliedJobs.length})</div>
        </div>

        <div class="job-portal-layout">
          
          <!-- Filters Sidebar (only displayed in Jobs search list) -->
          <aside class="glass-card filter-sidebar" style="${activeSubTab === 'all-jobs' ? '' : 'display: none;'}">
            <h3 style="margin-bottom: 1.5rem; font-size: 1.15rem;">Filter Criteria</h3>
            
            <div class="filter-section">
              <h4>Employment Type</h4>
              <div class="filter-options">
                <label class="checkbox-label">
                  <input type="checkbox" class="job-filter-type-chk" value="Full-time" ${state.jobFilterTypes.includes('Full-time') ? 'checked' : ''} onchange="handleJobFilterTypeToggle(this)"> Full-time
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" class="job-filter-type-chk" value="Remote" ${state.jobFilterTypes.includes('Remote') ? 'checked' : ''} onchange="handleJobFilterTypeToggle(this)"> Remote
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" class="job-filter-type-chk" value="Internship" ${state.jobFilterTypes.includes('Internship') ? 'checked' : ''} onchange="handleJobFilterTypeToggle(this)"> Internship
                </label>
              </div>
            </div>

            <div class="filter-section">
              <h4>Experience Level</h4>
              <div class="filter-options">
                <label class="checkbox-label">
                  <input type="checkbox" class="job-filter-exp-chk" value="Fresher" ${state.jobFilterExperiences.includes('Fresher') ? 'checked' : ''} onchange="handleJobFilterExpToggle(this)"> Fresher (0 years)
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" class="job-filter-exp-chk" value="0-2 years" ${state.jobFilterExperiences.includes('0-2 years') ? 'checked' : ''} onchange="handleJobFilterExpToggle(this)"> 0-2 Years
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" class="job-filter-exp-chk" value="2-5 years" ${state.jobFilterExperiences.includes('2-5 years') ? 'checked' : ''} onchange="handleJobFilterExpToggle(this)"> 2-5 Years
                </label>
              </div>
            </div>

            <button class="btn btn-secondary btn-sm" style="width: 100%; margin-top: 1rem;" onclick="clearJobFilters()">Reset Filters</button>
          </aside>

          <!-- Main Listing Area -->
          <div class="jobs-main-area" style="grid-column: ${activeSubTab === 'all-jobs' ? '2' : '1 / -1'};">
            ${mainAreaHtml}
          </div>

        </div>
      </div>
    `;
    container.innerHTML = html;

    // Render list if on jobs list tab
    if (activeSubTab === 'all-jobs') {
      renderJobsList();
    }

    // Attach local navigation behaviors
    document.getElementById('tab-all-jobs').addEventListener('click', () => {
      activeSubTab = 'all-jobs';
      renderContent();
    });
    document.getElementById('tab-applications').addEventListener('click', () => {
      activeSubTab = 'applications';
      renderContent();
    });
  };

  renderContent();
}

// Filter and render job items
function renderJobsList() {
  const container = document.getElementById('portal-jobs-list-target');
  if (!container) return;

  const allJobs = [...window.JOBS_DATA, ...state.recruiterJobs];

  // Filter logic
  const filtered = allJobs.filter(job => {
    // Search query check
    const query = state.jobFilterQuery.toLowerCase();
    const matchesSearch = query === '' || 
      job.title.toLowerCase().includes(query) || 
      job.company.toLowerCase().includes(query) || 
      job.skills.some(s => s.toLowerCase().includes(query));

    // Job type check
    const matchesType = state.jobFilterTypes.length === 0 || state.jobFilterTypes.includes(job.type);

    // Experience check
    const matchesExp = state.jobFilterExperiences.length === 0 || 
      state.jobFilterExperiences.some(exp => job.experience.toLowerCase().includes(exp.toLowerCase()));

    return matchesSearch && matchesType && matchesExp;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="no-results-placeholder">
        <span class="placeholder-icon">🔍</span>
        <p>No job listings match your current filters.</p>
        <button class="btn btn-secondary btn-sm" style="margin-top: 1rem;" onclick="clearJobFilters()">Reset Search</button>
      </div>
    `;
    return;
  }

  let html = '';
  filtered.forEach(job => {
    const isApplied = state.appliedJobs.some(app => app.jobId === job.id);

    html += `
      <div class="glass-card job-card fade-in">
        <div class="company-logo-badge" style="background-color: ${job.logoColor || '#8a2be2'};">
          ${job.company.substring(0, 2).toUpperCase()}
        </div>
        <div class="job-info-block">
          <div class="job-title-row">
            <h3>${job.title}</h3>
            <span class="badge badge-info">${job.type}</span>
          </div>
          <p style="font-weight: 600; color: var(--primary-cyan); font-size: 0.95rem;">${job.company}</p>
          <div class="job-meta-row">
            <div class="job-meta-item">📍 ${job.location}</div>
            <div class="job-meta-item">💼 Exp: ${job.experience}</div>
            <div class="job-meta-item">💰 ${job.salary}</div>
          </div>
          <div class="job-skills-row">
            ${job.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
          </div>
        </div>
        <div class="job-actions-block">
          <span class="posted-date">Posted ${job.postedDate}</span>
          <div style="display: flex; gap: 0.5rem; margin-top: auto;">
            <button class="btn btn-secondary btn-sm" onclick="openJobDrawer('${job.id}')">View Details</button>
            ${isApplied ? 
              `<button class="btn btn-success btn-sm" disabled>✓ Applied</button>` : 
              `<button class="btn btn-primary btn-sm" onclick="openApplyModal('${job.id}')">Apply Now</button>`
            }
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Input filter handles
function handleJobSearchChange(val) {
  state.jobFilterQuery = val;
  renderJobsList();
}
function handleJobFilterTypeToggle(chk) {
  if (chk.checked) {
    state.jobFilterTypes.push(chk.value);
  } else {
    state.jobFilterTypes = state.jobFilterTypes.filter(v => v !== chk.value);
  }
  renderJobsList();
}
function handleJobFilterExpToggle(chk) {
  if (chk.checked) {
    state.jobFilterExperiences.push(chk.value);
  } else {
    state.jobFilterExperiences = state.jobFilterExperiences.filter(v => v !== chk.value);
  }
  renderJobsList();
}
function clearJobFilters() {
  state.jobFilterQuery = '';
  state.jobFilterTypes = [];
  state.jobFilterExperiences = [];
  
  // Reset checkboxes
  document.querySelectorAll('.job-filter-type-chk, .job-filter-exp-chk').forEach(chk => chk.checked = false);
  const searchInput = document.getElementById('job-search-input');
  if (searchInput) searchInput.value = '';

  renderJobsList();
}

// Job Drawer details rendering
function openJobDrawer(jobId) {
  const allJobs = [...window.JOBS_DATA, ...state.recruiterJobs];
  const job = allJobs.find(j => j.id === jobId);
  if (!job) return;

  const contentTarget = document.getElementById('job-drawer-content');
  const isApplied = state.appliedJobs.some(app => app.jobId === job.id);

  let html = `
    <div class="drawer-header">
      <span class="drawer-company">${job.company}</span>
      <h2 class="drawer-title">${job.title}</h2>
      <span class="badge badge-info">${job.type}</span>
    </div>
    
    <div class="blueprint-meta-strip" style="grid-template-columns: 1fr 1fr; margin-bottom: 1.5rem; padding: 0.75rem;">
      <div class="blueprint-meta-item">
        <span class="lbl">Location</span>
        <span class="val">${job.location}</span>
      </div>
      <div class="blueprint-meta-item">
        <span class="lbl">Salary</span>
        <span class="val">${job.salary}</span>
      </div>
    </div>

    <div class="drawer-section">
      <h4>Job Description</h4>
      <p style="font-size: 0.95rem; color: var(--text-primary);">${job.description}</p>
    </div>

    <div class="drawer-section">
      <h4>Requirements</h4>
      <ul>
        ${job.requirements.map(req => `<li>${req}</li>`).join('')}
      </ul>
    </div>

    ${job.benefits ? `
      <div class="drawer-section">
        <h4>Benefits & Perks</h4>
        <ul>
          ${job.benefits.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    <div style="margin-top: 2rem; display: flex; gap: 1rem;">
      ${isApplied ? 
        `<button class="btn btn-success" style="width: 100%;" disabled>Application Submitted</button>` : 
        `<button class="btn btn-primary" style="width: 100%;" onclick="closeJobDrawer(); openApplyModal('${job.id}')">Apply Now</button>`
      }
    </div>
  `;

  contentTarget.innerHTML = html;
  document.getElementById('job-drawer-overlay').classList.add('active');
}
function closeJobDrawer() {
  document.getElementById('job-drawer-overlay').classList.remove('active');
}

// Job Application Modal handles
function openApplyModal(jobId) {
  const allJobs = [...window.JOBS_DATA, ...state.recruiterJobs];
  const job = allJobs.find(j => j.id === jobId);
  if (!job) return;

  document.getElementById('apply-input-job-id').value = jobId;
  document.getElementById('apply-modal-title').innerText = `Apply to ${job.company}`;
  document.getElementById('apply-modal-subtitle').innerText = `Role: ${job.title} (${job.type})`;
  
  // Clear inputs
  document.getElementById('apply-input-name').value = '';
  document.getElementById('apply-input-email').value = '';
  document.getElementById('apply-input-phone').value = '';
  document.getElementById('apply-input-file').value = '';
  
  // Reset drop area label
  const dropText = document.querySelector('#resume-drop-area .file-text');
  if (dropText) dropText.innerText = "Click to select resume or drag file here";

  document.getElementById('apply-job-overlay').classList.add('active');
}
function toggleApplyJobModal(open) {
  const modal = document.getElementById('apply-job-overlay');
  if (open) modal.classList.add('active');
  else modal.classList.remove('active');
}

function updateResumeUploadStatus(input) {
  const dropText = document.querySelector('#resume-drop-area .file-text');
  if (input.files && input.files[0] && dropText) {
    dropText.innerText = `Selected: ${input.files[0].name} (${(input.files[0].size / 1024 / 1024).toFixed(2)} MB)`;
  }
}

function handleApplyJobSubmit(e) {
  e.preventDefault();
  const jobId = document.getElementById('apply-input-job-id').value;
  const name = document.getElementById('apply-input-name').value;
  const email = document.getElementById('apply-input-email').value;

  const newApp = {
    jobId,
    name,
    email,
    date: new Date().toLocaleDateString(),
    status: 'Applied'
  };

  state.appliedJobs.push(newApp);
  saveState('applied_jobs', state.appliedJobs);
  
  toggleApplyJobModal(false);
  showToast("Application submitted successfully! 🚀", "success");
  
  // Reload job page
  renderJobPortal();
}

// Recruit job creation dialog handles
function togglePostJobModal(open) {
  const modal = document.getElementById('post-job-overlay');
  if (open) {
    document.getElementById('form-post-job').reset();
    modal.classList.add('active');
  } else {
    modal.classList.remove('active');
  }
}

function handlePostJob(e) {
  e.preventDefault();
  
  const title = document.getElementById('job-input-title').value;
  const company = document.getElementById('job-input-company').value;
  const location = document.getElementById('job-input-location').value;
  const type = document.getElementById('job-input-type').value;
  const salary = document.getElementById('job-input-salary').value;
  const experience = document.getElementById('job-input-experience').value;
  
  const skillsRaw = document.getElementById('job-input-skills').value;
  const skills = skillsRaw.split(',').map(s => s.trim()).filter(s => s !== '');
  
  const description = document.getElementById('job-input-desc').value;
  
  const reqsRaw = document.getElementById('job-input-reqs').value;
  const requirements = reqsRaw.split('\n').map(r => r.trim()).filter(r => r !== '');

  const newJob = {
    id: 'recruiter-' + Date.now(),
    title,
    company,
    location,
    type,
    salary,
    experience,
    skills,
    description,
    requirements,
    postedDate: "Just now",
    logoColor: "#8a2be2" // Custom recruiter color theme
  };

  state.recruiterJobs.push(newJob);
  saveState('recruiter_jobs', state.recruiterJobs);
  
  togglePostJobModal(false);
  showToast(`Career listed for ${company}! 💼`, "success");
  
  renderJobPortal();
}

// ==========================================================================
// 4. Preparation Portal (Aptitude & Technical Quizzes)
// ==========================================================================
function renderPrepPortal() {
  const container = document.getElementById('main-content');
  
  let activeSection = 'aptitude'; // 'aptitude', 'technical', 'hr-prep'
  let activeTopicIndex = 0;

  const renderContent = () => {
    // Generate side menu
    let menuHtml = '';
    
    // Aptitude Topics list
    menuHtml += `<div class="prep-menu-title">Aptitude Topics</div><ul class="prep-menu-list">`;
    window.PREP_DATA.aptitude.topics.forEach((topic, idx) => {
      const activeClass = activeSection === 'aptitude' && activeTopicIndex === idx ? 'active' : '';
      menuHtml += `<li class="prep-menu-item ${activeClass}" onclick="switchPrepView('aptitude', ${idx})">${topic.name}</li>`;
    });
    menuHtml += `</ul>`;

    // Technical Subjects list
    menuHtml += `<div class="prep-menu-title">Core CS Topics</div><ul class="prep-menu-list">`;
    window.PREP_DATA.technical.topics.forEach((topic, idx) => {
      const activeClass = activeSection === 'technical' && activeTopicIndex === idx ? 'active' : '';
      menuHtml += `<li class="prep-menu-item ${activeClass}" onclick="switchPrepView('technical', ${idx})">${topic.name}</li>`;
    });
    menuHtml += `</ul>`;

    // HR Mock Simulator link
    const hrActive = activeSection === 'hr-prep' ? 'active' : '';
    menuHtml += `
      <div class="prep-menu-title">Placement Prep</div>
      <ul class="prep-menu-list">
        <li class="prep-menu-item ${hrActive}" onclick="switchPrepView('hr-prep', 0)">HR AI Simulator 🤖</li>
      </ul>
    `;

    // Generate main view body
    let bodyHtml = '';
    if (activeSection === 'hr-prep') {
      bodyHtml = generateHrSimulatorHtml();
    } else {
      const category = activeSection === 'aptitude' ? window.PREP_DATA.aptitude : window.PREP_DATA.technical;
      const topic = category.topics[activeTopicIndex];

      bodyHtml = `
        <div class="glass-card study-notes-card fade-in">
          <h2>${topic.name}</h2>
          <p style="color: var(--text-muted); margin-bottom: 2rem;">${topic.summary}</p>
          <div class="study-notes-body">
            ${parseMarkdown(topic.notes)}
          </div>
        </div>

        <div class="glass-card quiz-console-card fade-in">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h3>Test Your Understanding</h3>
              <p style="color: var(--text-muted); font-size: 0.9rem;">Practice simulated placements tests on ${topic.name}.</p>
            </div>
            <button class="btn btn-primary" onclick="startTimerQuiz('${activeSection}', ${activeTopicIndex})">Launch Quiz</button>
          </div>
        </div>
      `;
    }

    const html = `
      <div class="container fade-in">
        <div class="prep-layout">
          <aside class="glass-card prep-sidebar">
            ${menuHtml}
          </aside>
          <div class="prep-main-area" id="prep-main-area-target">
            ${bodyHtml}
          </div>
        </div>
      </div>
    `;
    container.innerHTML = html;

    // If HR section loads, setup simulator log trackers
    if (activeSection === 'hr-prep') {
      initializeHrSimulator();
    }
  };

  // Switch tabs action attached to window globally
  window.switchPrepView = (section, idx) => {
    activeSection = section;
    activeTopicIndex = idx;
    renderContent();
  };

  renderContent();
}

// --------------------------------------------------------------------------
// Quiz Execution Engine
// --------------------------------------------------------------------------
function startTimerQuiz(type, topicIndex) {
  const category = type === 'aptitude' ? window.PREP_DATA.aptitude : window.PREP_DATA.technical;
  const topic = category.topics[topicIndex];
  
  state.activeQuizTopic = topic;
  state.activeQuizType = type;
  state.currentQuestionIndex = 0;
  state.quizAnswers = new Array(topic.quiz.length).fill(null);
  
  // 60 seconds per question standard
  state.quizTimeRemaining = topic.quiz.length * 60;

  const target = document.getElementById('prep-main-area-target');
  
  // Render quiz console view
  const renderQuestion = () => {
    const qIndex = state.currentQuestionIndex;
    const question = topic.quiz[qIndex];
    
    // Format minutes/seconds
    const mins = Math.floor(state.quizTimeRemaining / 60);
    const secs = state.quizTimeRemaining % 60;
    const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    target.innerHTML = `
      <div class="glass-card quiz-console-card fade-in">
        <div class="quiz-header">
          <div>
            <span class="badge badge-info">${topic.name} Quiz</span>
            <h3 style="margin-top: 0.25rem;">Question ${qIndex + 1} of ${topic.quiz.length}</h3>
          </div>
          <div class="quiz-timer" id="quiz-timer-display">
            ⏱️ ${timeFormatted}
          </div>
        </div>

        <div class="quiz-question-box">
          <h3 id="quiz-question-text">${question.q}</h3>
          
          <div class="quiz-options-list">
            ${question.options.map((opt, oIdx) => {
              const letter = String.fromCharCode(65 + oIdx);
              const isSelected = state.quizAnswers[qIndex] === oIdx ? 'selected' : '';
              return `
                <button class="quiz-option-button ${isSelected}" onclick="selectQuizOption(${oIdx})">
                  <span class="quiz-option-letter">${letter}</span>
                  <span>${opt}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div class="quiz-actions">
          <button class="btn btn-secondary" onclick="prevQuizQuestion()" ${qIndex === 0 ? 'disabled' : ''}>Previous</button>
          ${qIndex === topic.quiz.length - 1 ? 
            `<button class="btn btn-success" onclick="finishTimerQuiz()">Finish Test</button>` : 
            `<button class="btn btn-primary" onclick="nextQuizQuestion()">Next Question</button>`
          }
        </div>
      </div>
    `;
  };

  renderQuestion();

  // Attach global option selectors
  window.selectQuizOption = (oIdx) => {
    state.quizAnswers[state.currentQuestionIndex] = oIdx;
    renderQuestion();
  };
  window.nextQuizQuestion = () => {
    if (state.currentQuestionIndex < topic.quiz.length - 1) {
      state.currentQuestionIndex++;
      renderQuestion();
    }
  };
  window.prevQuizQuestion = () => {
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex--;
      renderQuestion();
    }
  };

  // Timer Interval
  clearInterval(state.quizTimerInterval);
  state.quizTimerInterval = setInterval(() => {
    state.quizTimeRemaining--;
    const timerDisplay = document.getElementById('quiz-timer-display');
    
    if (timerDisplay) {
      const mins = Math.floor(state.quizTimeRemaining / 60);
      const secs = state.quizTimeRemaining % 60;
      timerDisplay.innerText = `⏱️ ${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    if (state.quizTimeRemaining <= 0) {
      clearInterval(state.quizTimerInterval);
      showToast("Time's up! Grading quiz responses.", "error");
      finishTimerQuiz();
    }
  }, 1000);
}

function finishTimerQuiz() {
  clearInterval(state.quizTimerInterval);
  const topic = state.activeQuizTopic;
  
  let score = 0;
  topic.quiz.forEach((q, idx) => {
    if (state.quizAnswers[idx] === q.answer) {
      score++;
    }
  });

  // Calculate percentage
  const pct = Math.round((score / topic.quiz.length) * 100);
  
  // Update Highscore
  const key = `${state.activeQuizType}_${topic.id}`;
  const previousHigh = state.quizHighscores[key] || 0;
  if (pct > previousHigh) {
    state.quizHighscores[key] = pct;
    saveState('quiz_highscores', state.quizHighscores);
  }

  // Display results modal overlay
  const modal = document.getElementById('quiz-modal-overlay');
  const body = document.getElementById('quiz-modal-body');
  
  body.innerHTML = `
    <div style="text-align: center; margin-bottom: 2rem;">
      <div style="font-size: 4rem;">🎯</div>
      <h2 style="font-size: 2.25rem; font-family: var(--font-headings); margin-top: 0.5rem;">${score} / ${topic.quiz.length} Correct</h2>
      <p style="color: var(--text-muted); font-size: 1.15rem;">You scored ${pct}% on this practice module.</p>
    </div>
    
    <div style="max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem;">
      ${topic.quiz.map((q, idx) => {
        const isCorrect = state.quizAnswers[idx] === q.answer;
        return `
          <div class="glass-card" style="padding: 1rem; margin:0; border-color: ${isCorrect ? 'var(--accent-easy)' : 'var(--accent-hard)'};">
            <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem;">Q${idx + 1}: ${q.q}</h4>
            <p style="font-size: 0.85rem;"><strong>Your Answer:</strong> <span style="color: ${isCorrect ? 'var(--accent-easy)' : 'var(--accent-hard)'}">${state.quizAnswers[idx] !== null ? q.options[state.quizAnswers[idx]] : 'Unanswered'}</span></p>
            <p style="font-size: 0.85rem;"><strong>Correct Answer:</strong> <span style="color: var(--accent-easy)">${q.options[q.answer]}</span></p>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 0.5rem;">
              💡 <strong>Explanation:</strong> ${q.explanation}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  modal.classList.add('active');
  
  // Reload general prep view contents
  navigateTo('prep');
}
window.closeQuizModal = () => {
  document.getElementById('quiz-modal-overlay').classList.remove('active');
};

// --------------------------------------------------------------------------
// HR Placement Interview Mock Simulator
// --------------------------------------------------------------------------
function generateHrSimulatorHtml() {
  return `
    <div class="hr-simulator-layout">
      <!-- Left Panel: Chat Interface -->
      <div class="glass-card chat-window-card">
        <div class="chat-window-header">
          <div class="interviewer-profile">
            <div class="interviewer-avatar">👩‍💼</div>
            <div>
              <span class="interviewer-name">Elena (HR Evaluator)</span>
              <span class="interviewer-status"><span class="loading-spinner" style="width:10px; height:10px; border-width:1px; margin-right:3px;"></span> Analyzing Answer</span>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="resetHrSimulator()">Restart Mock</button>
        </div>
        
        <div class="chat-bubbles-container" id="hr-chat-bubbles">
          <!-- Chat logs render dynamically -->
        </div>

        <div class="chat-input-area">
          <textarea id="hr-user-input" class="chat-textarea" placeholder="Type your structured HR answer here..." onkeydown="handleHrTextKeydown(event)"></textarea>
          <button class="btn btn-primary" id="hr-send-btn" onclick="submitHrUserAnswer()" style="height: 50px; padding: 0 1.5rem;">Send</button>
        </div>
      </div>

      <!-- Right Panel: Real-time Evaluation Metrics -->
      <div class="glass-card analysis-panel-card">
        <h3>Interview Analytics</h3>
        
        <div class="feedback-metric">
          <div class="metric-label-row">
            <span>Response Length</span>
            <span id="metric-char-count">0 words</span>
          </div>
          <div class="metric-bar-bg">
            <div class="metric-bar-fill" id="metric-bar-length"></div>
          </div>
        </div>

        <div class="feedback-metric">
          <div class="metric-label-row">
            <span>Readability & Structure</span>
            <span id="metric-score-pct">0%</span>
          </div>
          <div class="metric-bar-bg">
            <div class="metric-bar-fill purple" id="metric-bar-score"></div>
          </div>
        </div>

        <div class="analysis-scroller">
          <div class="keywords-feedback-box">
            <h4>Keyword Densities Checked</h4>
            <div class="keywords-badge-container" id="hr-keywords-target">
              <!-- Render target keywords -->
            </div>
          </div>

          <div class="evaluation-tips">
            <h4>Evaluation Tips</h4>
            <ul id="hr-tips-target">
              <li>Keep answers within 100-250 words.</li>
              <li>Structure answers using STAR (Situation, Task, Action, Result).</li>
              <li>Mention team alignment and learning metrics.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initializeHrSimulator() {
  state.hrCurrentQuestionIdx = 0;
  state.hrHistory = [];
  
  const bubbles = document.getElementById('hr-chat-bubbles');
  if (!bubbles) return;

  const firstQ = window.PREP_DATA.hr.questions[0];
  state.hrHistory.push({ sender: 'bot', text: `Welcome to your mock interview. Let's begin.\n\n<strong>Question 1: "${firstQ.q}"</strong>\n\nFramework: ${firstQ.framework}.` });
  
  renderHrChatLogs();
  updateHrMetrics('', firstQ);
}

function resetHrSimulator() {
  initializeHrSimulator();
  showToast("Mock interview reset.", "info");
}

function renderHrChatLogs() {
  const container = document.getElementById('hr-chat-bubbles');
  if (!container) return;

  container.innerHTML = state.hrHistory.map(bubble => `
    <div class="chat-bubble ${bubble.sender}">
      ${bubble.text.replace(/\n/g, '<br>')}
    </div>
  `).join('');

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function handleHrTextKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    submitHrUserAnswer();
  }
}

function submitHrUserAnswer() {
  const input = document.getElementById('hr-user-input');
  if (!input || input.value.trim() === '') return;

  const answer = input.value.trim();
  state.hrHistory.push({ sender: 'user', text: answer });
  input.value = '';
  
  renderHrChatLogs();

  // Bot response analyzer
  const activeQ = window.PREP_DATA.hr.questions[state.hrCurrentQuestionIdx];
  const analysis = evaluateAnswerLocally(answer, activeQ);

  setTimeout(() => {
    // Generate feedback text
    let feedbackText = `Elena: Thanks for sharing. Here is a brief feedback on your response:\n\n`;
    feedbackText += `• **Word Count:** ${analysis.wordCount} words (Ideal: 80-180)\n`;
    feedbackText += `• **Key terminology covered:** ${analysis.matchesCount} of ${activeQ.keywords.length}\n`;
    feedbackText += `• **Overall Readability Score:** ${analysis.score}%\n\n`;
    
    if (analysis.score < 50) {
      feedbackText += `💡 *Tip:* Try detailing your specific actions and achievements. Use stronger verb headers like 'developed', 'coordinated', or 'engineered'.`;
    } else {
      feedbackText += `✨ *Tip:* Good structuring! You connected your skills well to the role requirements.`;
    }

    state.hrCurrentQuestionIdx++;
    
    // Check if next question exists
    if (state.hrCurrentQuestionIdx < window.PREP_DATA.hr.questions.length) {
      const nextQ = window.PREP_DATA.hr.questions[state.hrCurrentQuestionIdx];
      feedbackText += `\n\n<strong>Question ${state.hrCurrentQuestionIdx + 1}: "${nextQ.q}"</strong>\n\nFramework: ${nextQ.framework}`;
      
      state.hrHistory.push({ sender: 'bot', text: feedbackText });
      renderHrChatLogs();
      updateHrMetrics('', nextQ);
    } else {
      feedbackText += `\n\n🏆 **Mock Interview Completed!** You have practiced all standard placement scenarios. You can restart to refine answers.`;
      state.hrHistory.push({ sender: 'bot', text: feedbackText });
      renderHrChatLogs();
      
      // Update streak for finishing mock interview!
      updateStreak();
    }
  }, 1000);
}

// Local evaluation mock AI engine
function evaluateAnswerLocally(answer, question) {
  const words = answer.split(/\s+/).filter(w => w !== '');
  const wordCount = words.length;

  // Check keyword matches
  let matchedKeywords = [];
  question.keywords.forEach(keyword => {
    const rx = new RegExp(`\\b${keyword}\\b`, 'gi');
    if (rx.test(answer)) {
      matchedKeywords.push(keyword);
    }
  });

  // Calculate score logic
  let score = 30; // base score for writing something
  
  // Word count grading (80 to 200 words is optimal)
  if (wordCount >= 80 && wordCount <= 200) score += 35;
  else if (wordCount > 40 && wordCount < 300) score += 20;

  // Keyword grading
  const matchesPct = question.keywords.length > 0 ? matchedKeywords.length / question.keywords.length : 1;
  score += Math.round(matchesPct * 35);

  return {
    wordCount,
    matchedKeywords,
    matchesCount: matchedKeywords.length,
    score: Math.min(100, score)
  };
}

function updateHrMetrics(currentText, question) {
  const charLabel = document.getElementById('metric-char-count');
  const scoreLabel = document.getElementById('metric-score-pct');
  const barLength = document.getElementById('metric-bar-length');
  const barScore = document.getElementById('metric-bar-score');
  const keywordsTarget = document.getElementById('hr-keywords-target');

  if (!charLabel || !keywordsTarget) return;

  const analysis = evaluateAnswerLocally(currentText, question);
  
  charLabel.innerText = `${analysis.wordCount} words`;
  scoreLabel.innerText = `${analysis.score}%`;

  // Scale bars
  const lengthPct = Math.min(100, Math.round((analysis.wordCount / 200) * 100));
  barLength.style.width = `${lengthPct}%`;
  barScore.style.width = `${analysis.score}%`;

  // Update keyword lists
  keywordsTarget.innerHTML = question.keywords.map(kw => {
    const isMatched = analysis.matchedKeywords.includes(kw);
    return `
      <span class="keyword-badge ${isMatched ? 'matched' : ''}">
        ${isMatched ? '✓' : '○'} ${kw}
      </span>
    `;
  }).join('');
}

// Bind live metrics tracker on textarea updates
document.addEventListener('input', (e) => {
  if (e.target && e.target.id === 'hr-user-input') {
    const activeQ = window.PREP_DATA.hr.questions[state.hrCurrentQuestionIdx];
    if (activeQ) {
      updateHrMetrics(e.target.value, activeQ);
    }
  }
});

// ==========================================================================
// 5. DSA Preparation Sheet (Topic-wise & code tester)
// ==========================================================================
function renderDsaSheet() {
  const container = document.getElementById('main-content');

  // Compute stats
  let totalDsaProblems = 0;
  window.DSA_SHEET_DATA.forEach(topic => totalDsaProblems += topic.problems.length);
  const solvedCount = state.solvedProblems.length;
  const solvedPct = totalDsaProblems > 0 ? Math.round((solvedCount / totalDsaProblems) * 100) : 0;
  
  // Radial SVG calculation (radius=50, circumference=2*pi*r ≈ 314)
  const strokeOffset = 314 - (314 * solvedPct) / 100;

  let topicsAccordionHtml = '';
  window.DSA_SHEET_DATA.forEach((topic, tIdx) => {
    // Calculate solved problems within this topic
    const topicSolved = topic.problems.filter(p => state.solvedProblems.includes(p.id)).length;
    
    topicsAccordionHtml += `
      <div class="glass-card dsa-topic-accordion" id="dsa-accordion-${tIdx}">
        <div class="dsa-topic-header" onclick="toggleDsaAccordion(${tIdx})">
          <div class="topic-header-title">
            <h3>${topic.topic}</h3>
            <span class="topic-progress-pill">${topicSolved} / ${topic.problems.length} Solved</span>
          </div>
          <div class="topic-header-actions">
            <span class="accordion-arrow">▼</span>
          </div>
        </div>

        <div class="dsa-topic-content">
          <table class="dsa-problems-table">
            <thead>
              <tr>
                <th class="checkbox-td">Status</th>
                <th>Problem</th>
                <th>Difficulty</th>
                <th>Notes</th>
                <th>Local Sandbox</th>
                <th>Platform</th>
              </tr>
            </thead>
            <tbody>
              ${topic.problems.map(prob => {
                const isSolved = state.solvedProblems.includes(prob.id) ? 'checked' : '';
                const isFlagged = state.revisionProblems.includes(prob.id) ? 'flagged' : '';
                const hasNotesClass = state.problemNotes[prob.id] ? 'has-notes' : '';

                // Get difficulty badge
                let diffBadge = 'badge-easy';
                if (prob.difficulty === 'Medium') diffBadge = 'badge-medium';
                if (prob.difficulty === 'Hard') diffBadge = 'badge-hard';

                return `
                  <tr>
                    <td class="checkbox-td">
                      <input type="checkbox" class="dsa-checkbox" ${isSolved} onchange="toggleDsaProblemSolved('${prob.id}', this)">
                    </td>
                    <td>
                      <a href="${prob.link}" target="_blank" class="problem-title-link">${prob.title}</a>
                      <button class="revision-flag-btn ${isFlagged}" title="Mark for Revision" onclick="toggleDsaRevision('${prob.id}', this)">🚩</button>
                    </td>
                    <td>
                      <span class="badge ${diffBadge}">${prob.difficulty}</span>
                    </td>
                    <td>
                      <button class="notes-btn ${hasNotesClass}" onclick="openDsaNotesModal('${prob.id}')">
                        ${state.problemNotes[prob.id] ? '📝 View Notes' : '➕ Add Notes'}
                      </button>
                    </td>
                    <td>
                      <button class="btn btn-secondary btn-sm" onclick="openDsaEditor('${prob.id}')">⚡ Solve Local</button>
                    </td>
                    <td>
                      <a href="${prob.link}" target="_blank" class="badge badge-info" style="font-size:0.7rem;">${prob.platform} ↗</a>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  });

  const html = `
    <div class="container fade-in">
      <div class="dsa-dashboard-header">
        <div>
          <h1>Dedicated DSA Accelerator</h1>
          <p style="color: var(--text-muted);">Topic-wise curated placement coding sheets. Check off solved issues.</p>
        </div>
      </div>

      <div class="glass-card dsa-progress-summary-card" style="margin-bottom: 3rem;">
        <div class="radial-progress-wrapper">
          <svg class="radial-svg">
            <defs>
              <linearGradient id="cyan-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="var(--primary-cyan)" />
                <stop offset="100%" stop-color="var(--primary-blue)" />
              </linearGradient>
            </defs>
            <circle class="radial-circle-bg" cx="60" cy="60" r="50"></circle>
            <circle class="radial-circle-fill" cx="60" cy="60" r="50" style="stroke-dashoffset: ${strokeOffset};"></circle>
          </svg>
          <div class="radial-text-pct" id="dsa-radial-pct-text">${solvedPct}%</div>
        </div>

        <div class="dsa-stat-details">
          <h3>Progress Breakdown</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 0.5rem;">Completed ${solvedCount} out of ${totalDsaProblems} industry standard questions.</p>
          <div class="dsa-stat-row">
            <div><span class="badge badge-easy">Easy</span> <span class="dsa-stat-number" id="dsa-stat-easy-val">0</span></div>
            <div><span class="badge badge-medium">Medium</span> <span class="dsa-stat-number" id="dsa-stat-med-val">0</span></div>
            <div><span class="badge badge-hard">Hard</span> <span class="dsa-stat-number" id="dsa-stat-hard-val">0</span></div>
          </div>
        </div>
      </div>

      <div class="dsa-topics-container">
        ${topicsAccordionHtml}
      </div>
    </div>
  `;

  container.innerHTML = html;
  updateDsaDifficultyCounts();
}

function updateDsaDifficultyCounts() {
  let easy = 0, med = 0, hard = 0;
  
  window.DSA_SHEET_DATA.forEach(topic => {
    topic.problems.forEach(p => {
      if (state.solvedProblems.includes(p.id)) {
        if (p.difficulty === 'Easy') easy++;
        if (p.difficulty === 'Medium') med++;
        if (p.difficulty === 'Hard') hard++;
      }
    });
  });

  const easyEl = document.getElementById('dsa-stat-easy-val');
  const medEl = document.getElementById('dsa-stat-med-val');
  const hardEl = document.getElementById('dsa-stat-hard-val');

  if (easyEl) easyEl.innerText = easy;
  if (medEl) medEl.innerText = med;
  if (hardEl) hardEl.innerText = hard;
}

window.toggleDsaAccordion = (idx) => {
  const headers = document.querySelectorAll('.dsa-topic-header');
  headers.forEach((h, hIdx) => {
    if (hIdx === idx) {
      h.classList.toggle('active');
    }
  });
};

window.toggleDsaProblemSolved = (probId, chk) => {
  if (chk.checked) {
    if (!state.solvedProblems.includes(probId)) {
      state.solvedProblems.push(probId);
    }
  } else {
    state.solvedProblems = state.solvedProblems.filter(id => id !== probId);
  }
  
  saveState('solved_problems', state.solvedProblems);
  updateDsaRadialPercentage();
  updateDsaDifficultyCounts();
  showToast(chk.checked ? "Problem solved! +1 🔥" : "Progress removed", chk.checked ? "success" : "info");
};

function updateDsaRadialPercentage() {
  let total = 0;
  window.DSA_SHEET_DATA.forEach(topic => total += topic.problems.length);
  const solved = state.solvedProblems.length;
  const pct = Math.round((solved / total) * 100);

  const fill = document.querySelector('.radial-circle-fill');
  const text = document.getElementById('dsa-radial-pct-text');
  
  if (fill && text) {
    const strokeOffset = 314 - (314 * pct) / 100;
    fill.style.strokeDashoffset = strokeOffset;
    text.innerText = `${pct}%`;
  }
}

window.toggleDsaRevision = (probId, btn) => {
  if (state.revisionProblems.includes(probId)) {
    state.revisionProblems = state.revisionProblems.filter(id => id !== probId);
    btn.classList.remove('flagged');
    showToast("Removed from revision list", "info");
  } else {
    state.revisionProblems.push(probId);
    btn.classList.add('flagged');
    showToast("Marked for revision 🚩", "success");
  }
  saveState('cn_revision_problems', state.revisionProblems);
};

// DSA Problem Notes Overlay logic
window.openDsaNotesModal = (probId) => {
  const allProblems = [];
  window.DSA_SHEET_DATA.forEach(topic => allProblems.push(...topic.problems));
  const prob = allProblems.find(p => p.id === probId);
  if (!prob) return;

  document.getElementById('dsa-notes-problem-id').value = probId;
  document.getElementById('dsa-notes-subtitle').innerText = `Notes for: ${prob.title}`;
  document.getElementById('dsa-notes-content').value = state.problemNotes[probId] || '';

  document.getElementById('dsa-notes-overlay').classList.add('active');
};
window.toggleDsaNotesModal = (open) => {
  const modal = document.getElementById('dsa-notes-overlay');
  if (open) modal.classList.add('active');
  else modal.classList.remove('active');
};
window.handleDsaNotesSubmit = (e) => {
  e.preventDefault();
  const probId = document.getElementById('dsa-notes-problem-id').value;
  const content = document.getElementById('dsa-notes-content').value;

  if (content.trim() === '') {
    delete state.problemNotes[probId];
  } else {
    state.problemNotes[probId] = content;
  }

  saveState('problem_notes', state.problemNotes);
  toggleDsaNotesModal(false);
  showToast("Study notes updated! 📝", "success");
  
  renderDsaSheet();
};

// --------------------------------------------------------------------------
// Solve Local Sandbox Coding Console Logic
// --------------------------------------------------------------------------
let activeSandboxProblem = null;

window.openDsaEditor = (probId) => {
  const allProblems = [];
  window.DSA_SHEET_DATA.forEach(topic => allProblems.push(...topic.problems));
  const prob = allProblems.find(p => p.id === probId);
  if (!prob) return;

  activeSandboxProblem = prob;
  
  // Set UI elements
  document.getElementById('dsa-modal-title').innerText = prob.title;
  document.getElementById('dsa-modal-desc').innerText = prob.description;
  document.getElementById('dsa-modal-testcase').innerText = prob.testCase.input;
  document.getElementById('dsa-modal-expected').innerText = prob.testCase.output;
  
  // Reset console log
  document.getElementById('dsa-modal-console').innerHTML = `<span class="console-prompt">&gt;</span> Console ready. Run tests to evaluate JavaScript solution.`;

  // Set difficulty badge
  const diffBadge = document.getElementById('dsa-modal-diff');
  diffBadge.className = 'badge';
  if (prob.difficulty === 'Easy') diffBadge.classList.add('badge-easy');
  if (prob.difficulty === 'Medium') diffBadge.classList.add('badge-medium');
  if (prob.difficulty === 'Hard') diffBadge.classList.add('badge-hard');
  diffBadge.innerText = prob.difficulty;

  // Load code template
  document.getElementById('dsa-modal-code').value = prob.starterCode;

  // Open modal overlay fullscreen
  document.getElementById('dsa-editor-modal').style.display = 'block';
};

window.closeDsaEditor = () => {
  document.getElementById('dsa-editor-modal').style.display = 'none';
  activeSandboxProblem = null;
};

window.resetDsaCode = () => {
  if (activeSandboxProblem) {
    document.getElementById('dsa-modal-code').value = activeSandboxProblem.starterCode;
    showToast("Template code restored.", "info");
  }
};

window.runDsaCode = () => {
  if (!activeSandboxProblem) return;

  const code = document.getElementById('dsa-modal-code').value;
  const consoleDisplay = document.getElementById('dsa-modal-console');
  
  consoleDisplay.innerHTML = `<span class="console-prompt">&gt;</span> Compiling Javascript canvas...<br>`;

  // Run the data.js test validator function
  setTimeout(() => {
    const res = activeSandboxProblem.testCase.validate(code);
    
    if (res.success) {
      consoleDisplay.innerHTML += `<span class="console-success">✔ ${res.message}</span><br><br><span class="console-success">🎉 Congratulations! All local assertions passed!</span>`;
      
      // Auto toggle problem solved in local storage state
      if (!state.solvedProblems.includes(activeSandboxProblem.id)) {
        state.solvedProblems.push(activeSandboxProblem.id);
        saveState('solved_problems', state.solvedProblems);
        updateStreak();
      }
      showToast("Problem Solved! 🔥", "success");
    } else {
      consoleDisplay.innerHTML += `<span class="console-error">✖ ${res.message}</span><br><br><span class="console-error">💡 Tip: Review loop constraints and variable declarations.</span>`;
      showToast("Test assertions failed.", "error");
    }
  }, 400);
};

// ==========================================================================
// 6. Company Placement Guides
// ==========================================================================
function renderCompanyGuides() {
  const container = document.getElementById('main-content');
  
  let activeCompanyIndex = 0;

  const renderContent = () => {
    const activeCompany = window.COMPANIES_DATA[activeCompanyIndex];

    let gridHtml = '';
    window.COMPANIES_DATA.forEach((comp, idx) => {
      const isActive = idx === activeCompanyIndex ? 'style="border-color: var(--primary-cyan); box-shadow: var(--glow-cyan);"' : '';
      gridHtml += `
        <div class="glass-card company-card fade-in" ${isActive} onclick="switchCompanyGuidesView(${idx})">
          <div class="company-card-logo" style="background-color: ${comp.logoColor || '#8a2be2'}">
            ${comp.name.substring(0, 2).toUpperCase()}
          </div>
          <h3>${comp.name}</h3>
          <p>${comp.tagline}</p>
          <span class="badge badge-info">${comp.difficulty}</span>
        </div>
      `;
    });

    const html = `
      <div class="container fade-in">
        <div>
          <h1>Placement Blueprints</h1>
          <p style="color: var(--text-muted); margin-bottom: 2rem;">Research the hiring patterns, syllabus topics, and exam patterns for top-tier recruiters.</p>
        </div>

        <div class="companies-grid">
          ${gridHtml}
        </div>

        <div class="glass-card blueprint-card fade-in" id="blueprint-details-target">
          <div class="blueprint-header">
            <div>
              <h2>${activeCompany.name} Recruitment Blueprint</h2>
              <p>${activeCompany.tagline}</p>
            </div>
            <span class="badge badge-info" style="font-size:0.85rem; padding:0.4rem 0.8rem;">Difficulty: ${activeCompany.difficulty}</span>
          </div>

          <div class="blueprint-meta-strip">
            <div class="blueprint-meta-item">
              <span class="lbl">GPA Cutoff</span>
              <span class="val">${activeCompany.eligibility.gpa}</span>
            </div>
            <div class="blueprint-meta-item">
              <span class="lbl">Backlogs Tolerance</span>
              <span class="val">${activeCompany.eligibility.backlogs}</span>
            </div>
            <div class="blueprint-meta-item">
              <span class="lbl">Allowed Streams</span>
              <span class="val">${activeCompany.eligibility.branches}</span>
            </div>
          </div>

          <div class="blueprint-tabs-content">
            <!-- Left Column: Round Stages -->
            <div class="blueprint-column">
              <h3>Stages of Recruitment</h3>
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${activeCompany.examPattern.map((p, idx) => `
                  <div class="blueprint-round-step">
                    <div class="round-number-node">${idx + 1}</div>
                    <div class="round-detail-node">
                      <h4>${p.round}</h4>
                      <p>${p.detail}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Right Column: Exam Syllabus & Experiences -->
            <div class="blueprint-column">
              <h3>Core Exam Syllabus</h3>
              <ul style="margin-left:1.5rem; margin-bottom:2rem; display:flex; flex-direction:column; gap:0.5rem; font-size:0.95rem;">
                ${activeCompany.syllabus.map(s => `<li>${s}</li>`).join('')}
              </ul>

              <h3>Recent Interview Logs</h3>
              <div style="display:flex; flex-direction:column; gap:1rem;">
                ${activeCompany.experiences.map(exp => `
                  <div class="interview-experience-block">
                    <div class="experience-meta">
                      <span style="font-weight:700; color:var(--text-white);">${exp.candidate}</span>
                      <span>Role: ${exp.role}</span>
                    </div>
                    <p class="experience-quote">"${exp.feedback}"</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  };

  window.switchCompanyGuidesView = (idx) => {
    activeCompanyIndex = idx;
    renderContent();
  };

  renderContent();
}

// ==========================================================================
// 7. Privacy Policy & Candidate Data Protection
// ==========================================================================
function renderPrivacyPolicy() {
  const container = document.getElementById('main-content');
  
  const totalNotes = Object.keys(state.problemNotes).length;
  const totalSolved = state.solvedProblems.length;
  const totalApps = state.appliedJobs.length;

  const html = `
    <div class="container fade-in">
      <div class="legal-tabs-header">
        <button class="legal-tab-btn active" onclick="navigateTo('privacy')">Privacy Policy</button>
        <button class="legal-tab-btn" onclick="navigateTo('terms')">Terms of Service</button>
      </div>

      <div class="legal-layout">
        <!-- Sticky Table of Contents -->
        <aside class="glass-card legal-toc-card">
          <div class="legal-toc-title">Policy Sections</div>
          <nav class="legal-toc-list">
            <a href="#priv-intro" class="legal-toc-link">1. Overview & Commitment</a>
            <a href="#priv-collection" class="legal-toc-link">2. Information We Collect</a>
            <a href="#priv-storage" class="legal-toc-link">3. Local-First Architecture</a>
            <a href="#priv-usage" class="legal-toc-link">4. How We Use Data</a>
            <a href="#priv-sharing" class="legal-toc-link">5. Sharing & Employers</a>
            <a href="#priv-security" class="legal-toc-link">6. Security & Safeguards</a>
            <a href="#priv-rights" class="legal-toc-link">7. Candidate Data Rights</a>
            <a href="#priv-interactive" class="legal-toc-link">8. Interactive Data Controls</a>
            <a href="#priv-cookies" class="legal-toc-link">9. Cookies & Storage</a>
            <a href="#priv-contact" class="legal-toc-link">10. Contact Privacy Officer</a>
          </nav>

          <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.06);">
            <button class="btn btn-secondary btn-sm" style="width: 100%;" onclick="window.print()">🖨️ Print Policy</button>
          </div>
        </aside>

        <!-- Main Document Area -->
        <article class="glass-card legal-content-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge badge-info">Legal & Compliance</span>
              <h1 style="font-size: 2.4rem; margin-top: 0.5rem; margin-bottom: 0.25rem;">Privacy Policy</h1>
              <p style="color: var(--text-muted); font-size: 1rem;">How CareerNexus protects candidate privacy, study telemetry, and job application records.</p>
            </div>
            <div class="legal-actions-bar">
              <button class="btn btn-secondary btn-sm" onclick="exportCandidateData()">📥 Export Data (JSON)</button>
              <button class="btn btn-primary btn-sm" onclick="window.print()">Print Document</button>
            </div>
          </div>

          <div class="legal-header-meta">
            <div>
              <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Effective Date</span>
              <div style="font-weight: 600; color: var(--text-white);">October 1, 2026</div>
            </div>
            <div>
              <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Version</span>
              <div style="font-weight: 600; color: var(--text-white);">v3.2 (Production)</div>
            </div>
            <div>
              <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Compliance Scope</span>
              <div style="font-weight: 600; color: var(--text-cyan);">GDPR, CCPA & DPDP Ready</div>
            </div>
            <div>
              <span class="legal-badge-verified">✓ Privacy By Design</span>
            </div>
          </div>

          <!-- Section 1 -->
          <section id="priv-intro" class="legal-section">
            <h3>1. Overview & Commitment</h3>
            <p>Welcome to <strong>CareerNexus</strong> ("CareerNexus", "we", "our", or "the Platform"). CareerNexus is committed to safeguarding the privacy and personal data of students, software engineers, and hiring professionals who utilize our job matching board, algorithm practice sheets, timed aptitude testing modules, and mock interview tools.</p>
            <p>This Privacy Policy explains what personal information we collect, the lawful grounds upon which we process it, how it is retained or synchronized, and the extensive controls candidates possess over their recruitment records.</p>
            <div class="legal-callout">
              <strong>Core Privacy Pledge:</strong> CareerNexus never sells candidate contact information or algorithmic performance analytics to third-party ad networks or brokers. Your practice data remains under your direct oversight.
            </div>
          </section>

          <!-- Section 2 -->
          <section id="priv-collection" class="legal-section">
            <h3>2. Information We Collect</h3>
            <p>Depending on how you interact with CareerNexus, we collect and process the following categories of data:</p>
            <ul>
              <li><strong>Candidate Application Data:</strong> When applying for openings listed on our placement board, you submit your full name, email address, phone contact number, and uploaded resume files (PDF, DOCX).</li>
              <li><strong>Placement Learning Activity:</strong> We record problem completion checkmarks on the SDE DSA Sheet, questions flagged for revision, personal algorithm notes, and daily prep streak timestamps.</li>
              <li><strong>Mock Assessment & Quiz Telemetry:</strong> Responses submitted during timed quantitative aptitude tests, core CS exams (DBMS, OS), score percentages, and time durations.</li>
              <li><strong>Interview AI Simulator Records:</strong> User-drafted textual responses to behavioral and situational HR prompts, evaluated word counts, keyword coverage tags, and readability ratings.</li>
              <li><strong>Recruiter Submissions:</strong> Job title specifications, hiring employer identity, salary benchmarks, prerequisite requirements, and workplace location preferences when publishing positions.</li>
            </ul>
          </section>

          <!-- Section 3 -->
          <section id="priv-storage" class="legal-section">
            <h3>3. Local-First Processing & Client Storage</h3>
            <p>CareerNexus implements a high-performance <em>local-first architecture</em> designed for extreme candidate privacy and rapid offline resilience:</p>
            <ul>
              <li>Your custom algorithm notes, solved question progress, and mock quiz records are stored natively within your browser's persistent <strong>HTML5 LocalStorage</strong>.</li>
              <li>The JavaScript sandbox for running and testing DSA algorithms operates purely within your local browser environment. Code written inside the sandbox is compiled and validated against test assertions on your own device.</li>
              <li>This architectural model guarantees that incomplete drafts, private learning notes, and trial coding attempts are never transmitted over external networks without your active instruction.</li>
            </ul>
            <div class="legal-callout success">
              🔒 <strong>Client-Side Isolation:</strong> Because your study notes and problem-solving states remain inside your browser sandbox, clearing your browser cache or using our interactive controls below instantly removes that data from your device.
            </div>
          </section>

          <!-- Section 4 -->
          <section id="priv-usage" class="legal-section">
            <h3>4. How We Use Your Information</h3>
            <p>We process collected data exclusively for authentic educational and career-advancement purposes:</p>
            <ul>
              <li><strong>Facilitating Job Submissions:</strong> Relaying candidate resumes and job profiles to employers seeking verified engineering talent.</li>
              <li><strong>Progress Tracking:</strong> Visualizing your completion percentage on curated topic sheets (Arrays, Trees, Dynamic Programming) and maintaining consecutive study streaks.</li>
              <li><strong>Algorithm & Feedback Generation:</strong> Delivering immediate scoring metrics and educational explanations on aptitude, operating systems, and database management quizzes.</li>
              <li><strong>Platform Integrity & Abuse Prevention:</strong> Ensuring fair recruitment practices, blocking malicious file extensions, and preventing automated scraping of test question banks.</li>
            </ul>
          </section>

          <!-- Section 5 -->
          <section id="priv-sharing" class="legal-section">
            <h3>5. Sharing With Employers & Third Parties</h3>
            <p>Candidate information is shared only under strict, transparent conditions:</p>
            <ul>
              <li><strong>Designated Hiring Companies:</strong> When you click "Apply Now" for an opportunity with partners (such as Google, Microsoft, Amazon, TCS, or verified recruiter posts), the contact details and resume provided in your application form are transmitted solely to that employer's talent acquisition team.</li>
              <li><strong>No Third-Party Advertising Brokers:</strong> We do not monetize candidate telemetry, behavior logs, or assessment scores with advertising exchanges.</li>
              <li><strong>Legal Compulsion:</strong> We may disclose candidate data only if required by valid court summons, binding statutory process, or to prevent immediate harm and fraud.</li>
            </ul>
          </section>

          <!-- Section 6 -->
          <section id="priv-security" class="legal-section">
            <h3>6. Security & Data Safeguards</h3>
            <p>We employ administrative, architectural, and technological measures to defend your information:</p>
            <ul>
              <li><strong>Encryption in Transit:</strong> All data transmissions adhere to modern Transport Layer Security (TLS 1.3 / HTTPS) protocols.</li>
              <li><strong>Client Sandbox Isolation:</strong> The DSA code tester is sandboxed to prevent malicious scripts from accessing local storage contexts outside the CareerNexus domain scope.</li>
              <li><strong>Restricted File Formats:</strong> Resume uploads are restricted to structured document containers (PDF and DOCX) with client-side file size ceilings (maximum 5MB) to mitigate buffer-overflow risks.</li>
            </ul>
          </section>

          <!-- Section 7 -->
          <section id="priv-rights" class="legal-section">
            <h3>7. Candidate Data Rights (GDPR & Global Standards)</h3>
            <p>Regardless of your geographic jurisdiction, CareerNexus affords all candidates fundamental data rights:</p>
            <ul>
              <li><strong>Right of Access & Portability:</strong> You may download an electronic copy of your complete platform history (solved DSA IDs, notes, job applications) in structured JSON format at any time using the tool below.</li>
              <li><strong>Right to Rectification:</strong> You can edit personal notes, update job filter parameters, and modify mock responses freely.</li>
              <li><strong>Right to Erasure ("Right to Be Forgotten"):</strong> You have the autonomous ability to wipe all local records from CareerNexus storage with a single click.</li>
              <li><strong>Right to Non-Discrimination:</strong> Exercising any of your privacy rights will never restrict your access to public educational notes, hiring blueprints, or open problem sheets.</li>
            </ul>
          </section>

          <!-- Section 8: Interactive Data Controls -->
          <section id="priv-interactive" class="legal-section">
            <h3>8. Interactive Candidate Data Controls</h3>
            <p>Modern privacy requires active control, not just passive legal notices. Manage the candidate data currently stored in your browser session:</p>

            <div class="legal-interactive-box">
              <div class="legal-interactive-header">
                <div>
                  <h4 style="margin: 0; color: var(--text-white);">Active Browser Telemetry</h4>
                  <span style="font-size: 0.85rem; color: var(--text-muted);">Real-time snapshot of your locally stored CareerNexus records</span>
                </div>
                <span class="badge badge-info">Device LocalStorage</span>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem; margin: 0.5rem 0;">
                <div style="background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: var(--border-radius-sm); border: 1px solid rgba(255,255,255,0.05); text-align: center;">
                  <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-cyan);">${totalSolved}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">DSA Solved</div>
                </div>
                <div style="background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: var(--border-radius-sm); border: 1px solid rgba(255,255,255,0.05); text-align: center;">
                  <div style="font-size: 1.5rem; font-weight: 700; color: var(--secondary-pink);">${totalNotes}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Study Notes</div>
                </div>
                <div style="background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: var(--border-radius-sm); border: 1px solid rgba(255,255,255,0.05); text-align: center;">
                  <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-easy);">${totalApps}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Job Applications</div>
                </div>
                <div style="background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: var(--border-radius-sm); border: 1px solid rgba(255,255,255,0.05); text-align: center;">
                  <div style="font-size: 1.5rem; font-weight: 700; color: #ff8a3d;">${state.streakCount} 🔥</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Day Streak</div>
                </div>
              </div>

              <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem;">
                <button class="btn btn-secondary btn-sm" onclick="exportCandidateData()">📥 Download My Data (JSON)</button>
                <button class="btn btn-danger btn-sm" onclick="purgeCandidateData()">🗑️ Purge All Local Data</button>
              </div>
            </div>
          </section>

          <!-- Section 9 -->
          <section id="priv-cookies" class="legal-section">
            <h3>9. Cookies & Local Storage Disclosures</h3>
            <p>CareerNexus does not employ intrusive third-party cross-site advertising trackers or canvas fingerprinters. We utilize standard Web Storage APIs solely to preserve your active state:</p>
            <ul>
              <li><strong>cn_solved_problems:</strong> Preserves question IDs marked complete on the DSA Sheet.</li>
              <li><strong>cn_applied_jobs:</strong> Retains records of jobs you applied for, including submission dates and tracking milestones.</li>
              <li><strong>cn_problem_notes:</strong> Caches your customized explanations and complexity notes for quick review.</li>
              <li><strong>cn_streak_count & cn_last_active_date:</strong> Computes consecutive daily study milestones.</li>
            </ul>
          </section>

          <!-- Section 10 -->
          <section id="priv-contact" class="legal-section">
            <h3>10. Contacting Our Data Protection Officer</h3>
            <p>If you have questions, inquiries regarding candidate data processing, or wish to submit a data subject request, contact our Privacy and Governance division:</p>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 1.25rem; border-radius: var(--border-radius-md);">
              <p style="margin: 0; font-weight: 600; color: var(--text-white);">CareerNexus Data Protection Office</p>
              <p style="margin: 0.25rem 0; font-size: 0.9rem; color: var(--text-primary);">Email: <a href="mailto:privacy@careernexus.io" style="color: var(--primary-cyan);">privacy@careernexus.io</a></p>
              <p style="margin: 0.25rem 0; font-size: 0.9rem; color: var(--text-primary);">Compliance Desk: <a href="mailto:dpo@careernexus.io" style="color: var(--primary-cyan);">dpo@careernexus.io</a></p>
              <p style="margin: 0.25rem 0; font-size: 0.85rem; color: var(--text-muted);">Standard response turnaround: within 48 business hours.</p>
            </div>
          </section>
        </article>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// ==========================================================================
// 8. Terms of Service & Platform Governance
// ==========================================================================
function renderTermsOfService() {
  const container = document.getElementById('main-content');

  const html = `
    <div class="container fade-in">
      <div class="legal-tabs-header">
        <button class="legal-tab-btn" onclick="navigateTo('privacy')">Privacy Policy</button>
        <button class="legal-tab-btn active" onclick="navigateTo('terms')">Terms of Service</button>
      </div>

      <div class="legal-layout">
        <!-- Sticky Table of Contents -->
        <aside class="glass-card legal-toc-card">
          <div class="legal-toc-title">Terms Navigation</div>
          <nav class="legal-toc-list">
            <a href="#terms-agreement" class="legal-toc-link">1. Acceptance of Terms</a>
            <a href="#terms-portal" class="legal-toc-link">2. Job Board & Applications</a>
            <a href="#terms-recruiter" class="legal-toc-link">3. Recruiter Responsibilities</a>
            <a href="#terms-dsa" class="legal-toc-link">4. DSA Sheet & Code Ownership</a>
            <a href="#terms-ai" class="legal-toc-link">5. HR AI Simulator Scope</a>
            <a href="#terms-conduct" class="legal-toc-link">6. Prohibited User Conduct</a>
            <a href="#terms-ip" class="legal-toc-link">7. Intellectual Property</a>
            <a href="#terms-disclaimer" class="legal-toc-link">8. Employment Disclaimer</a>
            <a href="#terms-liability" class="legal-toc-link">9. Limitation of Liability</a>
            <a href="#terms-law" class="legal-toc-link">10. Governing Law & Dispute</a>
            <a href="#terms-contact" class="legal-toc-link">11. Legal Inquiries</a>
          </nav>

          <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.06);">
            <button class="btn btn-secondary btn-sm" style="width: 100%;" onclick="window.print()">🖨️ Print Terms</button>
          </div>
        </aside>

        <!-- Main Document Area -->
        <article class="glass-card legal-content-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge badge-info">Legal & Governance</span>
              <h1 style="font-size: 2.4rem; margin-top: 0.5rem; margin-bottom: 0.25rem;">Terms of Service</h1>
              <p style="color: var(--text-muted); font-size: 1rem;">Rules, operational rights, and disclaimers governing your use of CareerNexus.</p>
            </div>
            <div class="legal-actions-bar">
              <button class="btn btn-secondary btn-sm" onclick="navigateTo('jobs')">Explore Jobs</button>
              <button class="btn btn-primary btn-sm" onclick="window.print()">Print Agreement</button>
            </div>
          </div>

          <div class="legal-header-meta">
            <div>
              <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Last Revised</span>
              <div style="font-weight: 600; color: var(--text-white);">October 1, 2026</div>
            </div>
            <div>
              <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Contract Version</span>
              <div style="font-weight: 600; color: var(--text-white);">v4.0 (Global Enterprise)</div>
            </div>
            <div>
              <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Legally Binding</span>
              <div style="font-weight: 600; color: var(--accent-easy);">Enforceable Agreement</div>
            </div>
            <div>
              <span class="legal-badge-verified">✓ Standard Terms</span>
            </div>
          </div>

          <!-- Section 1 -->
          <section id="terms-agreement" class="legal-section">
            <h3>1. Acceptance of Terms & Eligibility</h3>
            <p>By browsing, accessing, registering, or executing code within <strong>CareerNexus</strong> ("CareerNexus", "the Service"), you enter into a legally binding contract between yourself and CareerNexus Platform Inc. If you do not accept these Terms of Service without reservation, you must immediately discontinue use of the platform.</p>
            <p>You confirm that you are at least 16 years of age (or the minimum age of contractual digital consent in your home jurisdiction) and possess full legal capacity to enter into binding agreements.</p>
          </section>

          <!-- Section 2 -->
          <section id="terms-portal" class="legal-section">
            <h3>2. Job Portal & Candidate Submissions</h3>
            <p>CareerNexus serves as a technical marketplace and preparation directory connecting aspiring engineers with tech employers:</p>
            <ul>
              <li><strong>Truthfulness of Credentials:</strong> When applying for roles via the Job Portal, you warrant that all information submitted, including employment history, educational CGPA, and resume documents, is accurate, genuine, and free of misrepresentation.</li>
              <li><strong>No Recruitment Fees:</strong> Genuine tech employers listed on CareerNexus will <em>never</em> request processing fees, deposit payments, or test fees from candidates. You agree to notify CareerNexus immediately if any job listing solicits monetary compensation.</li>
              <li><strong>Simulated and Partner Openings:</strong> Certain roles featured on the platform serve as benchmark educational models, real-world case studies, or verified corporate partner positions.</li>
            </ul>
            <div class="legal-callout warning">
              ⚠️ <strong>Zero Tolerance for Fraud:</strong> Submitting fraudulent portfolios, forged credentials, or false academic achievements violates these Terms and will result in permanent disqualification from platform listings.
            </div>
          </section>

          <!-- Section 3 -->
          <section id="terms-recruiter" class="legal-section">
            <h3>3. Recruiter & Employer Posting Responsibilities</h3>
            <p>Individuals or corporate representatives posting career openings on CareerNexus agree to strictly abide by our Fair Hiring Code:</p>
            <ul>
              <li><strong>Equal Opportunity:</strong> Job postings must not contain discriminatory conditions based on gender, ethnicity, race, religion, sexual orientation, disability, or marital status.</li>
              <li><strong>Authentic Compensation Benchmarks:</strong> Posted salary ranges and experience criteria must reflect verifiable corporate budgetary commitments.</li>
              <li><strong>Confidentiality of Candidate Resumes:</strong> Recruiters may access candidate contact details solely for genuine interview scheduling and cannot redistribute applicant resumes to external mailing lists.</li>
            </ul>
          </section>

          <!-- Section 4 -->
          <section id="terms-dsa" class="legal-section">
            <h3>4. Dedicated DSA Sheet & Code Ownership</h3>
            <p>CareerNexus provides curated topic sheets, problem breakdowns, and an in-browser JavaScript coding sandbox:</p>
            <ul>
              <li><strong>Your Code, Your Property:</strong> You retain complete, unrestricted intellectual property ownership of all original code implementations, custom complexity notes, and algorithm solutions authored in the sandbox.</li>
              <li><strong>Non-Exclusive Educational License:</strong> By writing code in the sandbox, you grant CareerNexus a non-exclusive license solely to execute, compile, and validate your code against local test assertions within your browser session.</li>
              <li><strong>Third-Party Challenge Platforms:</strong> Problem statements and links pointing to external services (including LeetCode, HackerRank, and GeeksforGeeks) are the intellectual property of their respective owners. CareerNexus references these challenges under transformative educational fair use.</li>
            </ul>
          </section>

          <!-- Section 5 -->
          <section id="terms-ai" class="legal-section">
            <h3>5. HR AI Simulator Scope & Disclaimers</h3>
            <p>Our mock interview module ("Elena - HR Evaluator") leverages deterministic text evaluation heuristics to assist candidates in refining spoken and written responses:</p>
            <ul>
              <li><strong>Educational Diagnostic Only:</strong> Numerical scores, keyword density checks, and readability feedback are simulated pedagogical indicators. They do not constitute official psychometric ratings or corporate hiring endorsements.</li>
              <li><strong>No Guarantees of Real Interview Outcomes:</strong> Achieving high scores or keyword matches in our mock simulator does not guarantee performance or acceptance during formal corporate interview rounds.</li>
            </ul>
          </section>

          <!-- Section 6 -->
          <section id="terms-conduct" class="legal-section">
            <h3>6. Prohibited User Conduct</h3>
            <p>You agree not to engage in any of the following unauthorized activities:</p>
            <ul>
              <li>Attempting to break out of the browser sandbox or execute unauthorized script injections (XSS) against the platform.</li>
              <li>Employing automated spiders, scrapers, or bot networks to harvest proprietary test question banks, interview transcripts, or company hiring blueprints.</li>
              <li>Uploading malicious files, Trojan horses, ransomware, or corrupted binaries disguised as resumes.</li>
              <li>Impersonating corporate hiring managers or misrepresenting your identity as an employer.</li>
            </ul>
          </section>

          <!-- Section 7 -->
          <section id="terms-ip" class="legal-section">
            <h3>7. Intellectual Property of CareerNexus</h3>
            <p>All brand assets, proprietary curriculum guides, company blueprint syllabi, graphic styling, CSS architecture, and software code constituting the CareerNexus framework are the exclusive property of CareerNexus Platform Inc. and are shielded under international copyright, trademark, and trade dress regulations.</p>
          </section>

          <!-- Section 8 -->
          <section id="terms-disclaimer" class="legal-section">
            <h3>8. Disclaimers of Warranties & Employment Outcomes</h3>
            <div class="legal-callout">
              <strong>EXPRESS EMPLOYMENT OUTCOME DISCLAIMER:</strong> CareerNexus is an educational training accelerator and job listing directory. CareerNexus does not guarantee that using our preparation sheets, solving our mock test series, or applying to listed openings will result in employment offers, callbacks, or visa sponsorships. All hiring decisions rest exclusively with the respective hiring corporations.
            </div>
            <p>THE SERVICE IS DELIVERED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A SPECIFIC EMPLOYMENT GOAL, OR NON-INFRINGEMENT.</p>
          </section>

          <!-- Section 9 -->
          <section id="terms-liability" class="legal-section">
            <h3>9. Limitation of Liability</h3>
            <p>TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, CAREERNEXUS PLATFORM INC., ITS DIRECTORS, EMPLOYEES, AND PARTNERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR EXEMPLARY DAMAGES, INCLUDING LOSS OF PROFITS, DATA LOSS, RESUME DELAYS, OR EMPLOYMENT OPPORTUNITY FORFEITURE ARISING FROM YOUR USE OR INABILITY TO USE THE SERVICE.</p>
          </section>

          <!-- Section 10 -->
          <section id="terms-law" class="legal-section">
            <h3>10. Governing Law & Dispute Resolution</h3>
            <p>These Terms shall be interpreted and governed in accordance with international software commercial principles and the laws of the applicable jurisdiction, without regard to conflict of law doctrines. Any controversy, dispute, or claim arising out of these Terms shall first be submitted to informal mediation prior to arbitration.</p>
          </section>

          <!-- Section 11 -->
          <section id="terms-contact" class="legal-section">
            <h3>11. Contact & Legal Notices</h3>
            <p>Formal legal notices, DMCA copyright reports, or recruiter compliance inquiries should be directed to:</p>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 1.25rem; border-radius: var(--border-radius-md);">
              <p style="margin: 0; font-weight: 600; color: var(--text-white);">CareerNexus Legal Affairs & Governance</p>
              <p style="margin: 0.25rem 0; font-size: 0.9rem; color: var(--text-primary);">Email: <a href="mailto:legal@careernexus.io" style="color: var(--primary-cyan);">legal@careernexus.io</a></p>
              <p style="margin: 0.25rem 0; font-size: 0.9rem; color: var(--text-primary);">Recruiter Standards: <a href="mailto:recruiting-compliance@careernexus.io" style="color: var(--primary-cyan);">recruiting-compliance@careernexus.io</a></p>
              <p style="margin: 0.25rem 0; font-size: 0.85rem; color: var(--text-muted);">CareerNexus Platform Inc. &bull; Developer Placement Ecosystem</p>
            </div>
          </section>
        </article>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// Helper: Export candidate local data as JSON
function exportCandidateData() {
  const exportPayload = {
    platform: "CareerNexus",
    exportDate: new Date().toISOString(),
    candidateProfile: {
      activeStreak: state.streakCount,
      lastActiveDate: state.lastActiveDate,
      solvedProblemIds: state.solvedProblems,
      revisionProblemIds: state.revisionProblems,
      problemNotes: state.problemNotes,
      quizHighscores: state.quizHighscores,
      submittedApplications: state.appliedJobs,
      postedJobs: state.recruiterJobs
    }
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `careernexus-candidate-data-${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Candidate data export generated! 📄", "success");
}

// Helper: Purge local candidate data
function purgeCandidateData() {
  if (confirm("Are you sure you want to permanently delete all your local CareerNexus records? This includes your solved DSA problem checklist, custom notes, quiz scores, and job applications stored on this device.")) {
    localStorage.removeItem('cn_solved_problems');
    localStorage.removeItem('cn_revision_problems');
    localStorage.removeItem('cn_problem_notes');
    localStorage.removeItem('cn_applied_jobs');
    localStorage.removeItem('cn_recruiter_jobs');
    localStorage.removeItem('cn_quiz_highscores');
    localStorage.removeItem('cn_streak_count');
    localStorage.removeItem('cn_last_active_date');
    
    loadLocalStorageState();
    const streakDisplay = document.getElementById('nav-streak-count');
    if (streakDisplay) streakDisplay.innerText = state.streakCount;
    showToast("All local candidate data has been purged successfully.", "info");
    renderPrivacyPolicy();
  }
}

// Bind legal helper methods to window for global access
window.renderPrivacyPolicy = renderPrivacyPolicy;
window.renderTermsOfService = renderTermsOfService;
window.exportCandidateData = exportCandidateData;
window.purgeCandidateData = purgeCandidateData;


