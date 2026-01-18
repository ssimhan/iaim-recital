// State Management
let currentChoirId = null;
let currentSongId = null;

// DOM Elements
const appContainer = document.getElementById('app-container');
const pageTitle = document.getElementById('page-title');

// Templates
const landingTemplate = document.getElementById('landing-template');
const choirTemplate = document.getElementById('choir-template');
const songTemplate = document.getElementById('song-template');

// Initialize App
function init() {
    renderLanding();
}

// Navigation Functions
function goHome() {
    currentChoirId = null;
    currentSongId = null;
    renderLanding();
    window.scrollTo(0, 0);
}

function selectChoir(choirId) {
    currentChoirId = choirId;
    renderChoir(choirId);
    window.scrollTo(0, 0);
}

function selectSong(songId) {
    currentSongId = songId;
    renderSong(currentChoirId, songId);
    window.scrollTo(0, 0);
}

function goBackToChoir() {
    if (currentChoirId) {
        renderChoir(currentChoirId);
    } else {
        goHome();
    }
}

// Rendering Functions

function renderLanding() {
    // Clear Container
    appContainer.innerHTML = '';

    // Clone Template
    const content = landingTemplate.content.cloneNode(true);
    const choirList = content.getElementById('choir-list');

    // Populate Choir Cards
    RECITAL_DATA.forEach(choir => {
        const card = document.createElement('div');
        card.className = 'choir-card';
        card.onclick = () => selectChoir(choir.id);

        card.innerHTML = `
            <h3>${choir.name}</h3>
            <p>${choir.subtitle}</p>
        `;
        choirList.appendChild(card);
    });

    // Update Header
    pageTitle.textContent = 'IAIM Recital Practice';

    appContainer.appendChild(content);
}

function renderChoir(choirId) {
    const choirData = RECITAL_DATA.find(c => c.id === choirId);
    if (!choirData) return goHome();

    appContainer.innerHTML = '';

    const content = choirTemplate.content.cloneNode(true);

    // Set Header Info


    const songList = content.getElementById('song-list');

    // Populate Songs
    choirData.songs.forEach(song => {
        const item = document.createElement('div');
        item.className = 'song-item';
        item.onclick = () => selectSong(song.id);

        item.innerHTML = `
            <span class="song-item-title">${song.title}</span>
            <span class="arrow-icon">›</span>
        `;
        songList.appendChild(item);
    });

    // Update Header
    pageTitle.textContent = choirData.name;

    appContainer.appendChild(content);
}

function renderSong(choirId, songId) {
    const choir = RECITAL_DATA.find(c => c.id === choirId);
    const song = choir ? choir.songs.find(s => s.id === songId) : null;

    if (!song) return goBackToChoir();

    appContainer.innerHTML = '';

    const content = songTemplate.content.cloneNode(true);

    // Set Titles
    content.getElementById('song-title-display').textContent = song.title;
    content.getElementById('lyrics-display').textContent = song.lyrics || 'Lyrics not available yet.';

    // Populate Videos
    const videoList = content.getElementById('video-list');

    if (song.videos && song.videos.length > 0) {
        song.videos.forEach(video => {
            // Check if URL is present
            if (!video.url) {
                // Skip or show placeholder message? 
                // Let's show a placeholder card
                const card = document.createElement('div');
                card.className = 'video-card';
                card.innerHTML = `
                    <div class="video-header">${video.title}</div>
                    <div class="video-wrapper" style="background:#eee; display:flex; align-items:center; justify-content:center;">
                        <span style="color:#666; font-size:0.9rem; padding:20px; position:absolute; width:100%; text-align:center;">Video coming soon...</span>
                    </div>
                `;
                videoList.appendChild(card);
                return;
            }

            const card = document.createElement('div');
            card.className = 'video-card';

            // Basic extraction for YouTube ID (covers simple cases)
            let embedUrl = video.url;
            if (video.url.includes('youtube.com/watch?v=')) {
                const videoId = video.url.split('v=')[1].split('&')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            } else if (video.url.includes('youtu.be/')) {
                const videoId = video.url.split('youtu.be/')[1].split('?')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }

            card.innerHTML = `
                <div class="video-header">${video.title}</div>
                <div class="video-wrapper">
                    <iframe src="${embedUrl}" allowfullscreen></iframe>
                </div>
            `;
            videoList.appendChild(card);
        });
    } else {
        videoList.innerHTML = '<p style="text-align:center; color:#666;">No videos available yet.</p>';
    }

    // Update Header
    pageTitle.textContent = song.title;

    appContainer.appendChild(content);
}

// Tab Switcher for Song View
function switchTab(tabName) {
    // Buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Try to find the button by text content or logic (simple version)
    const buttons = document.querySelectorAll('.tab-btn');
    if (tabName === 'videos') buttons[0].classList.add('active');
    if (tabName === 'lyrics') buttons[1].classList.add('active');

    // Content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`tab-content-${tabName}`).classList.add('active');
}

// Global expose for tab switcher since it's called from HTML inline
window.switchTab = switchTab;
window.goHome = goHome;
window.goBackToChoir = goBackToChoir;

// Start App
document.addEventListener('DOMContentLoaded', init);
