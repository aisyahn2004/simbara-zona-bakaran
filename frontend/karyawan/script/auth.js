document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("http://localhost:9000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Login gagal");
          return;
        }

        // Simpan token di localStorage
        localStorage.setItem("token", data.token);
        alert(data.message);

        // Redirect sesuai role
        if (data.redirect) {
          window.location.href = data.redirect;
        }
      } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan server");
      }
    });