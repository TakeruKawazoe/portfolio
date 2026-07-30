document.documentElement.classList.add("js");

const siteHeader = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const globalNavigation = document.querySelector("#global-navigation");
const navigationLinks = [...globalNavigation.querySelectorAll('a[href^="#"]')];
const observedSections = [...document.querySelectorAll("main section[id]")];
const desktopMedia = window.matchMedia("(min-width: 821px)");

function closeMenu() {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "メニューを開く");
    globalNavigation.dataset.open = "false";
}

function openMenu() {
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "メニューを閉じる");
    globalNavigation.dataset.open = "true";
}

menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    if (isOpen) {
        closeMenu();
        return;
    }
    openMenu();
});

navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    const isMenuOpen = menuButton.getAttribute("aria-expanded") === "true";
    if (event.key === "Escape" && isMenuOpen) {
        closeMenu();
        menuButton.focus();
    }
});

desktopMedia.addEventListener("change", (event) => {
    if (event.matches) {
        closeMenu();
    }
});

window.addEventListener("scroll", () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
}, { passive: true });

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        navigationLinks.forEach((link) => {
            const targetId = link.getAttribute("href").slice(1);
            if (targetId === entry.target.id) {
                link.setAttribute("aria-current", "true");
                return;
            }
            link.removeAttribute("aria-current");
        });
    });
}, {
    rootMargin: "-25% 0px -65% 0px",
    threshold: 0,
});

observedSections.forEach((section) => sectionObserver.observe(section));
