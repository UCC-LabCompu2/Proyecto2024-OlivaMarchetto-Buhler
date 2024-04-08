
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let positionY = 0;
const acceleration = 0.1;
const initialVelocity = 0;

document.querySelector('.calc-result').addEventListener('click', function() {
    var distance = parseFloat(document.getElementById('distance').value);
    var velocity = parseFloat(document.getElementById('velocity').value);
    var time = parseFloat(document.getElementById('time').value);

    // Validar que se hayan completado exactamente 2 de los 3 campos
    const fields = [distance, velocity, time];
    const completedFields = fields.filter(field => !isNaN(field));
  
    if (completedFields.length !== 2) {
        Toastify({
            text: "Debe completar exactamente 2 de los 3 campos.",
            backgroundColor: "linear-gradient(to right, #FF9800, #F44336)",
            duration: 3000
        }).showToast();
        return;
    }
  
    let missingField;
    if (isNaN(distance)) {
        missingField = velocity * time;
        document.getElementById('distance').value = missingField;
        distance = missingField;
    } else if (isNaN(velocity)) {
        missingField = distance / time;
        document.getElementById('velocity').value = missingField;
        velocity = missingField;
    } else {
        missingField = distance / velocity;
        document.getElementById('time').value = missingField;
        time = missingField;
    }

    const initialVelocity = distance / time;
  
    let positionY = 0;
    const acceleration = 0.1;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    function animate() {

      const velocity = initialVelocity + acceleration;
      positionY += velocity;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      ctx.arc(canvas.width / 2, positionY, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'blue';
      ctx.fill();
      
      requestAnimationFrame(animate);
    }
  
    animate();
});

// Agrega un event listener para el cambio en el select de velocidad
document.getElementById('unit-converter').addEventListener('change', function() {
    // Obtén la velocidad actual
    let velocity = parseFloat(document.getElementById('velocity').value);

    // Obtén la unidad seleccionada en el select de velocidad
    const velocityUnit = document.getElementById('unit-converter').value;

    // Realizar la conversión si es necesario
    if (velocityUnit === 'km/h') {
        // Convertir velocidad a kilómetros por hora (1 m/s = 3.6 km/h)
        velocity *= 3.6;
    }

    // Actualizar el valor del campo de velocidad
    document.getElementById('velocity').value = velocity.toFixed(2);
});