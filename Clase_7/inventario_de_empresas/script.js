let inventario = [];

function agregarEmpresa() {
  let empresa = document.getElementById("empresa").value.trim();
  let producto = document.getElementById("producto").value.trim();

  // validar longitud
  if (empresa.length < 2) {
    alert("Nombre de empresa muy corto");
    return;
  }

  // convertir a mayúsculas
  empresa = empresa.toUpperCase();

  // limpiar palabra prohibida
  producto = producto.replace("malo", "****");

  // verificar si contiene algo
  if (!producto.includes("a")) {
    producto = producto.concat(" (simple)");
  }

  inventario.push({
    empresa: empresa,
    producto: producto,
  });

  mostrarInventario();
}

function mostrarInventario() {
  let lista = document.getElementById("lista");
  lista.innerHTML = "";

  inventario.forEach((item, index) => {
    let texto = `
            Empresa: ${item.empresa} <br>
            Producto: ${item.producto} <br>
            Letras empresa: ${item.empresa.length} <br>
            Inicio: ${item.empresa.charAt(0)}
        `;

    lista.innerHTML += `<div class="item">${texto}</div>`;
  });
}
