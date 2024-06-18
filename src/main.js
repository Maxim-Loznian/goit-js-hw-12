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
  hideLoadMoreBtn(); // Приховуємо кнопку "Load more"
  showLoader(); // Показуємо лоадер

  try {
    const data = await fetchImages(query, page, perPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      showErrorToast('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    renderImages(data.hits);
    if (data.totalHits > perPage) {
      showLoadMoreBtn(); // Показуємо кнопку "Load more", якщо є ще результати для завантаження
    }
  } catch (error) {
    showErrorToast(error.message);
  } finally {
    hideLoader(); // Приховуємо лоадер
  }
});

loadMoreBtn.addEventListener('click', async () => {
  hideLoadMoreBtn(); // Приховуємо кнопку "Load more"
  showLoader(); // Показуємо лоадер

  try {
    // Затримка для лоадера (2 секунди)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Отримуємо дані із сервера
    const data = await fetchImages(query, page, perPage);

    renderImages(data.hits);

    // Перевіряємо, чи досягли кінця результатів
    if (page * perPage >= totalHits) {
      showErrorToast("We're sorry, but you've reached the end of search results.");
    } else {
      showLoadMoreBtn(); // Показуємо кнопку "Load more", якщо є ще результати для завантаження
    }
    
    smoothScroll(); // Викликаємо плавний скролл
  } catch (error) {
    showErrorToast(error.message);
  } finally {
    hideLoader(); // Приховуємо лоадер
  }
});

function showLoader() {
  loader.classList.remove('hidden'); // Показуємо лоадер
}

function hideLoader() {
  loader.classList.add('hidden'); // Приховуємо лоадер
}

function showErrorToast(message) {
  hideLoader(); // Приховуємо лоадер
  
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

function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('hidden'); // Показуємо кнопку "Load more"
}

function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('hidden'); // Приховуємо кнопку "Load more"
}