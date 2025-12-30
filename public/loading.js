// public/loading.js

(function () {
  // Inject loader HTML once
  const loaderHTML = `
    <div id="global-loader" class="loader hidden">
      <div class="loader-spinner"></div>
      <p class="loader-text">Loading...</p>
    </div>
  `;

  document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("beforeend", loaderHTML);
  });

  // Expose global methods
  window.showLoader = function (text = "Loading...") {
    const loader = document.getElementById("global-loader");
    if (!loader) return;

    loader.querySelector(".loader-text").textContent = text;
    loader.classList.remove("hidden");
  };

  window.hideLoader = function () {
    const loader = document.getElementById("global-loader");
    if (!loader) return;

    loader.classList.add("hidden");
  };
})();
