let isAdmin = localStorage.getItem('isAdmin') === 'true';

// Modal idarəetməsi
function openAdminModal() {
    if (isAdmin) {
        alert("You are already logged in as Admin!");
        return;
    }
    document.getElementById('adminModal').style.display = 'flex';
}

function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
    document.getElementById('adminPasswordInput').value = '';
    document.getElementById('loginMessage').innerText = '';
}

// Şifrə yoxlama funksiyası
function checkAdminPassword() {
    const password = document.getElementById('adminPasswordInput').value;
    const msg = document.getElementById('loginMessage');

    if (password === 'navigator7777') {
        isAdmin = true;
        localStorage.setItem('isAdmin', 'true');
        msg.style.color = '#39ff14'; // Yaşıl neon
        msg.innerText = "Successfully joined as admin!";
        setTimeout(() => {
            closeAdminModal();
            if (currentPlatform === 'pixelplanet-faction') {
                openFactionServers();
            }
        }, 1200);
    } else {
        msg.style.color = '#ff0059'; // Qırmızı neon
        msg.innerText = "Sifre yanlis girildi!";
    }
}

let currentPlatform = '';

// Platforma seçimi
function selectPlatform(platformName) {
    currentPlatform = platformName;
    const container = document.getElementById('main-container');

    if (platformName === 'pixelplanet') {
        container.innerHTML = `
            <h1 class="neon-title">PIXELPLANET.FUN</h1>
            <p class="subtitle">CHOOSE A CATEGORY</p>
            
            <div class="options-grid">
                <button class="neon-option-btn" onclick="openFactionServers()">Pixelplanet faction servers</button>
                <button class="neon-option-btn" onclick="alert('Coming soon!')">Useful pixelplanet discord bots</button>
            </div>
            
            <div style="margin-top: 30px;">
                <button class="neon-option-btn" style="border-color: #00ffcc; color: #00ffcc; font-size: 0.6rem; padding: 10px 20px;" onclick="location.reload()">BACK</button>
            </div>
        `;
    } else {
        alert(platformName + " clicked! Coming soon...");
    }
}

// Serverləri backend-dən çəkib açmaq
function openFactionServers() {
    currentPlatform = 'pixelplanet-faction';
    const container = document.getElementById('main-container');

    let adminSection = '';
    if (isAdmin) {
        adminSection = `
            <div class="add-server-form">
                <h3 style="color:#00ffcc; font-size:0.7rem; margin-bottom:10px;">ADD NEW SERVER (ADMIN)</h3>
                <input type="text" id="serverName" placeholder="Server Name">
                <input type="text" id="serverFlag" placeholder="Flag Image URL (e.g. https://...)">
                <input type="text" id="serverDiscord" placeholder="Discord Invite Link">
                <button class="neon-btn" onclick="addServer()">Add Server</button>
            </div>
        `;
    }

    container.innerHTML = `
        <h1 class="neon-title" style="font-size: 1.2rem;">FACTION SERVERS</h1>
        
        <input type="text" id="searchInput" class="search-bar" placeholder="Search servers..." onkeyup="filterServers()">
        
        ${adminSection}

        <div class="server-list" id="serverListContainer">
            <p style="font-size:0.6rem; color:#888; text-align:center;">Loading servers...</p>
        </div>

        <div style="margin-top: 20px;">
            <button class="neon-option-btn" style="border-color: #00ffcc; color: #00ffcc; font-size: 0.6rem; padding: 10px 20px;" onclick="selectPlatform('pixelplanet')">BACK</button>
        </div>
    `;

    fetchServers();
}

let allServers = [];

// Backend-dən serverləri gətirən funksiya
function fetchServers() {
    fetch('/api/servers')
        .then(response => response.json())
        .then(data => {
            allServers = data;
            renderServers(allServers);
        })
        .catch(err => console.error('Error fetching servers:', err));
}

// Serverləri Ekrana Çıxarmaq
function renderServers(serversArray) {
    const listContainer = document.getElementById('serverListContainer');
    listContainer.innerHTML = '';

    if (serversArray.length === 0) {
        listContainer.innerHTML = '<p style="font-size:0.6rem; color:#888; text-align:center;">No servers found.</p>';
        return;
    }

    serversArray.forEach((server, index) => {
        let deleteBtn = '';
        if (isAdmin) {
            deleteBtn = `<button class="neon-btn red" style="padding: 5px 10px; font-size:0.5rem;" onclick="deleteServer(${index})">Delete</button>`;
        }

        const item = document.createElement('div');
        item.classList.add('server-item');
        item.innerHTML = `
            <div class="server-info">
                <img src="${server.flag}" class="server-flag" alt="Flag">
                <div class="server-details">
                    <h3>${server.name}</h3>
                    <a href="${server.discord}" target="_blank">Discord Invite Link</a>
                </div>
            </div>
            ${deleteBtn}
        `;
        listContainer.appendChild(item);
    });
}

// Yeni server əlavə etmək (Backend-ə göndərir)
function addServer() {
    const name = document.getElementById('serverName').value.trim();
    const flag = document.getElementById('serverFlag').value.trim();
    const discord = document.getElementById('serverDiscord').value.trim();

    if (!name || !flag || !discord) {
        alert("Please fill in all fields!");
        return;
    }

    fetch('/api/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, flag, discord })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            allServers = data.servers;
            renderServers(allServers);
            // Formu təmizlə
            document.getElementById('serverName').value = '';
            document.getElementById('serverFlag').value = '';
            document.getElementById('serverDiscord').value = '';
        }
    })
    .catch(err => console.error('Error adding server:', err));
}

// Server silmək (Backend-dən silir)
function deleteServer(index) {
    if (confirm("Are you sure you want to delete this server?")) {
        fetch(`/api/servers/${index}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                allServers = data.servers;
                renderServers(allServers);
            }
        })
        .catch(err => console.error('Error deleting server:', err));
    }
}

// Axtarış funksiyası
function filterServers() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allServers.filter(s => s.name.toLowerCase().includes(query));
    renderServers(filtered);
}
