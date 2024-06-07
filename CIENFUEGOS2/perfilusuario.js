document.addEventListener('DOMContentLoaded', async () => {
    try {
      const userId = localStorage.getItem('userId'); // Aquí deberías obtener el ID del usuario actual
      const accessToken = localStorage.getItem('accessToken'); // Obtener el token de acceso del localStorage
      const response = await fetch(`/api/users/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.ok) {
        const { user, orders } = await response.json();
        document.getElementById('username').textContent = user.username;
        document.getElementById('email').textContent = user.email;
        document.getElementById('dni').textContent = user.dni;
        document.getElementById('phone').textContent = user.phone;
        // Mostrar los pedidos del usuario si existen
        if (orders && orders.length > 0) {
          const orderList = document.getElementById('order-list');
          orders.forEach(order => {
            const listItem = document.createElement('li');
            listItem.textContent = `Pedido #${order._id}: ${order.quantity} x ${order.product}`;
            orderList.appendChild(listItem);
          });
        } else {
          // Si no hay pedidos, muestra un mensaje indicando que no hay pedidos disponibles
          const orderList = document.getElementById('order-list');
          const listItem = document.createElement('li');
          listItem.textContent = 'No hay pedidos disponibles';
          orderList.appendChild(listItem);
        }
      } else {
        console.error('Error al obtener los datos del usuario y sus pedidos:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  