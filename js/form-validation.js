/**
 * Form Submission Handling - Formspree Integration with Security Validation
 */

// ===== VALIDATION HELPER FUNCTIONS =====

/**
 * Sanitize input to prevent XSS attacks
 */
function sanitizeInput(value) {
  if (typeof value !== "string") return "";

  // Remove any HTML tags, script tags, and dangerous characters
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

/**
 * Check for potentially malicious content
 */
function containsMaliciousContent(value) {
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i,
    /vbscript:/i,
    /data:text\/html/i,
  ];

  return maliciousPatterns.some((pattern) => pattern.test(value));
}

/**
 * Validate email format
 */
function validateEmail(email) {
  if (!email || typeof email !== "string") return false;

  // Check for malicious content first
  if (containsMaliciousContent(email)) return false;

  // RFC 5322 compliant email regex (simplified but robust)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email.trim()) && email.length <= 254;
}

/**
 * Validate name (letters, spaces, hyphens, apostrophes, common diacritics)
 */
function validateName(name) {
  if (!name || typeof name !== "string") return false;

  // Check for malicious content
  if (containsMaliciousContent(name)) return false;

  const trimmedName = name.trim();

  // Must be between 2 and 100 characters
  if (trimmedName.length < 2 || trimmedName.length > 100) return false;

  // Allow letters (including diacritics), spaces, hyphens, apostrophes, periods
  const nameRegex =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

  return nameRegex.test(trimmedName);
}

/**
 * Validate phone number (international format support)
 */
function validatePhone(phone) {
  if (!phone || typeof phone !== "string") return false;

  // Check for malicious content
  if (containsMaliciousContent(phone)) return false;

  const trimmedPhone = phone.trim();

  // Must be between 7 and 20 characters
  if (trimmedPhone.length < 7 || trimmedPhone.length > 20) return false;

  // Allow digits, spaces, parentheses, hyphens, plus sign, dots
  // Must contain at least 7 digits
  const phoneRegex = /^[\d\s()+-./]+$/;
  const digitCount = (trimmedPhone.match(/\d/g) || []).length;

  return phoneRegex.test(trimmedPhone) && digitCount >= 7;
}

/**
 * Validate text field (general text, messages, addresses)
 */
function validateTextField(value, minLength = 2, maxLength = 1000) {
  if (!value || typeof value !== "string") return false;

  // Check for malicious content
  if (containsMaliciousContent(value)) return false;

  const trimmedValue = value.trim();

  return trimmedValue.length >= minLength && trimmedValue.length <= maxLength;
}

/**
 * Display validation error message
 */
function showValidationError(message, field = null) {
  const lang = localStorage.getItem("language") || "de";
  alert(message);
  if (field) {
    field.focus();
    field.style.borderColor = "#dc3545";
    setTimeout(() => {
      field.style.borderColor = "";
    }, 3000);
  }
}

// ===== END VALIDATION HELPERS =====

document.addEventListener("DOMContentLoaded", function () {
  // Try immediately, then retry with delays to catch dynamically loaded forms
  initFormHandlers();
  setTimeout(initFormHandlers, 100);
  setTimeout(initFormHandlers, 500);
});

