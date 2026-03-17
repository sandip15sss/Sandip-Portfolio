document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide icons on load
    lucide.createIcons();
});

/* ==========================================
   PROJECT MODAL LOGIC (BULLETPROOF & GSAP SAFE)
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    
    const modalBg = modal.querySelector('.modal-bg');
    const closeBtns = modal.querySelectorAll('.close-modal');
    const seeMoreBtns = document.querySelectorAll('.see-more-btn');

    // 🔥 GSAP Safe Scroll Lock Logic 🔥
    function preventScroll(e) {
        e.preventDefault();
    }

    function disableScroll() {
        // माऊस आणि टच स्क्रोल ब्लॉक करणे
        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });
    }

    function enableScroll() {
        // ब्लॉक काढणे
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
    }

    function openModal(title, desc, techs) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-desc').textContent = desc;
        
        const techContainer = document.getElementById('modal-tech');
        techContainer.innerHTML = '';
        techs.split(',').forEach(tech => {
            const span = document.createElement('span');
            span.className = 'px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] uppercase tracking-wider font-medium text-gray-300';
            span.textContent = tech.trim();
            techContainer.appendChild(span);
        });

        modal.classList.add('active');
        disableScroll(); // पॉपअप उघडल्यावर स्क्रोल थांबेल
    }

    function closeModal() {
        modal.classList.remove('active');
        enableScroll(); // पॉपअप बंद केल्यावर स्क्रोल पुन्हा चालू होईल
    }

    seeMoreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(btn.getAttribute('data-title'), btn.getAttribute('data-desc'), btn.getAttribute('data-tech'));
        });
    });

    modalBg.addEventListener('click', closeModal);
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
});