document
  .getElementById("convertButton")
  .addEventListener("click", async function () {
    const API_KEY = "f8b9ca5879111e54f4a3368c";
    const amount = document.getElementById("amount").value;
    const currencyFrom = document.getElementById("currencyFrom").value;
    const currencyTo = document.getElementById("currencyTo").value;
    const resultDiv = document.getElementById("result");

    if (!amount || isNaN(amount)) {
      resultDiv.textContent = "Por favor, ingresa un valor válido";
      return;
    }

    const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${currencyFrom}`;

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.result === "success") {
        const rate = data.conversion_rates[currencyTo];
        const convertedAmount = (amount * rate).toFixed(2);
        resultDiv.textContent = `${amount} ${currencyFrom} = ${convertedAmount} ${currencyTo}`;
      } else {
        resultDiv.textContent = "Error al obtener las tasas de cambio.";
      }
    } catch (error) {
      resultDiv.textContent = "Error al conectar con la API.";
    }
  });
