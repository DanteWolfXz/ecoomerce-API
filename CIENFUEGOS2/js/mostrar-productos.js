const endpointURL = 'https://ecoomerce-api-v7wq.onrender.com/api/products';

function cargarProductosDesdeServidor() {
    fetch(endpointURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error al obtener productos');
            }
        })
        .then(productos => {
            mostrarProductos(productos, 'recomendado', 'recomendados-container');
            mostrarProductos(productos, 'cotillon', 'cotillon-container');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function mostrarProductos(productos, categoria, containerId) {
    const contenedor = document.getElementById(containerId);
    contenedor.innerHTML = '';

    productos.filter(producto => producto.categoria === categoria).forEach(producto => {
        const nuevoProducto = document.createElement('div');
        nuevoProducto.classList.add('pro');

        nuevoProducto.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="des">
                <span>${producto.categoria}</span>
                <h5>${producto.nombre}</h5>
                <div class="star">
                    ${Array.from({ length: producto.estrellas }, () => '<i class="fa-solid fa-star"></i>').join('')}
                </div>
                <h4>$ ${producto.precio}</h4>
            </div>
            <button class="add-to-cart" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}" data-imagen="${producto.imagen}">
                <span class="al-carrito">Añadir</span>
                <span class="añadido">Añadido</span>
                <i class="fas fa-shopping-cart"></i>
                <i class="fas fa-box"></i>
            </button>
        `;

        contenedor.appendChild(nuevoProducto);
    });

    // Agregar event listener a los botones "Añadir al carrito" después de que se hayan generado
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const nombre = button.getAttribute('data-nombre');
            const precio = button.getAttribute('data-precio');
            const imagen = button.getAttribute('data-imagen');
            agregarAlCarrito(id, nombre, precio, imagen);
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 3000);
        });
    });
}

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

window.onload = () => {
    cargarProductosDesdeServidor();
};
