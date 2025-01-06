// config.js
window.CONFIG = {
    API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000' 
        : 'http://task_manager_backend:8000',  // Will work inside Docker
};