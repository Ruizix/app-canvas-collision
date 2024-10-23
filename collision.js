const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.speed = speed;
    this.isColliding = false;
    this.collideFrames = 0; // Contador de frames de colisión
    this.dx = 1 * this.speed;
    this.dy = 1 * this.speed;
  }
  
  draw(context) {
    context.beginPath();
    // Flashea en azul si está en colisión y hay frames restantes
    context.strokeStyle = (this.isColliding || this.collideFrames > 0) ? "#0000FF" : this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.lineWidth = 4;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update(context) {
    this.draw(context);
    
    // Si hay frames de colisión, decrementar el contador
    if (this.collideFrames > 0) {
      this.collideFrames--;
    }
    
    // Actualizar la posición X
    this.posX += this.dx;
    // Cambiar la dirección si el círculo llega al borde del canvas en X
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }
    // Actualizar la posición Y
    this.posY += this.dy;
    // Cambiar la dirección si el círculo llega al borde del canvas en Y
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
    }
  }
}

// Crear un array para almacenar N círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random()*16777215).toString(16)}`; // Color aleatorio
    let speed = Math.random() * 2 + 1; // Velocidad entre 1 y 3
    let text = `C${i + 1}`; // Etiqueta del círculo
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

// Función para animar los círculos
function animate() {
  ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas

  checkCollisions(circles);  // Verificar colisiones entre los círculos

  circles.forEach(circle => {
    circle.update(ctx); // Actualizar cada círculo
  });
  requestAnimationFrame(animate); // Repetir la animación
}

// Detectar colisión entre dos círculos
function detectCollision(circle1, circle2) {
  const dx = circle1.posX - circle2.posX;
  const dy = circle1.posY - circle2.posY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < circle1.radius + circle2.radius;
}

// Colisiones de cada círculo
function checkCollisions(circles) {
  for (let i = 0; i < circles.length; i++) {
    circles[i].isColliding = false; // Reiniciar estado de colisión
    for (let j = i + 1; j < circles.length; j++) {
      if (detectCollision(circles[i], circles[j])) {
        circles[i].isColliding = true;
        circles[j].isColliding = true;

        // Ajustar la dirección de los círculos en colisión
        circles[i].dx = -circles[i].dx;
        circles[i].dy = -circles[i].dy;
        circles[j].dx = -circles[j].dx;
        circles[j].dy = -circles[j].dy;

        // Establecer el número de frames que durará el flash azul
        circles[i].collideFrames = 20; // Cambia este valor para ajustar la duración
        circles[j].collideFrames = 20; // Cambia este valor para ajustar la duración
      }
    }
  }
}

// Detectar si el clic del mouse está dentro de un círculo
function isInsideCircle(circle, mouseX, mouseY) {
  const dx = mouseX - circle.posX;
  const dy = mouseY - circle.posY;
  return Math.sqrt(dx * dx + dy * dy) < circle.radius;
}

// Evento para eliminar el círculo al hacer clic
canvas.addEventListener("click", function(event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // Buscar el círculo en el que se hizo clic y eliminarlo
  circles = circles.filter(circle => !isInsideCircle(circle, mouseX, mouseY));
});

// Generar N círculos y comenzar la animación
generateCircles(10); // Puedes cambiar el número de círculos aquí
animate();
