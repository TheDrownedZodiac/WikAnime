let activePage;
let debounceTimeout;
let mapAnime = [
    anime = "1",
    year = "2024",
    season = "winter",
    genre = "1",
    search = "",
    orderBy = "mal_id",
    sort = "asc",
    type = "tv"
]
let currentPage = 1;
let dataAnime;

let seasonNowList;
fetch("https://api.jikan.moe/v4/seasons/now")
    .then(response => response.json())
    .then(response => seasonNowList = response.data)
    .then(() => constructCarouselItem(seasonNowList));

document.getElementById('genres').addEventListener('click', () => {
    let genresList;
    document.getElementById('genres').disabled = true;
    fetch("https://api.jikan.moe/v4/genres/anime")
        .then(response => response.json())
        .then(response => genresList = response.data)
        .then(() => constructGenresDropdown(genresList));
});

document.getElementById('saisons').addEventListener('click', () => {
    let seasonsList;
    document.getElementById('saisons').disabled = true;
    fetch("https://api.jikan.moe/v4/seasons")
        .then(response => response.json())
        .then(response => seasonsList = response.data)
        .then(() => constructSeasonsDropdown(seasonsList));
});

function loadPage() {
    document.getElementById("carousel").innerHTML = "";
    document.getElementById("section-2").innerHTML = "";
    if (activePage == "home") {
        fetch(`https://api.jikan.moe/v4/anime?type=${mapAnime.type}&order_by=${mapAnime.orderBy}&sort=${mapAnime.sort}&page=${currentPage}`)
            .then(response => response.json())
            .then(response => dataAnime = response)
            .then(() => {
                for (anime of dataAnime.data) {
                    displayAnimesList(anime);
                }
                document.getElementById('dataTotal').textContent = `: ${dataAnime.pagination.items.total}`;
            });
    } else if (activePage == "seasons") {
        fetch(`https://api.jikan.moe/v4/seasons/${mapAnime.year}/${mapAnime.season.toLowerCase()}?filter=${mapAnime.type}&page=${currentPage}`)
            .then(response => response.json())
            .then(response => dataAnime = response)
            .then(() => {
                for (let anime of dataAnime.data) {
                    displayAnimesList(anime);
                }
                document.getElementById('dataTotal').textContent = `: ${dataAnime.pagination.items.total}`;
            });
    } else if (activePage == "genres") {
        fetch(`https://api.jikan.moe/v4/anime?type=${mapAnime.type}&genres=${mapAnime.genre}&order_by=${mapAnime.orderBy}&sort=${mapAnime.sort}&page=${currentPage}`)
            .then(response => response.json())
            .then(response => dataAnime = response)
            .then(() => {
                for (let anime of dataAnime.data) {
                    displayAnimesList(anime);
                }
                document.getElementById('dataTotal').textContent = `: ${dataAnime.pagination.items.total}`;
            });
    } else if (activePage == "anime") {
        let anime;
        fetch(`https://api.jikan.moe/v4/anime/${mapAnime.anime}`)
            .then(response => response.json())
            .then(response => anime = response)
            .then(() => {
                animeDetail(anime.data);
                document.getElementById('dataTotal').textContent = ``;
            });
    } else if (activePage == "search") {
        fetch(`https://api.jikan.moe/v4/anime?type=${mapAnime.type}&q=${mapAnime.search}&order_by=${mapAnime.orderBy}&sort=${mapAnime.sort}&page=${currentPage}`)
            .then(response => response.json())
            .then(response => dataAnime = response)
            .then(() => {
                for (let anime of dataAnime.data) {
                    displayAnimesList(anime);
                }
                document.getElementById('dataTotal').textContent = `: ${dataAnime.pagination.items.total}`;
            });
    }
    if (activePage !== "seasons") {
        document.getElementById('orderButton').style.display = "flex";
        document.getElementById('filtreButton').style.display = "flex";
    }
    if (activePage !== "anime") {
        document.getElementById('switch-page').style.display = "flex";
    }
    document.getElementById('typeButton').style.display = "flex";
    document.getElementById('pageId').textContent = "Page " + currentPage;
}

