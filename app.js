document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('book-list');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const yearSelect = document.getElementById('yearSelect');

    let allBooks = [];

    // 1. Fetch Data
    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            allBooks = data;
            populateYearFilter(allBooks);
            renderBooks();
        })
        .catch(error => {
            bookList.innerHTML = '<p class="error">Error loading library. Ensure books.json is present.</p>';
            console.error('Error:', error);
        });

    // 2. Event Listeners
    searchInput.addEventListener('input', renderBooks);
    sortSelect.addEventListener('change', renderBooks);
    yearSelect.addEventListener('change', renderBooks);

    // 3. Helper: Extract Years for Dropdown
    function populateYearFilter(books) {
        const years = new Set();
        books.forEach(book => {
            const date = book.finished || book.started;
            if (date) {
                years.add(date.substring(0, 4));
            }
        });
        
        // Sort years descending
        const sortedYears = Array.from(years).sort().reverse();

        sortedYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });
    }

    // 4. Core Rendering Logic
    function renderBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        const sortMode = sortSelect.value;
        const filterYear = yearSelect.value;

        // Step A: Filter by Search
        let filtered = allBooks.filter(book => {
            const matchTitle = book.title.toLowerCase().includes(searchTerm);
            const matchAuthor = book.author.toLowerCase().includes(searchTerm);
            return matchTitle || matchAuthor;
        });

        // Step B: Filter by Year (if selected)
        if (filterYear !== 'all') {
            filtered = filtered.filter(book => {
                const date = book.finished || book.started;
                return date && date.startsWith(filterYear);
            });
        }

        // Step C: Sort
        filtered.sort((a, b) => {
            const dateA = a.finished || a.started || '0000-00-00';
            const dateB = b.finished || b.started || '0000-00-00';
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;

            switch (sortMode) {
                case 'newest': return dateB.localeCompare(dateA);
                case 'oldest': return dateA.localeCompare(dateB);
                case 'rating-high': return ratingB - ratingA;
                case 'rating-low': return ratingA - ratingB;
                default: return 0;
            }
        });

        // Step D: Group and Render
        bookList.innerHTML = ''; // Clear current list
        
        if (filtered.length === 0) {
            bookList.innerHTML = '<p>No books found.</p>';
            return;
        }

        let currentYearGroup = null;

        filtered.forEach(book => {
            // Determine grouping year
            const date = book.finished || book.started;
            const bookYear = date ? date.substring(0, 4) : 'Undated';

            // Insert Year Header if year changes
            if (bookYear !== currentYearGroup) {
                currentYearGroup = bookYear;
                const yearHeader = document.createElement('div');
                yearHeader.className = 'year-separator';
                yearHeader.textContent = currentYearGroup;
                bookList.appendChild(yearHeader);
            }

            // Create Book Card
            const article = document.createElement('article');
            article.className = 'book-row';
            article.innerHTML = buildBookHTML(book);
            bookList.appendChild(article);
        });
    }

    // 5. HTML Generator for a single book
    function buildBookHTML(book) {
        let statusDisplay = '';

        if (book.status === 'reading') {
            statusDisplay = `
                <div class="status-label">READING NOW</div>
                <div class="progress-container">
                    <div class="progress-fill" style="width: ${book.progress}%"></div>
                </div>
            `;
        } else if (book.status === 'abandoned') {
            statusDisplay = `<span class="badge badge-abandoned">ABANDONED</span>`;
        } else if (book.status === 'finished' || book.rating !== null) {
            statusDisplay = `<span class="rating">${book.rating ? book.rating + '/10' : 'N/A'}</span>`;
        } else {
            statusDisplay = `<span class="status-label">${book.status.toUpperCase()}</span>`;
        }

        const rereadBadge = book.reread ? `<span class="badge badge-reread">RE-READ</span>` : '';

        return `
            <div class="book-info">
                <span class="book-title">${book.title} ${rereadBadge}</span>
                <span class="book-author">${book.author}</span>
            </div>
            <div class="book-meta">
                ${statusDisplay}
            </div>
        `;
    }
    function buildBookHTML(book) {
    let metaContent = '';

    if (book.status === 'reading') {
        metaContent = `<span class="status-reading">Reading Now</span>`;
    } else if (book.status === 'abandoned') {
        metaContent = `<span class="status-abandoned">Abandoned</span>`;
    } else {
        // Show rating if finished
        const rereadIcon = book.reread ? `<span class="re-read-tag">↺ RE-READ</span>` : '';
        metaContent = `${rereadIcon} ${book.rating ? book.rating + '/10' : 'N/A'}`;
    }

    return `
        <div class="book-info">
            <span class="book-title">${book.title}</span>
            <span class="book-author">${book.author}</span>
        </div>
        <div class="book-meta">
            ${metaContent}
        </div>
    `;
}
});