// akun.js

document.addEventListener("DOMContentLoaded", () => {
    // Ambil data user dari localStorage
    const nama = localStorage.getItem("nama") || "";
    const username = localStorage.getItem("username") || "";
    const role = localStorage.getItem("role") || "karyawan";

    // Tampilkan di input
    document.getElementById("name").value = nama;
    document.getElementById("username").value = username;
    document.getElementById("role").value = role;

    // Set password default jadi disabled
    document.getElementById("password").value = "***";
    document.getElementById("password").disabled = true;
});

// Fungsi enable password change
function enablePasswordChange() {
    const passwordInput = document.getElementById("password");
    passwordInput.disabled = false;
    passwordInput.value = "";
}

// Fungsi simpan perubahan
function saveChanges() {
    const nama = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    // Validasi sederhana
    if (!nama || !username) {
        alert("Nama dan username tidak boleh kosong!");
        return;
    }

    // Simpan ke localStorage
    localStorage.setItem("nama", nama);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);

    if (password) {
        // Kalau password diubah, simpan juga
        localStorage.setItem("password", password);
        alert("Perubahan berhasil disimpan, termasuk password!");
        document.getElementById("password").value = "***";
        document.getElementById("password").disabled = true;
    } else {
        alert("Perubahan berhasil disimpan!");
    }
}