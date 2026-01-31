/* =========================
   CozyLeaf — script.js (FINAL)
   - No ReferenceError
   - Mobile hamburger menu works
   - Forms are optional (safe if missing)
========================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     0) Grab elements
  ========================= */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const waitlistForm = document.getElementById("waitlistForm");
  const messageForm = document.getElementById("messageForm");

  /* =========================
     1) Utilities
  ========================= */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  }

  function setFormStatus(form, msg, type = "info") {
    if (!form) return;
    let el = form.querySelector(".form-status");
    if (!el) {
      el = document.createElement("p");
      el.className = "form-status";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      form.appendChild(el);
    }
    el.textContent = msg;
    el.dataset.type = type;
  }

  function setSubmitting(form, isSubmitting) {
    if (!form) return;
    const btn = form.querySelector(
      'button[type="submit"], input[type="submit"]'
    );
    if (btn) btn.disabled = isSubmitting;
  }

  /* =========================
     2) Email validation helper
     (SAFE even if form doesn't exist)
  ========================= */
  function attachEmailValidation(form) {
    if (!form) return;

    const emailInput =
      form.querySelector('input[type="email"]') ||
      form.querySelector('input[name="EMAIL"]');

    if (!emailInput) return;

    form.addEventListener("submit", (e) => {
      const email = (emailInput.value || "").trim();
      if (!email) return;

      if (!isValidEmail(email)) {
        e.preventDefault();
        setFormStatus(form, "Please enter a valid email address.", "error");
        emailInput.focus();
      } else {
        setFormStatus(form, "", "info");
      }
    });
  }

  // Attach safely (no crash even if missing)
  attachEmailValidation(messageForm);

  /* =========================
     3) Mobile menu (Hamburger)
  ========================= */
  function setMenu(open) {
    if (!hamburger || !mobileMenu) return;
    mobileMenu.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.getAttribute("aria-expanded") === "true";
      setMenu(!isOpen);
    });
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  document.addEventListener("click", (e) => {
    const clickedInsideHeader = e.target.closest(".header");
    if (!clickedInsideHeader) setMenu(false);
  });

  /* =========================
     4) Waitlist (Mailchimp)
  ========================= */
  if (waitlistForm) {
    waitlistForm.addEventListener("submit", (e) => {
      const honeypot = waitlistForm.querySelector('input[name^="b_"]');
      if (honeypot && honeypot.value) {
        e.preventDefault();
        return;
      }

      const emailInput = waitlistForm.querySelector('input[name="EMAIL"]');
      const email = emailInput ? emailInput.value.trim() : "";

      if (!isValidEmail(email)) {
        e.preventDefault();
        setFormStatus(
          waitlistForm,
          "Please enter a valid email address.",
          "error"
        );
        if (emailInput) emailInput.focus();
        return;
      }

      setFormStatus(waitlistForm, "Submitting…", "info");
      setSubmitting(waitlistForm, true);

      setTimeout(() => {
        setSubmitting(waitlistForm, false);
      }, 5000);
    });
  }
});
