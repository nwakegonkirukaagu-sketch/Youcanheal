// index.js
import { supabase } from "./supabaseHelper.js";

/* -------- MAGIC LINK LOGIN -------- */
const form = document.getElementById("magicForm");
const emailInput = document.getElementById("email");
const consent = document.getElementById("consent");
const message = document.getElementById("formMessage");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!consent.checked) {
    show("Please tick the consent box.", "error");
    return;
  }

  const email = emailInput.value.trim();
  if (!email) {
    show("Please enter a valid email.", "error");
    return;
  }

  show("Sending magic link…");

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "https://youcanheal.co.uk/dashboard.html"
    }
  });

  if (error) {
    show(error.message, "error");
  } else {
    show("Magic link sent. Check your inbox.", "success");
  }
});

function show(text, type = "info") {
  message.hidden = false;
  message.textContent = text;
  message.className = `form-message ${type}`;
}

/* -------- THEME TOGGLE -------- */
const toggle = document.getElementById("themeToggle");
toggle?.addEventListener("click", () => {
  const next = document.body.dataset.theme === "dark" ? "light" : "dark";
  document.body.dataset.theme = next;
  toggle.textContent = next === "dark" ? "☀️ Light" : "🌙 Dark";
});

/* -------- MODALS -------- */
wire("supportBtn", "supportModal");
wire("contactBtn", "contactModal");
wire("supportClose", "supportModal", true);
wire("contactClose", "contactModal", true);

function wire(btnId, modalId, close = false) {
  const btn = document.getElementById(btnId);
  const modal = document.getElementById(modalId);
  if (!btn || !modal) return;
  btn.addEventListener("click", () => {
    modal.classList.toggle("open", !close);
  });
}
