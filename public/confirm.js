// public/confirm.js
(function () {
  const modalHTML = `
    <div id="confirm-modal" class="confirm-overlay hidden">
      <div class="confirm-box">
        <p id="confirm-message"></p>
        <div class="confirm-actions">
          <button id="confirm-cancel" class="secondary-btn">Cancel</button>
          <button id="confirm-ok" class="primary-btn">Confirm</button>
        </div>
      </div>
    </div>
  `;

  document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  });

  window.confirmAction = function (message = "Are you sure?") {
    return new Promise((resolve) => {
      const overlay = document.getElementById("confirm-modal");
      const text = document.getElementById("confirm-message");
      const okBtn = document.getElementById("confirm-ok");
      const cancelBtn = document.getElementById("confirm-cancel");

      text.textContent = message;
      overlay.classList.remove("hidden");

      const cleanup = () => {
        overlay.classList.add("hidden");
        okBtn.onclick = null;
        cancelBtn.onclick = null;
      };

      okBtn.onclick = () => {
        cleanup();
        resolve(true);
      };

      cancelBtn.onclick = () => {
        cleanup();
        resolve(false);
      };
    });
  };
})();
