/**
 * Session Timeout Handler
 * Monitors user activity and handles automatic logout after inactivity
 */
(function() {
    // Configuration
    const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
    const WARNING_BEFORE_TIMEOUT = 60 * 1000; // Show warning 1 minute before timeout
    const CHECK_INTERVAL = 10 * 1000; // Check every 10 seconds
    
    let lastActivity = Date.now();
    let warningDisplayed = false;
    let sessionTimeoutTimer;
    let checkActivityInterval;
    
    // Track user activity
    const activityEvents = [
        'mousedown', 'mousemove', 'keypress', 
        'scroll', 'touchstart', 'click', 'keydown'
    ];
    
    // Function to update last activity time
    function updateActivity() {
        lastActivity = Date.now();
        warningDisplayed = false;
        
        // If there's a warning modal shown, hide it
        const warningModal = document.getElementById('session-timeout-warning');
        if (warningModal && warningModal.style.display === 'flex') {
            warningModal.style.display = 'none';
        }
        
        // Check with server to keep session alive
        checkSessionWithServer();
    }
    
    // Add activity event listeners
    function setupActivityTracking() {
        activityEvents.forEach(event => {
            document.addEventListener(event, updateActivity, false);
        });
    }
    
    // Check session with server
    function checkSessionWithServer() {
        fetch('/api/check-session')
            .then(response => response.json())
            .then(data => {
                if (!data.valid) {
                    // Session is invalid, redirect to login
                    window.location.href = '/login';
                }
            })
            .catch(error => {
                console.error('Error checking session:', error);
            });
    }
    
    // Check for inactivity
    function checkInactivity() {
        const elapsed = Date.now() - lastActivity;
        
        // If close to timeout, show warning
        if (elapsed > (INACTIVITY_TIMEOUT - WARNING_BEFORE_TIMEOUT) && !warningDisplayed) {
            showTimeoutWarning();
            warningDisplayed = true;
        }
        
        // If timeout reached, logout
        if (elapsed >= INACTIVITY_TIMEOUT) {
            logout();
        }
    }
    
    // Show timeout warning modal
    function showTimeoutWarning() {
        // Create warning modal if it doesn't exist
        let warningModal = document.getElementById('session-timeout-warning');
        
        if (!warningModal) {
            warningModal = document.createElement('div');
            warningModal.id = 'session-timeout-warning';
            warningModal.innerHTML = `
                <div class="timeout-modal">
                    <h3>Session Expiring Soon</h3>
                    <p>Your session will expire in 1 minute due to inactivity.</p>
                    <div class="timeout-actions">
                        <button id="session-stay-active">Stay Active</button>
                        <button id="session-logout">Logout Now</button>
                    </div>
                </div>
            `;
            
            // Style the modal
            const modalStyles = {
                'position': 'fixed',
                'top': '0',
                'left': '0',
                'right': '0',
                'bottom': '0',
                'background-color': 'rgba(0, 0, 0, 0.5)',
                'z-index': '9999',
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center'
            };
            
            const timeoutModalStyles = {
                'background-color': 'white',
                'color': '#333',
                'padding': '20px',
                'border-radius': '8px',
                'box-shadow': '0 4px 12px rgba(0, 0, 0, 0.15)',
                'width': '400px',
                'max-width': '90%',
                'text-align': 'center'
            };
            
            const actionsStyles = {
                'display': 'flex',
                'justify-content': 'center',
                'gap': '10px',
                'margin-top': '20px'
            };
            
            const buttonStyles = {
                'padding': '8px 16px',
                'border-radius': '4px',
                'border': 'none',
                'cursor': 'pointer',
                'font-weight': 'bold'
            };
            
            Object.assign(warningModal.style, modalStyles);
            Object.assign(warningModal.querySelector('.timeout-modal').style, timeoutModalStyles);
            Object.assign(warningModal.querySelector('.timeout-actions').style, actionsStyles);
            
            const buttons = warningModal.querySelectorAll('button');
            buttons.forEach(button => {
                Object.assign(button.style, buttonStyles);
            });
            
            // Style the stay active button
            const stayActiveButton = warningModal.querySelector('#session-stay-active');
            Object.assign(stayActiveButton.style, {
                'background-color': '#4CAF50',
                'color': 'white'
            });
            
            // Style the logout button
            const logoutButton = warningModal.querySelector('#session-logout');
            Object.assign(logoutButton.style, {
                'background-color': '#f44336',
                'color': 'white'
            });
            
            document.body.appendChild(warningModal);
            
            // Add event listeners
            document.getElementById('session-stay-active').addEventListener('click', function() {
                updateActivity();
            });
            
            document.getElementById('session-logout').addEventListener('click', function() {
                logout();
            });
        }
        
        warningModal.style.display = 'flex';
    }
    
    // Logout function
    function logout() {
        window.location.href = '/logout';
    }
    
    // Start monitoring
    function startSessionMonitoring() {
        // Only start monitoring if not on login page
        if (window.location.pathname !== '/login') {
            setupActivityTracking();
            updateActivity(); // Set initial activity timestamp
            
            // Set up periodic check
            checkActivityInterval = setInterval(checkInactivity, CHECK_INTERVAL);
        }
    }
    
    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startSessionMonitoring);
    } else {
        startSessionMonitoring();
    }
})(); 