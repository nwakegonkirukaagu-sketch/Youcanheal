import { supabase } from "./supabaseHelper.js";

async function initDashboard() {
  /* 🔑 REQUIRED for magic link */
  const { data, error } = await supabase.auth.exchangeCodeForSession(
    window.location.href
  );

  if (error) {
    console.error("Session exchange failed:", error);
    window.location.replace("/index.html");
    return;
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData?.session;

  if (!session) {
    window.location.replace("/index.html");
    return;
  }

  // Display user email
  const user = session.user;
  const usernameEl = document.getElementById("username");
  if (usernameEl) usernameEl.textContent = user.email;
}

// Sign out
document.getElementById("signOut")?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.replace("/index.html");
});

initDashboard();
