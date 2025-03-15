document.addEventListener('DOMContentLoaded', function() {
    const castContainer = document.getElementById('castContainer');
    const addCastBtn = document.getElementById('addCastBtn');
    const form = document.getElementById('movieForm');

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

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const movieData = {
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
            visitMovie: formData.get('visitMovie'),
            trailer: formData.get('trailer'),
            isMarvel: formData.get('Marvel') === '1'
        };

        // Send data to server using the existing /movie route
        fetch('/movie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieData)
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                return response.json().then(data => {
                    throw new Error(data.message || 'Error adding movie');
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(error.message);
        });
    });
}); 