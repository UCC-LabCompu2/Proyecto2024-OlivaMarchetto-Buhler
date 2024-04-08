
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let positionY = 0;
const acceleration = 0.1;
let initialVelocity = 0;

document.querySelector('.calc-result').addEventListener('click', function() {
    let distance = parseFloat(document.getElementById('distance').value);
    let velocity = parseFloat(document.getElementById('velocity').value);
    let time = parseFloat(document.getElementById('time').value);

    // Validar que se hayan completado exactamente 2 de los 3 campos
    const fields = [distance, velocity, time];
    const completedFields = fields.filter(field => !isNaN(field));
  
    if (completedFields.length !== 2) {
        Toastify({
            text: "Debe completar exactamente 2 de los 3 campos.",
            background: "linear-gradient(to right, #FF9800, #F44336)",
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

    let initialVelocity = distance / time;
  
    let positionY = 0;
  
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

let unitInit = 'km';

function convertUnits(value, currentUnit, targetUnit, conversionType) {

    // Definir factores de conversión para distancia, tiempo y velocidad
    const conversionFactors = {
        'm': {
            'distance':{ 'km': 0.001, 'm': 1 },
            'time':{ 'km': 1/3600, 'm': 1/60 }, 
            'velocity':{ 'km': 3.6, 'm': 1}
        },
        'km': {
            'distance':{ 'm': 1000, 'km': 1 }, 
            'time':{ 'm': 3600, 'km': 1 }, 
            'velocity':{ 'm': 1/3.6, 'km': 1}
        }
    };

    // Realizar la conversión
    const conversionFactor = conversionFactors[currentUnit][conversionType][targetUnit];
    const convertedValue = value * conversionFactor;

    return convertedValue;
}


document.getElementById('unit-converter').addEventListener('change', function() {
    const distanceValue = parseFloat(document.getElementById('distance').value);
    const timeValue = parseFloat(document.getElementById('time').value);
    const velocityValue = parseFloat(document.getElementById('velocity').value);

    const convertUnit = document.getElementById('unit-converter').value;

    if (isNaN(distanceValue) || isNaN(timeValue) || isNaN(velocityValue) || distanceValue === 0 || timeValue === 0 || velocityValue === 0) {    
        unitInit = convertUnit;
        Toastify({
            text: "Por favor, ingrese valores válidos para la conversión.",
            background: "linear-gradient(to right, #FF9800, #F44336)",
            duration: 3000
        }).showToast();
        return;
    }

    const convertedDistance = convertUnits(distanceValue, unitInit, convertUnit, 'distance');
    const convertedTime = convertUnits(timeValue, unitInit, convertUnit, 'time');
    const convertedVelocity = convertUnits(velocityValue, unitInit, convertUnit, 'velocity');

    unitInit = convertUnit;

    document.getElementById('distance').value = convertedDistance.toFixed(2);
    document.getElementById('time').value = convertedTime.toFixed(2);
    document.getElementById('velocity').value = convertedVelocity.toFixed(2);
});