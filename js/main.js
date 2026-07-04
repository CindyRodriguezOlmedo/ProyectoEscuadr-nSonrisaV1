const CONFIG = {
  whatsappNumber: "595982592266",
  instagramUrl: "https://www.instagram.com/escuadronsonrisaodontologia/",
  facebookUrl: "https://www.facebook.com/profile.php?id=61558138700752",
  mapsUrl: "https://share.google/sRRftZNQ6pIvHcOMs",
  mapsQuery: "Escuadrón Sonrisa Odontología"
};

document.documentElement.classList.add("js-ready");

const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-menu-toggle]");
let backdrop = document.querySelector("[data-nav-backdrop]");

if (!backdrop) {
  backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  backdrop.setAttribute("data-nav-backdrop", "");
  backdrop.setAttribute("aria-hidden", "true");
  document.body.appendChild(backdrop);
}

const setMenuState = (isOpen) => {
  if (!toggle || !nav) return;

  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  nav.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  backdrop.classList.toggle("is-visible", isOpen);
};

const closeMenu = () => setMenuState(false);

const toggleMenu = (event) => {
  if (event) event.stopPropagation();
  if (!toggle || !nav) return;
  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  setMenuState(!isOpen);
};

const updateScrollUi = () => {
  document.body.classList.toggle("has-scrolled", window.scrollY > 80);
};

updateScrollUi();
window.addEventListener("scroll", updateScrollUi, { passive: true });

