// Obtener el elemento select
var select = document.getElementById('statusSelect');

// Escuchar el evento change en el select
select.addEventListener('change', function() {
    // Obtener el color de fondo del estado seleccionado
    var color = select.options[select.selectedIndex].style.backgroundColor;
    // Establecer el color de fondo del select
    select.style.backgroundColor = color;
});
