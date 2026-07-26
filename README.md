
# 🌍 Country Info Explorer

A responsive, single-page web application that lets you explore detailed information and live weather for every country on Earth.

## ✨ Features
### 🔎 Search & Filter
- **Dual search bars** — one in the sticky navbar and one in the hero section; both support the **Enter** key.
- **Region filter buttons** — instantly browse countries by region: Africa, Americas, Asia, Europe, Oceania, and Antarctic.
- Results are sorted alphabetically when browsing by region.
<img width="998" height="900" alt="Screenshot 2026-04-11 005711" src="https://github.com/user-attachments/assets/30d279de-ceb1-47b6-9473-7e3a81c5b658" />
<img width="1919" height="971" alt="Screenshot 2026-04-11 005654" src="https://github.com/user-attachments/assets/fe6dd8d4-f5c5-47a8-bfb1-9adcad9ccaae" />
<img width="1842" height="907" alt="Screenshot 2026-04-11 005632" src="https://github.com/user-attachments/assets/b4f1499c-df11-48ff-8ab9-7e8b39b2bdd4" />
<img width="1919" height="970" alt="Screenshot 2026-04-11 005825" src="https://github.com/user-attachments/assets/280f05b5-8d40-4364-a20f-85772c15c7a9" />
<img width="1916" height="974" alt="Screenshot 2026-04-11 005803" src="https://github.com/user-attachments/assets/acdd7940-3084-4a7b-beec-bc120d927456" />
<img width="992" height="462" alt="Screenshot 2026-04-11 005719" src="https://github.com/user-attachments/assets/7ac7c442-3486-4b2b-939d-3d6d63df4e00" />

### 🗺️ Country Cards
Each result card displays:
| Field | Details |
|---|---|
| Flag | Full-width SVG flag image |
| Name | Common name + official name |
| Region | Region · Subregion |
| Population | Formatted number |
| Capital | First listed capital |
| Area | In km² |
| Languages | Up to 3 spoken languages |
| Currency | Name and symbol |

### 📋 Full Details Modal
Click **Full Details & Weather** on any card to open a scrollable modal with:

**General Information**
- Region, Subregion, Continent
- Capital, Population, Area, Landlocked status, Start of Week
- Languages, Currencies, Calling Code, Internet TLD
- Driving side, ISO codes (alpha-2 / alpha-3)
- Independent & UN Member status

**Timezones** — complete list of all timezones for the country.

**Bordering Countries** — ISO-3 badge list with count.

**Maps** — direct links to Google Maps and OpenStreetMap.

**Live Weather** (for the capital city):
- Condition with icon, Temperature (°C / °F), Feels Like (°C / °F)
- Humidity, Wind speed & direction, UV Index, Visibility, Pressure, Cloud Cover

### 🎨 UI / UX
- Animated hero section with gradient background.
- Hover-lift effect on country cards.
- Accessible loading spinners and error alerts.
- XSS-safe status messages using `textContent`.
- Fully **responsive** layout — works on mobile, tablet, and desktop.

---

## 📁 File Structure

```
/
├── index.html        # Page structure (navbar, hero, region filters, card grid, footer)
├── script.js         # Core logic: search, region filter, card rendering, detail modal
├── weather_api.js    # WeatherAPI integration (ES6 module export)
├── css/
│   └── style.css     # Custom styles (hero, cards, modal, weather box, responsive tweaks)
├── LICENSE
└── README.md
```

---

## 🛠️ Technologies

| Technology | Version | Purpose |
|---|---|---|
| HTML5 | — | Page structure |
| CSS3 | — | Custom styles |
| JavaScript | ES6 Modules | Dynamic behaviour |
| Bootstrap | 5.3.0 | Layout & UI components |
| Font Awesome | 6.4.0 | Icons |
| REST Countries API | v3.1 | Country data |
| WeatherAPI | current | Live weather data |

---

## 🌐 External APIs

| API | Endpoint | Usage |
|---|---|---|
| [REST Countries](https://restcountries.com) | `https://restcountries.com/v3.1/name/{name}` | Search by country name |
| [REST Countries](https://restcountries.com) | `https://restcountries.com/v3.1/region/{region}` | Browse by region |
| [WeatherAPI](https://www.weatherapi.com) | `https://api.weatherapi.com/v1/current.json` | Live weather for capital city |

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari).
- An active internet connection (required for CDN libraries and APIs).

### Run Locally

```bash
git clone https://github.com/neda420/Country-information-by-nadim.git
cd Country-information-by-nadim
```

Open `index.html` directly in your browser — no build step or server required.

> **Note:** `script.js` uses ES6 `import`/`export` (`type="module"`). Some browsers block module imports for local `file://` URLs. If the page doesn't work, serve it with a simple local server:
> ```bash
> # Python 3
> python -m http.server 8080
> # Then open http://localhost:8080
> ```

---

## 🔧 Development Guide

### Styles
Edit `css/style.css` to customise colours, spacing, or component appearance.
Key CSS sections: `Base`, `Navbar`, `Hero`, `Region Buttons`, `Cards`, `Info Grid`, `Modal`, `Weather Box`, `Responsive tweaks`.

### JavaScript
- **`script.js`** — add new card fields, change sorting, extend the detail modal, or add new API endpoints.  
  Always keep `type="module"` on the `<script>` tag in `index.html`.
- **`weather_api.js`** — update the `WEATHER_API_KEY` or swap in a different weather provider here.

### Adding a New Region Filter
1. Add a `<button class="btn btn-outline-primary region-btn" data-region="YourRegion">` in `index.html`.
2. The existing event listener in `script.js` will pick it up automatically.

---

## 📦 CDN Links

```html
<!-- Bootstrap CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

---

## 📄 License

This project is licensed under the terms of the [LICENSE](LICENSE) file in this repository.

---

## 👤 Credits

- **Md Nadimul Islam** — Creator and maintainer.
- [Bootstrap](https://getbootstrap.com) — CSS & JS framework.
- [Font Awesome](https://fontawesome.com) — Icon library.
- [REST Countries](https://restcountries.com) — Free country data API.
- [WeatherAPI](https://www.weatherapi.com) — Live weather data API.

