document.addEventListener("DOMContentLoaded", () => {
    const visEl = document.getElementById("visitorCount");
    if(!visEl) return;

    fetch("https://api.counterapi.dev/v1/sandipsawant-portfolio/visits/up")
        .then(response => response.json())
        .then(data => { 
            let o = { val: 0 }; 
            gsap.to(o, {
                val: data.count, 
                duration: 2.5, 
                ease: "power3.out", 
                onUpdate: () => visEl.innerText = Math.floor(o.val).toLocaleString() 
            }); 
        })
        .catch(() => visEl.innerText = "1,420"); 
});