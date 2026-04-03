// 1. Get the query string from the current URL
const queryString = window.location.search;

// 2. Initialize URLSearchParams
const urlParams = new URLSearchParams(queryString);
let bibleData = [];
let currentBook = null;

const bookList = document.getElementById('bookList');
const chapterList = document.getElementById('chapterList');
const verseContent = document.getElementById('verseContent');
const navTitle = document.getElementById('navTitle');
const backBtn = document.getElementById('backBtn');

// Load JSON Data
async function init() {
    try {
        const response = await fetch(urlParams.get('directory'));
        bibleData = await response.json();
        showBooks();
    } catch (error) {
        bookList.innerHTML = `<div class="alert alert-danger">Error loading Bible data.</div>`;
    }
}

function showBooks() {
    toggleViews('books');
    navTitle.innerText = "Holy Bible";
    backBtn.classList.add('d-none');
    
    bookList.innerHTML = bibleData.map((item, index) => `
        <div class="col-6 col-md-4">
            <div class="card card-book shadow-sm p-3 text-center h-100" onclick="showChapters(${index})">
                <div class="fw-bold">${item.name}</div>
                <small class="text-muted">${item.chapters.length} Chapters</small>
            </div>
        </div>
    `).join('');
}

function showChapters(bookIndex) {
    currentBook = bibleData[bookIndex];
    toggleViews('chapters');
    navTitle.innerText = currentBook.name;
    backBtn.classList.remove('d-none');

    chapterList.innerHTML = currentBook.chapters.map((_, i) => `
        <div class="col-3">
            <div class="card card-book shadow-sm p-2 text-center" onclick="showVerses(${i})">
                ${i + 1}
            </div>
        </div>
    `).join('');
}

function showVerses(chapterIndex) {
    toggleViews('verses');
    const chapterNum = chapterIndex + 1;
    navTitle.innerText = `${currentBook.name} ${chapterNum}`;
    
    const verses = currentBook.chapters[chapterIndex];
    verseContent.innerHTML = verses.map((verse, i) => `
        <span class="verse-text">
            <span class="verse-num">${i + 1}</span>${verse}
        </span>
    `).join('');
    window.scrollTo(0,0);
}

function toggleViews(view) {
    bookList.classList.toggle('d-none', view !== 'books');
    chapterList.classList.toggle('d-none', view !== 'chapters');
    verseContent.classList.toggle('d-none', view !== 'verses');
}

// Start the app
init();
