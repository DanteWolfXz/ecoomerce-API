const mp = new MercadoPago('APP_USR-036923c5-0d70-416f-8614-76a248763ff5', {
    locale: 'es-AR'
});

const generateIdempotencyKey = () => {
    const length = 20;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let idempotencyKey = '';
    for (let i = 0; i < length; i++) {
        idempotencyKey += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return idempotencyKey;
};

const idempotencyKey = generateIdempotencyKey();
console.log(idempotencyKey);


document.getElementById('continuar-pago').addEventListener('click', async () => {
    try {
        const cartItems = JSON.parse(localStorage.getItem("carrito"));

        if (!cartItems || cartItems.length === 0) {
            alert("El carrito está vacío");
            return;
        }
        const orderDataArray = cartItems.map(item => ({
            title: item.nombre,
            quantity: item.cantidad,
            price: item.precio,
        }));
        const response = await fetch("https://server-mu2p.onrender.com/create_preference", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-idempotency-key": idempotencyKey,
            },
            body: JSON.stringify(orderDataArray),
        });

        const preferences = await response.json();

        if (Array.isArray(preferences)) {
            preferences.forEach(preference => {
                createCheckoutButton(preference.id);
            });
        } else {
            console.error("La respuesta del servidor no es un arreglo:", preferences);
            alert("Ocurrió un error al procesar la orden.");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error al procesar la orden.");
    }
});




const createCheckoutButton = (preferenceId) => {
    const bricksBuilder = mp.bricks();
    
    const renderComponent = async () => {
        if (window.checkoutButton) window.checkoutButton.unmount();
        await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId
            },
         customization: {
          texts: {
           valueProp: 'smart_option',
          },
          },
         });
    }

    renderComponent(); // Llama a la función para renderizar el botón
}
