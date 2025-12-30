// Protect page
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/login.html";
}

// Load admin book list
async function loadAdminBooks() {
  try {
    showLoader("Loading books...");
    const res = await fetch("/books", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to load books");
    }
    const books = await res.json();
    const container = document.getElementById("adminBooks");
    container.innerHTML = "";

    books.forEach((book) => {
  const div = document.createElement("div");
  div.className = "admin-book-card";

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

  container.append(div);
});

  } catch (err) {
    showToast(err.message, "error");
  } finally {
    hideLoader();
  }
}

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

    const res = await fetch(`/books/${id}`, {
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
