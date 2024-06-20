import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { fetchImages } from './js/pixabay-api';
import { clearGallery, renderImages } from './js/render-functions';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-form input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.getElementById('load-more');
const loader = document.getElementById('loader');

let query = '';
let page = 1;
const perPage = 15;
let totalHits = 0;

// Створюємо екземпляр SimpleLightbox у глобальній області видимості
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  query = searchInput.value.trim();
  if (query === '') {
    showErrorToast('Search query cannot be empty');
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await fetchImages(query, page, perPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      showErrorToast('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    renderImages(data.hits);
    lightbox.refresh(); // Оновлюємо SimpleLightbox після рендеру зображень

    if (totalHits > perPage) {
      showLoadMoreBtn();
    }
  } catch (error) {
    showErrorToast(error.message);
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  hideLoadMoreBtn(); // Приховуємо кнопку "load more"
  showLoader(); // Показуємо лоадер

  try {
    const data = await fetchImages(query, page, perPage);

    renderImages(data.hits);
    lightbox.refresh(); // Оновлюємо SimpleLightbox після рендеру зображень

    if (page * perPage >= totalHits) {
      showErrorToast("We're sorry, but you've reached the end of search results.");
    } else {
      showLoadMoreBtn(); // Показуємо знову кнопку "load more"
    }
    smoothScroll();
  } catch (error) {
    showErrorToast(error.message);
  } finally {
    hideLoader();
  }
});

function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}

function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('hidden');
}

function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('hidden');
}

function showErrorToast(message) {
  hideLoader();
  
  iziToast.error({
    title: 'Error',
    message: message,
    position: 'topRight'
  });
}

function smoothScroll() {
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}