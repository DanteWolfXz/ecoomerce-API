const cartBtn = document.querySelector('.add-to-cart')

cartBtn.addEventListener('click', () => {
    
    cartBtn.classList.add('clicked')

    setTimeout(() => {
        
        cartBtn.classList.remove('clicked')

    }, 3000);
})