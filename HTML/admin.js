// Admin Panel für Quellenverwaltung
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

const form = document.getElementById('sourceForm');
const sourcesList = document.getElementById('sources-list');
const sourceCount = document.getElementById('source-count');

// Form absenden
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newSource = {
        id: Date.now(),
        title: document.getElementById('title').value,
        url: document.getElementById('url').value,
        category: document.getElementById('category').value || 'Allgemein',
        notes: document.getElementById('notes').value,
        date: new Date().toLocaleDateString('de-DE')
    };
    
    sources.unshift(newSource);
    saveSources();
    form.reset();
    document.getElementById('category').value = 'Allgemein';
    renderSources();
    alert('✅ Quelle hinzugefügt!');
});

// Quellen speichern
function saveSources() {
    localStorage.setItem('sources', JSON.stringify(sources));
}

// Quelle löschen
function deleteSource(id) {
    if (confirm('Willst du diese Quelle wirklich löschen?')) {
        sources = sources.filter(source => source.id !== id);
        saveSources();
        renderSources();
    }
}

// Quelle bearbeiten
function editSource(id) {
    const source = sources.find(s => s.id === id);
    if (source) {
        document.getElementById('title').value = source.title;
        document.getElementById('url').value = source.url;
        document.getElementById('category').value = source.category;
        document.getElementById('notes').value = source.notes;
        
        // Alte Quelle löschen
        sources = sources.filter(s => s.id !== id);
        saveSources();
        renderSources();
        
        // Focus auf Form
        document.getElementById('title').focus();
        alert('Quelle zum Bearbeiten geladen. Speichere sie neu ab um die Änderungen zu übernehmen.');
    }
}

// Form zurücksetzen
function resetForm() {
    form.reset();
    document.getElementById('category').value = 'Allgemein';
}

// Quellen anzeigen
function renderSources() {
    sourcesList.innerHTML = '';
    sourceCount.textContent = sources.length;
    
    if (sources.length === 0) {
        sourcesList.innerHTML = '<p style="color: #999; text-align: center;">Keine Quellen vorhanden</p>';
        return;
    }
    
    // Nach Datum sortieren (neueste zuerst)
    const sorted = [...sources].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sorted.forEach(source => {
        const item = document.createElement('div');
        item.className = 'source-list-item';
        item.innerHTML = `
            <h4>${source.title}</h4>
            <p><strong>URL:</strong> <a href="${source.url}" target="_blank">${source.url}</a></p>
            <p><strong>Kategorie:</strong> ${source.category}</p>
            ${source.notes ? `<p><strong>Notizen:</strong> ${source.notes}</p>` : ''}
            <p><strong>Hinzugefügt:</strong> ${source.date}</p>
            <div class="source-actions">
                <button class="btn btn-secondary" onclick="editSource(${source.id})">✏️ Bearbeiten</button>
                <button class="btn btn-danger" onclick="deleteSource(${source.id})">🗑️ Löschen</button>
            </div>
        `;
        sourcesList.appendChild(item);
    });
}

// Exportieren
function exportSources() {
    const json = JSON.stringify(sources, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quellen-backup-${new Date().toLocaleDateString('de-DE').replace(/\./g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Importieren
function importSources(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                sources = imported;
                saveSources();
                renderSources();
                alert('✅ Quellen erfolgreich importiert!');
            } else {
                alert('❌ Ungültiges JSON-Format!');
            }
        } catch (error) {
            alert('❌ Fehler beim Importieren: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Initial anzeigen
renderSources();