document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.getElementById("searchIcon");
  const searchBar = document.getElementById("searchBar");

  if (searchIcon && searchBar) {
    searchIcon.addEventListener("click", () => {
      searchBar.style.display = searchBar.style.display === "flex" ? "none" : "flex";
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".icon-container") && !event.target.closest("#searchBar")) {
        searchBar.style.display = "none";
      }
    });
  }
});
