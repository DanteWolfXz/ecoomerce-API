document.addEventListener('DOMContentLoaded', async () => {
    try {
      const userId = localStorage.getItem('userId');
      const accessToken = localStorage.getItem('accessToken');
      
      console.log("ID del usuario:", userId);
      console.log("Token de acceso:", accessToken);
  
      const response = await fetch(`/api/users/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
  
      console.log("Respuesta del servidor:", response);
  
      if (response.ok) {
        const { user } = await response.json();
        console.log("Datos del usuario:", user);
  
        document.getElementById('username').textContent = user.username;
        document.getElementById('email').textContent = user.email;
        document.getElementById('dni').textContent = user.dni;
        document.getElementById('phone').textContent = user.phone;
  
        const orderList = document.getElementById('order-list');
        const listItem = document.createElement('li');
        listItem.textContent = 'No hay pedidos disponibles';
        orderList.appendChild(listItem);
      } else {
        console.error('Error al obtener los datos del usuario:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  