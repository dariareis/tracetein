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
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form Submission (Mock)
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

// QR Scanner
let video = null;
let stream = null;

function startScanner() {
    const videoElement = document.getElementById('scanner-video');
    const canvasElement = document.getElementById('scanner-canvas');
    const canvas = canvasElement.getContext('2d');
    const productData = document.getElementById('product-data');
    const startButton = document.querySelector('.scanner-controls .cta-button');

    if (!video) {
        video = videoElement;
    }

    // Request webcam access
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(mediaStream => {
            stream = mediaStream;
            video.srcObject = stream;
            video.play();
            startButton.textContent = 'Stop Scanner';
            startButton.onclick = stopScanner;
            requestAnimationFrame(tick);
        })
        .catch(err => {
            alert('Error accessing webcam: ' + err.message);
            startButton.textContent = 'Start Scanner';
            startButton.onclick = startScanner;
        });

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });

            if (code) {
                // Simulate QR code data for demo
                if (code.data) {
                    productData.style.display = 'block';
                    stopScanner();
                }
            }
        }
        if (stream) {
            requestAnimationFrame(tick);
        }
    }
}

function stopScanner() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
        const startButton = document.querySelector('.scanner-controls .cta-button');
        startButton.textContent = 'Start Scanner';
        startButton.onclick = startScanner;
    }
}

function scanQRImage() {
    const input = document.getElementById('qr-upload');
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });

            if (code) {
                document.getElementById('product-data').style.display = 'block';
            } else {
                alert('No QR code found in the image.');
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}