
// Initialize the book variables
let allBooks = [];
let filteredBooks = [];
let currentPage = 1;
const BOOKS_PER_PAGE = 8;


// Load all books into grid
async function loadBooks() {
  try {
    showLoader("Loading books...");

    const res = await fetch("/api/books");
    if (!res.ok) throw new Error("Failed to load books");

    allBooks = await res.json();
    filteredBooks = allBooks; // 👈 important

    if (allBooks.length === 0) {
      document.getElementById("bookGrid").innerHTML =
        "<p>No books available.</p>";
      return;
    }

    renderPage();

  } catch (err) {
    showToast(err.message, "error");
  } finally {
    hideLoader();
  }
}

function renderPage() {
  const container = document.getElementById("bookGrid");
  container.innerHTML = "";

  const start = (currentPage - 1) * BOOKS_PER_PAGE;
  const end = start + BOOKS_PER_PAGE;
  const pageBooks = filteredBooks.slice(start, end);

  pageBooks.forEach(book => {
    const div = document.createElement("div");
    div.className = "book-card";

    div.onclick = () => {
      window.location.href = `book.html?id=${book._id}`;
    };

    div.innerHTML = `
      <img src="${book.coverImage || '/placeholder.jpg'}" alt="${book.title}">
      <h3>${book.title}</h3>
      <p>Category: ${book.category}</p>
    `;

    container.appendChild(div);
  });

  updatePaginationUI();
}

function updatePaginationUI() {
  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE) || 1;

  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;

  document.getElementById("pageInfo").innerText =
    `Page ${currentPage} of ${totalPages}`;
}


document.getElementById("prevBtn").onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
};

document.getElementById("nextBtn").onclick = () => {
  const totalPages = Math.ceil(allBooks.length / BOOKS_PER_PAGE);
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
};


// Search input listener (RUN ONCE)
document.getElementById("searchInput").addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase().trim();

  filteredBooks = allBooks.filter(book =>
    book.title?.toLowerCase().includes(keyword) ||
    book.category?.toLowerCase().includes(keyword) ||
    book.zone?.toLowerCase().includes(keyword)
  );

  currentPage = 1; // reset to first page
  renderPage();
});



// Load single book
async function loadBookDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    showToast("Invalid book", "error");
    return;
  }

  try {
    showLoader("Loading book details...");

    const res = await fetch(`/api/books/${id}`);
    if (!res.ok) {
      throw new Error("Book not found");
    }

    const book = await res.json();

// Enhanced book detail display (replace the existing lines)
document.getElementById("title").innerText = book.title;

// Enhanced category with styling
const categoryEl = document.getElementById("category");
categoryEl.innerText = book.category || "-";
categoryEl.style.fontWeight = "600";
categoryEl.style.color = "var(--text-main)";

// Enhanced zone with styling
const zoneEl = document.getElementById("zone");
zoneEl.innerText = book.zone || "-";
zoneEl.style.fontWeight = "600";
zoneEl.style.color = "var(--text-main)";

// Enhanced description with better formatting
const descEl = document.getElementById("description");
descEl.innerText = book.description || "No description available.";
descEl.style.whiteSpace = "pre-line";

// Enhanced cover image with loading effect
const coverEl = document.getElementById("cover");
coverEl.style.opacity = "0";
coverEl.src = book.coverImage || "/placeholder.jpg";
coverEl.onload = function() {
  coverEl.style.transition = "opacity 0.5s ease";
  coverEl.style.opacity = "1";
};


  } catch (err) {
    showToast(err.message, "error");
  } finally {
        hideLoader();

  }
}



