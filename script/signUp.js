document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const role = document.getElementById("role").value;

    if (password !== confirmPassword) {
        alert("Password tidak cocok!");
        return;
    }

    try {
        const res = await fetch("http://localhost:9000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nama: nama,
                username: username,
                role: role,
                password: password
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        alert("Registrasi berhasil!");
        window.location.href = "login.html";

    } catch (err) {
        alert("Gagal menghubungi server");
        console.log(err);
    }
});