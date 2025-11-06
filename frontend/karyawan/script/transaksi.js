const cart = {};
const cartItems = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');

function formatRupiah(num) {
    return 'Rp' + num.toLocaleString('id-ID');
}

function updateCartDisplay() {
    cartItems.innerHTML = '';
    let subtotal = 0;

    Object.values(cart).forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `<span>${item.qty}×</span> ${item.name} <span>${formatRupiah(item.price * item.qty)}</span>`;
        cartItems.appendChild(div);
        subtotal += item.price * item.qty;
    });

    subtotalEl.textContent = formatRupiah(subtotal);
    totalEl.textContent = formatRupiah(subtotal);
}

const productsByCategory = {
    "Dimsum Mentai": [
        { name: "Dimsum Mentai<br>Jumbo 4PCS", price: 16000 },
        { name: "Dimsum Mentai<br>Jumbo 5PCS", price: 20000 },
        { name: "Dimsum Mentai<br>Jumbo 6PCS", price: 24000 },
        { name: "Dimsum Mentai<br>Jumbo 16PCS", price: 64000 },
        { name: "Dimsum Mentai<br>Mini 6PCS", price: 18000 },
        { name: "Dimsum Mentai<br>Mini 8PCS", price: 24000 },
        { name: "Dimsum Mentai<br>Mini 10PCS", price: 28000 }
    ],
    "Dimsum Tartar": [
        { name: "Dimsum Tartar<br>Jumbo 4PCS", price: 16000 },
        { name: "Dimsum Tartar<br>Jumbo 5PCS", price: 20000 },
        { name: "Dimsum Tartar<br>Jumbo 6PCS", price: 24000 },
        { name: "Dimsum Tartar<br>Jumbo 16PCS", price: 64000 },
        { name: "Dimsum Tartar<br>Mini 6PCS", price: 18000 },
        { name: "Dimsum Tartar<br>Mini 8PCS", price: 24000 },
        { name: "Dimsum Tartar<br>Mini 10PCS", price: 28000 }
    ],
    "Dimsum Buldak": [
        { name: "Dimsum Buldak<br>Jumbo 4PCS", price: 16000 },
        { name: "Dimsum Buldak<br>Jumbo 5PCS", price: 20000 },
        { name: "Dimsum Buldak<br>Jumbo 6PCS", price: 24000 },
        { name: "Dimsum Buldak<br>Jumbo 16PCS", price: 64000 },
        { name: "Dimsum Buldak<br>Mini 6PCS", price: 18000 },
        { name: "Dimsum Buldak<br>Mini 8PCS", price: 24000 },
        { name: "Dimsum Buldak<br>Mini 10PCS", price: 28000 }
    ],
    "Dimsum Mix": [
        { name: "Dimsum Mix<br>Jumbo 4PCS", price: 16000 },
        { name: "Dimsum Mix<br>Jumbo 5PCS", price: 20000 },
        { name: "Dimsum Mix<br>Jumbo 6PCS", price: 24000 },
        { name: "Dimsum Mix<br>Jumbo 16PCS", price: 64000 },
        { name: "Dimsum Mix<br>Mini 6PCS", price: 18000 },
        { name: "Dimsum Mix<br>Mini 8PCS", price: 24000 },
        { name: "Dimsum Mix<br>Mini 10PCS", price: 28000 }
    ],
    "Dimsum Kukus": [
        { name: "Dimsum Kukus<br>Jumbo 3PCS", price: 9000 },
        { name: "Dimsum Kukus<br>Jumbo 4PCS", price: 12000 },
        { name: "Dimsum Kukus<br>Jumbo 5PCS", price: 15000 },
        { name: "Dimsum Kukus<br>Mini 5PCS", price: 10000 },
        { name: "Dimsum Kukus<br>Mini 10PCS", price: 20000 }
    ],
    "Dimsum Bakar": [
        { name: "Dimsum Bakar<br>3PCS", price: 10000 },
        { name: "Dimsum Bakar<br>6PCS", price: 20000 },
        { name: "Dakkochi Bakar<br>1PCS", price: 5000 }
    ]
};
const productGrid = document.querySelector('.product-grid');
const categoryElements = document.querySelectorAll('.category');

function renderProducts(categoryName) {
    const products = productsByCategory[categoryName];
    productGrid.innerHTML = ''; // kosongkan isi sebelumnya

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.name = p.name;
        card.dataset.price = p.price;
        card.innerHTML = `
            <h3>${p.name}</h3>
            <p class="price">Rp${p.price.toLocaleString('id-ID')}</p>
            <div class="quantity-btns">
                <button class="btn-icon">−</button>
                <span class="quantity-value">0</span>
                <button class="btn-icon">+</button>
            </div>
        `;
        productGrid.appendChild(card);
    });

    attachCardListeners();
}

categoryElements.forEach(cat => {
    cat.addEventListener('click', () => {
        categoryElements.forEach(c => c.classList.remove('active'));
        cat.classList.add('active');
        const categoryName = cat.querySelector('p').innerText.trim().replace(/\n/g, ' ');
        renderProducts(categoryName);
    });
});

// render pertama (Dimsum Mentai)
renderProducts("Dimsum Mentai");
function attachCardListeners() {
    document.querySelectorAll('.card').forEach(card => {
        const name = card.dataset.name;
        const price = parseInt(card.dataset.price);
        const minusBtn = card.querySelector('.btn-icon:first-child');
        const plusBtn = card.querySelector('.btn-icon:last-child');
        const valueEl = card.querySelector('.quantity-value');
        let qty = cart[name]?.qty || 0;
        valueEl.textContent = qty;

        plusBtn.addEventListener('click', () => {
            qty++;
            valueEl.textContent = qty;
            cart[name] = { name, price, qty };
            updateCartDisplay();
        });

        minusBtn.addEventListener('click', () => {
            if (qty > 0) qty--;
            valueEl.textContent = qty;
            if (qty === 0) {
                delete cart[name];
            } else {
                cart[name].qty = qty;
            }
            updateCartDisplay();
        });
    });
}