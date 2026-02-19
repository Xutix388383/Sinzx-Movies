export const Auth = {
    // Keys
    USERS_KEY: 'movie_users',
    CURRENT_USER_KEY: 'movie_current_user',

    // Methods
    getUsers() {
        return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    },

    createUser(username) {
        if (!username) return alert('Username required');
        const users = this.getUsers();
        if (users.find(u => u.name === username)) return alert('User already exists');

        const newUser = {
            name: username,
            history: [], // { id, type, title, poster, timestamp, progress }
            created: Date.now()
        };

        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        this.login(username);
    },

    login(username) {
        const users = this.getUsers();
        const user = users.find(u => u.name === username);
        if (user) {
            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
            window.location.hash = '#home';
            window.location.reload(); // Refresh to update UI
        } else {
            alert('User not found');
        }
    },

    logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        window.location.hash = '#login';
        window.location.reload();
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY));
    },

    // History Logic
    addToHistory(item) { // item: { id, type, title, poster_path, ... }
        const user = this.getCurrentUser();
        if (!user) return;

        // Remove existing entry for this item to push new one to top
        user.history = user.history.filter(h => h.id.toString() !== item.id.toString());

        // Add new entry
        user.history.unshift({
            id: item.id,
            type: item.type || 'movie', // 'movie' or 'tv'
            title: item.title || item.name,
            poster_path: item.poster_path,
            backdrop_path: item.backdrop_path,
            timestamp: Date.now(),
            // Embeds don't support precise time tracking easily, but we track *last watched*
        });

        // Limit history to 50 items
        if (user.history.length > 50) user.history.pop();

        // Save back to main user list
        this.updateUser(user);
    },

    updateUser(updatedUser) {
        const users = this.getUsers().map(u => u.name === updatedUser.name ? updatedUser : u);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser)); // Update session too
    }
};
