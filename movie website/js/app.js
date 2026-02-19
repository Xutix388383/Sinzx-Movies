import { api } from './api.js';
import { CONFIG } from './config.js';

// --- State ---
const state = {
    currentRoute: 'home',
    movieId: null,
    searchQuery: ''
};

// --- DOM Elements ---
const app = document.getElementById('main-content');
const searchInput = document.getElementById('searchInput');

// --- Server Map (The "Secret Sauce") ---
const SERVERS = [
    { name: 'VidSrc.to', url: (id) => `https://vidsrc.to/embed/movie/${id}` },
    { name: 'VidSrc.pro', url: (id) => `https://vidsrc.pro/embed/movie/${id}` },
    { name: 'SuperEmbed', url: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1` },
    { name: '2Embed', url: (id) => `https://www.2embed.cc/embed/${id}` },
    { name: 'SmashyStream', url: (id) => `https://player.smashy.stream/movie/${id}` }
    // Add more from user list as needed
];

// --- Router ---
function router() {
    const hash = window.location.hash;

    if (hash.startsWith('#watch/')) {
        const id = hash.split('/')[1];
        renderWatchPage(id);
    } else if (hash.startsWith('#movie/')) {
        const id = hash.split('/')[1];
        renderDetailsPage(id);
    } else if (hash.startsWith('#search/')) {
        const query = decodeURIComponent(hash.split('/')[1]);
        renderSearchPage(query);
    } else {
        renderHomePage();
    }

    window.scrollTo(0, 0);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// --- Component Renderers ---

// 1. Home Page
async function renderHomePage() {
    app.innerHTML = '<div class="loading-spinner"></div>';

    const [trending, popular, topRated] = await Promise.all([
        api.getTrending(),
        api.getPopular(),
        api.getTopRated()
    ]);

    if (!trending) {
        app.innerHTML = '<div style="text-align:center; padding: 50px;"><h2>Please set your TMDB API Key in js/config.js</h2></div>';
        return;
    }

    const heroMovie = trending.results[0];

    // HTML Construction
    let html = `
        <!-- Hero Section -->
        <header class="hero">
            <img src="${CONFIG.IMAGE_BASE_URL}${heroMovie.backdrop_path}" class="hero-backdrop" alt="${heroMovie.title}">
            <div class="hero-content">
                <h1 class="hero-title">${heroMovie.title || heroMovie.name}</h1>
                <div class="hero-meta">
                    <span>${(heroMovie.release_date || heroMovie.first_air_date || '').split('-')[0]}</span>
                    <span class="rating"><i class="fas fa-star"></i> ${heroMovie.vote_average.toFixed(1)}</span>
                </div>
                <p class="hero-overview">${heroMovie.overview}</p>
                <div class="hero-actions">
                    <a href="#watch/${heroMovie.id}" class="btn btn-primary"><i class="fas fa-play"></i> Watch Now</a>
                    <a href="#movie/${heroMovie.id}" class="btn" style="background: rgba(255,255,255,0.1); color: white;">More Info</a>
                </div>
            </div>
        </header>

        <!-- Sections -->
        ${renderMovieRow('Trending Now', trending.results)}
        ${renderMovieRow('Popular Movies', popular.results)}
        ${renderMovieRow('Top Rated', topRated.results)}
    `;

    app.innerHTML = html;
}

// 2. Movie Row Helper
function renderMovieRow(title, movies) {
    if (!movies || movies.length === 0) return '';

    const cards = movies.map(movie => {
        if (!movie.poster_path) return '';
        return `
            <div class="movie-card" onclick="window.location.hash='#movie/${movie.id}'">
                <div class="poster-wrapper">
                    <img src="${CONFIG.POSTER_BASE_URL}${movie.poster_path}" loading="lazy" alt="${movie.title}">
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title || movie.name}</h3>
                    <div class="movie-meta">
                        <span>${(movie.release_date || movie.first_air_date || '').split('-')[0]}</span>
                        <span class="rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    return `
        <section>
            <h2 class="section-title">${title}</h2>
            <div class="movie-grid">
                ${cards}
            </div>
        </section>
    `;
}

// 3. Details Page
async function renderDetailsPage(id) {
    app.innerHTML = '<div class="loading-spinner"></div>';
    const movie = await api.getDetails(id);

    if (!movie) return;

    app.innerHTML = `
        <div class="hero" style="height: 60vh;">
            <img src="${CONFIG.IMAGE_BASE_URL}${movie.backdrop_path}" class="hero-backdrop">
            <div class="hero-content">
                <h1 class="hero-title">${movie.title}</h1>
                <div class="hero-meta">
                    <span>${movie.release_date.split('-')[0]}</span>
                    <span>${movie.runtime} min</span>
                    <span class="rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}</span>
                </div>
                <div class="genres" style="margin-bottom: 20px; color: var(--text-gray);">
                    ${movie.genres.map(g => g.name).join(', ')}
                </div>
                <p class="hero-overview">${movie.overview}</p>
                <a href="#watch/${movie.id}" class="btn btn-primary"><i class="fas fa-play"></i> Watch Movie</a>
            </div>
        </div>
        
        <div class="player-container">
             <h2 class="section-title">Cast</h2>
             <div class="movie-grid" style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));">
                ${movie.credits.cast.slice(0, 10).map(actor => `
                    <div class="cast-card" style="text-align: center;">
                        <img src="${CONFIG.POSTER_BASE_URL}${actor.profile_path}" style="width:100%; border-radius:10px; margin-bottom:10px;" onerror="this.src='https://via.placeholder.com/150'">
                        <p style="font-size: 0.9rem;">${actor.name}</p>
                        <p style="font-size: 0.8rem; color: var(--text-gray);">${actor.character}</p>
                    </div>
                `).join('')}
             </div>
        </div>
    `;
}

// 4. Watch Page (Player + Server Selector)
async function renderWatchPage(id) {
    app.innerHTML = '<div class="loading-spinner"></div>';
    // Ideally we fetch details to get the title, but for speed we just render logic
    // We can fetch details in background
    let movie = null;
    try {
        movie = await api.getDetails(id);
    } catch (e) { }

    // Default Server
    let currentServer = SERVERS[0];

    const html = `
        <div class="player-container" style="padding-top: 40px;">
            <div style="margin-bottom: 20px;">
                <h1 style="font-family: var(--font-heading);">${movie ? movie.title : 'Loading...'}</h1>
                <a href="#movie/${id}" style="color: var(--text-gray); font-size: 0.9rem;"><i class="fas fa-arrow-left"></i> Back to Details</a>
            </div>

            <!-- Video Player -->
            <div class="video-wrapper">
                <iframe id="videoIframe" src="${currentServer.url(id)}" allowfullscreen scrolling="no"></iframe>
            </div>

            <!-- Server Selector -->
            <div style="margin-top: 20px;">
                <h3 style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-server" style="color: var(--primary);"></i> Select Server
                </h3>
                <div class="server-list" id="serverList">
                    ${SERVERS.map((server, index) => `
                        <button class="server-btn ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <i class="fas fa-play-circle"></i> ${server.name}
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    app.innerHTML = html;

    // Attach Event Listeners for Server Switching
    const buttons = document.querySelectorAll('.server-btn');
    const iframe = document.getElementById('videoIframe');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            buttons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            // Switch Source
            const index = btn.dataset.index;
            const newServer = SERVERS[index];
            iframe.src = newServer.url(id);
        });
    });
}

// 5. Search Logic
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value;
        if (query) window.location.hash = `#search/${encodeURIComponent(query)}`;
    }
});

async function renderSearchPage(query) {
    app.innerHTML = '<div class="loading-spinner"></div>';
    const results = await api.search(query);

    if (!results || results.results.length === 0) {
        app.innerHTML = `<div style="text-align:center; padding:50px;"><h2>No results found for "${query}"</h2></div>`;
        return;
    }

    // Filter only movies/tv
    const filtered = results.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');

    app.innerHTML = renderMovieRow(`Search Results for "${query}"`, filtered);
}
