document.addEventListener("DOMContentLoaded", function() {
    // Tu código para agregar el event listener aquí
    var loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Evita el envío automático del formulario

            var formData = new FormData(this);

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/auth/login", true);
            xhr.onload = function() {
                // Manejar la respuesta aquí
                if (xhr.status >= 200 && xhr.status < 300) {
                    // Éxito
                    window.location.href = "/shop.html";
                } else {
                    // Error
                    console.error("Error al enviar el formulario:", xhr.statusText);
                }
            };
            xhr.onerror = function() {
                console.error("Error de red:", xhr.statusText);
            };
            xhr.send(formData);
        });
    } else {
        console.error("Elemento loginForm no encontrado en el DOM.");
    }
});
