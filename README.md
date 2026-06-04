# Taxi Comfort Website

Professional taxi booking website for M & E Kaya OG (Taxi Comfort) - A reliable taxi service in Graz, Austria.

## 🚖 About

Taxi Comfort is a professional taxi service operating in Graz since 2009. This website provides information about the service, fleet, pricing, and allows customers to request bookings online.

## 📋 Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional interface with smooth animations
- **Booking System**: Interactive booking form with price calculator
- **Price Calculator**: Automatic fare estimation based on:
  - Distance
  - Date and time
  - Passenger count
  - Weekday/weekend rates
- **Fleet Information**: Display of all available vehicles
- **Contact Forms**: Easy-to-use contact and booking forms
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Multi-Language Support**: English, German (default), and Turkish

## 🌐 Multi-Language System

The website supports **3 languages** with automatic translation:

- 🇩🇪 **German (de)** - Default language
- 🇬🇧 **English (en)**
- 🇹🇷 **Turkish (tr)**

### How It Works

**1. Translation Files**

- `js/translations.js` - Contains all text in 3 languages
- Organized by translation keys: `hero_title`, `nav_home`, `feature_24h_title`, etc.
- Each key has translations in en/de/tr

**2. Translation System** (`js/includes.js`)

- `switchLanguage(lang)` - Changes displayed language
- `t(key)` - Retrieves translated text
- `updatePageTranslations()` - Updates all `[data-i18n]` elements
- Language preference saved to localStorage

**3. Language Switcher** (`includes/header.html`)

