document.addEventListener("DOMContentLoaded", function () {
    initApp();

    function initApp() {
        setupPopup();
        setupTabs();
        setupPasswordToggle();
      
    }

    // 🟢 1️⃣ Xử lý mở/đóng popup
    function setupPopup() {
        const openPopupBtn = document.getElementById("login-membera");
        const closePopupBtn = document.getElementById("hoangvumobile-close-popup-btn");
        const popupOverlay = document.getElementById("hoangvumobile-popup-overlay");

        if (openPopupBtn) {
            openPopupBtn.addEventListener("click", () => togglePopup(true));
        }
        if (closePopupBtn) {
            closePopupBtn.addEventListener("click", () => togglePopup(false));
        }
        if (popupOverlay) {
            popupOverlay.addEventListener("click", (e) => {
                if (e.target === popupOverlay) togglePopup(false);
            });
        }
    }

    function togglePopup(show) {
        const popupOverlay = document.getElementById("hoangvumobile-popup-overlay");
        if (!popupOverlay) return;
        popupOverlay.classList.toggle("active", show);
        document.body.style.overflow = show ? "hidden" : "";
    }

    // 🟢 2️⃣ Xử lý chuyển tab
    function setupTabs() {
        document.addEventListener("click", (event) => {
            if (!event.target.classList.contains("hoangvumobile-tab-btn")) return;

            const tabBtns = document.querySelectorAll(".hoangvumobile-tab-btn");
            const tabIndicator = document.querySelector(".hoangvumobile-tab-indicator");
            const formContents = document.querySelectorAll(".hoangvumobile-form-content");

            tabBtns.forEach((b, index) => {
                if (b === event.target) {
                    b.classList.add("active");
                    tabIndicator.style.transform = `translateX(${index * 100}%)`;
                    formContents.forEach((content) => {
                        content.classList.toggle("active", content.id === b.getAttribute("data-tab"));
                    });
                } else {
                    b.classList.remove("active");
                }
            });
        });
    }

    // 🟢 3️⃣ Xử lý hiển thị mật khẩu
    function setupPasswordToggle() {
        document.addEventListener("click", (event) => {
            if (!event.target.classList.contains("hoangvumobile-toggle-password")) return;

            const input = event.target.closest(".hoangvumobile-input-wrapper").querySelector("input");
            if (!input) return;

            input.type = input.type === "password" ? "text" : "password";
            event.target.querySelector(".hoangvumobile-eye-icon")?.classList.toggle("hoangvumobile-hidden");
            event.target.querySelector(".hoangvumobile-eye-off-icon")?.classList.toggle("hoangvumobile-hidden");
        });
    }

    
});
