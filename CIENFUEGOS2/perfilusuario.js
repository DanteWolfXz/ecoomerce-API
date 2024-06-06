document.addEventListener('DOMContentLoaded', async () => {
    try {
      const userId = '123456789'; // Aquí deberías obtener el ID del usuario actual
      const response = await fetch(`/api/users/profile/${userId}`);
      if (response.ok) {
        const { user, orders } = await response.json();
        // Actualizar el contenido del HTML con los datos del usuario
        document.getElementById('username').textContent = user.username;
        document.getElementById('email').textContent = user.email;
        document.getElementById('dni').textContent = user.dni;
        document.getElementById('phone').textContent = user.phone;
        document.getElementById('isAdmin').textContent = user.isAdmin ? 'Sí' : 'No';
        // Mostrar los pedidos del usuario
        const orderList = document.getElementById('order-list');
        orders.forEach(order => {
          const listItem = document.createElement('li');
          listItem.textContent = `Pedido #${order._id}: ${order.quantity} x ${order.product}`;
          orderList.appendChild(listItem);
        });
      } else {
        console.error('Error al obtener los datos del usuario y sus pedidos:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  