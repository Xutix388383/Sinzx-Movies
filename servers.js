export const SERVERS = [
    // --- Ad Free / Premium (Top Priority & Fastest) ---
    { name: 'VidLink (Ad Free 4K)', url: (id) => `https://vidlink.pro/movie/${id}`, isAdFree: true, type: 'Premium' },
    { name: 'AutoEmbed (Ad Free)', url: (id) => `https://autoembed.to/movie/tmdb/${id}`, isAdFree: true, type: 'Premium' },
    { name: 'VidSrc.to (Ad Free)', url: (id) => `https://vidsrc.to/embed/movie/${id}`, isAdFree: true, type: 'Premium' },
    { name: 'VidSrc.me (Ad Free Mirror)', url: (id) => `https://vidsrc.me/embed/${id}`, isAdFree: true, type: 'Premium' },

    // --- High Speed / Reliable (Standard) ---
    { name: 'SuperEmbed (Multi-Language)', url: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`, isAdFree: false, type: 'Fast' },
    { name: '2Embed (Stabilized)', url: (id) => `https://www.2embed.cc/embed/${id}`, isAdFree: false, type: 'Fast' },
    { name: 'SmashyStream (FHD)', url: (id) => `https://player.smashy.stream/movie/${id}`, isAdFree: false, type: 'Fast' },
    { name: 'Vidsrc.pro (HLS)', url: (id) => `https://vidsrc.pro/embed/movie/${id}`, isAdFree: false, type: 'Fast' },
    { name: 'AniWave (Anime/Cartoons)', url: (id) => `https://aniwave.to/embed/${id}`, isAdFree: false, type: 'Special' },

    // --- Proven Backups (Only the best ones) ---
    { name: 'WarezCDN (Fast)', url: (id) => `https://warezcdn.com/embed/${id}`, isAdFree: false, type: 'Backup' },
    { name: 'MCloud (Reliable)', url: (id) => `https://mcloud.to/embed/${id}`, isAdFree: false, type: 'Backup' },
    { name: 'VidCloud (Mirror)', url: (id) => `https://vidcloud.co/embed/${id}`, isAdFree: false, type: 'Backup' },
    { name: 'UpCloud (Mirror)', url: (id) => `https://upcloud.co/embed/${id}`, isAdFree: false, type: 'Backup' },
    { name: 'Gomo (Asia/Global)', url: (id) => `https://gomo.to/movie/${id}`, isAdFree: false, type: 'Backup' },

    // --- Fallbacks (Use Only if Needed) ---
    { name: 'Server 26 (Auto 2)', url: (id) => `https://autoembed.to/movie/tmdb/${id}?server=2`, isAdFree: false, type: 'Fallback' },
    { name: 'Server 27 (Auto 3)', url: (id) => `https://autoembed.to/movie/tmdb/${id}?server=3`, isAdFree: false, type: 'Fallback' },
    { name: 'Server 42 (GoStream)', url: (id) => `https://gostream.site/embed/${id}`, isAdFree: false, type: 'Fallback' },
    { name: 'Server 43 (MoviesJoy)', url: (id) => `https://moviesjoy.to/embed/${id}`, isAdFree: false, type: 'Fallback' },
    { name: 'Server 41 (FMovies)', url: (id) => `https://fmovies.to/embed/${id}`, isAdFree: false, type: 'Fallback' }
];

// Removed ~30 broken/slow servers to improve load times.
