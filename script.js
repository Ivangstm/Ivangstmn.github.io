// --- 1. Definición del Menú de Kiki's (DATOS) ---
// Aquí puedes agregar, modificar o eliminar productos fácilmente
const menuItems = [
    {
        id: 1,
        name: "Salchipapa Kiki's Especial",
        description: "Papa criolla, salchicha americana, tocineta, queso gratinado, huevo de codorniz, pico de gallo y salsas de la casa.",
        price: 18000, // Precio en COP
        category: "salchipapas",
        image: "./img/salchipapaEspecial.jpg" // Asegúrate de tener esta imagen
    },
    {
        id: 2,
        name: "Salchipapa Ranchera",
        description: "Papa criolla, salchicha ranchera, maíz tierno, champiñones, queso cheddar y salsas.",
        price: 16000,
        category: "salchipapas",
        image: "./img/salchipapaRanchera.jpg"
    },
    {
        id: 3,
        name: "Hamburguesa Clásica",
        description: "Carne de res 150gr, lechuga, tomate, cebolla, queso, salsa de tomate y mayonesa.",
        price: 14000,
        category: "hamburguesas",
        image: "./img/hamburgesa.jpeg"
    },
    {
        id: 4,
        name: "Perro Caliente Súper",
        description: "Salchicha americana, cebolla caramelizada, queso mozzarella, papita triturada y salsas.",
        price: 12000,
        category: "perros", // Nueva categoría de perros calientes
        image: "./img/perrocaliente.jpeg"
    },
    {
        id: 5,
        name: "Gaseosa Coca-Cola 350ml",
        description: "Refrescante Coca-Cola en lata.",
        price: 4000,
        category: "bebidas",
        image: "./img/cocacola.jpeg"
    },
    {
        id: 6,
        name: "Jugo Natural de Maracuyá",
        description: "Jugo natural y refrescante de maracuyá.",
        price: 6000,
        category: "bebidas",
        image: "./img/jugoMaracuya.jpg"
    },
    // Añade más ítems del menú aquí
    // {
    //     id: 7,
    //     name: "Nueva Salchipapa Extrema",
    //     description: "¡Una explosión de sabor!",
    //     price: 20000,
    //     category: "salchipapas",
    //     image: "imagenes/salchipapa_extrema.jpg"
    // }
];

// Costo fijo del envío (en COP)
const deliveryCost = 5000; // Ejemplo: $5.000 COP para Tumaco

// Número de WhatsApp de Kiki's para recibir pedidos (¡Cámbialo al número real de Kiki's!)
const kikisPhoneNumber = "573235994883"; // Formato: PaísCódigo + Número (Ej: 573001234567 para Colombia)


// --- 2. Elementos del DOM (HTML) que vamos a manipular ---
const menuItemsContainer = document.getElementById('menu-items-container');
const cartList = document.getElementById('cart-list');
const cartItemCount = document.getElementById('cart-item-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const deliveryCostSpan = document.getElementById('delivery-cost');
const cartTotal = document.getElementById('cart-total');

const cartPlaceholder = document.querySelector('.cart-placeholder');
const orderForm = document.getElementById('order-form');
const confirmOrderBtn = document.getElementById('confirm-order-btn');
const orderMessage = document.getElementById('order-message');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const categoryButtons = document.querySelectorAll('.category-btn'); // Botones de filtro de categorías


// --- 3. Carrito de Compras (Array Global) ---
let cart = []; // Este array almacenará los productos que el cliente añade al carrito


// --- 4. Funciones Principales ---

// Función para formatear números a formato de moneda COP
const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
};

// Carga los ítems del menú en la página HTML
function loadMenuItems(category = 'todo') {
    menuItemsContainer.innerHTML = ''; // Limpiar el contenedor antes de cargar
    const filteredItems = category === 'todo' ? menuItems : menuItems.filter(item => item.category === category);

    if (filteredItems.length === 0) {
        menuItemsContainer.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">No hay productos en esta categoría.</p>`;
        return;
    }

    filteredItems.forEach(item => {
        const menuItemDiv = document.createElement('article');
        menuItemDiv.classList.add('menu-item');
        menuItemDiv.setAttribute('data-category', item.category); // Para filtros
        menuItemDiv.innerHTML = ` 
            <img src="${item.image}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <span class="price">${formatPrice(item.price)}</span>
            <button class="add-to-cart-btn" data-id="${item.id}">Añadir al Carrito</button>
        `;
        menuItemsContainer.appendChild(menuItemDiv);
    });

    // Añadir event listeners a los nuevos botones "Añadir al Carrito"
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Añade un ítem al carrito
function addToCart(event) {
    const itemId = parseInt(event.target.dataset.id);
    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        const itemToAdd = menuItems.find(item => item.id === itemId);
        if (itemToAdd) {
            cart.push({ ...itemToAdd, quantity: 1 });
        }
    }
    updateCartDisplay();
}

