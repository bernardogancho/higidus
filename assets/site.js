(function () {
  function initLucideIcons() {
    if (!window.lucide || typeof window.lucide.createIcons !== "function") return;
    window.lucide.createIcons();
  }

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

    var rampEnd = 120;
    var switchAt = 64;
    var ticking = false;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function lerp(from, to, t) {
      return from + (to - from) * t;
    }

    function rgba(r, g, b, a) {
      return "rgba(" + Math.round(r) + ", " + Math.round(g) + ", " + Math.round(b) + ", " + a.toFixed(3) + ")";
    }

    function apply() {
      var y = window.scrollY || 0;
      var progress = clamp(y / rampEnd, 0, 1);
      var isScrolled = y > switchAt;

      header.style.backgroundColor = rgba(
        lerp(11, 255, progress),
        lerp(59, 255, progress),
        lerp(46, 255, progress),
        lerp(0.97, 0.985, progress)
      );

      header.style.borderColor = rgba(
        lerp(255, 226, progress),
        lerp(255, 232, progress),
        lerp(255, 240, progress),
        lerp(0.16, 1, progress)
      );

      var shadowAlpha = lerp(0, 0.06, progress);
      header.style.boxShadow = shadowAlpha < 0.002 ? "none" : "0 10px 22px rgba(15, 23, 42, " + shadowAlpha.toFixed(3) + ")";

      header.classList.toggle("is-scrolled", isScrolled);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        apply();
        ticking = false;
      });
    }

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
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
        manutencao: "Manutenção de Postos",
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

  function initBlogReadingUX() {
    var content = document.querySelector("[data-reading-content]");
    if (!content) return;

    var toc = document.querySelector("[data-post-toc]");
    var tocEmpty = document.querySelector("[data-post-toc-empty]");
    var progressFill = document.querySelector("[data-reading-progress-fill]");
    var progressLabel = document.querySelector("[data-reading-progress-label]");
    var header = document.querySelector("[data-site-header]");

    function headerOffset() {
      if (!header) return 64;
      return header.offsetHeight || 64;
    }

    function slugify(text) {
      return (text || "")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    var headings = Array.prototype.slice.call(content.querySelectorAll("h2, h3"));
    var tocLinks = [];

    if (toc && headings.length) {
      var idCounts = {};

      headings.forEach(function (heading, index) {
        var tagName = heading.tagName ? heading.tagName.toLowerCase() : "h2";
        var rawId = heading.getAttribute("id") || "";
        var baseId = rawId || slugify(heading.textContent) || "secao-" + (index + 1);
        var dedupIndex = (idCounts[baseId] || 0) + 1;
        idCounts[baseId] = dedupIndex;
        var finalId = dedupIndex > 1 ? baseId + "-" + dedupIndex : baseId;

        heading.setAttribute("id", finalId);

        var li = document.createElement("li");
        li.className = "post-toc-item " + (tagName === "h3" ? "level-h3" : "level-h2");

        var link = document.createElement("a");
        link.className = "post-toc-item-link";
        link.href = "#" + finalId;
        link.textContent = heading.textContent || "Secção";
        link.setAttribute("data-post-toc-link", finalId);
        li.appendChild(link);
        toc.appendChild(li);

        tocLinks.push(link);
      });

      if (tocEmpty) tocEmpty.hidden = true;
    } else if (tocEmpty) {
      tocEmpty.hidden = false;
    }

    function readProgress() {
      var rect = content.getBoundingClientRect();
      var start = window.scrollY + rect.top - headerOffset() - 22;
      var end = start + content.offsetHeight - window.innerHeight * 0.55;

      if (end <= start) {
        return window.scrollY >= start ? 100 : 0;
      }

      var progress = ((window.scrollY - start) / (end - start)) * 100;
      if (progress < 0) return 0;
      if (progress > 100) return 100;
      return progress;
    }

    function updateProgress() {
      if (!progressFill && !progressLabel) return;
      var progress = readProgress();
      var remaining = Math.max(0, Math.ceil(100 - progress));

      if (progressFill) {
        progressFill.style.width = progress.toFixed(1) + "%";
      }

      if (progressLabel) {
        progressLabel.textContent = remaining === 0 ? "Concluído" : "Faltam " + remaining + "%";
      }
    }

    function updateActiveToc() {
      if (!tocLinks.length) return;
      var marker = window.scrollY + headerOffset() + 34;
      var activeId = tocLinks[0].getAttribute("data-post-toc-link");

      headings.forEach(function (heading) {
        var headingTop = heading.getBoundingClientRect().top + window.scrollY;
        if (headingTop <= marker) {
          activeId = heading.getAttribute("id");
        }
      });

      tocLinks.forEach(function (link) {
        var isActive = link.getAttribute("data-post-toc-link") === activeId;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    function onScroll() {
      updateProgress();
      updateActiveToc();
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLucideIcons();
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
    initBlogReadingUX();
  });
})();
