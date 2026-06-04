// Main functionality
document.addEventListener("DOMContentLoaded", function () {
  // Hero slideshow
  initHeroSlideshow();

  // Set minimum date to today for date inputs
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
    dateInput.value = today;
  }

  // Form submission is now handled by form-validation.js
  // Old handlers removed to prevent conflicts with AJAX submission

  /*
  // Booking form submission
  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", handleBookingSubmit);
  }

  // Contact form submission
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }
  */
});

// Hero slideshow functionality
async function initHeroSlideshow() {
  const slideshowContainer = document.getElementById("hero-slideshow");
  if (!slideshowContainer) return;

  try {
    // Try to load images from assets/slide_show directory
    const response = await fetch("assets/slide_show/manifest.json");

    if (response.ok) {
      const manifest = await response.json();
      const images = manifest.images;

      if (images && images.length > 0) {
        // Create slides dynamically from manifest
        images.forEach((imageName, index) => {
          const slide = document.createElement("div");
          slide.className = "hero-slide";
          if (index === 0) slide.classList.add("active");
          slide.style.backgroundImage = `url('assets/slide_show/${imageName}')`;
          slideshowContainer.appendChild(slide);
        });

        console.log(
          `✅ Loaded ${images.length} slideshow images from assets/slide_show/`,
        );
      } else {
        loadFallbackSlides(slideshowContainer);
      }
    } else {
      loadFallbackSlides(slideshowContainer);
    }
  } catch (error) {
    console.log("ℹ️ manifest.json not found, using fallback images");
    loadFallbackSlides(slideshowContainer);
  }

  // Start slideshow animation after slides are loaded
  setTimeout(() => {
    const slides = document.querySelectorAll(".hero-slide");
    if (slides.length === 0) return;

    let currentSlide = 0;

    function showNextSlide() {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }

    // Change slide every 5 seconds
    setInterval(showNextSlide, 5000);
  }, 100);
}

// Load fallback slideshow images (Unsplash placeholders)
function loadFallbackSlides(container) {
  const fallbackImages = [
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80",
    "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?w=1600&q=80",
    "https://images.unsplash.com/photo-1562620669-f4c01b3c8c0e?w=1600&q=80",
    "https://images.unsplash.com/photo-1550355191-aa8a80b41353?w=1600&q=80",
  ];

  fallbackImages.forEach((imageUrl, index) => {
    const slide = document.createElement("div");
    slide.className = "hero-slide";
    if (index === 0) slide.classList.add("active");
    slide.style.backgroundImage = `url('${imageUrl}')`;
    container.appendChild(slide);
  });

  console.log("ℹ️ Using fallback slideshow images");
}

