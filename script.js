/* =========================
   CozyLeaf — script.js (FINAL)
   - Mobile hamburger menu works
   - Waitlist (Mailchimp): validate + submit normally
   - Message (Formspree): submit via fetch (no redirect)
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
    const btn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (btn) btn.disabled = isSubmitting;
  }

  /* =========================
     2) Mobile menu (Hamburger)
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
     3) Waitlist (Mailchimp)
     - Validate only
     - Let browser submit normally to Mailchimp
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
        setFormStatus(waitlistForm, "Please enter a valid email address.", "error");
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

  /* =========================
     4) Message (Formspree)
     - Submit via fetch (no redirect)
  ========================= */
  if (messageForm) {
    messageForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // basic email validation if there's an email input
      const emailInput = messageForm.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value.trim() : "";
      if (emailInput && !isValidEmail(email)) {
        setFormStatus(messageForm, "Please enter a valid email address.", "error");
        emailInput.focus();
        return;
      }

      setSubmitting(messageForm, true);
      setFormStatus(messageForm, "Sending…", "info");

      try {
        const res = await fetch(messageForm.action, {
          method: "POST",
          body: new FormData(messageForm),
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          setFormStatus(messageForm, "Thanks! We’ll get back to you shortly.", "success");
          messageForm.reset();
        } else {
          setFormStatus(messageForm, "Something went wrong. Please try again.", "error");
        }
      } catch {
        setFormStatus(messageForm, "Network error. Please try again.", "error");
      } finally {
        setSubmitting(messageForm, false);
      }
    });
  }
});
