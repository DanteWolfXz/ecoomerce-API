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

function mostrarProductos(productos) {
    const contenedor = document.getElementById('pro-container');
    contenedor.innerHTML = '';

    productos.forEach(producto => {
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

function crearPaginacion(totalProductos) {
    const totalPaginas = Math.ceil(totalProductos / productosPorPagina);
    const paginacionContainer = document.getElementById('pagination');
    paginacionContainer.innerHTML = '';

    for (let i = 1; i <= totalPaginas; i++) {
        const boton = document.createElement('button');
        boton.innerText = i;
        boton.addEventListener('click', () => cambiarPagina(i, boton));
        if (i === paginaActual) {
            boton.classList.add('selected');
        }
        paginacionContainer.appendChild(boton);
    }
}

function cambiarPagina(pagina, boton) {
    paginaActual = pagina;
    mostrarProductos(productosTotales, pagina);

    const botones = document.querySelectorAll('#pagination button');
    botones.forEach(b => b.classList.remove('selected'));

    boton.classList.add('selected');
}


function buscarProductos() {
    const criterioBusqueda = document.getElementById('search-input').value.toLowerCase();
    const categoriaSeleccionada = document.getElementById('category-filter').value.toLowerCase();

    fetch(`${endpointURL}/buscar?query=${criterioBusqueda}&category=${categoriaSeleccionada}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error al buscar productos');
            }
        })
        .then(productos => {
            mostrarProductos(productos);
        })
        .catch(error => {
            console.error('Error:', error);
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

document.getElementById('category-filter').addEventListener('change', function() {
    buscarProductos();
});

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

document.getElementById('category-filter').addEventListener('change', function() {
    buscarProductos();
});

window.onload = () => {
    cargarProductosDesdeServidor();
};


