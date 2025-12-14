// ===== helpers =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ===== year =====
$("#year").textContent = new Date().getFullYear();

// ===== mobile nav =====
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");

function setNav(open) {
  navLinks.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
}

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.contains("open");
  setNav(!isOpen);
});

$$('#navLinks a').forEach(a => {
  a.addEventListener("click", () => setNav(false));
});

document.addEventListener("click", (e) => {
  if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) setNav(false);
});

// ===== active section highlight =====
const sectionIds = ["about", "skills", "projects", "education", "contact"];
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
const navAnchors = $$("#navLinks a");

const observer = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(en => en.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;

  const id = visible.target.id;
  navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
}, { root: null, threshold: [0.25, 0.45, 0.6] });

sections.forEach(sec => observer.observe(sec));

// ===== theme toggle (saved) =====
const themeToggle = $("#themeToggle");
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("theme");
const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

document.documentElement.dataset.theme = initialTheme;
updateThemeIcon(initialTheme);

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector(".themeIcon");
  icon.textContent = theme === "dark" ? "☀" : "☾";
}

// ===== contact form -> mailto =====
const form = $("#contactForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.elements["name"].value.trim();
  const email = form.elements["email"].value.trim();
  const message = form.elements["message"].value.trim();

  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
  );

  window.location.href = `mailto:omarfaruk.swe@gmail.com?subject=${subject}&body=${body}`;
});
