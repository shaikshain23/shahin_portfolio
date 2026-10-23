import { portfolioData } from './data/portfolioData.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initTypewriter();
  initStatsCounter();
  renderSkills('all');
  initSkillsFilter();
  renderSoftSkills();
  renderProjects('all');
  initProjectsFilter();
  renderEducation();
  renderCertifications();
  renderAchievements();
  initContactForm();
  initProjectModal();
  initCVDownload();
  initEmailCompose();
  initFooterYear();
  initTechBackground();
  initRevealAnimations();
  initScrollAnimations();
});

/* ==========================================
   Theme Switcher (Dark / Light)
   ========================================== */
function initTheme() {
  const themeBtn = document.getElementById('themeToggle');
  if (!themeBtn) return;
  const icon = themeBtn.querySelector('i');
  
  // Default to dark for the signature Visual Fusion theme, or respect saved preference
  const savedTheme = localStorage.getItem('portfolio-theme-v2') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme, icon);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme-v2', newTheme);
    updateThemeIcon(newTheme, icon);
    showToast(`Switched to Visual Fusion (${newTheme})`, 'info');
  });
}

function updateThemeIcon(theme, iconElement) {
  if (!iconElement) return;
  if (theme === 'dark') {
    iconElement.className = 'fa-solid fa-sun';
  } else {
    iconElement.className = 'fa-solid fa-moon';
  }
}

/* ==========================================
   Navbar & Navigation Logic
   ========================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link updates
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile Menu Toggle
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) icon.className = isExpanded ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    // Close Mobile Menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }
}

/* ==========================================
   Typewriter Animation for Hero Section
   ========================================== */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter');
  if (!typewriterElement) return;
  const words = portfolioData.personal.roles;
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 100;
  const deleteSpeed = 50;
  const delayBetweenWords = 2000;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(type, delayBetweenWords);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 500);
    } else {
      setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
    }
  }

  type();
}

/* ==========================================
   Stats Counter Animation
   ========================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          if (isNaN(target)) return;
          const suffix = stat.textContent.replace(/[0-9]/g, '');
          let count = 0;
          const step = Math.max(1, Math.ceil(target / 40));

          const timer = setInterval(() => {
            count += step;
            if (count >= target) {
              stat.textContent = target + suffix;
              clearInterval(timer);
            } else {
              stat.textContent = count + suffix;
            }
          }, 40);
        });
      }
    });
  }, { threshold: 0.5 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) observer.observe(aboutSection);
}

/* ==========================================
   Skills Matrix Rendering & Filtering
   ========================================== */
function renderSkills(categoryFilter = 'all') {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = categoryFilter === 'all'
    ? portfolioData.skills
    : portfolioData.skills.filter(s => s.category === categoryFilter);

  filtered.forEach(skill => {
    const card = document.createElement('div');
    card.className = 'skill-card glass-card';

    card.innerHTML = `
      <div class="skill-header">
        <div class="skill-info">
          <div class="skill-icon"><i class="${skill.icon}"></i></div>
          <span class="skill-name">${skill.name}</span>
        </div>
        <span class="skill-level-text">${skill.level}%</span>
      </div>
      <div class="skill-bar-bg">
        <div class="skill-bar-fill" style="width: 0%"></div>
      </div>
    `;

    grid.appendChild(card);

    setTimeout(() => {
      const fillBar = card.querySelector('.skill-bar-fill');
      if (fillBar) fillBar.style.width = `${skill.level}%`;
    }, 100);
  });
}

function initSkillsFilter() {
  const buttons = document.querySelectorAll('.skill-tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSkills(btn.dataset.category);
    });
  });
}

function renderSoftSkills() {
  const container = document.getElementById('softSkillsChips');
  if (!container) return;
  container.innerHTML = '';

  portfolioData.softSkills.forEach(skill => {
    const chip = document.createElement('span');
    chip.className = 'soft-skill-chip';
    chip.textContent = skill;
    container.appendChild(chip);
  });
}

/* ==========================================
   Projects Section Rendering & Filtering
   ========================================== */
