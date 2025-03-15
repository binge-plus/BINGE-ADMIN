document.addEventListener('DOMContentLoaded', function() {
    const castContainer = document.getElementById('castContainer');
    const episodesContainer = document.getElementById('episodesContainer');
    const addCastBtn = document.getElementById('addCastBtn');
    const addEpisodeBtn = document.getElementById('addEpisodeBtn');
    const form = document.getElementById('seriesForm');

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
        const episodeCount = episodesContainer.children.length;
        const episodeDiv = document.createElement('div');
        episodeDiv.className = 'episode-row';
        episodeDiv.innerHTML = `
            <div class="episode-number">
                <label>Episode #</label>
                <input type="number" name="episodes[${episodeCount}][EpisodeNumber]" 
                       value="${episodeCount + 1}" min="1" class="input-field">
            </div>
            <div class="episode-title">
                <label>Episode Title</label>
                <input type="text" name="episodes[${episodeCount}][EpisodeTitle]" 
                       placeholder="Episode title" class="input-field">
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
        const formData = new FormData(form);
        const seriesData = {
            title: formData.get('title'),
            imageH: formData.get('imageH'),
            imageV: formData.get('imageV'),
            details: formData.get('details'),
            Quality: formData.get('quality'),
            rating: formData.get('rating'),
            releaseDate: formData.get('releaseDate'),
            cast: Array.from(formData.getAll('cast[]')).filter(c => c !== ''),
            genre: formData.get('genre'),
            director: formData.get('director'),
            trailer: formData.get('trailer'),
            episodes: []
        };

        // Process episodes
        const episodeInputs = episodesContainer.getElementsByClassName('episode-row');
        Array.from(episodeInputs).forEach((row, index) => {
            seriesData.episodes.push({
                EpisodeNumber: parseInt(row.querySelector('input[type="number"]').value),
                EpisodeTitle: row.querySelector('input[type="text"]').value
            });
        });

        // Send data to server using the existing /series route
        fetch('/series', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(seriesData)
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                return response.json().then(data => {
                    throw new Error(data.message || 'Error adding series');
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(error.message);
        });
    });
});

function removeEpisode(button) {
    const episodeRow = button.parentElement;
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