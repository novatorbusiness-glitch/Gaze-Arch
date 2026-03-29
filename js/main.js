document.addEventListener('DOMContentLoaded', () => {

    // 1. HEADER SCROLL & BLUR
    const header = document.querySelector('.js-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. FADE-IN-UP ANIMATION (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-up');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // 0.1s delay between elements
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // 3. MAGNETIC HOVER EFFECT FOR BUTTONS
    const magneticElements = document.querySelectorAll('[data-magnetic]');

    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Limit movement to a small radius
            const limit = 10;
            const moveX = Math.max(-limit, Math.min(limit, x * 0.2));
            const moveY = Math.max(-limit, Math.min(limit, y * 0.2));

            el.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });

    // 4. GEOMETRY MINI-GAME (CANVAS)
    const openBtn = document.querySelector('.js-open-geometry');
    const closeBtn = document.querySelector('.js-close-geometry');
    const overlay = document.querySelector('.js-geometry-overlay');
    const canvas = document.getElementById('geometryCanvas');
    const ctx = canvas.getContext('2d');

    let isGameActive = false;
    let points = [];
    let mousePos = { x: 0, y: 0 };
    let activeLines = [];
    const SNAP_DISTANCE = 40;

    // Face Silhouette abstract image drawing
    function drawFaceSilhouette() {
        ctx.fillStyle = '#EAE1DE';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        // Abstract simple shape for silhouette
        const cw = canvas.width;
        const ch = canvas.height;
        ctx.ellipse(cw / 2, ch / 2, cw * 0.2, ch * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    function initGame() {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        generatePoints();
        draw();

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    function generatePoints() {
        const cw = canvas.width;
        const ch = canvas.height;
        points = [
            // Left Eye Area
            { x: cw * 0.4, y: ch * 0.45, snapped: false },
            { x: cw * 0.45, y: ch * 0.43, snapped: false },
            // Right Eye Area
            { x: cw * 0.6, y: ch * 0.45, snapped: false },
            { x: cw * 0.55, y: ch * 0.43, snapped: false },
            // Left Eyebrow
            { x: cw * 0.38, y: ch * 0.38, snapped: false },
            { x: cw * 0.46, y: ch * 0.37, snapped: false },
            // Right Eyebrow
            { x: cw * 0.62, y: ch * 0.38, snapped: false },
            { x: cw * 0.54, y: ch * 0.37, snapped: false }
        ];
        activeLines = [];
    }

    function resizeCanvas() {
        const container = document.querySelector('.geometry-game-container');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        if(isGameActive) {
            generatePoints(); // Regenerate points based on new size
            draw();
        }
    }

    function handleMouseMove(e) {
        if (!isGameActive) return;
        const rect = canvas.getBoundingClientRect();
        mousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        checkSnap();
        draw();
    }

    function handleTouchMove(e) {
        if (!isGameActive) return;
        e.preventDefault(); // Prevent scrolling while playing
        const rect = canvas.getBoundingClientRect();
        mousePos = {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        };
        checkSnap();
        draw();
    }

    function checkSnap() {
        let nearestPoint = null;
        let minDist = SNAP_DISTANCE;

        points.forEach(p => {
            const dist = Math.hypot(p.x - mousePos.x, p.y - mousePos.y);
            if (dist < minDist) {
                minDist = dist;
                nearestPoint = p;
            }
        });

        if (nearestPoint && !nearestPoint.snapped) {
            nearestPoint.snapped = true;
            // Create a line connecting mouse to point temporarily
            activeLines.push({ ...nearestPoint });
        }
    }

    function draw() {
        if (!isGameActive) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawFaceSilhouette();

        // Draw points
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = p.snapped ? '#E0C7C0' : 'rgba(107, 94, 83, 0.3)'; // #E0C7C0 Accent, #6B5E53 Text
            ctx.fill();
        });

        // Draw connecting lines
        ctx.strokeStyle = '#E0C7C0';
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        // Draw trailing line from last snapped point to mouse
        const snappedPoints = points.filter(p => p.snapped);
        if (snappedPoints.length > 0) {
            ctx.moveTo(snappedPoints[0].x, snappedPoints[0].y);
            for (let i = 1; i < snappedPoints.length; i++) {
                ctx.lineTo(snappedPoints[i].x, snappedPoints[i].y);
            }
            // Line from last point to current mouse position
            const lastPoint = snappedPoints[snappedPoints.length - 1];

            // Only draw to mouse if we haven't snapped all points
            if (snappedPoints.length < points.length) {
                ctx.lineTo(mousePos.x, mousePos.y);
            }
        }
        ctx.stroke();

        // Check completion
        if (snappedPoints.length === points.length) {
            drawCompletionEffect();
        }
    }

    function drawCompletionEffect() {
        ctx.font = '24px Montserrat';
        ctx.fillStyle = '#6B5E53';
        ctx.textAlign = 'center';
        ctx.fillText('Идеальная архитектура построена', canvas.width / 2, canvas.height - 50);
    }


    // Event Listeners for Game Modal
    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('active');
        isGameActive = true;
        initGame();
        document.body.style.overflow = 'hidden'; // Lock scroll
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        isGameActive = false;
        document.body.style.overflow = ''; // Unlock scroll
        window.removeEventListener('resize', resizeCanvas);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('touchmove', handleTouchMove);
    });
});