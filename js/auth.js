import { API_BASE } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!email || !password) {
                alert("Please fill in both fields.");
                return;
            }

            await loginUser({ email, password });
        });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userName');
            alert("Logged out successfully!");
            window.location.href = "/html/login.html";
        });
    }
});

async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Noroff-API-Key": "67c4b6d8-be31-4c79-9912-2035bbadb1da",
            },
            body: JSON.stringify(credentials),
        });

        const responseData = await response.json();
        if (response.ok && responseData.data?.accessToken) {
            const accessToken = responseData.data.accessToken.trim();
            const userName = responseData.data.name || responseData.data.email.split("@")[0];

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("userName", userName);

            console.log("New Access Token Stored:", accessToken);
            alert(`Logged in successfully as ${userName}`);
            window.location.href = "/html/profile.html";
        } else {
            alert(responseData.message || "Invalid login credentials.");
        }
    } catch (error) {
        alert("An error occurred during login.");
    }
}
