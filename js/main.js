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

const updateScrollUi = () => {
  document.body.classList.toggle("has-scrolled", window.scrollY > 80);
};

updateScrollUi();
window.addEventListener("scroll", updateScrollUi, { passive: true });

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    });
  });
}

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  const message = link.dataset.message || "Hola Escuadrón Sonrisa, quiero agendar una consulta.";
  link.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  link.target = "_blank";
  link.rel = "noopener";
});

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
  const prev = wizard.querySelector("[data-prev]");
  const next = wizard.querySelector("[data-next]");
  const send = wizard.querySelector("[data-send]");
  let current = 0;

  const scrollWizardIntoView = () => {
    wizard.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateWizard = () => {
    steps.forEach((step, index) => step.classList.toggle("is-active", index === current));
    progress.style.width = `${((current + 1) / steps.length) * 100}%`;
    if (stepText) stepText.textContent = `Paso ${current + 1} de ${steps.length}`;
    prev.hidden = current === 0;
    next.hidden = current === steps.length - 1;
    send.hidden = current !== steps.length - 1;
  };

  const stepIsValid = () => {
    const fields = Array.from(steps[current].querySelectorAll("input, select, textarea"));
    return fields.every((field) => field.reportValidity());
  };

  next.addEventListener("click", () => {
    if (!stepIsValid()) return;
    current = Math.min(current + 1, steps.length - 1);
    updateWizard();
    scrollWizardIntoView();
  });

  prev.addEventListener("click", () => {
    current = Math.max(current - 1, 0);
    updateWizard();
    scrollWizardIntoView();
  });

  send.addEventListener("click", () => {
    if (!stepIsValid()) return;
    const data = new FormData(wizard);
    const lines = [
      "Hola Escuadrón Sonrisa, quiero enviar el formulario previo:",
      "",
      `Paciente: ${data.get("childName") || "-"}`,
      `Edad: ${data.get("age") || "-"}`,
      `Tutor responsable: ${data.get("guardian") || "-"}`,
      `Motivo de consulta: ${data.get("reason") || "-"}`,
      `Primera visita: ${data.get("firstVisit") || "-"}`,
      `Dolor dental: ${data.get("pain") || "-"}`,
      `Antecedentes de caries: ${data.get("cavities") || "-"}`,
      `Chupete o mamadera: ${data.get("pacifier") || "-"}`,
      `Alergias: ${data.get("allergies") || "-"}`,
      `Medicamentos: ${data.get("meds") || "-"}`,
      `Condiciones médicas: ${data.get("conditions") || "-"}`,
      `Comportamiento en consultas: ${data.get("behavior") || "-"}`,
      `Horario preferido: ${data.get("schedule") || "-"}`,
      `Observaciones: ${data.get("notes") || "-"}`
    ];
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  });

  updateWizard();
}
