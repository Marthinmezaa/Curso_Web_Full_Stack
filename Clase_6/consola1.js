// Depuración básica con console.log
let a = 5;
let b = 6;
let c = a + b;
console.log("El valor de c es:", c); // Salida: El valor de c es: 11

// Ejemplo de uso de console.table para mostrar datos en formato de tabla
let personas = [
  { Nombre: "Juan", Apellido: "González" },
  { Nombre: "María", Apellido: "López" },
  { Nombre: "Pedro", Apellido: "Martínez" },
];
console.table(personas);

// Ejemplo de manejo de errores con try-catch
let numero = 0;
console.log("Intentando dividir por cero...");
let resultado = 55 / numero; // Esto genera una excepción
console.log("Resultado:", resultado);

// Demostración de diferentes métodos de la consola
console.info("Esto es un mensaje informativo.");
console.warn("¡Advertencia! Algo podría no estar bien.");
console.error("Esto es un mensaje de error.");
