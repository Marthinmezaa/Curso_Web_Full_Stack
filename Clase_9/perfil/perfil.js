document.querySelectorAll(".social-icons a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Redirigiendo a " + link.children[0].alt);
  });
});
