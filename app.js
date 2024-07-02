/**
 * Ajustar el tamaño del canvas
 * @method resizeCanvas
 */
const resizeCanvas = () => {
  const canvas = document.getElementById("myCanvas");

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
};

// Inicializa la posición y velocidad de la nave espacial
let positionY = 0;

/**
 * Mostrar un mensaje de toast
 * @method showToast
 * @param {string} text - El texto a mostrar
 */
const showToast = (text) => {
  Toastify({
    text: text,
    background: "linear-gradient(to right, #FF9800, #F44336)",
    duration: 3000,
  }).showToast();
};

/**
 * Listener en el botón de calcular con la función para calcular el input restante
 * @method calcResult
 */
const calcResult = () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  let distance = parseFloat(document.getElementById("distance").value);
  let velocity = parseFloat(document.getElementById("velocity").value);
  let time = parseFloat(document.getElementById("time").value);

  // Validar que se hayan completado exactamente 2 de los 3 campos
  const fields = [distance, velocity, time];
  const completedFields = fields.filter((field) => !isNaN(field));
  const greaterThanZeroFields = fields.filter((field) => field > 0);

  if (completedFields.length !== 2) {
    showToast("Debe completar exactamente 2 de los 3 campos.");
    return false;
  }

  if (greaterThanZeroFields.length !== 2) {
    showToast("Los valores deben ser mayores a cero.");
    return false;
  }

  // Calcular el campo faltante
  let missingField;
  if (isNaN(distance)) {
    missingField = velocity * time;
    document.getElementById("distance").value = missingField;
    distance = missingField;
  } else if (isNaN(velocity)) {
    missingField = distance / time;
    document.getElementById("velocity").value = missingField;
    velocity = missingField;
  } else {
    missingField = distance / velocity;
    document.getElementById("time").value = missingField;
    time = missingField;
  }

  positionY = 0;

  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Iniciar la animación
  requestAnimationFrame(animate);
};

/**
 * Función para animar la nave espacial
 * @method animate
 */
const animate = () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  const spaceship = new Image();
  spaceship.src = "./images/paracaidas-canvas.png"; // Ruta de la imagen de la nave espacial

  resizeCanvas();

  // Calcular la velocidad inicial
  const initialVelocity = parseFloat(document.getElementById("velocity").value);

  // Ajustar la velocidad inicial a la velocidad calculada
  if (!isNaN(initialVelocity)) {
    velocity = initialVelocity;
  }

  positionY += velocity;

  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar la escala
  drawScale();

  // Dibujar la nave espacial
  const spaceshipWidth = 225; // Ancho de la nave espacial
  const spaceshipHeight = 225; // Altura de la nave espacial
  const xPos = (canvas.width - spaceshipWidth) / 2;

  ctx.drawImage(spaceship, xPos, positionY, spaceshipWidth, spaceshipHeight);

  // Dibujar la flecha indicadora de velocidad
  const arrowSize = 20; // Tamaño de la flecha
  drawVelocityArrow(canvas.width / 2, positionY + spaceshipHeight, arrowSize);

  // Verificar si la nave aún está dentro del canvas
  if (positionY < canvas.height - spaceshipHeight) {
    // Continuar animando si no ha llegado al suelo
    requestAnimationFrame(animate);
  } else {
    // Detener la animación al llegar al suelo
    cancelAnimationFrame(null);
    document.getElementById("animate-button").style.display = "block";
  }
};

/**
 * Función para iniciar la animación de la nave espacial.
 * @function startAnimation
 */
const startAnimation = () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  document.getElementById("animate-button").style.display = "none";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  positionY = 0;
  velocity = 0;
  animate();
};

/**
 * Función para dibujar la flecha indicadora de velocidad
 * @method drawVelocityArrow
 * @param {number} x - Coordenada x de la flecha
 * @param {number} y - Coordenada y de la flecha
 * @param {number} size - Tamaño de la flecha
 */
const drawVelocityArrow = (x, y, size) => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - size / 2, y - size);
  ctx.lineTo(x + size / 2, y - size);
  ctx.closePath();
  ctx.fillStyle = "#FF5722"; // Color rojo para la flecha indicadora
  ctx.fill();

  // Mostrar el valor de la velocidad
  ctx.font = "12px Arial";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.fillText(
      `Velocidad: ${velocity.toFixed(2)} ${unitInit}/${
          unitInit == "km" ? "h" : "s"
      }`,
      x,
      y - size - 5
  );
};

/**
 * Función para dibujar la escala
 * @method drawScale
 */