- EN / DE / TR buttons in navigation
- Active language highlighted in yellow (#fec719)
- Persists across page visits

### Adding Translations

To make text translatable, add the `data-i18n` attribute:

```html
<!-- Before -->
<h1>Willkommen bei Taxi Comfort</h1>

<!-- After -->
<h1 data-i18n="hero_title">Willkommen bei Taxi Comfort</h1>
```

The system automatically replaces text based on selected language.

### Translation Status

✅ **Completed:**

- Header navigation & language switcher
- Footer (all sections)
- Home: Hero, features, fleet/pricing titles, CTA
- About: Values section
- Booking: Main form labels
- Contact: Key form labels

⏳ **Remaining Work:**

- Fleet vehicle details on home page
- About page main content sections
- Additional booking form fields
- Contact page cards and FAQ

**To complete:** Add `data-i18n` attributes to remaining text elements using keys from `js/translations.js`

## 💰 Preisberechnung (Pricing Structure)

### Grundpreise pro Kilometer

#### 🕐 Wochentarif (Montag - Samstag, 06:00-20:00)

- **€2,30 pro km** für die ersten 12 km
- **€2,80 pro km** ab dem 12. Kilometer

#### 🌙 Nachttarif (Jeden Tag, 20:00-06:00)

- **€2,50 pro km** für die ersten 12 km
- **€2,80 pro km** ab dem 12. Kilometer

#### 🗓️ Sonntagstarif (Sonntag, ganztägig)

- **€2,50 pro km** für die ersten 12 km
- **€2,80 pro km** ab dem 12. Kilometer

### 👥 Personenzuschläge (ab 4. Person)

Der Zuschlag beginnt ab der **4. Person** mit **€2,70 pro zusätzliche Person**:

- **4 Personen**: +€2,70 (1 Person × €2,70)
- **5 Personen**: +€5,40 (2 Personen × €2,70)
- **6 Personen**: +€8,10 (3 Personen × €2,70)
- **7 Personen**: +€10,80 (4 Personen × €2,70)

_Gilt für alle SUV-Fahrzeuge und den 7-Sitzer_

---

### 🧮 Berechnungsbeispiele

#### Beispiel 1: Kurzstrecke Wochentag

**Fahrt:** 10 km am Montag um 14:00 Uhr, 2 Personen

```
10 km × €2,30 = €23,00
Keine Zuschläge
─────────────────
Gesamt: €23,00
```

#### Beispiel 2: Langstrecke Wochentag

**Fahrt:** 50 km am Dienstag um 10:00 Uhr, 3 Personen

```
Erste 12 km:    12 × €2,30 = €27,60
Restlich 38 km: 38 × €2,80 = €106,40
Keine Zuschläge
──────────────────────────
Gesamt: €134,00
```

#### Beispiel 3: Flughafen Graz → München

**Fahrt:** 405 km am Montag um 12:00 Uhr, 1 Person

```
Erste 12 km:     12 × €2,30 = €27,60
Restlich 393 km: 393 × €2,80 = €1.100,40
Keine Zuschläge
───────────────────────────
Gesamt: €1.128,00
```

#### Beispiel 4: Nachtfahrt mit Gruppe

**Fahrt:** 30 km am Freitag um 23:00 Uhr, 5 Personen

```
Erste 12 km:    12 × €2,50 = €30,00 (Nachttarif)
Restlich 18 km: 18 × €2,80 = €50,40
Personenzuschlag (5 Pers.): +€5,40
──────────────────────────
Gesamt: €85,80
```

#### Beispiel 5: Sonntagsfahrt

**Fahrt:** 25 km am Sonntag um 15:00 Uhr, 1 Person

```
Erste 12 km:    12 × €2,50 = €30,00 (Sonntagstarif)
Restlich 13 km: 13 × €2,80 = €36,40
Keine Zuschläge
──────────────────────────
Gesamt: €66,40
```

### 📐 Berechnungslogik (Implementierung)

```javascript
// 1. Basstarif ermitteln
function determineBaseRate(date, time) {
  if (isSunday(date)) return 2.50;           // Sonntag ganztags
  if (isNightTime(time)) return 2.50;        // 20:00-06:00
  return 2.30;                                // Wochentag 06:00-20:00
}

// 2. Preis berechnen
if (distance <= 12) {
  price = distance × baseRate;
} else {
  price = (12 × baseRate) + ((distance - 12) × 2.80);
}

// 3. Personenzuschlag hinzufügen
if (passengers >= 4) {
  price += passengerSurcharge[passengers];
}
```

### ⚠️ Wichtige Hinweise

- **Schätzpreise**: Die Website zeigt vorläufige Schätzungen
- **Finales Angebot**: Nach Buchung erhalten Sie ein detailliertes Angebot per Telefon/E-Mail
- **Langstrecken**: Bei Langstreckenfahrten kann der Preis verhandelt werden
- **MwSt.**: Alle Preise inkl. MwSt.
- **Rundung**: Angezeigte Preise auf nächste €5 aufgerundet
- **Entfernung**: Automatisch via OpenStreetMap API berechnet (Fahrtstrecke, nicht Luftlinie)

### 🧪 Testing

Öffnen Sie `test-price-calculator.html` für umfangreiche Tests:

- ✅ Alle Zeitzonenvarianten
- ✅ Kurzstrecken & Langstrecken
- ✅ Personenzuschläge
- ✅ Grenzwerte (05:59 vs 06:00, 19:59 vs 20:00)

## 📁 File Structure

```
taxicomfort/
├── index.html          # Home page with dynamic slideshow
├── about.html          # About us page
├── booking.html        # Booking form with price calculator
├── contact.html        # Contact page
├── includes/
│   ├── header.html     # Shared header/navigation with language switcher
│   ├── footer.html     # Shared footer
│   └── booking-section.html  # Reusable booking form
├── assets/
│   ├── logo.png       # Company logo
│   └── slide_show/     # Hero slideshow images (dynamic loading)
│       ├── manifest.json   # List of slideshow images
│       └── README.md       # Instructions for adding images
├── css/
│   └── style-modern.css    # Main stylesheet
└── js/
    ├── includes.js         # Header/footer loading & translation system
    ├── translations.js     # Translation data (en/de/tr)
    ├── main.js             # Forms, slideshow, scroll effects
    ├── distance-calculator.js  # Auto distance calculation
    └── price-calculator.js     # Automatic price estimation
```

## 🖼️ Dynamic Hero Slideshow

The homepage hero section features a **dynamic slideshow** that automatically loads images from the `assets/slide_show/` directory.

### How It Works

1. **Automatic Loading**: On page load, the system reads `assets/slide_show/manifest.json`
2. **Creates Slides**: Dynamically generates slide elements for each image
3. **Fallback**: If no images found, uses placeholder images from Unsplash

### Adding Your Own Images

**Step 1**: Add images to `assets/slide_show/` directory

- Recommended size: 1920×1080 or higher
- Format: `.jpg`, `.png`, `.png`
- Keep files under 500KB for fast loading

**Step 2**: Update `assets/slide_show/manifest.json`:

```json
{
  "images": ["taxi1.jpg", "taxi2.jpg", "graz-city.jpg", "mercedes.jpg"]
}
```

**Step 3**: Refresh the page - your images will appear!

### Benefits

- ✅ **No code changes needed** - just add images and update JSON
- ✅ **Any number of images** - not limited to 4 slides
- ✅ **Easy management** - no hardcoded URLs in HTML
- ✅ **Automatic fallback** - gracefully handles missing images

## 🔧 Architecture

The website uses a modular approach with reusable components:

- **Header/Footer Includes**: The navigation header and footer are stored in separate HTML files (`includes/header.html` and `includes/footer.html`) and loaded dynamically into each page using `includes.js`
- **Dynamic Slideshow**: Hero images loaded from `assets/slide_show/` via manifest.json
- **Benefits**:
  - Single source of truth for navigation and footer
  - Easy maintenance - update once, reflects on all pages
  - Automatic active page highlighting in navigation
  - Cleaner page structure

## 🚀 Getting Started

### Local Development

**Open the website**

- Simply open `index.html` in your web browser
- Or use a local server:

  ```bash
  # Python 3
  python3 -m http.server 8000
  ```

- Navigate to `http://localhost:8000`

## 🔧 Customization

### Updating Contact Information

Edit the footer section in all HTML files to update:

- Phone number (replace `+43 664 3588730`)
- Email address
- Physical address

### Modifying Prices

To change pricing, edit the rates in `js/price-calculator.js` and update the pricing tables in the HTML files.

### Adding/Updating Images

#### Hero Slideshow Images

1. Add your images to `assets/slide_show/` directory
2. Update `assets/slide_show/manifest.json` with the image filenames
3. That's it! No code changes needed.

See `assets/slide_show/README.md` for detailed instructions.

#### Other Images

- **Vehicle images**: Replace placeholder URLs in fleet sections
- **Company logo**: Update `assets/logo.png` or `assets/logo.png`

## 📧 Form Handling

Currently, forms show success messages in the browser. To enable actual email functionality, you need to:

1. Set up a backend server (PHP, Node.js, Python, etc.)
2. Create API endpoints for form submissions
3. Configure email service (SMTP, SendGrid, etc.)
4. Uncomment and modify the `fetch()` calls in `js/main.js`

### Example Backend Integration (Node.js/Express)

```javascript
// Uncomment the fetch sections in main.js and set up:
app.post("/api/booking", (req, res) => {
  // Send email with booking details
  sendEmail({
    to: "office@taxicomfort.at",
    subject: "New Booking Request",
    body: req.body,
  });
  res.json({ success: true });
});
```

## 🌐 Deployment

### GitHub Pages

1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select main branch
4. Website will be available at `username.github.io/taxicomfort`

### Custom Domain (taxicomfort.at)

1. Purchase domain from registrar
2. Point DNS to your hosting provider
3. Upload all files via FTP or hosting control panel
4. Configure SSL certificate for HTTPS

### Recommended Hosting Options

- **GitHub Pages**: Free, easy to set up
- **Netlify**: Free tier available, automatic deployments
- **Vercel**: Free tier available, excellent performance
- **Traditional Web Hosting**: Any provider supporting static websites

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility

- Semantic HTML5 elements
- Proper heading hierarchy
- Alt text for images
- ARIA labels where needed
- Keyboard navigation support

## 🎨 Design Features

- **Color Scheme**:
  - Primary: Yellow (#fec719) - CTAs, highlights, active states
  - Secondary: Black (#1a1a1a) - Text, headers, dark elements
  - Accent: Red (#ce0304) - Important highlights, warnings
- **Typography**: System fonts for fast loading
- **Animations**: Smooth transitions with max 0.3s duration for snappy feel
- **Hero Slideshow**: 4 taxi images with Ken Burns effect, 5-second intervals
- **Mobile-First**: Responsive breakpoints for all screen sizes

## 📞 Company Information

**M & E Kaya OG**  
Kärntnerstraße 212/37  
8053 Graz, Österreich  
UID: ATU82558634  
Website: taxicomfort.at  
Email: office@taxicomfort.at

## 📝 License

This website is proprietary and created for M & E Kaya OG.

## 🤝 Support

For any issues or questions regarding this website, please contact the development team.

---

new build.

**Built with ❤️ for Taxi Comfort**
