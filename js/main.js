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

    // 4. Magnetic Hover Effect
    const magneticButtons = document.querySelectorAll('[data-magnetic]');
    
    magneticButtons.forEach(btn => {
        const text = btn.querySelector('.btn__text');
        
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move button slightly
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            
            // Move text slightly more for parallax effect
            if (text) {
                text.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            if (text) {
                text.style.transform = '';
            }
        });
    });

    // 5. Modal Logic and Geometry Simulator
    const modal = document.getElementById('geometry-modal');
    const openBtn = document.getElementById('open-geometry-modal');
    const closeBtn = document.getElementById('close-geometry-modal');
    const simulatorSvg = document.querySelector('.geometry-simulator__svg');
    const simulatorText = document.querySelector('.geometry-simulator__text');
    
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
