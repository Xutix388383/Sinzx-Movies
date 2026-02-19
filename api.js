import { CONFIG } from './config.js';

class TMDB {
    constructor() {
        this.baseURL = CONFIG.TMDB_BASE_URL;
        this.apiKey = CONFIG.TMDB_API_KEY;
    }

    async _fetch(endpoint, params = {}) {
        if (this.apiKey === 'YOUR_TMDB_API_KEY_HERE') {
            console.warn('API Key not set. Please update js/config.js');
            // Return mock data or error? For now, we'll let it fail but handle it in UI
        }

        const url = new URL(`${this.baseURL}${endpoint}`);
        url.searchParams.append('api_key', this.apiKey);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    async getTrending(type = 'movie', timeWindow = 'week') {
        return await this._fetch(`/trending/${type}/${timeWindow}`);
    }

    async getPopular() {
        return await this._fetch('/movie/popular');
    }

    async getTopRated() {
        return await this._fetch('/movie/top_rated');
    }

    async getUpcoming() {
        return await this._fetch('/movie/upcoming');
    }

    async getDetails(id, type = 'movie') {
        return await this._fetch(`/${type}/${id}`, { append_to_response: 'credits,similar,videos' });
    }

    async search(query) {
        return await this._fetch('/search/multi', { query });
    }
}

export const api = new TMDB();
