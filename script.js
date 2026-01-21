// 1. State
let allBooks = [];

// 2. Data loading
fetch("books.json")
  .then(res => res.json())
  .then(data => {
    allBooks = data;
    renderBooks(allBooks);
  })
  .catch(err => console.error("Failed to load books:", err));

// 3. Functions
function renderBooks(books) {
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

// 4. Event wiring (search)
const searchInput = document.getElementById("search");

searchInput.addEventListener("input", event => {
  const query = event.target.value.toLowerCase();

  const filteredBooks = allBooks.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query)
  );

  renderBooks(filteredBooks);
});
