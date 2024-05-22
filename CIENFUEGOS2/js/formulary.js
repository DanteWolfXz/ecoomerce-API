document.getElementById('registrationForm').addEventListener('submit', function(event) {
    // Validar número de teléfono
    var phoneInput = document.getElementById('phone');
    if (!validatePhone(phoneInput.value)) {
        alert('El número de celular debe comenzar con 11 y tener 10 dígitos');
        event.preventDefault(); 
        return;
    }

    // Validar DNI
    var dniInput = document.getElementById('dni');
    if (!validateDNI(dniInput.value)) {
        alert('El DNI debe contener exactamente 8 dígitos');
        event.preventDefault(); 
        return;
    }


});

function validatePhone(phone) {
    return /^11\d{8}$/.test(phone);
}

function validateDNI(dni) { 
    return /^\d{8}$/.test(dni);
}
