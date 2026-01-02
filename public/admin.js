let allAdminBooks = [];
let filteredAdminBooks = [];
let adminCurrentPage = 1;
const ADMIN_BOOKS_PER_PAGE = 8;

// Protect page
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/login.html";
}

// Load admin book list
async function loadAdminBooks() {
  try {
    showLoader("Loading books...");
    const res = await fetch("/api/books", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to load books");

    allAdminBooks = await res.json();
    filteredAdminBooks = allAdminBooks;

    renderAdminPage();

  } catch (err) {
    showToast(err.message, "error");
  } finally {
    hideLoader();
  }
}

function renderAdminPage() {
  const container = document.getElementById("adminBooks");
  container.innerHTML = "";

  const start = (adminCurrentPage - 1) * ADMIN_BOOKS_PER_PAGE;
  const end = start + ADMIN_BOOKS_PER_PAGE;
  const pageBooks = filteredAdminBooks.slice(start, end);

  if (pageBooks.length === 0) {
    container.innerHTML = "<p>No books found.</p>";
    updateAdminPaginationUI();
    return;
  }

  pageBooks.forEach((book) => {
    const div = document.createElement("div");
    div.className = "book-card";

    div.innerHTML = `
      <img src="${book.coverImage || "/placeholder.jpg"}" />

      <h3>${book.title}</h3>
      <p><strong>Category:</strong> ${book.category}</p>
      <p><strong>Zone:</strong> ${book.zone}</p>
      <p><strong>Amount:</strong> ${book.amount}</p>

      <div class="admin-actions">
        <a href="edit.html?id=${book._id}" class="primary-btn">Edit</a>
        <button
          class="primary-btn logout-btn"
          onclick="deleteBook('${book._id}')">
          Delete
        </button>
      </div>
    `;

    container.appendChild(div);
  });

  updateAdminPaginationUI();
}

function updateAdminPaginationUI() {
  const totalPages =
    Math.ceil(filteredAdminBooks.length / ADMIN_BOOKS_PER_PAGE) || 1;

  document.getElementById("adminPrevBtn").disabled =
    adminCurrentPage === 1;

  document.getElementById("adminNextBtn").disabled =
    adminCurrentPage === totalPages;

  document.getElementById("adminPageInfo").innerText =
    `Page ${adminCurrentPage} of ${totalPages}`;
}

document.getElementById("adminPrevBtn").onclick = () => {
  if (adminCurrentPage > 1) {
    adminCurrentPage--;
    renderAdminPage();
  }
};

document.getElementById("adminNextBtn").onclick = () => {
  const totalPages = Math.ceil(
    filteredAdminBooks.length / ADMIN_BOOKS_PER_PAGE
  );
  if (adminCurrentPage < totalPages) {
    adminCurrentPage++;
    renderAdminPage();
  }
};

document
  .getElementById("adminSearchInput")
  .addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase().trim();

    filteredAdminBooks = allAdminBooks.filter(
      (book) =>
        book.title?.toLowerCase().includes(keyword) ||
        book.category?.toLowerCase().includes(keyword) ||
        book.zone?.toLowerCase().includes(keyword)
    );

    adminCurrentPage = 1;
    renderAdminPage();
  });

  

// Delete a book (admin only)
async function deleteBook(id) {
  try {
    showLoader("Deleting book...");
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("You are not authorized.", "error");
      return;
    }

    const confirmed = await confirmAction(
      "Are you sure you want to delete this book?"
    );
    if (!confirmed) return;

    const res = await fetch(`/api/books/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(err?.message || "Delete failed");
    }

    showToast("Book deleted successfully.");
    loadAdminBooks();
  } finally {
    hideLoader();
  }
}
// Logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

// Initialize admin page
loadAdminBooks();
