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
        
        gsap.fromTo(".hero-anim", 
            { y: 40, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.5, clearProps: "all" }
        );
    });

    // ==========================================
    // 🚀 SMART IMAGE PRELOADER (OPTIMIZED)
    // ==========================================
    const canvas = document.getElementById("hero-canvas");
    const context = canvas.getContext("2d");

    canvas.width = 1920; 
    canvas.height = 1080;

    const frameCount = 182; 
    const currentFrame = index => {
        let num = (index + 1).toString().padStart(3, '0'); 
        return `./Assets/heroimg/ezgif-frame-${num}.jpg`;
    };

    const images = [];
    const heroVideoSeq = { frame: 0 };

    // १. सर्वात आधी फक्त पहिली (Index 0) इमेज लोड करा
    const firstImage = new Image();
    firstImage.src = currentFrame(0);
    images[0] = firstImage;

    firstImage.onload = () => {
        // पहिली इमेज लोड झाली की ती कॅनव्हासवर दाखवा (पेज लगेच दिसेल)
        render(); 
        
        // २. आणि मग उरलेल्या १८१ इमेजेस 'Background' मध्ये लोड करायला घ्या
        loadRestOfImages();
    };

    function loadRestOfImages() {
        for (let i = 1; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images[i] = img;
        }
    }

    function render() {
        const img = images[heroVideoSeq.frame];
        // ३. जर इमेज पूर्ण डाउनलोड (complete) झाली असेल तरच ती कॅनव्हासवर काढा (याने एरर येणार नाही)
        if (img && img.complete) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
    }

    // --- Cinematic Breathing Effect ---
    gsap.to(canvas, {
        scale: 1.15, 
        duration: 15, 
        repeat: -1, 
        yoyo: true, 
        ease: "sine.inOut" 
    });

    // Video Scroll Animation
    gsap.to(heroVideoSeq, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: "#hero", 
            start: "top top",
            end: "+=1700", 
            scrub: 1, 
        },
        onUpdate: render 
    });
    // ==========================================


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