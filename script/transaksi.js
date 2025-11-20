document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.querySelector(".product-grid");
  const categoryElements = document.querySelectorAll(".category");
  const cartItemsContainer = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  const checkoutButton = document.querySelector(".checkout-btn");

  // POPUP PEMBAYARAN (WAJIB ADA DI DALAM)
  const paymentPopup = document.getElementById("paymentPopup");
  const confirmPaymentBtn = document.getElementById("confirmPayment");
  const closePaymentBtn = document.getElementById("closePayment");
  const uangCash = document.getElementById("uangCash");
  const uangKembalian = document.getElementById("uangKembalian");

  let allProducts = [];
  let ukuranStok = {};
  let selectedCategory = "";
  let cart = {};

  // ========================
  // FETCH STOK UKURAN
  // ========================
  async function fetchStokUkuran() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch("http://localhost:9000/api/stok", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal fetch stok");

      const data = await res.json();

      ukuranStok = {};
      data.forEach((u) => {
        ukuranStok[u.ukuran_id] = u.stok;
      });

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // ========================
  // Hitung stok produk
  // ========================
  function hitungStokProduk(p) {
    const stokUk = ukuranStok[p.ukuran_id] || 0;
    return Math.floor(stokUk / p.jumlah_pcs);
  }

  // ========================
  // FETCH PRODUK
  // ========================
  async function fetchProducts() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      await fetchStokUkuran();

      const res = await fetch("http://localhost:9000/api/admin/produk", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal fetch produk");

      const data = await res.json();
      allProducts = data;

      const firstCategory =
        categoryElements[0]?.querySelector("p")?.innerText.trim() || "";

      selectedCategory = firstCategory;
      renderProductsByCategory(firstCategory);

    } catch (err) {
      console.error("Gagal fetch produk:", err);
      productGrid.innerHTML = `<p style="color:gray;text-align:center;">${err.message}</p>`;
    }
  }

  // ========================
  // RENDER PRODUK PER KATEGORI
  // ========================
  function renderProductsByCategory(category) {
    productGrid.innerHTML = "";
    const cat = category.toLowerCase();

    const filteredProducts = allProducts.filter(
      (p) => p.nama_kategori?.toLowerCase() === cat
    );

    if (filteredProducts.length === 0) {
      productGrid.innerHTML = `<p style="color:gray;text-align:center;">Tidak ada produk.</p>`;
      return;
    }

    filteredProducts.forEach((p) => {
      const stokProduk = hitungStokProduk(p);

      const card = document.createElement("div");
      card.className = "card";
      card.dataset.id = p.produk_id;
      card.dataset.name = p.nama_produk;
      card.dataset.price = p.harga_satuan;
      card.dataset.stock = stokProduk;

      card.innerHTML = `
        <h3>${p.nama_produk}</h3>
        <p class="price">Rp${Number(p.harga_satuan).toLocaleString("id-ID")}</p>
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

  // ========================
  // KLIK KATEGORI
  // ========================
  categoryElements.forEach((cat) => {
    cat.addEventListener("click", () => {
      categoryElements.forEach((c) => c.classList.remove("active"));
      cat.classList.add("active");

      const categoryName = cat.querySelector("p").innerText.trim();
      selectedCategory = categoryName;
      renderProductsByCategory(categoryName);
    });
  });

  // ========================
  // LISTENER + / -
  // ========================
  function attachCardListeners() {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      const minus = card.querySelector(".btn-icon:first-child");
      const plus = card.querySelector(".btn-icon:last-child");
      const quantity = card.querySelector(".quantity-value");

      const id = card.dataset.id;
      const name = card.dataset.name;
      const price = parseInt(card.dataset.price);
      const stock = parseInt(card.dataset.stock);

      plus.addEventListener("click", () => {
        let val = parseInt(quantity.innerText);
        if (val < stock) {
          quantity.innerText = val + 1;
          addToCart(id, name, price);
        } else {
          alert("Stok tidak mencukupi!");
        }
      });

      minus.addEventListener("click", () => {
        let val = parseInt(quantity.innerText);
        if (val > 0) {
          quantity.innerText = val - 1;
          removeFromCart(id);
        }
      });
    });
  }

  // ========================
  // KERANJANG
  // ========================
  function addToCart(id, name, price) {
    if (!cart[id]) {
      cart[id] = { produk_id: id, nama: name, harga: price, jumlah: 1 };
    } else {
      cart[id].jumlah++;
    }
    updateCartDisplay();
  }

  function removeFromCart(id) {
    if (cart[id]) {
      cart[id].jumlah--;
      if (cart[id].jumlah <= 0) delete cart[id];
      updateCartDisplay();
    }
  }

  function updateCartDisplay() {
    cartItemsContainer.innerHTML = "";
    let subtotal = 0;

    if (Object.keys(cart).length === 0) {
      cartItemsContainer.innerHTML = `<p style="color:gray;text-align:center;">Keranjang masih kosong.</p>`;
    }

    Object.values(cart).forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <p>${item.nama} (${item.jumlah}x)
        - Rp${(item.harga * item.jumlah).toLocaleString("id-ID")}</p>
      `;

      subtotal += item.harga * item.jumlah;
      cartItemsContainer.appendChild(div);
    });

    subtotalElement.innerText = `Rp${subtotal.toLocaleString("id-ID")}`;
    totalElement.innerText = `Rp${subtotal.toLocaleString("id-ID")}`;
  }

  // ========================
  // CHECKOUT → TAMPILKAN POPUP
  // ========================
  checkoutButton.addEventListener("click", () => {
    if (Object.keys(cart).length === 0) {
      return alert("Pesanan kosong!");
    }

    paymentPopup.style.display = "flex";

    document.getElementById("paymentDate").innerText =
      new Date().toLocaleString("id-ID");

    let productListHTML = "";
    Object.values(cart).forEach((item) => {
      productListHTML += `
        <p>${item.nama} (${item.jumlah}x) - Rp${(item.harga * item.jumlah).toLocaleString("id-ID")}</p>
      `;
    });
    document.getElementById("paymentProducts").innerHTML = productListHTML;

    const total = Object.values(cart).reduce(
      (acc, item) => acc + item.harga * item.jumlah,
      0
    );

    document.getElementById("paymentTotal").innerText =
      "Rp" + total.toLocaleString("id-ID");
  });

  closePaymentBtn.addEventListener("click", () => {
    paymentPopup.style.display = "none";
  });

  document.getElementById("closeBill").addEventListener("click", () => {
  document.getElementById("billPopup").style.display = "none";
});


  // ========================
  // HITUNG KEMBALIAN
  // ========================
  uangCash.addEventListener("input", () => {
    const totalText = document
      .getElementById("paymentTotal")
      .innerText.replace(/[^\d]/g, "");
    const total = parseInt(totalText);

    const cash = parseInt(uangCash.value) || 0;
    let change = cash - total;

    if (change < 0) change = 0;

    uangKembalian.value = "Rp" + change.toLocaleString("id-ID");
  });

  // ========================
  // KONFIRMASI PEMBAYARAN
  // ========================
  confirmPaymentBtn.addEventListener("click", async () => {
  if (Object.keys(cart).length === 0) return alert("Pesanan kosong!");

  const token = localStorage.getItem("token");
  if (!token) return alert("Token tidak ditemukan, silakan login");

  const cash = parseInt(uangCash.value || 0);
  const total = parseInt(
    document.getElementById("paymentTotal").innerText.replace(/[^\d]/g, "")
  );

  if (cash < total) return alert("Uang tidak cukup!");

  const products = Object.values(cart).map((item) => ({
    produk_id: parseInt(item.produk_id),
    jumlah: item.jumlah,
  }));

  try {
    const res = await fetch("http://localhost:9000/api/transaksi", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products,
        metode_pembayaran: "tunai",
        cash: cash,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return alert("Gagal: " + data.message);
    }

    // ============================
    //  TAMPILKAN POPUP BILL
    // ============================
    const billPopup = document.getElementById("billPopup");
    billPopup.style.display = "flex";

    // tanggal
    document.getElementById("billDate").innerText =
      new Date().toLocaleString("id-ID");

    // jenis pesanan
    const tipePesanan = document.getElementById("orderType").value;
    document.getElementById("billOrderType").innerText = tipePesanan;

    // produk
    let itemsHTML = "";
    Object.values(cart).forEach((item) => {
      itemsHTML += `
        <p>${item.nama} (${item.jumlah}x) - Rp${(item.harga * item.jumlah).toLocaleString("id-ID")}</p>
      `;
    });
    document.getElementById("billProducts").innerHTML = itemsHTML;

    // total/cash/change
    document.getElementById("billTotal").innerText =
      "Rp" + total.toLocaleString("id-ID");
    document.getElementById("billCash").innerText =
      "Rp" + cash.toLocaleString("id-ID");
    document.getElementById("billChange").innerText =
      "Rp" + (cash - total).toLocaleString("id-ID");

    // tutup popup pembayaran
    paymentPopup.style.display = "none";
    uangCash.value = "";
    uangKembalian.value = "";

    // reset keranjang
    cart = {};
    updateCartDisplay();

    document.querySelectorAll(".quantity-value").forEach((q) => {
      q.innerText = "0";
    });

    fetchProducts();

  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan koneksi");
  }
});


  // ========================
  // INIT
  // ========================
  fetchProducts();
});