if (toggle && nav) {
  toggle.addEventListener("click", toggleMenu);

  backdrop.addEventListener("click", closeMenu);

  document.addEventListener("pointerdown", (event) => {
    const clickedInsideMenu = event.target.closest("[data-nav], [data-menu-toggle]");
    if (!clickedInsideMenu && nav.classList.contains("is-open")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 920) {
      closeMenu();
    }
  });

  window.addEventListener("scroll", () => {
    if (nav.classList.contains("is-open")) {
      closeMenu();
    }
  }, { passive: true });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

setMenuState(false);

const setupWhatsappLink = (link) => {
  if (!link) return;
  const message = link.dataset.message || "Hola Escuadrón Sonrisa, quiero agendar una consulta.";
  link.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  link.target = "_blank";
  link.rel = "noopener";
};

document.querySelectorAll("[data-whatsapp]").forEach(setupWhatsappLink);

document.querySelectorAll("[data-instagram]").forEach((link) => {
  link.href = CONFIG.instagramUrl;
  link.target = "_blank";
  link.rel = "noopener";
});

document.querySelectorAll("[data-facebook]").forEach((link) => {
  link.href = CONFIG.facebookUrl;
  link.target = "_blank";
  link.rel = "noopener";
});

document.querySelectorAll("[data-map]").forEach((link) => {
  link.href = CONFIG.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.mapsQuery)}`;
  link.target = "_blank";
  link.rel = "noopener";
});

const monthlyNews = document.querySelector("[data-monthly-news]");

if (monthlyNews) {
  fetch("data/novedades.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("No se pudo leer novedades.json");
      return response.json();
    })
    .then((news) => {
      if (news.visible === false) {
        monthlyNews.closest("section").hidden = true;
        return;
      }

      const eyebrow = monthlyNews.querySelector("[data-news-eyebrow]");
      const title = monthlyNews.querySelector("[data-news-title]");
      const description = monthlyNews.querySelector("[data-news-description]");

      if (eyebrow) eyebrow.textContent = news.eyebrow || "Promo del mes";
      if (title) title.textContent = news.titulo || "";
      if (description) description.textContent = news.descripcion || "";

      const button = monthlyNews.querySelector("[data-news-button]");
      button.textContent = news.boton || "Consultar por WhatsApp";
      button.dataset.message = news.whatsappMensaje || "Hola Escuadrón Sonrisa, quiero consultar las novedades del mes.";
      setupWhatsappLink(button);

      const image = monthlyNews.querySelector("[data-news-image]");
      if (image && news.imagen) {
        image.src = news.imagen;
      }

      const imageLink = monthlyNews.querySelector(".promo-image-link");
      if (imageLink) {
        imageLink.dataset.message = news.whatsappMensaje || "Hola Escuadrón Sonrisa, quiero consultar la promo del mes.";
        setupWhatsappLink(imageLink);
      }
    })
    .catch(() => {
      setupWhatsappLink(monthlyNews.querySelector("[data-news-button]"));
    });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
} else {
  document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
}

const wizard = document.querySelector("[data-wizard]");

if (wizard) {
  const steps = Array.from(wizard.querySelectorAll(".form-step"));
  const progress = wizard.querySelector("[data-progress]");
  const stepText = wizard.querySelector("[data-step-text]");
  const feedback = wizard.querySelector("[data-wizard-feedback]");
  const stepperItems = Array.from(wizard.querySelectorAll(".wizard-stepper li"));
  const prev = wizard.querySelector("[data-prev]");
  const next = wizard.querySelector("[data-next]");
  const send = wizard.querySelector("[data-send]");
  const age = wizard.querySelector("[name='age']");
  const guardianField = wizard.querySelector("[name='guardian']")?.closest(".field");
  const pacifierField = wizard.querySelector("[name='pacifier']")?.closest(".field");
  const behaviorField = wizard.querySelector("[name='behavior']")?.closest(".field");
  let current = 0;

  const scrollWizardIntoView = () => {
    const activeStep = steps[current];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (activeStep || wizard).scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  };

  const clearFeedback = () => {
    if (feedback) feedback.textContent = "";
  };

  const isPregnantPatient = () => age?.value === "Embarazada";

  const setFieldVisibility = (wrapper, shouldHide) => {
    if (!wrapper) return;
    wrapper.hidden = shouldHide;
    wrapper.querySelectorAll("input, select, textarea").forEach((field) => {
      if (!field.dataset.originalRequired) {
        field.dataset.originalRequired = String(field.required);
      }

      if (shouldHide) {
        field.required = false;
        field.disabled = true;
        field.value = "";
        clearFieldInvalid(field);
      } else {
        field.disabled = false;
        field.required = field.dataset.originalRequired === "true";
      }
    });
  };

  const updatePatientTypeFields = () => {
    const pregnant = isPregnantPatient();
    wizard.classList.toggle("is-pregnant", pregnant);
    setFieldVisibility(guardianField, pregnant);
    setFieldVisibility(pacifierField, pregnant);
    setFieldVisibility(behaviorField, pregnant);
  };

  const updateWizard = () => {
    updatePatientTypeFields();
    clearFeedback();
    steps.forEach((step, index) => step.classList.toggle("is-active", index === current));
    stepperItems.forEach((item, index) => {
      item.classList.toggle("is-active", index === current);
      item.classList.toggle("is-done", index < current);
      const marker = item.querySelector("span");
      if (marker) marker.textContent = index < current ? "✓" : String(index + 1);
    });
    progress.style.width = `${((current + 1) / steps.length) * 100}%`;
    if (stepText) stepText.textContent = `Paso ${current + 1} de ${steps.length}`;
    prev.hidden = current === 0;
    next.hidden = current === steps.length - 1;
    send.hidden = current !== steps.length - 1;
  };

  const getCustomValidationMessage = (field) => {
    if (!field.checkValidity()) {
      return field.validationMessage || "Completá este campo para continuar.";
    }
    return "";
  };

  const markFieldInvalid = (field) => {
    const wrapper = field.closest(".field");
    if (wrapper) wrapper.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");
  };

  const clearFieldInvalid = (field) => {
    const wrapper = field.closest(".field");
    if (wrapper) wrapper.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
  };

  const stepIsValid = () => {
    clearFeedback();
    updatePatientTypeFields();
    const fields = Array.from(steps[current].querySelectorAll("input, select, textarea"))
      .filter((field) => !field.disabled && !field.closest("[hidden]"));
    fields.forEach(clearFieldInvalid);

    const firstInvalid = fields.find((field) => {
      const message = getCustomValidationMessage(field);
      if (message) {
        if (feedback) feedback.textContent = message;
        field.dataset.validationMessage = message;
        markFieldInvalid(field);
        return true;
      }
      delete field.dataset.validationMessage;
      clearFieldInvalid(field);
      return false;
    });

    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid.focus({ preventScroll: true });
      return false;
    }
    return true;
  };

  next.addEventListener("click", () => {
    if (!stepIsValid()) return;
    current = Math.min(current + 1, steps.length - 1);
    updateWizard();
    scrollWizardIntoView();
  });

  const watchedFields = Array.from(wizard.querySelectorAll("input, select, textarea"));
  watchedFields.forEach((field) => {
    field.addEventListener("input", () => {
      clearFieldInvalid(field);
      if (feedback) feedback.textContent = "";
      if (field === age) updatePatientTypeFields();
    });
    field.addEventListener("change", () => {
      clearFieldInvalid(field);
      if (feedback) feedback.textContent = "";
      if (field === age) updatePatientTypeFields();
    });
  });

  prev.addEventListener("click", () => {
    current = Math.max(current - 1, 0);
    updateWizard();
    scrollWizardIntoView();
  });

  send.addEventListener("click", () => {
    if (!stepIsValid()) return;
    const data = new FormData(wizard);
    const pregnant = isPregnantPatient();
    const lines = [
      "Hola Escuadrón Sonrisa, quiero enviar el formulario previo:",
      "",
      `Paciente: ${data.get("childName") || "-"}`,
      `Edad: ${data.get("age") || "-"}`,
      ...(!pregnant ? [`Tutor responsable: ${data.get("guardian") || "-"}`] : []),
      `Motivo de consulta: ${data.get("reason") || "-"}`,
      `Primera visita: ${data.get("firstVisit") || "-"}`,
      `Dolor dental: ${data.get("pain") || "-"}`,
      `Antecedentes de caries: ${data.get("cavities") || "-"}`,
      ...(!pregnant ? [`Chupete o mamadera: ${data.get("pacifier") || "-"}`] : []),
      `Alergias: ${data.get("allergies") || "-"}`,
      `Medicamentos: ${data.get("meds") || "-"}`,
      `Condiciones médicas: ${data.get("conditions") || "-"}`,
      ...(!pregnant ? [`Comportamiento en consultas: ${data.get("behavior") || "-"}`] : []),
      `Horario preferido: ${data.get("schedule") || "-"}`,
      `Observaciones: ${data.get("notes") || "-"}`
    ];
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  });

  updatePatientTypeFields();
  updateWizard();
}
