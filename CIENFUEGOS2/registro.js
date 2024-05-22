    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        // Aquí puedes agregar tu lógica de validación del formulario
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementsByName('confirmPassword')[0].value;
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Si todo está bien, se envía el formulario
        var formData = new FormData(this);

        fetch(this.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => {
            // Aquí puedes manejar la respuesta del servidor
            console.log(data);
            // Redirigir a otra página
            window.location.href = '/otra-pagina.html';
        })
        .catch(error => {
            console.error('Error:', error);
            // Manejar el error, mostrar un mensaje, etc.
        });
    });

