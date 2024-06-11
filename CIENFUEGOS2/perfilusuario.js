document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    const accessToken = localStorage.getItem('accessToken');

    if (!userId || !accessToken) {
        console.error('ID de usuario o token de acceso no encontrados en localStorage');
        return;
    }

    try {
        // Obtener información del perfil del usuario
        const profileResponse = await fetch(`/api/users/profile/${userId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (profileResponse.ok) {
            const user = await profileResponse.json();
            document.getElementById('username').textContent = user.username;
            document.getElementById('email').textContent = user.email;
            document.getElementById('dni').textContent = user.dni;
            document.getElementById('phone').textContent = user.phone;
        } else {
            console.error('Error al obtener los datos del usuario:', profileResponse.statusText);
        }

        // Obtener pedidos del usuario
        const ordersResponse = await fetch(`/api/orders/find/${userId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (ordersResponse.ok) {
            const orders = await ordersResponse.json();
            const orderList = document.getElementById('order-list');
            orderList.innerHTML = ''; // Limpiar la lista de pedidos

            if (orders.length === 0) {
                const listItem = document.createElement('li');
                listItem.textContent = 'No hay pedidos disponibles';
                orderList.appendChild(listItem);
            } else {
                orders.forEach(order => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `ID: ${order._id}, Cantidad: ${order.amount}, Estado: ${order.status}, Entregado: ${order.delivered}`;
                    orderList.appendChild(listItem);
                });
            }
        } else {
            console.error('Error al obtener los pedidos del usuario:', ordersResponse.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
