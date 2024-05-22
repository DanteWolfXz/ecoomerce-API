// Función para desloguear al usuario
function logoutUser() {
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      }
    })
    .then(response => {
      if (response.ok) {
        window.location.href = '/login'; 
      } else {
        console.error('Error al desloguear al usuario:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Hubo un error al enviar la solicitud:', error);
    });
  }


$('#logout').click(function() {
    logoutUser();
  });
  
  