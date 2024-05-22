const cartBtns = document.querySelectorAll('.add-to-cart');

cartBtns.forEach(cartBtn => {
    cartBtn.addEventListener('click', () => {
        cartBtn.classList.add('clicked');
        setTimeout(() => {
            cartBtn.classList.remove('clicked');
        }, 300);
    });
});