function handleHome() {
    clearTimeout(debounceTimeout);
    document.getElementById('title').textContent = "Accueil";
    currentPage = 1;
    activePage = "home";
    mapAnime.orderBy = "mal_id";
    mapAnime.sort = "asc";
    mapAnime.type = "";
    debounceTimeout = setTimeout(function () {
        loadPage();
        if (seasonNowList) {
            constructCarouselItem(seasonNowList);
        }
        document.getElementById('titleGenres').textContent = "Genres";
        document.getElementById('titleSeasons').textContent = "Saisons";
        document.getElementById('titleTypes').textContent = "Types";
        document.getElementById('titleOrders').textContent = "Ordres";
        document.getElementById('titleFiltres').textContent = "Filtres";
    }, 400);
}

handleHome();

function handleSeasons(e) {
    e.preventDefault();
    clearTimeout(debounceTimeout);
    document.getElementById('title').textContent = capitalize(e.target.dataset.season) + " " + e.target.dataset.year;
    document.getElementById('orderButton').style.display = "none";
    document.getElementById('filtreButton').style.display = "none";
    currentPage = 1;
    activePage = "seasons";
    mapAnime.year = e.target.dataset.year;
    mapAnime.season = e.target.dataset.season;
    debounceTimeout = setTimeout(function () {
        loadPage();
        document.getElementById('titleSeasons').textContent = e.target.textContent;
        document.getElementById('titleGenres').textContent = "Genres";
    }, 400);
}

function handleGenres(e) {
    e.preventDefault();
    clearTimeout(debounceTimeout);
    document.getElementById('title').textContent = capitalize(e.target.textContent);
    currentPage = 1;
    activePage = "genres";
    mapAnime.genre = e.target.dataset.id;
    debounceTimeout = setTimeout(function () {
        loadPage();
        document.getElementById('titleGenres').textContent = e.target.textContent;
        document.getElementById('titleSeasons').textContent = "Saisons";
    }, 400);
}

function handleAnime(e) {
    e.preventDefault();
    clearTimeout(debounceTimeout);
    currentPage = 1;
    activePage = "anime";
    mapAnime.anime = e.target.getAttribute('data');
    debounceTimeout = setTimeout(function () {
        loadPage();
        document.getElementById('switch-page').style.display = "none";
        document.getElementById('typeButton').style.display = "none";
        document.getElementById('orderButton').style.display = "none";
        document.getElementById('filtreButton').style.display = "none";
    }, 400);
}

function handleType(e) {
    e.preventDefault();
    clearTimeout(debounceTimeout);
    mapAnime.type = e.target.dataset.type;
    debounceTimeout = setTimeout(function () {
        loadPage();
        document.getElementById('titleTypes').textContent = e.target.textContent;
    }, 400);
}

function handleOrder(e) {
    e.preventDefault();
    clearTimeout(debounceTimeout);
    mapAnime.sort = e.target.dataset.order;
    debounceTimeout = setTimeout(function () {
        loadPage();
        document.getElementById('titleOrders').textContent = e.target.textContent;
    }, 400);
}

function handleFilter(e) {
    e.preventDefault();
    clearTimeout(debounceTimeout);
    mapAnime.orderBy = e.target.dataset.filter;
    debounceTimeout = setTimeout(function () {
        loadPage();
        document.getElementById('titleFiltres').textContent = e.target.textContent;
    }, 400);
}

document.getElementById("animeSearch").addEventListener("keyup", handleSearchEnter);

function handleSearchEnter(e) {
    e.preventDefault();
    currentPage = 1;
    activePage = "search";
    if (e.key) {
        clearTimeout(debounceTimeout);
        if (document.getElementById("animeSearch").value == "") {
            debounceTimeout = setTimeout(handleHome, 400);
        } else {
            mapAnime.search = document.getElementById("animeSearch").value;
            debounceTimeout = setTimeout(loadPage, 400);
        }
    }
    document.getElementById('title').textContent = "Recherche personnalisée";
}

/**
 * sert à la mise en place du dropdown
 * @param {array} arr
 */

function constructGenresDropdown(arr) {
    let parentElement = document.getElementById("genres-dropdown");
    parentElement.innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
        let genresElement = `<li><a class="dropdown-item" href="#" onclick="handleGenres(event)" data-id="${arr[i].mal_id}">${arr[i].name}</a></li>`;
        parentElement.insertAdjacentHTML("beforeend", genresElement);
    }
}

/**
 * sert à la mise en place du dropdown
 * @param {array} arr
 */

function constructSeasonsDropdown(arr) {
    let parentElement = document.getElementById("seasons-dropdown");
    parentElement.innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].seasons.length; j++) {
            let seasonsElement = `<li><a class="dropdown-item" href="#" onclick="handleSeasons(event)" data-season="${arr[i].seasons[j]}" data-year="${arr[i].year}">${capitalize(arr[i].seasons[j]) + " " + arr[i].year}</a></li>`;
            parentElement.insertAdjacentHTML("beforeend", seasonsElement);
        }
    }
}

