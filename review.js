document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = parseInt(urlParams.get('animeId'));
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  let anime = wishlist.find(item => item.mal_id === animeId);

  if (anime) {
    document.getElementById('anime_title').innerText = anime.title;
    displayReviews(anime);
    document.getElementById('save_review').addEventListener('click', function() {
      saveReview(animeId);
    });
  } else {
    document.getElementById('anime_title').innerText = 'Anime not found in wishlist.';
  }
});

function displayReviews(anime) {
  let reviewsContainer = document.getElementById('reviews');
  reviewsContainer.innerHTML = ''; // Clear previous contents

  if (anime.reviews && anime.reviews.length > 0) {
    anime.reviews.forEach((review, index) => {
      let reviewItem = document.createElement('div');
      reviewItem.classList.add('review-item');

      let reviewText = document.createElement('div');
      reviewText.classList.add('review-text');
      reviewText.innerText = review;
      reviewItem.appendChild(reviewText);

      let reviewActions = document.createElement('div');
      reviewActions.classList.add('review-actions');

      let editBtn = document.createElement('button');
      editBtn.classList.add('edit-btn');
      editBtn.innerText = 'Edit';
      editBtn.addEventListener('click', function() {
        editReview(anime.mal_id, index, reviewText);
      });
      reviewActions.appendChild(editBtn);

      let deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.innerText = 'Delete';
      deleteBtn.addEventListener('click', function() {
        deleteReview(anime.mal_id, index);
      });
      reviewActions.appendChild(deleteBtn);

      reviewItem.appendChild(reviewActions);
      reviewsContainer.appendChild(reviewItem);
    });
  } else {
    reviewsContainer.innerText = 'No reviews yet.';
  }
}


function saveReview(animeId) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  let animeIndex = wishlist.findIndex(item => item.mal_id === animeId);
  if (animeIndex !== -1) {
    let reviewText = document.getElementById('review_input').value.trim();
    if (reviewText !== '') {
      // Ensure the 'reviews' array exists in the wishlist item
      if (!wishlist[animeIndex].reviews) {
        wishlist[animeIndex].reviews = [];
      }
      wishlist[animeIndex].reviews.push(reviewText);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      displayReviews(wishlist[animeIndex]); // Update reviews immediately
      document.getElementById('review_input').value = ''; // Clear input after saving
    } else {
      alert('Please fill in the review.');
    }
  }
}

  function editReview(animeId, reviewIndex, reviewTextElement) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let animeIndex = wishlist.findIndex(item => item.mal_id === animeId);
    if (animeIndex !== -1 && wishlist[animeIndex].reviews && wishlist[animeIndex].reviews.length > reviewIndex) {
      let currentReviewText = wishlist[animeIndex].reviews[reviewIndex];
      
      let editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = currentReviewText;
      editInput.classList.add('edit-input');
      
      let saveEditBtn = document.createElement('button');
      saveEditBtn.classList.add('save-edit-btn');
      saveEditBtn.innerText = 'Save';
      saveEditBtn.addEventListener('click', function() {
        let newReviewText = editInput.value.trim();
        if (newReviewText !== '') {
          wishlist[animeIndex].reviews[reviewIndex] = newReviewText;
          localStorage.setItem('wishlist', JSON.stringify(wishlist));
          reviewTextElement.innerText = newReviewText;
          reviewTextElement.style.display = 'block';
          editInput.remove();
          saveEditBtn.remove();
        } else {
          alert('Review text cannot be empty.');
        }
      });
  
      reviewTextElement.style.display = 'none';
      reviewTextElement.parentNode.insertBefore(editInput, reviewTextElement.nextSibling);
      reviewTextElement.parentNode.insertBefore(saveEditBtn, editInput.nextSibling);
    }
  }
  
  function deleteReview(animeId, reviewIndex) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let animeIndex = wishlist.findIndex(item => item.mal_id === animeId);
    if (animeIndex !== -1 && wishlist[animeIndex].reviews && wishlist[animeIndex].reviews.length > reviewIndex) {
      if (confirm('Are you sure you want to delete this review?')) {
        wishlist[animeIndex].reviews.splice(reviewIndex, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        displayReviews(wishlist[animeIndex]); // Update reviews immediately
      }
    }
  }
  