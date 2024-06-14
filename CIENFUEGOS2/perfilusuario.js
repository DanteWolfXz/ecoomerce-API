document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    const accessToken = localStorage.getItem('accessToken');

    if (!userId || !accessToken) {
        console.error('ID de usuario o token de acceso no encontrados en localStorage');
        return;
    }

    await obtenerPerfilUsuario(userId, accessToken);
    await obtenerPedidosUsuario(userId, accessToken);
});

async function obtenerPerfilUsuario(userId, accessToken) {
    try {
        const profileResponse = await fetch(`/api/users/profile/${userId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (profileResponse.ok) {
            const { user } = await profileResponse.json();
            console.log("Datos del usuario:", user);

            document.getElementById('username').textContent = user.username;
            document.getElementById('email').textContent = user.email;
            document.getElementById('dni').textContent = user.dni;
            document.getElementById('phone').textContent = user.phone;
        } else {
            console.error('Error al obtener los datos del usuario:', profileResponse.statusText);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
    }
}

async function obtenerPedidosUsuario(userId, accessToken) {
    try {
        const ordersResponse = await fetch(`/api/orders/find/${userId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

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
                    const statusClass = getStatusClass(order.status);

                    listItem.innerHTML = `
                        <div>
                            <strong>ID del Pedido:</strong> ${order._id}<br>
                            <strong>Productos:</strong> ${order.products.map(product => product.title).join(', ')}<br>
                            <strong>Monto:</strong> ${order.totalAmount}<br>
                            <strong>Estado:</strong> <span class="${statusClass}">${order.status}</span>
                        </div>
                    `;
                    orderList.appendChild(listItem);
                });
            }
        } else {
            console.error('Error al obtener los pedidos del usuario:', ordersResponse.statusText);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    } catch (error) {
        console.error('Error al obtener los pedidos del usuario:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
    }
}

function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'entregado':
            return 'status-entregado';
        case 'pendiente':
            return 'status-pendiente';
        case 'cancelado':
            return 'status-cancelado';
        default:
            return '';
    }
}
