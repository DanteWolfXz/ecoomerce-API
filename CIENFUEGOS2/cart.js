document.addEventListener('DOMContentLoaded', mostrarCarrito);

function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const carritoList = document.getElementById('cart-table-body');
    const subtotalElement = document.getElementById('subtotal-amount');
    const totalElement = document.getElementById('total-amount');

    if (!carritoList || !subtotalElement || !totalElement) {
        console.error("Elementos no encontrados en el documento.");
        return;
    }

    carritoList.innerHTML = '';

    let subtotal = 0;

    carrito.forEach(producto => {
        const row = document.createElement('tr');
        const subtotalProducto = producto.precio * producto.cantidad;

        subtotal += subtotalProducto;

        row.innerHTML = `
            <td><i class="fas fa-times-circle" onclick="eliminarProducto('${producto.nombre}')"></i></td>
            <td><img src="${producto.imagen}" alt="${producto.nombre}"></td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td><input type="number" value="${producto.cantidad}" onchange="actualizarSubtotal('${producto.nombre}', this)"></td>
            <td>${subtotalProducto}</td>
        `;
        carritoList.appendChild(row);
    });

    subtotalElement.textContent = `$ ${subtotal}`;
    totalElement.textContent = `$ ${subtotal}`;
}

function eliminarProducto(nombreProducto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    
    carrito = carrito.filter(item => item.nombre !== nombreProducto);

    
    localStorage.setItem('carrito', JSON.stringify(carrito));

    mostrarCarrito();
}

function actualizarSubtotal(nombreProducto, inputCantidad) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const producto = carrito.find(item => item.nombre === nombreProducto);

    const nuevaCantidad = parseInt(inputCantidad.value);
    if (nuevaCantidad >= 1) {
        producto.cantidad = nuevaCantidad;

        localStorage.setItem('carrito', JSON.stringify(carrito));

        mostrarCarrito();
    } else {
        producto.cantidad = 1;
        inputCantidad.value = 1;

        localStorage.setItem('carrito', JSON.stringify(carrito));

        mostrarCarrito();

        console.warn('La cantidad no puede ser menor a 1. Se ha establecido la cantidad a 1.');
    }
}

// PROCESAR EL PAGO
function procesarPago() {
    
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const productsData = carrito.map(producto => {
        return {
            title: producto.nombre,
            quantity: producto.cantidad,
            price: producto.precio
        };
    });


    fetch('/create_preference', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(carrito)
    })
    .then(response => {
        if (response.ok) {
            // Convertir la respuesta a JSON
            return response.json();
        } else {
            // Si hay un error en la respuesta, puedes manejarlo aquí
            throw new Error('Error al procesar el pago: ' + response.statusText);
        }
    })
    .then(data => {
        // Acceder a la URL de redirección desde los datos recibidos
        if (data.redirectUrl) {
            // Redirigir al usuario a la página de pago de MercadoPago
            window.location.href = data.redirectUrl;
        } else {
            throw new Error('Error: No se recibió la URL de redirección');
        }
    })
    .catch(error => {
        // Si hay un error en la solicitud, puedes manejarlo aquí
        console.error('Error al procesar el pago:', error);
    });
}







