document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');
  displayWishlist();
});

function displayWishlist() {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  console.log('Wishlist:', wishlist); // Debugging

  let wishlistContainer = document.getElementById('wishlist');

  if (!wishlistContainer) {
    console.error('Wishlist container not found');
    return;
  }

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
    wishlistContainer.classList.remove('loading'); // Remove loading state
    return;
  }

  wishlistContainer.innerHTML = ''; // Clear previous contents

  wishlist.forEach(anime => {
    let animeContainer = document.createElement('div');
    animeContainer.classList.add('anime-container');
    animeContainer.dataset.malId = anime.mal_id;

    let animeTitle = document.createElement('p');
    animeTitle.innerText = anime.title;
    animeTitle.classList.add('anime-title');
    if (anime.watched) {
      animeTitle.classList.add('watched');
    }
    animeContainer.appendChild(animeTitle);

    if (anime.watched) {
      let watchedLabel = document.createElement('span');
      watchedLabel.innerText = 'Watched';
      watchedLabel.classList.add('watched-label');
      animeTitle.appendChild(watchedLabel);
    }

    let animeImage = document.createElement('img');
    animeImage.src = anime.images.jpg.image_url;
    animeImage.alt = "Anime Image";
    animeImage.classList.add('anime-image');
    animeContainer.appendChild(animeImage);

    let animeInfo = document.createElement('p');
    animeInfo.innerText = `Episodes: ${anime.episodes}`;
    animeInfo.classList.add('anime-info');
    animeContainer.appendChild(animeInfo);

    let reviewInput = document.createElement('textarea');
    reviewInput.classList.add('review-input');
    reviewInput.placeholder = 'Add your review...';
    animeContainer.appendChild(reviewInput);

    // Button container for Save Review and Remove from Wishlist buttons
    let buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    let saveReviewButton = document.createElement('button');
    saveReviewButton.innerText = 'Save Review';
    saveReviewButton.classList.add('save-review-button');
    saveReviewButton.addEventListener('click', function() {
      saveReview(anime.mal_id);
    });
    buttonContainer.appendChild(saveReviewButton);

    let removeButton = document.createElement('button');
    removeButton.innerText = 'Remove from Watchlist';
    removeButton.classList.add('remove-button');
    removeButton.addEventListener('click', function() {
      confirmRemoveFromWishlist(anime.mal_id);
    });
    buttonContainer.appendChild(removeButton);

    animeContainer.appendChild(buttonContainer);

    wishlistContainer.appendChild(animeContainer);
  });

  wishlistContainer.classList.remove('loading'); // Remove loading state
}

function confirmRemoveFromWishlist(animeId) {
  if (confirm('Are you sure you want to remove this anime from your watchlist?')) {
    removeFromWishlist(animeId);
    showNotification('Successfully removed from watchlist');
  }
}

function removeFromWishlist(animeId) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  wishlist = wishlist.filter(anime => anime.mal_id !== animeId);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  displayWishlist();
}

function saveReview(animeId) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  let animeIndex = wishlist.findIndex(anime => anime.mal_id === animeId);
  if (animeIndex !== -1) {
    let reviewText = document.querySelector(`.anime-container[data-mal-id="${animeId}"] .review-input`).value;
    if (!wishlist[animeIndex].reviews) {
      wishlist[animeIndex].reviews = [];
    }
    wishlist[animeIndex].reviews.push(reviewText);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    // Redirect to the review page with animeId and anime title
    let animeTitle = encodeURIComponent(wishlist[animeIndex].title);
    window.location.href = `review.html?animeId=${animeId}&animeTitle=${animeTitle}`;
  }
}

function showNotification(message) {
  let notification = document.createElement('div');
  notification.classList.add('notification');
  notification.innerText = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10); // Short delay to trigger CSS transition

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 500); // Allow time for transition
  }, 3000); // Show notification for 3 seconds
}
