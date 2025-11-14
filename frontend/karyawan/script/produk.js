const grid = document.getElementById('productGrid');

const modal = document.getElementById('productModal');
const addBtn = document.getElementById('addProductBtn');
const saveBtn = document.getElementById('saveProduct');
const preview = document.getElementById('preview');
const imageInput = document.getElementById('imageInput');
const modalTitle = document.getElementById('modalTitle');

let editingCard = null;
let imageData = "";

// =====================
// Preview gambar
// =====================
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imageData = event.target.result;
            preview.src = imageData;
        };
        reader.readAsDataURL(file);
    }
});

// =====================
// Tambah produk
// =====================
addBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    modalTitle.textContent = 'Tambah Produk Baru';
    saveBtn.textContent = 'Simpan Produk';
    editingCard = null;
    preview.src = "";
    imageInput.value = "";
    document.getElementById('productName').value = "";
    document.getElementById('productDesc').value = "";
    document.getElementById('productPrice').value = "";
});

// =====================
// Simpan produk baru/edit
// =====================
saveBtn.addEventListener('click', () => {
    const name = document.getElementById('productName').value.trim();
    const desc = document.getElementById('productDesc').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const img = imageData || 'assets/default.jpg';

    if (name && desc && price) {
        if (editingCard) {
            editingCard.querySelector('img').src = img;
            editingCard.querySelector('h3').textContent = name;
            editingCard.querySelector('p').textContent = desc;
            editingCard.querySelector('.price').textContent = price;
        } else {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${img}" alt="${name}">
                <div class="content">
                    <h3>${name}</h3>
                    <p>${desc}</p>
                    <p class="price">${price}</p>
                    <div class="actions">
                        <button class="edit">Edit</button>
                        <button class="delete">Hapus</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        }
        saveProducts();
        modal.style.display = 'none';
    } else {
        alert('Mohon isi semua kolom!');
    }
});

// =====================
// Klik di luar modal → tutup
// =====================
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// =====================
// Edit / Hapus produk
// =====================
grid.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        e.target.closest('.card').remove();
        saveProducts();
    }

    if (e.target.classList.contains('edit')) {
        editingCard = e.target.closest('.card');
        const name = editingCard.querySelector('h3').textContent;
        const desc = editingCard.querySelector('.content p:not(.price)').textContent;
        const price = editingCard.querySelector('.price').textContent;
        const img = editingCard.querySelector('img').src;

        modal.style.display = 'flex';
        modalTitle.textContent = 'Edit Produk';
        saveBtn.textContent = 'Simpan Perubahan';
        document.getElementById('productName').value = name;
        document.getElementById('productDesc').value = desc;
        document.getElementById('productPrice').value = price;
        preview.src = img;
        imageData = img;
    }
});

// =====================
// Simpan/load local storage
// =====================
function saveProducts() {
    localStorage.setItem('products', grid.innerHTML);
}

function loadProducts() {
    const data = localStorage.getItem('products');
    if (data) grid.innerHTML = data;
}

// =====================
// FETCH PRODUK DARI BACKEND
// =====================
async function fetchProducts() {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token tidak ditemukan, silakan login");

        const res = await fetch("http://localhost:9000/api/admin/produk", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401) {
            throw new Error("Token tidak valid atau sudah kadaluarsa, silakan login ulang");
        }

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Gagal fetch produk: ${text}`);
        }

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Data produk tidak valid");

        grid.innerHTML = "";
        data.forEach(p => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${p.gambar || 'assets/default.jpg'}" alt="${p.nama_produk}">
                <div class="content">
                    <h3>${p.nama_produk}</h3>
                    <p>${p.deskripsi || '-'}</p>
                    <p class="price">${Number(p.harga_satuan).toLocaleString('id-ID')}</p>
                    <div class="actions">
                        <button class="edit">Edit</button>
                        <button class="delete">Hapus</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        grid.innerHTML = `<p style="color:gray;text-align:center;">${err.message}</p>`;
    }
}

// =====================
// INIT
// =====================
window.onload = () => {
    loadProducts();
    fetchProducts();
};
