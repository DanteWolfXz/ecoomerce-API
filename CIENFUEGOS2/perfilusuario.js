// Suponiendo que obtienes los datos del usuario y sus pedidos de algún lugar, como una base de datos
const userData = {
    username: "ejemplo_usuario",
    email: "ejemplo@correo.com",
    dni: 12345678,
    phone: 123456789,
    isAdmin: false,
    orders: [
        { id: 1, product: "Producto 1", quantity: 2 },
        { id: 2, product: "Producto 2", quantity: 1 },
        { id: 3, product: "Producto 3", quantity: 3 }
    ]
};

// Actualizar el contenido del HTML con los datos del usuario
document.getElementById("username").textContent = userData.username;
document.getElementById("email").textContent = userData.email;
document.getElementById("dni").textContent = userData.dni;
document.getElementById("phone").textContent = userData.phone;
document.getElementById("isAdmin").textContent = userData.isAdmin ? "Sí" : "No";

// Mostrar los pedidos del usuario
const orderList = document.getElementById("order-list");
userData.orders.forEach(order => {
    const listItem = document.createElement("li");
    listItem.textContent = `Pedido #${order.id}: ${order.quantity} x ${order.product}`;
    orderList.appendChild(listItem);
});
