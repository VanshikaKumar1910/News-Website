const API_KEY = "2fb9c0986f2047d0a113f3e1e26c537e";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    // Filter articles to only include those with images
    const articlesWithImages = data.articles.filter(article => article.urlToImage);
    bindData(articlesWithImages);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    if (newsImg) {
        newsImg.src = article.urlToImage;
        newsImg.onload = () => {
            // Handle successful image load if needed
        };
        newsImg.onerror = () => {
            // Handle image load error if needed
            newsImg.src = "https://via.placeholder.com/400x200"; // Fallback image
        };
    }

    if (newsTitle) newsTitle.innerHTML = article.title;
    if (newsSource) {
        const date = new Date(article.publishedAt).toLocaleString("en-US", {
            timeZone: "Asia/Jakarta",
        });
        newsSource.innerHTML = `${article.source.name} · ${date}`;
    }
    if (newsDesc) newsDesc.innerHTML = article.description;

    const firstChild = cardClone.firstElementChild;
    if (firstChild) {
        firstChild.addEventListener("click", () => {
            window.open(article.url, "_blank");
        });
    }
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
