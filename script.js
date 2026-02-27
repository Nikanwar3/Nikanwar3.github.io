// ===== Configuration =====
const GITHUB_USERNAME = 'Nikanwar3';
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}`;

// Featured repos - order matters (shown first)
const FEATURED_REPOS = [
    'MeetSync',
    'AgileBoard',
    'AI-Document-Q-A-System',
    'PredictiveMaintenanceSystem',
    'stayhub',
    'InfraWatch',
    'Expense-Tracker-App',
    'Node-Abstraction-Pipeline-Builder',
    'FinBoard_Finance_Dashboard'
];

// Custom descriptions for key projects
const PROJECT_DESCRIPTIONS = {
    'MeetSync': 'Full-stack video conferencing platform with real-time peer-to-peer communication using WebRTC, Socket.IO signaling, JWT auth, and meeting management.',
    'AgileBoard': 'Kanban-style project management tool built with Spring Boot 3.2, Vue.js 3, RBAC with Spring Security, JUnit 5 tests, and Docker Compose deployment.',
    'AI-Document-Q-A-System': 'NLP-powered document analysis system using Retrieval-Augmented Generation (RAG), FastAPI backend, and SQLite for conversation persistence.',
    'PredictiveMaintenanceSystem': 'Machine learning system for predicting equipment failures using Scikit-learn, Pandas, with interactive dashboards and FastAPI backend.',
    'stayhub': 'Full-stack accommodation booking platform with React.js frontend, Express.js backend, MongoDB, user auth, and cloud image storage.',
    'InfraWatch': 'Infrastructure monitoring dashboard for real-time system health tracking and alerting.',
    'Expense-Tracker-App': 'Personal finance tracker application for managing expenses and budgets with data visualization.',
    'Node-Abstraction-Pipeline-Builder': 'Visual pipeline builder for creating node-based data processing workflows with drag-and-drop interface.',
    'FinBoard_Finance_Dashboard': 'Interactive financial dashboard for tracking investments, expenses, and portfolio performance.'
};

// Tech stack icons mapping
const LANG_COLORS = {
    'JavaScript': '#f7df1e',
    'Java': '#ed8b00',
    'Python': '#3776ab',
    'HTML': '#e34c26',
    'CSS': '#1572b6',
    'Vue': '#42b883',
    'TypeScript': '#3178c6',
    'Shell': '#89e051',
    'Kotlin': '#7f52ff'
};

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubData();
    initNavbar();
    initScrollAnimations();
    initMobileMenu();
});

// ===== Fetch GitHub Data =====
async function fetchGitHubData() {
    try {
        // Fetch user profile & repos in parallel
        const [userRes, reposRes] = await Promise.all([
            fetch(GITHUB_API),
            fetch(`${GITHUB_API}/repos?per_page=100&sort=updated`)
        ]);

        const user = await userRes.json();
        const repos = await reposRes.json();

        // Update stats
        updateStats(user, repos);

        // Render projects
        renderProjects(repos);
    } catch (error) {
        console.error('GitHub API error:', error);
        renderProjectsError();
    }
}

function updateStats(user, repos) {
    const repoCount = document.getElementById('stat-repos');
    const followerCount = document.getElementById('stat-followers');

    if (repoCount) animateNumber(repoCount, user.public_repos || repos.length);
    if (followerCount) animateNumber(followerCount, user.followers || 0);
}

function animateNumber(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 30);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current;
    }, 40);
}

// ===== Render Projects =====
function renderProjects(repos) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    // Filter out config/profile repos
    const skipRepos = ['Nikanwar3', 'Nidhi-Kanwar', '100days_code', 'Github-Streak', 'Mini_Project'];
    const filteredRepos = repos.filter(r => !r.fork && !skipRepos.includes(r.name));

    // Sort: featured first, then by stars, then by updated
    const sorted = filteredRepos.sort((a, b) => {
        const aFeatured = FEATURED_REPOS.indexOf(a.name);
        const bFeatured = FEATURED_REPOS.indexOf(b.name);
        const aIdx = aFeatured === -1 ? 999 : aFeatured;
        const bIdx = bFeatured === -1 ? 999 : bFeatured;

        if (aIdx !== bIdx) return aIdx - bIdx;
        if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count;
        return new Date(b.updated_at) - new Date(a.updated_at);
    });

    // Show top 9 projects
    const topProjects = sorted.slice(0, 9);

    grid.innerHTML = topProjects.map((repo, index) => {
        const description = PROJECT_DESCRIPTIONS[repo.name] || repo.description || 'No description available.';
        const language = repo.language || 'Multi';
        const langColor = LANG_COLORS[language] || '#a78bfa';
        const stars = repo.stargazers_count;
        const forks = repo.forks_count;
        const isFeatured = FEATURED_REPOS.indexOf(repo.name) < 5;

        return `
            <a href="${repo.html_url}" target="_blank" 
               class="project-card glass-card reveal" 
               style="animation-delay: ${index * 0.08}s">
                <div class="project-header">
                    <span class="project-icon">${getProjectIcon(repo.name)}</span>
                    <div class="project-links">
                        ${isFeatured ? '<span class="project-tag" style="background: rgba(167, 139, 250, 0.15);">★ Featured</span>' : ''}
                    </div>
                </div>
                <h3 class="project-name">${formatRepoName(repo.name)}</h3>
                <p class="project-desc">${description}</p>
                <div class="project-tags">
                    <span class="project-tag" style="color: ${langColor}">${language}</span>
                    ${getExtraTags(repo.name).map(t => `<span class="project-tag">${t}</span>`).join('')}
                </div>
                <div class="project-meta">
                    <span class="project-meta-item">⭐ ${stars}</span>
                    <span class="project-meta-item">🍴 ${forks}</span>
                    <span class="project-meta-item">📅 ${timeAgo(repo.updated_at)}</span>
                </div>
            </a>
        `;
    }).join('');

    // Trigger reveal animation
    setTimeout(() => {
        document.querySelectorAll('.project-card.reveal').forEach(el => el.classList.add('visible'));
    }, 100);
}

function getProjectIcon(name) {
    const icons = {
        'MeetSync': '📹',
        'AgileBoard': '📋',
        'AI-Document-Q-A-System': '🤖',
        'PredictiveMaintenanceSystem': '⚙️',
        'stayhub': '🏠',
        'InfraWatch': '📊',
        'Expense-Tracker-App': '💰',
        'Node-Abstraction-Pipeline-Builder': '🔗',
        'FinBoard_Finance_Dashboard': '📈',
        'VisiConnect': '👁️',
        'OpenChat': '💬',
        'KYC-Application': '🔐',
        'Splitwise': '💸',
        'Spotify-Clone': '🎵',
        'Wiki-Quiz-App': '❓',
        'RAG-Document-QA': '📄',
        'Task-Creator-Web-App': '✅',
        'Diabetic-Retinopathy': '🔬',
        'VibeBuy-GenzShopping-Website': '🛒',
        'Task-Management-System': '📝'
    };
    return icons[name] || '📦';
}

function getExtraTags(name) {
    const tags = {
        'MeetSync': ['WebRTC', 'Socket.IO', 'React'],
        'AgileBoard': ['Spring Boot', 'Vue.js', 'Docker'],
        'AI-Document-Q-A-System': ['NLP', 'FastAPI', 'RAG'],
        'PredictiveMaintenanceSystem': ['ML', 'Scikit-learn', 'Pandas'],
        'stayhub': ['React', 'MongoDB', 'Express'],
        'InfraWatch': ['Monitoring', 'Dashboard'],
        'Expense-Tracker-App': ['React', 'Finance'],
        'Node-Abstraction-Pipeline-Builder': ['Node.js', 'Pipeline'],
        'FinBoard_Finance_Dashboard': ['Dashboard', 'Finance']
    };
    return tags[name] || [];
}

function formatRepoName(name) {
    return name
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

function timeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
}

function renderProjectsError() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = `
        <div class="glass-card" style="padding: 40px; text-align: center; grid-column: 1 / -1;">
            <p style="color: var(--text-muted);">Unable to load projects from GitHub. Please check back later or visit 
            <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" style="color: var(--accent-1);">my GitHub profile</a>.</p>
        </div>
    `;
}

// ===== Navbar =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 50);
        lastScroll = scrollY;
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu
                document.querySelector('.nav-links')?.classList.remove('active');
            }
        });
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    // Add reveal class to animatable elements
    const revealElements = document.querySelectorAll(
        '.about-card, .skill-category, .timeline-item, .github-card, .contact-card'
    );

    revealElements.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i % 4 * 0.1}s`;
    });

    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
