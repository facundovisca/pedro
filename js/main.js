/* ===============================
   1. WHATSAPP FLOAT — aparición con scroll
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const whatsapp = document.querySelector(".whatsapp-float");
  if (!whatsapp) return;

  let whatsappShown = false;

  window.addEventListener("scroll", () => {
    if (!whatsappShown && window.scrollY > 180) {
      whatsapp.classList.add("whatsapp-visible");
      whatsappShown = true;
    }
  });
});

/* ===============================
   2. SMOOTH SCROLL — navegación interna
   (ignora href="#" y links inválidos)
================================ */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");

    // Ignorar anchors vacíos o #
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

/* ===============================
   3. CERRAR NAVBAR MOBILE AL CLICK
   (UX clave en landing)
================================ */

const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const navbarCollapse = document.querySelector(".navbar-collapse");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (navbarCollapse.classList.contains("show")) {
      new bootstrap.Collapse(navbarCollapse).hide();
    }
  });
});

const toggle = document.querySelector(".ps-toggle");
const menu = document.querySelector(".ps-menu");

toggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});

document.querySelectorAll(".ps-link").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("active");
  });
});
