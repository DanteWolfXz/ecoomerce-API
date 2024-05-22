const mp = new MercadoPago('TEST-b908db80-ef27-419d-8364-920f40a8326f', {
    locale: "es-AR",
    advancedFraudPrevention: true,
});
const bricksBuilder = mp.bricks();

// Genera una nueva clave de idempotencia cada vez que se hace clic en el botón de pago
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

document.getElementById("continuar-pago").addEventListener("click", async () => {
    try {
        const idempotencyKey = generateIdempotencyKey(); // Genera una nueva clave de idempotencia

        const carritoItems = JSON.parse(localStorage.getItem('carrito')) || [];
        
        if (carritoItems.length === 0) {
            throw new Error('No hay productos en el carrito');
        }

        // Convertir los datos del carrito al formato requerido por MercadoPago
        const items = carritoItems.map(item => ({
            id: item.id,
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio,
        }));

        // Depurar: Imprimir los datos del carrito antes de enviar la solicitud al backend
        console.log("Datos del carrito:", items);

        // Crear la orden de pago con los datos de todos los productos del carrito
        const orderData = {
            items: items,
        };

        // Depurar: Imprimir los datos que se enviarán al backend
        console.log("Datos enviados al backend:", orderData);

        // Enviar la orden de pago al backend utilizando la clave de idempotencia generada
        const response = await fetch('http://localhost:8000/create_preference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Idempotency-Key': idempotencyKey, // Utiliza la clave de idempotencia generada
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error('Error al procesar el pago');
        }

        const preference = await response.json();
        createCheckoutButton(preference.id);
    } catch (error) {
        alert("Error al procesar el pago: " + error.message);
    }
});


const createCheckoutButton = (preferenceId) => {
    const bricksBuilder = mp.bricks();

    const renderComponent = async () => {
        bricksBuilder.create("wallet", "mercadopagoButton", {
            initialization: {
                preferenceId: preferenceId,
            },
        });
    };

    renderComponent();
};
