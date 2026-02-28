(function () {
  function initMobileMenus() {
    var toggles = Array.prototype.slice.call(document.querySelectorAll("[data-mobile-toggle]"));
    if (!toggles.length) return;

    toggles.forEach(function (toggle) {
      var targetId = toggle.getAttribute("data-mobile-toggle");
      if (!targetId) return;
      var menu = document.getElementById(targetId);
      if (!menu) return;

      toggle.addEventListener("click", function () {
        var isOpen = menu.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    });
  }

  function initGuideVisibilityFromAnchor() {
    var body = document.body;
    if (!body) return;

    var anchorId = body.getAttribute("data-guides-from");
    if (!anchorId) return;

    var anchor = document.getElementById(anchorId);
    if (!anchor) return;

    function apply() {
      var anchorTop = anchor.getBoundingClientRect().top;
      var guideStart = Math.max(anchorTop, 0);
      document.documentElement.style.setProperty("--guides-start", guideStart + "px");
    }

    apply();
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
  }

  function initHeaderTheme() {
    var header = document.querySelector("[data-site-header]");
    if (!header) return;

    function apply() {
      var isScrolled = window.scrollY > 14;
      header.classList.toggle("is-scrolled", isScrolled);
    }

    apply();
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
  }

  function initServiceModal() {
    var modal = document.getElementById("service-modal");
    if (!modal) return;

    var openButtons = Array.prototype.slice.call(document.querySelectorAll("[data-service-open]"));
    var closeButtons = Array.prototype.slice.call(document.querySelectorAll("[data-service-close]"));
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-service-panel]"));
    var ctaLinks = Array.prototype.slice.call(document.querySelectorAll("[data-service-cta]"));

    function hidePanels() {
      panels.forEach(function (panel) {
        panel.classList.add("hidden");
      });
    }

    function openModal(index, button) {
      if (index < 0 || index >= panels.length) return;
      hidePanels();
      panels[index].classList.remove("hidden");
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.classList.add("overflow-hidden");

      openButtons.forEach(function (btn) {
        btn.style.borderColor = "";
        btn.style.backgroundColor = "";
      });
      if (button) {
        button.style.borderColor = "#0B3B2E";
        button.style.backgroundColor = "rgba(11,59,46,0.05)";
      }
    }

    function closeModal() {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      hidePanels();
      document.body.classList.remove("overflow-hidden");
      openButtons.forEach(function (btn) {
        btn.style.borderColor = "";
        btn.style.backgroundColor = "";
      });
    }

    openButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var index = Number(button.getAttribute("data-service-open"));
        if (!Number.isNaN(index)) openModal(index, button);
      });
    });

    closeButtons.forEach(function (button) {
      button.addEventListener("click", closeModal);
    });

    ctaLinks.forEach(function (link) {
      link.addEventListener("click", closeModal);
    });

    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
      }
    });

    hidePanels();
  }

  function initCounters() {
    var counters = Array.prototype.slice.call(document.querySelectorAll("[data-counter]"));
    if (!counters.length) return;
    var failSafeTimer = null;

    function renderCounter(el, value) {
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      el.textContent = prefix + value + suffix;
    }

    function animateCounter(el) {
      var target = Number(el.getAttribute("data-target")) || 0;
      var duration = 1400;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var current = Math.floor(progress * target);
        renderCounter(el, current);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          renderCounter(el, target);
        }
      }

      window.requestAnimationFrame(step);
    }

    var started = false;

    function startAll() {
      if (started) return;
      started = true;
      if (failSafeTimer) {
        window.clearTimeout(failSafeTimer);
        failSafeTimer = null;
      }
      counters.forEach(function (counter) {
        animateCounter(counter);
      });
    }

    if (!("IntersectionObserver" in window) || typeof window.IntersectionObserver !== "function") {
      startAll();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            startAll();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );

    var rootSection = document.getElementById("numeros") || counters[0];
    try {
      observer.observe(rootSection);
      // Fallback: run counters anyway if observer does not fire due viewport quirks.
      failSafeTimer = window.setTimeout(startAll, 1400);
    } catch (error) {
      startAll();
    }
  }

  function initCaseFilters() {
    var filters = Array.prototype.slice.call(document.querySelectorAll("[data-case-filter]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-case-card]"));
    if (!filters.length || !cards.length) return;

    function setFilter(filter) {
      filters.forEach(function (button) {
        var active = button.getAttribute("data-case-filter") === filter;
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });

      cards.forEach(function (card) {
        var sector = card.getAttribute("data-sector");
        var visible = filter === "todos" || filter === sector;
        card.classList.toggle("is-hidden", !visible);
      });
    }

    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-case-filter") || "todos";
        setFilter(filter);
      });
    });

    setFilter("todos");
  }

  function initCaseModal() {
    var modal = document.querySelector("[data-case-modal]");
    if (!modal) return;

    var openButtons = Array.prototype.slice.call(document.querySelectorAll("[data-case-open]"));
    var closeButtons = Array.prototype.slice.call(document.querySelectorAll("[data-case-close]"));
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-case-panel]"));

    if (!openButtons.length || !closeButtons.length || !panels.length) return;

    function hidePanels() {
      panels.forEach(function (panel) {
        panel.classList.add("hidden");
      });
    }

    function openModal(index) {
      if (index < 0 || index >= panels.length) return;
      hidePanels();
      panels[index].classList.remove("hidden");
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.classList.add("overflow-hidden");
    }

    function closeModal() {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      hidePanels();
      document.body.classList.remove("overflow-hidden");
    }

    openButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var index = Number(button.getAttribute("data-case-open"));
        if (!Number.isNaN(index)) openModal(index);
      });
    });

    closeButtons.forEach(function (button) {
      button.addEventListener("click", closeModal);
    });

    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
      }
    });

    hidePanels();
  }

  function initEmergencyWidget() {
    var toggle = document.querySelector("[data-emergency-toggle]");
    var panel = document.querySelector("[data-emergency-panel]");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", function () {
      var isOpen = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", function (event) {
      if (!panel.classList.contains("is-open")) return;
      if (panel.contains(event.target) || toggle.contains(event.target)) return;
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  function initCookieBanner() {
    var banner = document.getElementById("cookie-banner");
    if (!banner) return;

    var acceptBtn = banner.querySelector("[data-cookie-accept]");
    var rejectBtn = banner.querySelector("[data-cookie-reject]");
    var storageKey = "higidus-cookie-consent";

    try {
      if (!localStorage.getItem(storageKey)) {
        banner.classList.add("is-visible");
      }
    } catch (error) {
      banner.classList.add("is-visible");
    }

    function closeBanner(value) {
      banner.classList.remove("is-visible");
      try {
        localStorage.setItem(storageKey, value);
      } catch (error) {
        return;
      }
    }

    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        closeBanner("accepted");
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener("click", function () {
        closeBanner("rejected");
      });
    }
  }

  function initFormPrefillFromQuery() {
    if (!window.location.search) return;

    var params = new URLSearchParams(window.location.search);

    var service = params.get("servico");
    var sector = params.get("setor");

    var serviceSelect = document.getElementById("tipo_servico");
    var sectorSelect = document.getElementById("setor");

    function applyValue(select, valueMapKey, value) {
      if (!select || !value) return;
      var optionMap = valueMapKey;
      var mapped = optionMap[value] || "";
      if (!mapped) return;

      var options = Array.prototype.slice.call(select.options);
      var found = options.find(function (option) {
        return option.text.toLowerCase() === mapped.toLowerCase();
      });
      if (found) {
        select.value = found.value;
      }
    }

    applyValue(
      serviceSelect,
      {
        avaliacao: "Avaliação",
        remediacao: "Remediação",
        conformidade: "Conformidade",
        postos: "Postos",
      },
      service
    );

    applyValue(
      sectorSelect,
      {
        construcao: "Construção",
        industria: "Indústria",
        postos: "Postos",
        municipal: "Municipal",
      },
      sector
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    initGuideVisibilityFromAnchor();
    initHeaderTheme();
    initMobileMenus();
    initServiceModal();
    initCounters();
    initCaseFilters();
    initCaseModal();
    initEmergencyWidget();
    initCookieBanner();
    initFormPrefillFromQuery();
  });
})();
