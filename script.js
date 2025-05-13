document.addEventListener('DOMContentLoaded', () => {
    // Burger Menu Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');

    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        burger.classList.toggle('toggle');
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // QR Scanner
    const video = document.getElementById('scanner-video');
    const canvas = document.getElementById('scanner-canvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('start-scanner');
    let stream = null;
    let scanning = false;

    if (startButton) {
        startButton.addEventListener('click', async () => {
            if (scanning) {
                stopScanner();
            } else {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: 'environment' }
                    });
                    video.srcObject = stream;
                    video.play();
                    video.classList.add('active');
                    startButton.textContent = 'Stop Scanner';
                    startButton.classList.add('active');
                    scanning = true;
                    scanQRCode();
                } catch (err) {
                    console.error('Error accessing camera:', err);
                    alert('Unable to access camera. Please check permissions or use HTTPS.');
                }
            }
        });
    }

    function scanQRCode() {
        if (scanning && video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
                alert('QR Code detected: ' + code.data);
                stopScanner();
            }
            requestAnimationFrame(scanQRCode);
        }
    }

    function stopScanner() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
            video.classList.remove('active');
            startButton.textContent = 'Start Scanner';
            startButton.classList.remove('active');
            scanning = false;
        }
    }

    // Email Validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = contactForm.querySelector('input[name="email"]');
            const emailError = document.getElementById('email-error');
            if (!validateEmail(emailInput.value)) {
                emailError.textContent = 'Please enter a valid email address.';
                emailError.style.display = 'block';
                return;
            }
            emailError.style.display = 'none';
            alert('Form submitted! (Mock response)');
            contactForm.submit();
        });
    }

    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[name="email"]');
            const errorId = form.id.includes('research') ? 'newsletter-email-error-research' :
                           form.id.includes('recipes') ? 'newsletter-email-error-recipes' :
                           form.id.includes('news') ? 'newsletter-email-error-news' :
                           'newsletter-email-error';
            const emailError = document.getElementById(errorId);
            if (!validateEmail(emailInput.value)) {
                emailError.textContent = 'Please enter a valid email address.';
                emailError.style.display = 'block';
                return;
            }
            emailError.style.display = 'none';
            alert('Subscribed successfully! Thank you, ' + emailInput.value);
            form.reset();
        });
    });

    // Research Popups
    const readMoreButtons = document.querySelectorAll('.read-more');
    const popups = document.querySelectorAll('.popup');
    const closeButtons = document.querySelectorAll('.close-popup');

    readMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const articleId = button.getAttribute('data-article');
            const popup = document.getElementById(articleId);
            popup.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            popups.forEach(popup => {
                popup.classList.add('close');
                setTimeout(() => {
                    popup.style.display = 'none';
                    popup.classList.remove('close');
                    document.body.style.overflow = 'auto';
                }, 300);
            });
        });
    });

    popups.forEach(popup => {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.add('close');
                setTimeout(() => {
                    popup.style.display = 'none';
                    popup.classList.remove('close');
                    document.body.style.overflow = 'auto';
                }, 300);
            }
        });
    });

    // Back to Top Button
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Card Animations
    const cards = document.querySelectorAll('.about-card, .solution-card, .news-card, .research-card, .recipe-card, .news-article');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'fadeIn 0.5s ease-out forwards';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => {
        observer.observe(card);
    });

    // Hero Background Zoom
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundSize = `${100 + scrolled / 50}%`;
        }
    });

    // Molecule Interaction
    const orbits = document.querySelectorAll('.molecule-orbit');
    orbits.forEach(orbit => {
        orbit.addEventListener('mouseenter', () => {
            orbit.style.transform = 'scale(1.3)';
        });
        orbit.addEventListener('mouseleave', () => {
            orbit.style.transform = 'scale(1)';
        });
    });
});