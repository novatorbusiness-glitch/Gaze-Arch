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
    const magneticElements = document.querySelectorAll('[data-magnetic], .js-magnetic');

    magneticElements.forEach((el) => {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let animationFrameId = null;

        const lerp = (start, end, factor) => {
            return start + (end - start) * factor;
        };

        const updatePosition = () => {
            currentX = lerp(currentX, mouseX, 0.1); // Lerp factor (0.1) controls the "stickiness" or delay
            currentY = lerp(currentY, mouseY, 0.1);

            // Apply transformation
            el.style.transform = `translate(${currentX}px, ${currentY}px)`;

            // Continue animating if difference is significant, otherwise stop
            if (Math.abs(currentX - mouseX) > 0.1 || Math.abs(currentY - mouseY) > 0.1) {
                animationFrameId = requestAnimationFrame(updatePosition);
            } else {
                animationFrameId = null;
            }
        };

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            // Calculate distance from center of the element
            const x = (e.clientX - rect.left - rect.width / 2);
            const y = (e.clientY - rect.top - rect.height / 2);

            // Limit the maximum movement
            const strength = 0.3; // How far it can move relative to mouse
            mouseX = x * strength;
            mouseY = y * strength;

            // Start animation loop if not running
            if (!animationFrameId) {
                updatePosition();
            }
        });

        el.addEventListener('mouseleave', () => {
            // Reset target position
            mouseX = 0;
            mouseY = 0;

            if (!animationFrameId) {
                updatePosition();
            }

            // Ensure snap back to exactly 0,0 after a delay
            setTimeout(() => {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
                el.style.transform = '';
            }, 500);
        });
    });

    // 4. VIDEO PLAY BUTTON (BLOCK 3)
    const playBtns = document.querySelectorAll('.js-play-video');
    playBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Video play triggered');
            // В будущем здесь будет логика открытия модального окна с плеером
        });
    });

    // 5. GEOMETRY MINI-GAME (CANVAS)
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

    // 6. BONUS MODAL LOGIC (LEAD MAGNET)
    const bonusModalOverlay = document.querySelector('.js-bonus-modal-overlay');
    const openBonusBtns = document.querySelectorAll('.js-open-bonus-modal');
    const closeBonusBtn = document.querySelector('.js-close-bonus-modal');

    if (bonusModalOverlay && closeBonusBtn) {
        // Open modal
        openBonusBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                bonusModalOverlay.classList.add('is-open');
                document.body.style.overflow = 'hidden'; // Lock background scroll
            });
        });

        // Close modal on button click
        closeBonusBtn.addEventListener('click', () => {
            bonusModalOverlay.classList.remove('is-open');
            document.body.style.overflow = ''; // Unlock scroll
        });

        // Close modal on overlay click (outside the content)
        bonusModalOverlay.addEventListener('click', (e) => {
            if (e.target === bonusModalOverlay) {
                bonusModalOverlay.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && bonusModalOverlay.classList.contains('is-open')) {
                bonusModalOverlay.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        });

        // Form submit override (prevent default for demo purposes)
        const bonusForm = bonusModalOverlay.querySelector('.bonus-form');
        if (bonusForm) {
            bonusForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitBtn = bonusForm.querySelector('.modal-submit');
                const originalText = submitBtn.textContent;

                submitBtn.textContent = 'Отправлено!';
                submitBtn.style.backgroundColor = 'var(--text-color)';
                submitBtn.style.color = 'var(--bg-color)';

                setTimeout(() => {
                    bonusModalOverlay.classList.remove('is-open');
                    document.body.style.overflow = '';
                    // Reset form
                    bonusForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                }, 2000);
            });
        }
    }

});
/* ==========================================================================
   FAQ ACCORDION LOGIC
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const currentItem = question.closest('.faq-item');
            const isOpen = currentItem.classList.contains('is-open');

            // Close all items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('is-open');
                const btn = item.querySelector('.faq-question');
                btn.setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isOpen) {
                currentItem.classList.add('is-open');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
});
