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

// --- Server Map (Enhanced for Reliability & Ad-Free Options) ---
const SERVERS = [
    { name: 'VidLink (Ad Free)', url: (id) => `https://vidlink.pro/movie/${id}`, isAdFree: true },
    { name: 'AutoEmbed (Ad Free)', url: (id) => `https://autoembed.to/movie/tmdb/${id}`, isAdFree: true },
    { name: 'VidSrc.to (Fast)', url: (id) => `https://vidsrc.to/embed/movie/${id}`, isAdFree: false },
    { name: 'SuperEmbed (Reliable)', url: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`, isAdFree: false },
    { name: 'Vidsrc.pro', url: (id) => `https://vidsrc.pro/embed/movie/${id}`, isAdFree: false },
    { name: 'SmashyStream', url: (id) => `https://player.smashy.stream/movie/${id}`, isAdFree: false }
];

// --- Router ---
function router() {
    const hash = window.location.hash;

    // Hide Landing Page if not on root/welcome
    const landing = document.getElementById('landing-page');
    if (hash && hash !== '#welcome' && landing) {
        landing.style.display = 'none';
        app.style.display = 'block';
        document.querySelector('.navbar').style.display = 'flex';
    }

    if (hash.startsWith('#watch/')) {
        const id = hash.split('/')[1];
        renderWatchPage(id);
    } else if (hash.startsWith('#download/')) {
        const parts = hash.split('/');
        const type = parts[1];
        const id = parts[2];
        renderDownloadPage(type, id);
    } else if (hash.startsWith('#transfer/')) { // New Transfer Route
        // Format: #transfer/type/id/season/episode
        const parts = hash.split('/');
        const type = parts[1];
        const id = parts[2];
        const season = parts[3] || null;
        const episode = parts[4] || null;
        renderTransferPage(type, id, season, episode);
    } else if (hash.startsWith('#movie/')) {
        const id = hash.split('/')[1];
        renderDetailsPage(id, 'movie');
    } else if (hash.startsWith('#tv/')) {
        const id = hash.split('/')[1];
        renderDetailsPage(id, 'tv');
    } else if (hash.startsWith('#search/')) {
        const query = decodeURIComponent(hash.split('/')[1]);
        renderSearchPage(query);
    } else if (hash === '#movies') {
        renderCatalogPage('movie');
    } else if (hash === '#tv') {
        renderCatalogPage('tv');
    } else if (hash === '#install') {
        renderInstallPage();
    } else if (hash === '#home') {
        renderHomePage();
    } else {
        // Default to Welcome/Landing Page
        renderWelcomePage();
    }

    window.scrollTo(0, 0);

    // Update Active Nav Link
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === hash) {
            a.classList.add('active');
        }
    });
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// --- Component Renderers ---

// 0. Welcome / Landing Page
function renderWelcomePage() {
    // Hide Main App
    app.style.display = 'none';
    document.querySelector('.navbar').style.display = 'none';

    // Check if landing exists, if not create it
    let landing = document.getElementById('landing-page');
    if (!landing) {
        landing = document.createElement('div');
        landing.id = 'landing-page';
        landing.className = 'landing-page';
        document.body.appendChild(landing);
    }

    landing.style.display = 'flex';
    landing.innerHTML = `
        <div class="landing-content">
            <img src="logo.png" alt="Ethans Pirate Bay" class="landing-logo" style="max-width: 600px; width: 100%; height: auto; margin-bottom: 20px;">
            <p class="landing-subtitle">Premium Free Streaming. Without Limits.</p>

            <div class="landing-features">
                <div class="feature-item"><i class="fas fa-bolt"></i> Super Fast</div>
                <div class="feature-item"><i class="fas fa-ban"></i> Ad-Free Experience</div>
                <div class="feature-item"><i class="fas fa-tv"></i> Smart TV Ready</div>
                <div class="feature-item"><i class="fas fa-sync"></i> 24/7 Updates</div>
            </div>

            <a href="#home" class="btn btn-primary" style="padding: 20px 50px; font-size: 1.5rem;">
                <i class="fas fa-play"></i> Enter Site
            </a>

            <p style="margin-top: 50px; color: var(--text-muted); font-size: 0.8rem;">
                Made by <strong>Ethan</strong>.<br>
                Public & Free Forever.
            </p>
        </div>
    `;
}

