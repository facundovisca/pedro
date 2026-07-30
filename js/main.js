/**
 * Interacciones de navegación, contacto y carga diferida.
 */
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("ps-nav");
  const toggle = document.querySelector(".ps-toggle");
  const menu = document.querySelector(".ps-menu");
  const whatsapp = document.querySelector(".whatsapp-float");
  const navLinks = document.querySelectorAll(".ps-link");
  const sections = [...document.querySelectorAll("main section[id]")];

  const setMenuState = (isOpen) => {
    if (!menu || !toggle) return;
    menu.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  };

  toggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenuState(!menu.classList.contains("active"));
  });

  navLinks.forEach((link) => link.addEventListener("click", () => setMenuState(false)));

  document.addEventListener("click", (event) => {
    if (menu && toggle && !menu.contains(event.target) && !toggle.contains(event.target)) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const updateOnScroll = () => {
    const scrollY = window.scrollY;
    if (nav) {
      nav.classList.toggle("is-scrolled", scrollY > 20);
    }
    if (whatsapp && scrollY > 300) {
      whatsapp.classList.add("whatsapp-visible");
    }

    if (sections.length) {
      const currentSection = sections.find((section) => {
        const top = section.offsetTop - 120;
        return scrollY >= top && scrollY < top + section.offsetHeight;
      });

      if (currentSection) {
        const targetLink = document.querySelector(
          `.ps-link[href="#${currentSection.id}"]`,
        );
        if (targetLink) {
          navLinks.forEach((link) => link.classList.remove("active-link"));
          targetLink.classList.add("active-link");
        }
      }
    }

    const isAtPageEnd =
      window.innerHeight + scrollY >= document.documentElement.scrollHeight - 40;
    if (isAtPageEnd) {
      const podcastLink = document.querySelector('.ps-link[href="#podcast-clean"]');
      if (podcastLink) {
        navLinks.forEach((link) => link.classList.remove("active-link"));
        podcastLink.classList.add("active-link");
      }
    }
  };

  updateOnScroll();
  window.addEventListener("scroll", updateOnScroll, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px" },
    );

    document
      .querySelectorAll(".service-card, .course-card, .miembro, .editorial-bridge__content, #perfil .row, .img-book-large")
      .forEach((element) => {
        element.classList.add("reveal-hidden");
        observer.observe(element);
      });

    const spotifyContainer = document.querySelector(".podcast-clean__player");
    if (spotifyContainer) {
      const spotifyObserver = new IntersectionObserver((entries, currentObserver) => {
        if (!entries[0].isIntersecting) return;
        const iframe = spotifyContainer.querySelector("iframe[data-src]");
        if (iframe) iframe.src = iframe.dataset.src;
        currentObserver.unobserve(spotifyContainer);
      });
      spotifyObserver.observe(spotifyContainer);
    }
  }

  const phone = "5491122504718";
  document.querySelectorAll(".js-whatsapp").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const message =
        button.dataset.message ||
        "Hola Pedro, te contacto desde la página web. Me gustaría recibir información sobre los servicios.";
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    });
  });
});
