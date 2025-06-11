const imgContElm = document.querySelector(".img-container");
const imgElm = document.querySelector(".img-container img");
const listProductsElm = document.querySelector(".list-products");

let zoomScale = 1;

function updateTransform(x = null, y = null) {
    if (x !== null && y !== null) {
        const rect = imgContElm.getBoundingClientRect();
        const left = -((imgElm.offsetWidth - rect.width) * x / rect.width);
        const top = -((imgElm.offsetHeight - rect.height) * y / rect.height);

        imgElm.style.transformOrigin = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
        imgElm.style.left = `${left}px`;
        imgElm.style.top = `${top}px`;
    }

    imgElm.style.transform = `scale(${zoomScale})`;
    imgElm.style.position = 'absolute';
}

imgContElm.addEventListener('mouseenter', () => {
    updateTransform();
});
imgContElm.addEventListener('mouseleave', () => {
    zoomScale = 1;
    imgElm.style.transform = `scale(1)`;
    imgElm.style.left = '0';
    imgElm.style.top = '0';
});

imgContElm.addEventListener('mousemove', (mouseEvent) => {
    const rect = imgContElm.getBoundingClientRect();
    const x = mouseEvent.clientX - rect.left;
    const y = mouseEvent.clientY - rect.top;
    updateTransform(x, y);
});

Array.from(listProductsElm.children).forEach((productElm) => {
    productElm.addEventListener('click', () => {
        const newSrc = productElm.querySelector('img').src;
        imgElm.src = newSrc;
        Array.from(listProductsElm.children).forEach(prod => prod.classList.remove('active'));
        productElm.classList.add('active');
    });
});

function changeHeight() {
    imgContElm.style.height = imgContElm.clientWidth + 'px';
}
changeHeight();
window.addEventListener('resize', changeHeight);

// Zoom with mouse wheel
imgContElm.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
        // Prevent zoom gesture (not scroll)
        e.preventDefault();

        const delta = Math.sign(e.deltaY);
        zoomScale = Math.min(Math.max(0.5, zoomScale - delta * 0.1), 3);
        updateTransform();
    }
}, { passive: false });

// Touch zoom (pinch gesture)
let initialDistance = null;

function getDistance(touches) {
    const [touch1, touch2] = touches;
    return Math.hypot(
        touch2.pageX - touch1.pageX,
        touch2.pageY - touch1.pageY
    );
}

imgContElm.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches);
    }
}, { passive: true });

imgContElm.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && initialDistance) {
        const currentDistance = getDistance(e.touches);
        const scaleChange = currentDistance / initialDistance;
        zoomScale = Math.min(Math.max(0.5, scaleChange), 3);
        updateTransform();
        e.preventDefault(); // only block pinch gesture, not scroll
    }
}, { passive: false });

imgContElm.addEventListener('touchend', () => {
    initialDistance = null;
});
