/* ВСТАВИТЬ В JS/MAIN.JS */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Header Scroll Effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Initial Staggered Animation
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('.fade-in-up');
        animatedElements.forEach(el => {
            el.classList.add('is-visible');
        });
    }, 100);

    // 3. SVG Animation on Hero Visual (1 second delay)
    setTimeout(() => {
        const geometryLines = document.querySelectorAll('.geometry-line');
        const geometryPoints = document.querySelectorAll('.geometry-point');
        
        geometryLines.forEach(line => {
            // Calculate exact length for precise dasharray/dashoffset
            const length = line.getTotalLength();
            line.style.strokeDasharray = length;
            line.style.strokeDashoffset = length;
            
            // Trigger animation class
            line.classList.add('draw-line');
        });

        geometryPoints.forEach(point => {
            point.classList.add('show-point');
        });
    }, 1000);

    // 4. Magnetic Hover Effect (Smooth 60 FPS)
    const magneticButtons = document.querySelectorAll('[data-magnetic]');
    
    magneticButtons.forEach(btn => {
        const text = btn.querySelector('.btn__text');
        let rect = btn.getBoundingClientRect();
        
        // Use requestAnimationFrame for smooth 60 FPS updates
        let mouseX = 0;
        let mouseY = 0;
        let btnX = 0;
        let btnY = 0;
        let textX = 0;
        let textY = 0;
        let isHovered = false;

        const update = () => {
            // Easing for smooth follow (intertia)
            const ease = 0.15;
            
            if (isHovered) {
                // Calculate target positions based on cursor distance from center
                const targetX = (mouseX - rect.left - rect.width / 2) * 0.3; // Magnet strength on container
                const targetY = (mouseY - rect.top - rect.height / 2) * 0.3;

                // Move current pos towards target using easing
                btnX += (targetX - btnX) * ease;
                btnY += (targetY - btnY) * ease;
                
                // Text moves slightly less for parallax
                textX += (targetX * 0.5 - textX) * ease;
                textY += (targetY * 0.5 - textY) * ease;
            } else {
                // Return to origin (0,0)
                btnX += (0 - btnX) * ease;
                btnY += (0 - btnY) * ease;
                textX += (0 - textX) * ease;
                textY += (0 - textY) * ease;
            }

            // Apply via translate3d for GPU acceleration
            btn.style.transform = `translate3d(${btnX}px, ${btnY}px, 0)`;
            if (text) {
                text.style.transform = `translate3d(${textX}px, ${textY}px, 0)`;
            }

            // Only request next frame if we are hovered, OR if we haven't settled back to origin yet
            if (isHovered || Math.abs(btnX) > 0.1 || Math.abs(btnY) > 0.1) {
                requestAnimationFrame(update);
            }
        };

        btn.addEventListener('mouseenter', () => {
            isHovered = true;
            rect = btn.getBoundingClientRect(); // Update on enter in case window scrolled
            requestAnimationFrame(update);
        });

        btn.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        btn.addEventListener('mouseleave', () => {
            isHovered = false;
        });
    });

    // 5. Modal Logic and Geometry Simulator
    const modal = document.getElementById('geometry-modal');
    const openBtn = document.getElementById('open-geometry-modal');
    const closeBtn = document.getElementById('close-geometry-modal');
    const simulatorSvg = document.querySelector('.geometry-simulator__svg');
    const simulatorText = document.querySelector('.geometry-simulator__text');
    
    // Only bind modal logic if elements exist (to prevent errors on subpages)
    if (modal && openBtn) {
    
    let simulatorAnimationTimeout;

    const openModal = () => {
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        startGeometrySimulation();
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
        clearTimeout(simulatorAnimationTimeout);
        // Reset simulator
        simulatorSvg.innerHTML = '';
        simulatorText.textContent = 'Идет анализ анатомии лица...';
    };

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    
    // Close on overlay click
    modal.querySelector('.modal__overlay').addEventListener('click', closeModal);
    
    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    const startGeometrySimulation = () => {
        // Clear previous paths
        simulatorSvg.innerHTML = '';
        simulatorText.textContent = 'Идет анализ анатомии лица...';
        
        // Define some geometry lines to simulate facial analysis
        const lines = [
            { d: "M20,40 L80,40", delay: 500 }, // Brows line
            { d: "M50,20 L50,80", delay: 1000 }, // Center axis
            { d: "M30,50 L50,80 L70,50", delay: 1500 }, // Jawline angle
            { d: "M35,40 L45,45 M65,40 L55,45", delay: 2000 } // Eye angles
        ];
        
        lines.forEach((lineData, index) => {
            simulatorAnimationTimeout = setTimeout(() => {
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", lineData.d);
                path.setAttribute("class", "geometry-line draw-line");
                
                // Need to set stroke dash properties dynamically after inserting to get length
                path.style.strokeDasharray = 1000;
                path.style.strokeDashoffset = 1000;
                
                simulatorSvg.appendChild(path);
                
                // Force reflow and set actual length
                setTimeout(() => {
                    const length = path.getTotalLength();
                    path.style.strokeDasharray = length;
                    path.style.strokeDashoffset = length;
                }, 10);
                
                if (index === lines.length - 1) {
                    setTimeout(() => {
                        simulatorText.textContent = 'Идеальная геометрия подобрана.';
                    }, 1000);
                }
            }, lineData.delay);
        });
    };
    } // End of modal check

    // --- ACCORDION LOGIC (FAQ) ---
    const accordionTriggers = document.querySelectorAll('.accordion-item__trigger');
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.accordion-item');
            
            // Optional: Close other open items (uncomment if desired)
            /*
            const currentlyOpen = document.querySelector('.accordion-item.is-open');
            if (currentlyOpen && currentlyOpen !== item) {
                currentlyOpen.classList.remove('is-open');
                currentlyOpen.querySelector('.accordion-item__trigger').setAttribute('aria-expanded', 'false');
            }
            */

            // Toggle current item
            const isOpen = item.classList.contains('is-open');
            item.classList.toggle('is-open');
            trigger.setAttribute('aria-expanded', !isOpen);
        });
    });

    // --- SCROLL REVEAL ANIMATIONS (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
