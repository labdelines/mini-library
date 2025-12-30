// public/toast.js
(function () {
  const toastHTML = `
    <div id="toast" class="toast hidden"></div>
  `;

  document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("beforeend", toastHTML);
  });

  window.showToast = function (message, type = "success", duration = 3000) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove("hidden");

    setTimeout(() => {
      toast.classList.add("hidden");
    }, duration);
  };
})();
