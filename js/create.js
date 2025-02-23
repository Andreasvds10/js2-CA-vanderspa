document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      // Simple validation
      if (!username || !email || !password) {
        alert("All fields are required.");
        return;
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
      }

      const payload = {
        name: username,  // No need for replace(), unless spaces are an issue
        email: email,
        password: password,
      };

      await registerUser(payload);
    });
  }
});

export async function registerUser(payload) {
  console.log("Payload being sent:", payload);

  try {
    const response = await fetch('https://v2.api.noroff.dev/auth/register', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": "67c4b6d8-be31-4c79-9912-2035bbadb1da",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Server Response:", data);

    if (response.ok) {
      alert("Registration successful! You can now log in.");
      window.location.href = "/html/login.html";
    } else {
      const errorMessage = data.errors?.[0]?.message || "Registration failed.";
      alert(errorMessage);
      console.error("Registration Error:", errorMessage);
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("An unexpected error occurred. Please try again.");
  }
}
