/**
 * PEDRO SCHARGORODSKY - JS PROFESIONAL UNIFICADO
 * Incluye: Navbar dinámico, Scroll Spy, Animaciones Reveal,
 * WhatsApp Float y Lazy Loading de Spotify.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- SELECTORES ---
  const nav = document.getElementById("ps-nav");
  const toggle = document.querySelector(".ps-toggle");
  const menu = document.querySelector(".ps-menu");
  const whatsapp = document.querySelector(".whatsapp-float");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".ps-link");

  // --- 1. GESTIÓN DE NAVBAR & WHATSAPP ---
  let whatsappShown = false;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.body.offsetHeight;

    // Sombra en navbar
    if (scrollY > 20) {
      nav.style.boxShadow = "0 2px 15px rgba(0,0,0,0.1)";
      nav.style.background = "rgba(0, 45, 94, 0.98)";
    } else {
      nav.style.boxShadow = "none";
      nav.style.background = "var(--velez-blue)";
    }

    // WhatsApp
    if (!whatsappShown && scrollY > 300) {
      whatsapp?.classList.add("whatsapp-visible");
      whatsappShown = true;
    }

    // --- SCROLL SPY (Tu versión que funciona + fix para el final) ---
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // Ajustamos un pelín el offset
      const sectionId = current.getAttribute("id");
      const targetLink = document.querySelector(
        `.ps-link[href*="${sectionId}"]`,
      );

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        targetLink?.classList.add("active-link");
      } else {
        targetLink?.classList.remove("active-link");
      }
    });

    // FIX PARA PODCAST: Si el usuario llegó al final del scroll, forzamos el Podcast
    if (scrollY + windowHeight >= docHeight - 50) {
      // 1. Buscamos qué link es el de podcast
      const podcastLink = document.querySelector(
        '.ps-link[href*="podcast-clean"]',
      );
      if (podcastLink) {
        // 2. Quitamos el active a todos los demás (para que no queden dos marcados)
        navLinks.forEach((link) => link.classList.remove("active-link"));
        // 3. Marcamos el podcast
        podcastLink.classList.add("active-link");
      }
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // --- 2. MENÚ MOBILE ---
  const toggleMenu = (state) => {
    const isActive =
      state !== undefined ? state : !menu.classList.contains("active");
    menu.classList.toggle("active", isActive);
    toggle.setAttribute("aria-expanded", isActive);
  };

  toggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Cerrar menú al clickear link o scrollear
  navLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target))
      toggleMenu(false);
  });

  // --- 3. SMOOTH SCROLL ---
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // --- 4. REVEAL ANIMATIONS (Intersection Observer) ---
  // Hace que los elementos aparezcan suavemente al entrar en pantalla
  const revealOption = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealOption);

  // Seleccionamos qué elementos queremos animar
  const elementsToAnimate = document.querySelectorAll(
    ".service-card, .course-card, .miembro, .editorial-bridge__content, #perfil .row, .img-book-large",
  );

  elementsToAnimate.forEach((el) => {
    el.classList.add("reveal-hidden"); // Clase inicial
    revealObserver.observe(el);
  });

  // --- 5. OPTIMIZACIÓN DE SPOTIFY (Lazy Load) ---
  const spotifyContainer = document.querySelector(".podcast-clean__player");
  if (spotifyContainer) {
    const spotifyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const iframe = entry.target.querySelector("iframe");
          // Si moviste el src a data-src en el HTML para optimizar:
          if (iframe && iframe.getAttribute("data-src")) {
            iframe.src = iframe.getAttribute("data-src");
          }
          spotifyObserver.unobserve(entry.target);
        }
      });
    });
    spotifyObserver.observe(spotifyContainer);
  }
});

// --- 8. FEEDBACK DE BOTÓN (Efecto Click) ---
// Añade un efecto de "onda" o feedback visual al tocar botones principales
const buttons = document.querySelectorAll(".btn-velez-primary");
buttons.forEach((btn) => {
  btn.addEventListener("mousedown", () => {
    btn.style.transform = "scale(0.95)";
  });
  btn.addEventListener("mouseup", () => {
    btn.style.transform = "scale(1.05)";
  });
});

// --- 9. PREFETCHING DE PÁGINAS ---
const internalLinks = document.querySelectorAll('a[href$=".html"]');
internalLinks.forEach((link) => {
  link.addEventListener(
    "mouseenter",
    () => {
      const href = link.getAttribute("href");
      const prefetchLink = document.createElement("link");
      prefetchLink.rel = "prefetch";
      prefetchLink.href = href;
      document.head.appendChild(prefetchLink);
    },
    { once: true },
  );
});

function openWhatsApp(message) {
  const phone = "5491122504718";
  const text = encodeURIComponent(message);

  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
    navigator.userAgent,
  );

  const url = isMobile
    ? `https://wa.me/${phone}?text=${text}`
    : `https://web.whatsapp.com/send?phone=${phone}&text=${text}`;

  window.open(url, "_blank", "noopener");
}

document.querySelectorAll(".js-whatsapp").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const message =
      btn.dataset.message ||
      "Hola Pedro, te contacto desde la página web. Estoy interesado en entrenar mi mente para mejorar mi rendimiento deportivo. ¿Me podrías dar información sobre tus servicios?";

    openWhatsApp(message);
  });
});

trackWhatsAppClick(label);
setTimeout(() => openWhatsApp(message), 150);