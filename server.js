const express = require('express');
const app = express();
const path = require('path');

// Frontend fayllarını (HTML, CSS, JS) oxuması üçün
app.use(express.static(path.join(__dirname, 'public'))); // və ya sadəcə ana qovluq

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda uğurla işləyir!`);
});
