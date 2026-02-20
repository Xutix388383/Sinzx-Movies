export class PartyManager {
    constructor() {
        this.peer = null;
        this.connections = []; // Array of active connections
        this.hostId = null;
        this.myId = null;
        this.isHost = false;
        this.username = 'User-' + Math.floor(Math.random() * 1000);
        this.color = this.getRandomColor();

        // State
        this.isSelectingMedia = false;
        this.currentMedia = JSON.parse(localStorage.getItem('party_media')) || null;
        this.history = JSON.parse(localStorage.getItem('party_history')) || [];

        this.callbacks = {
            onMessage: () => { },
            onSync: () => { },
            onUserJoin: () => { },
            onStatus: () => { }
        };
    }

    addToHistory(id, role) {
        const existing = this.history.findIndex(h => h.id === id);
        if (existing !== -1) this.history.splice(existing, 1); // remove old

        this.history.unshift({
            id: id,
            role: role,
            timestamp: Date.now(),
            users: [] // Can't track real users without being connected, but good placeholder
        });

        if (this.history.length > 5) this.history.pop();
        localStorage.setItem('party_history', JSON.stringify(this.history));
    }

    deleteHistoryItem(id) {
        this.history = this.history.filter(h => h.id !== id);
        localStorage.setItem('party_history', JSON.stringify(this.history));
    }

    // End Room (Host)
    endRoom() {
        if (!this.isHost) return;
        this.broadcast({ type: 'ROOM_ENDED' });
        setTimeout(() => {
            this.connections.forEach(conn => conn.close());
            this.peer.destroy();
            window.location.reload();
        }, 500);
    }

    // Initialize Peer
    async init() {
        return new Promise((resolve, reject) => {
            if (window.peer) this.peer = window.peer;
            else this.peer = new Peer(null, { debug: 2 });

            this.peer.on('open', (id) => {
                console.log('My peer ID is: ' + id);
                this.myId = id;
                resolve(id);
            });

            this.peer.on('connection', (conn) => {
                this.handleIncomingConnection(conn);
            });

            this.peer.on('error', (err) => {
                console.error(err);
                this.callbacks.onStatus('Error: ' + err.type);
                reject(err);
            });
        });
    }

    // Create a Room (Host)
    async createRoom(username) {
        this.username = username || this.username;
        this.isHost = true;
        await this.init();
        this.hostId = this.myId; // Set hostId for self
        this.addToHistory(this.myId, 'Host');
        return this.myId;
    }

    // Join a Room (Client)
    async joinRoom(hostId, username) {
        this.username = username || this.username;
        this.isHost = false;
        this.hostId = hostId;
        await this.init();
        this.connectToPeer(hostId);
        this.addToHistory(hostId, 'Guest');
    }

    connectToPeer(peerId) {
        const conn = this.peer.connect(peerId);
        this.setupConnection(conn);
    }

    handleIncomingConnection(conn) {
        this.setupConnection(conn);
    }

    setupConnection(conn) {
        conn.on('open', () => {
            console.log('Connected to: ' + conn.peer);
            this.connections.push(conn);
            this.callbacks.onStatus('Connected to ' + conn.peer);

            // Send initial join info
            conn.send({ type: 'JOIN', name: this.username, color: this.color });
        });

        conn.on('data', (data) => {
            this.handleData(data, conn);
        });

        conn.on('close', () => {
            this.connections = this.connections.filter(c => c !== conn);
            this.callbacks.onStatus('Connection closed: ' + conn.peer);
        });
    }

    handleData(data, senderConn) {
        console.log('Received:', data);

        switch (data.type) {
            case 'JOIN':
                this.callbacks.onUserJoin(data.name);
                if (this.isHost) {
                    // Host relays new user to everyone else
                    this.broadcast({ type: 'System', message: `${data.name} joined!` });

                    // Sync current media to the new user
                    if (this.currentMedia) {
                        senderConn.send({ type: 'SYNC', action: 'CHANGE_MEDIA', state: this.currentMedia });
                    }
                }
                break;
            case 'CHAT':
                this.callbacks.onMessage(data);
                // If Host, relay to others
                if (this.isHost) {
                    this.broadcast(data, senderConn);
                }
                break;
            case 'SYNC':
                this.callbacks.onSync(data);
                if (this.isHost) this.broadcast(data, senderConn);
                break;
            case 'ROOM_ENDED':
                alert('The host has ended the session.');
                window.location.reload();
                break;
        }
    }

    // Update & Persist Media
    updateMedia(state) {
        this.currentMedia = state;
        localStorage.setItem('party_media', JSON.stringify(state));
    }

    // Send chat message
    sendMessage(text) {
        const msg = { type: 'CHAT', name: this.username, text: text, color: this.color, time: Date.now() };
        this.broadcast(msg);
        this.callbacks.onMessage(msg); // Show own message
    }

    // Send Sync Event (Play, Pause, Seek)
    sendSync(action, time, state) {
        const msg = { type: 'SYNC', action, time, state };
        this.broadcast(msg);
    }

    // Broadcast to all connected peers
    broadcast(data, excludeConn = null) {
        this.connections.forEach(conn => {
            if (conn !== excludeConn && conn.open) {
                conn.send(data);
            }
        });
    }

    // Register callbacks
    on(event, callback) {
        if (this.callbacks[event]) this.callbacks[event] = callback;
    }

    getRandomColor() {
        const colors = ['#ff6b6b', '#feca57', '#1dd1a1', '#54a0ff', '#5f27cd', '#ff9ff3', '#00d2d3'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

export const Party = new PartyManager();
