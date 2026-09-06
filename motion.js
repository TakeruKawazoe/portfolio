const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

const revealSelectors = [
    ".orbit-identity > *",
    ".section-heading > *",
    ".work-card",
    ".experience-summary",
    ".experience-steps > li",
    ".approach-grid > *",
    ".skills-priority",
    ".skills-grid > *",
    ".profile-layout > *",
    ".contact-layout > *",
    ".detail-hero-copy > *",
    ".product-shot",
    ".case-section .section-kicker",
    ".case-section h2",
    ".case-section .section-intro",
    ".feature-item",
    ".architecture-flow",
    ".model-steps > div",
    ".metric-item",
    ".integration-item",
    ".decision-list > article",
    ".comparison-table",
    ".future-list > li",
];

const revealItems = [...document.querySelectorAll(revealSelectors.join(","))];

function showAllRevealItems() {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

function setupRevealAnimations() {
    revealItems.forEach((item, index) => {
        item.classList.add("reveal-item");
        item.style.setProperty("--reveal-order", String(index % 4));
    });
    document.documentElement.classList.add("motion-ready");

    if (reducedMotionMedia.matches || !("IntersectionObserver" in window)) {
        showAllRevealItems();
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
    });

    revealItems.forEach((item) => revealObserver.observe(item));
}

function formatCount(value, element) {
    const decimals = Number(element.dataset.countDecimals || 0);
    const fixedValue = value.toFixed(decimals);

    if (element.dataset.countFormat === "comma") {
        return Number(fixedValue).toLocaleString("ja-JP", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    }

    return fixedValue;
}

function setFinalCount(element) {
    element.textContent = formatCount(Number(element.dataset.countTo), element);
}

function animateCount(element) {
    if (element.dataset.counted === "true") {
        return;
    }

    element.dataset.counted = "true";
    const target = Number(element.dataset.countTo);

    if (reducedMotionMedia.matches) {
        setFinalCount(element);
        return;
    }

    const duration = 900;
    const startTime = performance.now();

    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        element.textContent = formatCount(target * easedProgress, element);

        if (progress < 1) {
            requestAnimationFrame(update);
            return;
        }

        setFinalCount(element);
    }

    requestAnimationFrame(update);
}

function setupCountAnimations() {
    const countItems = [...document.querySelectorAll("[data-count-to]")];

    if (reducedMotionMedia.matches || !("IntersectionObserver" in window)) {
        countItems.forEach(setFinalCount);
        return;
    }

    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            animateCount(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.55 });

    countItems.forEach((item) => countObserver.observe(item));
}

const orbitHero = document.querySelector(".orbit-hero");
let orbitIsVisible = false;

function syncOrbitMotion() {
    if (!orbitHero) {
        return;
    }

    const shouldRun = orbitIsVisible
        && !document.hidden
        && !reducedMotionMedia.matches;

    orbitHero.classList.toggle("is-running", shouldRun);
}

function setupOrbitMotion() {
    if (!orbitHero) {
        return;
    }

    document.addEventListener("visibilitychange", syncOrbitMotion);

    if (!("IntersectionObserver" in window)) {
        orbitIsVisible = true;
        syncOrbitMotion();
        return;
    }

    const orbitObserver = new IntersectionObserver(([entry]) => {
        orbitIsVisible = entry.isIntersecting;
        syncOrbitMotion();
    }, { threshold: 0.15 });

    orbitObserver.observe(orbitHero);
}

setupRevealAnimations();
setupCountAnimations();
setupOrbitMotion();

reducedMotionMedia.addEventListener("change", (event) => {
    if (event.matches) {
        showAllRevealItems();
        document.querySelectorAll("[data-count-to]").forEach(setFinalCount);
    }

    syncOrbitMotion();
});
