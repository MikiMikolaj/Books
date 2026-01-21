fetch("books.json")
  .then(response => response.json())
  .then(books => {
    const list = document.getElementById("books-list");

    books.forEach(book => {
      const li = document.createElement("li");

      li.textContent = `${book.title} — ${book.author} (${book.status}, ${book.progress}%)`;

      list.appendChild(li);
    });
  })
  .catch(error => {
    console.error("Error loading books:", error);
  });