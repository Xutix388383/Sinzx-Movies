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

    async getByGenre(genreId) {
        return await this._fetch('/discover/movie', { with_genres: genreId, sort_by: 'popularity.desc' });
    }

    async getSeason(tvId, seasonNumber) {
        return await this._fetch(`/tv/${tvId}/season/${seasonNumber}`);
    }

    async search(query) {
        return await this._fetch('/search/multi', { query });
    }

    // --- Live TV / M3U Logic ---

    async fetchM3U(url) {
        try {
            const res = await fetch(url);
            const text = await res.text();
            const channels = [];
            const lines = text.split('\n');

            let currentChannel = {};

            lines.forEach(line => {
                line = line.trim();
                if (line.startsWith('#EXTINF:')) {
                    // Parse metadata
                    const logoMatch = line.match(/tvg-logo="([^"]*)"/);
                    const groupMatch = line.match(/group-title="([^"]*)"/);
                    const nameParts = line.split(',');

                    currentChannel = {
                        name: nameParts[nameParts.length - 1].trim(),
                        logo: logoMatch ? logoMatch[1] : null,
                        group: groupMatch ? groupMatch[1] : 'Uncategorized'
                    };
                } else if (line.startsWith('http')) {
                    // URL line
                    if (currentChannel.name) {
                        currentChannel.url = line;
                        channels.push(currentChannel);
                        currentChannel = {};
                    }
                }
            });
            return channels;
        } catch (e) {
            console.error('M3U Fetch Error:', e);
            return [];
        }
    }

    async getLiveTV() {
        // US Channels
        const channels = await this.fetchM3U('https://iptv-org.github.io/iptv/countries/us.m3u');
        return channels;
    }

    async getSports() {
        const channels = await this.fetchM3U('https://iptv-org.github.io/iptv/categories/sports.m3u');
        return channels;
    }

    async getFights() {
        // Fetch sports and filter for fight keywords
        const sports = await this.getSports();
        const fightKeywords = ['fight', 'boxing', 'mma', 'wwe', 'ufc', 'wrestling', 'combat', 'kickbox'];

        return sports.filter(c => {
            const name = c.name.toLowerCase();
            const group = c.group.toLowerCase();
            return fightKeywords.some(k => name.includes(k) || group.includes(k));
        });
    }
}

export const api = new TMDB();