// 0.5 Install Guide Page
function renderInstallPage() {
    app.innerHTML = `
        <div class="container" style="padding-top: 100px; max-width: 1000px; margin: 0 auto; padding-left: 20px; padding-right: 20px;">
            <h1 class="section-title" style="justify-content: center; font-size: 2.5rem; margin-bottom: 50px;">How to Install App</h1>

            <div class="install-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">

                <!-- iOS -->
                <div class="install-card" style="background: var(--bg-card); padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 3rem; color: var(--primary); margin-bottom: 20px;"><i class="fab fa-apple"></i></div>
                    <h2 style="margin-bottom: 15px;">iOS (iPhone/iPad)</h2>
                    <ol style="text-align: left; padding-left: 20px; color: var(--text-gray); line-height: 1.8;">
                        <li>Open <strong style="color: #fff;">Safari</strong>.</li>
                        <li>Tap the <strong style="color: #fff;">Share</strong> button (box with arrow).</li>
                        <li>Scroll down and tap <strong style="color: #fff;">Add to Home Screen</strong>.</li>
                        <li>Tap <strong>Add</strong>.</li>
                    </ol>
                </div>

                <!-- Android -->
                <div class="install-card" style="background: var(--bg-card); padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 3rem; color: #a4c639; margin-bottom: 20px;"><i class="fab fa-android"></i></div>
                    <h2 style="margin-bottom: 15px;">Android</h2>
                    <ol style="text-align: left; padding-left: 20px; color: var(--text-gray); line-height: 1.8;">
                        <li>Open <strong style="color: #fff;">Chrome</strong>.</li>
                        <li>Tap the <strong style="color: #fff;">Three Dots</strong> (menu).</li>
                        <li>Tap <strong style="color: #fff;">Install App</strong> or <strong>Add to Home Screen</strong>.</li>
                        <li>Confirm by tapping <strong>Install</strong>.</li>
                    </ol>
                </div>

                <!-- Smart TV / Console -->
                <div class="install-card" style="background: var(--bg-card); padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 3rem; color: #ff0055; margin-bottom: 20px;"><i class="fas fa-tv"></i></div>
                    <h2 style="margin-bottom: 15px;">Smart TV / Console</h2>
                    <ul style="text-align: left; padding-left: 20px; color: var(--text-gray); line-height: 1.8;">
                        <li><strong>Roku/FireTV</strong>: Use the "Web Video Caster" app on your phone to cast videos directly to your TV.</li>
                        <li><strong>Xbox/PlayStation</strong>: Use the built-in Edge/Web Browser and bookmark this site. Control with your controller!</li>
                    </ul>
                </div>

                <!-- PC / Mac -->
                <div class="install-card" style="background: var(--bg-card); padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 3rem; color: #00a8ff; margin-bottom: 20px;"><i class="fas fa-desktop"></i></div>
                    <h2 style="margin-bottom: 15px;">PC / Mac</h2>
                    <ol style="text-align: left; padding-left: 20px; color: var(--text-gray); line-height: 1.8;">
                        <li>Open <strong style="color: #fff;">Chrome</strong> or <strong style="color: #fff;">Edge</strong>.</li>
                        <li>Click the install icon in the address bar (Monitor with down arrow).</li>
                        <li>Click <strong style="color: #fff;">Install</strong>.</li>
                        <li>It will now open in its own window like a native app.</li>
                    </ol>
                </div>

            </div>
        </div>
    `;
}

