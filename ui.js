import { api } from './api.js';
import { CONFIG } from './config.js';
import { SERVERS } from './servers.js';
import { Auth } from './auth.js';
import { Party } from './party.js';

let app = document.getElementById('main-content');
let heroInterval = null;

export const UI = {
    setApp(element) {
        app = element;
    },

    toggleMobileMenu() {
        const nav = document.querySelector('.nav-links');
        nav.classList.toggle('active');
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

    async renderWatchPartyPage() {
        // Inject Premium Styles for Watch Party
        const styleId = 'watch-party-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                /* Animated Background */
                .party-bg {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(45deg, #120c1f, #2d1b4e, #0c0814);
                    background-size: 400% 400%;
                    animation: gradientBG 15s ease infinite;
                    z-index: -1;
                }
                @keyframes gradientBG {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                /* Glassmorphism Card */
                .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                }
            <div id="party-landing" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                .chat-bubble {
                    padding: 10px 15px;
                    border-radius: 15px;
                    max-width: 80%;
                    margin-bottom: 8px;
                    font-size: 0.95rem;
                    line-height: 1.4;
                    position: relative;
                    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .chat-self {
                    background: linear-gradient(135deg, #6c5ce7, #a29bfe);
                    color: white;
                    align-self: flex-end;
                    border-bottom-right-radius: 5px;
                }
                .chat-other {
                    background: rgba(255,255,255,0.1);
                    color: #eee;
                    align-self: flex-start;
                    border-bottom-left-radius: 5px;
                }
                .chat-meta { font-size: 0.7rem; opacity: 0.7; margin-bottom: 2px; }
                
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }

                /* Glow Effect for Player */
                .player-glow {
                    box-shadow: 0 0 30px rgba(108, 92, 231, 0.2);
                    transition: box-shadow 0.3s ease;
                }
                .player-glow:hover {
                    box-shadow: 0 0 50px rgba(108, 92, 231, 0.4);
                }
            `;
            document.head.appendChild(style);
        }

        app.innerHTML = `
        <div class="party-bg"></div>
        <div class="container" style="min-height: 90vh; display: flex; flex-direction: column; padding-top: 80px;">
            
            <!-- Landing State -->
            <div id="party-landing" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                <h1 style="font-family: 'Outfit', sans-serif; font-size: 3.5rem; margin-bottom: 20px; background: linear-gradient(to right, #fff, #a29bfe); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    Watch Party
                </h1>
                <p style="font-size: 1.2rem; color: #ccc; margin-bottom: 50px; max-width: 600px;">
                    Experience movies and TV shows in perfect sync with your friends. High-quality mirroring, real-time chat, and zero latency.
                </p>

                <div style="display: flex; gap: 30px; flex-wrap: wrap; justify-content: center;">
                    <!-- Host Card -->
                    <div class="glass-card" style="padding: 40px; width: 320px; text-align: left; transition: transform 0.3s ease;">
                        <div style="font-size: 2rem; color: #6c5ce7; margin-bottom: 20px;"><i class="fas fa-broadcast-tower"></i></div>
                        <h2 style="margin-bottom: 10px;">Host a Room</h2>
                        <p style="color: #aaa; font-size: 0.9rem; margin-bottom: 25px;">Create a private room and invite your friends to watch together.</p>
                        <input type="text" id="hostName" placeholder="Enter your name" class="glass-input" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: white; margin-bottom: 15px;">
                        <button onclick="UI.createParty()" class="btn btn-primary" style="width: 100%; box-shadow: 0 5px 15px rgba(108, 92, 231, 0.4);">
                            <i class="fas fa-plus-circle"></i> Create Party
                        </button>
                    </div>

                    <!-- Join Card -->
                    <div class="glass-card" style="padding: 40px; width: 320px; text-align: left; transition: transform 0.3s ease;">
                        <div style="font-size: 2rem; color: #fab1a0; margin-bottom: 20px;"><i class="fas fa-ticket-alt"></i></div>
                        <h2 style="margin-bottom: 10px;">Join a Room</h2>
                        <p style="color: #aaa; font-size: 0.9rem; margin-bottom: 25px;">Have a code? Enter it below to join an existing party.</p>
                        <input type="text" id="joinName" placeholder="Enter your name" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: white; margin-bottom: 10px;">
                        <input type="text" id="roomCode" placeholder="Room ID" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: white; margin-bottom: 15px;">
                        <button onclick="UI.joinParty()" class="btn" style="width: 100%; background: #fab1a0; color: #2d3436; font-weight: bold;">
                            <i class="fas fa-sign-in-alt"></i> Join Party
                        </button>
                    </div>
                </div>

                <!-- Recent Rooms (History) -->
            <div style="margin-top: 50px; width: 100%; max-width: 800px;">
                <h2 style="font-size: 1.5rem; margin-bottom: 20px; color: #ccc;">Recent Rooms</h2>
                ${Party.history.length === 0 ? '<p style="color: #666;">No recent rooms found.</p>' : `
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                        ${Party.history.map(room => `
                        <div class="glass-card" style="padding: 15px; cursor: pointer; border: 1px solid rgba(108, 92, 231, 0.2);" onclick="document.getElementById('roomCode').value='${room.id}'; document.getElementById('joinName').focus();">
                             <div style="color: #6c5ce7; font-weight: bold; margin-bottom: 5px; overflow: hidden; text-overflow: ellipsis;">${room.id}</div>
                             <div style="font-size: 0.8rem; color: #aaa;">Role: ${room.role}</div>
                             <div style="font-size: 0.7rem; color: #666;">${new Date(room.timestamp).toLocaleDateString()}</div>
                        </div>
                        `).join('')}
                    </div>
                    `}
            </div>
            </div >

            < !--Room State-- >
    <div id="party-room" style="display: none; width: 100%; max-width: 1600px; margin: 0 auto;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div class="glass-card" style="padding: 10px 20px; display: flex; align-items: center; gap: 15px;">
                <span style="color: #aaa; font-size: 0.9rem;">ROOM ID</span>
                <code id="currentRoomId" style="color: #6c5ce7; font-size: 1.1rem; letter-spacing: 1px;">...</code>
                <button onclick="navigator.clipboard.writeText(document.getElementById('currentRoomId').innerText)" style="background: none; border: none; color: white; cursor: pointer; opacity: 0.7; transition: opacity 0.3s;"><i class="fas fa-copy"></i></button>
            </div>
            <div>
                <button onclick="window.location.reload()" class="btn" style="background: rgba(255,50,50,0.2); color: #ff6b6b; border: 1px solid rgba(255,50,50,0.3);"><i class="fas fa-sign-out-alt"></i> Leave Party</button>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 350px; gap: 30px; height: 75vh;">

            <!-- Player Section -->
            <div style="display: flex; flex-direction: column; gap: 20px;">
                <div class="glass-card player-glow" style="flex: 1; overflow: hidden; position: relative; background: #000; display: flex; align-items: center; justify-content: center;">
                    <!-- Video Player (Direct) -->
                    <video id="party-video" controls style="width: 100%; height: 100%; object-fit: contain; display: none;"></video>

                    <!-- IFrame Player (Embeds) -->
                    <iframe id="party-iframe" style="width: 100%; height: 100%; border: none; display: none;" allowfullscreen></iframe>

                    <!-- Placeholder / Empty State -->
                    <div id="party-placeholder" style="position: absolute; text-align: center; color: rgba(255,255,255,0.5);">
                        <i class="fas fa-film" style="font-size: 5rem; margin-bottom: 20px; opacity: 0.5;"></i>
                        <h2 style="font-weight: 300;">Waiting for media...</h2>
                        <p id="host-controls" style="display:none; color: #a29bfe; margin-top: 10px;">You are the host.<br>Click below to select content from library.</p>
                    </div>
                </div>

                <!-- Host Controls (Media Selection) -->
                <div id="host-search-area" style="display: none;">
                    <div class="glass-card" style="padding: 20px; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <h3 style="margin-bottom: 5px;">Select Content</h3>
                            <p style="color: #aaa; font-size: 0.9em;">Browse the library and bring a movie/show here.</p>
                        </div>
                        <button onclick="UI.startPartySelection()" class="btn btn-primary" style="box-shadow: 0 5px 15px rgba(108, 92, 231, 0.4);">
                            <i class="fas fa-search"></i> Browse Library
                        </button>
                    </div>
                </div>
            </div>

            <!-- Sidebar (Chat) -->
            <div class="glass-card" style="display: flex; flex-direction: column; overflow: hidden; height: 100%;">
                <div style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <h3 style="margin: 0;">Party Chat</h3>
                </div>

                <div id="chat-messages" style="flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;">
                    <div style="text-align: center; color: rgba(255,255,255,0.3); font-size: 0.9rem; margin-top: auto;">
                        <i class="fas fa-lock"></i> Messages are encrypted (P2P)
                    </div>
                </div>

                <div style="padding: 20px; background: rgba(0,0,0,0.2); ">
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="chatInput" placeholder="Type a message..." style="flex: 1; padding: 12px; border-radius: 20px; border: none; background: rgba(255,255,255,0.1); color: white;" onkeypress="if(event.key==='Enter') UI.sendChatMessage()">
                            <button onclick="UI.sendChatMessage()" style="width: 40px; height: 40px; border-radius: 50%; border: none; background: linear-gradient(135deg, #6c5ce7, #a29bfe); color: white; cursor: pointer; transition: transform 0.2s;"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>

        </div>
    </div>
        </div >
    `;
    },

    startPartySelection() {
        if (!Party.isHost) return alert('Only the host can select media.');
        Party.isSelectingMedia = true;
        window.location.hash = '#home';
        // Maybe show a toast or modal?
        alert('Go find a movie/show and click "Watch with Party"!');
    },

    async createParty() {
        const name = document.getElementById('hostName').value || 'Host';
        try {
            const id = await Party.createRoom(name);
            this.enterPartyRoom(id, true);
        } catch (e) { alert('Error creating room: ' + e); }
    },

    async joinParty() {
        const name = document.getElementById('joinName').value || 'Guest';
        const id = document.getElementById('roomCode').value;
        if (!id) return alert('Please enter a Room ID');
        try {
            await Party.joinRoom(id, name);
            this.enterPartyRoom(id, false);
        } catch (e) { alert('Error joining room: ' + e); }
    },

    enterPartyRoom(id, isHost) {
        document.getElementById('party-landing').style.display = 'none';
        document.getElementById('party-room').style.display = 'block';
        document.getElementById('currentRoomId').innerText = id; // Changed from .value to .innerText

        if (isHost) {
            document.getElementById('host-controls').style.display = 'block';
            document.getElementById('host-search-area').style.display = 'block';
        }

        this.setupPartyEvents(isHost);

        // Restore state if returning
        if (Party.currentMedia) {
            this.updatePartyPlayer(Party.currentMedia);
        }
    },

    updatePartyPlayer(state) {
        const video = document.getElementById('party-video');
        const iframe = document.getElementById('party-iframe');
        const placeholder = document.getElementById('party-placeholder');

        placeholder.style.display = 'none';

        if (state.type === 'iframe') {
            video.style.display = 'none';
            video.pause();
            iframe.style.display = 'block';
            if (iframe.src !== state.src) iframe.src = state.src;
        } else {
            iframe.style.display = 'none';
            iframe.src = '';
            video.style.display = 'block';
            if (video.src !== state.src) video.src = state.src;
            // video.play(); // Auto-play might be blocked
        }
    },

    setupPartyEvents(isHost) {
        const video = document.getElementById('party-video');
        const chat = document.getElementById('chat-messages');

        // PeerJS Callbacks
        Party.on('onMessage', (msg) => {
            const isSelf = msg.name === Party.username;
            const div = document.createElement('div');
            div.className = `chat - bubble ${isSelf ? 'chat-self' : 'chat-other'} `;

            // Name/Meta
            const meta = document.createElement('div');
            meta.className = 'chat-meta';
            meta.innerText = isSelf ? 'You' : msg.name;
            if (!isSelf && msg.color) meta.style.color = msg.color;

            // Text
            const text = document.createElement('div');
            text.innerText = msg.text;

            div.appendChild(meta);
            div.appendChild(text);
            chat.appendChild(div);

            // Auto-scroll
            chat.scrollTop = chat.scrollHeight;
        });

        // System Messages
        Party.on('onStatus', (msg) => {
            const div = document.createElement('div');
            div.style.textAlign = 'center';
            div.style.fontSize = '0.8em';
            div.style.color = 'rgba(255,255,255,0.4)';
            div.style.margin = '10px 0';
            div.style.fontStyle = 'italic';
            div.innerHTML = `< i class="fas fa-info-circle" ></i > ${msg} `;
            chat.appendChild(div);
            chat.scrollTop = chat.scrollHeight;
        });

        // User Join/List Events
        Party.on('onUserJoin', (name) => {
            if (isHost && Party.currentMedia) {
                // Determine duration for sync? Iframes can't
                // Just resend current media state to new joiner
                // Ideally this should be a direct message to the new peer, but broadcast works for now
                setTimeout(() => {
                    Party.sendSync('CHANGE_MEDIA', 0, Party.currentMedia);
                }, 1000);
            }
        });

        Party.on('onSync', (data) => {
            // console.log('Sync Event:', data);
            if (isHost) return; // Host ignores sync (they are source of truth)

            // Allow slight variance (2s) to prevent jitter loops
            const timeDiff = Math.abs(video.currentTime - data.time);

            if (data.action === 'CHANGE_MEDIA') {
                this.updatePartyPlayer(data.state);
                Party.currentMedia = data.state; // Update local state for clients too

                // Add system message about media change
                const div = document.createElement('div');
                div.className = 'chat-bubble';
                div.style.background = 'rgba(255,255,255,0.05)';
                div.style.color = '#aaa';
                div.style.textAlign = 'center';
                div.style.fontSize = '0.8rem';
                div.innerText = `Media changed to: ${data.state.title || 'Unknown'}`;
                chat.appendChild(div);
                chat.scrollTop = chat.scrollHeight;

            } else if (data.action === 'PLAY') {
                if (video.style.display !== 'none') {
                    if (video.paused) video.play();
                    if (timeDiff > 2) video.currentTime = data.time;
                }
            } else if (data.action === 'PAUSE') {
                if (video.style.display !== 'none') {
                    video.pause();
                    video.currentTime = data.time;
                }
            } else if (data.action === 'SEEK') {
                if (video.style.display !== 'none') video.currentTime = data.time;
            }
        });

        // Host Player Events
        if (isHost) {
            video.addEventListener('play', () => Party.sendSync('PLAY', video.currentTime));
            video.addEventListener('pause', () => Party.sendSync('PAUSE', video.currentTime));
            video.addEventListener('seeked', () => Party.sendSync('SEEK', video.currentTime));

            // Periodic Sync (every 5s)
            setInterval(() => {
                if (!video.paused) Party.sendSync('PLAY', video.currentTime);
            }, 5000);
        }
    },

    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const text = input.value;
        if (text) {
            Party.sendMessage(text);
            input.value = '';
        }
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
    < header class="hero" >
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

         <!--Ad Blocker Warning Banner(Purple Theme)-- >
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
    < header class="hero" >
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
        const watchLink = isMovie ? `#watch / ${item.id} ` : `#watch / tv / ${item.id} /1/1`; // S1E1 default

        app.innerHTML = `
    < div class="hero" >
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
                title: type === 'tv' ? `${item.name} S${season}:E${episode} ` : item.title,
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
                `< option value = "${i}" data - url="${getUrl(s)}" > ${s.name} ${s.isAdFree ? '[AD-FREE]' : ''} - ${s.type}</option > `
            ).join('');
        };

        const html = `
    < div class="player-container" style = "padding-top: 40px;" >
            <div style="margin-bottom: 20px;">
                <!-- Party Selection Header -->
                ${Party.isHost && Party.isSelectingMedia ? `
                <div style="background: linear-gradient(90deg, #6c5ce7, #a29bfe); padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; color: white;">
                    <div>
                        <strong style="font-size: 1.1em;"><i class="fas fa-broadcast-tower"></i> Selecting Media for Watch Party</strong>
                        <div style="font-size: 0.9em; opacity: 0.9;">Choose a server below, then click Confirm.</div>
                    </div>
                    <button onclick="UI.confirmPartySelection('${escape(item.title || item.name)}', '${item.poster_path}')" class="btn" style="background: white; color: #6c5ce7; font-weight: bold; padding: 10px 20px; border: none;">
                        <i class="fas fa-check"></i> Confirm Selection
                    </button>
                </div>
                ` : ''}

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
        </div >
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

    confirmPartySelection(title, poster) {
        const iframe = document.getElementById('videoIframe');
        if (!iframe || !iframe.src) return alert('No video source found.');

        const mediaState = {
            type: 'iframe',
            src: iframe.src,
            poster: poster,
            title: unescape(title)
        };

        // 1. Update Party State
        Party.currentMedia = mediaState;
        Party.isSelectingMedia = false;

        // 2. Broadcast to room
        Party.sendSync('CHANGE_MEDIA', 0, mediaState);
        Party.sendMessage(`Selected media: ${unescape(title)} `);

        // 3. Return to party
        window.location.hash = '#watchparty';
    },

    async renderDownloadPage(type, id) {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const item = await api.getDetails(id, type);
        if (!item) return;

        let contentHtml = '';
        if (type === 'movie') {
            contentHtml = `
    < div class="download-card" >
                <h2>${item.title}</h2>
                <div class="download-options">
                        <a href="#transfer/movie/${id}/1080p" class="download-btn"><i class="fas fa-download"></i> Server 1 (1080p)</a>
                        <a href="#transfer/movie/${id}/720p" class="download-btn secondary"><i class="fas fa-download"></i> Server 2 (720p)</a>
                </div>
            </div > `;
        } else {
            const seasons = item.seasons.filter(s => s.season_number > 0);
            contentHtml = `
    < h2 > ${item.name}</h2 >
            <select id="seasonSelect" onchange="window.loadSeasonEpisodes('${id}', this.value)" style="padding: 10px; margin: 10px 0; background: #333; color: white;">
                ${seasons.map(s => `<option value="${s.season_number}">Season ${s.season_number}</option>`).join('')}
            </select>
            <div id="episodesList"></div>
`;
            setTimeout(() => window.loadSeasonEpisodes(id, seasons[0]?.season_number || 1), 100);
        }

        app.innerHTML = `
    < div class="container" style = "padding-top: 100px; color: white; max-width: 800px; margin: 0 auto;" >
            <a href="#${type}/${id}" style="color: #ccc;"><i class="fas fa-arrow-left"></i> Back</a>
            <h1 class="section-title">Download</h1>
            <div style="background: var(--bg-card); padding: 30px; border-radius: 16px;">
                ${contentHtml}
            </div>
        </div >
    `;
    },

    async renderTransferPage(type, id, quality, season, episode) {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const item = await api.getDetails(id, type);
        const title = item.title || item.name;
        const isTv = type === 'tv';
        const query = `intitle: "index of" "${title}" "${quality}" ${isTv ? `S${season}` : ''} (mkv | mp4)`;

        app.innerHTML = `
    < div class="transfer-container" style = "height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(#222, #000);" >
        <div class="transfer-box" style="text-align: center; color: white;">
            <h2 style="color: var(--primary);">Connecting...</h2>
            <p>Searching for best ${quality} source...</p>
            <div class="progress-bar" style="width: 300px; height: 5px; background: #333; margin: 20px auto;"><div class="fill" style="width: 0%; height: 100%; background: var(--primary); transition: width 0.5s;"></div></div>
            <div id="status">Initializing handshake...</div>
        </div>
        </div >
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

    // --- Enhanced Live TV Logic ---

    async renderLiveTVPage() {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const channels = await api.getLiveTV();
        this.renderCategoryPage('Live TV', channels, ['News', 'Entertainment', 'Movies', 'Music', 'Kids', 'Documentary']);
    },

    async renderSportsPage() {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const channels = await api.getSports();
        this.renderCategoryPage('Sports', channels, ['Football', 'Soccer', 'Racing', 'Tennis', 'Golf', 'Basketball']);
    },

    async renderFightsPage() {
        app.innerHTML = '<div class="loading-spinner"></div>';
        const [channels, vods] = await Promise.all([
            api.getFights(),
            api.getFightVODs()
        ]);

        this.renderCategoryPage('Fight Sector', channels, ['Boxing', 'MMA', 'Wrestling', 'UFC'], [
            { title: 'Popular Fight Events (VOD)', items: vods }
        ]);
    },

    async renderChannelDetailsPage(channelDataURI) {
        const c = JSON.parse(decodeURIComponent(channelDataURI));
        app.innerHTML = '<div class="loading-spinner"></div>';

        // Simulate a "backdrop" using the logo or a generic TV pattern
        const backdrop = c.logo || 'img/hero-bg.jpg';

        app.innerHTML = `
        <div class="hero">
            <div class="hero-backdrop" style="background-image: url('${backdrop}'); background-size: cover; filter: blur(20px); opacity: 0.3;"></div>
            <div class="hero-content">
                <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 20px;">
                    ${c.logo ? `<img src="${c.logo}" style="max-width: 200px; max-height: 150px; object-fit: contain; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">` : '<i class="fas fa-tv" style="font-size: 5rem;"></i>'}
                    
                    <div>
                        <h1 class="hero-title">${c.name}</h1>
                        <div class="hero-meta">
                            <span class="rating">${c.group}</span>
                            <span>Live Stream</span>
                        </div>
                        <p class="hero-overview">Watch ${c.name} live. Stream provided by verifyable public sources.</p>
                        
                        <div class="hero-actions">
                            <button onclick="UI.openModalPlayer('${encodeURIComponent(JSON.stringify(c))}')" class="btn btn-primary"><i class="fas fa-play"></i> Watch Live</button>
                            <button onclick="history.back()" class="btn"><i class="fas fa-arrow-left"></i> Back</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="container" style="padding-top: 20px;">
            <h2 class="section-title">Channel Info</h2>
            <div style="background: #222; padding: 20px; border-radius: 10px;">
                <p><strong>Channel Name:</strong> ${c.name}</p>
                <p><strong>Category:</strong> ${c.group}</p>
                <p><strong>Stream URL:</strong> <span style="color: #666; font-size: 0.8em;">${c.url}</span></p>
            </div>
        </div>
        `;

        window.scrollTo(0, 0);
    },

    renderCategoryPage(pageTitle, allChannels, categories, extraRows = []) {
        if (!allChannels || !allChannels.length) {
            app.innerHTML = `<h2>No channels found for ${pageTitle}</h2>`;
            return;
        }

        // De-duplicate
        const unique = [];
        const map = new Map();
        for (const item of allChannels) {
            if (!map.has(item.url)) {
                map.set(item.url, true);
                unique.push(item);
            }
        }

        // Popular Channels Filter (Curated List)
        const popularKeywords = [
            'HBO', 'Disney', 'BBC', 'CNN', 'Fox', 'ESPN', 'Sky', 'NBC', 'ABC', 'CBS',
            'Nickelodeon', 'Cartoon Network', 'National Geographic', 'Discovery', 'History',
            'AMC', 'Comedy Central', 'MTV', 'E!', 'Starz', 'Showtime', 'TNT', 'TBS', 'USA Network'
        ];

        const popularChannels = unique.filter(c => {
            const name = c.name.toLowerCase();
            return popularKeywords.some(k => name.includes(k.toLowerCase()));
        });

        // Hero Channel (Random from Popular or first 50)
        const heroPool = popularChannels.length > 0 ? popularChannels : unique.slice(0, 50);
        const heroChannel = heroPool[Math.floor(Math.random() * heroPool.length)];

        let html = `
        <header class="hero">
            <div class="hero-backdrop" style="background: #000; display:flex; align-items:center; justify-content:center;">
                ${heroChannel.logo ? `<img src="${heroChannel.logo}" style="height: 50%; opacity: 0.5;">` : ''}
            </div>
            <div class="hero-content">
                <h1 class="hero-title">${heroChannel.name}</h1>
                <div class="hero-meta">
                    <span class="rating">${heroChannel.group}</span>
                    <span>${pageTitle}</span>
                </div>
                <p class="hero-overview">Watch ${heroChannel.name} live now.</p>
                <div class="hero-actions">
                    <a href="#channel/${encodeURIComponent(JSON.stringify(heroChannel))}" class="btn btn-primary"><i class="fas fa-info-circle"></i> More Info</a>
                </div>
            </div>
        </header>

        <div style="background: #222; padding: 10px; text-align: right; color: #aaa; font-size: 0.9rem;">
             ${unique.length} Channels Available
        </div>
        `;

        // Render Popular Channels Row
        if (popularChannels.length > 0) {
            html += this.createChannelRow('Popular Channels', popularChannels.slice(0, 20));
        }

        // Extra Rows (VODs)
        if (extraRows && extraRows.length > 0) {
            extraRows.forEach(row => {
                if (row.items && row.items.length > 0) {
                    html += createMovieRow(row.title, row.items);
                }
            });
        }

        // Render Category Rows (like Netflix)
        categories.forEach(cat => {
            const catChannels = unique.filter(c => c.group.toLowerCase().includes(cat.toLowerCase()));
            if (catChannels.length > 0) {
                html += this.createChannelRow(cat, catChannels.slice(0, 20)); // Limit to 20 per row for perf
            }
        });

        // "Browse All" Grid with Filter
        html += `
        <section id="browse-all" style="padding-top: 40px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                <h2 class="section-title">Browse All Channels</h2>
                <select id="channel-filter" onchange="UI.filterChannels(this.value)" style="background: #333; color: white; padding: 10px; border: none; border-radius: 5px;">
                    <option value="All">All Categories</option>
                    ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                    <option value="Other">Other</option>
                </select>
            </div>
            <div id="channel-grid" class="movie-grid">
                ${unique.map(c => this.createChannelCard(c)).join('')}
            </div>
        </section>
        `;

        // Store unique channels for filtering
        this.currentChannels = unique;
        app.innerHTML = html;
        window.scrollTo(0, 0);
    },

    createChannelRow(title, channels) {
        return `
        <section>
            <h2 class="section-title">${title}</h2>
            <div class="movie-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
                ${channels.map(c => this.createChannelCard(c)).join('')}
            </div>
        </section>
        `;
    },

    createChannelCard(c) {
        return `
        <div class="movie-card channel-item" data-group="${c.group}" onclick="window.location.hash='#channel/${encodeURIComponent(JSON.stringify(c))}'">
            <div class="poster-wrapper" style="background: #222; display: flex; align-items: center; justify-content: center; aspect-ratio: 16/9;">
                ${c.logo ? `<img src="${c.logo}" loading="lazy" style="object-fit: contain; width: 80%; height: 80%;" onerror="this.onerror=null;this.src='logo.png';">` : '<i class="fas fa-tv" style="font-size: 3rem; color: #444;"></i>'}
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${c.name}</h3>
                <span class="rating" style="font-size: 0.8rem; color: #aaa;">${c.group}</span>
            </div>
        </div>
        `;
    },

    filterChannels(category) {
        const grid = document.getElementById('channel-grid');
        if (!grid || !this.currentChannels) return;

        let filtered = this.currentChannels;
        if (category !== 'All') {
            if (category === 'Other') {
                filtered = filtered.filter(c => c.group === 'Uncategorized' || c.group === '');
            } else {
                filtered = filtered.filter(c => c.group.toLowerCase().includes(category.toLowerCase()));
            }
        }
        grid.innerHTML = filtered.map(c => this.createChannelCard(c)).join('');
    },

    // --- Modal Player ---

    openModalPlayer(channelDataURI) {
        const c = JSON.parse(decodeURIComponent(channelDataURI));
        const modal = document.getElementById('video-modal');
        const video = document.getElementById('modal-video');
        const info = document.getElementById('modal-info');

        if (!modal || !video) return;

        modal.style.display = 'flex';
        info.innerHTML = `<strong>${c.name}</strong><br><span style="font-size:0.8em; color:#ccc;">${c.group}</span>`;

        let isProxy = false;
        const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(c.url);

        const loadStream = (url) => {
            if (Hls.isSupported()) {
                if (window.hls) window.hls.destroy();

                const hls = new Hls();
                window.hls = hls;
                hls.loadSource(url);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(e => console.log('Autoplay blocked', e));
                });

                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.log("Network error, trying recovery...");
                                if (!isProxy) {
                                    console.log("Attempting CORS proxy...");
                                    isProxy = true;
                                    info.innerHTML += '<br><span style="color: #ff9f43; font-size: 0.8em;"><i class="fas fa-shield-alt"></i> Bypassing restrictions...</span>';
                                    hls.destroy();
                                    loadStream(proxyUrl);
                                } else {
                                    hls.startLoad();
                                }
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                hls.recoverMediaError();
                                break;
                            default:
                                hls.destroy();
                                break;
                        }
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
                video.play();
                // Native HLS error handling is limited, rely on browser
                video.onerror = () => {
                    if (!isProxy) {
                        isProxy = true;
                        info.innerHTML += '<br><span style="color: #ff9f43; font-size: 0.8em;"><i class="fas fa-shield-alt"></i> Bypassing restrictions...</span>';
                        video.src = proxyUrl;
                        video.play();
                    }
                };
            }
        };

        loadStream(c.url);
    },

    closeModalPlayer() {
        const modal = document.getElementById('video-modal');
        const video = document.getElementById('modal-video');

        if (modal) modal.style.display = 'none';
        if (video) {
            video.pause();
            video.src = '';
            if (window.hls) {
                window.hls.destroy();
                window.hls = null;
            }
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

window.UI = UI;
