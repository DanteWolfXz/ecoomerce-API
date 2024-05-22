// Verifica si el token de acceso está presente en el almacenamiento local
const accessToken = localStorage.getItem('accessToken');
if (accessToken) {
  // Si el token está presente, cambia el HTML del elemento 'LoginLink' para incluir el menú desplegable
  document.getElementById('LoginLink').innerHTML = `
    <li id="LoginLink" class="active dropdown">
        <a href="mi-cuenta" class="dropbtn">Mi Cuenta</a>
        <div class="dropdown-content">
            <a href="/mi-cuenta">Perfil</a>
            <a href="#">Mis Pedidos</a>
            <a href="#" id="logout">Cerrar Sesion</a>
        </div>
    </li>`;
} else {
  // Si el token no está presente, el usuario no está autenticado
  console.log('El usuario no está autenticado');
}

// Menu desplegable
$('#LoginLink').click(function() {
  $('.dropdown-content').toggle();
});

// Controlador de eventos para el botón de deslogueo
$('#logout').click(function() {
  // Elimina el token de acceso del almacenamiento local
  localStorage.removeItem('accessToken');
  // Realiza cualquier otra acción necesaria para desloguear al usuario
  // Por ejemplo, redirigir a la página de inicio de sesión
  window.location.href = '/'; // Cambiar '/login' por la ruta de tu página de inicio de sesión
});
