import { supabase } from "./supabaseHelper.js";

const form = document.getElementById("magicForm");
const msg = document.getElementById("formMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.hidden = true;

  const email = document.getElementById("email").value.trim();
  const consent = document.getElementById("consent").checked;

  if (!consent) {
    msg.textContent = "Please accept consent.";
    msg.className = "form-message error";
    msg.hidden = false;
    return;
  }

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://youcanheal.co.uk/dashboard.html"
      }
    });

    if (error) throw error;

    msg.textContent = "Magic link sent! Check your email.";
    msg.className = "form-message success";
    msg.hidden = false;
  } catch (err) {
    msg.textContent = err.message || "Unable to send email.";
    msg.className = "form-message error";
    msg.hidden = false;
  }
});
