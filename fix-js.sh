#!/bin/bash
# Re-add reveal-up to js/main.js
cat << 'INNER_EOF' >> js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Original index.html reveal elements (.reveal-up)
    const indexRevealElements = document.querySelectorAll('.reveal-up');

    const indexRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    });

    indexRevealElements.forEach(el => {
        indexRevealObserver.observe(el);
    });
});
INNER_EOF
