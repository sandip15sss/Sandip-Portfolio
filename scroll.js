document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const island = document.getElementById('island');
    let lastScroll = window.pageYOffset || 0; 
    let isAnimatingLoad = true; 

    // Navbar Scroll Logic
    window.addEventListener('scroll', () => {
        if (isAnimatingLoad) return; 

        const currentScroll = window.pageYOffset;
        const menuBtn = document.getElementById('menu-btn');
        const isExpanded = menuBtn && menuBtn.getAttribute('aria-expanded') === 'true';

        if (isExpanded) return;
        
        if (currentScroll > lastScroll && currentScroll > 50) { 
            island.style.transform = "translate(-50%, -150%)"; 
        } else { 
            island.style.transform = "translate(-50%, 0%)"; 
        }
        lastScroll = currentScroll;
    });

    // Page Load Animation
    window.addEventListener("load", () => {
        gsap.set(island, { opacity: 1, visibility: "visible" }); 

        if (window.scrollY < 50) {
            gsap.fromTo(island, 
                { top: "-100px" }, 
                { 
                    top: "24px", 
                    duration: 1.2, 
                    ease: "power3.out", 
                    delay: 0.2,
                    clearProps: "top", 
                    onComplete: () => { 
                        isAnimatingLoad = false; 
                    }
                }
            );
        } else {
            isAnimatingLoad = false;
            island.style.transform = "translate(-50%, -150%)"; 
        }
        
        // हिरो सेक्शनचा टेक्स्ट स्मूथली वर येण्यासाठी
        gsap.fromTo(".hero-anim", 
            { y: 40, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.5, clearProps: "all" }
        );
    });

    // ==========================================
    // 🚀 NEW: MAGNETIC BUTTONS EFFECT (PREMIUM VIBE)
    // ==========================================
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left) - rect.width / 2;
            const y = (e.clientY - rect.top) - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.4, // माउसकडे हलकं खेचलं जाईल
                y: y * 0.4,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.3)" // माउस काढल्यावर मस्त बाऊन्स होऊन जागेवर येईल
            });
        });
    });
    // ==========================================


    // Project Cards Scroll (तुझं जुनं लॉजिक तसंच ठेवलंय)
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
    const navLinks = document.querySelectorAll('nav a, #mobile-menu a, #footer a');
    navLinks.forEach(link => { 
        link.addEventListener('click', (e) => { 
            e.preventDefault(); 
            const tId = link.getAttribute('href'); 
            const menuBtn = document.getElementById('menu-btn');
            if(menuBtn && menuBtn.getAttribute('aria-expanded') === 'true') menuBtn.click(); 
            
            if(tId === '#hero') {
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
            } else { 
                document.querySelector(tId).scrollIntoView({ behavior: 'smooth' }); 
            } 
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


// ==========================================
   
        
      
    

    // 2. Magnetic Buttons Effect
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left) - rect.width / 2;
            const y = (e.clientY - rect.top) - rect.height / 2;
            
            gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.5, ease: "power2.out" });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
        });
    });