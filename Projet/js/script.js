const API_KEY = '940c26b42959b383a408243b62a6e419';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const IMG_ORIGINAL_URL = 'https://image.tmdb.org/t/p/original';
const FALLBACK_IMG = 'image/traveaux.avif';

class TMDBApi {
    static async fetchData(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}&api_key=${API_KEY}&language=fr-FR`);
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            return await response.json();
        } catch (error) { return null; }
    }

    static async getTrending(timeWindow = 'day') { return await this.fetchData(`/trending/movie/${timeWindow}?`); }
    static async getPopularMovies() { return await this.fetchData(`/movie/popular?`); }
    static async getTvShows(type = 'popular') { return await this.fetchData(`/tv/${type}?`); }
    static async searchMulti(query) { return await this.fetchData(`/search/multi?query=${encodeURIComponent(query)}`); }
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
            const isTv = (item.media_type === 'tv' || item.name !== undefined);
            const type = isTv ? 'tv' : 'movie';
            const title = isTv ? item.name : item.title;
            const dateRaw = isTv ? item.first_air_date : item.release_date;
            
            const imageSrc = item.poster_path ? `${IMG_BASE_URL}${item.poster_path}` : FALLBACK_IMG;
            const date = dateRaw ? new Date(dateRaw).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date inconnue';
            const score = Math.round(item.vote_average * 10);

            const card = document.createElement('a');
            card.href = `new_page.html?id=${item.id}&type=${type}`;
            card.className = 'card';
            card.innerHTML = `
                <img src="${imageSrc}" alt="${title}" loading="lazy">
                <div class="card-content">
                    <div class="badge">${score > 0 ? score + '%' : 'NR'}</div>
                    <h3>${title}</h3>
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
    static async init() {
        await this.initHomePage();
        this.initNavbar();
    }

    static initNavbar() {
        const navSeries = document.getElementById('nav-series');
        const navPopular = document.getElementById('nav-popular');

        if (navSeries) {
            navSeries.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.loadTvShows('popular', "Les Séries Populaires");
            });
        }

        if (navPopular) {
            navPopular.addEventListener('click', async (e) => {
                e.preventDefault();
                const data = await TMDBApi.getPopularMovies();
                if (data && data.results) {
                    this.showResultsSection("Les Films Populaires");
                    UI.displayCards(data.results, 'search-results');
                }
            });
        }
    }

    static async initHomePage() {
        await this.loadTrending('day');

        const trendingToggles = document.querySelectorAll('#trending-toggles button');
        trendingToggles.forEach(button => {
            button.addEventListener('click', async (e) => {
                trendingToggles.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                await this.loadTrending(e.target.dataset.time);
            });
        });

        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const query = document.getElementById('search-input').value;
                if (query.trim() !== '') {
                    const data = await TMDBApi.searchMulti(query);
                    this.showResultsSection(`Résultats pour "${query}"`);
                    if (data && data.results) {
                        UI.hideError('search-error-message');
                        UI.displayCards(data.results, 'search-results');
                    } else {
                        UI.showError("Impossible de charger les résultats.", 'search-error-message');
                    }
                }
            });
        }
    }

    static showResultsSection(title) {
        document.getElementById('trending-results').parentElement.style.display = 'none';
        const resultsSection = document.getElementById('results-section');
        const resultsTitle = document.getElementById('results-title');
        
        resultsSection.style.display = 'block';
        resultsTitle.textContent = title;
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    static async loadTrending(timeWindow) {
        UI.hideError('error-message');
        const data = await TMDBApi.getTrending(timeWindow);
        if (data && data.results) {
            UI.displayCards(data.results, 'trending-results');
        } else {
            UI.showError("Oups, une erreur est survenue lors du chargement des tendances.", 'error-message');
        }
    }

    static async loadTvShows(type, title) {
        const data = await TMDBApi.getTvShows(type);
        if (data && data.results) {
            this.showResultsSection(title);
            UI.hideError('search-error-message');
            UI.displayCards(data.results, 'search-results');
        } else {
            this.showResultsSection(title);
            UI.showError("Oups, une erreur est survenue.", 'search-error-message');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => App.init());