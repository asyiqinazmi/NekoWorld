document.addEventListener("DOMContentLoaded", function() {
  fetchTopAnime(); // Fetch top anime on page load
});

// Function to fetch and display top anime
function fetchTopAnime() {
  fetch('https://api.jikan.moe/v4/top/anime?limit=24')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Top Anime API response:', data);
      if (data.data && data.data.length > 0) {
        document.getElementById('trending-title').style.display = 'block'; // Show the Trending title
        displayAnimeResults(data.data.slice(0, 24)); // Display only the top 24 results
      } else {
        displayErrorMessage('No anime found');
      }
    })
    .catch((error) => {
      console.error('Error fetching top anime:', error);
      displayErrorMessage('Error fetching top anime. Please try again later.');
    });
}

// Function to display anime results on the page
function displayAnimeResults(animeData) {
  var resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ''; // Clear previous results

  animeData.forEach((anime, index) => {
    var animeContainer = document.createElement("div");
    animeContainer.classList.add("anime-container");

    var rank = document.createElement("p");
    rank.innerText = `#${index + 1}`; // Display rank number
    rank.classList.add("anime-rank");
    animeContainer.appendChild(rank); // Append rank first

    var animeTitle = document.createElement("p");
    animeTitle.innerText = anime.title;
    animeTitle.classList.add("anime-title");
    animeContainer.appendChild(animeTitle); // Append title after rank

    var animeImage = document.createElement("img");
    animeImage.src = anime.images.jpg.image_url;
    animeImage.alt = "Anime Image";
    animeImage.classList.add("anime-image");
    animeContainer.appendChild(animeImage); // Append image last

    resultsContainer.appendChild(animeContainer);

    animeContainer.addEventListener('click', function() {
      window.location.href = `detail.html?id=${anime.mal_id}`;
    });
  });
}

// Function to display error message on the page
function displayErrorMessage(message) {
  var resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ''; // Clear previous results

  var errorMessage = document.createElement("p");
  errorMessage.innerText = message;
  resultsContainer.appendChild(errorMessage);
}

// Function to search anime based on user input
function searchAnime() {
  var title = document.getElementById("anime_name").value.trim(); // Trim to remove leading/trailing whitespace

  // Hide the Trending title when searching
  document.getElementById('trending-title').style.display = 'none';

  fetch(`https://api.jikan.moe/v4/anime?q=${title}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Search Anime API response:', data);
      if (data.data && data.data.length > 0) {
        displayAnimeResults(data.data); // Call function to display results
      } else {
        displayErrorMessage('No anime found');
      }
    })
    .catch((error) => {
      console.error('Error searching anime:', error);
      displayErrorMessage('Error searching anime. Please try again later.');
    });
}