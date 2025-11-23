// src/public/app.js

tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#6366f1', // Indigo (matching your Next.js look)
                secondary: '#1f2937',
            }
        }
    }
};

// Initialize Icons
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
});

// Helper to refresh icons after Alpine updates DOM
window.refreshIcons = () => {
    if (window.lucide) {
        setTimeout(() => lucide.createIcons(), 50);
    }
};