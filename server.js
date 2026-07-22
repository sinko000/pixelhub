const express = require('express');
const app = express();
const path = require('path');

// Ana qovluqdakı HTML, CSS və JS fayllarını birbaşa oxuması üçün:
app.use(express.static(__dirname));

// Əgər saytın kök ünvanına (/) girilərsə, index.html faylını göstər:
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda uğurla işləyir!`);
});
