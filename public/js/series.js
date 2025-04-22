document.addEventListener('DOMContentLoaded', function() {
    const castContainer = document.getElementById('castContainer');
    const addCastBtn = document.getElementById('addCastBtn');
    const episodesContainer = document.getElementById('episodesContainer');
    const addEpisodeBtn = document.getElementById('addEpisodeBtn');
    const form = document.getElementById('seriesForm');
    const formStatus = document.getElementById('formStatus');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    // Function to show notification
    function showNotification(message, type = 'default') {
        notification.className = 'notification';
        if (type === 'success') {
            notification.classList.add('success');
            notification.querySelector('.notification-icon').className = 'ri-check-line notification-icon';
        } else if (type === 'error') {
            notification.classList.add('error');
            notification.querySelector('.notification-icon').className = 'ri-error-warning-line notification-icon';
        }
        
        notificationMessage.textContent = message;
        notification.style.display = 'flex';
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    // Add cast member
    addCastBtn.addEventListener('click', function() {
        const castDiv = document.createElement('div');
        castDiv.className = 'cast-member';
        castDiv.innerHTML = `
            <input type="text" name="cast[]" placeholder="Actor name" class="input-field">
            <button type="button" class="button-outline remove-btn" onclick="this.parentElement.remove()">
                <i class="ri-delete-bin-line"></i>
            </button>
        `;
        castContainer.appendChild(castDiv);
    });

    // Add episode
    addEpisodeBtn.addEventListener('click', function() {
        const episodeCount = document.querySelectorAll('.episode-row').length;
        const episodeDiv = document.createElement('div');
        episodeDiv.className = 'episode-row';
        episodeDiv.innerHTML = `
            <div class="episode-number">
                <label>Episode #</label>
                <input type="number" name="episodes[${episodeCount}][EpisodeNumber]" value="${episodeCount + 1}" min="1" class="input-field">
            </div>
            <div class="episode-title">
                <label>Episode Title</label>
                <input type="text" name="episodes[${episodeCount}][EpisodeTitle]" placeholder="Episode title" class="input-field">
            </div>
            <button type="button" class="button-outline remove-btn" onclick="removeEpisode(this)">
                <i class="ri-delete-bin-line"></i>
            </button>
        `;
        episodesContainer.appendChild(episodeDiv);
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading indicator
        formStatus.className = 'loading';
        formStatus.textContent = 'Saving series...';
        
        // Process episodes data
        const episodes = [];
        const episodeRows = document.querySelectorAll('.episode-row');
        
        episodeRows.forEach((row, index) => {
            const episodeNumber = row.querySelector('input[name$="[EpisodeNumber]"]').value;
            const episodeTitle = row.querySelector('input[name$="[EpisodeTitle]"]').value;
            
            episodes.push({
                EpisodeNumber: episodeNumber,
                EpisodeTitle: episodeTitle
            });
        });

        // Collect all form data
        const formData = new FormData(form);
        const seriesData = {
            title: formData.get('title'),
            imageH: formData.get('imageH'),
            imageV: formData.get('imageV'),
            details: formData.get('details'),
            quality: formData.get('quality'),
            rating: formData.get('rating'),
            releaseDate: formData.get('releaseDate'),
            cast: Array.from(formData.getAll('cast[]')).filter(c => c !== ''),
            genre: formData.get('genre'),
            director: formData.get('director'),
            trailer: formData.get('trailer'),
            episodes: episodes
        };

        console.log('Submitting series data:', seriesData);

        // Send data to server
        fetch('/series', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(seriesData)
        })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) {
                    throw new Error(data.message || 'Error adding series');
                }
                return data;
            });
        })
        .then(data => {
            // Clear form status
            formStatus.className = '';
            formStatus.textContent = '';
            
            console.log('Success response:', data);
            
            // Show success message
            showNotification('Series added successfully!', 'success');
            
            // Reset form for new entry
            form.reset();
            
            // Reset episodes and cast
            while (episodesContainer.children.length > 1) {
                episodesContainer.lastChild.remove();
            }
            
            while (castContainer.children.length > 1) {
                castContainer.lastChild.remove();
            }
            
            // Reset first episode input
            const firstEpisode = episodesContainer.querySelector('.episode-row');
            if (firstEpisode) {
                firstEpisode.querySelector('input[type="number"]').value = '1';
                firstEpisode.querySelector('input[type="text"]').value = '';
            }
            
            // Scroll to top of form
            form.scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
            // Clear loading status
            formStatus.className = '';
            formStatus.textContent = '';
            
            console.error('Error:', error);
            showNotification(`Error adding series: ${error.message}`, 'error');
        });
    });
});

function removeEpisode(button) {
    const episodeRow = button.parentElement;
    const episodesContainer = document.getElementById('episodesContainer');
    
    if (episodesContainer.children.length > 1) {
        episodeRow.remove();
        // Update episode numbers
        Array.from(episodesContainer.children).forEach((row, index) => {
            const numberInput = row.querySelector('input[type="number"]');
            numberInput.value = index + 1;
            numberInput.name = `episodes[${index}][EpisodeNumber]`;
            row.querySelector('input[type="text"]').name = `episodes[${index}][EpisodeTitle]`;
        });
    }
} 