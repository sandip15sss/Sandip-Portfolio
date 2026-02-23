document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("canvas-container");
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.015);
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); 
    camera.position.set(0, 0, 22);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); 
    renderer.setSize(window.innerWidth, window.innerHeight); 
    container.appendChild(renderer.domElement);
    
    const earthGroup = new THREE.Group(); 
    earthGroup.position.set(6, 0, 0); 
    scene.add(earthGroup);
    
    const textureLoader = new THREE.TextureLoader();
    
    const earthTex = textureLoader.load("./Assets/textures/earth_atmos_2048.jpg"); 
    const cloudTex = textureLoader.load("./Assets/textures/earth_clouds_1024.png");

    // ✅ THE MAGIC FIX FOR MODERN THREE.JS (r160)
    // He modern version la sangta ki image che colors original thev, dark karu nako!
    earthTex.colorSpace = THREE.SRGBColorSpace;
    
    const earth = new THREE.Mesh(
        new THREE.SphereGeometry(5, 32, 32), 
        new THREE.MeshPhongMaterial({ map: earthTex, shininess: 5 })
    ); 
    earth.rotation.y = -Math.PI / 2; 
    earthGroup.add(earth);
    
    const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(5.05, 32, 32), 
        new THREE.MeshPhongMaterial({ 
            map: cloudTex, 
            transparent: true, 
            opacity: 0.4, 
            blending: THREE.AdditiveBlending, 
            side: THREE.DoubleSide 
        })
    ); 
    earthGroup.add(clouds);
    
    // ✅ Tujhi junya code madhli original lighting tasich thevli ahe
    const sun = new THREE.DirectionalLight(0xffffff, 2); 
    sun.position.set(-5, 3, 5); 
    scene.add(sun); 
    scene.add(new THREE.HemisphereLight(0xffffff, 0x080820, 0.5));

    // Expose groups for GSAP
    window.earthGroupObj = earthGroup;
    window.earthCameraObj = camera;
    
    function animate() { 
        requestAnimationFrame(animate); 
        if (!window.earthConfig || !window.earthConfig.isRendering) return; 
        
        if(window.earthConfig.autoRotate) earthGroup.rotation.y += 0.0005; 
        clouds.rotation.y += 0.0003; 
        renderer.render(scene, camera); 
    } 
    animate();
    
    window.addEventListener('resize', () => { 
        const island = document.getElementById('island');
        if(island && island.style.height === '55px') island.style.width = window.innerWidth < 768 ? '280px' : '500px'; 
        camera.aspect = window.innerWidth / window.innerHeight; 
        camera.updateProjectionMatrix(); 
        renderer.setSize(window.innerWidth, window.innerHeight); 
    });
});