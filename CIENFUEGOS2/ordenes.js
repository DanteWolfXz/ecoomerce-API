// Obtener el elemento select
var select = document.getElementById('statusSelect');

// Escuchar el evento change en el select
select.addEventListener('change', function() {
    // Obtener el color de fondo del estado seleccionado
    var color = select.options[select.selectedIndex].style.backgroundColor;
    // Establecer el color de fondo del select
    select.style.backgroundColor = color;
});


document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        console.error('Token de acceso no encontrado en localStorage');
        return;
    }

    await obtenerOrdenes(accessToken);
});

async function obtenerOrdenes(accessToken) {
    try {
        const ordersResponse = await fetch(`/api/orders`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (ordersResponse.ok) {
            const orders = await ordersResponse.json();
            console.log("Órdenes:", orders);

            const ordersTableBody = document.getElementById('ordersTableBody');
            ordersTableBody.innerHTML = ''; // Limpiar tabla actual

            if (orders.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="7">No hay órdenes disponibles</td>`;
                ordersTableBody.appendChild(row);
            } else {
                orders.forEach(order => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="table_id">${order._id}</td>
                        <td class="table_user"><img src="https://static.vecteezy.com/system/resources/previews/005/005/837/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg" alt="usuario"></td>
                        <td class="table_localidad">${order.localidad || 'N/A'}</td>
                        <td class="table_date">${new Date(order.createdAt).toLocaleDateString()}</td>
                        <td class="table_pickup_date"><input type="datetime-local" value="${order.pickupDate || ''}"></td>
                        <td class="table_status">
                            <select class="statusSelect" data-order-id="${order._id}">
                                <option value="pendiente" ${order.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                                <option value="entregado" ${order.status === 'entregado' ? 'selected' : ''}>Entregado</option>
                                <option value="cancelado" ${order.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                            </select>
                        </td>
                        <td class="table_total">$${order.totalAmount}</td>
                    `;
                    ordersTableBody.appendChild(row);
                });

                document.querySelectorAll('.statusSelect').forEach(select => {
                    select.addEventListener('change', actualizarEstadoOrden);
                });
            }
        } else {
            console.error('Error al obtener las órdenes:', ordersResponse.statusText);
        }
    } catch (error) {
        console.error('Error al obtener las órdenes:', error);
    }
}

async function actualizarEstadoOrden(event) {
    const select = event.target;
    const orderId = select.getAttribute('data-order-id');
    const newStatus = select.value;
    const accessToken = localStorage.getItem('accessToken');

    try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            console.log(`Orden ${orderId} actualizada a ${newStatus}`);
        } else {
            console.error('Error al actualizar la orden:', response.statusText);
        }
    } catch (error) {
        console.error('Error al actualizar la orden:', error);
    }
}