function initFormHandlers() {
  // ===== BOOKING FORM HANDLING =====
  const bookingForm = document.getElementById("booking-form-modern");

  if (bookingForm && !bookingForm.dataset.handlerAttached) {
    bookingForm.dataset.handlerAttached = "true";

    const bookingSubmitBtn = bookingForm.querySelector('button[type="submit"]');

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const lang = localStorage.getItem("language") || "de";

      // Get form fields
      const nameField = bookingForm.querySelector('[name="name"]');
      const emailField = bookingForm.querySelector('[name="email"]');
      const phoneField = bookingForm.querySelector('[name="phone"]');
      const passengersField = bookingForm.querySelector('[name="passengers"]');
      const pickupField = bookingForm.querySelector('[name="pickup"]');
      const dropoffField = bookingForm.querySelector('[name="dropoff"]');
      const termsField = bookingForm.querySelector('[name="terms"]');

      // Validate name
      if (!nameField || !nameField.value.trim()) {
        const messages = {
          en: "Please enter your name.",
          de: "Bitte geben Sie Ihren Namen ein.",
          tr: "Lütfen adınızı girin.",
        };
        showValidationError(messages[lang] || messages.de, nameField);
        return false;
      }

      if (!validateName(nameField.value)) {
        const messages = {
          en: "Please enter a valid name (2-100 characters, letters only).",
          de: "Bitte geben Sie einen gültigen Namen ein (2-100 Zeichen, nur Buchstaben).",
          tr: "Geçerli bir ad girin (2-100 karakter, yalnızca harfler).",
        };
        showValidationError(messages[lang] || messages.de, nameField);
        return false;
      }

      // Validate email
      if (!emailField || !emailField.value.trim()) {
        const messages = {
          en: "Please enter your email address.",
          de: "Bitte geben Sie Ihre E-Mail-Adresse ein.",
          tr: "Lütfen e-posta adresinizi girin.",
        };
        showValidationError(messages[lang] || messages.de, emailField);
        return false;
      }

      if (!validateEmail(emailField.value)) {
        const messages = {
          en: "Please enter a valid email address.",
          de: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
          tr: "Geçerli bir e-posta adresi girin.",
        };
        showValidationError(messages[lang] || messages.de, emailField);
        return false;
      }

      // Validate phone
      if (!phoneField || !phoneField.value.trim()) {
        const messages = {
          en: "Please enter your phone number.",
          de: "Bitte geben Sie Ihre Telefonnummer ein.",
          tr: "Lütfen telefon numaranızı girin.",
        };
        showValidationError(messages[lang] || messages.de, phoneField);
        return false;
      }

      if (!validatePhone(phoneField.value)) {
        const messages = {
          en: "Please enter a valid phone number (7-20 characters).",
          de: "Bitte geben Sie eine gültige Telefonnummer ein (7-20 Zeichen).",
          tr: "Geçerli bir telefon numarası girin (7-20 karakter).",
        };
        showValidationError(messages[lang] || messages.de, phoneField);
        return false;
      }

      // Validate passengers
      if (!passengersField || !passengersField.value) {
        const messages = {
          en: "Please select number of passengers.",
          de: "Bitte wählen Sie die Anzahl der Passagiere.",
          tr: "Lütfen yolcu sayısını seçin.",
        };
        showValidationError(messages[lang] || messages.de, passengersField);
        return false;
      }

      // Validate pickup address
      if (pickupField && !validateTextField(pickupField.value, 3, 200)) {
        const messages = {
          en: "Please enter a valid pickup address (3-200 characters).",
          de: "Bitte geben Sie eine gültige Abholadresse ein (3-200 Zeichen).",
          tr: "Geçerli bir alış adresi girin (3-200 karakter).",
        };
        showValidationError(messages[lang] || messages.de, pickupField);
        return false;
      }

      // Validate dropoff address
      if (dropoffField && !validateTextField(dropoffField.value, 3, 200)) {
        const messages = {
          en: "Please enter a valid dropoff address (3-200 characters).",
          de: "Bitte geben Sie eine gültige Zieladresse ein (3-200 Zeichen).",
          tr: "Geçerli bir varış adresi girin (3-200 karakter).",
        };
        showValidationError(messages[lang] || messages.de, dropoffField);
        return false;
      }

      // Validate terms checkbox
      if (termsField && !termsField.checked) {
        const messages = {
          en: "Please accept the terms and conditions.",
          de: "Bitte akzeptieren Sie die Geschäftsbedingungen.",
          tr: "Lütfen şartları ve koşulları kabul edin.",
        };
        showValidationError(messages[lang] || messages.de, termsField);
        return false;
      }

      // Sanitize all text inputs before submission
      if (nameField) nameField.value = sanitizeInput(nameField.value);
      if (emailField) emailField.value = sanitizeInput(emailField.value);
      if (phoneField) phoneField.value = sanitizeInput(phoneField.value);
      if (pickupField) pickupField.value = sanitizeInput(pickupField.value);
      if (dropoffField) dropoffField.value = sanitizeInput(dropoffField.value);

      // Show loading state
      if (bookingSubmitBtn) {
        bookingSubmitBtn.disabled = true;
        const lang = localStorage.getItem("language") || "de";
        const loadingText = {
          de: "Wird gesendet...",
          en: "Sending...",
          tr: "Gönderiliyor...",
        };
        bookingSubmitBtn.innerHTML = loadingText[lang] || loadingText.de;
      }

      // Create FormData and submit
      const formData = new FormData(bookingForm);

      // Log what we're sending (for debugging)

      fetch(bookingForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            // Show success alert
            const lang = localStorage.getItem("language") || "de";
            const messages = {
              en: "Thank you! Your booking request has been submitted successfully. We'll contact you within 24 hours.",
              de: "Vielen Dank! Ihre Buchungsanfrage wurde erfolgreich gesendet. Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.",
              tr: "Teşekkürler! Rezervasyon talebiniz başarıyla gönderildi. 24 saat içinde sizinle iletişime geçeceğiz.",
            };
            alert(messages[lang] || messages.de);

            // Reset form
            bookingForm.reset();
          } else {
            // Log the error for debugging
            response
              .json()
              .then((data) => {
                console.error("Formspree error:", data);
              })
              .catch(() => {
                console.error("Could not parse error response");
              });

            // Show error alert
            const lang = localStorage.getItem("language") || "de";
            const messages = {
              en: "Oops! There was a problem submitting your form. Please try again or call us at +43 664 3588730.",
              de: "Oops! Es gab ein Problem beim Senden Ihrer Nachricht. Bitte versuchen Sie es erneut oder rufen Sie uns an: +43 664 3588730.",
              tr: "Hata! Formunuz gönderilirken bir sorun oluştu. Lütfen tekrar deneyin veya bizi arayın: +43 664 3588730.",
            };
            alert(messages[lang] || messages.de);
          }
        })
        .catch((error) => {
          // Show error alert
          const lang = localStorage.getItem("language") || "de";
          const messages = {
            en: "Oops! There was a problem submitting your form. Please try again or call us at +43 664 3588730.",
            de: "Oops! Es gab ein Problem beim Senden Ihrer Nachricht. Bitte versuchen Sie es erneut oder rufen Sie uns an: +43 664 3588730.",
            tr: "Hata! Formunuz gönderilirken bir sorun oluştu. Lütfen tekrar deneyin veya bizi arayın: +43 664 3588730.",
          };
          alert(messages[lang] || messages.de);
          console.error("Form submission error:", error);
        })
        .finally(() => {
          // Re-enable submit button
          if (bookingSubmitBtn) {
            bookingSubmitBtn.disabled = false;
            const lang = localStorage.getItem("language") || "de";
            const buttonText = {
              de: "Anfrage senden",
              en: "Submit Request",
              tr: "Talep Gönder",
            };
            bookingSubmitBtn.innerHTML = buttonText[lang] || buttonText.de;
          }
        });
    });
  }

  // ===== CONTACT FORM HANDLING =====
  const contactForm = document.getElementById("contact-form");

  if (contactForm && !contactForm.dataset.handlerAttached) {
    contactForm.dataset.handlerAttached = "true";

    const contactSubmitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const lang = localStorage.getItem("language") || "de";

      // Get form fields
      const nameField = contactForm.querySelector('[name="name"]');
      const emailField = contactForm.querySelector('[name="email"]');
      const phoneField = contactForm.querySelector('[name="phone"]');
      const subjectField = contactForm.querySelector('[name="subject"]');
      const messageField = contactForm.querySelector('[name="message"]');

      // Validate name
      if (!nameField || !nameField.value.trim()) {
        const messages = {
          en: "Please enter your name.",
          de: "Bitte geben Sie Ihren Namen ein.",
          tr: "Lütfen adınızı girin.",
        };
        showValidationError(messages[lang] || messages.de, nameField);
        return false;
      }

      if (!validateName(nameField.value)) {
        const messages = {
          en: "Please enter a valid name (2-100 characters, letters only).",
          de: "Bitte geben Sie einen gültigen Namen ein (2-100 Zeichen, nur Buchstaben).",
          tr: "Geçerli bir ad girin (2-100 karakter, yalnızca harfler).",
        };
        showValidationError(messages[lang] || messages.de, nameField);
        return false;
      }

      // Validate email
      if (!emailField || !emailField.value.trim()) {
        const messages = {
          en: "Please enter your email address.",
          de: "Bitte geben Sie Ihre E-Mail-Adresse ein.",
          tr: "Lütfen e-posta adresinizi girin.",
        };
        showValidationError(messages[lang] || messages.de, emailField);
        return false;
      }

      if (!validateEmail(emailField.value)) {
        const messages = {
          en: "Please enter a valid email address.",
          de: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
          tr: "Geçerli bir e-posta adresi girin.",
        };
        showValidationError(messages[lang] || messages.de, emailField);
        return false;
      }

      // Validate phone
      if (!phoneField || !phoneField.value.trim()) {
        const messages = {
          en: "Please enter your phone number.",
          de: "Bitte geben Sie Ihre Telefonnummer ein.",
          tr: "Lütfen telefon numaranızı girin.",
        };
        showValidationError(messages[lang] || messages.de, phoneField);
        return false;
      }

      if (!validatePhone(phoneField.value)) {
        const messages = {
          en: "Please enter a valid phone number (7-20 characters).",
          de: "Bitte geben Sie eine gültige Telefonnummer ein (7-20 Zeichen).",
          tr: "Geçerli bir telefon numarası girin (7-20 karakter).",
        };
        showValidationError(messages[lang] || messages.de, phoneField);
        return false;
      }

      // Validate subject
      if (!subjectField || !subjectField.value) {
        const messages = {
          en: "Please select a subject.",
          de: "Bitte wählen Sie einen Betreff.",
          tr: "Lütfen bir konu seçin.",
        };
        showValidationError(messages[lang] || messages.de, subjectField);
        return false;
      }

      // Validate message
      if (!messageField || !messageField.value.trim()) {
        const messages = {
          en: "Please enter your message.",
          de: "Bitte geben Sie Ihre Nachricht ein.",
          tr: "Lütfen mesajınızı girin.",
        };
        showValidationError(messages[lang] || messages.de, messageField);
        return false;
      }

      if (!validateTextField(messageField.value, 10, 5000)) {
        const messages = {
          en: "Please enter a valid message (10-5000 characters).",
          de: "Bitte geben Sie eine gültige Nachricht ein (10-5000 Zeichen).",
          tr: "Geçerli bir mesaj girin (10-5000 karakter).",
        };
        showValidationError(messages[lang] || messages.de, messageField);
        return false;
      }

      // Sanitize all text inputs before submission
      if (nameField) nameField.value = sanitizeInput(nameField.value);
      if (emailField) emailField.value = sanitizeInput(emailField.value);
      if (phoneField) phoneField.value = sanitizeInput(phoneField.value);
      if (messageField) messageField.value = sanitizeInput(messageField.value);

      // Show loading state
      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = true;
        const lang = localStorage.getItem("language") || "de";
        const loadingText = {
          de: "Wird gesendet...",
          en: "Sending...",
          tr: "Gönderiliyor...",
        };
        contactSubmitBtn.innerHTML = loadingText[lang] || loadingText.de;
      }

      // Create FormData and submit
      const formData = new FormData(contactForm);

      // Log what we're sending (for debugging)

      fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            // Show success alert
            const lang = localStorage.getItem("language") || "de";
            const messages = {
              en: "Thank you! Your message has been sent successfully. We'll contact you as soon as possible.",
              de: "Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir werden uns so schnell wie möglich bei Ihnen melden.",
              tr: "Teşekkürler! Mesajınız başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.",
            };
            alert(messages[lang] || messages.de);

            // Reset form
            contactForm.reset();
          } else {
            // Log the error for debugging
            response
              .json()
              .then((data) => {
                console.error("Formspree error:", data);
              })
              .catch(() => {
                console.error("Could not parse error response");
              });

            // Show error alert
            const lang = localStorage.getItem("language") || "de";
            const messages = {
              en: "Oops! There was a problem submitting your form. Please try again or call us at +43 664 3588730.",
              de: "Oops! Es gab ein Problem beim Senden Ihrer Nachricht. Bitte versuchen Sie es erneut oder rufen Sie uns an: +43 664 3588730.",
              tr: "Hata! Formunuz gönderilirken bir sorun oluştu. Lütfen tekrar deneyin veya bizi arayın: +43 664 3588730.",
            };
            alert(messages[lang] || messages.de);
          }
        })
        .catch((error) => {
          // Show error alert
          const lang = localStorage.getItem("language") || "de";
          const messages = {
            en: "Oops! There was a problem submitting your form. Please try again or call us at +43 664 3588730.",
            de: "Oops! Es gab ein Problem beim Senden Ihrer Nachricht. Bitte versuchen Sie es erneut oder rufen Sie uns an: +43 664 3588730.",
            tr: "Hata! Formunuz gönderilirken bir sorun oluştu. Lütfen tekrar deneyin veya bizi arayın: +43 664 3588730.",
          };
          alert(messages[lang] || messages.de);
          console.error("Form submission error:", error);
        })
        .finally(() => {
          // Re-enable submit button
          if (contactSubmitBtn) {
            contactSubmitBtn.disabled = false;
            const lang = localStorage.getItem("language") || "de";
            const buttonText = {
              de: "Nachricht senden",
              en: "Send Message",
              tr: "Mesaj Gönder",
            };
            contactSubmitBtn.innerHTML = buttonText[lang] || buttonText.de;
          }
        });
    });
  }
}
