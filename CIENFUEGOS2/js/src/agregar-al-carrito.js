function agregarAlCarrito(productoId, nombre, precio, imagen) {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');

    if (!accessToken || !userId) {
        // Si el usuario no está autenticado, muestra un popup y detiene la ejecución
        alert('Debe iniciar sesión para agregar productos al carrito.');
        return;
    }

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Verificar si el producto ya está en el carrito
    const productoEnCarrito = carrito.find(p => p.id === productoId);

    if (productoEnCarrito) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        productoEnCarrito.cantidad++;
    } else {
        // Si el producto no está en el carrito, agregarlo con cantidad 1
        carrito.push({ id: productoId, nombre: nombre, precio: precio, imagen: imagen, cantidad: 1 });
    }

    // Actualizar localStorage con el nuevo carrito
    localStorage.setItem('carrito', JSON.stringify(carrito));

}
