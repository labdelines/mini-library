// Load all books into grid
async function loadBooks() {
  try {
    showLoader("Loading books...");

    const res = await fetch("/books");

    if (!res.ok) {
      throw new Error("Failed to load books");
    }

    const books = await res.json();
    const container = document.getElementById("bookGrid");
    container.innerHTML = "";

    if (books.length === 0) {
      container.innerHTML = "<p>No books available.</p>";
      return;
    }

    books.forEach(book => {
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

  } catch (err) {
    showToast(err.message, "error");
  } finally {
    hideLoader();
  }
}


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

    const res = await fetch(`/books/${id}`);
    if (!res.ok) {
      throw new Error("Book not found");
    }

    const book = await res.json();

    document.getElementById("title").innerText = book.title;
document.getElementById("category").innerText = book.category || "-";
document.getElementById("zone").innerText = book.zone || "-";
document.getElementById("description").innerText = book.description || "";
document.getElementById("cover").src =
  book.coverImage || "/placeholder.jpg";


  } catch (err) {
    showToast(err.message, "error");
  } finally {
        hideLoader();

  }
}



