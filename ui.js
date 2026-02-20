import { api } from './api.js';
import { CONFIG } from './config.js';
import { SERVERS } from './servers.js';
import { Auth } from './auth.js';

let app = document.getElementById('main-content');
let heroInterval = null;

export const UI = {
    setApp(element) {
        app = element;
    },

    clearHeroInterval() {
        if (heroInterval) {
            clearInterval(heroInterval);
            heroInterval = null;
        }
    },

    renderLoginPage() {
        app.innerHTML = `
        <div class="container" style="padding-top: 100px; max-width: 500px; margin: 0 auto; color: white; text-align: center;">
            <h1 class="section-title">Who is watching?</h1>
            
            <div id="user-list" style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-bottom: 40px;">
                ${Auth.getUsers().map(u => `
                    <div onclick="window.loginUser('${u.name}')" style="cursor: pointer; text-align: center;">
                        <div style="width: 100px; height: 100px; background: #333; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 10px; border: 2px solid transparent; transition: border 0.3s;">
                            ${u.name[0].toUpperCase()}
                        </div>
                        <span>${u.name}</span>
                    </div>
                `).join('')}
                
                <div onclick="document.getElementById('create-user-form').style.display='block'" style="cursor: pointer; text-align: center;">
                    <div style="width: 100px; height: 100px; background: #222; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 10px; border: 2px solid #555;">
                        <i class="fas fa-plus"></i>
                    </div>
                    <span>Add Profile</span>
                </div>
            </div>

            <div id="create-user-form" style="display: none; background: #222; padding: 20px; border-radius: 10px;">
                <input type="text" id="new-username" placeholder="Name" style="padding: 10px; border-radius: 5px; border: none; width: 70%; margin-right: 10px;">
                <button onclick="window.createUser()" class="btn btn-primary">Save</button>
            </div>
        </div>
        `;

        // Globals for inline calls
        window.loginUser = (name) => Auth.login(name);
        window.createUser = () => {
            const name = document.getElementById('new-username').value;
            if (name) Auth.createUser(name);
        };
    },

    renderWelcomePage() {
        // ... (Keep existing gatekeeper logic, but maybe redirect to login if gatekeeper passed?)
        // For now, keep as is.
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
                <a href="#login" class="btn btn-primary" style="padding: 15px 30px; font-size: 1.1rem;"><i class="fas fa-check-circle"></i> I Have Downloaded It</a>
            </div>
            
            <p style="margin-top: 30px; color: #666; font-size: 0.8rem;">Ethan's Pirate Bay • Public & Free Forever</p>
        </div>
        `;
    },

    renderInstallPage() {
        // ... (No change)
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
    },

    renderAdBlockPage() {
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
    },

    async renderHomePage() {
        app.innerHTML = '<div class="loading-spinner"></div>';

        // Auth check
        const user = Auth.getCurrentUser();
        if (!user) {
            window.location.hash = '#login';
            return;
        }

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
        
        <div style="background: #222; padding: 10px; text-align: right; color: #aaa; font-size: 0.9rem;">
            Logged in as <strong>${user.name}</strong> • <a href="#" onclick="event.preventDefault(); Auth.logout();" style="color: white; margin-left:10px;">Switch User</a>
        </div>

         <!-- Ad Blocker Warning Banner (Purple Theme) -->
        <div style="background: linear-gradient(90deg, #6c5ce7, #a29bfe); padding: 15px; text-align: center; margin: 20px auto; max-width: var(--container-width); border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 15px; color: white; font-weight: bold; box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);">
            <i class="fas fa-shield-alt" style="font-size: 1.5rem;"></i>
            <span>Pro Tip: Streaming servers may show ads. Use an Ad Blocker for the best experience!</span>
            <a href="#adblock" class="btn" style="background: white; color: #6c5ce7; padding: 8px 20px; font-size: 0.9rem; border: none;">Get Protected</a>
        </div>
        
        ${user.history && user.history.length > 0 ? createMovieRow(`Continue Watching (${user.name})`, user.history) : ''}
        ${createMovieRow('Trending Now', trending.results)}
        ${createMovieRow('Popular Movies', popular.results)}
        <div style="text-align:center; margin: 50px;"><a href="#movies" class="btn">Browse All Movies</a></div>
        `;

        // Add logout global
        window.Auth = Auth;

        app.innerHTML = html;
        startHeroSlider(trending.results);
    },

    async renderCatalogPage(type) {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const title = type === 'movie' ? 'Movies' : 'TV Shows';
        const [p1, p2] = await Promise.all([
            type === 'movie' ? api.getPopular() : api.getTrending('tv'),
            type === 'movie' ? api.getTopRated() : api.getPopular()
        ]);
        const items = [...p1.results, ...p2.results];
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
            <h1 class="section-title">${title}</h1>
            <div class="movie-grid">
                ${items.map(m => createCard(m)).join('')}
            </div>
        </div>
        `;
        startHeroSlider(items);
    },

    async renderDetailsPage(id, type = 'movie') {
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
            ${createMovieRow('Similar', item.similar.results.slice(0, 6))}
        </div>
        `;
    },

    async renderWatchPage(id, type = 'movie', season = 1, episode = 1) {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const item = await api.getDetails(id, type);
        const user = Auth.getCurrentUser();

        // Save to History
        if (item) {
            Auth.addToHistory({
                id: id,
                type: type,
                title: type === 'tv' ? `${item.name} S${season}:E${episode}` : item.title,
                poster_path: item.poster_path,
                backdrop_path: item.backdrop_path
            });
        }

        window.currentServers = [...SERVERS];

        // Helper to generate iframe URL
        const getUrl = (srv) => {
            if (type === 'tv' && srv.tvUrl) return srv.tvUrl(id, season, episode);
            return srv.url(id);
        };

        // Helper to render options consistently
        const renderOptions = (list) => {
            return list.map((s, i) =>
                `<option value="${i}" data-url="${getUrl(s)}">${s.name} ${s.isAdFree ? '[AD-FREE]' : ''} - ${s.type}</option>`
            ).join('');
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
                            ${renderOptions(SERVERS)}
                        </select>
                    </div>

                </div>
            </div>

            <div class="video-wrapper" style="position: relative;">
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

        const sortSelect = document.getElementById('sortSelect');
        const sourceSelect = document.getElementById('sourceSelect');
        const iframe = document.getElementById('videoIframe');
        const loader = document.getElementById('playerLoader');

        loader.style.display = 'flex';

        // Timeout logic: If iframe takes > 8s, hide loader and show warning (optional)
        const loadTimeout = setTimeout(() => {
            if (loader.style.display !== 'none') {
                loader.style.display = 'none';
                console.warn('Server load timed out (visual only).');
            }
        }, 8000);

        iframe.onload = () => {
            clearTimeout(loadTimeout);
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

            window.currentServers = sorted;
            sourceSelect.innerHTML = renderOptions(sorted);

            const newUrl = getUrl(sorted[0]);
            if (iframe.src !== newUrl) {
                iframe.src = 'about:blank';
                setTimeout(() => { iframe.src = newUrl; }, 50);
                loader.style.display = 'flex';
            }
        });

        sourceSelect.addEventListener('change', (e) => {
            loader.style.display = 'flex';
            const option = e.target.options[e.target.selectedIndex];
            const url = option.getAttribute('data-url') || getUrl(window.currentServers[e.target.value]);

            if (url && iframe.src !== url) {
                iframe.src = 'about:blank';
                setTimeout(() => { iframe.src = url; }, 50);
            } else {
                loader.style.display = 'none';
            }
        });
    },

    async renderDownloadPage(type, id) {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const item = await api.getDetails(id, type);
        if (!item) return;

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
    },

    async renderTransferPage(type, id, quality, season, episode) {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const item = await api.getDetails(id, type);
        const title = item.title || item.name;
        const isTv = type === 'tv';
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
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                document.querySelector('.transfer-box').innerHTML = `
                <h1 style="color: #4cd137;"><i class="fas fa-check"></i> Ready</h1>
                 <p>${title} (${quality})</p>
                 <a href="${searchUrl}" target="_blank" class="btn btn-primary" style="display: block; margin: 20px;">Download Now</a>
                 <button onclick="history.back()" style="background:none; border:none; color: #888; cursor: pointer;">Cancel</button>
            `;
            } else {
                if (fill) fill.style.width = steps[i].p + '%';
                if (status) status.innerText = steps[i].t;
                i++;
            }
        }, 600);
    },

    async renderSearchPage(query) {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const res = await api.search(query);
        if (!res || !res.results.length) { app.innerHTML = '<h2>No results</h2>'; return; }
        app.innerHTML = createMovieRow(`Results for "${query}"`, res.results.filter(x => x.media_type === 'movie' || x.media_type === 'tv'));
    },

    async renderLiveTVPage() {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const channels = await api.getLiveTV();
        this.renderChannelGrid('Live TV (US)', channels);
    },

    async renderSportsPage() {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const channels = await api.getSports();
        this.renderChannelGrid('Sports', channels);
    },

    async renderFightsPage() {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const channels = await api.getFights();
        this.renderChannelGrid('Fight Sector', channels);
    },

    renderChannelGrid(title, channels) {
        if (!channels || !channels.length) {
            app.innerHTML = `<h2>No channels found for ${title}</h2>`;
            return;
        }

        // De-duplicate by URL to avoid same channel appearing multiple times
        const unique = [];
        const map = new Map();
        for (const item of channels) {
            if (!map.has(item.url)) {
                map.set(item.url, true);
                unique.push(item);
            }
        }

        app.innerHTML = `
        <div class="container" style="padding-top: 100px;">
            <h1 class="section-title">${title} <span style="font-size:1rem; opacity:0.7;">(${unique.length} Channels)</span></h1>
            <div class="movie-grid">
                ${unique.map(c => `
                    <div class="movie-card" onclick="UI.renderLivePlayer('${encodeURIComponent(JSON.stringify(c))}')">
                        <div class="poster-wrapper" style="background: #222; display: flex; align-items: center; justify-content: center; aspect-ratio: 16/9;">
                            ${c.logo ? `<img src="${c.logo}" loading="lazy" style="object-fit: contain; width: 80%; height: 80%;" onerror="this.onerror=null;this.src='logo.png';">` : '<i class="fas fa-tv" style="font-size: 3rem; color: #444;"></i>'}
                        </div>
                        <div class="movie-info">
                            <h3 class="movie-title">${c.name}</h3>
                            <span class="rating" style="font-size: 0.8rem; color: #aaa;">${c.group}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    },

    renderLivePlayer(channelDataURI) {
        const c = JSON.parse(decodeURIComponent(channelDataURI));

        app.innerHTML = `
        <div class="player-container" style="padding-top: 100px;">
             <div style="margin-bottom: 20px;">
                <a href="javascript:history.back()" style="color:white; text-decoration:none;"><i class="fas fa-arrow-left"></i> Back</a>
                <h1 style="margin-top: 10px;">${c.name}</h1>
                <p style="color: #aaa;">${c.group}</p>
            </div>

            <div class="video-wrapper" style="background: #000; aspect-ratio: 16/9; position: relative;">
                <video id="video" controls style="width: 100%; height: 100%;"></video>
            </div>
            
            <div style="margin-top: 20px; padding: 20px; background: #222; border-radius: 8px;">
                <p><i class="fas fa-info-circle"></i> If stream fails to load, the channel might be offline or geo-blocked.</p>
                <div style="margin-top: 10px; word-break: break-all; color: #555; font-size: 0.8rem;">Stream URL: ${c.url}</div>
            </div>
        </div>
        `;

        const video = document.getElementById('video');
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(c.url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(e => console.log('Autoplay blocked', e));
            });

            // Handle error recovery
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log("fatal network error encountered, try to recover");
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log("fatal media error encountered, try to recover");
                            hls.recoverMediaError();
                            break;
                        default:
                            console.log("cannot recover");
                            hls.destroy();
                            break;
                    }
                }
            });

        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = c.url;
            video.addEventListener('loadedmetadata', function () {
                video.play();
            });
        }
    }
};

