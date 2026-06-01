document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // STICKY HEADER & ACTIVE LINK ON SCROLL
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        const scrollPos = window.scrollY;

        // Sticky Nav State
        if (scrollPos > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset for sticky header
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on load to set initial state

    // ==========================================================================
    // MOBILE MENU TOGGLE
    // ==========================================================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isActive = menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active', isActive);
            // Disable scroll when mobile menu is active
            document.body.style.overflowY = isActive ? 'hidden' : '';
        });

        // Close menu when a navigation link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflowY = '';
            });
        });
    }

    // ==========================================================================
    // INTERSECTION OBSERVER FOR SCROLL REVEALS
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.12, // Element is 12% visible
        rootMargin: '0px 0px -50px 0px' // Offset bottom slightly for better timing
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // SKILL BARS LOAD ON REVEAL
    // ==========================================================================
    const skillCard = document.querySelector('.skills-card');
    const skillProgressBars = document.querySelectorAll('.skill-progress');

    // Store target widths from HTML inline style, then reset to 0
    skillProgressBars.forEach(bar => {
        const targetWidth = bar.style.width || '0%';
        bar.dataset.targetWidth = targetWidth;
        bar.style.width = '0%';
    });

    const triggerSkillAnimations = (parentCard) => {
        const parentProgressBars = parentCard.querySelectorAll('.skill-progress');
        parentProgressBars.forEach(bar => {
            if (bar.dataset.targetWidth) {
                bar.style.width = bar.dataset.targetWidth;
            }
        });
    };

    // Observe each skill card individually to animate progress bars when they enter viewport
    const skillCards = document.querySelectorAll('.skills-card');
    const skillCardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerSkillAnimations(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    skillCards.forEach(card => {
        skillCardObserver.observe(card);
    });

    // ==========================================================================
    // MOCK CONTACT FORM SUBMISSION
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const successToast = document.getElementById('successToast');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && successToast && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation check
            const name = document.getElementById('formName').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const subject = document.getElementById('formSubject').value.trim();
            const message = document.getElementById('formMessage').value.trim();

            if (!name || !email || !subject || !message) {
                alert('Please fill out all required fields.');
                return;
            }

            // Enter loading state
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span>Sending...</span>
                <svg class="btn-icon spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" stroke-dasharray="80" stroke-dashoffset="0"></circle>
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.1.9 2 2 2s2-.9 2-2c0-3.31 2.69-6 6-6s6 2.69 6 6c0 1.1.9 2 2 2s2-.9 2-2c0-5.523-4.477-10-10-10z" fill="currentColor"></path>
                </svg>
            `;

            // Simulate API Request network delay (1.5 seconds)
            setTimeout(() => {
                // Clear form
                contactForm.reset();
                
                // Reset submit button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                
                // Show Success Toast
                successToast.classList.remove('hidden');
                contactForm.style.opacity = '0.05';
                contactForm.style.pointerEvents = 'none';

                // Auto-close success message after 5 seconds
                setTimeout(() => {
                    successToast.classList.add('hidden');
                    contactForm.style.opacity = '1';
                    contactForm.style.pointerEvents = 'auto';
                }, 5000);

            }, 1500);
        });
    }

    // Add spinner rotation animation via Javascript to styles dynamically if not loaded
    const styleSheet = document.createElement('style');
    styleSheet.innerText = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .spinner {
            animation: spin 0.8s linear infinite;
        }
    `;
    document.head.appendChild(styleSheet);
});
