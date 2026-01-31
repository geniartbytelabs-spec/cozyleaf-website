/* =========================
   CozyLeaf — script.js (Fixed)
   - Prevent JS from crashing when optional elements are missing
   - Mobile menu works even if forms are not present
   - Keeps your waitlist validation behavior
========================= */

/* =========================
   0) Grab elements
========================= */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const waitlistForm = document.getElementById("waitlistForm");
const messageForm = document.getElementById("messageForm");

/* =========================
   0.1) Small utilities
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
   0.2) attachEmailValidation (FIX)
   - Safely attaches validation to a given form (if it exists)
   - You can use it for messageForm, waitlistForm, etc.
========================= */
function attachEmailValidation(form, selector = 'input[type="email"], input[name="EMAIL"]') {
  if (!form) return;

  const emailInput = form.querySelector(selector);
  if (!emailInput) return;

  form.addEventListener("submit", (e) => {
    const email = (emailInput.value || "").trim();

    // Empty email: let required attribute handle it if present,
    // otherwise show a friendly message.
    if (!email) {
      // if the input is required, the browser will handle it
      if (!emailInput.required) {
        e.preventDefault();
        setFormStatus(form, "Please enter your email address.", "error");
        emailInput.focus();
      }
      return;
    }

    if (!isValidEmail(email)) {
      e.preventDefault();
      setFormStatus(form, "Please enter a valid email address.", "error");
      emailInput.focus();
      return;
    }

    // Clear message when valid
    setFormStatus(form, "", "info");
  });
}

/* ✅ This line caused your crash before. Now it's safe. */
attachEmailValidation(messageForm);

/* =========================
   1) Mobile menu open/close
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

/* (Optional) close when clicking outside header */
document.addEventListener("click", (e) => {
  const clickedInsideHeader = e.target.closest(".header");
  if (!clickedInsideHeader) setMenu(false);
});

/* =========================
   2) Waitlist (Mailchimp) submit
   - Validate only
   - Let the browser submit normally to Mailchimp
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

    // reset error message
    setFormStatus(waitlistForm, "", "info");

    setSubmitting(waitlistForm, true);
    setFormStatus(waitlistForm, "Submitting…", "info");

    setTimeout(() => {
      setSubmitting(waitlistForm, false);
      // setFormStatus(waitlistForm, "", "info"); // optional
    }, 5000);
  });
}
