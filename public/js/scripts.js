document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const card = document.querySelector('.card');
    const inputs = document.querySelectorAll('.input-field');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Add focus effects to inputs
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
        });
    });

    // Add mousemove effect for card if VanillaTilt is not available
    if (!window.VanillaTilt && card) {
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
    }

    themeToggle?.addEventListener('click', function() {
        const currentTheme = body.getAttribute('theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }

    function handleMouseMove(e) {
        const { left, top, width, height } = this.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        const tiltX = (y - 0.5) * 10;
        const tiltY = (0.5 - x) * 10;
        
        this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
    }

    function handleMouseLeave() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }

    // Add floating animation to background shapes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const delay = index * 0.2;
        shape.style.animationDelay = `${delay}s`;
    });
}); 