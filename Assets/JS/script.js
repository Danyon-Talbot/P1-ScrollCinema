document.getElementById('hideMenu').addEventListener('click', function() {
    const wrapperDiv = document.getElementById('wrapperDiv');
    const resultsSection = document.getElementById('resultsSection');
    const hideMenuButton = document.getElementById('hideMenu');

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
    hideMenuButton.textContent = "Show Menu";
} else {
    // Resets pages layout classes
    wrapperDiv.classList.remove("hidden");
    resultsSection.classList.remove("w-full");
    resultsSection.classList.add("lg:w-2/3");
    hideMenuButton.textContent = "Hide Menu";
}
});
var previouslyRecommended = [];

document.getElementById('searchBtn').addEventListener('click', fetchRecommendations);
document.getElementById('moreSuggestions').addEventListener('click', fetchMoreRecommendations);

function displayMovies(recommendations) {
    const recommendedMoviesContainer = document.getElementById('recommendedMovies');
    recommendations.forEach(movie => {
        const movieContainer = document.createElement('div');
        //Styles the Movie Container element
        movieContainer.classList.add('recommendedMovie', 'flex', 'flex-col', 'grid', 'grid-flow-col', 'justify-start', 'border-2', 'border-black', 'max-h-[400px]', 'm-4');

        // Creates the Poster Container element
        const posterContainer = document.createElement('div');
        // Styles the Poster Container element
        posterContainer.classList.add('recommendedPosterContainer', 'max-w-[200px]', 'max-h-[300px]', 'min-w-[200px]', 'min-h-[300px]');

        // Creates the Poster img element within Poster Container
        const poster = document.createElement('img');
        poster.classList.add('recommendedPoster');
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

        // Creates the Movie info element 
        const movieInfo = document.createElement('div');
        // Positions the Movie info element
        movieInfo.classList.add('recommendedInfo', 'text-left', 'grid', 'grid-auto-flow-row', 'py-4', 'px-8');

        // Creates a header element for the title
        const title = document.createElement('h3');
        title.classList.add('movieTitle');
        // fills it with the called API information
        title.textContent = movie.title;

        // Creates the recommended movie ratings element
        const movieRatings = document.createElement('div');
        movieRatings.classList.add('recommendedRatings');

        // Adds the title for the recommended movie ratings element
        const ratingsTitle = document.createElement('h4');
        ratingsTitle.textContent = 'Movie Ratings:';

        // Adds the TMDB rating pulled from the API
        const tmdbRating = document.createElement('p');
        tmdbRating.innerHTML = `TMDB: <span class="tmdbRating">${movie.vote_average}/10</span>`;

        // Adds a container to store the year
        const releaseYearContainer = document.createElement('div');
        releaseYearContainer.classList.add('recommendedYear');

        // Adds the movie release date Year
        const releaseYear = document.createElement('p');
        releaseYear.innerHTML = `Release Year: <span class="releaseYear">${movie.release_date.split('-')[0]}</span>`;

        // Adds the Movie Description container
        const movieDescriptionContainer = document.createElement('div');
        movieDescriptionContainer.classList.add('recommendedDescription');

        // Adds Movie Description container with the movie overview pulled from the API
        const movieDescription = document.createElement('p');
        movieDescription.innerHTML = `Description Of Movie: <span class="movieDescription">${movie.overview}</span>`;

        // Appends each component under the necessary parent
        posterContainer.appendChild(poster);

        movieRatings.appendChild(ratingsTitle);
        movieRatings.appendChild(tmdbRating);

        releaseYearContainer.appendChild(releaseYear);

        movieDescriptionContainer.appendChild(movieDescription);

        movieInfo.appendChild(title);
        movieInfo.appendChild(movieRatings);
        movieInfo.appendChild(releaseYearContainer);
        movieInfo.appendChild(movieDescriptionContainer);

        movieContainer.appendChild(posterContainer);
        movieContainer.appendChild(movieInfo);

        recommendedMoviesContainer.appendChild(movieContainer);
    });
}

