import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { fetchImages } from './js/pixabay-api';
import { clearGallery, renderImages } from './js/render-functions';

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-form input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.getElementById('load-more');
const loader = document.getElementById('loader');

let query = '';
let page = 1;
const perPage = 15;
let totalHits = 0;

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  query = searchInput.value.trim();
  if (query === '') {
    showErrorToast('Search query cannot be empty');
    return;
  }

  page = 1;
  clearGallery();
  loadMoreBtn.classList.add('hidden');
  showLoader();

  try {
    const data = await fetchImages(query, page, perPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      showErrorToast('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    renderImages(data.hits);
    if (data.totalHits > perPage) {
      loadMoreBtn.classList.remove('hidden');
    }
  } catch (error) {
    showErrorToast(error.message);
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  loadMoreBtn.classList.add('hidden'); // Приховуємо кнопку "load more"
  showLoader(); // Показуємо лоадер

  try {
    const data = await fetchImages(query, page, perPage);

    // Затримка перед відображенням зображень
    setTimeout(() => {
      renderImages(data.hits);
      if (page * perPage >= totalHits) {
        showErrorToast("We're sorry, but you've reached the end of search results.");
      } else {
        loadMoreBtn.classList.remove('hidden'); // Показуємо знову кнопку "load more"
      }
      smoothScroll();
    }, 2000); // 2 секунди затримки для лоадера
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