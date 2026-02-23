document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const island = document.getElementById('island');
    let lastScroll = window.pageYOffset || 0; 
    
    // ✅ BUG FIX: Animation chalu asel tar scroll logic la block kara
    let isAnimatingLoad = true; 

    // Navbar Scroll Logic
    window.addEventListener('scroll', () => {
        // Jar initial animation chalu asel, tar scroll event ignore kara!
        if (isAnimatingLoad) return; 

        const currentScroll = window.pageYOffset;
        const menuBtn = document.getElementById('menu-btn');
        const isExpanded = menuBtn && menuBtn.getAttribute('aria-expanded') === 'true';

        if (isExpanded) return;
        
        if (currentScroll > lastScroll && currentScroll > 50) { 
            // Scrolling Down - Hide
            island.style.transform = "translate(-50%, -150%)"; 
        } else { 
            // Scrolling Up - Show (translate-x-1/2 tasach theva)
            island.style.transform = "translate(-50%, 0%)"; 
        }
        lastScroll = currentScroll;
    });

    // Page Load Animation
    window.addEventListener("load", () => {
        gsap.set(island, { opacity: 1, visibility: "visible" }); 

        // Jar user top var asel, tarach animation kara. 
        // Jar user ne khali scroll kela asel ani refresh kela, tar direct hide theva.
        if (window.scrollY < 50) {
            // ✅ BUG FIX: Animating 'top' instead of 'y' to protect the transform styling
            gsap.fromTo(island, 
                { top: "-100px" }, 
                { 
                    top: "24px", // 24px = top-6 in Tailwind
                    duration: 1.2, 
                    ease: "power3.out", 
                    delay: 0.2,
                    clearProps: "top", // Clean up inline styles after animation
                    onComplete: () => { 
                        isAnimatingLoad = false; // Allow scroll logic to work now
                    }
                }
            );
        } else {
            // Page refreshed mid-way down
            isAnimatingLoad = false;
            island.style.transform = "translate(-50%, -150%)"; 
        }
        
        gsap.from(".hero-anim", { y: 40, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.5 });
    });

    // Earth Timeline
    setTimeout(() => { 
        if(window.earthGroupObj && window.earthCameraObj) {
            let tl = gsap.timeline({ scrollTrigger: { 
                trigger: "#intro-spacer", start: "top top", end: "bottom bottom", scrub: 1, 
                onStart: () => { window.earthConfig.autoRotate = false; },
                onUpdate: (self) => { window.earthConfig.isRendering = self.progress <= 0.95; } 
            } });
            
            tl.to(window.earthGroupObj.position, { x: 0, duration: 3, ease: "power2.inOut" })
              .to(window.earthGroupObj.rotation, { y: -2.5, duration: 3, ease: "power2.inOut" }, "<")
              .to(window.earthCameraObj.position, { z: 9, duration: 3, ease: "power2.inOut" }, "<")
              .to("#hero", { opacity: 0, pointerEvents: "none", duration: 1 }, "<")
              .to("#scroll-ui", { opacity: 0, duration: 1 }, "<")
              .to("#about", { opacity: 1, pointerEvents: "auto", duration: 2 }, "-=1")
              .to("#canvas-container", { opacity: 0, duration: 2 }, "<")
              .to({}, { duration: 4 }); 
        }
    }, 100);

    // Project Cards Scroll
    function getScrollAmount() { 
        const track = document.querySelector(".project-track");
        const windowEl = document.querySelector(".project-window");
        if(track && windowEl) return -(track.offsetHeight - windowEl.offsetHeight); 
        return 0;
    }
    gsap.to(".project-track", { y: getScrollAmount, ease: "none", scrollTrigger: { trigger: ".sticky-wrapper", start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true } });

    // Footer Animation
    gsap.from(".footer-item", { opacity: 0, y: 80, duration: 1, stagger: 0.3, ease: "power3.out", scrollTrigger: { trigger: "#footer", start: "top 80%" } });

    // Smooth Scroll Links
    const navLinks = document.querySelectorAll('nav a, #mobile-menu a');
    navLinks.forEach(link => { 
        link.addEventListener('click', (e) => { 
            e.preventDefault(); 
            const tId = link.getAttribute('href'); 
            const menuBtn = document.getElementById('menu-btn');
            if(menuBtn && menuBtn.getAttribute('aria-expanded') === 'true') menuBtn.click(); 
            if(tId === '#hero') window.scrollTo({ top: 0, behavior: 'smooth' }); 
            else if (tId === '#about') window.scrollTo({ top: document.getElementById('intro-spacer').offsetHeight * 0.5, behavior: 'smooth' }); 
            else document.querySelector(tId).scrollIntoView({ behavior: 'smooth' }); 
        }); 
    });

    // Scroll To Top Button
    const topBtn = document.getElementById("scrollTopBtn");
    window.addEventListener("scroll", () => { 
        if(window.scrollY > 800) { topBtn.style.opacity = 1; topBtn.style.pointerEvents = "auto"; } 
        else { topBtn.style.opacity = 0; topBtn.style.pointerEvents = "none"; } 
    });
    if(topBtn) topBtn.onclick = () => window.scrollTo({top:0, behavior:"smooth"});
});