// Function to save search history to local storage
function saveToHistory(movieTitle) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(movieTitle)) {
        history.push(movieTitle);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
}

// Function to display search history in the modal
function showHistory() {
    const historyList = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    historyList.innerHTML = '';
    history.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.textContent = movie;
        historyList.appendChild(listItem);
    });
    document.getElementById('historyModal').classList.remove('hidden');
}

// Event listener for the search history button
document.getElementById('showHistory').addEventListener('click', showHistory);

// Event listener to close the search history modal
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('historyModal').classList.add('hidden');
});

function fetchRecommendations(event) {
    event.preventDefault(); // Prevents the form from submitting and also refreshing the page

    const movieTitle = document.getElementById('movieTitle').value; // <<< This was missing

    // Save the movie title to search history
    saveToHistory(movieTitle);

    // Clears the generated HTML whenever clicked. Functions to refresh the suggestions on a new search.
    document.getElementById('recommendedMovies').innerHTML = '';

    // Hide the landing-page section
    document.getElementById('landing-page').style.display = 'none';

    // Displays Confirmation Container
    document.getElementById("confirmationContainer").classList.remove("hidden");

    // Displays generated suggestions Title
    document.getElementById("generatedMovieTitle").classList.remove("hidden");

    // Restyles the border of the form container to be flush with the confirmation container
    const formStyle = document.getElementById("formContainer")
    formStyle.style.borderBottomRightRadius = 0;
    formStyle.style.borderBottomLeftRadius = 0;

    // Show the scrollableContainer
    document.getElementById("scrollableContainer").style.display="flex";

    document.getElementById("moreSuggestions").style.display="flex";

    fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=8a6dca2d`)
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

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=9f1e8d32975dba0b02e052bf00f515de&query=${encodeURIComponent(movieTitle)}`)
    .then(response => response.json())
    .then(data => {
        const movieId = data.results[0].id;
        return fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=9f1e8d32975dba0b02e052bf00f515de`);
    })
    .then(response => response.json())
    .then(data => {
        // Filter out movies that were previously recommended and get the top 5 recommendations.
        const newRecommendations = data.results.filter(movie => !previouslyRecommended.includes(movie.id)).slice(0, 5);

        // Add the new movie recommendations to the list of previously recommended movies.
        newRecommendations.forEach(movie => {
            previouslyRecommended.push(movie.id);
        });
        // Calls the display movie function to create and append Movie information
        displayMovies(newRecommendations);
    })
    .catch(error => console.error('TMDB Error:', error));
}

// This function fetches more movie recommendations based on the movie title entered by the user.
function fetchMoreRecommendations() {
    const movieTitle = document.getElementById('movieTitle').value;

    // Fetchs movie recommendations from The Movie Database (TMDB) based on the entered movie title.
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=9f1e8d32975dba0b02e052bf00f515de&query=${encodeURIComponent(movieTitle)}`)
    .then(response => response.json())
    .then(data => {
        const movieId = data.results[0].id;
        return fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=9f1e8d32975dba0b02e052bf00f515de`);
    })
    .then(response => response.json())
    .then(data => {
        // Filters out movies that were previously recommended and get the top 5 recommendations.
        const newRecommendations = data.results.filter(movie => !previouslyRecommended.includes(movie.id)).slice(0, 5);

        // THIS IS A WIP, I HAVE NOT GOTTEN IT TO PROPERLY WORK
        if (newRecommendations.length === 0) {
            showModal(); // This will display the modal when there are no new movies to suggest
            return;
        }

        // Add the new movie recommendations to the list of previously recommended movies.       
        newRecommendations.forEach(movie => {
            previouslyRecommended.push(movie.id);
        });

        // Calls the displayMovie function to generate the new movie suggestions
        displayMovies(newRecommendations);
    })
    .catch(error => console.error('TMDB Error:', error));
}

let noMovies = document.getElementById("noMoviesModal");
let closeButton = document.querySelector("#close-button");

closeButton.addEventListener("click", function() {
    noMovies.style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target === noMovies) {
        noMovies.style.display = "none";
    }
});

function showModal() {
    noMovies.style.display = "flex";
}
