// Distance Calculator for Booking Forms
// Uses OpenStreetMap Nominatim API for geocoding (free, no API key required)

class DistanceCalculator {
  constructor(
    pickupInputId,
    destinationInputId,
    distanceDisplayId,
    distanceHiddenId,
  ) {
    this.pickupInput = document.getElementById(pickupInputId);
    this.destinationInput = document.getElementById(destinationInputId);
    this.distanceDisplay = document.getElementById(distanceDisplayId);
    this.distanceHidden = document.getElementById(distanceHiddenId);

    // Find the error message element
    this.errorElement = document.getElementById("location-error");
    this.errorMessageElement = document.getElementById(
      "location-error-message",
    );

    this.debounceTimer = null;
    this.calculatingTimer = null;
    this.lastPickup = "";
    this.lastDestination = "";
    this.isCalculating = false;
    this.init();
  }

  showLocationError(message) {
    console.log("⚠️ [DistanceCalculator] Showing location error:", message);
    if (this.errorElement && this.errorMessageElement) {
      this.errorMessageElement.textContent = message;
      this.errorElement.classList.add("show");
      this.errorElement.style.display = "flex";

      // Update the title text with current language
      const titleElement = this.errorElement.querySelector(
        '[data-i18n="booking_error_location_title"]',
      );
      if (titleElement && typeof window.t === "function") {
        titleElement.textContent = window.t("booking_error_location_title");
      }
    }
  }

  hideLocationError() {
    if (this.errorElement) {
      this.errorElement.classList.remove("show");
      this.errorElement.style.display = "none";
      console.log("✅ [DistanceCalculator] Location error hidden");
    }
  }

  init() {
    if (!this.pickupInput || !this.destinationInput) {
      console.warn(
        "⚠️ [DistanceCalculator] Missing required input elements, calculator not initialized",
      );
      return;
    }

    // Add event listeners with debounce
    this.pickupInput.addEventListener("input", () => {
      this.hideLocationError(); // Clear error when user types
      this.debounceCalculate();
    });
    this.destinationInput.addEventListener("input", () => {
      this.hideLocationError(); // Clear error when user types
      this.debounceCalculate();
    });
    this.pickupInput.addEventListener("blur", () => {
      this.calculateDistance();
    });
    this.destinationInput.addEventListener("blur", () => {
      this.calculateDistance();
    });
  }