const drawScale = () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  const scaleHeight = 20; // Altura de la escala
  const numLabels = 5; // Número de etiquetas en la escala
  const startY = canvas.height * 0.99; // Posición inicial de la escala (con margen)
  const endY = 0; // Posición final de la escala
  const deltaY = (startY - endY) / (numLabels - 1); // Espacio entre etiquetas

  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";

  for (let i = 0; i < numLabels; i++) {
    const distanceValue = parseFloat(document.getElementById("distance").value);
    const label = (distanceValue / (numLabels - 1)) * i;
    const yPos = startY - deltaY * i;
    ctx.beginPath();
    ctx.moveTo(canvas.width - scaleHeight, yPos);
    ctx.lineTo(canvas.width, yPos);
    ctx.stroke();
    ctx.fillText(
        label.toFixed(2) + unitInit,
        canvas.width - scaleHeight - 60,
        yPos + 5
    ); // Ajuste para dejar espacio entre el texto y el borde del canvas
  }
};

// Unidad de medida inicial
let unitInit = "km";

/**
 * Función para convertir unidades
 * @method convertUnits
 * @param {number} value - El valor a convertir
 * @param {string} currentUnit - La unidad actual del valor
 * @param {string} targetUnit - La unidad a la que se desea convertir
 * @param {string} conversionType - El tipo de conversión (distance, time, velocity)
 * @return {number} El valor convertido
 */
const convertUnits = (value, currentUnit, targetUnit, conversionType) => {
  // Definir factores de conversión para distancia, tiempo y velocidad
  const conversionFactors = {
    m: {
      distance: { km: 0.001, m: 1 },
      time: { km: 1 / 3600, m: 1 / 60 },
      velocity: { km: 3.6, m: 1 },
    },
    km: {
      distance: { m: 1000, km: 1 },
      time: { m: 3600, km: 1 },
      velocity: { m: 1 / 3.6, km: 1 },
    },
  };

  // Realizar la conversión
  const conversionFactor =
      conversionFactors[currentUnit][conversionType][targetUnit];
  const convertedValue = value * conversionFactor;

  return convertedValue;
};

/**
 * Listener para el cambio de unidades en el select
 * @method unitConverterChange
 */
const unitConverterChange = () => {
  // Obtener los valores actuales de los inputs
  const distanceValue = parseFloat(document.getElementById("distance").value);
  const timeValue = parseFloat(document.getElementById("time").value);
  const velocityValue = parseFloat(document.getElementById("velocity").value);

  // Obtener la unidad de medida a la que se desea convertir
  const convertUnit = document.getElementById("unit-converter").value;

  // Validar que los valores sean válidos
  if (
      isNaN(distanceValue) ||
      isNaN(timeValue) ||
      isNaN(velocityValue) ||
      distanceValue === 0 ||
      timeValue === 0 ||
      velocityValue === 0
  ) {
    unitInit = convertUnit;

    showToast("Por favor, ingrese valores válidos para la conversión.");
    return false;
  }

  // Convertir los valores a la nueva unidad
  const convertedDistance = convertUnits(
      distanceValue,
      unitInit,
      convertUnit,
      "distance"
  );
  const convertedTime = convertUnits(timeValue, unitInit, convertUnit, "time");
  const convertedVelocity = convertUnits(
      velocityValue,
      unitInit,
      convertUnit,
      "velocity"
  );

  // Actualizar el valor de unitInit para guardar su estado cuando el select cambie nuevamente
  unitInit = convertUnit;

  // Actualizar los valores de los inputs
  document.getElementById("distance").value = convertedDistance.toFixed(2);
  document.getElementById("time").value = convertedTime.toFixed(2);
  document.getElementById("velocity").value = convertedVelocity.toFixed(2);
};

/**
 * Función de validación
 * @method validateInput
 * @param {Event} event - El evento de keypress o de paste
 */
const validateInput = (event) => {
  const input = event.target;
  const key = event.key || (event.clipboardData || window.clipboardData).getData("text");
  const newValue = input.value + key;
  value = input.value;

  // Verificar si la tecla presionada es una letra o símbolo (excepto punto decimal y backspace)
  if (!/[0-9.]/.test(key) && key !== "Backspace") {
    event.preventDefault();
    showToast("Solo se permiten números y un punto decimal.");
    return false;
  }

  // Permitir solo un punto decimal en el valor
  if (key === "." && value.includes(".")) {
    event.preventDefault();
    showToast("Solo se permite un punto decimal.");
    return false;
  }

  // Limitar el valor a 8 caracteres
  if (newValue.length > 8) {
    event.preventDefault();
    showToast("El valor no puede tener más de 8 dígitos.");
    return false;
  }
};

/**
 * Función para manejar eventos de input.
 * @function handleInput
 * @param {Event} event - El evento de input.
 */
const handleInput = (event) => {
  const value = event.target.value;
  const regex = /^[0-9]*\.?[0-9]*$/;
  if (!regex.test(value)) {
    event.target.value = value.replace(/[^0-9.]/g, "");
    showToast("Solo se permiten números positivos y un punto decimal.");
    return false;
  }
};
