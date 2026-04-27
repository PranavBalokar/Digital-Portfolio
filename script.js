/* =========================================================
   Pranav Balokar — Portfolio
   Vanilla JS: theme toggle, nav, scroll reveal, contact form
   ========================================================= */

(() => {
  "use strict";

  /* ---------- Render lucide icons (waits for the CDN script) ---------- */
  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
      return true;
    }
    return false;
  }

  if (!renderIcons()) {
    let tries = 0;
    const poll = setInterval(() => {
      tries++;
      if (renderIcons() || tries > 40) clearInterval(poll);
    }, 100);
  }
  window.addEventListener("load", renderIcons);

  /* ---------- Theme toggle (persisted) ---------- */
  const THEME_KEY = "pranav-portfolio-theme";
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem(THEME_KEY) || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ---------- Sticky nav shadow ---------- */
  const nav = document.getElementById("navbar");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 50);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Smooth-scroll for in-page links + close mobile menu ---------- */
  const mobileMenu = document.getElementById("mobile-menu");
  const menuToggle = document.getElementById("menu-toggle");

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const id = link.getAttribute("href");
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
      if (mobileMenu && mobileMenu.classList.contains("open")) {
        mobileMenu.classList.remove("open");
      }
    });
  });

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => mobileMenu.classList.toggle("open"));
  }

  /* ---------- Active nav link based on visible section ---------- */
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = ["about", "education", "skills", "projects", "contact"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const setActive = () => {
    let current = "";
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) current = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${current}`);
    });
  };
  window.addEventListener("scroll", setActive, { passive: true });

  /* ---------- Scroll reveal + skill bar animation ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const skills = document.querySelectorAll(".skill");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        if (entry.target.classList.contains("skill")) {
          const fill = entry.target.querySelector(".bar-fill");
          const level = entry.target.dataset.level;
          if (fill && level) fill.style.width = level + "%";
        }
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    revealEls.forEach(el => io.observe(el));
    skills.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in-view"));
    skills.forEach(el => {
      const fill = el.querySelector(".bar-fill");
      if (fill) fill.style.width = (el.dataset.level || 0) + "%";
    });
  }

  /* ---------- Contact form (front-end only demo) ---------- */
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");

  if (form && submitBtn) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      setTimeout(() => {
        submitBtn.classList.add("success");
        submitBtn.textContent = "✓ Message Sent";
        form.reset();
        setTimeout(() => {
          submitBtn.classList.remove("success");
          submitBtn.textContent = "Send Message";
          submitBtn.disabled = false;
        }, 3500);
      }, 800);
    });
  }
})();