// Price Calculator for Booking Form
// Calculates estimated taxi fare based on distance, date, time, and passengers

class PriceCalculator {
  constructor() {
    // Base fare for all rides
    this.baseFare = 4.9;

    // Price rates per km in EUR
    this.rates = {
      weekday: 2.3, // Mon-Sat, 06:00-20:00
      night: 2.5, // 20:00-06:00 (all days) AND Sun & Holidays (all day)
      longDistance: 2.8, // Over 12km
    };

    // Passenger surcharges in EUR (from 5th person onwards, €2.70 per person)
    this.passengerSurcharge = {
      5: 2.7, // 1 person × 2.70
      6: 5.4, // 2 persons × 2.70
      7: 8.1, // 3 persons × 2.70
    };

    this.priceEstimateBox = null;
    this.priceValueElement = null;
    this.currentDistance = 0;
    this.init();
  }

  init() {
    // Wait for DOM and booking section to be loaded
    document.addEventListener("bookingSectionLoaded", () => {
      this.setupElements();
    });

    // Also try immediate setup in case booking section is already loaded
    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      setTimeout(() => this.setupElements(), 500);
    }
  }

  setupElements() {
    this.priceEstimateBox = document.getElementById("price-estimate");
    this.priceValueElement = document.getElementById("estimated-price");

    if (!this.priceEstimateBox || !this.priceValueElement) {
      console.warn("⚠️ [PriceCalculator] Price estimate elements not found");
      return;
    }

    // Listen for distance calculation events
    document.addEventListener("distanceCalculated", (event) => {
      this.currentDistance = event.detail.distance;
      this.calculatePrice(this.currentDistance);
    });

    // Listen for changes to date, time, and passenger fields
    const dateInput = document.getElementById("booking-date");
    const timeInput = document.getElementById("booking-time");
    const passengersInput = document.getElementById("booking-passengers");

    // Also listen to other required fields to trigger calculation when all are filled
    const nameInput = document.getElementById("booking-name");
    const emailInput = document.getElementById("booking-email");
    const phoneInput = document.getElementById("booking-phone");

    const recalculateIfReady = (fieldName) => {
      if (this.currentDistance > 0) {
        this.calculatePrice(this.currentDistance);
      } else {
      }
    };

    if (dateInput) {
      dateInput.addEventListener("change", () => recalculateIfReady("date"));
      dateInput.addEventListener("input", () => recalculateIfReady("date"));
    }

    if (timeInput) {
      timeInput.addEventListener("change", () => recalculateIfReady("time"));
      timeInput.addEventListener("input", () => recalculateIfReady("time"));
    }

    if (passengersInput) {
      passengersInput.addEventListener("change", () =>
        recalculateIfReady("passengers"),
      );
    }

    if (nameInput) {
      nameInput.addEventListener("input", () => recalculateIfReady("name"));
    }

    if (emailInput) {
      emailInput.addEventListener("input", () => recalculateIfReady("email"));
    }

    if (phoneInput) {
      phoneInput.addEventListener("input", () => recalculateIfReady("phone"));
    }
  }

  calculatePrice(distance) {
    if (!distance || distance <= 0) {
      this.hidePriceEstimate();
      return;
    }

    // Get date and time inputs first
    const dateInput = document.getElementById("booking-date");
    const timeInput = document.getElementById("booking-time");
    const passengersInput = document.getElementById("booking-passengers");

    const date = dateInput ? dateInput.value : "";
    const time = timeInput ? timeInput.value : "";
    const passengers = passengersInput
      ? parseInt(passengersInput.value) || 1
      : 1;

    // If price box is already visible, we can update it even if some fields are empty
    // Otherwise, check if all required fields are filled
    const isPriceVisible =
      this.priceEstimateBox && this.priceEstimateBox.style.display === "block";

    if (!isPriceVisible && !this.areAllRequiredFieldsFilled()) {
      return;
    }

    // If we don't have date and time, we can't calculate
    if (!date || !time) {
      if (isPriceVisible) {
        this.hidePriceEstimate();
      }
      return;
    }

    // Determine base rate based on date and time (for first 12km)
    const baseRate = this.determineBaseRate(date, time);

    // Calculate price with base fare + distance split
    let totalPrice = this.baseFare; // Start with base fare

    if (distance <= 12) {
      // Short distance: base fare + distance at base rate
      totalPrice += distance * baseRate;
    } else {
      // Long distance: base fare + first 12km at base rate + rest at €2.80/km
      const first12km = 12 * baseRate;
      const remainingKm = distance - 12;
      const remainingPrice = remainingKm * this.rates.longDistance;
      totalPrice += first12km + remainingPrice;
    }

    // Add passenger surcharge if applicable (from 5th passenger onwards)
    if (passengers >= 5 && this.passengerSurcharge[passengers]) {
      totalPrice += this.passengerSurcharge[passengers];
    }

    // Display the price
    this.showPriceEstimate(totalPrice);
  }

  areAllRequiredFieldsFilled() {
    const requiredFields = [
      "booking-name",
      "booking-email",
      "booking-phone",
      "booking-passengers",
      "booking-pickup",
      "booking-destination",
      "booking-date",
      "booking-time",
    ];

    for (const fieldId of requiredFields) {
      const field = document.getElementById(fieldId);
      if (!field || !field.value || field.value.trim() === "") {
        return false;
      }
    }

    return true;
  }

  determineBaseRate(dateString, timeString) {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const [hours, minutes] = timeString.split(":").map(Number);
    const timeInMinutes = hours * 60 + minutes;

    // Check if it's Sunday (any time = €2.50/km)
    if (dayOfWeek === 0) {
      return this.rates.night; // Sunday all day uses night rate
    }

    // Check if it's night time (20:00-06:00 = €2.50/km) on Mon-Sat
    if (timeInMinutes >= 20 * 60 || timeInMinutes < 6 * 60) {
      return this.rates.night;
    }

    // Default weekday rate (Mon-Sat 06:00-20:00 = €2.30/km)
    return this.rates.weekday;
  }

  showPriceEstimate(price) {
    if (!this.priceEstimateBox || !this.priceValueElement) {
      return;
    }

    // Format price
    const formattedPrice = this.formatPrice(price);

    this.priceValueElement.textContent = formattedPrice;
    this.priceEstimateBox.style.display = "block";
    this.priceEstimateBox.classList.add("show");

    // Store estimated price in hidden field for form submission
    const estimatedPriceField = document.getElementById(
      "booking-estimated-price",
    );
    if (estimatedPriceField) {
      estimatedPriceField.value = formattedPrice;
    }

    // Scroll to price estimate smoothly
    setTimeout(() => {
      this.priceEstimateBox.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  }

  hidePriceEstimate() {
    if (!this.priceEstimateBox) {
      return;
    }

    this.priceEstimateBox.style.display = "none";
    this.priceEstimateBox.classList.remove("show");

    // Clear estimated price from hidden field
    const estimatedPriceField = document.getElementById(
      "booking-estimated-price",
    );
    if (estimatedPriceField) {
      estimatedPriceField.value = "";
    }
  }

  formatPrice(price) {
    // Round to nearest 5 euros for estimate
    const roundedPrice = Math.ceil(price / 5) * 5;
    return `€${roundedPrice}`;
  }
}

// Initialize when script loads
const priceCalculator = new PriceCalculator();
