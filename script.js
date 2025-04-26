// Navigation
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    // Toggle Nav
    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInside = nav.contains(event.target) || burger.contains(event.target);
        
        if (!isClickInside && nav.classList.contains('active')) {
            nav.classList.remove('active');
            
            navLinks.forEach((link) => {
                link.style.animation = '';
            });
            
            burger.classList.remove('toggle');
        }
    });
    
    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            
            navLinks.forEach((link) => {
                link.style.animation = '';
            });
            
            burger.classList.remove('toggle');
        });
    });
};

// Sticky Navigation
const stickyNav = () => {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
};

// Smooth Scrolling for Navigation Links
const smoothScroll = () => {
    const navLinks = document.querySelectorAll('.nav-links a, .cta-buttons a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Adjust for header height
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Contact Form Handling
const contactForm = () => {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to a server
            // For now, let's just log it and show a success message
            console.log('Form Data:', { name, email, subject, message });
            
            // Show success message
            const formGroups = document.querySelectorAll('.form-group');
            formGroups.forEach(group => group.style.display = 'none');
            
            form.querySelector('button').style.display = 'none';
            
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting me, ${name}. I'll get back to you soon.</p>
                <button class="btn primary-btn" id="resetForm">Send Another Message</button>
            `;
            
            form.appendChild(successMessage);
            
            // Reset form button
            document.getElementById('resetForm').addEventListener('click', () => {
                form.reset();
                successMessage.remove();
                formGroups.forEach(group => group.style.display = 'block');
                form.querySelector('button').style.display = 'block';
            });
        });
    }
};

// Reveal Elements on Scroll
const revealOnScroll = () => {
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            
            if (sectionTop < windowHeight - revealPoint) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    });
};

// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    // Toggle navigation menu
    burger.addEventListener('click', function() {
        nav.classList.toggle('active');
        
        // Burger animation
        burger.classList.toggle('toggle');
        
        // Animate links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });
    
    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                burger.classList.remove('toggle');
                
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });
    
    // Add scroll animation for sections
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(li => {
            li.classList.remove('active');
            if (li.querySelector('a').getAttribute('href') === `#${current}`) {
                li.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Typing effect for hero section
    const heroTitle = document.querySelector('.hero-content h1');
    const heroText = heroTitle.innerHTML;
    const speed = 50;
    
    // Add animation class for burger menu
    document.styleSheets[0].insertRule(`
        @keyframes navLinkFade {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `, document.styleSheets[0].cssRules.length);
    
    document.styleSheets[0].insertRule(`
        .burger.toggle .line1 {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
    `, document.styleSheets[0].cssRules.length);
    
    document.styleSheets[0].insertRule(`
        .burger.toggle .line2 {
            opacity: 0;
        }
    `, document.styleSheets[0].cssRules.length);
    
    document.styleSheets[0].insertRule(`
        .burger.toggle .line3 {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    `, document.styleSheets[0].cssRules.length);
    
    // Add scrolling animation for about cards
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.about-card, .skill-card, .project-card, .timeline-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
    
    document.styleSheets[0].insertRule(`
        .about-card.animate, .skill-card.animate, .project-card.animate, .timeline-item.animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `, document.styleSheets[0].cssRules.length);
});

// Initialize all functions
document.addEventListener('DOMContentLoaded', () => {
    navSlide();
    stickyNav();
    smoothScroll();
    contactForm();
    revealOnScroll();
});
