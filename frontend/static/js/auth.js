// ===============================
// Flight Routes System
// Authentication
// ===============================

// If already logged in, go to dashboard
if (localStorage.getItem("access")) {
    window.location.href = "/dashboard/";
}

document
    .getElementById("loginForm")
    .addEventListener("submit", loginUser);

async function loginUser(e) {

    e.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const loginBtn =
        document.getElementById("loginBtn");

    const errorBox =
        document.getElementById("errorBox");

    loginBtn.disabled = true;
    loginBtn.innerHTML = "Logging in...";

    errorBox.classList.add("d-none");

    try {

        const response = await fetch("/api/token/", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })

        });

        const data = await response.json();

        if (response.ok) {

            // Save JWT tokens
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            // Redirect to dashboard
            window.location.href = "/dashboard/";

        } else {

            errorBox.innerHTML =
                data.detail || "Invalid username or password.";

            errorBox.classList.remove("d-none");

        }

    } catch (error) {

        errorBox.innerHTML =
            "Unable to connect to the server.";

        errorBox.classList.remove("d-none");

    }

    loginBtn.disabled = false;
    loginBtn.innerHTML = "Login";

}