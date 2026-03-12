document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const btn = document.getElementById("sendBtn");
    const msgIn = document.getElementById("message");
    const charCnt = document.getElementById("charCount");
    
    // 👉 ही लाईन आता एकदम बुलेटप्रूफ केली आहे! (फॉर्म, बटन, मेसेज बॉक्स सगळं असेल तरच पुढे जा)
    if(!form || !msgIn || !charCnt || !btn) return;

    msgIn.addEventListener("input", () => { charCnt.textContent = msgIn.value.length; });
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); let valid = true;
        ['name', 'email', 'message'].forEach(id => {
            const errEl = document.getElementById(id+"Error");
            if(errEl) errEl.textContent = "";
        });
        
        if(document.getElementById("name").value.trim().length < 2) { document.getElementById("nameError").textContent = "Name too short."; valid = false; }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById("email").value.trim())) { document.getElementById("emailError").textContent = "Invalid email."; valid = false; }
        if(msgIn.value.trim().length < 5) { document.getElementById("messageError").textContent = "Message too short."; valid = false; }
        if(!valid) return;
        
        btn.disabled = true; 
        btn.innerText = "Sending...";

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: "9a99ff8f-d813-48f2-98dc-15e497fd3a1d", 
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    message: msgIn.value,
                })
            });

            if (response.status === 200) {
                btn.innerText = "Sent ✔"; 
                btn.style.backgroundColor = "#22c55e"; 
                btn.style.color = "#ffffff";
                if (typeof gsap !== "undefined") gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });

                const statusText = document.getElementById("formStatus");
                if(statusText) {
                    statusText.textContent = "Thanks! I'll get back to you soon. 🎉";
                    statusText.style.color = "#22c55e"; 
                    if (typeof gsap !== "undefined") gsap.fromTo(statusText, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
                }

                form.reset(); 
                charCnt.textContent = "0"; 
                setTimeout(() => { 
                    btn.innerText = "Send Message"; btn.disabled = false; 
                    btn.style.backgroundColor = ""; btn.style.color = "";
                    if(statusText) { statusText.textContent = ""; statusText.style.color = ""; }
                }, 4000);
            } else { throw new Error("Failed"); }
        } catch (error) {
            btn.innerText = "Error ❌";
            const statusText = document.getElementById("formStatus");
            if(statusText) {
                statusText.textContent = "Failed to send. Please check your Access Key.";
                statusText.style.color = "#ef4444"; 
            }
            btn.disabled = false;
            setTimeout(() => { 
                btn.innerText = "Send Message"; 
                if(statusText) { statusText.textContent = ""; statusText.style.color = ""; }
            }, 3000);
        }
    });
});