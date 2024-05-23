const mp = new MercadoPago('TEST-b908db80-ef27-419d-8364-920f40a8326f', {
    locale: "es-AR",
    advancedFraudPrevention: true,
});
const bricksBuilder = mp.bricks();
const continuarPagoBtn = document.getElementById("continuar-pago");

const generateIdempotencyKey = () => {
    return uuidv4(); // Utilizamos una función externa para generar un UUID
};

const createCheckoutButton = (preferenceId) => {
    const renderComponent = async () => {
        bricksBuilder.create("wallet", "mercadopagoButton", {
            initialization: {
                preferenceId: preferenceId,
            },
        });
    };

    renderComponent();
};

const processPayment = async () => {
    try {
        const idempotencyKey = generateIdempotencyKey();
        const carritoItems = JSON.parse(localStorage.getItem('carrito')) || [];
        
        if (carritoItems.length === 0) {
            throw new Error('No hay productos en el carrito');
        }

        const items = carritoItems.map(item => ({
            id: item.id,
            title: item.nombre,
            quantity: item.cantidad,
            unit_price: item.precio,
        }));

        console.log("Datos del carrito:", items);

        const orderData = {
            items: items,
        };

        console.log("Datos enviados al backend:", orderData);

        const response = await fetch('https://ecoomerce-api-v7wq.onrender.com/create_preference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Idempotency-Key': idempotencyKey,
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
};

continuarPagoBtn.addEventListener("click", processPayment);
