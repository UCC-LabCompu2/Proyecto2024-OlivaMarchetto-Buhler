
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let positionY = 0;
const acceleration = 0.1;
const initialVelocity = 0;

document.querySelector('.calc-result').addEventListener('click', function() {

    const distance = parseFloat(document.getElementById('distance').value);
    // const velocity = parseFloat(document.getElementById('velocity').value);
    const time = parseFloat(document.getElementById('time').value);
  
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
