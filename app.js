import { UI } from './ui.js';
import { Auth } from './auth.js';

const app = document.getElementById('main-content');
const searchInput = document.getElementById('searchInput');

UI.setApp(app);

// --- Router ---
function router() {
    UI.clearHeroInterval();

    const hash = window.location.hash;

    // Auto-login: if user previously logged in, restore session and skip login/welcome
    const isLoggedIn = Auth.autoLogin();
    if (isLoggedIn && (!hash || hash === '#welcome' || hash === '#login')) {
        window.location.hash = '#home';
        return;
    }

    // Landing Logic
    const landing = document.getElementById('landing-page');
    // If hash exists and is NOT #welcome, hide landing.
    // However, if we want strict gatekeeping, we ensure landing is shown if they haven't "passed"?
    // For now, follow user flow: #home enters site.
    if (hash && hash !== '#welcome' && landing) {
        landing.style.display = 'none';
        app.style.display = 'block';
        document.querySelector('.navbar').style.display = 'flex';
    }

    if (hash.startsWith('#watch/')) {
        const parts = hash.split('/');
        if (parts[1] === 'tv') {
            const id = parts[2];
            const season = parts[3] || 1;
            const episode = parts[4] || 1;
            UI.renderWatchPage(id, 'tv', season, episode);
        } else {
            const id = parts[1];
            UI.renderWatchPage(id, 'movie');
        }
    } else if (hash.startsWith('#download/')) {
        const parts = hash.split('/');
        UI.renderDownloadPage(parts[1], parts[2]);
    } else if (hash.startsWith('#transfer/')) {
        const parts = hash.split('/');
        UI.renderTransferPage(parts[1], parts[2], parts[3], parts[4], parts[5]);
    } else if (hash === '#adblock') {
        UI.renderAdBlockPage();
    } else if (hash === '#login') {
        UI.renderLoginPage();
    } else if (hash.startsWith('#movie/')) {
        UI.renderDetailsPage(hash.split('/')[1], 'movie');
    } else if (hash.startsWith('#tv/')) {
        UI.renderDetailsPage(hash.split('/')[1], 'tv');
    } else if (hash.startsWith('#search/')) {
        UI.renderSearchPage(decodeURIComponent(hash.split('/')[1]));
    } else if (hash === '#movies') {
        UI.renderCatalogPage('movie');
    } else if (hash === '#tv') {
        UI.renderCatalogPage('tv');
    } else if (hash === '#install') {
        UI.renderInstallPage();
    } else if (hash === '#home') {
        UI.renderHomePage();
    } else {
        UI.renderWelcomePage();
    }

    window.scrollTo(0, 0);
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === hash) a.classList.add('active');
    });
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// Search
searchInput.addEventListener('input', (e) => {
    if (e.target.value.length > 2) setTimeout(() => window.location.hash = `#search/${e.target.value}`, 800);
});

// Prevent Popups
window.open = function () { console.log('Popup blocked'); return null; };
