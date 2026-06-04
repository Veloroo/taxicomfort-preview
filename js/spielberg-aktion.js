// Spielberg Race Weekend Aktion — füllt Buchungsformular vor wenn ?aktion=spielberg
(function () {
  function activate() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('aktion') !== 'spielberg') return;

    var banner = document.getElementById('spielberg-aktion-banner');
    var aktionField = document.getElementById('booking-aktion');
    var subjectField = document.getElementById('booking-subject');
    var destination = document.getElementById('booking-destination');
    var pickup = document.getElementById('booking-pickup');
    var message = document.getElementById('booking-message');
    var dateField = document.getElementById('booking-date');

    if (!destination) return; // Booking-Section noch nicht im DOM

    if (banner) banner.style.display = 'flex';
    if (aktionField) aktionField.value = 'SPIELBERG RACE WEEKEND – €200 Fixpreis inkl. Maut (Graz → Spielberg)';
    if (subjectField) subjectField.value = '🏁 SPIELBERG-AKTION – Neue Buchungsanfrage (€200)';
    if (destination && !destination.value) destination.value = 'Red Bull Ring, Spielberg';
    if (pickup && !pickup.value) pickup.value = 'Hauptplatz 1, Graz';
    if (message && !message.value) {
      message.value = 'Buchung über Spielberg Race Weekend Aktion (€200 inkl. Maut).';
    }

    // Datum vorausfüllen: nächstes Race-Weekend
    // F1: 27.06.2026 (Sa) · MotoGP: 19.09.2026 (Sa)
    if (dateField && !dateField.value) {
      var today = new Date();
      var f1 = new Date('2026-06-27');
      var motogp = new Date('2026-09-19');
      var pick = today <= f1 ? f1 : (today <= motogp ? motogp : null);
      if (pick) {
        var iso = pick.toISOString().slice(0, 10);
        dateField.value = iso;
      }
    }

    // Sanft zum Formular scrollen
    setTimeout(function () {
      var section = document.querySelector('.booking-section-modern');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 350);
  }

  // Booking-Section wird via includes.js asynchron geladen → auf Event hören
  document.addEventListener('bookingSectionLoaded', activate);

  // Fallback falls Event schon gefeuert hat (z.B. cached)
  if (document.readyState === 'complete') {
    setTimeout(activate, 500);
  }
})();