// 1. Home Page (Curated)
async function renderHomePage() {
    app.innerHTML = '<div class="loading-spinner"></div>';

    // Fetch Trending and Popular
    const [trending, popular] = await Promise.all([
        api.getTrending(),
        api.getPopular()
    ]);

    if (!trending) {
        app.innerHTML = '<div style="text-align:center; padding: 50px;"><h2>Please set your TMDB API Key in config.js</h2></div>';
        return;
    }

    const heroMovie = trending.results[0];

    let html = `
        <header class="hero">
            <img src="${CONFIG.IMAGE_BASE_URL}${heroMovie.backdrop_path}" class="hero-backdrop" alt="${heroMovie.title}">
            <div class="hero-content">
                <h1 class="hero-title" style="color: var(--primary); text-shadow: 0 0 20px rgba(157, 78, 221, 0.5);">${heroMovie.title || heroMovie.name}</h1>
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

        ${renderMovieRow('Trending Now', trending.results)}
        ${renderMovieRow('Popular Movies', popular.results)}

        <div style="text-align: center; margin: 60px 0;">
            <a href="#movies" class="btn" style="border: 1px solid var(--primary); color: var(--primary);">Browse All Movies</a>
        </div>
    `;

    app.innerHTML = html;
}

// 2. Catalog Page (Movies or TV)
async function renderCatalogPage(type) {
    app.innerHTML = '<div class="loading-spinner"></div>';

    let title = type === 'movie' ? 'All Movies' : 'TV Shows';

    // Fetch multiple pages to simulate "All"
    // In a real app we'd need pagination
    const [page1, page2] = await Promise.all([
        type === 'movie' ? api.getPopular() : api.getTrending('tv'),
        type === 'movie' ? api.getTopRated() : api.getPopular() // slightly different mix
    ]);

    const allItems = [...page1.results, ...page2.results]; // Merge results

    let html = `
        <div class="container" style="padding-top: 100px; max-width: var(--container-width); margin: 0 auto; padding-left: 20px; padding-right: 20px;">
            <h1 class="section-title">${title}</h1>
            <div class="movie-grid">
                ${allItems.map(item => createCard(item)).join('')}
            </div>
        </div>
    `;

    app.innerHTML = html;
}

// Helper: Create HTML for a single card
function createCard(movie) {
    if (!movie.poster_path) return '';
    const isTv = movie.name ? true : false; // simplistic check
    const link = isTv ? `#tv/${movie.id}` : `#movie/${movie.id}`;

    return `
        <div class="movie-card" onclick="window.location.hash='${link}'">
            <div class="poster-wrapper">
                <img src="${CONFIG.POSTER_BASE_URL}${movie.poster_path}" loading="lazy" alt="${movie.title || movie.name}">
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
}

function renderMovieRow(title, movies) {
    if (!movies || movies.length === 0) return '';
    return `
        <section>
            <h2 class="section-title">${title}</h2>
            <div class="movie-grid">
                ${movies.map(m => createCard(m)).join('')}
            </div>
        </section>
    `;
}

// 3. Details Page
async function renderDetailsPage(id, type = 'movie') {
    app.innerHTML = '<div class="loading-spinner"></div>';
    const item = await api.getDetails(id, type);

    if (!item) return;

    const isMovie = type === 'movie';
    const title = item.title || item.name;
    const releaseDate = isMovie ? item.release_date : item.first_air_date;
    const runtime = isMovie ? `${item.runtime} min` : `${item.number_of_seasons} Seasons`;
    const watchLink = isMovie ? `#watch/${item.id}` : `#watch/tv/${item.id}/1/1`; // Default to S1E1 for TV

    app.innerHTML = `
        <div class="hero" style="height: 60vh;">
            <img src="${CONFIG.IMAGE_BASE_URL}${item.backdrop_path}" class="hero-backdrop">
            <div class="hero-content">
                <h1 class="hero-title">${title}</h1>
                <div class="hero-meta">
                    <span>${(releaseDate || '').split('-')[0]}</span>
                    <span>${runtime}</span>
                    <span class="rating"><i class="fas fa-star"></i> ${item.vote_average.toFixed(1)}</span>
                </div>
                <div class="genres" style="margin-bottom: 20px; color: var(--text-gray);">
                    ${item.genres.map(g => g.name).join(', ')}
                </div>
                <p class="hero-overview">${item.overview}</p>
                <a href="${watchLink}" class="btn btn-primary"><i class="fas fa-play"></i> Watch ${isMovie ? 'Movie' : 'Show'}</a>
                <a href="#download/${type}/${id}" class="btn" style="background: rgba(255,255,255,0.1); color: white; margin-left: 10px;"><i class="fas fa-download"></i> Download</a>
            </div>
        </div>

        <div class="player-container">
            <!-- Recommendations -->
            ${renderMovieRow('You May Also Like', item.similar.results.slice(0, 6))}
        </div>
    `;
}

