document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const btn = document.getElementById("sendBtn");
    const msgIn = document.getElementById("message");
    const charCnt = document.getElementById("charCount");
    
    if(!form) return;

    msgIn.addEventListener("input", () => { charCnt.textContent = msgIn.value.length; });
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); let valid = true;
        ['name', 'email', 'message'].forEach(id => document.getElementById(id+"Error").textContent = "");
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
                    access_key: "YOUR_WEB3FORMS_ACCESS_KEY", // 👈👈 PUT YOUR KEY HERE
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    message: document.getElementById("message").value,
                })
            });

            if (response.status === 200) {
                btn.innerText = "Sent ✔"; 
                btn.style.backgroundColor = "#22c55e"; 
                btn.style.color = "#ffffff";
                gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });

                const statusText = document.getElementById("formStatus");
                statusText.textContent = "Thanks! I'll get back to you soon. 🎉";
                statusText.style.color = "#22c55e"; 
                gsap.fromTo(statusText, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });

                form.reset(); 
                charCnt.textContent = "0"; 
                setTimeout(() => { 
                    btn.innerText = "Send Message"; btn.disabled = false; 
                    btn.style.backgroundColor = ""; btn.style.color = "";
                    statusText.textContent = ""; statusText.style.color = "";
                }, 4000);
            } else { throw new Error("Failed"); }
        } catch (error) {
            btn.innerText = "Error ❌";
            document.getElementById("formStatus").textContent = "Failed to send. Please check your Access Key.";
            document.getElementById("formStatus").style.color = "#ef4444"; 
            btn.disabled = false;
            setTimeout(() => { 
                btn.innerText = "Send Message"; 
                document.getElementById("formStatus").textContent = ""; 
                document.getElementById("formStatus").style.color = ""; 
            }, 3000);
        }
    });
});