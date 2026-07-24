document.addEventListener('DOMContentLoaded', function () {
  // ==========================================
  // 1. LOADING SCREEN
  // ==========================================
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(function () {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 800);
  }

  // ==========================================
  // 2. ACTIVE NAV LINK
  // ==========================================
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (href === 'index.html' && currentPage === '')) {
      link.classList.add('active');
    }
  });

  // ==========================================
  // 3. ENTRY QUIZ
  // ==========================================
  const quizOverlay = document.getElementById('entryQuizOverlay');
  const quizQuestionText = document.getElementById('quizQuestion');
  const quizOptions = document.getElementById('quizOptions');
  const quizStep = document.getElementById('quizStep');

  const questions = [
    {
      question: 'What is your primary goal?',
      options: [
        { label: 'Pitching to investors', target: 'services.html' },
        { label: 'Improving presentation confidence', target: '#services' },
        { label: 'Building startup team communication', target: 'services.html' }
      ]
    },
    {
      question: 'Who is your main audience?',
      options: [
        { label: 'Investors', target: 'services.html' },
        { label: 'Customers and partners', target: 'services.html' },
        { label: 'Team members and leadership', target: 'services.html' }
      ]
    },
    {
      question: 'How soon do you need support?',
      options: [
        { label: 'Within the next 1-2 weeks', target: 'services.html' },
        { label: 'Within a month', target: 'services.html' },
        { label: 'Flexible timeline', target: 'services.html' }
      ]
    }
  ];

  let activeStep = 0;
  let selectedAnswers = [null, null, null];

  function renderQuizStep() {
    const current = questions[activeStep];
    quizQuestionText.textContent = current.question;
    quizStep.textContent = activeStep + 1;

    quizOptions.innerHTML = '';
    current.options.forEach(function (option, index) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-answer';
      button.innerHTML = option.label;
      button.dataset.index = index;
      if (selectedAnswers[activeStep] === option.label) {
        button.classList.add('selected');
      }
      button.addEventListener('click', function () {
        selectedAnswers[activeStep] = option.label;
        if (activeStep < questions.length - 1) {
          activeStep += 1;
          renderQuizStep();
        } else {
          closeQuiz(option.target);
        }
      });
      quizOptions.appendChild(button);
    });
  }

  function closeQuiz(target) {
    if (!quizOverlay) return;
    quizOverlay.classList.remove('active');
    quizOverlay.style.display = 'none';
    document.body.classList.remove('quiz-open');
    if (window.localStorage) {
      localStorage.setItem('eloquentEarQuizShown', 'true');
    }
    if (target) {
      if (target.startsWith('#')) {
        const section = document.querySelector(target);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        location.href = target;
      }
    }
  }

  const quizShown = window.localStorage && localStorage.getItem('eloquentEarQuizShown') === 'true';
  const shouldShowQuiz = false;

  if (shouldShowQuiz && quizOverlay && !quizShown) {
    quizOverlay.classList.add('active');
    document.body.classList.add('quiz-open');
    renderQuizStep();
  }

  // ==========================================
  // 4. FAQ ACCORDION
  // ==========================================
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const button = item.querySelector('.faq-question');
    const content = item.querySelector('.faq-content');

    if (!button || !content) return;

    // Set initial state
    content.style.maxHeight = '0';
    content.style.overflow = 'hidden';

    button.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all other FAQ items
      document.querySelectorAll('.faq-item').forEach(function (otherItem) {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherContent) {
            otherContent.style.maxHeight = '0';
          }
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        content.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ==========================================
  // 5. CONTACT FORM
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        successMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please complete all required fields.';
        successMessage.style.color = '#ff6b6b';
        return;
      }

      successMessage.innerHTML = `<i class="fas fa-check-circle"></i> Thanks, ${nameInput.value.trim()}! Your message has been sent. We'll respond within 24 hours.`;
      successMessage.style.color = '#d4af37';

      contactForm.reset();

      // Clear success message after 8 seconds
      setTimeout(function () {
        successMessage.innerHTML = '';
      }, 8000);
    });
  }

  // ==========================================
  // 6. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.service-card, .process-step, .team-card, .faq-item, .mission-card');

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // ==========================================
  // 7. SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // 8. NAVBAR SHADOW ON SCROLL
  // ==========================================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });
  }
});

// ==========================================
// 9. PAGE TRANSITION (for internal links)
// ==========================================
document.querySelectorAll('a:not([target="_blank"]):not([href^="http"])').forEach(function (link) {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      e.preventDefault();
      const loader = document.getElementById('loader');
      if (loader) {
        loader.classList.remove('hidden');
        setTimeout(function () {
          window.location.href = href;
        }, 400);
      } else {
        window.location.href = href;
      }
    }
  });
});