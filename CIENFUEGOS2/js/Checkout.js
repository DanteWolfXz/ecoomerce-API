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
        const productosEnCarrito = document.querySelectorAll('#cart-table-body tr'); // Obtener todas las filas de productos en el carrito

        const orderDataList = [];

        productosEnCarrito.forEach((productoEnCarrito, indice) => { // Iterar sobre cada fila del carrito
            const columns = productoEnCarrito.getElementsByTagName('td');

            const nombreProducto = columns[2].textContent; // Obtener el nombre del producto de la tercera columna
            const cantidadInput = columns[4].getElementsByTagName('input')[0]; // Obtener el input de cantidad del producto de la quinta columna

            // Obtener la cantidad actualizada del producto
            const cantidad = parseInt(cantidadInput.value);

            if (cantidad > 0) { // Solo agregar el producto si la cantidad es mayor que cero
                const orderData = {
                    title: nombreProducto,
                    quantity: cantidad,
                    price: parseFloat(columns[3].textContent), // Obtener el precio del producto de la cuarta columna
                };

                orderDataList.push(orderData); // Agregar el objeto orderData al array orderDataList
            }
        });

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
