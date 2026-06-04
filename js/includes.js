// Load header and footer
(function () {
  // Language Management
  // Detect browser language if not set in localStorage
  function getBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split("-")[0].toLowerCase(); // Get 'en' from 'en-US'
    return ["en", "de", "tr"].includes(langCode) ? langCode : "de";
  }

  let currentLang = localStorage.getItem("language") || getBrowserLanguage();

  // Get translation
  function t(key) {
    if (
      typeof translations !== "undefined" &&
      translations[currentLang] &&
      translations[currentLang][key]
    ) {
      return translations[currentLang][key];
    }
    return key; // Return key if translation not found
  }

  // Update all translatable elements on the page
  function updatePageTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = t(key);

      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        if (element.hasAttribute("placeholder")) {
          element.setAttribute("placeholder", translation);
        }
      } else {
        // Check if it contains HTML
        if (translation.includes("<")) {
          element.innerHTML = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update placeholder translations
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      const translation = t(key);
      if (element.hasAttribute("placeholder")) {
        element.setAttribute("placeholder", translation);
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
  }

  // Switch language
  function switchLanguage(lang) {
    if (["en", "de", "tr"].includes(lang)) {
      currentLang = lang;
      localStorage.setItem("language", lang);
      updatePageTranslations();
      updateLanguageSelectorActiveState();
    }
  }

  // Update active state of language selector
  function updateLanguageSelectorActiveState() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-lang") === currentLang) {
        btn.classList.add("active");
      }
    });
  }

  // Expose functions globally
  window.switchLanguage = switchLanguage;
  window.t = t;

  // Function to load HTML includes
  async function loadInclude(elementId, filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`Failed to load ${filePath}`);
      const html = await response.text();
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = html;
      }
    } catch (error) {
      console.error("Error loading include:", error);
    }
  }

  // Function to highlight active page in navigation
  function setActiveNavItem() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("#nav-menu a");

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (
        href === currentPage ||
        (currentPage === "" && href === "index.html")
      ) {
        link.classList.add("active");
      }
    });
  }

  // Load header and footer when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", async () => {
      // Check which header to load
      const headerPlaceholder = document.getElementById("header-placeholder");
      const headerType =
        headerPlaceholder?.getAttribute("data-header") || "standard";
      const headerFile =
        headerType === "home"
          ? "includes/header-home.html"
          : "includes/header.html";

      await loadInclude("header-placeholder", headerFile);
      await loadInclude("footer-placeholder", "includes/footer.html");

      // Load booking section if placeholder exists
      const bookingSectionPlaceholder = document.getElementById(
        "booking-section-include",
      );
      if (bookingSectionPlaceholder) {
        await loadInclude(
          "booking-section-include",
          "includes/booking-section.html",
        );

        // Dispatch event to notify that booking section is loaded
        document.dispatchEvent(new CustomEvent("bookingSectionLoaded"));
      }

      setActiveNavItem();

      // Initialize translations
      updatePageTranslations();
      updateLanguageSelectorActiveState();

      // Setup language switcher event listeners
      document.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const lang = this.getAttribute("data-lang");
          switchLanguage(lang);
        });
      });

      // Re-initialize mobile menu after header is loaded
      const mobileToggle = document.getElementById("mobile-toggle");
      const navMenu = document.getElementById("nav-menu");
      if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", function () {
          navMenu.classList.toggle("active");
          mobileToggle.classList.toggle("active");
        });

        // Close menu when clicking outside
        setupClickOutsideHandler(mobileToggle, navMenu);
      }

      // Initialize scroll-to-top button
      initScrollToTop();
    });
  } else {
    (async () => {
      // Check which header to load
      const headerPlaceholder = document.getElementById("header-placeholder");
      const headerType =
        headerPlaceholder?.getAttribute("data-header") || "standard";
      const headerFile =
        headerType === "home"
          ? "includes/header-home.html"
          : "includes/header.html";

      await loadInclude("header-placeholder", headerFile);
      await loadInclude("footer-placeholder", "includes/footer.html");

      // Load booking section if placeholder exists
      const bookingSectionPlaceholder = document.getElementById(
        "booking-section-include",
      );
      if (bookingSectionPlaceholder) {
        await loadInclude(
          "booking-section-include",
          "includes/booking-section.html",
        );

        // Dispatch event to notify that booking section is loaded
        document.dispatchEvent(new CustomEvent("bookingSectionLoaded"));
      }

      setActiveNavItem();

      // Initialize translations
      updatePageTranslations();
      updateLanguageSelectorActiveState();

      // Setup language switcher event listeners
      document.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const lang = this.getAttribute("data-lang");
          switchLanguage(lang);
        });
      });

      // Re-initialize mobile menu after header is loaded
      const mobileToggle = document.getElementById("mobile-toggle");
      const navMenu = document.getElementById("nav-menu");
      if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", function () {
          navMenu.classList.toggle("active");
          mobileToggle.classList.toggle("active");
        });

        // Close menu when clicking outside
        setupClickOutsideHandler(mobileToggle, navMenu);
      }

      // Initialize scroll-to-top button
      initScrollToTop();
    })();
  }
})();

// Mobile menu click-outside handler
function setupClickOutsideHandler(toggleButton, menuElement) {
  document.addEventListener("click", function (event) {
    // Check if menu is open and click is outside menu and toggle button
    if (
      menuElement.classList.contains("active") &&
      !menuElement.contains(event.target) &&
      !toggleButton.contains(event.target)
    ) {
      menuElement.classList.remove("active");
      toggleButton.classList.remove("active");
    }
  });
}

// Scroll to Top Button functionality
function initScrollToTop() {
  const scrollToTopBtn = document.getElementById("scroll-to-top");

  if (!scrollToTopBtn) return;

  // Show/hide button based on scroll position
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  });

  // Scroll to top when clicked
  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
