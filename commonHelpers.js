import{a as $,S as E,i as S}from"./assets/vendor-b0d10f48.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function d(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(e){if(e.ep)return;e.ep=!0;const o=d(e);fetch(e.href,o)}})();const q="44324490-53902a9aa3f8bdbab535f7eec",I="https://pixabay.com/api/";async function h(t,r=1,d=15){const s=`${I}?key=${q}&q=${encodeURIComponent(t)}&image_type=photo&orientation=horizontal&safesearch=true&page=${r}&per_page=${d}`,e=await $.get(s);if(e.status!==200)throw new Error("Failed to fetch images");return e.data}const p=document.querySelector(".gallery");function P(){p.innerHTML=""}function y(t){const r=t.map(({webformatURL:s,largeImageURL:e,tags:o,likes:i,views:L,comments:v,downloads:w})=>`
    <div class="photo-card">
      <a href="${e}" class="gallery__item">
        <img src="${s}" alt="${o}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes</b> ${i}</p>
        <p class="info-item"><b>Views</b> ${L}</p>
        <p class="info-item"><b>Comments</b> ${v}</p>
        <p class="info-item"><b>Downloads</b> ${w}</p>
      </div>
    </div>
  `).join("");p.insertAdjacentHTML("beforeend",r),new E(".gallery a",{captionsData:"alt",captionDelay:250}).refresh()}const B=document.querySelector("#search-form"),H=document.querySelector("#search-form input"),O=document.querySelector(".gallery"),n=document.getElementById("load-more"),g=document.getElementById("loader");let u="",a=1;const c=15;let f=0;B.addEventListener("submit",async t=>{if(t.preventDefault(),u=H.value.trim(),u===""){l("Search query cannot be empty");return}a=1,P(),n.classList.add("hidden"),b();try{const r=await h(u,a,c);if(f=r.totalHits,r.hits.length===0){l("Sorry, there are no images matching your search query. Please try again.");return}y(r.hits),r.totalHits>c&&n.classList.remove("hidden")}catch(r){l(r.message)}finally{m()}});n.addEventListener("click",async()=>{a+=1,b();try{const t=await h(u,a,c);y(t.hits),a*c>=f&&(n.classList.add("hidden"),l("We're sorry, but you've reached the end of search results.")),_()}catch(t){l(t.message)}finally{setTimeout(()=>{m(),a*c<f&&n.classList.remove("hidden")},2e3)}});function b(){g.classList.remove("hidden")}function m(){g.classList.add("hidden")}function l(t){m(),S.error({title:"Error",message:t,position:"topRight"})}function _(){const{height:t}=O.firstElementChild.getBoundingClientRect();window.scrollBy({top:t*2,behavior:"smooth"})}
//# sourceMappingURL=commonHelpers.js.map