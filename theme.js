document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const themeBtn = document.getElementById('theme-btn');
    
    // Load theme from LocalStorage
    if(localStorage.getItem('theme') === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
    } else {
        root.classList.add('dark'); 
    }

    themeBtn.addEventListener('click', () => { 
        root.classList.toggle('dark'); 
        root.classList.toggle('light'); 
        localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
    });

    // Mobile Menu Logic
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconMenu = document.getElementById('icon-menu');
    const iconClose = document.getElementById('icon-close');
    const island = document.getElementById('island');
    let isExpanded = false;

    if(menuBtn) {
        menuBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            menuBtn.setAttribute('aria-expanded', isExpanded);
            
            if (isExpanded) {
                island.style.width = window.innerWidth < 768 ? '280px' : '360px'; 
                island.style.height = '380px'; 
                island.style.borderRadius = '30px';
                mobileMenu.style.height = 'auto'; mobileMenu.style.opacity = '1'; mobileMenu.style.pointerEvents = 'auto';
                iconMenu.style.opacity = '0'; iconClose.style.opacity = '1';
            } else {
                island.style.width = window.innerWidth < 768 ? '280px' : '500px'; 
                island.style.height = '55px'; 
                island.style.borderRadius = '9999px';
                mobileMenu.style.opacity = '0'; mobileMenu.style.pointerEvents = 'none'; mobileMenu.style.height = '0';
                iconMenu.style.opacity = '1'; iconClose.style.opacity = '0';
            }
        });
    }
});