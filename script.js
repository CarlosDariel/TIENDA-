const productosDiv = document.getElementById('productos');
const carritoItems = document.getElementById('carrito-items');
const carritoTotal = document.getElementById('carrito-total');
const cartCount = document.getElementById('cart-count');
const cantidadInput = document.getElementById('cantidad');
const agregarCarritoBtn = document.getElementById('agregarAlCarrito');
const pagarBtn = document.getElementById('pagar');

// Variables de carrito
let carrito = [];
let productoSeleccionado;

// Cargar productos desde la API
fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(productos => {
        mostrarProductos(productos);
    });

// Mostrar productos en el HTML
function mostrarProductos(productos) {
    productosDiv.innerHTML = productos.map(producto => `
        <div class="col-md-4 mb-4">
            <div class="card">
                <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
                <div class="card-body">
                    <h5 class="card-title">${producto.title}</h5>
                    <p class="card-text">Precio: ${producto.price} €</p>
                    <button class="btn btn-primary agregar-carrito" data-id="${producto.id}">Añadir al carrito</button>
                </div>
            </div>
        </div>
    `).join('');

    // Eventos de los botones "Añadir al carrito"
    document.querySelectorAll('.agregar-carrito').forEach(button => {
        button.addEventListener('click', (event) => {
            productoSeleccionado = productos.find(p => p.id === parseInt(event.target.dataset.id));
            $('#cantidadModal').modal('show');
        });
    });
}

// Añadir producto al carrito
agregarCarritoBtn.addEventListener('click', () => {
    const cantidad = parseInt(cantidadInput.value);
    const item = { ...productoSeleccionado, cantidad };
    carrito.push(item);
    actualizarCarrito();
    $('#cantidadModal').modal('hide');
});

// Actualizar carrito
function actualizarCarrito() {
    carritoItems.innerHTML = carrito.map(item => `
        <li class="list-group-item">
            ${item.title} x${item.cantidad} - ${(item.price * item.cantidad).toFixed(2)} €
        </li>
    `).join('');
    carritoTotal.textContent = carrito.reduce((total, item) => total + item.price * item.cantidad, 0).toFixed(2);
    cartCount.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
}

// Generar factura PDF
pagarBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Factura de Compra', 20, 20);
    carrito.forEach((item, index) => {
        doc.text(`${item.title} - ${item.cantidad} x ${item.price} €`, 20, 30 + (index * 10));
    });
    doc.text(`Total: ${carritoTotal.textContent} €`, 20, 50 + (carrito.length * 10));
    doc.save('factura.pdf');
});
