/* =========================
   0) Grab elements
========================= */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const waitlistForm = document.getElementById("waitlistForm");
const messageForm = document.getElementById("messageForm");
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

/* (선택) 바깥 클릭하면 닫기 */
document.addEventListener("click", (e) => {
  const clickedInsideHeader = e.target.closest(".header");
  if (!clickedInsideHeader) setMenu(false);
});

/* =========================
   2) Waitlist (Mailchimp) submit
   - Validate only
   - Let the browser submit normally to Mailchimp
========================= */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function setFormStatus(form, msg, type = "info") {
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
  const btn = form.querySelector('button[type="submit"], input[type="submit"]');
  if (btn) btn.disabled = isSubmitting;
}

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

    // (에러 메시지 초기화)
    setFormStatus(waitlistForm, "", "info");

    setSubmitting(waitlistForm, true);
    setFormStatus(waitlistForm, "Submitting…", "info");

    setTimeout(() => {
      setSubmitting(waitlistForm, false);
      // setFormStatus(waitlistForm, "", "info"); // 필요하면 켜기
    }, 5000);
  });
}

