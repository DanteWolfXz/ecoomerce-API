document.addEventListener('DOMContentLoaded', async () => {
    try {
        const userId = localStorage.getItem('userId');
        const accessToken = localStorage.getItem('accessToken');

        console.log("ID del usuario:", userId);
        console.log("Token de acceso:", accessToken);

        // Obtener información del perfil del usuario
        const profileResponse = await fetch(`/api/users/profile/${userId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log("Respuesta del servidor (perfil):", profileResponse);

        if (profileResponse.ok) {
            const { user } = await profileResponse.json();
            console.log("Datos del usuario:", user);

            document.getElementById('username').textContent = user.username;
            document.getElementById('email').textContent = user.email;
            document.getElementById('dni').textContent = user.dni;
            document.getElementById('phone').textContent = user.phone;

            // Obtener pedidos del usuario
            const ordersResponse = await fetch(`/api/orders/find/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log("Respuesta del servidor (pedidos):", ordersResponse);

            if (ordersResponse.ok) {
                const orders = await ordersResponse.json();
                console.log("Pedidos del usuario:", orders);

                const orderList = document.getElementById('order-list');
                orderList.innerHTML = ''; // Limpiar lista actual de pedidos

                if (orders.length === 0) {
                    const listItem = document.createElement('li');
                    listItem.textContent = 'No hay pedidos disponibles';
                    orderList.appendChild(listItem);
                } else {
                    orders.forEach(order => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <strong>ID del Pedido:</strong> ${order._id}<br>
                            <strong>Productos:</strong> ${order.products.map(product => product.productId).join(', ')}<br>
                            <strong>Monto:</strong> ${order.amount}<br>
                            <strong>Estado:</strong> ${order.status}
                        `;
                        orderList.appendChild(listItem);
                    });
                }
            } else {
                console.error('Error al obtener los pedidos del usuario:', ordersResponse.statusText);
            }
        } else {
            console.error('Error al obtener los datos del usuario:', profileResponse.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});