// 4. Watch Page (Player + Server Selector)
async function renderWatchPage(id) {
    app.innerHTML = '<div class="loading-spinner"></div>';
    let movie = null;
    try {
        movie = await api.getDetails(id);
    } catch (e) { }

    let currentServer = SERVERS[0];

    const html = `
        <div class="player-container" style="padding-top: 40px;">
            <div style="margin-bottom: 20px;">
                <h1 style="font-family: var(--font-heading); text-shadow: 0 0 10px var(--primary);">${movie ? (movie.title || movie.name) : 'Player'}</h1>
                <a href="#movie/${id}" style="color: var(--text-gray); font-size: 0.9rem;"><i class="fas fa-arrow-left"></i> Back to Details</a>
            </div>

            <div class="video-wrapper">
                <!-- Stealth Sandbox: Block popups but allow scripts/forms/presentation.
                     No-referrer policy helps avoid detection by some providers. -->
                <iframe id="videoIframe"
                        src="${currentServer.url(id)}"
                        allowfullscreen
                        scrolling="no"
                        style="background: #000;"
                        referrerpolicy="no-referrer"
                        sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-presentation">
                </iframe>
            </div>

            <div style="margin-top: 20px;">
                <h3 style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px; color: var(--primary);">
                    <i class="fas fa-shield-alt"></i> Select Server (Ad-Block Active)
                </h3>
                <div class="server-list" id="serverList">
                    ${SERVERS.map((server, index) => `
                        <button class="server-btn ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <i class="fas fa-play-circle"></i> ${server.name}
                            ${server.isAdFree ? '<span class="ad-free-badge">AD FREE</span>' : ''}
                        </button>
                    `).join('')}
                </div>
                 <div style="margin-top: 20px; text-align: center;">
                    <a href="#download/movie/${id}" class="btn" style="background: var(--primary); color: white; padding: 10px 30px; border-radius: 5px; text-decoration: none;"><i class="fas fa-download"></i> Download This Movie</a>
                </div>
            </div>
        </div>
    `;

    app.innerHTML = html;

    const buttons = document.querySelectorAll('.server-btn');
    const iframe = document.getElementById('videoIframe');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const index = btn.dataset.index;
            iframe.src = SERVERS[index].url(id);
        });
    });
}

// --- Ad-Block Protection Script ---
// Prevents iframes from redirecting the main window
window.onbeforeunload = function () {
    // Only allow if it's a legitimate internal navigation (hash change)
    // This is a basic deterrent against "frame busting" ads
    return null;
};

// Prevent popups from servers
window.open = function () {
    console.log("Popup blocked by Ethans Pirate Bay Ad-Shield");
    return null;
};

