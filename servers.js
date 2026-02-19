export const SERVERS = [
    // --- Premium / Ad-Free ---
    { name: 'PremiumAdsFree', url: (id) => `https://premiumadsfree.com/movie/${id}`, tvUrl: (id, s, e) => `https://premiumadsfree.com/tv/${id}/${s}/${e}`, isAdFree: true, type: 'Fast' },

    // --- Fastest ---
    { name: '111movies', url: (id) => `https://111movies.com/movie/${id}`, tvUrl: (id, s, e) => `https://111movies.com/tv/${id}/${s}/${e}`, isAdFree: false, type: 'Fastest' },

    // --- Fast ---
    { name: 'vidlinkpro', url: (id) => `https://vidlink.pro/movie/${id}`, tvUrl: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`, isAdFree: false, type: 'Fast' },
    { name: 'videasy4k', url: (id) => `https://videasy.net/movie/${id}`, tvUrl: (id, s, e) => `https://videasy.net/tv/${id}/${s}/${e}`, isAdFree: false, type: 'May have 4k' },
    { name: 'vidzee', url: (id) => `https://vidzee.wtf/movie/${id}`, tvUrl: (id, s, e) => `https://vidzee.wtf/tv/${id}/${s}/${e}`, isAdFree: false, type: 'May have 4k' },
    { name: 'vidsrccc', url: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`, tvUrl: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`, isAdFree: false, type: 'Fast' },
    { name: 'vidsrcpro', url: (id) => `https://vidsrc.pro/embed/movie/${id}`, tvUrl: (id, s, e) => `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`, isAdFree: false, type: 'Fast' },
    { name: 'vidsrcxyz', url: (id) => `https://vidsrc.xyz/embed/movie?tmdb=${id}`, tvUrl: (id, s, e) => `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${s}&episode=${e}`, isAdFree: false, type: 'Standard' },
    { name: 'embedccMovie', url: (id) => `https://www.2embed.cc/embed/${id}`, tvUrl: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`, isAdFree: false, type: 'Standard' },
    { name: 'vidsrctop', url: (id) => `https://vidsrc.top/embed/movie/${id}`, tvUrl: (id, s, e) => `https://vidsrc.top/embed/tv/${id}/${s}/${e}`, isAdFree: false, type: 'Standard' }
];
