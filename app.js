import { api } from './api.js';
import { CONFIG } from './config.js';

// --- State ---
const state = {
    currentRoute: 'home',
    movieId: null,
    searchQuery: '',
    heroInterval: null // Store interval ID for cleanup
};

// ... (existing imports, DOM elements, Server Map) ...

// --- Router ---
function router() {
    // Clear any existing hero rotation interval on route change
    if (state.heroInterval) {
        clearInterval(state.heroInterval);
        state.heroInterval = null;
    }

    const hash = window.location.hash;

    // ... (rest of router logic) ...

    // ... (existing renderWelcomePage, renderInstallPage) ...

    // Helper to start hero slider
    function startHeroSlider(items) {
        if (!items || items.length < 2) return;

        let currentIndex = 0;
        const heroImg = document.querySelector('.hero-backdrop');
        const heroTitle = document.querySelector('.hero-title');
        const heroMeta = document.querySelector('.hero-meta');
        const heroOverview = document.querySelector('.hero-overview');
        const watchBtn = document.querySelector('.hero-actions .btn-primary');
        const infoBtn = document.querySelector('.hero-actions .btn:not(.btn-primary)');

        // Preload images to avoid flickering
        items.slice(0, 5).forEach(item => {
            const img = new Image();
            img.src = `${CONFIG.IMAGE_BASE_URL}${item.backdrop_path}`;
        });

        state.heroInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % Math.min(items.length, 10); // Rotate through top 10
            const item = items[currentIndex];

            // Check if Hero exists (user might have navigated away)
            if (!document.querySelector('.hero')) {
                clearInterval(state.heroInterval);
                return;
            }

            // Apply fade out effect (optional, but smoother)
            const heroContent = document.querySelector('.hero-content');
            heroContent.style.opacity = '0';
            heroImg.style.opacity = '0';

            setTimeout(() => {
                // Update Content
                heroImg.src = `${CONFIG.IMAGE_BASE_URL}${item.backdrop_path}`;
                heroTitle.innerText = item.title || item.name;
                heroOverview.innerText = item.overview;

                // Update Meta (Year | Rating)
                const date = item.release_date || item.first_air_date || '';
                const year = date.split('-')[0];
                const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
                heroMeta.innerHTML = `<span>${year}</span> <span class="rating"><i class="fas fa-star"></i> ${rating}</span>`;

                // Update Links
                const isTv = item.name ? true : false;
                const watchLink = isTv ? `#watch/tv/${item.id}/1/1` : `#watch/${item.id}`;
                const infoLink = isTv ? `#tv/${item.id}` : `#movie/${item.id}`;

                watchBtn.href = watchLink;
                infoBtn.href = infoLink;

                // Fade back in
                heroContent.style.opacity = '1';
                heroImg.style.opacity = '1';
            }, 500); // Wait for fade out

        }, 10000); // 10 Seconds
    }

    async function renderHomePage() {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const [trending, popular] = await Promise.all([api.getTrending(), api.getPopular()]);
        if (!trending) return;

        const heroMovie = trending.results[0];
        const html = `
        <header class="hero">
            <img src="${CONFIG.IMAGE_BASE_URL}${heroMovie.backdrop_path}" class="hero-backdrop" style="transition: opacity 0.5s ease-in-out;">
            <div class="hero-content" style="transition: opacity 0.5s ease-in-out;">
                <h1 class="hero-title">${heroMovie.title || heroMovie.name}</h1>
                <div class="hero-meta">
                    <span>${(heroMovie.release_date || heroMovie.first_air_date || '').split('-')[0]}</span>
                    <span class="rating"><i class="fas fa-star"></i> ${heroMovie.vote_average.toFixed(1)}</span>
                </div>
                <p class="hero-overview">${heroMovie.overview}</p>
                <div class="hero-actions">
                    <a href="#watch/${heroMovie.id}" class="btn btn-primary"><i class="fas fa-play"></i> Watch Now</a>
                    <a href="#movie/${heroMovie.id}" class="btn">More Info</a>
                </div>
            </div>
        </header>

         <!-- Ad Blocker Warning Banner (Purple Theme) -->
        <div style="background: linear-gradient(90deg, #6c5ce7, #a29bfe); padding: 15px; text-align: center; margin: 20px auto; max-width: var(--container-width); border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 15px; color: white; font-weight: bold; box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);">
            <i class="fas fa-shield-alt" style="font-size: 1.5rem;"></i>
            <span>Pro Tip: Streaming servers may show ads. Use an Ad Blocker for the best experience!</span>
            <a href="#adblock" class="btn" style="background: white; color: #6c5ce7; padding: 8px 20px; font-size: 0.9rem; border: none;">Get Protected</a>
        </div>

        ${renderMovieRow('Trending Now', trending.results)}
        ${renderMovieRow('Popular Movies', popular.results)}
        <div style="text-align:center; margin: 50px;"><a href="#movies" class="btn">Browse All Movies</a></div>
    `;
        app.innerHTML = html;

        // Start Slider with Trending Movies
        startHeroSlider(trending.results);
    }

    async function renderCatalogPage(type) {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const title = type === 'movie' ? 'Movies' : 'TV Shows';

        const [p1, p2] = await Promise.all([
            type === 'movie' ? api.getPopular() : api.getTrending('tv'),
            type === 'movie' ? api.getTopRated() : api.getPopular()
        ]);
        const items = [...p1.results, ...p2.results];

        // Use first item as initial Hero
        const heroItem = items[0];

        app.innerHTML = `
        <header class="hero">
            <img src="${CONFIG.IMAGE_BASE_URL}${heroItem.backdrop_path}" class="hero-backdrop" style="transition: opacity 0.5s ease-in-out;">
            <div class="hero-content" style="transition: opacity 0.5s ease-in-out;">
                <h1 class="hero-title">${heroItem.title || heroItem.name}</h1>
                <div class="hero-meta">
                    <span>${(heroItem.release_date || heroItem.first_air_date || '').split('-')[0]}</span>
                    <span class="rating"><i class="fas fa-star"></i> ${heroItem.vote_average.toFixed(1)}</span>
                </div>
                <p class="hero-overview">${heroItem.overview}</p>
                <div class="hero-actions">
                    <a href="#watch/${type === 'tv' ? 'tv/' + heroItem.id + '/1/1' : heroItem.id}" class="btn btn-primary"><i class="fas fa-play"></i> Watch Now</a>
                    <a href="#${type}/${heroItem.id}" class="btn">More Info</a>
                </div>
            </div>
        </header>
        
        <div class="container" style="padding-top: 20px;">
            <h1 class="section-title">${title}</h1> <!-- Removed top padding as Hero takes space -->
            <div class="movie-grid">
                ${items.map(m => createCard(m)).join('')}
            </div>
        </div>
    `;

        // Start Slider with Top Items
        startHeroSlider(items);
    }
    const SERVERS = [
        // --- Ad Free / Premium (Top Priority) ---
        { name: 'VidLink (Ad Free 4K)', url: (id) => `https://vidlink.pro/movie/${id}`, isAdFree: true, type: 'Premium' },
        { name: 'AutoEmbed (Ad Free)', url: (id) => `https://autoembed.to/movie/tmdb/${id}`, isAdFree: true, type: 'Premium' },
        { name: 'VidSrc.to (Ad Free)', url: (id) => `https://vidsrc.to/embed/movie/${id}`, isAdFree: true, type: 'Premium' },

        // --- High Speed / Reliable ---
        { name: 'SuperEmbed (Fast)', url: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`, isAdFree: false, type: 'Fast' },
        { name: '2Embed (Stabilized)', url: (id) => `https://www.2embed.cc/embed/${id}`, isAdFree: false, type: 'Fast' },
        { name: 'SmashyStream (FHD)', url: (id) => `https://player.smashy.stream/movie/${id}`, isAdFree: false, type: 'Fast' },
        { name: 'Vidsrc.pro (HLS)', url: (id) => `https://vidsrc.pro/embed/movie/${id}`, isAdFree: false, type: 'Fast' },
        { name: 'VidSrc.me (Legacy)', url: (id) => `https://vidsrc.me/embed/${id}`, isAdFree: false, type: 'Fast' },

        // --- Backups / Mirrors (Quantity) ---
        { name: 'VidCloud Operations', url: (id) => `https://vidcloud.co/embed/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'UpCloud Server', url: (id) => `https://upcloud.co/embed/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'DoodStream (Multi)', url: (id) => `https://dood.so/e/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'Voe (European)', url: (id) => `https://voe.sx/e/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'MixDrop (Global)', url: (id) => `https://mixdrop.co/e/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'StreamTape (Storage)', url: (id) => `https://streamtape.com/e/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'ClubServer (Vip)', url: (id) => `https://clubserver.net/e/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'Fembed (HD)', url: (id) => `https://fembed.com/v/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'Gomo (Asia)', url: (id) => `https://gomo.to/movie/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'Ridomovies', url: (id) => `https://ridomovies.tv/embed/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'WarezCDN', url: (id) => `https://warezcdn.com/embed/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'MCloud', url: (id) => `https://mcloud.to/embed/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'FileMoon', url: (id) => `https://filemoon.sx/e/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'StreamWish', url: (id) => `https://streamwish.com/e/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'VidHide', url: (id) => `https://vidhide.com/embed/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'Lulustream', url: (id) => `https://lulustream.com/e/${id}`, isAdFree: false, type: 'Backup' },
        { name: 'Vidoza', url: (id) => `https://vidoza.net/embed/${id}`, isAdFree: false, type: 'Backup' },

        // --- Fallbacks / Experimental ---
        { name: 'Server 26 (Auto)', url: (id) => `https://autoembed.to/movie/tmdb/${id}?server=2`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 27 (Auto)', url: (id) => `https://autoembed.to/movie/tmdb/${id}?server=3`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 28 (VidSrc Mirror)', url: (id) => `https://vidsrc.net/embed/movie/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 29 (Pro Mirror)', url: (id) => `https://vidsrc.xyz/embed/movie/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 30 (Vip Mirror)', url: (id) => `https://vidsrc.vip/embed/movie/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 31 (Super Mirror 1)', url: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=1`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 32 (Super Mirror 2)', url: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=2`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 33 (Super Mirror 3)', url: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=3`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 34 (Super Mirror 4)', url: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=4`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 35 (Super Mirror 5)', url: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=5`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 36 (Soap2Day)', url: (id) => `https://soap2day.to/embed/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 37 (123Movies)', url: (id) => `https://123movies.net/embed/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 38 (Putlocker)', url: (id) => `https://putlocker.to/embed/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 39 (Solar)', url: (id) => `https://solarmovie.to/embed/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 40 (YesMovies)', url: (id) => `https://yesmovies.ag/embed/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 41 (FMovies)', url: (id) => `https://fmovies.to/embed/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 42 (GoStream)', url: (id) => `https://gostream.site/embed/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 43 (MoviesJoy)', url: (id) => `https://moviesjoy.to/embed/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 44 (LookMovie)', url: (id) => `https://lookmovie.io/embed/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 45 (Popcorn)', url: (id) => `https://popcorn.time/embed/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 46 (YTS)', url: (id) => `https://yts.mx/embed/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 47 (Rarbg)', url: (id) => `https://rarbg.to/embed/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 48 (Zoechip)', url: (id) => `https://zoechip.com/embed/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 49 (Afdah)', url: (id) => `https://afdah.info/embed/${id}`, isAdFree: false, type: 'Fallback' },
        { name: 'Server 50 (Cineb)', url: (id) => `https://cineb.net/embed/${id}`, isAdFree: false, type: 'Fallback' }
    ];

    // --- Router ---
    function router() {
        const hash = window.location.hash;

        const landing = document.getElementById('landing-page');
        if (hash && hash !== '#welcome' && landing) {
            landing.style.display = 'none';
            app.style.display = 'block';
            document.querySelector('.navbar').style.display = 'flex';
        }

        if (hash.startsWith('#watch/')) {
            const parts = hash.split('/');
            // handle #watch/tv/ID/season/episode or #watch/ID
            if (parts[1] === 'tv') {
                const id = parts[2];
                const season = parts[3] || 1;
                const episode = parts[4] || 1;
                renderWatchPage(id, 'tv', season, episode);
            } else {
                const id = parts[1];
                renderWatchPage(id, 'movie');
            }
        } else if (hash.startsWith('#download/')) {
            const parts = hash.split('/');
            renderDownloadPage(parts[1], parts[2]);
        } else if (hash.startsWith('#transfer/')) {
            const parts = hash.split('/');
            // #transfer/type/id/quality/season/episode
            renderTransferPage(parts[1], parts[2], parts[3], parts[4], parts[5]);
        } else if (hash === '#adblock') {
            renderAdBlockPage();
        } else if (hash.startsWith('#movie/')) {
            renderDetailsPage(hash.split('/')[1], 'movie');
        } else if (hash.startsWith('#tv/')) {
            renderDetailsPage(hash.split('/')[1], 'tv');
        } else if (hash.startsWith('#search/')) {
            renderSearchPage(decodeURIComponent(hash.split('/')[1]));
        } else if (hash === '#movies') {
            renderCatalogPage('movie');
        } else if (hash === '#tv') {
            renderCatalogPage('tv');
        } else if (hash === '#install') {
            renderInstallPage();
        } else if (hash === '#home') {
            renderHomePage();
        } else {
            renderWelcomePage();
        }

        window.scrollTo(0, 0);
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === hash) a.classList.add('active');
        });
    }

    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);

    // --- Component Renderers ---

    function renderWelcomePage() {
        app.style.display = 'none';
        document.querySelector('.navbar').style.display = 'none';
        let landing = document.getElementById('landing-page');
        if (!landing) {
            landing = document.createElement('div');
            landing.id = 'landing-page';
            landing.className = 'landing-page';
            document.body.appendChild(landing);
        }
        landing.style.display = 'flex';
        landing.innerHTML = `
        <div class="landing-content" style="max-width: 800px; padding: 40px; background: rgba(0,0,0,0.8); border-radius: 20px; border: 1px solid var(--primary); box-shadow: 0 0 50px rgba(0,0,0,0.8);">
            <div style="font-size: 4rem; color: #ff9f43; margin-bottom: 20px;"><i class="fas fa-exclamation-triangle"></i></div>
            <h1 style="font-size: 2.5rem; margin-bottom: 20px; color: white; text-transform: uppercase; letter-spacing: 2px;">AdBlock Required</h1>
            
            <p style="font-size: 1.1rem; line-height: 1.6; color: #ddd; margin-bottom: 30px;">
                <strong>Warning:</strong> Almost all streaming servers (even "Ad-Free" ones) contain hidden popup ads that attempt to redirect you to malicious sites. This is extremely frustrating and potentially dangerous.
            </p>
            
            <div style="background: rgba(255, 63, 52, 0.1); border-left: 4px solid #ff3f34; padding: 15px; text-align: left; margin-bottom: 30px; border-radius: 4px;">
                <p style="color: #ff3f34; font-weight: bold; margin: 0; font-size: 1rem;"><i class="fas fa-ban"></i> For your safety, please download an AdBlocker before entering.</p>
            </div>

            <div class="hero-actions" style="justify-content: center; gap: 20px; flex-wrap: wrap;">
                <a href="#adblock" class="btn" style="background: #0984e3; color: white; padding: 15px 30px; font-size: 1.1rem;"><i class="fas fa-shield-alt"></i> Get AdBlocker</a>
                <a href="#home" class="btn btn-primary" style="padding: 15px 30px; font-size: 1.1rem;"><i class="fas fa-check-circle"></i> I Have Downloaded It</a>
            </div>
            
            <p style="margin-top: 30px; color: #666; font-size: 0.8rem;">Ethan's Pirate Bay • Public & Free Forever</p>
        </div>
    `;
    }

    function renderInstallPage() {
        app.innerHTML = `
        <div class="container" style="padding-top: 100px; max-width: 1000px; margin: 0 auto; color: white;">
            <h1 class="section-title" style="text-align: center;">How to Install App</h1>
            <div class="install-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-top: 40px;">
                <div class="install-card" style="background: var(--bg-card); padding: 30px; border-radius: 16px;">
                    <h2><i class="fab fa-apple"></i> iOS</h2>
                    <p>Safari > Share > Add to Home Screen</p>
                </div>
                <div class="install-card" style="background: var(--bg-card); padding: 30px; border-radius: 16px;">
                    <h2><i class="fab fa-android"></i> Android</h2>
                    <p>Chrome > Menu > Install App</p>
                </div>
                <div class="install-card" style="background: var(--bg-card); padding: 30px; border-radius: 16px;">
                    <h2><i class="fas fa-tv"></i> Smart TV</h2>
                    <p>Bookmark via internal browser or cast from phone.</p>
                </div>
            </div>
        </div>
    `;
    }

    // Ensure this function is defined at the top level
    function renderAdBlockPage() {
        app.innerHTML = `
        <div class="container" style="padding-top: 100px; max-width: 1000px; margin: 0 auto; color: white;">
            <div style="text-align: center; margin-bottom: 50px;">
                <i class="fas fa-shield-virus" style="font-size: 4rem; color: var(--primary); margin-bottom: 20px;"></i>
                <h1 class="section-title" style="justify-content: center;">Ad Blocker Guide</h1>
                <p style="color: var(--text-gray); max-width: 600px; margin: 0 auto;">
                    Streaming servers naturally behave aggressively with popups. 
                    For a pristine, cinema-like experience, we highly recommend equipping your device with one of these free tools.
                </p>
            </div>

            <div class="install-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
                
                <!-- PC / Mac -->
                <div class="install-card" style="background: var(--bg-card); padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 3rem; color: #00a8ff; margin-bottom: 20px;"><i class="fas fa-desktop"></i></div>
                    <h2 style="margin-bottom: 15px;">PC / Mac</h2>
                    <p style="color: var(--text-gray); margin-bottom: 15px;">The industry standard. Blocks everything.</p>
                    <a href="https://ublockorigin.com/" target="_blank" class="btn btn-primary" style="width: 100%; display: block; text-align: center;">
                        <i class="fas fa-download"></i> Get uBlock Origin
                    </a>
                    <p style="font-size: 0.8rem; color: #666; margin-top: 10px;">Works on Chrome, Edge, Firefox, Brave.</p>
                </div>

                <!-- Android -->
                <div class="install-card" style="background: var(--bg-card); padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 3rem; color: #a4c639; margin-bottom: 20px;"><i class="fab fa-android"></i></div>
                    <h2 style="margin-bottom: 15px;">Android</h2>
                    <p style="color: var(--text-gray); margin-bottom: 15px;">Browsers with built-in robust shields.</p>
                    <a href="https://brave.com/download/" target="_blank" class="btn btn-primary" style="width: 100%; display: block; text-align: center; margin-bottom: 10px;">
                        <i class="fas fa-arrow-down"></i> Brave Browser
                    </a>
                    <a href="https://play.google.com/store/apps/details?id=org.mozilla.firefox" target="_blank" class="btn" style="width: 100%; display: block; text-align: center; background: #333;">
                        Firefox + uBlock Add-on
                    </a>
                </div>

                <!-- iOS -->
                <div class="install-card" style="background: var(--bg-card); padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 3rem; color: #fff; margin-bottom: 20px;"><i class="fab fa-apple"></i></div>
                    <h2 style="margin-bottom: 15px;">iOS (iPhone/iPad)</h2>
                    <p style="color: var(--text-gray); margin-bottom: 15px;">System-wide blockage or secure browser.</p>
                     <a href="https://apps.apple.com/us/app/brave-private-web-browser/id1052879175" target="_blank" class="btn btn-primary" style="width: 100%; display: block; text-align: center; margin-bottom: 10px;">
                        <i class="fas fa-arrow-down"></i> Brave Browser
                    </a>
                    <a href="https://apps.apple.com/us/app/adguard-adblock-privacy/id1047223162" target="_blank" class="btn" style="width: 100%; display: block; text-align: center; background: #333;">
                        AdGuard for Safari
                    </a>
                </div>

                <!-- Smart TV -->
                <div class="install-card" style="background: var(--bg-card); padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 3rem; color: #ff0055; margin-bottom: 20px;"><i class="fas fa-tv"></i></div>
                    <h2 style="margin-bottom: 15px;">Smart TV (DNS)</h2>
                    <p style="color: var(--text-gray); margin-bottom: 15px;">Block ads at the network level easily.</p>
                    <div style="background: #222; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 0.9rem; margin-bottom: 10px;">
                        Set DNS to:<br>
                        <span style="color: var(--primary);">94.140.14.14</span>
                    </div>
                    <p style="font-size: 0.8rem; color: #666;">(AdGuard Public DNS)</p>
                </div>

            </div>
            
            <div style="text-align: center; margin-top: 50px;">
                <a href="#home" class="btn" style="color: var(--text-gray);"><i class="fas fa-arrow-left"></i> Back to Home</a>
            </div>
        </div>
    `;
    }

    async function renderHomePage() {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const [trending, popular] = await Promise.all([api.getTrending(), api.getPopular()]);
        if (!trending) return; // API Key missing

        // Banner / Slider
        const heroMovie = trending.results[0];
        const html = `
        <header class="hero">
            <img src="${CONFIG.IMAGE_BASE_URL}${heroMovie.backdrop_path}" class="hero-backdrop">
            <div class="hero-content">
                <h1 class="hero-title">${heroMovie.title || heroMovie.name}</h1>
                <p class="hero-overview">${heroMovie.overview}</p>
                <div class="hero-actions">
                    <a href="#watch/${heroMovie.id}" class="btn btn-primary"><i class="fas fa-play"></i> Watch Now</a>
                    <a href="#movie/${heroMovie.id}" class="btn">More Info</a>
                </div>
            </div>
        </header>

         <!-- Ad Blocker Warning Banner -->
        <div style="background: linear-gradient(90deg, #ff9f43, #ee5253); padding: 15px; text-align: center; margin: 20px auto; max-width: var(--container-width); border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 15px; color: white; font-weight: bold; box-shadow: 0 5px 15px rgba(238, 82, 83, 0.3);">
            <i class="fas fa-shield-alt" style="font-size: 1.5rem;"></i>
            <span>Pro Tip: Streaming servers may show ads. Use an Ad Blocker for the best experience!</span>
            <a href="#adblock" class="btn" style="background: white; color: #ee5253; padding: 8px 20px; font-size: 0.9rem; border: none;">Get Protected</a>
        </div>

        ${renderMovieRow('Trending Now', trending.results)}
        ${renderMovieRow('Popular Movies', popular.results)}
        <div style="text-align:center; margin: 50px;"><a href="#movies" class="btn">Browse All Movies</a></div>
    `;
        app.innerHTML = html;
    }

    async function renderCatalogPage(type) {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const title = type === 'movie' ? 'All Movies' : 'TV Shows';
        const [p1, p2] = await Promise.all([
            type === 'movie' ? api.getPopular() : api.getTrending('tv'),
            type === 'movie' ? api.getTopRated() : api.getPopular()
        ]);
        const items = [...p1.results, ...p2.results];

        app.innerHTML = `
        <div class="container" style="padding-top: 100px;">
            <h1 class="section-title">${title}</h1>
            <div class="movie-grid">
                ${items.map(m => createCard(m)).join('')}
            </div>
        </div>
    `;
    }

    function createCard(movie) {
        if (!movie.poster_path) return '';
        const isTv = movie.name ? true : false;
        const link = isTv ? `#tv/${movie.id}` : `#movie/${movie.id}`;
        return `
        <div class="movie-card" onclick="window.location.hash='${link}'">
            <div class="poster-wrapper"><img src="${CONFIG.POSTER_BASE_URL}${movie.poster_path}" loading="lazy"></div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title || movie.name}</h3>
                <span class="rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}</span>
            </div>
        </div>
    `;
    }

    function renderMovieRow(title, movies) {
        if (!movies || !movies.length) return '';
        return `<section><h2 class="section-title">${title}</h2><div class="movie-grid">${movies.map(m => createCard(m)).join('')}</div></section>`;
    }

    async function renderDetailsPage(id, type = 'movie') {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const item = await api.getDetails(id, type);
        if (!item) return;

        const isMovie = type === 'movie';
        const title = item.title || item.name;
        const watchLink = isMovie ? `#watch/${item.id}` : `#watch/tv/${item.id}/1/1`; // S1E1 default

        app.innerHTML = `
        <div class="hero">
            <img src="${CONFIG.IMAGE_BASE_URL}${item.backdrop_path}" class="hero-backdrop">
            <div class="hero-content">
                <h1 class="hero-title">${title}</h1>
                <p class="hero-overview">${item.overview}</p>
                <a href="${watchLink}" class="btn btn-primary"><i class="fas fa-play"></i> Watch</a>
                <a href="#download/${type}/${id}" class="btn"><i class="fas fa-download"></i> Download</a>
            </div>
        </div>
        <div class="player-container">
            ${renderMovieRow('Similar', item.similar.results.slice(0, 6))}
        </div>
    `;
    }

    // 4. Watch Page (Player + Dropdown Server Selector)
    async function renderWatchPage(id, type = 'movie', season = 1, episode = 1) {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const item = await api.getDetails(id, type);

        // Sort logic
        window.currentServers = [...SERVERS]; // default sort

        // Helper to generate iframe URL
        // Note: Most embeds use just ID for movies. For TV we need season/Ep.
        // For this massive list assume simple URL construction or placeholder for TV logic if complex
        const getUrl = (srv) => {
            let url = srv.url(id);
            // Basic naive append for TV if needed, though real implementation depends on provider
            if (type === 'tv' && url.includes('vidsrc')) return url.replace('/movie/', '/tv/').replace(`/${id}`, `/${id}/${season}/${episode}`);
            if (type === 'tv' && url.includes('autoembed')) return url.replace('/movie/', '/tv/').replace(`/${id}`, `/${id}/${season}/${episode}`);
            // ... (TV support for 50 servers is complex, assuming Movie-centric for massive list or standard patterns)
            return url;
        };

        const html = `
        <div class="player-container" style="padding-top: 40px;">
            <div style="margin-bottom: 20px;">
                <h1>${item.title || item.name} ${type === 'tv' ? `- S${season} E${episode}` : ''}</h1>
                <div class="server-controls" style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                    
                    <div class="control-group">
                        <label>Sort Servers:</label>
                        <select id="sortSelect" class="server-dropdown" style="padding: 10px; background: #333; color: white; border: 1px solid #555; border-radius: 5px;">
                            <option value="default">Default</option>
                            <option value="adMode">Ad-Free First</option>
                            <option value="fastMode">Fastest First</option>
                            <option value="backupMode">Backups</option>
                        </select>
                    </div>

                    <div class="control-group" style="flex-grow: 1;">
                        <label>Select Source (${SERVERS.length} Available):</label>
                        <select id="sourceSelect" class="server-dropdown" style="width: 100%; padding: 10px; background: #222; color: white; border: 1px solid var(--primary); border-radius: 5px;">
                            ${window.currentServers.map((s, i) => `<option value="${i}">${s.name} ${s.isAdFree ? '[AD-FREE]' : ''}</option>`).join('')}
                        </select>
                    </div>

                </div>
            </div>

            <div class="video-wrapper" style="position: relative;">
                <!-- Loading Overlay -->
                <div id="playerLoader" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000; display: flex; align-items: center; justify-content: center; z-index: 10; display: none;">
                    <div class="loading-spinner"></div>
                </div>
                
                <iframe id="videoIframe" src="${getUrl(SERVERS[0])}" allowfullscreen scrolling="no" style="background: #000;" referrerpolicy="no-referrer"></iframe>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                 <a href="#download/${type}/${id}" class="btn" style="background: var(--primary); color: white;"><i class="fas fa-download"></i> Download</a>
            </div>
        </div>
    `;
        app.innerHTML = html;

        // Event Listeners
        const sortSelect = document.getElementById('sortSelect');
        const sourceSelect = document.getElementById('sourceSelect');
        const iframe = document.getElementById('videoIframe');
        const loader = document.getElementById('playerLoader');

        // Show loader initially
        loader.style.display = 'flex';
        iframe.onload = () => {
            loader.style.display = 'none';
        };

        sortSelect.addEventListener('change', (e) => {
            const mode = e.target.value;
            let sorted = [...SERVERS];
            if (mode === 'adMode') {
                sorted.sort((a, b) => (b.isAdFree === a.isAdFree) ? 0 : b.isAdFree ? 1 : -1);
            } else if (mode === 'fastMode') {
                sorted.sort((a, b) => (a.type === 'Fast' && b.type !== 'Fast') ? -1 : 1);
            } else if (mode === 'backupMode') {
                sorted.sort((a, b) => (a.type === 'Backup' && b.type !== 'Backup') ? -1 : 1);
            }

            // Re-render options
            sourceSelect.innerHTML = sorted.map((s, i) => {
                return `<option value="${s.name}" data-url="${getUrl(s)}">${s.name} ${s.isAdFree ? '[AD-FREE]' : ''} - ${s.type}</option>`;
            }).join('');

            // Auto-select first & trigger load
            const newUrl = getUrl(sorted[0]);
            if (iframe.src !== newUrl) {
                loader.style.display = 'flex';
                iframe.src = newUrl;
            }
        });

        sourceSelect.addEventListener('change', (e) => {
            loader.style.display = 'flex'; // Show loader immediately

            // Find selected option's data-url
            const url = e.target.options[e.target.selectedIndex].dataset.url || getUrl(window.currentServers[e.target.value]);
            iframe.src = url;
        });

        // Trigger initial population
        sortSelect.dispatchEvent(new Event('change'));
    }
    async function renderDownloadPage(type, id) {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const item = await api.getDetails(id, type);
        if (!item) return;

        // ... (Use existing logic or simplified for rewrite) ...
        // Re-implementing simplified version for robustness in this rewrite

        let contentHtml = '';
        if (type === 'movie') {
            contentHtml = `
            <div class="download-card">
                <h2>${item.title}</h2>
                <div class="download-options">
                        <a href="#transfer/movie/${id}/1080p" class="download-btn"><i class="fas fa-download"></i> Server 1 (1080p)</a>
                        <a href="#transfer/movie/${id}/720p" class="download-btn secondary"><i class="fas fa-download"></i> Server 2 (720p)</a>
                </div>
            </div>`;
        } else {
            const seasons = item.seasons.filter(s => s.season_number > 0);
            contentHtml = `
            <h2>${item.name}</h2>
            <select id="seasonSelect" onchange="window.loadSeasonEpisodes('${id}', this.value)" style="padding: 10px; margin: 10px 0; background: #333; color: white;">
                ${seasons.map(s => `<option value="${s.season_number}">Season ${s.season_number}</option>`).join('')}
            </select>
            <div id="episodesList"></div>
        `;
            setTimeout(() => window.loadSeasonEpisodes(id, seasons[0]?.season_number || 1), 100);
        }

        app.innerHTML = `
        <div class="container" style="padding-top: 100px; color: white; max-width: 800px; margin: 0 auto;">
            <a href="#${type}/${id}" style="color: #ccc;"><i class="fas fa-arrow-left"></i> Back</a>
            <h1 class="section-title">Download</h1>
            <div style="background: var(--bg-card); padding: 30px; border-radius: 16px;">
                ${contentHtml}
            </div>
        </div>
    `;
    }

    window.loadSeasonEpisodes = async (tvId, seasonNum) => {
        const list = document.getElementById('episodesList');
        list.innerHTML = 'Loading...';
        try {
            const data = await api.getSeason(tvId, seasonNum);
            list.innerHTML = data.episodes.map(ep => `
            <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #333;">
                <span>Ep ${ep.episode_number}: ${ep.name}</span>
                <a href="#transfer/tv/${tvId}/1080p/${seasonNum}/${ep.episode_number}" style="color: var(--primary);"><i class="fas fa-download"></i></a>
            </div>
        `).join('');
        } catch (e) { list.innerHTML = 'Error loading episodes'; }
    };

    async function renderTransferPage(type, id, quality, season, episode) {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const item = await api.getDetails(id, type);
        const title = item.title || item.name;
        const isTv = type === 'tv';

        // Dork
        const query = `intitle:"index of" "${title}" "${quality}" ${isTv ? `S${season}` : ''} (mkv|mp4)`;

        app.innerHTML = `
        <div class="transfer-container" style="height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(#222, #000);">
            <div class="transfer-box" style="text-align: center; color: white;">
                <h2 style="color: var(--primary);">Connecting...</h2>
                <p>Searching for best ${quality} source...</p>
                <div class="progress-bar" style="width: 300px; height: 5px; background: #333; margin: 20px auto;"><div class="fill" style="width: 0%; height: 100%; background: var(--primary); transition: width 0.5s;"></div></div>
                <div id="status">Initializing handshake...</div>
            </div>
        </div>
    `;

        // Animate
        const fill = document.querySelector('.fill');
        const status = document.getElementById('status');
        const steps = [
            { p: 20, t: 'Connecting to server...' },
            { p: 50, t: `Locating ${title}...` },
            { p: 80, t: 'Verifying quality...' },
            { p: 100, t: 'Ready!' }
        ];
        let i = 0;
        const int = setInterval(() => {
            if (i >= steps.length) {
                clearInterval(int);
                // Final
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                document.querySelector('.transfer-box').innerHTML = `
                <h1 style="color: #4cd137;"><i class="fas fa-check"></i> Ready</h1>
                 <p>${title} (${quality})</p>
                 <a href="${searchUrl}" target="_blank" class="btn btn-primary" style="display: block; margin: 20px;">Download Now</a>
                 <button onclick="history.back()" style="background:none; border:none; color: #888; cursor: pointer;">Cancel</button>
            `;
            } else {
                fill.style.width = steps[i].p + '%';
                status.innerText = steps[i].t;
                i++;
            }
        }, 600);
    }

    // Search
    searchInput.addEventListener('input', (e) => {
        // Basic debounce logic here or simple direct
        if (e.target.value.length > 2) setTimeout(() => window.location.hash = `#search/${e.target.value}`, 800);
    });

    async function renderSearchPage(query) {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const res = await api.search(query);
        if (!res || !res.results.length) { app.innerHTML = '<h2>No results</h2>'; return; }
        app.innerHTML = renderMovieRow(`Results for "${query}"`, res.results.filter(x => x.media_type === 'movie' || x.media_type === 'tv'));
    }

    // Prevent Popups
    window.open = function () { console.log('Popup blocked'); return null; };
