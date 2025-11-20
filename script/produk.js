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
    document.getElementById('productPrice').value = "";
});

// =====================
// Simpan produk baru / edit
// =====================
saveBtn.addEventListener('click', async () => {
    const name = document.getElementById('productName').value.trim();
    const categoryId = parseInt(document.getElementById('productCategory').value);
    if (isNaN(categoryId)) throw new Error("Kategori tidak valid");
    const price = document.getElementById('productPrice').value.trim();
    const priceNum = Number(price.replace(/\D/g, ''));
    const img = imageData || 'assets/default.jpg';
    let sizeId = parseInt(document.getElementById('productSize').value) || 1;
    let qty = parseInt(document.getElementById('productQty').value) || 1;

    if (!name || !price || !categoryId || !sizeId || !qty) {
        alert('Mohon isi semua kolom!');
        return;
    }

    const token = localStorage.getItem('token');

    try {
        if (editingCard) {
            // === EDIT PRODUK ===
            const productId = editingCard.dataset.id;
            if (!productId) throw new Error("ID produk tidak ditemukan");

            const res = await fetch(`http://localhost:9000/api/admin/produk/${productId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    nama_produk: name,
                    harga_satuan: priceNum,
                    kategori_id: categoryId,
                    ukuran_id: sizeId,
                    jumlah_pcs: qty,
                    gambar: img
                })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error('Gagal memperbarui produk: ' + text);
            }

            editingCard.querySelector('img').src = img;
            editingCard.querySelector('h3').textContent = name;
            editingCard.dataset.category = categoryId;
            editingCard.setAttribute("data-category", categoryId);
            editingCard.querySelector('.price').textContent = Number(price).toLocaleString('id-ID');

        } else {
            // === TAMBAH PRODUK BARU ===
            const res = await fetch("http://localhost:9000/api/admin/produk", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    nama_produk: name,
                    harga_satuan: priceNum,
                    kategori_id: categoryId,
                    ukuran_id: sizeId,
                    jumlah_pcs: qty,
                    gambar: img
                })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error('Gagal menambahkan produk: ' + text);
            }

            const data = await res.json();

            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = data.produk_id;
            card.dataset.category = categoryId;

            card.innerHTML = `
                <img src="${img}" alt="${name}">
                <div class="content">
                    <h3>${name}</h3>
                    <p class="price">${Number(price).toLocaleString('id-ID')}</p>
                    <div class="actions">
                        <button class="edit">Edit</button>
                        <button class="delete">Hapus</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        }

        modal.style.display = 'none';
        imageData = "";
        editingCard = null;

    } catch (err) {
        alert(err.message);
        console.error(err);
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
grid.addEventListener('click', async (e) => {
    const card = e.target.closest('.card');
    if (!card) return;

    const productId = card.dataset.id;

    // === HAPUS PRODUK ===
    if (e.target.classList.contains('delete')) {
        const productName = card.querySelector('h3').textContent;
        if (!confirm(`Hapus produk "${productName}"?`)) return;

        try {
            const token = localStorage.getItem('token');

            const res = await fetch(`http://localhost:9000/api/admin/produk/${productId}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error('Gagal menghapus produk: ' + text);
            }

            card.remove();

        } catch (err) {
            alert(err.message);
            console.error(err);
        }
    }

    // === EDIT PRODUK ===
    if (e.target.classList.contains('edit')) {
        editingCard = card;
        const name = card.querySelector('h3').textContent;
        const categoryId = card.dataset.category;
        document.getElementById('productCategory').value = categoryId;
        document.getElementById('productSize').value = editingCard.dataset.size;
        document.getElementById('productQty').value = editingCard.dataset.qty;
        const price = card.querySelector('.price').textContent.replace(/\./g,'');
        const img = card.querySelector('img').src;

        modal.style.display = 'flex';
        modalTitle.textContent = 'Edit Produk';
        saveBtn.textContent = 'Simpan Perubahan';
        document.getElementById('productName').value = name;
        document.getElementById('productCategory').value = categoryId;
        document.getElementById('productPrice').value = price;
        preview.src = img;
        imageData = img;
    }
});

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

        if (res.status === 401) throw new Error("Token tidak valid atau sudah kadaluarsa, silakan login ulang");
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
            const categoryId = p.kategori_id;
            card.dataset.id = p.produk_id;
            card.dataset.category = p.kategori_id;
            card.dataset.size = p.ukuran_id;
            card.dataset.qty = p.jumlah_pcs;
            card.innerHTML = `
                <img src="${p.gambar || 'assets/default.jpg'}" alt="${p.nama_produk}">
                <div class="content">
                    <h3>${p.nama_produk}</h3>
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
    fetchProducts();
};
