// Quellensammlung - Präsentations-Website
let sources = JSON.parse(localStorage.getItem('sources')) || [
    {
        id: 1,
        title: "Wikipedia",
        url: "https://de.wikipedia.org",
        category: "Allgemein",
        notes: "Kostenlose Online-Enzyklopädie",
        date: "16.01.2026"
    },
    {
        id: 2,
        title: "GitHub",
        url: "https://github.com",
        category: "Programmierung",
        notes: "Plattform für Softwareentwicklung",
        date: "16.01.2026"
    }
];

let activeCategory = 'Alle';

const container = document.getElementById('sources-container');
const navCategories = document.getElementById('nav-categories');

// Alle Kategorien abrufen
function getCategories() {
    const cats = [...new Set(sources.map(s => s.category))];
    return ['Alle', ...cats.sort()];
}

// Navigation rendern
function renderNavigation() {
    const categories = getCategories();
    navCategories.innerHTML = categories.map(cat => `
        <a href="#" class="nav-link ${cat === activeCategory ? 'active' : ''}" onclick="filterByCategory('${cat}'); return false;">
            ${cat}
        </a>
    `).join('');
}

// Nach Kategorie filtern
function filterByCategory(category) {
    activeCategory = category;
    renderNavigation();
    renderSources();
}

// Quellen anzeigen
function renderSources() {
    const filtered = activeCategory === 'Alle' 
        ? sources 
        : sources.filter(s => s.category === activeCategory);
    
    container.innerHTML = '';
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-message">Keine Quellen in dieser Kategorie</p>';
        return;
    }

    // Nach Kategorien gruppieren
    const grouped = {};
    filtered.forEach(source => {
        if (!grouped[source.category]) grouped[source.category] = [];
        grouped[source.category].push(source);
    });

    Object.entries(grouped).forEach(([category, items]) => {
        container.innerHTML += `<h2 class="category-heading">${category}</h2>`;
        items.forEach(source => {
            const sourceHTML = `
                <div class="source-item">
                    <div class="source-header">
                        <h3><a href="${source.url}" target="_blank">${source.title}</a></h3>
                    </div>
                    <a href="${source.url}" target="_blank" class="source-url">${source.url}</a>
                    ${source.notes ? `<p class="source-notes">${source.notes}</p>` : ''}
                    <small class="source-date">${source.date}</small>
                </div>
            `;
            container.innerHTML += sourceHTML;
        });
    });
}

// Initial rendern
renderNavigation();
renderSources();