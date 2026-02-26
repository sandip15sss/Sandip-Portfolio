document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide icons on load
    lucide.createIcons();
    
    // Global State for Earth to share between files
    window.earthConfig = {
        autoRotate: window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768 ? false : true,
        isRendering: true
    };
});