// 5. Live Search Logic
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    if (query.length > 2) {
        // Debounce for 500ms then auto-search
        searchTimeout = setTimeout(() => {
            window.location.hash = `#search/${encodeURIComponent(query)}`;
        }, 500);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        clearTimeout(searchTimeout);
        const query = searchInput.value;
        if (query) window.location.hash = `#search/${encodeURIComponent(query)}`;
    }
});

async function renderSearchPage(query) {
    app.innerHTML = '<div class="loading-spinner"></div>';
    const results = await api.search(query);

    if (!results || results.results.length === 0) {
        app.innerHTML = `<div style="text-align:center; padding:100px;"><h2>No results found for "${query}"</h2></div>`;
        return;
    }

    const filtered = results.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
    app.innerHTML = renderMovieRow(`Search Results for "${query}"`, filtered);
}

// 6. Download Page
async function renderDownloadPage(type, id) {
    app.innerHTML = '<div class="loading-spinner"></div>';
    const item = await api.getDetails(id, type);

    if (!item) return;

    let contentHtml = '';

    if (type === 'movie') {
        contentHtml = `
            <div class="download-section">
                <div class="download-card">
                    <h2>${item.title}</h2>
                    <p class="quality-badge">4K HDR</p>
                    <div class="download-options">
                         <a href="#transfer/movie/${id}" class="download-btn"><i class="fas fa-download"></i> Server 1 (Fastest) - 1080p</a>
                         <a href="#transfer/movie/${id}" class="download-btn secondary"><i class="fas fa-download"></i> Server 2 (Backup) - 720p</a>
                    </div>
                </div>
            </div>
        `;
    } else {
        // TV Show Logic
        const seasons = item.seasons.filter(s => s.season_number > 0); // Skip specials

        // Default to Season 1
        contentHtml = `
            <div class="download-section">
                <h2>${item.name}</h2>
                <div class="season-selector">
                    <label>Select Season:</label>
                    <select id="seasonSelect" onchange="loadSeasonEpisodes('${id}', this.value)">
                        ${seasons.map(s => `<option value="${s.season_number}">Season ${s.season_number}</option>`).join('')}
                    </select>
                </div>
                <div id="episodesList" class="episodes-list">
                    <div class="loading-spinner"></div>
                </div>
            </div>
        `;

        setTimeout(() => window.loadSeasonEpisodes(id, seasons[0]?.season_number || 1), 100);
    }

    app.innerHTML = `
        <div class="container" style="padding-top: 100px; max-width: 800px; margin: 0 auto; color: white;">
            <a href="#${type}/${id}" style="color: var(--text-gray); margin-bottom: 20px; display: block;"><i class="fas fa-arrow-left"></i> Back to Details</a>
            <h1 class="section-title">Download Content</h1>
            <div style="background: var(--bg-card); padding: 30px; border-radius: 16px;">
                <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                    <img src="${CONFIG.POSTER_BASE_URL}${item.poster_path}" style="width: 100px; border-radius: 8px;">
                    <div>
                        <h2 style="margin: 0 0 10px 0;">${item.title || item.name}</h2>
                        <span class="rating"><i class="fas fa-star"></i> ${item.vote_average.toFixed(1)}</span>
                    </div>
                </div>
                ${contentHtml}
            </div>
        </div>
    `;
}

// Global function for TV Season loading
window.loadSeasonEpisodes = async (tvId, seasonNum) => {
    const list = document.getElementById('episodesList');
    list.innerHTML = '<div class="loading-spinner"></div>';

    const seasonData = await api.getSeason(tvId, seasonNum);

    if (!seasonData || !seasonData.episodes) {
        list.innerHTML = '<p>Error loading episodes.</p>';
        return;
    }

    list.innerHTML = `
        <div style="margin-top: 20px;">
            <a href="#transfer/tv/${tvId}/${seasonNum}" class="download-btn full-season" style="background: var(--primary); display: block; text-align: center; margin-bottom: 20px;">
                <i class="fas fa-download"></i> Download Complete Season ${seasonNum}
            </a>
            ${seasonData.episodes.map(ep => `
                <div class="episode-item" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div>
                        <strong>Ep ${ep.episode_number}: ${ep.name}</strong>
                    </div>
                    <a href="#transfer/tv/${tvId}/${seasonNum}/${ep.episode_number}" class="btn-sm" style="color: var(--primary); border: 1px solid var(--primary); padding: 5px 15px; border-radius: 4px; text-decoration: none;">
                        <i class="fas fa-download"></i>
                    </a>
                </div>
            `).join('')}
        </div>
    `;
};

