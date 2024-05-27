// Selecciona el canvas y su propiedad context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Inicializa la posición en Y del objeto en el canvas
let positionY = 0;

// Define la aceleración CONSTANTE
const acceleration = 0.1;

// Listenre en el botón de calcular con la funcion para calcular el input restante
document.querySelector('.calc-result').addEventListener('click', function() {
    let distance = parseFloat(document.getElementById('distance').value);
    let velocity = parseFloat(document.getElementById('velocity').value);
    let time = parseFloat(document.getElementById('time').value);

    // Validar que se hayan completado exactamente 2 de los 3 campos
    const fields = [distance, velocity, time];
    const completedFields = fields.filter(field => !isNaN(field));
    const greaterThanZeroFields = fields.filter(field => field > 0);
  
    if (completedFields.length !== 2) {
        Toastify({
            text: "Debe completar exactamente 2 de los 3 campos.",
            background: "linear-gradient(to right, #FF9800, #F44336)",
            duration: 3000
        }).showToast();
        return;
    }

    if (greaterThanZeroFields.length !== 2) {
        Toastify({
            text: "Los valores deben ser mayores a 0.",
            background: "linear-gradient(to right, #FF9800, #F44336)",
            duration: 3000
        }).showToast();
        return;
    }
  
  
    // Calcular el campo faltante
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

    // Calcular la velocidad inicial
    let initialVelocity = distance / time;
  
    let positionY = 0;
  
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Dibujar el objeto en el canvas
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

// Unidad de medida inicial
let unitInit = 'km';

// Función para convertir unidades
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

// Listener para el cambio de unidades en el select
document.getElementById('unit-converter').addEventListener('change', function() {

    // Obtener los valores actuales de los inputs
    const distanceValue = parseFloat(document.getElementById('distance').value);
    const timeValue = parseFloat(document.getElementById('time').value);
    const velocityValue = parseFloat(document.getElementById('velocity').value);

    // Obtener la unidad de medida a la que se desea convertir
    const convertUnit = document.getElementById('unit-converter').value;

    // Validar que los valores sean válidos
    if (isNaN(distanceValue) || isNaN(timeValue) || isNaN(velocityValue) || distanceValue === 0 || timeValue === 0 || velocityValue === 0) {    
        unitInit = convertUnit;
        Toastify({
            text: "Por favor, ingrese valores válidos para la conversión.",
            background: "linear-gradient(to right, #FF9800, #F44336)",
            duration: 3000
        }).showToast();
        return;
    }

    // Convertir los valores a la nueva unidad
    const convertedDistance = convertUnits(distanceValue, unitInit, convertUnit, 'distance');
    const convertedTime = convertUnits(timeValue, unitInit, convertUnit, 'time');
    const convertedVelocity = convertUnits(velocityValue, unitInit, convertUnit, 'velocity');

    // Actualizar el valor de unitInit para guardar su estado cuando el select cambie nuevamente
    unitInit = convertUnit;

    // Actualizar los valores de los inputs
    document.getElementById('distance').value = convertedDistance.toFixed(2);
    document.getElementById('time').value = convertedTime.toFixed(2);
    document.getElementById('velocity').value = convertedVelocity.toFixed(2);
});

// Función de validación
function validateInput(event) {
  const input = event.target;
  const value = input.value;
  const key = event.key;

  // Permitir solo números, el punto decimal, y eliminar caracteres con backspace
  const regex = /^[0-9]*\.?[0-9]*$/;

  // Verificar si la tecla presionada es una letra o símbolo (excepto punto decimal y backspace)
  if (!/[0-9.]/.test(key) && key !== "Backspace") {
    event.preventDefault();
    Toastify({
        text: "Solo se permiten números y un punto decimal.",
        background: "linear-gradient(to right, #FF9800, #F44336)",
        duration: 3000
    }).showToast();
    return;
  }
  
  // Si el valor contiene caracteres no numéricos o negativos
  if (!regex.test(value) || key === "-" || (key === "." && value.includes("."))) {
    event.preventDefault();
    Toastify({
        text: "Solo se permiten números positivos y un punto decimal.",
        background: "linear-gradient(to right, #FF9800, #F44336)",
        duration: 3000
    }).showToast();
  }

  // Limitar el valor a 8 caracteres
  if (value.length >= 8 && key !== "Backspace") {
    event.preventDefault();
    Toastify({
        text: "El valor no puede tener más de 8 dígitos.",
        background: "linear-gradient(to right, #FF9800, #F44336)",
        duration: 3000
    }).showToast();
  }
}
// Función de validación para texto pegado
function validatePastedInput(event) {
    const input = event.target;
    const paste = (event.clipboardData || window.clipboardData).getData('text');
    const newValue = input.value + paste;
    
    // Permitir solo números y un punto decimal
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (!regex.test(newValue)) {
      event.preventDefault();
      Toastify({
        text: "Solo se permiten números positivos y un punto decimal.",
        background: "linear-gradient(to right, #FF9800, #F44336)",
        duration: 3000
        }).showToast();
      return;
    }
  
    // Limitar el valor a 8 caracteres
    if (newValue.length > 8) {
      event.preventDefault();
      Toastify({
        text: "El valor no puede tener más de 8 dígitos.",
        background: "linear-gradient(to right, #FF9800, #F44336)",
        duration: 3000
        }).showToast();
    }
  }

// Obtener los inputs
const inputs = document.querySelectorAll('input[type="number"]');

// Agregar el evento de validación a cada input
inputs.forEach(input => {
  input.addEventListener('keypress', validateInput);
  input.addEventListener('paste', validatePastedInput);
  input.addEventListener('input', (event) => {
    // Eliminar caracteres no permitidos si el usuario pega texto no válido
    const value = event.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (!regex.test(value)) {
      event.target.value = value.replace(/[^0-9.]/g, '');
      Toastify({
          text: "Solo se permiten números positivos y un punto decimal.",
          background: "linear-gradient(to right, #FF9800, #F44336)",
         duration: 3000
      }).showToast();
    }
  });
});