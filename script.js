// --- 1. Nümunə Oyun Məlumatları (Gələcəkdə bunu JSON faylından və ya bazadan çəkəcəyik)
const games = [
    {
        title: "Super Pixel Adventure",
        description: "Mükəmməl platforma oyunu.",
        image: "https://img.itch.zone/aW1hZ2UvMTgzMDY3Lzk1NjI5Ny5wbmc=/original/V6%2F5%2B9.png"
    },
    {
        title: "Cyber Neon Dungeon",
        description: "Kibertank üslubunda zindan döyüşü.",
        image: "https://img.itch.zone/aW1hZ2UvMjgzMDY3Lzk1NjI5Ny5wbmc=/original/V6%2F5%2B9.png"
    }
];

// --- 2. Oyunları Ekrana Çıxaran Funksiya ---
function displayGames(gamesToDisplay) {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = ''; // Əvvəlki siyahını təmizləyirik

    gamesToDisplay.forEach(game => {
        const card = document.createElement('div');
        card.classList.add('game-card');
        
        card.innerHTML = `
            <img src="${game.image}" alt="${game.title}">
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <button class="neon-btn small">Oyna</button>
        `;
        
        grid.appendChild(card);
    });
}

// Səhifə açıldıqda oyunları göstər
displayGames(games);

// --- 3. Axtarış Sistemi ---
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(searchText)
    );
    displayGames(filteredGames);
});

// --- 4. Sadə Canlı Çat Funksiyası (Gələcəkdə Socket.io ilə birləşəcək)
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chat-messages');

sendBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (text !== '') {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        msgDiv.innerHTML = `<strong>İstifadəçi:</strong> ${text}`;
        chatMessages.appendChild(msgDiv);
        
        // Mesaj yazıldıqdan sonra inputu təmizlə və aşağı sürüşdür
        messageInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

// Enter düyməsi ilə də mesaj göndərə bilmək üçün
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