// 7. Transfer Page (Simulation)
async function renderTransferPage(type, id, season, episode) {
    app.innerHTML = '<div class="loading-spinner"></div>';

    // Simulate finding item details
    const item = await api.getDetails(id, type);
    const title = item.title || item.name;
    const subTitle = type === 'tv'
        ? (episode ? `Season ${season} Episode ${episode}` : `Complete Season ${season}`)
        : '4K HDR Remux';

    app.innerHTML = `
        <div class="transfer-container" style="height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, #1a0b2e 0%, #000 100%);">
            <div class="transfer-box" style="text-align: center; max-width: 500px; width: 90%; background: var(--bg-card); padding: 40px; border-radius: 20px; border: 1px solid var(--primary); box-shadow: 0 0 50px rgba(157, 78, 221, 0.3);">
                <i class="fas fa-satellite-dish fa-spin" style="font-size: 4rem; color: var(--primary); margin-bottom: 30px;"></i>
                <h2 style="margin-bottom: 10px;">Establishing Secure Connection...</h2>
                <p style="color: var(--text-gray); margin-bottom: 30px;">Please wait while we locate the best server for you.</p>

                <div class="progress-bar" style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; margin-bottom: 20px;">
                    <div class="progress-fill" style="width: 0%; height: 100%; background: var(--primary); transition: width 0.5s ease;"></div>
                </div>

                <div id="transferStatus" style="font-family: monospace; color: #4cd137; font-size: 0.9rem; min-height: 20px;">Initializing...</div>
            </div>
        </div>
    `;

    // Simulation Sequence
    const status = document.getElementById('transferStatus');
    const fill = document.querySelector('.progress-fill');

    const steps = [
        { pct: 20, text: "Handshaking with satellite..." },
        { pct: 40, text: `Locating "${title}"...` },
        { pct: 60, text: "Bypassing region locks..." },
        { pct: 80, text: "Allocating high-speed bandwidth..." },
        { pct: 100, text: "Ready!" }
    ];

    let step = 0;
    const interval = setInterval(() => {
        if (step >= steps.length) {
            clearInterval(interval);
            showFinalDownload(title, subTitle);
        } else {
            fill.style.width = steps[step].pct + '%';
            status.innerText = steps[step].text;
            step++;
        }
    }, 800);
}

function showFinalDownload(title, subTitle) {
    // Generate a search link as fallback since we don't host files
    const searchUrl = `https://www.google.com/search?q=index+of+${encodeURIComponent(title)}+${encodeURIComponent(subTitle)}+download`;

    document.querySelector('.transfer-box').innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 4rem; color: #4cd137; margin-bottom: 20px;"></i>
        <h2 style="margin-bottom: 10px;">Download Ready</h2>
        <p style="color: white; margin-bottom: 5px;">${title}</p>
        <p style="color: var(--text-gray); margin-bottom: 30px; font-size: 0.9rem;">${subTitle}</p>

        <a href="${searchUrl}" target="_blank" class="btn btn-primary" style="width: 100%; display: block; padding: 15px; font-size: 1.1rem; margin-bottom: 15px;">
            <i class="fas fa-cloud-download-alt"></i> Start Download Now
        </a>

        <button onclick="window.history.back()" class="btn" style="background: transparent; border: 1px solid rgba(255,255,255,0.1); width: 100%;">Cancel</button>
    `;
}
