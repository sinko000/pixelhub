const express = require('express');
const app = express();
const path = require('path');

// POST sorğularından gələn JSON məlumatlarını oxuya bilmək üçün
app.use(express.json());
app.use(express.static(__dirname));

// Serverləri saxlamaq üçün ümumi massiv (Bütün istifadəçilər bunu görəcək)
let servers = [
    { name: "Alpha Empire", flag: "https://flagcdn.com/w320/us.png", discord: "https://discord.gg/example" }
];

// Serverlərin siyahısını gətirən API
app.get('/api/servers', (req, res) => {
    res.json(servers);
});

// Yeni server əlavə edən API
app.post('/api/servers', (req, res) => {
    const { name, flag, discord } = req.body;
    if (name && flag && discord) {
        servers.push({ name, flag, discord });
        res.json({ success: true, servers });
    } else {
        res.status(400).json({ success: false, message: 'All fields are required' });
    }
});

// Server silən API
app.delete('/api/servers/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < servers.length) {
        servers.splice(index, 1);
        res.json({ success: true, servers });
    } else {
        res.status(400).json({ success: false, message: 'Invalid index' });
    }
});

// Ana səhifə marşrutu
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda uğurla işləyir!`);
});
