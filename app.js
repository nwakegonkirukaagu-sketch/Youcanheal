import { supabase } from "./supabaseHelper.js";

const form = document.getElementById("magicForm");
const msg = document.getElementById("formMessage");

function setMsg(text, type = "info") {
  if (!msg) return;
  msg.hidden = !text;
  msg.textContent = text || "";
  msg.className = `form-message ${type}`;
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("");

  const email = document.getElementById("email")?.value?.trim();
  const consent = document.getElementById("consent")?.checked;

  if (!consent) return setMsg("Please tick the consent box.", "error");
  if (!email || !email.includes("@")) return setMsg("Enter a valid email address.", "error");

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // ✅ MUST match your Supabase Redirect URLs
        emailRedirectTo: "https://youcanheal.co.uk/dashboard.html",
      },
    });
    if (error) throw error;
    setMsg("Magic link sent! Check your email (and spam).", "success");
  } catch (err) {
    console.error(err);
    setMsg("Could not send the magic link. Please try again.", "error");
  }
});
