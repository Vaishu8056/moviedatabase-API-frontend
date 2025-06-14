const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=f3f0d01b56936e79e2fa72229b54396d&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=f3f0d01b56936e79e2fa72229b54396d&query=";
const GENREAPI = 'https://api.themoviedb.org/3/genre/movie/list?api_key=f3f0d01b56936e79e2fa72229b54396d&language=en-US';

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");
const genreContainer = document.getElementById("genreContainer"); // Add a container in your HTML for genre buttons.

let selectedGenre = ''; // This will store the currently selected genre

// Initially load movies
returnMovies(APILINK);

// Fetch and display genre buttons
fetch(GENREAPI)
  .then(res => res.json())
  .then(data => {
    const genres = data.genres;
    genres.forEach(genre => {
      const genreButton = document.createElement('button');
      genreButton.textContent = genre.name;
      genreButton.classList.add('genre-btn');
      genreButton.addEventListener('click', () => {
        selectedGenre = genre.id;
        filterMoviesByGenre(selectedGenre);
      });
      genreContainer.appendChild(genreButton);
    });
  })
  .catch(err => {
    console.error('Error fetching genres:', err);
  });

// Function to filter movies by selected genre
function filterMoviesByGenre(genreId) {
  const genreURL = `https://api.themoviedb.org/3/discover/movie?api_key=f3f0d01b56936e79e2fa72229b54396d&with_genres=${genreId}&sort_by=popularity.desc`;
  returnMovies(genreURL);
}
function returnMovies(url) {
    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(function (data) {
        main.innerHTML = '';
        data.results.forEach(element => {
          const div_card = document.createElement('div');
          div_card.setAttribute('class', 'card');
          div_card.addEventListener('click', () => showMovieDetails(element));
  
          const image = document.createElement('img');
          image.setAttribute('class', 'thumbnail');
          const imageUrl = IMG_PATH + element.poster_path;
          image.src = imageUrl;
  
          const title = document.createElement('h3');
          title.textContent = element.title;
  
          const center = document.createElement('center');
          center.appendChild(image);
          div_card.appendChild(center);
          div_card.appendChild(title);
  
          const div_column = document.createElement('div');
          div_column.setAttribute('class', 'column');
          div_column.appendChild(div_card);
  
          const div_row = document.createElement('div');
          div_row.setAttribute('class', 'row');
          div_row.appendChild(div_column);
  
          main.appendChild(div_row);
        });
      })
      .catch(function (error) {
        console.error('Fetch error:', error);
        alert('Sorry, there was an error fetching the movie data. Please try again later.');
      });
  }
  


form.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = '';
  const searchItem = search.value;
  if (searchItem) {
    returnMovies(SEARCHAPI + searchItem);
    search.value = "";
  }
});

function showMovieDetails(movie) {
  document.getElementById("modalTitle").innerText = movie.title;
  document.getElementById("modalOverview").innerText = movie.overview;

  const posterImage = document.getElementById("modalImage");
  const trailerFrame = document.getElementById("modalTrailer");
  const downloadButton = document.getElementById("modalDownload");

  // Reset previous
  posterImage.style.display = "block";
  trailerFrame.style.display = "none";
  trailerFrame.src = "";
  downloadButton.style.display = "none";

  // Set poster
  posterImage.src = IMG_PATH + movie.poster_path;

  // Set movie ID for review submission
  document.getElementById("movieModal").dataset.movieId = movie.id;

  // Fetch trailer from TMDB
  fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=f3f0d01b56936e79e2fa72229b54396d`)
    .then(res => res.json())
    .then(data => {
      const youtubeTrailer = data.results.find(video => video.site === "YouTube" && video.type === "Trailer");
      if (youtubeTrailer) {
        const embedUrl = `https://www.youtube.com/embed/${youtubeTrailer.key}`;
        trailerFrame.src = embedUrl;
        trailerFrame.style.display = "block";
        posterImage.style.display = "none";
      } else {
        posterImage.style.display = "block";
        downloadButton.style.display = "block";
        downloadButton.href = "#";
        downloadButton.innerText = "No Trailer Available";
      }
    })
    .catch(err => {
      console.error('Error fetching trailer:', err);
      posterImage.style.display = "block";
      downloadButton.style.display = "block";
      downloadButton.href = "#";
      downloadButton.innerText = "No Trailer Available";
    });

  document.getElementById("watchlistButton").onclick = function () {
    addToWatchlist(movie.id);
  };

  document.getElementById("favoriteButton").onclick = function () {
    addToFavorites(movie.id);
  };
  displayReviews(movie.id);

  document.getElementById("movieModal").style.display = "block";
}

function submitReview() {
  const rating = document.getElementById("userRating").value;
  const review = document.getElementById("userReview").value;
  const movieId = document.getElementById("movieModal").dataset.movieId;

  if (rating < 1 || rating > 5) {
    alert("Rating must be between 1 and 5!");
    return;
  }

  fetch(`http://localhost:5000/api/movie/${movieId}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rating, review }),
  })
    .then(res => res.json())
    .then(data => {
      alert("🎉 Review submitted successfully!");
      document.getElementById("userRating").value = "";
      document.getElementById("userReview").value = "";
    })
    .catch(err => {
      console.error("Error submitting review:", err);
      alert("❌ Failed to submit review.");
    });
}

function displayReviews(movieId) {
  fetch(`http://localhost:5000/api/movie/${movieId}/reviews`)
    .then(res => res.json())
    .then(data => {
      const reviewList = document.getElementById("reviewList");
      reviewList.innerHTML = ""; // Clear previous
      if (data.length === 0) {
        reviewList.innerHTML = "<p style='color:gray;'>No reviews yet. Be the first!</p>";
        return;
      }
      data.forEach(review => {
        const reviewItem = document.createElement("div");
        reviewItem.style.borderBottom = "1px solid #444";
        reviewItem.style.padding = "10px 0";
        reviewItem.innerHTML = `<strong>⭐ ${review.rating}</strong><br>${review.review}`;
        reviewList.appendChild(reviewItem);
      });
    })
    .catch(err => {
      console.error("Error loading reviews:", err);
    });
}

function closeModal() {
  document.getElementById("movieModal").style.display = "none";
}

function addToWatchlist(movieId) {
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  if (!watchlist.includes(movieId)) {
    watchlist.push(movieId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    alert('✅ Added to Watchlist!');
  } else {
    alert('⚠️ Already in Watchlist!');
  }
}

function addToFavorites(movieId) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.includes(movieId)) {
    favorites.push(movieId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('✅ Marked as Favorite!');
  } else {
    alert('⚠️ Already marked as Favorite!');
  }
}

// 🌙 Dark Mode Toggle Logic
const toggleBtn = document.getElementById("darkModeToggle");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.querySelector(".topnav").classList.toggle("dark-mode");

  document.querySelectorAll(".card").forEach(el => el.classList.toggle("dark-mode"));
  document.querySelectorAll(".column").forEach(el => el.classList.toggle("dark-mode"));

  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);
});

// 🌙 Apply saved mode on page load
window.addEventListener("load", () => {
  const savedMode = localStorage.getItem("darkMode");
  if (savedMode === "true") {
    document.body.classList.add("dark-mode");
    document.querySelector(".topnav").classList.add("dark-mode");

    document.querySelectorAll(".card").forEach(el => el.classList.add("dark-mode"));
    document.querySelectorAll(".column").forEach(el => el.classList.add("dark-mode"));
  }
});