function renderProjects(filter = 'all') {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = filter === 'all'
    ? portfolioData.projects
    : portfolioData.projects.filter(p => p.filterTag === filter);

  filtered.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card glass-card';

    const tagsHtml = project.tags.map(t => `<span class="tag">${t}</span>`).join('');

    card.innerHTML = `
      <div class="project-thumb">
        <img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy">
        <span class="project-badge">${project.stats ? project.stats.metric + ': ' + project.stats.value : 'Project'}</span>
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.description}</p>
        <div class="project-tags">${tagsHtml}</div>
        <div class="project-links">
          <button class="btn btn-primary project-btn open-modal-btn" data-project-id="${project.id}">
            <span>Details</span>
            <i class="fa-solid fa-circle-info"></i>
          </button>
          <a href="${project.liveUrl}" target="_blank" rel="noopener" class="icon-btn" title="Contact / Inquire">
            <i class="fa-solid fa-envelope"></i>
          </a>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  attachModalListeners();
}

function initProjectsFilter() {
  const buttons = document.querySelectorAll('.project-tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.filter);
    });
  });
}

/* ==========================================
   Project Detail Modal
   ========================================== */
function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function attachModalListeners() {
  const btns = document.querySelectorAll('.open-modal-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.dataset.projectId;
      const project = portfolioData.projects.find(p => p.id === projectId);
      if (project) openModal(project);
    });
  });
}

function openModal(project) {
  const modal = document.getElementById('projectModal');
  const body = document.getElementById('modalBody');
  if (!modal || !body) return;

  const tagsHtml = project.tags.map(t => `<span class="tag">${t}</span>`).join('');

  body.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <span class="status-badge">${project.category.toUpperCase()}</span>
      <h2 style="font-size: 2rem; margin: 0.5rem 0; color: var(--text-primary);">${project.title}</h2>
    </div>
    <div style="width: 100%; height: 260px; overflow: hidden; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
      <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
    <p style="font-size: 1.05rem; color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.7;">
      ${project.fullDescription || project.description}
    </p>
    <div style="margin-bottom: 1.5rem;">
      <h4 style="margin-bottom: 0.5rem; color: var(--text-primary);">Skills & Competencies Applied</h4>
      <div class="project-tags">${tagsHtml}</div>
    </div>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <a href="${project.liveUrl}" class="btn btn-primary">
        <span>Inquire About Project</span>
        <i class="fa-solid fa-paper-plane"></i>
      </a>
      <button onclick="window.print()" class="btn btn-outline">
        <i class="fa-solid fa-print"></i>
        <span>Print Portfolio View</span>
      </button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================
   Timeline / Education Section
   ========================================== */
function renderEducation() {
  const container = document.getElementById('timelineContainer');
  if (!container) return;
  container.innerHTML = '';

  portfolioData.education.forEach(exp => {
    const item = document.createElement('div');
    item.className = 'timeline-item';

    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-card glass-card">
        <span class="timeline-date">${exp.period} • ${exp.score}</span>
        <h3 class="timeline-role">${exp.degree}</h3>
        <div class="timeline-company">${exp.institute}</div>
        <p class="timeline-desc">${exp.board}</p>
      </div>
    `;

    container.appendChild(item);
  });
}

/* ==========================================
   Certifications & Achievements Rendering
   ========================================== */
