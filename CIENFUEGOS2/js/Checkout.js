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
        const orderDataList = [
            {
                title: "producto1",
                quantity: 1,
                price: 100,
            },
            {
                title: "producto2",
                quantity: 2,
                price: 150,
            },
            // Agrega más objetos orderData según sea necesario
        ];

        const response = await fetch("https://ecoomerce-api-v7wq.onrender.com/create_preference", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-idempotency-key": idempotencyKey,
            },
            body: JSON.stringify(orderDataList),
        });

        const preference = await response.json();
        createCheckoutButton(preference.id);
    } catch (error) {
        alert("error :(");
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
