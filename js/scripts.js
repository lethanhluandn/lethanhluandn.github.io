window.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('#primary-nav');
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const menuToggle = document.querySelector('.menu-toggle');
    const currentYear = document.querySelector('#current-year');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    nav.classList.remove('is-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    const updateActiveLink = (id) => {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const sections = Array.from(document.querySelectorAll('main section[id]'));

    if ('IntersectionObserver' in window && sections.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        updateActiveLink(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-45% 0px -45% 0px',
                threshold: 0,
            }
        );

        sections.forEach((section) => observer.observe(section));
    } else if (sections.length > 0) {
        updateActiveLink(sections[0].id);
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) {
                return;
            }

            const target = document.querySelector(targetId);
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({
                behavior: reduceMotion ? 'auto' : 'smooth',
                block: 'start',
            });
            history.replaceState(null, '', targetId);
        });
    });
});
