document.addEventListener("DOMContentLoaded", () => {
    const savedUsername = localStorage.getItem("savedUsername");
    const savedPassword = localStorage.getItem("savedPassword");

    if (savedUsername) document.getElementById("username").value = savedUsername;
    if (savedPassword) document.getElementById("password").value = savedPassword;
    if (savedUsername || savedPassword) document.getElementById("rememberMe").checked = true;
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const remember = document.getElementById("rememberMe").checked;

    if (remember) {
        localStorage.setItem("savedUsername", username);
        localStorage.setItem("savedPassword", password);
    } else {
        localStorage.removeItem("savedUsername");
        localStorage.removeItem("savedPassword");
    }

    try {
        const res = await fetch("http://localhost:9000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (!res.ok) return alert(data.message || "Login gagal");

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("nama", data.nama);
        localStorage.setItem("role", data.role);

        alert(data.message || "Login berhasil");
        window.location.href = data.redirect;

    } catch (err) {
        console.error(err);
        alert("Gagal menghubungi server!");
    }
});