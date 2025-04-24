// Expose environment variables to frontend
(function() {
    // Create a global configuration object
    window.ENV = {
        IP: '34.55.187.199',
        ADMIN_PAGE_PORT: '3001'
    };

    // Optional: Update links with environment variables
    document.addEventListener('DOMContentLoaded', () => {
        const linksToUpdate = document.querySelectorAll('.link-primary[data-env-url]');
        
        linksToUpdate.forEach(link => {
            const baseUrl = link.getAttribute('data-env-url');
            link.href = `http://${window.ENV.IP}:${window.ENV.ADMIN_PAGE_PORT}${baseUrl}`;
        });
    });
})(); 