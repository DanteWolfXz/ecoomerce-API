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
                row.innerHTML = `<td colspan="8">No hay órdenes disponibles</td>`;
                ordersTableBody.appendChild(row);
            } else {
                orders.forEach(order => {
                    const row = document.createElement('tr');
                    const statusSelect = document.createElement('select');
                    statusSelect.classList.add('statusSelect');
                    statusSelect.setAttribute('data-order-id', order._id);

                    const statuses = [
                        { value: 'approved', text: 'Approved', color: '#ffc107' },
                        { value: 'entregado', text: 'Entregado', color: '#28a745' },
                        { value: 'cancelado', text: 'Cancelado', color: '#dc3545' }
                    ];

                    statuses.forEach(status => {
                        const option = document.createElement('option');
                        option.value = status.value;
                        option.text = status.text;
                        option.style.backgroundColor = status.color;
                        if (order.status === status.value) {
                            option.selected = true;
                            statusSelect.style.backgroundColor = status.color;
                        }
                        statusSelect.appendChild(option);
                    });

                    row.innerHTML = `
                        <td class="table_id">${order._id}</td>
                        <td class="table_user"><img src="https://static.vecteezy.com/system/resources/previews/005/005/837/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg" alt="usuario"></td>
                        <td class="table_localidad">${order.localidad || 'N/A'}</td>
                        <td class="table_date">${new Date(order.createdAt).toLocaleDateString()}</td>
                        <td class="table_pickup_date"><input type="datetime-local" value="${order.pickupDate || ''}"></td>
                        <td class="table_status"></td>
                        <td class="table_total">$${order.totalAmount}</td>
                        <td><button class="updateButton" data-order-id="${order._id}">Actualizar</button></td>
                    `;
                    row.querySelector('.table_status').appendChild(statusSelect);
                    ordersTableBody.appendChild(row);
                });

                document.querySelectorAll('.statusSelect').forEach(select => {
                    select.addEventListener('change', function () {
                        var color = select.options[select.selectedIndex].style.backgroundColor;
                        select.style.backgroundColor = color;
                    });
                });

                document.querySelectorAll('.updateButton').forEach(button => {
                    button.addEventListener('click', actualizarEstadoOrden);
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
    const button = event.target;
    const orderId = button.getAttribute('data-order-id');
    const select = document.querySelector(`.statusSelect[data-order-id="${orderId}"]`);
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

document.getElementById('searchInput').addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase();
    const rows = document.querySelectorAll('#ordersTableBody tr');

    rows.forEach(row => {
        const userCell = row.querySelector('.table_user');
        const idCell = row.querySelector('.table_id');
        const userName = userCell ? userCell.textContent.toLowerCase() : '';
        const orderId = idCell ? idCell.textContent.toLowerCase() : '';

        if (userName.includes(searchTerm) || orderId.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});
