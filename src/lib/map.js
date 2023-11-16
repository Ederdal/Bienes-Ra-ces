document.addEventListener('DOMContentLoaded', function() {
    const lat = 20.618093;
    const lng = -97.820247;
    const map = L.map('map').setView([lat, lng], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright"> openstreetmap</a> contributors'
    }).addTo(map);
});
