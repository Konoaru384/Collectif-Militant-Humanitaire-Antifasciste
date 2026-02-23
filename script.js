document.addEventListener('DOMContentLoaded', () => {

    const burger = document.getElementById('burger');
    const navMenu = document.getElementById('nav-menu');

    burger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const spans = burger.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(7px, -6px)' : 'none';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('progress-bar').style.width = scrolled + '%';
        
        const nav = document.querySelector('.navbar');
        if(window.scrollY > 50) {
            nav.style.background = "rgba(0,0,0,0.95)";
            nav.style.padding = "10px 5%";
        } else {
            nav.style.background = "rgba(0,0,0,0.8)";
            nav.style.padding = "15px 5%";
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-scale, .reveal-up, .reveal');
    revealElements.forEach(el => observer.observe(el));

    const glitchTitle = document.querySelector('.glitch');
    setInterval(() => {
        if(Math.random() > 0.95) {
            glitchTitle.style.transform = `translate(${Math.random()*5}px, ${Math.random()*5}px)`;
            setTimeout(() => glitchTitle.style.transform = 'none', 100);
        }
    }, 200);
});