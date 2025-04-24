document.addEventListener('DOMContentLoaded', () => {
    // Get search elements from header
    const searchInput = document.getElementById('dashboard-search');
    const searchButton = document.getElementById('search-button');
    const dashboardCards = document.querySelectorAll('.dashboard-card');

    // Development Stage Prompt for links
    const developmentLinks = document.querySelectorAll('a.card-link[href="#"]');
    developmentLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Create custom modal with advanced styling and animations
            const modal = document.createElement('div');
            modal.innerHTML = `
                <style>
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.8); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    @keyframes floatConstruction {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    .dev-modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.6);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                        backdrop-filter: blur(5px);
                        animation: fadeIn 0.3s ease-out;
                    }
                    .dev-modal-content {
                        background: linear-gradient(135deg, #ffffff, #f0f0f0);
                        padding: 2.5rem;
                        border-radius: 20px;
                        text-align: center;
                        max-width: 500px;
                        width: 90%;
                        box-shadow: 0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05);
                        position: relative;
                        overflow: hidden;
                        animation: fadeIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        border: 2px solid rgba(229, 9, 20, 0.1);
                    }
                    .dev-modal-icon {
                        font-size: 5rem;
                        color: #e50914;
                        margin-bottom: 1rem;
                        display: inline-block;
                        animation: floatConstruction 2s ease-in-out infinite;
                    }
                    .dev-modal-title {
                        color: #e50914;
                        margin-bottom: 1rem;
                        font-size: 1.8rem;
                        font-weight: 700;
                    }
                    .dev-modal-description {
                        color: #333;
                        margin-bottom: 1.5rem;
                        line-height: 1.6;
                    }
                    .dev-modal-close {
                        background-color: #e50914;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    }
                    .dev-modal-close:hover {
                        background-color: #ff1a1a;
                        animation: pulse 0.5s;
                    }
                    .dev-modal-close::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent);
                        transition: all 0.5s ease;
                    }
                    .dev-modal-close:hover::before {
                        left: 100%;
                    }
                </style>
                <div class="dev-modal-overlay">
                    <div class="dev-modal-content">
                        <div class="dev-modal-icon">🚧</div>
                        <h2 class="dev-modal-title">Under Development</h2>
                        <p class="dev-modal-description">
                            This feature is currently in the works! Our team is diligently crafting an amazing experience. 
                            Check back soon for exciting updates and new functionalities.
                        </p>
                        <button id="close-dev-modal" class="dev-modal-close">
                            Got It, Thanks!
                        </button>
                    </div>
                </div>
            `;
            
            // Append modal to body
            document.body.appendChild(modal);
            
            // Close modal functionality
            const modalOverlay = modal.querySelector('.dev-modal-overlay');
            const closeButton = modal.querySelector('#close-dev-modal');
            
            // Close on button click
            closeButton.addEventListener('click', () => {
                modalOverlay.style.animation = 'fadeIn 0.3s ease-out reverse';
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            });
            
            // Close when clicking outside
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    modalOverlay.style.animation = 'fadeIn 0.3s ease-out reverse';
                    setTimeout(() => {
                        document.body.removeChild(modal);
                    }, 300);
                }
            });
        });
    });

    // Search function
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        dashboardCards.forEach(card => {
            const cardTitle = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const cardText = card.querySelector('.card-text')?.textContent.toLowerCase() || '';

            // Check if search term matches title or description
            const isMatch = cardTitle.includes(searchTerm) || cardText.includes(searchTerm);

            // Show or hide card based on match
            if (isMatch) {
                card.closest('.col').style.display = 'block';
            } else {
                card.closest('.col').style.display = 'none';
            }
        });

        // Optional: Show message if no results found
        const visibleCards = document.querySelectorAll('.dashboard-card:not([style*="display: none"])');
        if (visibleCards.length === 0) {
            alert('No matching dashboards found.');
        }
    }

    // Add event listeners if elements exist
    if (searchInput && searchButton) {
        // Search on button click
        searchButton.addEventListener('click', performSearch);

        // Search on Enter key press
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });

        // Reset to show all cards when input is cleared
        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim() === '') {
                dashboardCards.forEach(card => {
                    card.closest('.col').style.display = 'block';
                });
            }
        });
    }
}); 