// Helpers
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

function createMovieRow(title, movies) {
    if (!movies || !movies.length) return '';
    return `<section><h2 class="section-title">${title}</h2><div class="movie-grid">${movies.map(m => createCard(m)).join('')}</div></section>`;
}

function startHeroSlider(items) {
    if (!items || items.length < 2) return;

    let currentIndex = 0;
    const heroImg = () => document.querySelector('.hero-backdrop');
    const heroTitle = () => document.querySelector('.hero-title');
    const heroMeta = () => document.querySelector('.hero-meta');
    const heroOverview = () => document.querySelector('.hero-overview');
    const watchBtn = () => document.querySelector('.hero-actions .btn-primary');
    const infoBtn = () => document.querySelector('.hero-actions .btn:not(.btn-primary)');

    // Preload
    items.slice(0, 5).forEach(item => {
        const img = new Image();
        img.src = `${CONFIG.IMAGE_BASE_URL}${item.backdrop_path}`;
    });

    UI.clearHeroInterval();
    heroInterval = setInterval(() => {
        if (!heroImg()) {
            UI.clearHeroInterval();
            return;
        }

        currentIndex = (currentIndex + 1) % Math.min(items.length, 10);
        const item = items[currentIndex];

        const content = document.querySelector('.hero-content');
        const img = heroImg();
        if (content) content.style.opacity = '0';
        if (img) img.style.opacity = '0';

        setTimeout(() => {
            if (!heroImg()) return;

            img.src = `${CONFIG.IMAGE_BASE_URL}${item.backdrop_path}`;
            heroTitle().innerText = item.title || item.name;
            heroOverview().innerText = item.overview;

            const date = item.release_date || item.first_air_date || '';
            const year = date.split('-')[0];
            const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
            heroMeta().innerHTML = `<span>${year}</span> <span class="rating"><i class="fas fa-star"></i> ${rating}</span>`;

            const isTv = item.name ? true : false;
            watchBtn().href = isTv ? `#watch/tv/${item.id}/1/1` : `#watch/${item.id}`;
            infoBtn().href = isTv ? `#tv/${item.id}` : `#movie/${item.id}`;

            if (content) content.style.opacity = '1';
            if (img) img.style.opacity = '1';
        }, 500);

    }, 10000);
}

// Global for inline HTML calls
// Global for inline HTML calls
window.loadSeasonEpisodes = async (tvId, seasonNum) => {
    const list = document.getElementById('episodesList');
    if (list) list.innerHTML = 'Loading...';
    try {
        const data = await api.getSeason(tvId, seasonNum);
        if (list) list.innerHTML = data.episodes.map(ep => `
        <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #333;">
            <span>Ep ${ep.episode_number}: ${ep.name}</span>
            <a href="#transfer/tv/${tvId}/1080p/${seasonNum}/${ep.episode_number}" style="color: var(--primary);"><i class="fas fa-download"></i></a>
        </div>
    `).join('');
    } catch (e) { if (list) list.innerHTML = 'Error loading episodes'; }
};