// Price calculator function
function calculatePrice() {
  const distance = parseFloat(document.getElementById("distance").value);
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const passengers = parseInt(document.getElementById("passengers").value);

  if (!distance || !date || !time) {
    alert(
      "Bitte füllen Sie zuerst die Distanz, das Datum und die Uhrzeit aus.",
    );
    return;
  }

  // Parse time
  const [hours, minutes] = time.split(":").map(Number);

  // Determine if it's Sunday (simplified - you'd need a proper calendar API for holidays)
  const selectedDate = new Date(date);
  const isSunday = selectedDate.getDay() === 0; // Only Sunday, NOT Saturday

  // Determine rate based on time and day
  let baseRate;
  let rateDescription;

  if (isSunday) {
    // Sunday all day - €2.50/km
    baseRate = 2.5;
    rateDescription = "Sonntags-/Feiertagstarif (ganztägig)";
  } else if (hours >= 6 && hours < 20) {
    // Weekday Mon-Sat, 06:00-20:00 - €2.30/km
    baseRate = 2.3;
    rateDescription = "Normaltarif (Mo-Sa, 06:00-20:00)";
  } else {
    // Night rate - €2.50/km
    baseRate = 2.5;
    rateDescription = "Nachttarif (20:00-06:00)";
  }

  let breakdown = [];
  let totalPrice = 4.9; // Base fare (Grundtarif)
  breakdown.push("Grundtarif = €4,90");

  if (distance <= 12) {
    // All distance at base rate
    const distancePrice = distance * baseRate;
    totalPrice += distancePrice;
    breakdown.push(
      `${distance.toFixed(2)} km × €${baseRate.toFixed(2)} = €${distancePrice.toFixed(2)}`,
    );
  } else {
    // First 12 km at base rate
    const first12Price = 12 * baseRate;
    breakdown.push(
      `Erste 12 km × €${baseRate.toFixed(2)} = €${first12Price.toFixed(2)}`,
    );

    // Remaining distance at €2.80/km
    const remainingDistance = distance - 12;
    const remainingPrice = remainingDistance * 2.8;
    breakdown.push(
      `Weitere ${remainingDistance.toFixed(2)} km × €2,80 (Langstrecke) = €${remainingPrice.toFixed(2)}`,
    );

    totalPrice += first12Price + remainingPrice;
  }

  // Add passenger surcharge if more than 4 passengers
  let surcharge = 0;
  if (passengers > 4) {
    const extraPassengers = passengers - 4;
    surcharge = extraPassengers * 2.7;
    breakdown.push(
      `Zuschlag für ${extraPassengers} zusätzliche Passagiere (ab 5. Person) × €2,70 = €${surcharge.toFixed(2)}`,
    );
    totalPrice += surcharge;
  }

  // Display result
  const resultDiv = document.getElementById("calculator-result");
  const breakdownDiv = document.getElementById("price-breakdown");

  let html = `
        <p><strong>Tarif:</strong> ${rateDescription}</p>
        <p><strong>Berechnung:</strong></p>
        <ul style="list-style: none; padding-left: 0;">
    `;

  breakdown.forEach((item) => {
    html += `<li>• ${item}</li>`;
  });

  html += `
        </ul>
        <div class="total-price">
            Geschätzter Gesamtpreis: €${totalPrice.toFixed(2)}
        </div>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #666; border-top: 1px solid #ddd; padding-top: 1rem;">
            <strong>Wichtiger Hinweis:</strong> Dies ist eine unverbindliche Preisschätzung. 
            Bei Langstreckenfahrten kann der tatsächliche Preis abweichen. 
            Wir senden Ihnen nach Ihrer Anfrage ein verbindliches Angebot zu.
        </p>
    `;

  breakdownDiv.innerHTML = html;
  resultDiv.classList.add("show");

  // Scroll to result
  resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Handle booking form submission
function handleBookingSubmit(e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // In a real application, this would send data to a backend server
  // For demonstration, we'll show a success message

  const formattedMessage = `
Neue Buchungsanfrage erhalten:

Kundeninformationen:
- Name: ${data.name}
- E-Mail: ${data.email}
- Telefon: ${data.phone}
- Passagiere: ${data.passengers}

Fahrtdetails:
- Von: ${data.pickup}
- Nach: ${data.destination}
- Datum: ${data.date}
- Uhrzeit: ${data.time}
- Distanz: ${data.distance || "nicht angegeben"} km
- Fahrzeug: ${data.vehicle || "keine Präferenz"}

Zusätzliche Informationen:
${data.message || "Keine"}

---
Diese Anfrage wurde über das Kontaktformular auf taxicomfort.at gesendet.
    `.trim();

  console.log(formattedMessage);

  // Show success message
  alert(
    "Vielen Dank für Ihre Anfrage!\n\nWir haben Ihre Buchungsanfrage erhalten und werden Ihnen innerhalb von 24 Stunden ein individuelles Angebot per E-Mail zusenden.\n\nIhr Taxi Comfort Team",
  );

  // Reset form
  e.target.reset();

  // Hide calculator result if shown
  const resultDiv = document.getElementById("calculator-result");
  if (resultDiv) {
    resultDiv.classList.remove("show");
  }

  // In production, you would send this to your backend:
  /*
    fetch('/api/booking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        alert('Anfrage erfolgreich gesendet!');
        e.target.reset();
    })
    .catch(error => {
        alert('Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.');
    });
    */
}

// Handle contact form submission
function handleContactSubmit(e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  const formattedMessage = `
Neue Kontaktanfrage erhalten:

Absender:
- Name: ${data.name}
- E-Mail: ${data.email}
- Telefon: ${data.phone}
- Betreff: ${data.subject}

Nachricht:
${data.message}

---
Diese Anfrage wurde über das Kontaktformular auf taxicomfort.at gesendet.
    `.trim();

  console.log(formattedMessage);

  // Show success message
  alert(
    "Vielen Dank für Ihre Nachricht!\n\nWir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.\n\nIhr Taxi Comfort Team",
  );

  // Reset form
  e.target.reset();

  // In production, you would send this to your backend:
  /*
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        alert('Nachricht erfolgreich gesendet!');
        e.target.reset();
    })
    .catch(error => {
        alert('Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.');
    });
    */
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all cards and sections for animation
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".feature-card, .fleet-card, .price-card, .value-card, .contact-card, .section-title, .section-subtitle",
  );

  animatedElements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    el.style.transitionDelay = `${index * 0.02}s`;
    observer.observe(el);
  });
});
