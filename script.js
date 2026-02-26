// 1. TYPING ANIMATION (Dynamic Content)
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.text = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullText = this.words[current];

        if (this.isDeleting) {
            this.text = fullText.substring(0, this.text.length - 1);
        } else {
            this.text = fullText.substring(0, this.text.length + 1);
        }

        this.element.textContent = this.text;

        let typeSpeed = 150;
        if (this.isDeleting) typeSpeed /= 2;

        if (!this.isDeleting && this.text === fullText) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.text === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}
// 2. INTERSECTION OBSERVER (Scroll Animations)
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
        }
    });
}, observerOptions);

// 3. FORM VALIDATION (Contact Form)
function validateForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="_replyto"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    // Clear form on page load
    clearFormOnLoad(form);

    // Real-time validation
    nameInput.addEventListener('blur', () => validateName(nameInput));
    emailInput.addEventListener('blur', () => validateEmail(emailInput));
    messageInput.addEventListener('blur', () => validateMessage(messageInput));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const isNameValid = validateName(nameInput);
        const isEmailValid = validateEmail(emailInput);
        const isMessageValid = validateMessage(messageInput);

        if (!isNameValid || !isEmailValid || !isMessageValid) {
            showNotification('Please fix the errors before submitting', 'error');
            return;
        }

        // Submit form via fetch to prevent redirect
        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                form.reset();
                clearAllErrors(form);
                showNotification('Message sent successfully!', 'success');
            } else {
                showNotification('Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        }
    });
}

function clearFormOnLoad(form) {
    // Clear form fields when page loads
    form.reset();
    
    // Clear any stored form data in browser
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.value = '';
        input.defaultValue = '';
    });
    
    // Clear any error messages
    clearAllErrors(form);
}

function clearAllErrors(form) {
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    const errorInputs = form.querySelectorAll('.input-error');
    errorInputs.forEach(input => input.classList.remove('input-error'));
}

function validateName(input) {
    const value = input.value.trim();
    if (value.length < 2) {
        showError(input, 'Name must be at least 2 characters');
        return false;
    }
    clearError(input);
    return true;
}

function validateEmail(input) {
    const value = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        showError(input, 'Please enter a valid email address');
        return false;
    }
    clearError(input);
    return true;
}

function validateMessage(input) {
    const value = input.value.trim();
    if (value.length < 10) {
        showError(input, 'Message must be at least 10 characters');
        return false;
    }
    clearError(input);
    return true;
}

function showError(input, message) {
    const formGroup = input.parentElement;
    let errorDiv = formGroup.querySelector('.error-message');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        formGroup.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    input.classList.add('input-error');
}

function clearError(input) {
    const formGroup = input.parentElement;
    const errorDiv = formGroup.querySelector('.error-message');
    if (errorDiv) errorDiv.remove();
    input.classList.remove('input-error');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 4. ANIMATED SKILL BARS
function animateSkillBars() {
    const skillCards = document.querySelectorAll('.skill-card');
    if (skillCards.length === 0) return;

    skillCards.forEach((card, index) => {
        const progressBar = document.createElement('div');
        progressBar.className = 'skill-progress';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'skill-progress-fill';
        
        const levels = [85, 75, 90, 80]; // Skill levels
        progressFill.style.width = '0%';
        progressFill.setAttribute('data-width', levels[index] + '%');
        
        progressBar.appendChild(progressFill);
        card.appendChild(progressBar);
    });

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.skill-progress-fill');
                if (fill) {
                    setTimeout(() => {
                        fill.style.width = fill.getAttribute('data-width');
                    }, 200);
                }
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillCards.forEach(card => skillObserver.observe(card));
}

// 5. MOBILE NAVIGATION TOGGLE
function setupMobileNav() {
    const nav = document.querySelector('nav');
    const navList = nav.querySelector('ul');
    
    // Create hamburger menu
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    hamburger.style.display = 'none';
    
    nav.insertBefore(hamburger, navList);

    hamburger.addEventListener('click', () => {
        navList.classList.toggle('nav-active');
        hamburger.classList.toggle('active');
    });

    // Show/hide hamburger based on screen size
    function checkScreenSize() {
        if (window.innerWidth <= 900) {
            hamburger.style.display = 'flex';
        } else {
            hamburger.style.display = 'none';
            navList.classList.remove('nav-active');
            hamburger.classList.remove('active');
        }
    }

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
}

// 6. SCROLL TO TOP BUTTON
function setupScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}



// 7. SMOOTH HOVER EFFECTS

function setupHoverEffects() {
    const cards = document.querySelectorAll('.skill-card, .project-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Initialize typing animation on home page
    const typeElement = document.querySelector('.hero-content h2');
    if (typeElement) {
        typeElement.textContent = '';
        new TypeWriter(typeElement, [
            'Web Designer & Full Stack Developer Student',
            'Creative Problem Solver',
            'Passionate About Beautiful Web Experiences'
        ], 2000);
    }

    // Setup scroll animations
    const fadeElements = document.querySelectorAll('.hero-content, .skill-card, .contact-form, .about-text, .skills-intro');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Initialize features
    validateForm();
    animateSkillBars();
    setupMobileNav();
    setupScrollToTop();
    setupHoverEffects();

    // Add smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