function renderCertifications() {
  const container = document.getElementById('certificationsGrid');
  if (!container) return;
  container.innerHTML = '';

  portfolioData.certifications.forEach(cert => {
    const card = document.createElement('div');
    card.className = 'cert-card glass-card';

    card.innerHTML = `
      <div class="cert-icon"><i class="${cert.icon}"></i></div>
      <div class="cert-info">
        <h3 class="cert-title">${cert.title}</h3>
        <span class="cert-issuer">${cert.issuer} • ${cert.period}</span>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderAchievements() {
  const container = document.getElementById('achievementsGrid');
  if (!container) return;
  container.innerHTML = '';

  portfolioData.achievements.forEach(ach => {
    const card = document.createElement('div');
    card.className = 'achievement-card glass-card';

    card.innerHTML = `
      <div class="achievement-icon"><i class="${ach.icon}"></i></div>
      <div class="achievement-info">
        <h3 class="achievement-title">${ach.title}</h3>
        <p class="achievement-desc">${ach.description}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

/* ==========================================
   Contact Form Validation & Submission
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusDiv = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject')?.value.trim() || 'Inquiry';
    const message = document.getElementById('message').value.trim();

    let isValid = true;

    // Reset error states
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    if (!name) {
      document.getElementById('name').parentElement.classList.add('error');
      isValid = false;
    }

    if (!email || !validateEmail(email)) {
      document.getElementById('email').parentElement.classList.add('error');
      isValid = false;
    }

    if (!message) {
      document.getElementById('message').parentElement.classList.add('error');
      isValid = false;
    }

    if (!isValid) return;

    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Opening Mail Client...';

    const mailtoSubject = encodeURIComponent(`[${subject}] Inquiry from ${name}`);
    const mailtoBody = encodeURIComponent(`Hello Shahin,\n\n${message}\n\nBest regards,\n${name} (${email})`);

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Send Message';
      form.reset();

      if (statusDiv) {
        statusDiv.className = 'form-status success';
        statusDiv.textContent = 'Thank you! Opening your email client to dispatch the message.';
      }
      
      showToast('Opening default mail client...', 'success');
      window.location.href = `mailto:alwaysshahin3@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      setTimeout(() => {
        if (statusDiv) statusDiv.style.display = 'none';
      }, 5000);
    }, 800);
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ==========================================
   Toast Notification Helper
   ========================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';

  const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info';
  const color = type === 'success' ? '#22c55e' : 'var(--accent-cyan)';

  toast.innerHTML = `
    <i class="${iconClass}" style="color: ${color}; font-size: 1.1rem;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slide-in 0.3s ease reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================
   CV Download Simulation & Footer Year
   ========================================== */
function initCVDownload() {
  const cvBtn = document.getElementById('downloadCvBtn');
  if (!cvBtn) return;
  cvBtn.addEventListener('click', () => {
    showToast('Downloading Shahin Shaik Resume (PDF)...', 'success');
  });
}

function initEmailCompose() {
  const emailTargets = document.querySelectorAll('a[href^="mailto:"], .email-compose-btn');
  emailTargets.forEach(el => {
    el.addEventListener('click', (e) => {
      showToast('Opening Email Composer...', 'info');
    });
  });
}

function initFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ==========================================
   Scroll-Driven Animations & Background Canvas
   ========================================== */
function initTechBackground() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PALETTE = [
    [6, 182, 212],    // Electric Cyan
    [139, 92, 246],   // Cyber Violet
    [236, 72, 153],   // Neon Pink
    [56, 189, 248],   // Sky Blue
    [245, 158, 11]    // Radiant Amber
  ];
  const LINK_COLOR = '99, 102, 241'; // Luminous indigo-violet webs

  let width = 0;
  let height = 0;
  let particles = [];
  const mouse = { x: null, y: null };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawnParticles();
  }

  function spawnParticles() {
    const count = Math.round(Math.min(90, Math.max(35, (width * height) / 18000)));
    particles = [];
    for (let i = 0; i < count; i++) {
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.8,
        color
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 160 && d > 0.01) {
          p.vx += (dx / d) * 0.012;
          p.vy += (dy / d) * 0.012;
        }
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.995;
      p.vy *= 0.995;

      const speed = Math.hypot(p.vx, p.vy);
      if (speed > 0.8) {
        p.vx = (p.vx / speed) * 0.8;
        p.vy = (p.vy / speed) * 0.8;
      }

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;
    }

    const LINK = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(${LINK_COLOR}, ${(1 - d / LINK) * 0.22})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0.55)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);

  if (reducedMotion) return;

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  frame();
}

function initRevealAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cardTargets = '.skill-card, .project-card, .stat-card, .timeline-card, .cert-card, .achievement-card, .contact-info-card, .contact-form-card, .about-text-card, .soft-skills-block, .projects-filter, .skills-filter';

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  function register(rootEl) {
    const root = rootEl || document;

    root.querySelectorAll(cardTargets).forEach((el, i) => {
      if (el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      el.style.transitionDelay = `${Math.min(i % 6, 5) * 0.07}s`;
      observer.observe(el);
    });
  }

  register(document);

  const dynamicContainers = document.querySelectorAll(
    '.skills-grid, .projects-grid, .certs-grid, .achievements-grid, .timeline, .about-grid, .contact-grid'
  );
  const mo = new MutationObserver(() => register(document));
  dynamicContainers.forEach(grid => mo.observe(grid, { childList: true }));
}

function initScrollAnimations() {
  const progressBar = document.getElementById('scrollProgress');
  const heroVisual = document.querySelector('.hero-visual');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  let ticking = false;

  function update() {
    ticking = false;
    const vh = window.innerHeight;
    const maxScroll = document.documentElement.scrollHeight - vh;

    if (progressBar) {
      const progress = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    }

    document.querySelectorAll('.project-thumb').forEach(thumb => {
      const rect = thumb.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > vh + 80) return;
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      thumb.style.setProperty('--p', p.toFixed(3));
    });

    if (heroVisual) {
      const rect = heroVisual.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < vh) {
        const p = Math.min(1, -rect.top / vh);
        heroVisual.style.transform = `translateY(${(p * 46).toFixed(1)}px)`;
      }
    }
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
}