  debounceCalculate() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.calculateDistance();
    }, 1000);
  }

  async geocodeAddress(address) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
          headers: {
            "User-Agent": "Taxi Comfort Booking System",
          },
        },
      );

      if (!response.ok) throw new Error("Geocoding failed");

      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  }

  calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  async calculateDistance() {
    const pickup = this.pickupInput?.value?.trim();
    const destination = this.destinationInput?.value?.trim();

    // Clear any pending "Calculating..." timer
    if (this.calculatingTimer) {
      clearTimeout(this.calculatingTimer);
      this.calculatingTimer = null;
    }

    // If fields are empty or too short, clear the display
    if (
      !pickup ||
      !destination ||
      pickup.length < 3 ||
      destination.length < 3
    ) {
      // Clear any error messages
      this.hideLocationError();

      if (this.distanceDisplay) {
        this.distanceDisplay.value = "";
        this.distanceDisplay.placeholder = "Auto-calculated";
        this.distanceDisplay.removeAttribute("title");
      }
      if (this.distanceHidden) {
        this.distanceHidden.value = "";
      }
      this.lastPickup = "";
      this.lastDestination = "";
      return;
    }

    // Don't recalculate if addresses haven't changed
    if (pickup === this.lastPickup && destination === this.lastDestination) {
      return;
    }

    // Update last calculated addresses
    this.lastPickup = pickup;
    this.lastDestination = destination;

    // Prevent multiple simultaneous calculations
    if (this.isCalculating) {
      return;
    }

    this.isCalculating = true;

    // Show "Calculating..." only after 300ms (if request takes longer)
    this.calculatingTimer = setTimeout(() => {
      if (this.distanceDisplay && this.isCalculating) {
        this.distanceDisplay.value = "Calculating...";
        this.distanceDisplay.style.color = "#999";
        this.distanceDisplay.removeAttribute("title");
      }
    }, 300);

    try {
      // Geocode both addresses
      const [pickupCoords, destCoords] = await Promise.all([
        this.geocodeAddress(pickup),
        this.geocodeAddress(destination),
      ]);

      // Check which location failed and show specific error
      if (!pickupCoords && !destCoords) {
        console.error("❌ [DistanceCalculator] Both locations not found");
        const errorMsg =
          typeof window.t === "function"
            ? window
                .t("booking_error_both")
                .replace("{pickup}", pickup)
                .replace("{destination}", destination)
            : `Could not find "${pickup}" or "${destination}". Please check the spelling and try again.`;
        this.showLocationError(errorMsg);
        throw new Error("Could not find both locations");
      } else if (!pickupCoords) {
        console.error("❌ [DistanceCalculator] Pick-up location not found");
        const errorMsg =
          typeof window.t === "function"
            ? window.t("booking_error_pickup").replace("{pickup}", pickup)
            : `Could not find pick-up location "${pickup}". Please check the spelling or try a more specific address.`;
        this.showLocationError(errorMsg);
        throw new Error("Could not find pick-up location");
      } else if (!destCoords) {
        console.error("❌ [DistanceCalculator] Destination not found");
        const errorMsg =
          typeof window.t === "function"
            ? window
                .t("booking_error_destination")
                .replace("{destination}", destination)
            : `Could not find destination "${destination}". Please check the spelling or try a more specific address.`;
        this.showLocationError(errorMsg);
        throw new Error("Could not find destination");
      }

      // If we got here, both locations were found - hide any previous errors
      this.hideLocationError();

      // Calculate straight-line distance
      const straightLineDistance = this.calculateHaversineDistance(
        pickupCoords.lat,
        pickupCoords.lon,
        destCoords.lat,
        destCoords.lon,
      );

      // Estimate actual driving distance (typically 30% longer than straight-line)
      const drivingDistance = straightLineDistance * 1.3;
      const roundedDistance = Math.round(drivingDistance);

      // Clear the "Calculating..." timer since we're done
      if (this.calculatingTimer) {
        clearTimeout(this.calculatingTimer);
        this.calculatingTimer = null;
      }

      // Update display with estimated driving distance
      if (this.distanceDisplay) {
        this.distanceDisplay.value = `~${roundedDistance} km`;
        this.distanceDisplay.style.color = "var(--secondary-color)";
        this.distanceDisplay.title = `Estimated driving distance (straight-line: ${Math.round(straightLineDistance)} km)`;
      }
      if (this.distanceHidden) {
        this.distanceHidden.value = roundedDistance;
      }

      // Trigger custom event for price calculation
      const event = new CustomEvent("distanceCalculated", {
        detail: {
          distance: roundedDistance,
          straightLine: Math.round(straightLineDistance),
          driving: roundedDistance,
        },
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error(
        "❌ [DistanceCalculator] Distance calculation error:",
        error,
      );

      // Clear the "Calculating..." timer
      if (this.calculatingTimer) {
        clearTimeout(this.calculatingTimer);
        this.calculatingTimer = null;
      }

      // Only show generic error if no specific error was already shown
      if (!this.errorElement || this.errorElement.style.display === "none") {
        if (this.distanceDisplay) {
          this.distanceDisplay.value = "";
          this.distanceDisplay.placeholder = "Unable to calculate";
          this.distanceDisplay.style.color = "#999";
          this.distanceDisplay.removeAttribute("title");
        }
      } else {
        // Specific location error is already shown, just clear the distance field
        if (this.distanceDisplay) {
          this.distanceDisplay.value = "";
          this.distanceDisplay.placeholder = "Fix location errors";
          this.distanceDisplay.style.color = "#999";
          this.distanceDisplay.removeAttribute("title");
        }
      }

      if (this.distanceHidden) {
        this.distanceHidden.value = "";
      }
    } finally {
      // Always reset the calculating flag
      this.isCalculating = false;
    }
  }
}

// Initialize when DOM is loaded

function initializeDistanceCalculators() {
  // Initialize for modern booking form
  const modernPickup = document.getElementById("booking-pickup");

  if (modernPickup) {
    new DistanceCalculator(
      "booking-pickup",
      "booking-destination",
      "booking-distance-display",
      "booking-distance",
    );
  } else {
    console.log(
      "[DistanceCalculator] Modern booking form not found on this page",
    );
  }

  // Initialize for old booking form (if exists)
  const oldPickup = document.getElementById("pickup");

  if (oldPickup) {
    new DistanceCalculator(
      "pickup",
      "destination",
      "distance-display",
      "distance",
    );
  } else {
    console.log("[DistanceCalculator] Old booking form not found on this page");
  }
}

// Try to initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  initializeDistanceCalculators();
});

// Also listen for booking section loaded event (for dynamically loaded forms)
document.addEventListener("bookingSectionLoaded", function () {
  initializeDistanceCalculators();
});
