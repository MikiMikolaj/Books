// ======================
// 1. App state
// ======================

let allBooks = [];
let sortMode = "date";
let sortDirection = "desc";

fetch("books.json")
  .then(res => res.json())
  .then(data => {
    allBooks = data;
    renderBooks(allBooks);
  })
  .catch(err => console.error("Failed to load books:", err));

// ======================
// 2. Helpers
// ======================

function getEffectiveDate(book) {
  // Finished date takes priority, otherwise fallback to started
  return new Date(book.finished || book.started);
}

// ======================
// 3. Core logic (sort / filter)
// ======================

function filterBooks(books, query) {
  if (!query) return books;

  return books.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query)
  );
}

function sortBooks(books, mode = "date", direction = "desc") {
  const sorted = [...books]; // never mutate original data

  sorted.sort((a, b) => {
    // ---- DATE SORT ----
    if (mode === "date") {
      const dateA = getEffectiveDate(a);
      const dateB = getEffectiveDate(b);

      return direction === "desc"
        ? dateB - dateA // newest first
        : dateA - dateB; // oldest first
    }

    // ---- RANK SORT ----
    if (mode === "rank") {
      const ratingA = a.rating;
      const ratingB = b.rating;

      // Push unrated books to the bottom
      if (ratingA == null && ratingB == null) return 0;
      if (ratingA == null) return 1;
      if (ratingB == null) return -1;

      return direction === "desc"
        ? ratingB - ratingA // highest first
        : ratingA - ratingB; // lowest first
    }

    return 0; // fallback (should never hit)
  });

  return sorted;
}

// ======================
// 4. Rendering
// ======================

function renderBooks(books) {
  //Rendering
  const container = document.getElementById("books-list");
  container.innerHTML = "";

  books.forEach(book => {
    const bookEl = createBookElement(book);
    container.appendChild(bookEl);
  });
}

function createBookElement(book) {
  const el = document.createElement("div");

  el.innerHTML = `
    <h2>${book.title}</h2>
    <p>${book.author}</p>
    <p>Status: ${book.status}</p>
    <p>Progress: ${book.progress}%</p>
    ${book.rating !== null ? `<p>Rating: ${book.rating}/10</p>` : ""}
    ${book.reread ? `<p>🔁 Re-read</p>` : ""}
    <hr />
  `;

  return el;
}

// ======================
// 5. App bootstrap
// ======================

function updateView() {
  const filtered = filterBooks(allBooks, currentQuery);
  const sorted = sortBooks(filtered, sortMode, sortDirection);
  renderBooks(sorted);
}

function initApp() {
  fetch("books.json")
    .then(res => res.json())
    .then(data => {
      allBooks = data;
      updateView();
    });

  const searchInput = document.getElementById("search");

  searchInput.addEventListener("input", e => {
    currentQuery = e.target.value.toLowerCase();
    updateView();
  });
}

initApp();
