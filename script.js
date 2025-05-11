document.addEventListener('DOMContentLoaded', () => {
    // Burger Menu Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        burger.classList.toggle('toggle');
    });

    navLinks.forEach((link, index) => {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.query individuales(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form Submission
    window.submitForm = function() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (name && email && message) {
            alert('Thank you for your message! We’ll get back to you soon.');
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';
        } else {
            alert('Please fill out all fields.');
        }
    };

    // Mock QR Scanner
    window.startMockScan = function() {
        const scanner = document.getElementById('scanner');
        const productData = document.getElementById('product-data');
        const scanButton = document.querySelector('.scanner-container .cta-button');

        // Disable button during scan
        scanButton.disabled = true;
        scanButton.textContent = 'Scanning...';

        // Start scan animation
        scanner.classList.add('active');

        // Simulate scan delay
        setTimeout(() => {
            scanner.classList.remove('active');
            productData.style.display = 'block';
            scanButton.disabled = false;
            scanButton.textContent = 'Scan QR Code';
        }, 2000);
    };
});

// Animation for nav links
const style = document.createElement('style');
style.innerHTML = `
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
`;
document.head.appendChild(style);