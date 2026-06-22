(function () {
  "use strict";

  /* =========================================================
     1. НАСТРОЙКА ОТПРАВКИ В TELEGRAM
     ---------------------------------------------------------
     Чтобы заявки приходили в Telegram:
       1. Напишите @BotFather, создайте бота — получите BOT_TOKEN.
       2. Напишите боту /start, затем зайдите на
          https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
          и найдите "chat":{"id": ...} — это ваш CHAT_ID.
       3. Вставьте оба значения ниже.
  ========================================================= */
  const TELEGRAM_CONFIG = {
    botToken: "8205038998:AAHRPtTEaK-JObKjbn27AoX_0Y3qBO5kYkQ",   // например: 7123456789:AAFxxx...
    chatId:   "556442193"      // например: 123456789
  };

  const portfolioItems = [
    {
      tag: "Торговое помещение",
      title: "Шоу-рум одежды FORMA",
      area: "180 м²",
      img: "images/0e86057f-5ae4-4b88-970e-e2bc0458344b.jpg",
      text: "Подобрали угловое помещение на первой линии с витринным остеклением, согласовали входную группу под фирменный стиль клиента."
    },
    {
      tag: "Офис",
      title: "IT-компания «Vector»",
      area: "340 м²",
      img: "images/94f0a71f-4c50-43fb-9a3a-f2690c7918bf.jpg",
      text: "Этаж бизнес-центра класса B+ перепланирован под open space с переговорными и серверной по чертежам арендатора."
    },
    {
      tag: "Склад",
      title: "Логистический оператор «ТрансХаб»",
      area: "1 200 м²",
      img: "images/720ed72b-2da9-480d-b5de-16aa5d8f4f5b.jpg",
      text: "Складской комплекс с пандусами и высотой потолков 10 м, организовано отдельное помещение для кросс-докинга."
    }
  ];

  const premises = [
    {
      id: "p1",
      type: "free",
      typeLabel: "Свободное назначение",
      title: "Помещение на ул. 30 лет Победы",
      address: "ул. 30 лет Победы, 113А, корп.2, 1 этаж",
      area: 120,
      floor: "1 этаж, отдельный вход",
      pricePerSqm: 700,
      img: "images/1d78a78c-5d53-4760-989a-e27329515384.jpg"
    },
    {
      id: "p2",
      type: "free",
      typeLabel: "Свободное назначение",
      title: "Помещение на ул. 30 лет Победы",
      address: "ул. 30 лет Победы, 113А, корп.2, 2 этаж",
      area: 200,
      floor: "2 этаж",
      pricePerSqm: 700,
      img: "images/a371e9a0-39e4-4b9f-be4c-804ea11cb5d1.jpg"
    },
    {
      id: "p3",
      type: "free",
      typeLabel: "Свободное назначение",
      title: "Помещение на ул. 30 лет Победы",
      address: "ул. 30 лет Победы, 113А, корп.2, 1 этаж",
      area: 350,
      floor: "1 этаж, пандус",
      pricePerSqm: 700,
      img: "images/ca0b4aa6-6c0d-4aef-833a-5ad5a337bbf8.jpg"
    }
  ];

  const numberFormatter = new Intl.NumberFormat("ru-RU");

  const portfolioGrid = document.getElementById("portfolioGrid");

  function renderPortfolio() {
    portfolioGrid.innerHTML = portfolioItems
      .map(
        (item, index) => `
        <button class="portfolio-card" type="button" data-portfolio-index="${index}">
          <img src="${item.img}" alt="${item.title}" loading="lazy">
          <span class="portfolio-overlay">
            <span class="portfolio-tag">${item.tag}</span>
            <h3>${item.title}</h3>
            <span>${item.area}</span>
          </span>
        </button>`
      )
      .join("");
  }

  const catalogGrid = document.getElementById("catalogGrid");
  const catalogFilters = document.getElementById("catalogFilters");
  let activeFilter = "all";

  function renderCatalog() {
    const filtered =
      activeFilter === "all"
        ? premises
        : premises.filter((p) => p.type === activeFilter);

    if (filtered.length === 0) {
      catalogGrid.innerHTML = `<p class="catalog-empty">Подходящих помещений сейчас нет — оставьте заявку, мы подберём вариант.</p>`;
      return;
    }

    catalogGrid.innerHTML = filtered
      .map(
        (p) => `
        <article class="premise-card" id="card-${p.id}" data-id="${p.id}">
          <div class="premise-media">
            <img src="${p.img}" alt="${p.title}" loading="lazy">
            <span class="premise-type">${p.typeLabel}</span>
          </div>
          <div class="premise-body">
            <h3>${p.title}</h3>
            <p class="premise-address">${p.address}</p>
            <p class="premise-price">${numberFormatter.format(p.pricePerSqm)} ₽ <span>/ м² в месяц</span></p>
            <div class="premise-meta">
              <span><b>${p.area}</b> м²</span>
              <span>этаж: ${p.floor}</span>
            </div>
            <button class="premise-apply" type="button" data-apply-id="${p.id}">Оставить заявку</button>
          </div>
        </article>`
      )
      .join("");
  }

  function populatePremiseSelect() {
    const select = document.getElementById("fieldPremise");
    premises.forEach((p) => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = `${p.title} — ${p.area} м²`;
      select.appendChild(option);
    });
  }

  catalogFilters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    catalogFilters
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.toggle("is-active", b === btn));
    renderCatalog();
  });

  catalogGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-apply-id]");
    if (!btn) return;
    const id = btn.dataset.applyId;
    const select = document.getElementById("fieldPremise");
    select.value = id;

    document.getElementById("contact").scrollIntoView({ behavior: "smooth", block: "start" });

    const card = document.getElementById(`card-${id}`);
    if (card) {
      card.classList.add("is-highlighted");
      setTimeout(() => card.classList.remove("is-highlighted"), 1600);
    }
    setTimeout(() => document.getElementById("fieldName").focus({ preventScroll: true }), 500);
  });

  const modal = document.getElementById("portfolioModal");
  const modalImage = document.getElementById("modalImage");
  const modalTag = document.getElementById("modalTag");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  let lastFocusedEl = null;

  function openModal(index) {
    const item = portfolioItems[index];
    if (!item) return;
    modalImage.src = item.img;
    modalImage.alt = item.title;
    modalTag.textContent = `${item.tag} · ${item.area}`;
    modalTitle.textContent = item.title;
    modalText.textContent = item.text;

    lastFocusedEl = document.activeElement;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close").focus();
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  portfolioGrid.addEventListener("click", (e) => {
    const card = e.target.closest("[data-portfolio-index]");
    if (!card) return;
    openModal(Number(card.dataset.portfolioIndex));
  });

  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-modal-close]")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
  });

  const header = document.getElementById("siteHeader");
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  });

  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  const toTopBtn = document.getElementById("toTop");

  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
    toTopBtn.classList.toggle("is-visible", window.scrollY > 600);
  });

  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Подсветка активного пункта меню по секции на экране
  const sections = ["home", "about", "portfolio", "catalog", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinksBySection = new Map(
    Array.from(document.querySelectorAll(".main-nav .nav-link")).map((a) => [
      a.getAttribute("href").replace("#", ""),
      a
    ])
  );

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinksBySection.forEach((a) => a.classList.remove("is-active"));
        const link = navLinksBySection.get(entry.target.id);
        if (link) link.classList.add("is-active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  const statNumbers = document.querySelectorAll(".stat-number");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateCount(el) {
    const target = Number(el.dataset.count);
    if (prefersReducedMotion) {
      el.textContent = numberFormatter.format(target);
      return;
    }
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = numberFormatter.format(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  statNumbers.forEach((el) => statsObserver.observe(el));

  const form = document.getElementById("leaseForm");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");

  const PHONE_RE = /^(\+7|7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = form.querySelector(`[data-error-for="${fieldId}"]`);
    const wrapper = field.closest(".form-field") || field.closest(".form-checkbox");
    if (message) {
      wrapper.classList.add("has-error");
      if (errorEl) errorEl.textContent = message;
    } else {
      wrapper.classList.remove("has-error");
      if (errorEl) errorEl.textContent = "";
    }
  }

  function validateForm(data) {
    let valid = true;

    if (!data.name.trim()) {
      setFieldError("fieldName", "Укажите имя");
      valid = false;
    } else {
      setFieldError("fieldName", "");
    }

    if (!PHONE_RE.test(data.phone.trim())) {
      setFieldError("fieldPhone", "Проверьте номер телефона");
      valid = false;
    } else {
      setFieldError("fieldPhone", "");
    }

    if (!EMAIL_RE.test(data.email.trim())) {
      setFieldError("fieldEmail", "Проверьте адрес почты");
      valid = false;
    } else {
      setFieldError("fieldEmail", "");
    }

    if (!data.consent) {
      setFieldError("fieldConsent", "Нужно согласие на обработку данных");
      valid = false;
    } else {
      setFieldError("fieldConsent", "");
    }

    return valid;
  }

  function getPremiseLabel(id) {
    const found = premises.find((p) => p.id === id);
    return found ? `${found.title} — ${found.area} м² (${found.pricePerSqm * found.area} ₽/мес)` : "не выбрано / уточнить при звонке";
  }

  function setStatus(message, type) {
    formStatus.textContent = message;
    formStatus.classList.remove("is-success", "is-error");
    if (type) formStatus.classList.add(type === "success" ? "is-success" : "is-error");
  }

  function sendViaTelegram(data) {
    const text =
      `📋 *Новая заявка на аренду*\n` +
      `👤 Имя: ${data.name}\n` +
      `📞 Телефон: ${data.phone}\n` +
      `✉️ Email: ${data.email}\n` +
      `🏢 Помещение: ${getPremiseLabel(data.premise)}\n` +
      `💬 Комментарий: ${data.message || "—"}`;

    return fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CONFIG.chatId,
          text: text,
          parse_mode: "Markdown"
        })
      }
    ).then(res => res.json()).then(res => {
      if (!res.ok) throw new Error(res.description || "Telegram error");
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get("name") || "",
      phone: formData.get("phone") || "",
      email: formData.get("email") || "",
      premise: formData.get("premise") || "",
      message: formData.get("message") || "",
      consent: formData.get("consent") === "on"
    };

    if (!validateForm(data)) {
      setStatus("Проверьте поля, отмеченные красным.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Отправляем…";

    try {
      await sendViaTelegram(data);
      setStatus("Заявка отправлена. Мы свяжемся с вами в течение рабочего дня.", "success");
      form.reset();
    } catch (err) {
      console.error("Ошибка отправки заявки:", err);
      setStatus("Не удалось отправить заявку. Позвоните нам по телефону 8 (3452) 33-64-85.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Отправить заявку";
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  renderPortfolio();
  populatePremiseSelect();
  renderCatalog();
})();
