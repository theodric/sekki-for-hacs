// sekki-card.js

class SekkiCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set hass(hass) {
        if (!this.content) {
            this.shadowRoot.innerHTML = `
                <style>
                    .card {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        width: 100%;
                        padding: 16px;
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    }
                    .image-container {
                        width: 25%;
                        height: auto;
                    }
                    .image-container img {
                        width: 100%;
                        height: auto;
                        border-radius: 8px;
                    }
                    .text-container {
                        width: 70%;
                        padding-left: 16px;
                    }
                    .title {
                        font-size: 1.5em;
                        font-weight: bold;
                    }
                    .description {
                        font-size: 1em;
                        margin-top: 8px;
                    }
                </style>
                <div class="card">
                    <div class="image-container">
                        <img id="sekki-image" src="" alt="Sekki Image">
                    </div>
                    <div class="text-container">
                        <div id="sekki-title" class="title">Loading...</div>
                        <div id="sekki-description" class="description">Please wait...</div>
                    </div>
                </div>
            `;
            this.content = true;
        }
        this.updateSekki();
    }

    async updateSekki() {
        const sekkiData = await fetch('/local/sekki/sekki.yaml')
            .then(response => response.text())
            .then(yamlText => jsyaml.load(yamlText))
            .catch(error => console.error('Error loading sekki data:', error));
        
        if (!sekkiData) return;

        const today = new Date();
        let currentSekki = sekkiData.find(sekki => {
            const startDate = new Date(sekki.start_date);
            const endDate = new Date(sekki.end_date);
            return today >= startDate && today <= endDate;
        });

        if (currentSekki) {
            this.shadowRoot.getElementById('sekki-title').textContent = currentSekki.name;
            this.shadowRoot.getElementById('sekki-description').textContent = currentSekki.description;
            this.shadowRoot.getElementById('sekki-image').src = `/local/sekki/images/${currentSekki.image}`;
        }
    }

    setConfig(config) {}
    getCardSize() { return 2; }
}

customElements.define('sekki-card', SekkiCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: 'sekki-card',
    name: 'Sekki Card',
    preview: false,
    description: 'Displays the current Japanese sekki (season).'
});

// Add HACS metadata
if (!customElements.get('sekki-card')) {
    customElements.define('sekki-card', SekkiCard);
}
