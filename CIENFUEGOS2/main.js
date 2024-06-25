const endpointURL = 'https://ecoomerce-api-v7wq.onrender.com/api/products';
const productosPorPagina = 8;
let productosTotales = [];
let paginaActual = 1;

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
            productosTotales = productos;
            mostrarProductos(productos, paginaActual);
            crearPaginacion(productos.length);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function mostrarProductos(productos, pagina) {
    const contenedor = document.getElementById('pro-container');
    contenedor.innerHTML = '';
    const inicio = (pagina - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = productos.slice(inicio, fin);

    productosPagina.forEach(producto => {
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

    agregarEventListenersCarrito();
}

function crearPaginacion(totalProductos) {
    const totalPaginas = Math.ceil(totalProductos / productosPorPagina);
    const paginacionContainer = document.getElementById('pagination');
    paginacionContainer.innerHTML = '';

    for (let i = 1; i <= totalPaginas; i++) {
        const boton = document.createElement('button');
        boton.innerText = i;
        boton.addEventListener('click', () => cambiarPagina(i));
        paginacionContainer.appendChild(boton);
    }
}

function cambiarPagina(pagina) {
    paginaActual = pagina;
    mostrarProductos(productosTotales, pagina);
}

function buscarProductos() {
    const criterioBusqueda = document.getElementById('search-input').value.toLowerCase();
    const categoriaSeleccionada = ''; // Vacío porque no hay filtro de categoría en el HTML actual

    fetch(`${endpointURL}/buscar?query=${criterioBusqueda}&category=${categoriaSeleccionada}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error al buscar productos');
            }
        })
        .then(productos => {
            productosTotales = productos;
            mostrarProductos(productos, 1);
            crearPaginacion(productos.length);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function agregarEventListenersCarrito() {
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

document.getElementById('search-input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        buscarProductos();
    }
});

document.getElementById('buscar-button').addEventListener('click', function() {
    buscarProductos();
});

window.onload = () => {
    cargarProductosDesdeServidor();
};
