document.addEventListener('DOMContentLoaded', function() {
  var urlParams = new URLSearchParams(window.location.search);
  var animeId = urlParams.get('id');
  fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
    .then(response => {
      console.log('Raw response:', response);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Anime detail:', data);
      var anime = data.data;

      document.getElementById('anime_title').innerText = anime.title;
      document.getElementById('anime_image').src = anime.images.jpg.image_url;
      document.getElementById('anime_synopsis').innerText = anime.synopsis;
      document.getElementById('anime_score').innerText = `Score: ${anime.score}`;
      document.getElementById('anime_rank').innerText = `Rank: ${anime.rank}`;
      document.getElementById('anime_popularity').innerText = `Popularity: ${anime.popularity}`;
      document.getElementById('anime_episodes').innerText = `Episodes: ${anime.episodes}`;
      document.getElementById('anime_type').innerText = `Type: ${anime.type}`;
      document.getElementById('anime_genres').innerText = `Genres: ${anime.genres.map(genre => genre.name).join(', ')}`;
      document.getElementById('anime_producers').innerText = `Producers: ${anime.producers.map(producer => producer.name).join(', ')}`;
      document.getElementById('anime_source').innerText = `Source: ${anime.source}`;
      document.getElementById('anime_rating').innerText = `Rating: ${anime.rating}`;
      document.getElementById('anime_release').innerText = `Release: ${anime.aired.string}`;
      document.getElementById('anime_schedule').innerText = `Schedule: ${anime.broadcast.string}`;
      document.getElementById('anime_link').href = anime.url;

      document.getElementById('add_to_wishlist').addEventListener('click', function() {
        addToWishlist(anime);
      });

      document.getElementById('review_button').addEventListener('click', function() {
      window.location.href = `review.html?anime=${JSON.stringify(anime)}&title=${anime.title}`;
    });

    })
    .catch(error => {
      console.error('Error fetching anime details:', error);
      document.getElementById('anime_details').innerText = 'Error fetching anime details.';
    });
});
  
function addToWishlist(anime) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  if (!wishlist.some(item => item.mal_id === anime.mal_id)) {
    wishlist.push(anime);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    alert('Added to wishlist!');
  } else {
    alert('This anime is already in your wishlist.');
  }
}
  