// Actualiza la visualización del carrito en la página
function updateCartDisplay() {
    cartList.innerHTML = ''; // Limpiar la lista actual del carrito
    let totalItems = 0;
    let subtotal = 0;

    if (cart.length === 0) {
        cartPlaceholder.style.display = 'block'; // Mostrar el mensaje "carrito vacío"
    } else {
        cartPlaceholder.style.display = 'none'; // Ocultar el mensaje
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="cart-item-info">
                    <span>${item.name}</span>
                    <span>${formatPrice(item.price)} x ${item.quantity}</span>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    <button class="remove-from-cart-btn" data-id="${item.id}">X</button>
                </div>
            `;
            cartList.appendChild(li);
            totalItems += item.quantity;
            subtotal += item.price * item.quantity;
        });

        // Añadir event listeners a los nuevos botones de cantidad y eliminar
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', updateCartItemQuantity);
        });
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }

    // Actualizar totales
    cartItemCount.textContent = totalItems;
    cartSubtotal.textContent = formatPrice(subtotal);
    deliveryCostSpan.textContent = formatPrice(deliveryCost);
    cartTotal.textContent = formatPrice(subtotal + deliveryCost);
}

// Actualiza la cantidad de un ítem en el carrito
function updateCartItemQuantity(event) {
    const itemId = parseInt(event.target.dataset.id);
    const action = event.target.dataset.action;
    const item = cart.find(item => item.id === itemId);

    if (item) {
        if (action === 'increase') {
            item.quantity++;
        } else if (action === 'decrease') {
            item.quantity--;
            if (item.quantity <= 0) {
                removeFromCart({ target: { dataset: { id: itemId } } }); // Si llega a 0, lo elimina
                return;
            }
        }
    }
    updateCartDisplay();
}

// Elimina un ítem del carrito
function removeFromCart(event) {
    const itemId = parseInt(event.target.dataset.id);
    cart = cart.filter(item => item.id !== itemId); // Crea un nuevo array sin el ítem
    updateCartDisplay();
}

// Genera el mensaje de WhatsApp y redirige
function generateWhatsAppOrder(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    if (cart.length === 0) {
        orderMessage.textContent = "Tu carrito está vacío. Por favor, añade productos antes de hacer tu pedido.";
        orderMessage.style.color = "#dc3545"; // Rojo para error
        return;
    }

    // Recoger datos del formulario
    const customerName = document.getElementById('customer-name').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();
    const customerAddress = document.getElementById('customer-address').value.trim();
    const customerNotes = document.getElementById('customer-notes').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // Validar campos obligatorios
    if (!customerName || !customerPhone || !customerAddress) {
        orderMessage.textContent = "Por favor, completa todos los campos obligatorios (Nombre, WhatsApp, Dirección).";
        orderMessage.style.color = "#dc3545"; // Rojo para error
        return;
    }

    let orderDetails = `*🎉 Nuevo Pedido Kiki's! 🎉*\n\n`;
    orderDetails += `*--- Detalles del Cliente ---*\n`;
    orderDetails += `*Nombre:* ${customerName}\n`;
    orderDetails += `*WhatsApp:* ${customerPhone}\n`;
    orderDetails += `*Dirección:* ${customerAddress}\n`;
    if (customerNotes) {
        orderDetails += `*Notas:* ${customerNotes}\n`;
    }
    orderDetails += `\n*--- Tu Pedido ---*\n`;

    let currentSubtotal = 0;
    cart.forEach(item => {
        orderDetails += `- ${item.name} (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}\n`;
        currentSubtotal += item.price * item.quantity;
    });



    orderDetails += `\n*Subtotal:* ${formatPrice(currentSubtotal)}\n`;
    orderDetails += `*Envío:* ${formatPrice(deliveryCost)}\n`;
    orderDetails += `*TOTAL A PAGAR:* ${formatPrice(currentSubtotal + deliveryCost)}\n\n`;
    orderDetails += `*Método de Pago:* ${paymentMethod === 'efectivo' ? 'En Efectivo al Domiciliario' : 'Método No Definido'}\n\n`; // Ajusta si añades más métodos

    orderDetails += `*¡Gracias por elegir Kiki's!*`;

       console.log("--- CONTENIDO DEL MENSAJE ANTES DE ENVIAR A WHATSAPP ---");
    console.log(orderDetails);
    console.log("---------------------------------------------------------");
    // --- FIN DE LAS LÍNEAS DE DEPURACIÓN ---


    // Codificar el mensaje para la URL de WhatsApp
    const encodedMessage = encodeURIComponent(orderDetails);
    const whatsappUrl = `https://wa.me/${kikisPhoneNumber}?text=${encodedMessage}`;

    // Abrir WhatsApp en una nueva pestaña/ventana
    window.open(whatsappUrl, '_blank');

    // Limpiar el carrito y el formulario después de enviar (opcional, pero buena práctica)
    cart = [];
    updateCartDisplay();
    orderForm.reset();
    orderMessage.textContent = "¡Tu pedido ha sido enviado! Revisa WhatsApp para confirmarlo.";
    orderMessage.style.color = "#28a745"; // Verde para éxito

    // Limpiar mensaje después de unos segundos
    setTimeout(() => {
        orderMessage.textContent = "";
    }, 5000);
}


// --- 5. Event Listeners (Controladores de Eventos) ---

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems(); // Cargar todos los ítems del menú al inicio
    updateCartDisplay(); // Inicializar la visualización del carrito

    // Evento para el botón de menú hamburguesa (navegación móvil)
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Eventos para los botones de filtro de categoría
    categoryButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Remover 'active' de todos los botones
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Añadir 'active' al botón clickeado
            event.target.classList.add('active');
            // Cargar menú filtrado
            const category = event.target.dataset.category;
            loadMenuItems(category);
        });
    });

    // Evento para el formulario de pedido
    orderForm.addEventListener('submit', generateWhatsAppOrder);
});