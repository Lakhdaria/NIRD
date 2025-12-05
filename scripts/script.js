import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Menu Burger
const burgerBtn = document.getElementById("burgerBtn");
const navMenu = document.getElementById("navMenu");

if (burgerBtn && navMenu) {
  burgerBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    burgerBtn.classList.toggle("is-open");
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      burgerBtn.classList.remove("is-open");
    });
  });
}

// Révéler le contenu bas de page au clic
const revealContentBtn = document.getElementById("revealContentBtn");
if (revealContentBtn) {
  revealContentBtn.addEventListener("click", () => {
    document.body.classList.add("content-visible");
    const content = document.querySelector(".content-sections");
    if (content) {
      content.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

// Reveal on scroll avec stagger
const revealEls = document.querySelectorAll(".reveal");

const handleReveal = () => {
  const threshold = window.innerHeight * 0.85;

  revealEls.forEach((el, index) => {
    const top = el.getBoundingClientRect().top;
    if (top < threshold && !el.classList.contains('visible')) {
      setTimeout(() => {
        el.classList.add("visible");
      }, index * 100);
    }
  });
};

window.addEventListener("scroll", handleReveal);
handleReveal();

// Header state
const headerEl = document.querySelector(".header");
const updateHeaderState = () => {
  if (!headerEl) return;
  headerEl.classList.toggle("is-scrolled", window.scrollY > 50);
};
window.addEventListener("scroll", updateHeaderState);
updateHeaderState();

// Typewriter
const typeTarget = document.getElementById("typewriter");

if (typeTarget) {
  const phrases = [
    "Le village numérique résistant",
    "Un PC qui dure longtemps",
    "Libres, sobres, résilients",
    "Agir dès la Nuit de l'Info"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const current = phrases[phraseIndex % phrases.length];

    if (!deleting) {
      charIndex = Math.min(charIndex + 1, current.length);
      typeTarget.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      charIndex = Math.max(charIndex - 1, 0);
      typeTarget.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex++;
        setTimeout(type, 500);
        return;
      }
    }

    const delay = deleting ? 50 : 100;
    setTimeout(type, delay);
  };

  setTimeout(type, 1000);
}

// Particles
const particlesCanvas = document.getElementById("particlesCanvas");

if (particlesCanvas) {
  const ctx = particlesCanvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];

  const resetParticles = () => {
    const count = Math.min(100, Math.floor((width * height) / 20000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5
    }));
  };

  const resizeParticles = () => {
    width = particlesCanvas.width = window.innerWidth;
    height = particlesCanvas.height = window.innerHeight;
    resetParticles();
  };

  const drawParticles = () => {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, 'rgba(165, 180, 252, 0.8)');
      gradient.addColorStop(1, 'rgba(165, 180, 252, 0)');
      
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.3;
          ctx.strokeStyle = `rgba(94, 234, 212, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  const animateParticles = () => {
    drawParticles();
    requestAnimationFrame(animateParticles);
  };

  window.addEventListener("resize", resizeParticles);
  resizeParticles();
  animateParticles();
}

// Three.js PC 3D
const canvas = document.getElementById("pcCanvas");

if (canvas) {
  const scene = new THREE.Scene();

  const rect = canvas.getBoundingClientRect();
  const camera = new THREE.PerspectiveCamera(
    45,
    rect.width / rect.height,
    0.1,
    100
  );

  camera.position.set(1.6, 1.4, 1.6);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(rect.width, rect.height);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // Éclairage amélioré : ambiant + key/fill/rim pour mieux lire le modèle
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1b1f3a, 0.9);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
  keyLight.position.set(3, 5, 2);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0x6ee7ff, 0.65, 10);
  fillLight.position.set(-3, 2, -2);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffa94d, 0.6);
  rimLight.position.set(-2, 3, 3);
  scene.add(rimLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.8;
  controls.enablePan = false;
  controls.minDistance = 1.0;
  controls.maxDistance = 4.0;

  const loader = new GLTFLoader();
  loader.load(
    "assets/models/retro_computer.glb",
    (gltf) => {
      const retroPC = gltf.scene;
      retroPC.scale.set(2.0, 2.0, 2.0);
      // Orient the model to face the camera at start
      retroPC.rotation.y = -20;
      scene.add(retroPC);

      const box = new THREE.Box3().setFromObject(retroPC);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      // Recentre le modèle pour qu'il soit au cœur de la scène et le remonte de façon proportionnelle à sa taille
      const lift = size.y * 0.2;
      retroPC.position.set(-center.x, -center.y + lift, -center.z);

      const target = new THREE.Vector3(0, 0, 0);
      controls.target.copy(target);
      camera.position.set(1.6, 1.4, 1.6);
      camera.lookAt(target);
    },
    undefined,
    (err) => console.error("Erreur chargement modèle :", err)
  );

  const handleResize3D = () => {
    const r = canvas.getBoundingClientRect();
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
    renderer.setSize(r.width, r.height);
  };
  window.addEventListener("resize", handleResize3D);

  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
}

// Hero gallery (fade one by one)
const galleryTrack = document.querySelector(".hero__gallery-track");
if (galleryTrack) {
  const slides = Array.from(galleryTrack.querySelectorAll("img"));
  let idx = 0;
  const showSlide = (i) => {
    slides.forEach((img, j) => img.classList.toggle("is-active", i === j));
  };
  if (slides.length > 0) {
    showSlide(idx);
    setInterval(() => {
      idx = (idx + 1) % slides.length;
      showSlide(idx);
    }, 2200);
  }
}


