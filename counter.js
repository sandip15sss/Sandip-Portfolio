// ==========================================
// FIREBASE LIVE HEART COUNT 💖 (DEBUG MODE)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("🔥 1. Counter.js loaded successfully!");

    const firebaseConfig = {
        apiKey: "AIzaSyDWXgaakgefiItFlifPcOzfVoczlq4eWzc",
        authDomain: "sandip-portfolio-9c2ae.firebaseapp.com",
        projectId: "sandip-portfolio-9c2ae",
        storageBucket: "sandip-portfolio-9c2ae.firebasestorage.app",
        messagingSenderId: "95490035670",
        appId: "1:95490035670:web:78859db7d270d255aa5e77",
        // तुझा सिंगापूर डेटाबेस URL
        databaseURL: "https://sandip-portfolio-9c2ae-default-rtdb.asia-southeast1.firebasedatabase.app"
    };

    // Firebase चालू करणे
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("✅ 2. Firebase Initialized!");
    }
    const database = firebase.database();
    const heartRef = database.ref('portfolio/heartCount');

    // HTML IDs
    const giveHeartBtn = document.getElementById('giveHeartBtn');
    const smallHeart = document.getElementById('smallHeart');
    const likeCountEl = document.getElementById('likeCount');

    if (!giveHeartBtn || !likeCountEl) {
        console.error("❌ 3. ERROR: Button IDs not found in HTML!");
        return; // जर बटन नाही मिळालं तर कोड इथेच थांबेल
    }

    console.log("✅ 3. Button and Counter Found in HTML!");

    let isLiked = localStorage.getItem('portfolioLiked') === 'true';

    // पेज लोड झाल्यावर डेटा वाचणे
    heartRef.on('value', (snapshot) => {
        const currentCount = snapshot.val() || 0;
        likeCountEl.innerText = currentCount;
        console.log("📡 4. Live Data received from Firebase: ", currentCount);
    });

    if (isLiked && smallHeart) {
        giveHeartBtn.classList.add('is-liked');
        smallHeart.classList.remove('fa-regular');
        smallHeart.classList.add('fa-solid');
    }

    // बटनावर क्लिक केल्यावर...
    giveHeartBtn.addEventListener('click', (e) => {
        e.preventDefault(); // काही डिफॉल्ट ॲक्शन असेल तर ती थांबवण्यासाठी
        console.log("🎯 5. BUTTON WAS CLICKED!");

        heartRef.once('value', (snapshot) => {
            let currentCount = snapshot.val() || 0;

            if (!isLiked) {
                isLiked = true;
                localStorage.setItem('portfolioLiked', 'true');
                giveHeartBtn.classList.add('is-liked');
                if(smallHeart) {
                    smallHeart.classList.remove('fa-regular');
                    smallHeart.classList.add('fa-solid');
                }
                heartRef.set(currentCount + 1);
                console.log("💖 Added Like! New Count: ", currentCount + 1);
            } else {
                isLiked = false;
                localStorage.setItem('portfolioLiked', 'false');
                giveHeartBtn.classList.remove('is-liked');
                if(smallHeart) {
                    smallHeart.classList.remove('fa-solid');
                    smallHeart.classList.add('fa-regular');
                }
                heartRef.set(currentCount > 0 ? currentCount - 1 : 0);
                console.log("💔 Removed Like! New Count: ", currentCount > 0 ? currentCount - 1 : 0);
            }
        });

        if (typeof gsap !== "undefined") {
            gsap.fromTo(giveHeartBtn, { scale: 1.3 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
        }
    });
});