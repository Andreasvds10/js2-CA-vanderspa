document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.getElementById("menuIcon");
  const menuDropdown = document.getElementById("menuDropdown");
  const token = localStorage.getItem("accessToken");

  if (menuIcon && menuDropdown) {
    // Toggle dropdown visibility
    menuIcon.addEventListener("click", () => {
      menuDropdown.style.display = menuDropdown.style.display === "block" ? "none" : "block";
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!menuIcon.contains(event.target) && !menuDropdown.contains(event.target)) {
        menuDropdown.style.display = "none";
      }
    });
  }

  // If user is logged in, add Logout button inside the dropdown
  if (token && menuDropdown) {
    let logoutListItem = document.getElementById("logout-menu-item");

    if (!logoutListItem) { // Prevent duplicate logout buttons
      logoutListItem = document.createElement("li");
      logoutListItem.id = "logout-menu-item";

      const logoutButton = document.createElement("a");
      logoutButton.textContent = "Logout";
      logoutButton.href = "#";
      logoutButton.style.color = "#00d1ff";
      logoutButton.style.cursor = "pointer";

      logoutButton.addEventListener("click", () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
        alert("Logged out successfully!");
        window.location.href = "/html/login.html";  // Redirect to login
      });

      logoutListItem.appendChild(logoutButton);
      menuDropdown.appendChild(logoutListItem); // Append Logout button inside menu
    }
  }
});