function displayAnimesList(anime) {
    let animeElement =
        createElementFromHtml(`
        <div class="card w-25 mt-3 text-center">
            <img src="${anime.images.jpg.large_image_url}" class="card-img-top w-75 m-auto anime-img" alt="${anime.title}">
            <div class="card-body">
                <h5 class="card-title">${capitalize(anime.title)}</h5>
                <a href="#" class="btn btn-primary" onclick="handleAnime(event)" data="${anime.mal_id}">En savoir plus</a>
            </div>
        </div>`);
    document.getElementById("section-2").insertAdjacentElement("beforeend", animeElement);
}

function constructCarouselItem(anime) {
    for (let i = 0; i < 10; i++) {
        var carouselItemHtml = `
        <div class="carousel-item ">
        <div class="card" id="card">
        <img src="${anime[i].images.jpg.large_image_url}" class="card-img-top w-50 m-auto" alt="${anime[i].name}">
        <div class="card-body" id="card-body">
        <h5 class="card-title" id="card-title">${capitalize(anime[i].title)}</h5>
        <a href="#" class="btn btn-primary" onclick="handleAnime(event)" data="${anime[i].mal_id}">En savoir plus</a>
        </div>
        </div>
        </div>
        `;
        let carouselItemElement = createElementFromHtml(carouselItemHtml);
        if (i == 0) {
            carouselItemElement.classList.add("active");
        }
        document.getElementById("carousel").insertAdjacentElement("afterbegin", carouselItemElement);
    }
}

function animeDetail(anime) {
    document.getElementById('title').textContent = `${anime.title} Details`
    let fromDate = `${anime.aired.prop.from.day + "/" + anime.aired.prop.from.month + "/" + anime.aired.prop.from.year}`;
    let toDate;
    if (anime.aired.prop.to.day !== null && anime.aired.prop.to.month !== null && anime.aired.prop.to.year !== null) {
        toDate = `${anime.aired.prop.to.day + "/" + anime.aired.prop.to.month + "/" + anime.aired.prop.to.year}`;
    } else {
        toDate = "Date de fin non communiquer";
    }
    let detailItem = `
    <div class="card" id="detail">
        <img src="${anime.images.jpg.large_image_url}" class="card-img-top w-50 m-auto" alt="${anime.title}">
            <div class="card-body" id="details">
                <h3 class="card-title lesdetail">Nom : ${capitalize(anime.title)}</h3>
                <h4 class="card-title lesdetail">Genre(s) : ${anime.genres.map(genres => genres.name).join(", ")}</h4>
                <p class="card-title lesdetail">Synopsis : ${anime.synopsis}</p>
                <h5 class="card-title lesdetail">Nombre d'épisodes : ${anime.episodes}</5>
                <h5 class="card-title lesdetail">Durée d'un épisode : ${anime.duration}</5>
                <h5 class="card-title lesdetail">Date de sortie : ${anime.season + " " + anime.year}</5>
                <h5 class="card-title lesdetail">Du : ${fromDate}</h5>
                <h5 class="card-title lesdetail">Au : ${toDate}</h5>
                <h5 class="card-title lesdetail">Notation : ${anime.score + "/10"}</h5>
                <h5 class="card-title lesdetail">Status : ${anime.status}</h5>
                <h5 class="card-title lesdetail">Producteur : ${anime.producers.map(producers => producers.name).join(", ")}</h5>
                <h5 class="card-title lesdetail">Studio d'animation : ${anime.studios.map(studios => studios.name).join(", ")}</h5>
                <h6 class="card-title lesdetail"><a href="${anime.trailer.url}">Trailer ici</a></h6>
            </div>`;
    document.getElementById('section-2').insertAdjacentHTML("beforeend", detailItem);
}

document.getElementById('switch-page').addEventListener('submit', switchPage);

function switchPage(e) {
    if (e.target.textContent.toLowerCase() === "next") {
        currentPage += 1;
    }
    if (e.target.textContent.toLowerCase() === "previous") {
        if (currentPage > 1) {
            currentPage -= 1;
        }
    }
    loadPage();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * créer un objet élément en js à partir d'une string
 * @param {string} str
 * @returns
 */

function createElementFromHtml(str) {
    let divElement = document.createElement("div");
    divElement.innerHTML = str.trim();
    return divElement.firstChild;
}