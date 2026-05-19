const API_KEY = '940c26b42959b383a408243b62a6e419';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_IMG = 'image/traveaux.avif';

class TMDBApi {
    static async fetchData(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}&api_key=${API_KEY}&language=fr-FR`);
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            return await response.json();
        } catch (error) { return null; }
    }

    static async getTrending(timeWindow = 'day') {
        return await this.fetchData(`/trending/movie/${timeWindow}?`);
    }
}

class UI {
    static displayCards(items, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        if (!items || items.length === 0) {
            container.innerHTML = '<p class="error-visible">Aucun résultat trouvé.</p>';
            return;
        }

        items.forEach(item => {
            if (item.media_type === 'person') return;
            const type = 'movie';
            const imageSrc = item.poster_path ? `${IMG_BASE_URL}${item.poster_path}` : FALLBACK_IMG;
            const date = item.release_date ? new Date(item.release_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date inconnue';
            const score = Math.round(item.vote_average * 10);

            const card = document.createElement('a');
            card.href = `new_page.html?id=${item.id}&type=${type}`;
            card.className = 'card';
            card.innerHTML = `
                <img src="${imageSrc}" alt="${item.title}" loading="lazy">
                <div class="card-content">
                    <div class="badge">${score > 0 ? score + '%' : 'NR'}</div>
                    <h3>${item.title}</h3>
                    <p>${date !== 'Invalid Date' ? date : 'Date inconnue'}</p>
                </div>
            `;
            container.appendChild(card);
        });
    }

    static showError(message, elementId) {
        const errorDiv = document.getElementById(elementId);
        if (errorDiv) { errorDiv.textContent = message; errorDiv.className = 'error-visible'; }
    }

    static hideError(elementId) {
        const errorDiv = document.getElementById(elementId);
        if (errorDiv) errorDiv.className = 'error-hidden';
    }
}

class App {
    static async init() { await this.initHomePage(); }

    static async initHomePage() { await this.loadTrending('day'); }

    static async loadTrending(timeWindow) {
        UI.hideError('error-message');
        const data = await TMDBApi.getTrending(timeWindow);
        if (data && data.results) {
            UI.displayCards(data.results, 'trending-results');
        } else {
            UI.showError("Oups, une erreur est survenue lors du chargement des tendances.", 'error-message');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => App.init());