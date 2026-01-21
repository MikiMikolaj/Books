fetch("books.json")
  .then(res => res.json())
  .then(books => {
    const container = document.getElementById("books-list");

    books.forEach(book => {
      const bookEl = document.createElement("div");

      bookEl.innerHTML = `
        <h2>${book.title}</h2>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Status:</strong> ${book.status}</p>
        <p><strong>Progress:</strong> ${book.progress}%</p>
        ${book.rating !== null ? `<p><strong>Rating:</strong> ${book.rating}/10</p>` : ""}
        ${book.reread ? `<p>🔁 Re-read</p>` : ""}
        <hr />
      `;

      container.appendChild(bookEl);
    });
  })
  .catch(err => console.error(err));