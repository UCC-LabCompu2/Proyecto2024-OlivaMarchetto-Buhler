// Agrega un event listener para el botón de cálculo
document.querySelector('.calc-result').addEventListener('click', function() {
    // Obtén los valores de los campos de entrada
    const distance = parseFloat(document.querySelector('#distance').value);
    const velocity = parseFloat(document.querySelector('#velocity').value);
    const time = parseFloat(document.querySelector('#time').value);

    // Realiza el cálculo (aquí puedes agregar tu lógica)
    // Por ejemplo, calcular la velocidad promedio
    const averageSpeed = (distance / time).toFixed(2); // Redondea a 2 decimales

    // Muestra el resultado en la consola (aquí puedes mostrarlo en otro lugar de tu página)
    console.log('Velocidad promedio:', averageSpeed);
});
