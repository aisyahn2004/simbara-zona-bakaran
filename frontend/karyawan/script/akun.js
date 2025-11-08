window.onload = function () {
    if (localStorage.getItem("name")) {
        document.getElementById("name").value = localStorage.getItem("name");
    }
    if (localStorage.getItem("email")) {
        document.getElementById("email").value = localStorage.getItem("email");
    }
    if (localStorage.getItem("role")) {
        document.getElementById("role").value = localStorage.getItem("role");
    }
};

function enablePasswordChange() {
    const passwordField = document.getElementById("password");
    passwordField.disabled = false;
    passwordField.value = "";
    passwordField.focus();
}

function saveChanges() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    // Simpan ke localStorage
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);

    alert(
        `Perubahan berhasil disimpan!\n\nNama: ${name}\nEmail: ${email}\nRole: ${role}\n${password ? "Password telah diperbarui." : "Password tidak diubah."}`
    );

    if (password) {
        document.getElementById("password").value = "";
    }
    document.getElementById("password").disabled = true;
}