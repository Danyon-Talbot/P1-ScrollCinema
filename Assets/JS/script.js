document.getElementById('hideMenu').addEventListener('click', function() {
    const wrapperDiv = document.getElementById('wrapperDiv');
    const resultsSection = document.getElementById('resultsSection');

//   Checks if the wrapperDiv is visible  
if (getComputedStyle(wrapperDiv).display !== "none") {
    // Sets it to hidden on button click
    wrapperDiv.classList.add('hidden');
    // Removes the lg:w-2/3 limit to the width of the section
    resultsSection.classList.remove("lg:w-2/3");
    if (window.innerWidth <= 1024) {
        //Ensures that if the page is 1024px width or smaller, the section covers the full width
        resultsSection.classList.add("w-full");
    } else {
        // If the page is not 1024px or smaller, removes both limitations
        resultsSection.classList.remove("w-full", "lg:w-2/3");
    }
} else {
    // Resets pages layout classes
    wrapperDiv.classList.remove("hidden");
    resultsSection.classList.remove("w-full");
    resultsSection.classList.add("lg:w-2/3");

}
});
// Listen for a click event on the search button
document.getElementById('searchBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevents the form from submitting and also refreshing the page

    // Hide the landing-page section
    document.getElementById('landing-page').style.display = 'none';

    // Displays Confirmation Container
    document.getElementById("confirmationContainer").classList.remove("hidden")

    // Restyles the border of the form container to be flush with the confirmation container
    const formStyle = document.getElementById("formContainer")
    formStyle.style.borderBottomRightRadius = 0;
    formStyle.style.borderBottomLeftRadius = 0;

    // Show the scrollableContainer
    document.getElementById('scrollableContainer').style.display = 'block';

    // Gets the movie title entered
    const movieTitle = document.getElementById('movieTitle').value;

    // Makes fetch request to OMDB API
    fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=8a6dca2d`)
        .then(response => response.json())
        .then(data => {
            // Update the poster with fetched data
            document.getElementById('sourcedPoster').src = data.Poster;

            // Updates the ratings and description
            document.getElementById('ratings').innerHTML = `
                <h4>Movie Ratings:</h4>
                <p>Rotten Tomatoes: ${data.Ratings.find(rating => rating.Source === 'Rotten Tomatoes').Value}</p>
                <p>OMDB: ${data.Ratings.find(rating => rating.Source === 'Internet Movie Database').Value}</p>
            `;
            document.getElementById('description').innerHTML = `
                <p>${data.Plot}</p>
            `;
        })
        .catch(error => console.error('Error:', error)); // Handles errors made during fetch.
});

document.getElementById('searchBtn').addEventListener('click', function(event) {
    event.preventDefault();

    const movieTitle = document.getElementById('movieTitle').value;

    // First Fetch to Search for the movie and get its ID
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=9f1e8d32975dba0b02e052bf00f515de&query=${encodeURIComponent(movieTitle)}`)
        .then(response => response.json())
        .then(data => {
            const movieId = data.results[0].id; // Get the ID of the first search result
            
            // Second Fetch to Get 5 similar movies based on the ID
            fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=9f1e8d32975dba0b02e052bf00f515de`)
                .then(response => response.json())
                .then(data => {
                    const recommendedMovies = data.results.slice(0, 5);

                    recommendedMovies.forEach((movie, index) => {
                        const movieContainer = document.getElementById(`recommendedMovie${index + 1}`);
                        movieContainer.querySelector('.movieTitle').textContent = movie.title;
                        movieContainer.querySelector('.recommendedPoster').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                        movieContainer.querySelector('.tmdbRating').textContent = `${movie.vote_average}/10`;
                        movieContainer.querySelector('.releaseYear').textContent = movie.release_date.split('-')[0];
                        movieContainer.querySelector('.movieDescription').textContent = movie.overview;
                        movieContainer.classList.remove('hidden');
                    });
                })
                .catch(error => console.error('TMDB Error:', error));
        })
        .catch(error => console.error('TMDB Error:', error));
});
    // if (wrapperDiv.style.display !== 'none') {
    //     // If visible, hide the wrapperDiv and expand the resultsSection
    //      wrapperDiv.style.display = 'none';
    //     resultsSection.style.width = '100%';
    // } else {
    //     // If not visible, show the wrapperDiv and revert the resultsSection width
    //     wrapperDiv.style.display = 'flex';
    //     resultsSection.style.width = 'calc(100% - 33.33333%)'; // Adjust '--width-of-wrapperDiv' to the original width of the wrapperDiv
    // } 